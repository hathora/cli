import { CommandModule } from "yargs";
import { ERROR_MESSAGES } from "../../util/errors";
import { client } from "../../../sdk-client";
import { RegionEnum } from "@speakeasy-sdks/hc-sdk/dist/sdk/models/shared";
import {
	GetRunningProcessesResponse,
	GetStoppedProcessesResponse,
} from "@speakeasy-sdks/hc-sdk/dist/sdk/models/operations";
import { AxiosError } from "axios";

export const listProcessesCommand: CommandModule<
	{},
	{
		appId: string;
		region?: RegionEnum;
		target: "running" | "stopped";
		raw?: boolean;
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
			choices: Object.values(RegionEnum),
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
		try {
			const response =
				args.target === "running"
					? await client.processes.getRunning(
							{
								auth0: `Bearer ${args.token}`,
							},
							args.appId,
							args.region
					  )
					: await client.processes.getStopped(
							{
								auth0: `Bearer ${args.token}`,
							},
							args.appId,
							args.region
					  );
			switch (response.statusCode) {
				case 200:
					const processes =
						args.target === "running"
							? (response as GetRunningProcessesResponse).processWithRooms
							: (response as GetStoppedProcessesResponse).processes;
					if (args.raw) {
						console.log(processes);
					} else {
						console.table(processes, args.fields.split(","));
					}
					break;
				case 404:
					const errResponse =
						args.target === "running"
							? (response as GetRunningProcessesResponse)
									.getRunningProcesses404ApplicationJSONString
							: (response as GetStoppedProcessesResponse)
									.getStoppedProcesses404ApplicationJSONString;
					ERROR_MESSAGES.RESPONSE_ERROR(
						response.statusCode.toString(),
						errResponse
					);
					break;
				default:
					ERROR_MESSAGES.RESPONSE_ERROR(
						response.statusCode.toString(),
						response.rawResponse?.statusText
					);
			}
		} catch (e) {
			if (e instanceof AxiosError) {
				ERROR_MESSAGES.UNKNOWN_ERROR(e.message);
			}
		}
	},
};
