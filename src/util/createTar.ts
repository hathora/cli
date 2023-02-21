import { findUp } from "./findUp";
import tar from "tar";
import { Readable } from "stream";
export async function createTar() {
	const rootDir = findUp("hathora.yml");
	if (!rootDir) {
		throw new Error("Could not find hathora.yml");
	}
	// @ts-ignore
	tar.create(
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
	);
}
