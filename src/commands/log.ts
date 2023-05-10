import { CommandModule } from "yargs";
import { ERROR_MESSAGES } from "../util/errors";
import { client } from "../../sdk-client";
import { RegionEnum } from "@speakeasy-sdks/hc-sdk/dist/sdk/models/shared";
import * as operations from "@speakeasy-sdks/hc-sdk/dist/sdk/models/operations";
import { AxiosError } from "axios";

export const logAllCommand: CommandModule<
	{},
	{
		appId: string;
		follow?: boolean;
		timestamps?: boolean;
		tailLines?: number;
		region?: RegionEnum;
		processId?: string;
		deploymentId?: string;
		token: string;
	}
> = {
	command: "logs",
	describe: "view logs for an app/deployment/process",
	builder: {
		appId: {
			type: "string",
			demandOption: true,
			describe: "Id of the app",
		},
		follow: {
			type: "boolean",
			demandOption: false,
			describe: "follow logs",
		},
		timestamps: {
			type: "boolean",
			demandOption: false,
			describe: "show timestamps",
		},
		tailLines: {
			type: "number",
			demandOption: false,
			describe: "number of lines to show",
		},
		region: {
			type: "string",
			demandOption: false,
			choices: Object.values(RegionEnum),
			describe: "region",
		},
		processId: {
			type: "string",
			demandOption: false,
			describe: "Id of the process (exclusive with deploymentId)",
		},
		deploymentId: {
			type: "number",
			demandOption: false,
			describe: "Id of the deployment (exclusive with processId)",
		},
		token: { type: "string", demandOption: true, hidden: true },
	},
	handler: async (args) => {
		try {
			const { appId, follow, tailLines, region, processId, deploymentId } =
				args;

			let response:
				| operations.GetLogsForAppResponse
				| operations.GetLogsForDeploymentResponse
				| operations.GetLogsForProcessResponse;

			if (args.processId !== undefined) {
				response = await client.logs.getLogsForProcess(
					{
						auth0: `Bearer ${args.token}`,
					},
					appId,
					processId,
					follow,
					tailLines
				);
			} else if (args.deploymentId !== undefined) {
				response = await client.logs.getLogsForDeployment(
					{
						auth0: `Bearer ${args.token}`,
					},
					appId,
					Number(deploymentId),
					follow,
					tailLines
				);
			} else {
				response = await client.logs.getLogsForApp(
					{
						auth0: `Bearer ${args.token}`,
					},
					appId,
					follow,
					region,
					tailLines
				);
			}

			switch (response.statusCode) {
				case 200:
					if (response instanceof operations.GetLogsForProcessResponse) {
						console.log(response.getLogsForProcess200TextPlainByteString);
					} else if (
						response instanceof operations.GetLogsForDeploymentResponse
					) {
						console.log(response.getLogsForDeployment200TextPlainAny);
					} else {
						console.log(response.getLogsForApp200TextPlainByteString);
					}
					break;
				case 404:
					if (response instanceof operations.GetLogsForProcessResponse) {
						ERROR_MESSAGES.RESPONSE_ERROR(
							response.statusCode.toString(),
							response.getLogsForProcess404ApplicationJSONString
						);
					} else if (
						response instanceof operations.GetLogsForDeploymentResponse
					) {
						ERROR_MESSAGES.RESPONSE_ERROR(
							response.statusCode.toString(),
							response.getLogsForDeployment404ApplicationJSONString
						);
					} else {
						ERROR_MESSAGES.RESPONSE_ERROR(
							response.statusCode.toString(),
							response.getLogsForApp404ApplicationJSONString
						);
					}
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
