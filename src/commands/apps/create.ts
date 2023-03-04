import { CommandModule } from "yargs";
import { getAuthToken } from "../../util/getAuthToken";
import { ERROR_MESSAGES } from "../../util/errors";
import { getApiClient } from "../../util/getClient";
import { ResponseError } from "../../../sdk-client";

export const appCreateCommand: CommandModule<{}, { appName: string }> = {
	command: "app create",
	describe: "Create a new app",
	builder: {
		appName: {
			type: "string",
			demandOption: true,
			describe: "Name of the app",
		},
	},
	handler: async (args) => {
		const authenticationToken = await getAuthToken();
		const client = getApiClient(authenticationToken);
		try {
			const response = await client.createApp({
				createAppRequest: {
					appName: args.appName,
					authConfiguration: {
						anonymous: {},
					},
				},
			});
			console.log(response);
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
