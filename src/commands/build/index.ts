import { CommandModule } from "yargs";
import { createBuildCommand } from "./create";

export const buildCommand: CommandModule<{}, any> = {
	command: "builds [subcommand]",
	describe: "Manage or create builds",
	builder(yargs) {
		return yargs.command(createBuildCommand).help();
	},
	handler: () => {},
};
