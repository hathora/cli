/* Copyright 2023 Hathora, Inc. */
import { CommandModule } from "yargs";

import { listDeploymentsCommand } from "./list";
import { createDeploymentCommand } from "./create";

export const deploymentsCommand: CommandModule<{}, any> = {
	command: "deployments [subcommand]",
	describe: "Manage or create deployments",
	builder(yargs) {
		return yargs
			.demandCommand(1, "Please specify a subcommand")
			.command(createDeploymentCommand)
			.command(listDeploymentsCommand)
			.help();
	},
	handler: () => {},
};
