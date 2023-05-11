/* Copyright 2023 Hathora, Inc. */
import { CommandModule } from "yargs";

import { listBuildsCommand } from "./list";
import { buildDeleteCommand } from "./delete";
import { createBuildCommand } from "./create";

export const buildCommand: CommandModule<{}, any> = {
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
	handler: () => {},
};
