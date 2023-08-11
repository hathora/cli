import { CommandModule } from "yargs";
import { ERROR_MESSAGES } from "../../util/errors";
import { ResponseError } from "../../../sdk-client";
import { getAppApiClient } from "../../util/getClient";

export const listAppsCommand: CommandModule<
	{},
	{
		raw: boolean | undefined;
		fields: string;
		token: string;
	}
> = {
	command: "list",
	describe: "List of your organization’s applications",
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
		token: {
			type: "string",
			demandOption: true,
			describe: "Hathora developer token (required only for CI environments)",
		},

	},
	handler: async (args) => {
		const client = getAppApiClient(args.token);
		try {
			let response = await client.getApps();
			if (args.raw) {
				console.log(JSON.stringify(response));
			} else {
				console.table(response, args.fields.split(","));
			}
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
