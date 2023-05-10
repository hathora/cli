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

const tokenMiddleware: MiddlewareFunction = (argv) => {
	if (argv._[0] === "login" || "token" in argv) {
		return;
	}

	const tokenFile = join(homedir(), ".config", "hathora", "token");
	if (!existsSync(tokenFile)) {
		console.log(
			chalk.redBright(
				`Missing token file, run ${chalk.underline(
					"hathora-cloud login"
				)} first`
			)
		);
		return;
	}

	argv.token = readFileSync(tokenFile).toString();
};

yargs(hideBin(process.argv))
	.version(version)
	.scriptName("hathora-cloud")
	.middleware(tokenMiddleware, true)
	.demandCommand(1, "Please specify a command")
	.recommendCommands()
	.completion()
	.usage("Usage: $0 <command> [options]")
	.command(loginCommand)
	.command(appsCommand)
	// .command(deployCommand)
	// .command(logAllCommand)
	// .command(processesCommand)
	// .command(deploymentsCommand)
	.command(buildCommand)
	// .command(roomCommand)
	.help()
	.parse();
