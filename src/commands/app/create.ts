import { CommandModule } from "yargs";
import { getAuthToken } from "../../util/getAuthToken";
import { ERROR_MESSAGES } from "../../util/errors";
import axios from "axios";
import { API_BASE } from "../../config/api";
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

		// const result = await axios
		// 	.post(
		// 		`${API_BASE}/apps/create`,
		// 		{
		// 			appName: args.appName,
		// 		},
		// 		{
		// 			headers: { Authorization: `Bearer ${authenticationToken}` },
		// 		}
		// 	)
		// 	.catch((err) => {
		// 		return err.response;
		// 	});
		// if (result.status === 200) {
		// 	console.log(result.data);
		// } else {
		// 	console.log(result.data);
		// }
	},
};
