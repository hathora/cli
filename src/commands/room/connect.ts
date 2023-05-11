/* Copyright 2023 Hathora, Inc. */
import { CommandModule } from "yargs";

import { getRoomApiClient } from "../../util/getClient.js";
import { ERROR_MESSAGES } from "../../util/errors.js";
import { ResponseError } from "../../../sdk-client/index.js";

export const roomConnectionInfoCommand: CommandModule<object, { appId: string; roomId: string; token: string }> = {
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
		const client = getRoomApiClient(args.token);
		try {
			const connectionInfo = await client.getConnectionInfo({
				appId: args.appId,
				roomId: args.roomId,
			});
			console.log(connectionInfo);
		} catch (e) {
			if (e instanceof ResponseError) {
				ERROR_MESSAGES.RESPONSE_ERROR(e.response.status.toString(), e.response.statusText);
			}
			throw e;
		}
	},
};
