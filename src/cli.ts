/* Copyright 2023 Hathora, Inc. */
import { join } from "path";
import { homedir } from "os";
import { existsSync, readFileSync } from "fs";

import { hideBin } from "yargs/helpers";
import yargs, { MiddlewareFunction } from "yargs";
import chalk from "chalk";

import packageFile from "../package.json" assert { type: "json" };

import { roomCommand } from "./commands/room/index.js";
import { processesCommand } from "./commands/processes/index.js";
import { loginCommand } from "./commands/login.js";
import { logAllCommand } from "./commands/log.js";
import { deploymentsCommand } from "./commands/deployments/index.js";
import { deployCommand } from "./commands/deploy.js";
import { buildCommand } from "./commands/build/index.js";
import { appsCommand } from "./commands/apps/index.js";

const tokenMiddleware: MiddlewareFunction = (argv) => {
	if (argv._[0] === "login" || "token" in argv) {
		return;
	}

	const tokenFile = join(homedir(), ".config", "hathora", "token");
	if (!existsSync(tokenFile)) {
		console.log(chalk.redBright(`Missing token file, run ${chalk.underline("hathora-cloud login")} first`));
		return;
	}

	argv.token = readFileSync(tokenFile).toString();
};

const { version } = packageFile;

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
	.command(deployCommand)
	.command(logAllCommand)
	.command(processesCommand)
	.command(deploymentsCommand)
	.command(buildCommand)
	.command(roomCommand)
	.help()
	.parse();
