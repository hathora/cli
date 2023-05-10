import { CommandModule } from "yargs";
import { ERROR_MESSAGES } from "../../util/errors";
import { client } from "../../../sdk-client";
import { stat } from "fs/promises";
import { createReadStream, ReadStream } from "fs";
import { createTar } from "../../util/createTar";
import { readStreamToBytes } from "../../util/readStreamToBytes";
import { AxiosError } from "axios";

export const createBuildCommand: CommandModule<
	{},
	{
		appId: string;
		file: string;
		token: string;
	}
> = {
	command: "create",
	describe: "create a build",
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
		token: { type: "string", demandOption: true, hidden: true },
	},
	handler: async (args) => {
		try {
			if (args.file && !(await stat(args.file)).isFile()) {
				return ERROR_MESSAGES.FILE_NOT_FOUND(args.file);
			}

			const createResponse = await client.builds.create(
				{
					auth0: `Bearer ${args.token}`,
				},
				args.appId
			);

			switch (createResponse.statusCode) {
				case 201:
					console.log(`Build created with id ${createResponse.build?.buildId}`);
					break;
				case 404:
					ERROR_MESSAGES.RESPONSE_ERROR(
						createResponse.statusCode.toString(),
						createResponse.createBuild404ApplicationJSONString
					);
					break;
				case 500:
					ERROR_MESSAGES.RESPONSE_ERROR(
						createResponse.statusCode.toString(),
						createResponse.createBuild500ApplicationJSONString
					);
					break;
				case 422:
					ERROR_MESSAGES.RESPONSE_ERROR(
						createResponse.statusCode.toString(),
						createResponse.createBuild422ApplicationJSONString
					);
					break;
				default:
					ERROR_MESSAGES.RESPONSE_ERROR(
						createResponse.statusCode.toString(),
						createResponse.rawResponse?.statusText
					);
			}

			const fileContents =
				args.file === undefined
					? await createTar()
					: createReadStream(args.file);

			const file = args.file ?? ((fileContents as ReadStream).path as string);

			const buildResponse = await client.builds.run(
				{
					auth0: `Bearer ${args.token}`,
				},
				{
					file: {
						file: file,
						content: await readStreamToBytes(fileContents as ReadStream),
					},
				},
				args.appId,
				createResponse.build?.buildId
			);

			switch (buildResponse.statusCode) {
				case 200:
					console.log(
						`File ${file} uploaded for build ${createResponse.build?.buildId}`
					);
					break;
				case 404:
					ERROR_MESSAGES.RESPONSE_ERROR(
						buildResponse.statusCode.toString(),
						buildResponse.runBuild404ApplicationJSONString
					);
					break;
				case 500:
					ERROR_MESSAGES.RESPONSE_ERROR(
						buildResponse.statusCode.toString(),
						buildResponse.runBuild500ApplicationJSONString
					);
					break;
				default:
					ERROR_MESSAGES.RESPONSE_ERROR(
						buildResponse.statusCode.toString(),
						buildResponse.rawResponse?.statusText
					);
			}
		} catch (e) {
			if (e instanceof AxiosError) {
				ERROR_MESSAGES.UNKNOWN_ERROR(e.message);
			}
		}
	},
};
