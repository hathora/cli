import { CommandModule } from "yargs";
import { ERROR_MESSAGES } from "../../util/errors";
import { client } from "../../../sdk-client";
import { AxiosError } from "axios";

export const appCreateCommand: CommandModule<
	{},
	{ appName: string; token: string }
> = {
	command: "create",
	describe: "Create a new app",
	builder: {
		appName: {
			type: "string",
			demandOption: true,
			describe: "Name of the app",
		},
		token: { type: "string", demandOption: true, hidden: true },
	},
	handler: async (args) => {
		try {
			const response = await client.apps.create(
				{
					appName: args.appName,
					authConfiguration: {
						anonymous: {},
					},
				},
				{
					auth0: `Bearer ${args.token}`,
				}
			);
			switch (response.statusCode) {
				case 201:
					console.log(response.application);
					break;
				case 422:
					ERROR_MESSAGES.RESPONSE_ERROR(
						response.statusCode.toString(),
						response.createApp422ApplicationJSONString
					);
					break;
				case 500:
					ERROR_MESSAGES.RESPONSE_ERROR(
						response.statusCode.toString(),
						response.createApp500ApplicationJSONString
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
