import { CommandModule } from "yargs";
import { ERROR_MESSAGES } from "../../util/errors";
import { getDeploymentApiClient } from "../../util/getClient";
import { ResponseError } from "../../../sdk-client";

export const createDeploymentCommand: CommandModule<
	{},
	{
		appId: string;
		roomsPerProcess: number;
		planName: "tiny" | "small" | "medium" | "large";
		transportType: "tcp" | "udp" | "tls";
		containerPort: number;
		buildId: number;
		env: string;
		token: string;
	}
> = {
	command: "create",
	describe: "create a deployment",
	builder: {
		buildId: {
			type: "number",
			demandOption: true,
			describe: "Id of the build",
		},
		appId: {
			type: "string",
			demandOption: true,
			describe: "Id of the app",
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
		env: {
			type: "string",
			demandOption: true,
			describe:
				"JSON stringified version of env variables array (name and value)",
		},
		token: { type: "string", demandOption: true, hidden: true },
	},
	handler: async (args) => {
		const client = getDeploymentApiClient(args.token);
		try {
			const deployment = await client.createDeployment({
				appId: args.appId,
				buildId: args.buildId,
				deploymentConfig: {
					roomsPerProcess: args.roomsPerProcess,
					planName: args.planName,
					transportType: args.transportType,
					containerPort: args.containerPort,
					env: JSON.parse(args.env),
				},
			});
			console.log(deployment);
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
