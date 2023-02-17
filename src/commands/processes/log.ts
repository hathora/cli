import { CommandModule } from "yargs";
import { getAuthToken } from "../../util/getAuthToken";
import { ERROR_MESSAGES } from "../../util/errors";
import { getApiClient } from "../../util/getClient";
import { ResponseError } from "../../../sdk-client";

export const logProcessCommand: CommandModule<
	{},
	{
		appId: string;
		processId: string;
		follow: boolean | undefined;
		timestamps: boolean | undefined;
		tailLines: number | undefined;
	}
> = {
	command: "processes logs",
	describe: "create a deployment for an app",
	builder: {
		appId: {
			type: "string",
			demandOption: true,
			describe: "Id of the app",
		},
		processId: {
			type: "string",
			demandOption: true,
			describe: "Id of the process",
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
	},
	handler: async (args) => {
		const authenticationToken = await getAuthToken();
		const client = getApiClient(authenticationToken);
		try {
			let response = await client.getLogsForProcessRaw({
				appId: args.appId,
				follow: args.follow,
				timestamps: args.timestamps,
				tailLines: args.tailLines,
				processId: args.processId,
			});

			let body = response.raw.body!;
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
