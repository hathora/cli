import { CommandModule } from "yargs";
import { ERROR_MESSAGES } from "../../util/errors";
import { ResponseError } from "../../../sdk-client";
import { getBuildApiClient } from "../../util/getClient";

export const buildDeleteCommand: CommandModule<
	{},
	{ appId: string; buildId: number; token: string }
> = {
	command: "delete",
	describe: "Delete a build for an existing application",
	builder: {
		appId: {
			type: "string",
			demandOption: true,
			describe: "System generated unique identifier for an application",
		},
		buildId: {
			type: "number",
			demandOption: true,
			describe: "System generated id for a build. Increments by 1",
		},
		token: {
			type: "string",
			demandOption: true,
			describe: "Hathora developer token (required only for CI environments)",
		},

	},
	handler: async (args) => {
		const client = getBuildApiClient(args.token);
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
					e.response.statusText,
					await e.response.text()
				);
			}
			throw e;
		}
	},
};
