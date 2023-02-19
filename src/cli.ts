import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// hathora login

import { loginCommand } from "./commands/login";

// hathora list deployments --appId 123

import { appCreateCommand } from "./commands/app/create";

// hathora deploy --appId 123 --file ./test.zip

import { deployCommand } from "./commands/deploy";

import { roomCreateCommand } from "./commands/room/create";

import { roomConnectionInfoCommand } from "./commands/room/connect";

import { logAllCommand } from "./commands/log";
import { listDeploymentsCommand } from "./commands/deployments/list";
import { listProcessesCommand } from "./commands/processes/list";
import { createDeploymentCommand } from "./commands/deployments/create";
import { createBuildCommand } from "./commands/build/create";

yargs(hideBin(process.argv))
	.scriptName("hathora")
	.demandCommand()
	.recommendCommands()
	.completion()
	.usage("Usage: $0 <command> [options]")
	.command(loginCommand)
	.command(appCreateCommand)
	.command(deployCommand)
	.command(logAllCommand)
	.command(createBuildCommand)
	.command(createDeploymentCommand)
	.command(listDeploymentsCommand)
	.command(listProcessesCommand)
	.command(roomCreateCommand)
	.command(roomConnectionInfoCommand)
	.help()
	.parse();
