/* Copyright 2023 Hathora, Inc. */
import { CommandModule } from "yargs";

import { listAppsCommand } from "./list";
import { appDeleteCommand } from "./delete";
import { appCreateCommand } from "./create";

export const appsCommand: CommandModule<{}, any> = {
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
	handler: () => {},
};
