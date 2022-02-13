declare module "react-native-syntax-highlighter/src" {
	import React from "react";
	import ReactSyntaxHighlighter, {
		SyntaxHighlighterProps,
	} from "react-syntax-highlighter";

	type RNSyntaxHighlighterProps = SyntaxHighlighterProps & {
		fontFamily: string;
		fontSize: number;
		highlighter: "hljs" | "prism";
	};

	const SyntaxHighlighter: React.FC<RNSyntaxHighlighterProps>;

	export default SyntaxHighlighter;
}
