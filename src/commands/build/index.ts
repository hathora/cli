import { CommandModule } from "yargs";
import { createBuildCommand } from "./create";
import { buildDeleteCommand } from "./delete";
import { listBuildsCommand } from "./list";

export const buildCommand: CommandModule<{}, any> = {
	command: "builds [subcommand]",
	describe: "Operations that allow you create and manage your build",
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
