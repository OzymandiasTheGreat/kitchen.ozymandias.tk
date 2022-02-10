// @generated: @expo/next-adapter@3.1.18
// Learn more: https://github.com/expo/expo/blob/master/docs/pages/versions/unversioned/guides/using-nextjs.md#withexpo

const { withExpo } = require("@expo/next-adapter");
const withPlugins = require("next-compose-plugins");
const withPreact = require("next-plugin-preact");
const withRNWeb = require("next-transpile-modules")(["react-native-web"]);
const withImages = require("next-images");
const withFonts = require("next-fonts");

module.exports = withPlugins([
	withPreact,
	[
		withRNWeb,
		{
			webpack: (config) => {
				config.resolve.alias = {
					...config.resolve.alias,
					"react-dom/unstable-native-dependencies$":
						"preact-responder-event-plugin",
				};
				return config;
			},
		},
	],
	withImages,
	withFonts,
	[
		withExpo,
		{
			projectRoot: __dirname,
			webpack5: true,
		},
	],
]);
