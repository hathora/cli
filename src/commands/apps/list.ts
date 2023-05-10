import { CommandModule } from "yargs";
import { ERROR_MESSAGES } from "../../util/errors";
import { client } from "../../../sdk-client";
import { AxiosError } from "axios";

export const listAppsCommand: CommandModule<
	{},
	{
		raw: boolean | undefined;
		fields: string;
		token: string;
	}
> = {
	command: "list",
	describe: "list apps",
	builder: {
		raw: {
			type: "boolean",
			demandOption: false,
			describe: "Show unformatted response",
		},
		fields: {
			type: "string",
			demandOption: false,
			describe: "Show only the specified fields (comma separated)",
			default: "appName,appId,createdAt",
		},
		token: { type: "string", demandOption: true, hidden: true },
	},
	handler: async (args) => {
		try {
			const response = await client.apps.getApps({
				auth0: `Bearer ${args.token}`,
			});
			switch (response.statusCode) {
				case 200:
					if (args.raw) {
						console.log(response.applicationWithDeployments);
					} else {
						console.table(
							response.applicationWithDeployments,
							args.fields.split(",")
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
