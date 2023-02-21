import { CommandModule } from "yargs";
import { listProcessesCommand } from "./list";

export const processesCommand: CommandModule<{}, any> = {
	command: "processes [subcommand]",
	describe: "Manage a specific process",
	builder(yargs) {
		return yargs.command(listProcessesCommand);
	},
	handler: () => {},
};
