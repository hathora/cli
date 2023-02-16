import { CommandModule } from "yargs";
import { getAuthToken } from "../util/getAuthToken";
import { ERROR_MESSAGES } from "../util/errors";
import { getApiClient } from "../util/getClient";
import { ResponseError, DeploymentConfig } from "../../sdk-client";
import { readFile, stat } from "fs/promises";
import { Blob } from "node-fetch";
import { createReadStream } from "fs";
function loadDeploymentConfig(): DeploymentConfig {
	// TODO: load from file
	return {
		env: [],
		roomsPerProcess: 3,
		planName: "medium",
		transportType: "tls",
		containerPort: 4000,
	};
}
export const deployCommand: CommandModule<
	{},
	{
		appId: string;
		file: string;
		roomsPerProcess: number;
		planName: "tiny" | "small" | "medium" | "large";
		transportType: "tcp" | "udp" | "tls";
		containerPort: number;
	}
> = {
	command: "deploy",
	describe: "create a deployment for an app",
	builder: {
		appId: {
			type: "string",
			demandOption: true,
			describe: "Id of the app",
		},
		file: {
			type: "string",
			demandOption: true,
			describe: "path to the tgz archive to deploy",
		},
		roomsPerProcess: {
			type: "number",
			demandOption: true,
			describe: "number of rooms per process",
		},
		planName: {
			type: "string",
			demandOption: true,
			choices: ["tiny", "small", "medium", "large"],
			describe: "plan name",
		},
		transportType: {
			type: "string",
			demandOption: true,
			choices: ["tcp", "udp", "tls"],
			describe: "transport type",
		},
		containerPort: {
			type: "number",
			demandOption: true,
			describe: "port the container listens to",
		},
	},
	handler: async (args) => {
		const authenticationToken = await getAuthToken();
		const client = getApiClient(authenticationToken);
		try {
			const response = await client.createBuild({
				appId: args.appId,
			});

			if (!(await stat(args.file)).isFile()) {
				return ERROR_MESSAGES.FILE_NOT_FOUND(args.file);
			}
			const fileContents = createReadStream(args.file);
			// const b = new Blob([fileContents]);
			const buildResponse = await client.runBuildRaw({
				appId: args.appId,
				buildId: response.buildId,
				file: fileContents as any,
			});
			let body = buildResponse.raw.body!;
			body["pipe"](process.stdout);

			await buildResponse.value();

			console.log("Creating deployment...");
			const deployment = await client.createDeployment({
				appId: args.appId,
				buildId: response.buildId,
				deploymentConfig: {
					roomsPerProcess: args.roomsPerProcess,
					planName: args.planName,
					transportType: args.transportType,
					containerPort: args.containerPort,
					env: [],
				},
			});
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
					e.response.statusText
				);
			}
			throw e;
		}
	},
};
