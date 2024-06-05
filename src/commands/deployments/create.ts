import { ArgumentsCamelCase, CommandModule } from "yargs";
import { ERROR_MESSAGES } from "../../util/errors";
import { getDeploymentApiClient } from "../../util/getClient";
import {  DeploymentV2, PlanName, ResponseError } from "../../../sdk-client";

const CONTAINER_SIZES: Record<PlanName, { cpu: number; memory: number }> = {
	tiny: { cpu: 0.5, memory: 1024 },
	small: { cpu: 1, memory: 2048 },
	medium: { cpu: 2, memory: 4096 },
	large: { cpu: 4, memory: 8192 },
};

export const createDeployment = async (
	args: ArgumentsCamelCase<{
		appId: string;
		token: string;
		buildId?: number | undefined;
		roomsPerProcess?: number | undefined;
		planName?: PlanName | undefined;
		transportType?: "tcp" | "udp" | "tls" | undefined;
		containerPort?: number | undefined;
		env?: string | undefined;
	}>
): Promise<DeploymentV2> => {
	const client = getDeploymentApiClient(args.token);
	try {
		let lastDeployment: DeploymentV2 | undefined;
		if (
			args.buildId === undefined ||
			args.roomsPerProcess === undefined ||
			args.planName === undefined ||
			args.transportType === undefined ||
			args.containerPort === undefined
		) {
			console.log("Some args missing, copying values from the last deployment");
			try {
				lastDeployment = await client.getLatestDeployment({
					appId: args.appId,
				});
			} catch (e) {
				throw new Error("No previous deployment found");
			}
		}

		const requestedCPU = args.planName ? CONTAINER_SIZES[args.planName].cpu : undefined;
		const requestedMemoryMB = args.planName ? CONTAINER_SIZES[args.planName].memory : undefined;

		const deployment = await client.createDeployment({
			appId: args.appId,
			buildId: args.buildId ?? lastDeployment!.buildId,
			deploymentConfigV2: {
				roomsPerProcess:
					args.roomsPerProcess ?? lastDeployment!.roomsPerProcess,
				requestedCPU: requestedCPU ?? lastDeployment!.requestedCPU,
				requestedMemoryMB: requestedMemoryMB ?? lastDeployment!.requestedMemoryMB,
				transportType: args.transportType ?? lastDeployment!.defaultContainerPort.transportType,
				containerPort: args.containerPort ?? lastDeployment!.defaultContainerPort.port,
				env:
					args.env !== undefined
						? JSON.parse(args.env)
						: lastDeployment?.env ?? [],
				additionalContainerPorts:
					lastDeployment?.additionalContainerPorts ?? [],
				idleTimeoutEnabled: lastDeployment?.idleTimeoutEnabled ?? lastDeployment?.idleTimeoutEnabled ?? true,
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
		planName?: PlanName;
		transportType?: "tcp" | "udp" | "tls";
		containerPort?: number;
		env?: string;
	}
> = {
	command: "create",
	describe:
		"Create a new deployment to configure a build at runtime. This will not generate a new build image",
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
			describe:
				"A plan defines how much CPU and memory is required to run an instance of your game server",
		},
		transportType: {
			type: "string",
			choices: ["tcp", "udp", "tls"],
			describe:
				"Specifies the underlying communication protocol to the exposed port",
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
