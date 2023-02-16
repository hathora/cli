import { CommandModule } from "yargs";
import { getAuthToken } from "../../util/getAuthToken";
import { ERROR_MESSAGES } from "../../util/errors";
import { getApiClient } from "../../util/getClient";
import { ResponseError } from "../../../sdk-client";

export const roomConnectionInfoCommand: CommandModule<
	{},
	{ appId: string; roomId: string }
> = {
	command: "room connect",
	describe: "Connect to a room",
	builder: {
		appId: {
			type: "string",
			demandOption: true,
			describe: "Id of the app",
		},
		roomId: {
			type: "string",
			demandOption: true,
			describe: "Id of the room",
		},
	},
	handler: async (args) => {
		const authenticationToken = await getAuthToken();
		const client = getApiClient(authenticationToken);
		try {
			const connectionInfo = await client.getConnectionInfo({
				appId: args.appId,
				roomId: args.roomId,
			});
			console.log(connectionInfo);
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
