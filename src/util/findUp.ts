/* Copyright 2023 Hathora, Inc. */
import { join } from "path";
import { existsSync } from "fs";

export function findUp(file: string, dir: string = process.cwd()): string | undefined {
	if (existsSync(join(dir, file))) {
		return dir;
	}
	const parentDir = join(dir, "..");
	if (parentDir === dir) {
		return undefined;
	}
	return findUp(file, parentDir);
}
