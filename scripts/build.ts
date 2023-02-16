import esbuild from "esbuild";
import esbuildPluginNodeExternals from "esbuild-plugin-node-externals";

(async () => {
	const isDev =
		process.env.NODE_ENV === "development" || process.argv.includes("--dev");

	const config: esbuild.BuildOptions = {
		entryPoints: ["src/cli.ts"],
		bundle: true,
		outfile: "dist/cli.js",
		platform: "node",
		target: "node14",
		plugins: [esbuildPluginNodeExternals()],
		banner: {
			js: "#!/usr/bin/env node",
		},
	};

	if (isDev) {
		const context = await esbuild.context(config);

		context.watch();
	} else {
		await esbuild.build(config);
	}
})();
