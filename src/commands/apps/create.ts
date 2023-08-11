import { CommandModule } from "yargs";
import { ERROR_MESSAGES } from "../../util/errors";
import { ResponseError } from "../../../sdk-client";
import { getAppApiClient } from "../../util/getClient";

export const appCreateCommand: CommandModule<
	{},
	{ appName: string; token: string }
> = {
	command: "create",
	describe: "Create a new application",
	builder: {
		appName: {
			type: "string",
			demandOption: true,
			describe: "Readable name for an application. Must be unique within an organization",
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
			const response = await client.createApp({
				appConfig: {
					appName: args.appName,
					authConfiguration: {
						anonymous: {},
					},
				},
			});
			console.log(JSON.stringify(response));
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
