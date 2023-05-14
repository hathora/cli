const esbuild = require("esbuild");

(async () => {
	const isDev =
		process.env.NODE_ENV === "development" || process.argv.includes("--dev");

	const config = {
		entryPoints: ["src/cli.ts"],
		bundle: true,
		outfile: "dist/cli.js",
		platform: "node",
		target: "node14",
		plugins: [],
		metafile: true,
		banner: {
			js: "#!/usr/bin/env node",
		},
		minify: !isDev,
	};

	if (isDev) {
		const context = await esbuild.context(config);
		context.watch();
	} else {
		await esbuild.build(config).then(async (res) => {
			console.log(await esbuild.analyzeMetafile(res.metafile));
		});
	}
})();
