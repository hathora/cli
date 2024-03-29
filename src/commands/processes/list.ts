import { CommandModule } from "yargs";
import { ERROR_MESSAGES } from "../../util/errors";
import { getProcessesApiClient } from "../../util/getClient";
import { Region, ResponseError } from "../../../sdk-client";

export const listProcessesCommand: CommandModule<
	{},
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
	describe: "List all processes for an application",
	builder: {
		appId: {
			type: "string",
			demandOption: true,
			describe: "System generated unique identifier for an application",
		},
		region: {
			type: "string",
			demandOption: false,
			choices: Object.values(Region),
			describe: "Process region",
		},
		target: {
			type: "string",
			demandOption: false,
			describe: "Process status",
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
		token: {
			type: "string",
			demandOption: true,
			describe: "Hathora developer token (required only for CI environments)",
		},

	},
	handler: async (args) => {
		const client = getProcessesApiClient(args.token);
		try {
			const method =
				args.target === "running"
					? "getRunningProcesses"
					: "getStoppedProcesses";
			let response = await client[method]({
				appId: args.appId,
				region: args.region,
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
