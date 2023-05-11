/* Copyright 2023 Hathora, Inc. */
import { CommandModule } from "yargs";

import { listProcessesCommand } from "./list";

export const processesCommand: CommandModule<{}, any> = {
	command: "processes [subcommand]",
	describe: "Manage a specific process",
	builder(yargs) {
		return yargs.command(listProcessesCommand).demandCommand(1, "Please specify a subcommand").help();
	},
	handler: () => {},
};
