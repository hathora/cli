/* Copyright 2023 Hathora, Inc. */
import { CommandModule } from "yargs";

import { getAppApiClient } from "../../util/getClient";
import { ERROR_MESSAGES } from "../../util/errors";
import { ResponseError } from "../../../sdk-client";

export const appCreateCommand: CommandModule<{}, { appName: string; token: string }> = {
	command: "create",
	describe: "Create a new app",
	builder: {
		appName: {
			type: "string",
			demandOption: true,
			describe: "Name of the app",
		},
		token: { type: "string", demandOption: true, hidden: true },
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
			console.log(response);
		} catch (e) {
			if (e instanceof ResponseError) {
				ERROR_MESSAGES.RESPONSE_ERROR(e.response.status.toString(), e.response.statusText);
			}
			throw e;
		}
	},
};
