import { CommandModule } from "yargs";
import { roomCreateCommand } from "./create";
import { roomConnectionInfoCommand } from "./connect";

export const roomCommand: CommandModule<{}, any> = {
	command: "room [subcommand]",
	describe: "Operations to create, manage, and connect to rooms",
	builder(yargs) {
		return yargs
			.command(roomCreateCommand)
			.command(roomConnectionInfoCommand)
			.demandCommand(1, "Please specify a subcommand")
			.help();
	},
	handler: () => {},
};
