import { existsSync } from "fs";
import { join } from "path";

export function findUp(
	file: string,
	dir: string = process.cwd()
): string | undefined {
	if (existsSync(join(dir, file))) {
		return dir;
	}
	const parentDir = join(dir, "..");
	if (parentDir === dir) {
		return undefined;
	}
	return findUp(file, parentDir);
}
