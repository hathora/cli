import { ArgumentsCamelCase, CommandModule } from "yargs";
import { ERROR_MESSAGES } from "../../util/errors";
import { getDeploymentApiClient } from "../../util/getClient";
import { Deployment, ResponseError } from "../../../sdk-client";

export const createDeployment = async (
	args: ArgumentsCamelCase<{
		appId: string;
		token: string;
		buildId?: number | undefined;
		roomsPerProcess?: number | undefined;
		planName?: "tiny" | "small" | "medium" | "large" | undefined;
		transportType?: "tcp" | "udp" | "tls" | undefined;
		containerPort?: number | undefined;
		env?: string | undefined;
	}>
): Promise<Deployment> => {
	const client = getDeploymentApiClient(args.token);
	try {
		const deployments = await client.getDeployments({ appId: args.appId });
		const lastDeployment = deployments.at(0);

		if (
			lastDeployment === undefined &&
			(args.buildId === undefined ||
				args.roomsPerProcess === undefined ||
				args.planName === undefined ||
				args.transportType === undefined ||
				args.containerPort === undefined)
		) {
			throw new Error("All args must be present for the initial deployment");
		}

		const deployment = await client.createDeployment({
			appId: args.appId,
			buildId: args.buildId ?? lastDeployment!.buildId,
			deploymentConfig: {
				roomsPerProcess:
					args.roomsPerProcess ?? lastDeployment!.roomsPerProcess,
				planName: args.planName ?? lastDeployment!.planName,
				transportType: args.transportType ?? lastDeployment!.transportType,
				containerPort: args.containerPort ?? lastDeployment!.containerPort,
				env:
					args.env !== undefined
						? JSON.parse(args.env)
						: lastDeployment?.env ?? [],
				additionalContainerPorts:
					lastDeployment?.additionalContainerPorts ?? [],
			},
		});
		return deployment;
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

export const createDeploymentCommand: CommandModule<
	{},
	{
		appId: string;
		token: string;
		buildId?: number;
		roomsPerProcess?: number;
		planName?: "tiny" | "small" | "medium" | "large";
		transportType?: "tcp" | "udp" | "tls";
		containerPort?: number;
		env?: string;
	}
> = {
	command: "create",
	describe: "create a deployment",
	builder: {
		buildId: {
			type: "number",
			describe: "System generated id for a build. Increments by 1",
		},
		appId: {
			type: "string",
			demandOption: true,
			describe: "System generated unique identifier for an application",
		},
		roomsPerProcess: {
			type: "number",
			describe: "Governs how many rooms can be scheduled in a process",
		},
		planName: {
			type: "string",
			choices: ["tiny", "small", "medium", "large"],
			describe: "A plan defines how much CPU and memory is required to run an instance of your game server",
		},
		transportType: {
			type: "string",
			choices: ["tcp", "udp", "tls"],
			describe: "Specifies the underlying communication protocol to the exposed port",
		},
		containerPort: {
			type: "number",
			describe: "Port the container listens on",
		},
		env: {
			type: "string",
			describe:
				"JSON stringified version of env variables array (name and value)",
		},
		token: {
			type: "string",
			demandOption: true,
			describe: "Hathora developer token (required only for CI environments)",
		},

	},
	handler: async (args) => {
		const deployment = await createDeployment(args);
		console.log(JSON.stringify(deployment));
	},
};
