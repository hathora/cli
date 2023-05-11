/* Copyright 2023 Hathora, Inc. */
import { CommandModule } from "yargs";

import { listBuildsCommand } from "./list.js";
import { buildDeleteCommand } from "./delete.js";
import { createBuildCommand } from "./create.js";

export const buildCommand: CommandModule<object, any> = {
	command: "builds [subcommand]",
	describe: "Manage or create builds",
	builder(yargs) {
		return yargs
			.command(createBuildCommand)
			.command(listBuildsCommand)
			.command(buildDeleteCommand)
			.demandCommand(1, "Please specify a subcommand")
			.help();
	},
	handler: () => {
		// do nothing
	},
};
