import { CommandModule } from "yargs";
import { getAuthToken } from "../../util/getAuthToken";
import { ERROR_MESSAGES } from "../../util/errors";
import { getApiClient } from "../../util/getClient";
import { Deployment, Region, ResponseError } from "../../../sdk-client";

export const listProcessesCommand: CommandModule<
	{},
	{
		appId: string;
		region: Region | undefined;
		target: "running" | "stopped";
		raw: boolean | undefined;
		fields: string;
	}
> = {
	command: "processes list",
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
	},
	handler: async (args) => {
		const authenticationToken = await getAuthToken();
		const client = getApiClient(authenticationToken);
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
				console.log(response);
			} else {
				console.table(response, args.fields.split(","));
			}
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
