import { CommandModule } from "yargs";
import { getAuthToken } from "../util/getAuthToken";
import { ERROR_MESSAGES } from "../util/errors";
import { getApiClient } from "../util/getClient";
import { Region, ResponseError } from "../../sdk-client";

export const logAllCommand: CommandModule<
	{},
	{
		appId: string;
		follow: boolean | undefined;
		timestamps: boolean | undefined;
		tailLines: number | undefined;
		region: Region | undefined;
		processId: string | undefined;
		deploymentId: string | undefined;
	}
> = {
	command: "logs",
	describe: "create a deployment for an app",
	builder: {
		appId: {
			type: "string",
			demandOption: true,
			describe: "Id of the app",
		},
		follow: {
			type: "boolean",
			demandOption: false,
			describe: "follow logs",
		},
		timestamps: {
			type: "boolean",
			demandOption: false,
			describe: "show timestamps",
		},
		tailLines: {
			type: "number",
			demandOption: false,
			describe: "number of lines to show",
		},
		region: {
			type: "string",
			demandOption: false,
			choices: Object.values(Region),
			describe: "region",
		},
		processId: {
			type: "string",
			demandOption: false,
			describe: "Id of the process (exclusive with deploymentId)",
		},
		deploymentId: {
			type: "number",
			demandOption: false,
			describe: "Id of the deployment (exclusive with processId)",
		},
	},
	handler: async (args) => {
		const authenticationToken = await getAuthToken();
		const client = getApiClient(authenticationToken);
		try {
			let fn:
				| typeof client.getAllLogsRaw
				| typeof client.getLogsForDeploymentRaw
				| typeof client.getLogsForProcessRaw =
				client.getAllLogsRaw.bind(client);

			let request: any = {
				appId: args.appId,
				follow: args.follow,
				timestamps: args.timestamps,
				tailLines: args.tailLines,
				region: args.region,
			};
			if (args.processId !== undefined) {
				fn = client.getLogsForProcessRaw.bind(client);
				request.processId = args.processId;
			} else if (args.deploymentId !== undefined) {
				fn = client.getLogsForDeploymentRaw.bind(client);
				request.deploymentId = args.deploymentId;
			}
			let respone = await fn(request);

			let body = respone.raw.body!;
			body["pipe"](process.stdout);
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
