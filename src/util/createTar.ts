import { findUp } from "./findUp";
import tar from "tar";
import { createReadStream, createWriteStream } from "fs";
import { mkdtemp, unlink } from "fs/promises";
import { join, sep } from "path";
import { tmpdir } from "os";
export async function createTar() {
	const rootDir = findUp("hathora.yml");
	if (!rootDir) {
		throw new Error("Could not find hathora.yml");
	}
	const tmpDir = tmpdir();
	const tempDir = await mkdtemp(`${tmpDir}${sep}`);
	const fileLocation = join(tempDir, "bundle.tgz");
	const outputStream = createWriteStream(fileLocation);
	tar
		.create(
			{
				cwd: rootDir,
				gzip: true,
				filter: (path) =>
					!path.startsWith("./api") &&
					!path.startsWith("./data") &&
					!path.startsWith("./client") &&
					!path.includes(".hathora") &&
					!path.includes("node_modules") &&
					!path.includes(".git"),
			},
			["."]
		)
		.pipe(outputStream);
	// .pipe(createWriteStream("test.tgz"));
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
