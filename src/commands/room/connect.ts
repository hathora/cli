import { CommandModule } from "yargs";
import { ERROR_MESSAGES } from "../../util/errors";
import { client } from "../../../sdk-client";
import { AxiosError } from "axios";

export const roomConnectionInfoCommand: CommandModule<
	{},
	{ appId: string; roomId: string; token: string }
> = {
	command: "connection-info",
	describe: "get connection info for a room",
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
		token: { type: "string", demandOption: true, hidden: true },
	},
	handler: async (args) => {
		try {
			const response = await client.rooms.getConnectionInfo(
				args.appId,
				args.roomId
			);

			switch (response.statusCode) {
				case 200:
					console.log(response.connectionInfo);
					break;
				case 400:
					ERROR_MESSAGES.RESPONSE_ERROR(
						response.statusCode.toString(),
						response.getConnectionInfo400ApplicationJSONString
					);
					break;
				case 404:
					ERROR_MESSAGES.RESPONSE_ERROR(
						response.statusCode.toString(),
						response.getConnectionInfo404ApplicationJSONString
					);
					break;
				case 500:
					ERROR_MESSAGES.RESPONSE_ERROR(
						response.statusCode.toString(),
						response.getConnectionInfo500ApplicationJSONString
					);
					break;
				default:
					ERROR_MESSAGES.RESPONSE_ERROR(
						response.statusCode.toString(),
						response.rawResponse?.statusText
					);
			}
		} catch (e) {
			if (e instanceof AxiosError) {
				ERROR_MESSAGES.UNKNOWN_ERROR(e.message);
			}
		}
	},
};
