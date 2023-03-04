import { CommandModule } from "yargs";
import { getAuthToken } from "../../util/getAuthToken";
import { ERROR_MESSAGES } from "../../util/errors";
import { getApiClient } from "../../util/getClient";
import { ResponseError } from "../../../sdk-client";

export const listAppsCommand: CommandModule<
	{},
	{
		raw: boolean | undefined;
		fields: string;
	}
> = {
	command: "list",
	describe: "list apps",
	builder: {
		raw: {
			type: "boolean",
			demandOption: false,
			describe: "Show unformatted response",
		},
		fields: {
			type: "string",
			demandOption: false,
			describe: "Show only the specified fields (comma separated)",
			default: "appName,appId,createdAt",
		},
	},
	handler: async (args) => {
		const authenticationToken = await getAuthToken();
		const client = getApiClient(authenticationToken);
		try {
			let response = await client.getApps();
			if (args.raw) {
				console.log(response);
			} else {
				console.table(response, args.fields.split(","));
			}
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
