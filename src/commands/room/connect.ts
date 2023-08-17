import { CommandModule } from "yargs";
import { ERROR_MESSAGES } from "../../util/errors";
import { getRoomApiClient } from "../../util/getClient";
import { ResponseError } from "../../../sdk-client";

export const roomConnectionInfoCommand: CommandModule<
	{},
	{ appId: string; roomId: string; token: string }
> = {
	command: "connection-info",
	describe: "Get connection details to a room",
	builder: {
		appId: {
			type: "string",
			demandOption: true,
			describe: "System generated unique identifier for an application",
		},
		roomId: {
			type: "string",
			demandOption: true,
			describe: "Unique identifier to a game session or match",
		},
		token: {
			type: "string",
			demandOption: true,
			describe: "Hathora developer token (required only for CI environments)",
		},

	},
	handler: async (args) => {
		const client = getRoomApiClient(args.token);
		try {
			const connectionInfo = await client.getConnectionInfo({
				appId: args.appId,
				roomId: args.roomId,
			});
			console.log(JSON.stringify(connectionInfo));
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
