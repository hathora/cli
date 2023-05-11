/* Copyright 2023 Hathora, Inc. */
import { CommandModule } from "yargs";

import { getApiClient } from "../../util/getClient";
import { ERROR_MESSAGES } from "../../util/errors";
import { ResponseError } from "../../../sdk-client";

export const roomConnectionInfoCommand: CommandModule<{}, { appId: string; roomId: string; token: string }> = {
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
		const client = getApiClient(args.token);
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
