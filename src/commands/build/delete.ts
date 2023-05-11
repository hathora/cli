/* Copyright 2023 Hathora, Inc. */
import { CommandModule } from "yargs";

import { getBuildApiClient } from "../../util/getClient.js";
import { ERROR_MESSAGES } from "../../util/errors.js";
import { ResponseError } from "../../../sdk-client/index.js";

export const buildDeleteCommand: CommandModule<object, { appId: string; buildId: number; token: string }> = {
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
		token: { type: "string", demandOption: true, hidden: true },
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
				ERROR_MESSAGES.RESPONSE_ERROR(e.response.status.toString(), e.response.statusText);
			}
			throw e;
		}
	},
};
