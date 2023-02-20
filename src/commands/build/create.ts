import { CommandModule } from "yargs";
import { getAuthToken } from "../../util/getAuthToken";
import { ERROR_MESSAGES } from "../../util/errors";
import { getApiClient } from "../../util/getClient";
import { Deployment, ResponseError } from "../../../sdk-client";
import { stat } from "fs/promises";
import { createReadStream } from "fs";
import { createTar } from "../../util/createTar";

export const createBuildCommand: CommandModule<
	{},
	{
		appId: string;
		file: string;
	}
> = {
	command: "build create",
	describe: "list deployments for an app",
	builder: {
		appId: {
			type: "string",
			demandOption: true,
			describe: "Id of the app",
		},
		file: {
			type: "string",
			describe: "path to the tgz archive to deploy",
		},
	},
	handler: async (args) => {
		const authenticationToken = await getAuthToken();
		const client = getApiClient(authenticationToken);
		try {
			const response = await client.createBuild({
				appId: args.appId,
			});

			if (args.file && !(await stat(args.file)).isFile()) {
				return ERROR_MESSAGES.FILE_NOT_FOUND(args.file);
			}

			const fileContents =
				args.file === undefined ? createTar() : createReadStream(args.file);
			const buildResponse = await client.runBuildRaw({
				appId: args.appId,
				buildId: response.buildId,
				// @ts-expect-error
				file: fileContents, // readable stream works with the form-data package but the generated sdk wants a blob.
			});
			let body = buildResponse.raw.body!;
			body["pipe"](process.stdout);
			await buildResponse.value();
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
