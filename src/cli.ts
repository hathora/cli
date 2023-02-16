import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// hathora login

import { loginCommand } from "./commands/login";

// hathora list deployments --appId 123

import { appCreateCommand } from "./commands/app/create";

// hathora deploy --appId 123 --file ./test.zip

import { deployCommand } from "./commands/deploy";

import { roomCreateCommand } from "./commands/room/create";

yargs(hideBin(process.argv))
	.scriptName("hathora")
	.demandCommand()
	.recommendCommands()
	.completion()
	.usage("Usage: $0 <command> [options]")
	.command(loginCommand)
	.command(appCreateCommand)
	.command(deployCommand)
	.command(roomCreateCommand)
	.help()
	.parse();
