import { CommandModule } from "yargs";
import { createDeploymentCommand } from "./create";
import { listDeploymentsCommand } from "./list";

export const deploymentsCommand: CommandModule<{}, any> = {
	command: "deployments [subcommand]",
	describe: "Create and view a build's deployment configurations at runtime",
	builder(yargs) {
		return yargs
			.demandCommand(1, "Please specify a subcommand")
			.command(createDeploymentCommand)
			.command(listDeploymentsCommand)
			.help();
	},
	handler: () => {},
};
