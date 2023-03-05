import { CommandModule } from "yargs";
import { appCreateCommand } from "./create";
import { appDeleteCommand } from "./delete";
import { listAppsCommand } from "./list";

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
