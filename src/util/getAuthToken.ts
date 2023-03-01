import { join } from "path";
import os from "os";
import { stat, readFile } from "fs/promises";
import { ERROR_MESSAGES } from "./errors";

export async function getAuthToken(
	onError: (error: Error) => void = ERROR_MESSAGES.NOT_AUTHENTICATED
) {
	const tokenPath = join(os.homedir(), ".config", "hathora", "token");
	if (!(await stat(tokenPath)).isFile()) {
		let error = new Error("Token file not found");
		onError(error);
		// if onError doesn't throw, we throw here
		throw error;
	}
	return await readFile(tokenPath, "utf-8");
}
