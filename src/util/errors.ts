/* Copyright 2023 Hathora, Inc. */
import chalk from "chalk";

type getArgs<T extends string> =
	// check if it has a %s in it
	// if it does, then we need to get the args for the rest of the string
	// if it doesn't, then we don't need any more args
	T extends `${string}%s${infer R}` ? [string, ...getArgs<R>] : [];

function replaceAll(str: string, args: string[]) {
	let i = 0;
	return str.replace(/%s/g, () => args[i++] || "%s");
}

export function errorMessageHandlerFactory<T extends string>(message: T, code = 1) {
	return (...args: getArgs<T>) => {
		console.log(chalk.red(replaceAll(message, args)));
		process.exit(code);
	};
}
export const ERROR_MESSAGES = {
	NOT_AUTHENTICATED: errorMessageHandlerFactory(
		"To peform this operation you must first authenticate with Hathora Cloud. Please run `hathora login` to do so."
	),
	TOKEN_FILE_NOT_FOUND: errorMessageHandlerFactory("Token file not found, please run `hathora login` to authenticate."),
	RESPONSE_ERROR: errorMessageHandlerFactory("Got Response Code %s: %s"),
	FILE_NOT_FOUND: errorMessageHandlerFactory("File not found: %s"),
	INVALID_REGION: errorMessageHandlerFactory("Unknown region: %s, expected one of: %s"),
	UNKNOWN_ERROR: errorMessageHandlerFactory("An unknown error occurred: %s"),
};
