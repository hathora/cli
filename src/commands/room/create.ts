import { CommandModule } from "yargs";
import { ERROR_MESSAGES } from "../../util/errors";
import { getRoomApiClient } from "../../util/getClient";
import { Region, ResponseError } from "../../../sdk-client";

export const roomCreateCommand: CommandModule<
	{},
	{ appId: string; region: Region; token: string }
> = {
	command: "create",
	describe: "Create a new room",
	builder: {
		appId: {
			type: "string",
			demandOption: true,
			describe: "System generated unique identifier for an application",
		},
		region: {
			type: "string",
			demandOption: true,
			describe: "Region to create the room in",
			choices: Object.values(Region),
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
			const room = await client.createRoom({
				appId: args.appId,
				createRoomParams: { region: args.region },
			});
			console.log(JSON.stringify(room));
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
