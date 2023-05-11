/* Copyright 2023 Hathora, Inc. */
import { CommandModule } from "yargs";

import { getProcessesApiClient } from "../../util/getClient.js";
import { ERROR_MESSAGES } from "../../util/errors.js";
import { Region, ResponseError } from "../../../sdk-client/index.js";

export const listProcessesCommand: CommandModule<
	object,
	{
		appId: string;
		region: Region | undefined;
		target: "running" | "stopped";
		raw: boolean | undefined;
		fields: string;
		token: string;
	}
> = {
	command: "list",
	describe: "list processes for an app",
	builder: {
		appId: {
			type: "string",
			demandOption: true,
			describe: "Id of the app",
		},
		region: {
			type: "string",
			demandOption: false,
			choices: Object.values(Region),
			describe: "process region",
		},
		target: {
			type: "string",
			demandOption: false,
			describe: "process type",
			choices: ["running", "stopped"],
			default: "running",
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
			default: "processId,deploymentId,region,activeConnections",
		},
		token: { type: "string", demandOption: true, hidden: true },
	},
	handler: async (args) => {
		const client = getProcessesApiClient(args.token);
		try {
			const method = args.target === "running" ? "getRunningProcesses" : "getStoppedProcesses";
			const response = await client[method]({
				appId: args.appId,
				region: args.region,
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
