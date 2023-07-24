import { findUp } from "./findUp";
import tar from "tar";
import ignore from "@balena/dockerignore";
import { createReadStream, createWriteStream, readFileSync } from "fs";
import { mkdtemp, unlink } from "fs/promises";
import { join, sep } from "path";
import { tmpdir } from "os";

export async function createTar() {
	const rootDir = findUp("Dockerfile");
	if (!rootDir) {
		throw new Error("Could not find Dockerfile");
	}

	const ig = ignore().add(
		readFileSync(join(rootDir, ".dockerignore")).toString()
	);

	const tmpDir = tmpdir();
	const tempDir = await mkdtemp(`${tmpDir}${sep}`);
	const fileLocation = join(tempDir, "bundle.tgz");
	const outputStream = createWriteStream(fileLocation);
	tar
		.create(
			{
				cwd: rootDir,
				gzip: true,
				filter: (path) => !ig.ignores(path),
			},
			["."]
		)
		.pipe(outputStream);
	return new Promise((resolve, reject) => {
		outputStream.on("finish", () => {
			const readStream = createReadStream(fileLocation);
			readStream
				.on("error", (err) => {
					unlink(fileLocation);
					reject(err);
				})
				.on("close", () => {
					unlink(fileLocation);
				});
			resolve(readStream);
		});
		outputStream.on("error", (err) => {
			reject(err);
		});
	});
}
