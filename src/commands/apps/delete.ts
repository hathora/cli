/* Copyright 2023 Hathora, Inc. */
import { CommandModule } from "yargs";

import { getAppApiClient } from "../../util/getClient.js";
import { ERROR_MESSAGES } from "../../util/errors.js";
import { ResponseError } from "../../../sdk-client/index.js";

export const appDeleteCommand: CommandModule<object, { appId: string; token: string }> = {
	command: "delete",
	describe: "Delete an app",
	builder: {
		appId: {
			type: "string",
			demandOption: true,
			describe: "Name of the app",
		},
		token: { type: "string", demandOption: true, hidden: true },
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
				ERROR_MESSAGES.RESPONSE_ERROR(e.response.status.toString(), e.response.statusText);
			}
			throw e;
		}
	},
};
