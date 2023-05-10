import { CommandModule } from "yargs";
import { ERROR_MESSAGES } from "../../util/errors";
import { client } from "../../../sdk-client";
import { AxiosError } from "axios";

export const appDeleteCommand: CommandModule<
	{},
	{ appId: string; token: string }
> = {
	command: "delete",
	describe: "Delete an app",
	builder: {
		appId: {
			type: "string",
			demandOption: true,
			describe: "Name of the app",
		},
		token: { type: "string", demandOption: true, hidden: true },
	},
	handler: async (args) => {
		try {
			const response = await client.apps.delete(
				{
					auth0: `Bearer ${args.token}`,
				},
				args.appId
			);
			console.log("response is: ", response);
			switch (response.statusCode) {
				case 204:
					console.log("App deleted");
					break;
				case 404:
					ERROR_MESSAGES.RESPONSE_ERROR(
						response.statusCode.toString(),
						response.deleteApp404ApplicationJSONString
					);
					break;
				case 500:
					ERROR_MESSAGES.RESPONSE_ERROR(
						response.statusCode.toString(),
						response.deleteApp500ApplicationJSONString
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
