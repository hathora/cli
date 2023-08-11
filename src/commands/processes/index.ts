import { CommandModule } from "yargs";
import { listProcessesCommand } from "./list";

export const processesCommand: CommandModule<{}, any> = {
	command: "processes [subcommand]",
	describe: "Operations to manage a process",
	builder(yargs) {
		return yargs
			.command(listProcessesCommand)
			.demandCommand(1, "Please specify a subcommand")
			.help();
	},
	handler: () => {},
};
