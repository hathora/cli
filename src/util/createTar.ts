import { findUp } from "./findUp";
import tar from "tar";
export function createTar() {
	const rootDir = findUp("hathora.yml");
	if (!rootDir) {
		throw new Error("Could not find hathora.yml");
	}
	return tar.create(
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
