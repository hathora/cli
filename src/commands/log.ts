import { CommandModule } from "yargs";
import { ERROR_MESSAGES } from "../util/errors";
import { getLogApiClient } from "../util/getClient";
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
		token: string;
	}
> = {
	command: "logs",
	describe: "Returns a stream of logs for an application",
	builder: {
		appId: {
			type: "string",
			demandOption: true,
			describe: "System generated unique identifier for an application",
		},
		follow: {
			type: "boolean",
			demandOption: false,
			describe: "Stream logs in realtime.",
		},
		timestamps: {
			type: "boolean",
			demandOption: false,
			describe: "show timestamps",
		},
		tailLines: {
			type: "number",
			demandOption: false,
			describe: "Number of lines to return from most recent logs history",
		},
		region: {
			type: "string",
			demandOption: false,
			choices: Object.values(Region),
			describe: "Region",
		},
		processId: {
			type: "string",
			demandOption: false,
			describe: "System generated unique identifier to a runtime instance of your game server",
		},
		deploymentId: {
			type: "number",
			demandOption: false,
			describe: "System generated id for a deployment. Increments by 1",
		},
		token: {
			type: "string",
			demandOption: true,
			describe: "Hathora developer token (required only for CI environments)",
		},

	},
	handler: async (args) => {
		const client = getLogApiClient(args.token);
		try {
			let fn:
				| typeof client.getLogsForAppRaw
				| typeof client.getLogsForDeploymentRaw
				| typeof client.getLogsForProcessRaw =
				client.getLogsForAppRaw.bind(client);

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
					e.response.statusText,
					await e.response.text()
				);
			}
			throw e;
		}
	},
};
