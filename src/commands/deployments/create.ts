import { CommandModule } from "yargs";
import { ERROR_MESSAGES } from "../../util/errors";
import { client } from "../../../sdk-client";
import {
	PlanNameEnum,
	TransportTypeEnum,
} from "@speakeasy-sdks/hc-sdk/dist/sdk/models/shared";
import { AxiosError } from "axios";

export const createDeploymentCommand: CommandModule<
	{},
	{
		appId: string;
		roomsPerProcess: number;
		planName: PlanNameEnum;
		transportType: TransportTypeEnum;
		containerPort: number;
		buildId: number;
		env: string;
		token: string;
	}
> = {
	command: "create",
	describe: "create a deployment",
	builder: {
		buildId: {
			type: "number",
			demandOption: true,
			describe: "Id of the build",
		},
		appId: {
			type: "string",
			demandOption: true,
			describe: "Id of the app",
		},
		roomsPerProcess: {
			type: "number",
			demandOption: true,
			describe: "number of rooms per process",
		},
		planName: {
			type: "string",
			demandOption: true,
			choices: ["tiny", "small", "medium", "large"],
			describe: "plan name",
		},
		transportType: {
			type: "string",
			demandOption: true,
			choices: ["tcp", "udp", "tls"],
			describe: "transport type",
		},
		containerPort: {
			type: "number",
			demandOption: true,
			describe: "port the container listens to",
		},
		env: {
			type: "string",
			demandOption: true,
			describe:
				"JSON stringified version of env variables array (name and value)",
		},
		token: { type: "string", demandOption: true, hidden: true },
	},
	handler: async (args) => {
		try {
			const response = await client.deployment.create(
				{
					auth0: `Bearer ${args.token}`,
				},
				{
					roomsPerProcess: args.roomsPerProcess,
					planName: args.planName,
					transportType: args.transportType,
					containerPort: args.containerPort,
					env: JSON.parse(args.env),
				},
				args.appId,
				args.buildId
			);

			switch (response.statusCode) {
				case 201:
					console.log(response.deployment);
					break;
				case 400:
					ERROR_MESSAGES.RESPONSE_ERROR(
						response.statusCode.toString(),
						response.createDeployment400ApplicationJSONString
					);
					break;
				case 404:
					ERROR_MESSAGES.RESPONSE_ERROR(
						response.statusCode.toString(),
						response.createDeployment404ApplicationJSONString
					);
					break;
				case 500:
					ERROR_MESSAGES.RESPONSE_ERROR(
						response.statusCode.toString(),
						response.createDeployment500ApplicationJSONString
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
