import { join } from "path";
import os from "os";
import { existsSync } from "fs";

import prompts from "prompts";
import { Issuer } from "openid-client";
import open from "open";
import { outputFileSync } from "fs-extra";
import chalk from "chalk";
import { CommandModule } from "yargs";

export const loginCommand: CommandModule = {
	command: "login",
	aliases: ["l"],
	describe: "Login to Hathora Cloud",
	handler: async () => {
		const tokenPath = join(os.homedir(), ".config", "hathora", "token");
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
		const handle = await client.deviceAuthorization({
			scope: "openid email offline_access",
			audience: "https://cloud.hathora.com",
		});

		const userInput = await prompts({
			type: "confirm",
			name: "value",
			message: `Open browser for login? You should see the following code: ${handle.user_code}.`,
			initial: true,
		});

		if (!userInput.value) {
			return;
		}

		open(handle.verification_uri_complete);
		const tokens = await handle.poll();
		if (tokens.access_token) {
			outputFileSync(tokenPath, tokens.access_token);
			console.log(
				chalk.green(`Successfully logged in! Saved credentials to ${tokenPath}`)
			);
		} else {
			console.log(
				chalk.red(
					`Something went wrong. Please try again. If the problem persists, please let us know.`
				)
			);
		}
	},
};
