import { CommandModule } from "yargs";
import { ERROR_MESSAGES } from "../../util/errors";
import { client } from "../../../sdk-client";
import { AxiosError } from "axios";

export const buildDeleteCommand: CommandModule<
	{},
	{ appId: string; buildId: number; token: string }
> = {
	command: "delete",
	describe: "Delete an app",
	builder: {
		appId: {
			type: "string",
			demandOption: true,
			describe: "Name of the app",
		},
		buildId: {
			type: "number",
			demandOption: true,
			describe: "Build ID",
		},
		token: { type: "string", demandOption: true, hidden: true },
	},
	handler: async (args) => {
		try {
			const response = await client.builds.delete(
				{
					auth0: `Bearer ${args.token}`,
				},
				args.appId,
				args.buildId
			);

			switch (response.statusCode) {
				case 204:
					console.log("Build deleted");
					break;
				case 404:
					ERROR_MESSAGES.RESPONSE_ERROR(
						response.statusCode.toString(),
						response.deleteBuild404ApplicationJSONString
					);
					break;
				case 422:
					ERROR_MESSAGES.RESPONSE_ERROR(
						response.statusCode.toString(),
						response.deleteBuild422ApplicationJSONString
					);
					break;
				case 500:
					ERROR_MESSAGES.RESPONSE_ERROR(
						response.statusCode.toString(),
						response.deleteBuild500ApplicationJSONString
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
