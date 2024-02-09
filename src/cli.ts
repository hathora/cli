import yargs, { MiddlewareFunction } from "yargs";
import { hideBin } from "yargs/helpers";
import { loginCommand } from "./commands/login";
import { deployCommand } from "./commands/deploy";
import { roomCommand } from "./commands/room";
import { logAllCommand } from "./commands/log";
import { processesCommand } from "./commands/processes";
import { deploymentsCommand } from "./commands/deployments";
import { buildCommand } from "./commands/build";
import { appsCommand } from "./commands/apps";
import { version } from "../package.json";
import chalk from "chalk";
import { join } from "path";
import { existsSync, readFileSync } from "fs";
import { homedir } from "os";
import { Issuer } from "openid-client";
import { jwtDecode } from "jwt-decode";

const tokenMiddleware: MiddlewareFunction = async (argv) => {
	if (argv._[0] === "login" || "token" in argv) {
		return;
	}

	const tokenFile = join(homedir(), ".config", "hathora", "token");
	if (!existsSync(tokenFile)) {
		printLoginPromptMessage("Missing token file");
		return;
	}

	const token = readFileSync(tokenFile).toString();

	// If the token is too short, it's not a JWT but a refresh token so we want to force a login
	if (token.length < 100) {
		printLoginPromptMessage("Your token has expired");
		return;
	}
	try {
		const decodedToken = jwtDecode(token);
		const expirationDate = new Date((decodedToken.exp ?? 0) * 1000);
		if (expirationDate < new Date()) {
			printLoginPromptMessage("Your token has expired");
			return;
		}
	} catch (e) {
		printLoginPromptMessage("Your token is invalid");
		return;
	}

	argv.token = token;
};

function printLoginPromptMessage(reason: string) {
	console.log(
		chalk.redBright(
			`${reason}, run ${chalk.underline(
				"hathora-cloud login"
			)} first`
		)
	);
}

// Needed to get the correct terminal width
// https://github.com/yargs/yargs/blob/main/docs/typescript.md
const yargsInstance = yargs(hideBin(process.argv))

yargsInstance.version(version)
	.scriptName("hathora-cloud")
	.middleware(tokenMiddleware, true)
	.demandCommand(1, "Please specify a command")
	.recommendCommands()
	.completion()
	.usage("Usage: $0 <command> [options]")
	.command(loginCommand)
	.command(appsCommand)
	.command(deployCommand)
	.command(logAllCommand)
	.command(processesCommand)
	.command(deploymentsCommand)
	.command(buildCommand)
	.command(roomCommand)
	.wrap(yargsInstance.terminalWidth())
	.help()
	.parse();
