import { CommandModule } from "yargs";
import { ERROR_MESSAGES } from "../util/errors";
import { getLogApiClient } from "../util/getClient";
import { Region, ResponseError } from "../../sdk-client";

export const logAllCommand: CommandModule<
	{},
	{
		appId: string;
		processId: string;
		follow: boolean | undefined;
		tailLines: number | undefined;
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
		tailLines: {
			type: "number",
			demandOption: false,
			describe: "Number of lines to return from most recent logs history",
		},
		processId: {
			type: "string",
			demandOption: true,
			describe:
				"System generated unique identifier to a runtime instance of your game server",
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
			const respone = await client.getLogsForProcessRaw({
				appId: args.appId,
				processId: args.processId,
				follow: args.follow,
				tailLines: args.tailLines,
			});
			const body = respone.raw.body!;
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
