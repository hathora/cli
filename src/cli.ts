import yargs, { MiddlewareFunction } from "yargs";
import { hideBin } from "yargs/helpers";
import { loginCommand } from "./commands/login";
import { deployCommand } from "./commands/deploy";
import { roomCommand } from "./commands/room";
import { logAllCommand } from "./commands/log";
import { processesCommand } from "./commands/processes";
import { deploymentsCommand } from "./commands/deployments";
import { buildCommand } from "./commands/build";
import { appsCommand } from "./commands/apps";
import { version } from "../package.json";
import chalk from "chalk";
import { join } from "path";
import { existsSync, readFileSync } from "fs";
import { homedir } from "os";
import { Issuer } from "openid-client";

const tokenMiddleware: MiddlewareFunction = async (argv) => {
	if (argv._[0] === "login" || "token" in argv) {
		return;
	}

	const tokenFile = join(homedir(), ".config", "hathora", "token");
	if (!existsSync(tokenFile)) {
		console.log(
			chalk.redBright(
				`Missing token file, run ${chalk.underline(
					"hathora-cloud login"
				)} first`
			)
		);
		return;
	}
	const auth0 = await Issuer.discover(
		process.env.HATHORA_CLOUD_AUTH_DOMAIN ?? "https://auth.hathora.com"
	);
	const client = new auth0.Client({
		client_id:
			process.env.HATHORA_CLOUD_AUTH_CLIENT_ID ??
			"tWjDhuzPmuIWrI8R9s3yV3BQVw2tW0yq",
		token_endpoint_auth_method: "none",
		id_token_signed_response_alg: "RS256",
		grant_type: "refresh_token",
	});
	const token = readFileSync(tokenFile).toString();
	const introspection = await client.introspect(token);
	if (introspection.active === false) {
		console.log(
			chalk.redBright(
				`Your token has expired, run ${chalk.underline(
					"hathora-cloud login"
				)} first`
			)
		);
		return;
	}
	argv.token = token;
};

// Needed to get the correct terminal width
// https://github.com/yargs/yargs/blob/main/docs/typescript.md
const yargsInstance = yargs(hideBin(process.argv))

yargsInstance.version(version)
	.scriptName("hathora-cloud")
	.middleware(tokenMiddleware, true)
	.demandCommand(1, "Please specify a command")
	.recommendCommands()
	.completion()
	.usage("Usage: $0 <command> [options]")
	.command(loginCommand)
	.command(appsCommand)
	.command(deployCommand)
	.command(logAllCommand)
	.command(processesCommand)
	.command(deploymentsCommand)
	.command(buildCommand)
	.command(roomCommand)
	.wrap(yargsInstance.terminalWidth())
	.help()
	.parse();
