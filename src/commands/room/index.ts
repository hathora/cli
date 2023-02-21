import { CommandModule } from "yargs";
import { roomCreateCommand } from "./create";
import { roomConnectionInfoCommand } from "./connect";

export const roomCommand: CommandModule<{}, any> = {
	command: "room [subcommand]",
	describe: "manage or create rooms",
	builder(yargs) {
		return yargs.command(roomCreateCommand).command(roomConnectionInfoCommand);
	},
	handler: () => {},
};
