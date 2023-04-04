import { CommandModule } from "yargs";
import { ERROR_MESSAGES } from "../util/errors";
import { getApiClient } from "../util/getClient";
import { ResponseError } from "../../sdk-client";
import { stat } from "fs/promises";
import { createReadStream } from "fs";
import { createTar } from "../util/createTar";

export const deployCommand: CommandModule<
	{},
	{
		appId: string;
		file: string;
		roomsPerProcess: number;
		planName: "tiny" | "small" | "medium" | "large";
		transportType: "tcp" | "udp" | "tls";
		containerPort: number;
		token: string;
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
		token: { type: "string", demandOption: true, hidden: true },
	},
	handler: async (args) => {
		const client = getApiClient(args.token);
		try {
			const response = await client.createBuild({
				appId: args.appId,
			});

			if (args.file && !(await stat(args.file)).isFile()) {
				return ERROR_MESSAGES.FILE_NOT_FOUND(args.file);
			}

			const fileContents =
				args.file === undefined
					? await createTar()
					: createReadStream(args.file);
			const buildResponse = await client.runBuildRaw({
				appId: args.appId,
				buildId: response.buildId,
				// @ts-expect-error
				file: fileContents, // readable stream works with the form-data package but the generated sdk wants a blob.
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
