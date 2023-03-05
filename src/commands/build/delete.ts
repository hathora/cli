import { CommandModule } from "yargs";
import { getAuthToken } from "../../util/getAuthToken";
import { ERROR_MESSAGES } from "../../util/errors";
import { getApiClient } from "../../util/getClient";
import { ResponseError } from "../../../sdk-client";

export const buildDeleteCommand: CommandModule<
	{},
	{ appId: string; buildId: number }
> = {
	command: "delete",
	describe: "Delete an app",
	builder: {
		appId: {
			type: "string",
			demandOption: true,
			describe: "Name of the app",
		},
		buildId: {
			type: "number",
			demandOption: true,
			describe: "Build ID",
		},
	},
	handler: async (args) => {
		const authenticationToken = await getAuthToken();
		const client = getApiClient(authenticationToken);
		try {
			await client.deleteBuild({
				appId: args.appId,
				buildId: args.buildId,
			});
			console.log("Build deleted");
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
