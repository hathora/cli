import chalk from "chalk";
type getArgs<T extends string> = T extends `${string}%s${infer R}`
	? [string, ...getArgs<R>]
	: [];

function replaceAll(str: string, args: string[]) {
	let i = 0;
	return str.replace(/%s/g, () => args[i++] || "%s");
}

export function errorMessageHandlerFactory<T extends string>(
	message: T,
	code: number = 1
) {
	return (...args: getArgs<T>) => {
		console.log(chalk.red(replaceAll(message, args)));
		process.exit(code);
	};
}
export namespace ERROR_MESSAGES {
	export const NOT_AUTHENTICATED = errorMessageHandlerFactory(
		"To peform this operation you must first authenticate with Hathora Cloud. Please run `hathora login` to do so."
	);
	export const TOKEN_FILE_NOT_FOUND = errorMessageHandlerFactory(
		"Token file not found, please run `hathora login` to authenticate."
	);
	export const RESPONSE_ERROR = errorMessageHandlerFactory(
		"Got Response Code %s: %s"
	);
}
