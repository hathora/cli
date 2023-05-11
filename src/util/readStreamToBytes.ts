import { ReadStream } from "fs";
import { unlink } from "fs/promises";

export async function readStreamToBytes(
	readStream: ReadStream
): Promise<Uint8Array> {
	return new Promise((resolve, reject) => {
		const chunks: Buffer[] = [];
		readStream.on("data", (chunk: Buffer) => {
			chunks.push(chunk);
		});
		readStream.on("close", () => {
			const output = new Uint8Array(readStream.bytesRead);
			let byteOffset = 0;
			for (const chunk of chunks) {
				output.set(chunk, byteOffset);
				byteOffset += chunk.length;
			}
			resolve(output);
		});
		readStream.on("error", (err) => {
			reject(err);
		});
	});
}
