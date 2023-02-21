import { CommandModule } from "yargs";
import { createDeploymentCommand } from "./create";
import { listDeploymentsCommand } from "./list";

export const deploymentsCommand: CommandModule<{}, any> = {
	command: "deployments [subcommand]",
	describe: "Manage or create deployments",
	builder(yargs) {
		return yargs
			.command(createDeploymentCommand)
			.command(listDeploymentsCommand);
	},
	handler: () => {},
};
