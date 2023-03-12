import { CommandModule } from "yargs";
import { getAuthToken } from "../../util/getAuthToken";
import { ERROR_MESSAGES } from "../../util/errors";
import { getApiClient } from "../../util/getClient";
import { Region, ResponseError } from "../../../sdk-client";

export const roomCreateCommand: CommandModule<
	{},
	{ appId: string; region: Region }
> = {
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
	},
	handler: async (args) => {
		const authenticationToken = await getAuthToken();
		const client = getApiClient(authenticationToken);
		try {
			const room = await client.createRoom({
				appId: args.appId,
				createRoomRequest: { region: args.region },
			});
			console.log(room);
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
