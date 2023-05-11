/* Copyright 2023 Hathora, Inc. */
import { CommandModule } from "yargs";

import { listAppsCommand } from "./list.js";
import { appDeleteCommand } from "./delete.js";
import { appCreateCommand } from "./create.js";

export const appsCommand: CommandModule<object, any> = {
	command: "apps [subcommand]",
	describe: "Manage or create apps",
	builder(yargs) {
		return yargs
			.command(appCreateCommand)
			.command(listAppsCommand)
			.command(appDeleteCommand)
			.demandCommand(1, "Please specify a subcommand")
			.help();
	},
	handler: () => {
		// do nothing
	},
};
