/* Copyright 2023 Hathora, Inc. */
import { CommandModule } from "yargs";

import { getBuildApiClient } from "../../util/getClient.js";
import { ERROR_MESSAGES } from "../../util/errors.js";
import { ResponseError } from "../../../sdk-client/index.js";

export const listBuildsCommand: CommandModule<
	object,
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
		token: { type: "string", demandOption: true, hidden: true },
	},
	handler: async (args) => {
		const client = getBuildApiClient(args.token);
		try {
			const response = await client.getBuilds({
				appId: args.appId,
			});
			if (args.raw) {
				console.log(response);
			} else {
				console.table(response, args.fields.split(","));
			}
		} catch (e) {
			if (e instanceof ResponseError) {
				ERROR_MESSAGES.RESPONSE_ERROR(e.response.status.toString(), e.response.statusText);
			}
			throw e;
		}
	},
};
