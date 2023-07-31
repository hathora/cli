import { ArgumentsCamelCase, CommandModule } from "yargs";
import { ERROR_MESSAGES } from "../../util/errors";
import { Build, ResponseError } from "../../../sdk-client";
import { stat } from "fs/promises";
import { createReadStream } from "fs";
import { createTar } from "../../util/createTar";
import { getBuildApiClient } from "../../util/getClient";

export const createBuild = async (
	args: ArgumentsCamelCase<{
		appId: string;
		file: string;
		token: string;
		buildTag?: string;
	}>
): Promise<number> => {
	const client = getBuildApiClient(args.token);
	try {
		if (args.file && !(await stat(args.file)).isFile()) {
			return ERROR_MESSAGES.FILE_NOT_FOUND(args.file);
		}

		const fileContents =
			args.file === undefined ? await createTar() : createReadStream(args.file);

		const createResponse = await client.createBuild({
			appId: args.appId,
			createBuildRequest: { buildTag: args.buildTag },
		});
		const buildResponse = await client.runBuildRaw({
			appId: args.appId,
			buildId: createResponse.buildId,
			file: fileContents, // readable stream works with the form-data package but the generated sdk wants a blob.
		});
		let body = buildResponse.raw.body!;
		body["pipe"](process.stdout);
		await buildResponse.value();
		return createResponse.buildId;
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
};

export const createBuildCommand: CommandModule<
	{},
	{
		appId: string;
		file: string;
		token: string;
		buildTag: string;
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
		buildTag: {
			type: "string",
			demandOption: false,
			describe: "The build tag for the build",
		},
		file: {
			type: "string",
			describe: "path to the tgz archive to deploy",
		},
		token: {
			type: "string",
			demandOption: true,
			describe: "Hathora developer token (required only for CI environments)",
		},
	},
	handler: async (args) => {
		const buildId = await createBuild(args);
		console.log(`Build created with id ${buildId}`);
	},
};
