import { CommandModule } from "yargs";
import { ERROR_MESSAGES } from "../../util/errors";
import { client } from "../../../sdk-client";
import { RegionEnum } from "@speakeasy-sdks/hc-sdk/dist/sdk/models/shared";
import { AxiosError } from "axios";

export const roomCreateCommand: CommandModule<
	{},
	{ appId: string; region: RegionEnum; token: string }
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
			choices: Object.values(RegionEnum),
		},
		token: { type: "string", demandOption: true, hidden: true },
	},
	handler: async (args) => {
		try {
			const response = await client.rooms.create(
				{
					auth0: `Bearer ${args.token}`,
				},
				{ region: args.region },
				args.appId
			);
			switch (response.statusCode) {
				case 201:
					console.log(`Room created with id ${response.roomId}`);
					break;
				case 400:
					ERROR_MESSAGES.RESPONSE_ERROR(
						response.statusCode.toString(),
						response.createRoom400ApplicationJSONString
					);
					break;
				case 404:
					ERROR_MESSAGES.RESPONSE_ERROR(
						response.statusCode.toString(),
						response.createRoom404ApplicationJSONString
					);
					break;
				case 500:
					ERROR_MESSAGES.RESPONSE_ERROR(
						response.statusCode.toString(),
						response.createRoom500ApplicationJSONString
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
