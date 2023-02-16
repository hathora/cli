import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// hathora login

import { loginCommand } from "./commands/login";

// hathora list deployments --appId 123

import { appCreateCommand } from "./commands/app/create";

yargs(hideBin(process.argv))
	.scriptName("hathora")
	.demandCommand()
	.recommendCommands()
	.completion()
	.usage("Usage: $0 <command> [options]")
	.command(loginCommand)
	.command(appCreateCommand)

	.help()

	.parse();
