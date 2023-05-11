/* Copyright 2023 Hathora, Inc. */
import { CommandModule } from "yargs";

import { getRoomApiClient } from "../../util/getClient.js";
import { ERROR_MESSAGES } from "../../util/errors.js";
import { Region, ResponseError } from "../../../sdk-client/index.js";

export const roomCreateCommand: CommandModule<object, { appId: string; region: Region; token: string }> = {
	command: "create",
	describe: "Create a new room",
	builder: {
		appId: {
			type: "string",
			demandOption: true,
			describe: "Id of the app",
		},
		region: {
			type: "string",
			demandOption: true,
			describe: "Region to create the room in",
			choices: Object.values(Region),
		},
		token: { type: "string", demandOption: true, hidden: true },
	},
	handler: async (args) => {
		const client = getRoomApiClient(args.token);
		try {
			const room = await client.createRoom({
				appId: args.appId,
				createRoomRequest: { region: args.region },
			});
			console.log(room);
		} catch (e) {
			if (e instanceof ResponseError) {
				ERROR_MESSAGES.RESPONSE_ERROR(e.response.status.toString(), e.response.statusText);
			}
			throw e;
		}
	},
};
