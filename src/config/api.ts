import chalk from "chalk";
if (process.env.HATHORA_CLOUD_API_BASE != null) {
	console.log(
		chalk.red(`Overwritting API_BASE to ${process.env.HATHORA_CLOUD_API_BASE}`)
	);
}
export const API_BASE =
	process.env.HATHORA_CLOUD_API_BASE ?? "https://api.hathora.dev";
