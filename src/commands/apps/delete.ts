import { CommandModule } from "yargs";
import { ERROR_MESSAGES } from "../../util/errors";
import { ResponseError } from "../../../sdk-client";
import { getAppApiClient } from "../../util/getClient";

export const appDeleteCommand: CommandModule<
	{},
	{ appId: string; token: string }
> = {
	command: "delete",
	describe: "Delete an application. Your organization will lose access to this application",
	builder: {
		appId: {
			type: "string",
			demandOption: true,
			describe: "System generated unique identifier for an application",
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
			await client.deleteApp({
				appId: args.appId,
			});
			console.log("App deleted");
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
