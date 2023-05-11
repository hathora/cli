/* Copyright 2023 Hathora, Inc. */
module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
	plugins: [
		"@typescript-eslint",
		"eslint-plugin-import",
		"prettier",
		"unused-imports",
		"header",
	],
	rules: {
		"header/header": [
			2,
			"block",
			[
				{
					pattern: " Copyright \\d{4} Hathora, Inc. ",
					template: " Copyright 2023 Hathora, Inc. ",
				},
			],
		],
		"no-unused-vars": "off",
		"unused-imports/no-unused-imports": "error",
		"unused-imports/no-unused-vars": [
			"warn",
			{
				vars: "all",
				varsIgnorePattern: "^_",
				args: "after-used",
				argsIgnorePattern: "^_",
			},
		],
		"prettier/prettier": [
			"error",
			{ printWidth: 120, tabWidth: 2, semi: true, singleQuote: false },
		],
		"linebreak-style": ["error", "unix"],
		"import/order": [
			"error",
			{
				groups: [
					"builtin",
					"external",
					"internal",
					"parent",
					"sibling",
					"index",
					"object",
					"type",
				],
				"newlines-between": "always",
				alphabetize: {
					order: "desc",
					caseInsensitive: true,
				},
			},
		],
		"import/extensions": ["error", "ignorePackages"],
		curly: ["error"],
		"arrow-parens": ["error"],
		"arrow-spacing": ["error"],
	},
};
