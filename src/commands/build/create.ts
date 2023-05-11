/* Copyright 2023 Hathora, Inc. */
import { stat } from "fs/promises";
import { createReadStream } from "fs";

import { CommandModule } from "yargs";

import { getBuildApiClient } from "../../util/getClient";
import { ERROR_MESSAGES } from "../../util/errors";
import { createTar } from "../../util/createTar";
import { ResponseError } from "../../../sdk-client";

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
		const client = getBuildApiClient(args.token);
		try {
			if (args.file && !(await stat(args.file)).isFile()) {
				return ERROR_MESSAGES.FILE_NOT_FOUND(args.file);
			}

			const fileContents = args.file === undefined ? await createTar() : createReadStream(args.file);

			const createResponse = await client.createBuild({
				appId: args.appId,
			});
			const buildResponse = await client.runBuildRaw({
				appId: args.appId,
				buildId: createResponse.buildId,
				file: fileContents, // readable stream works with the form-data package but the generated sdk wants a blob.
			});
			const body = buildResponse.raw.body!;
			body.pipeThrough(process.stdout);
			await buildResponse.value();
		} catch (e) {
			if (e instanceof ResponseError) {
				ERROR_MESSAGES.RESPONSE_ERROR(e.response.status.toString(), e.response.statusText);
			}
			throw e;
		}
	},
};
