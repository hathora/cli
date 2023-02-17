import { CommandModule } from "yargs";
import { getAuthToken } from "../../util/getAuthToken";
import { ERROR_MESSAGES } from "../../util/errors";
import { getApiClient } from "../../util/getClient";
import { ResponseError } from "../../../sdk-client";

export const logDeploymentCommand: CommandModule<
	{},
	{
		appId: string;
		deploymentId: number;
		follow: boolean | undefined;
		timestamps: boolean | undefined;
		tailLines: number | undefined;
	}
> = {
	command: "deployments logs",
	describe: "create a deployment for an app",
	builder: {
		appId: {
			type: "string",
			demandOption: true,
			describe: "Id of the app",
		},
		deploymentId: {
			type: "number",
			demandOption: true,
			describe: "Id of the deployment",
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
	},
	handler: async (args) => {
		const authenticationToken = await getAuthToken();
		const client = getApiClient(authenticationToken);
		try {
			let response = await client.getLogsForDeploymentRaw({
				appId: args.appId,
				follow: args.follow,
				timestamps: args.timestamps,
				tailLines: args.tailLines,
				deploymentId: args.deploymentId,
			});

			let body = response.raw.body!;
			body["pipe"](process.stdout);
			const v = await response.value();
			console.log(typeof v, v.length);
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
