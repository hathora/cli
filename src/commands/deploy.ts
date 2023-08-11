import { CommandModule } from "yargs";
import { ERROR_MESSAGES } from "../util/errors";
import { ResponseError } from "../../sdk-client";
import { createDeployment } from "./deployments/create";
import { createBuild } from "./build/create";

export const deployCommand: CommandModule<
	{},
	{
		appId: string;
		token: string;
		file: string;
		roomsPerProcess?: number;
		planName?: "tiny" | "small" | "medium" | "large";
		transportType?: "tcp" | "udp" | "tls";
		containerPort?: number;
		env?: string;
		buildId?: number;
	}
> = {
	command: "deploy",
	describe: "create a deployment for an app",
	builder: {
		appId: {
			type: "string",
			demandOption: true,
			describe: "System generated unique identifier for an application",
		},
		file: {
			type: "string",
			describe: "Path to the tgz archive to deploy",
		},
		roomsPerProcess: {
			type: "number",
			describe: "Governs how many rooms can be scheduled in a process",
		},
		planName: {
			type: "string",
			choices: ["tiny", "small", "medium", "large"],
			describe: "A plan defines how much CPU and memory is required to run an instance of your game server",
		},
		transportType: {
			type: "string",
			choices: ["tcp", "udp", "tls"],
			describe: "Specifies the underlying communication protocol to the exposed port",
		},
		containerPort: {
			type: "number",
			describe: "Port the container listens on",
		},
		env: {
			type: "string",
			describe:
				"JSON stringified version of env variables array (name and value)",
		},
		token: {
			type: "string",
			demandOption: true,
			describe: "Hathora developer token (required only for CI environments)",
		},
	},
	handler: async (args) => {
		try {
			const buildId = await createBuild(args);
			args.buildId = buildId;
			console.log("Creating deployment...");
			const deployment = await createDeployment(args);
			console.log(
				"Deployment created! (deployment id: " +
				deployment.deploymentId +
				",build id: " +
				deployment.buildId +
				")"
			);
			// console.log(deployment);

			// ?.pipeTo(process.stdout);
		} catch (e) {
			if (e instanceof ResponseError) {
				ERROR_MESSAGES.RESPONSE_ERROR(
					e.response.status.toString(),
					e.response.statusText,
					await e.response.text()
				);
			}
			throw e;
		}
	},
};
