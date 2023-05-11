/* Copyright 2023 Hathora, Inc. */
import { CommandModule } from "yargs";

import { roomCreateCommand } from "./create.js";
import { roomConnectionInfoCommand } from "./connect.js";

export const roomCommand: CommandModule<object, any> = {
	command: "room [subcommand]",
	describe: "manage or create rooms",
	builder(yargs) {
		return yargs
			.command(roomCreateCommand)
			.command(roomConnectionInfoCommand)
			.demandCommand(1, "Please specify a subcommand")
			.help();
	},
	handler: () => {
		// do nothing
	},
};
