/* Copyright 2023 Hathora, Inc. */

import { join, sep } from "path";
import { tmpdir } from "os";
import { mkdtemp, unlink } from "fs/promises";
import { createReadStream, createWriteStream } from "fs";

import tar from "tar";

import { findUp } from "./findUp.js";

export async function createTar() {
	const rootDir = findUp("Dockerfile");
	if (!rootDir) {
		throw new Error("Could not find Dockerfile");
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
				filter: (path) => !path.includes("node_modules") && !path.includes(".git"),
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
