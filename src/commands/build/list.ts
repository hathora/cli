import { CommandModule } from "yargs";
import { ERROR_MESSAGES } from "../../util/errors";
import { getBuildApiClient } from "../../util/getClient";
import { ResponseError } from "../../../sdk-client";

export const listBuildsCommand: CommandModule<
	{},
	{
		appId: string;
		raw: boolean | undefined;
		fields: string;
		token: string;
	}
> = {
	command: "list",
	describe: "list builds for an app",
	builder: {
		appId: {
			type: "string",
			demandOption: true,
			describe: "Id of the app",
		},
		raw: {
			type: "boolean",
			demandOption: false,
			describe: "Show unformatted response",
		},
		fields: {
			type: "string",
			demandOption: false,
			describe: "Show only the specified fields (comma separated)",
			default: "buildId,createdAt,createdBy,status",
		},
		token: {
			type: "string",
			demandOption: true,
			describe: "Hathora developer token (required if not present in the config file)",
		},

	},
	handler: async (args) => {
		const client = getBuildApiClient(args.token);
		try {
			let response = await client.getBuilds({
				appId: args.appId,
			});
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
