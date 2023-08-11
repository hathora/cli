import { CommandModule } from "yargs";
import { createDeploymentCommand } from "./create";
import { listDeploymentsCommand } from "./list";

export const deploymentsCommand: CommandModule<{}, any> = {
	command: "deployments [subcommand]",
	describe: "Operations that allow you configure and manage an application's build at runtime",
	builder(yargs) {
		return yargs
			.demandCommand(1, "Please specify a subcommand")
			.command(createDeploymentCommand)
			.command(listDeploymentsCommand)
			.help();
	},
	handler: () => {},
};
