import { CommandModule } from "yargs";
import { ERROR_MESSAGES } from "../../util/errors";
import { client } from "../../../sdk-client";
import { AxiosError } from "axios";

export const listDeploymentsCommand: CommandModule<
	{},
	{
		appId: string;
		raw: boolean | undefined;
		fields: string;
		token: string;
	}
> = {
	command: "list",
	describe: "list deployments for an app",
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
			default: "deploymentId,createdAt,createdBy,buildId",
		},
		token: { type: "string", demandOption: true, hidden: true },
	},
	handler: async (args) => {
		try {
			const response = await client.deployment.getDeployments(
				{
					auth0: `Bearer ${args.token}`,
				},
				args.appId
			);

			switch (response.statusCode) {
				case 200:
					if (args.raw) {
						console.log(response.deployments);
					} else {
						console.table(response.deployments, args.fields.split(","));
					}
					break;
				case 404:
					ERROR_MESSAGES.RESPONSE_ERROR(
						response.statusCode.toString(),
						response.getDeployments404ApplicationJSONString
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
