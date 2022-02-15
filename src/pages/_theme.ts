import { useEffect, useState } from "react";
import {
	useColorScheme,
	useWindowDimensions,
	ImageStyle,
	TextStyle,
	ViewStyle,
} from "react-native";
import { useFonts } from "expo-font";
import { DancingScript_700Bold } from "@expo-google-fonts/dancing-script";
import {
	Poppins_400Regular,
	Poppins_400Regular_Italic,
	Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { FiraCode_400Regular } from "@expo-google-fonts/fira-code";

const FONT_REGULAR = "Poppins_400Regular";
const FONT_STRONG = "Poppins_700Bold";
const FONT_EMPHASIS = "Poppins_400Regular_Italic";
const FONT_CODE = "FiraCode_400Regular";
const FONT_HEADING = "DancingScript_700Bold";
const COLOR_BG_DARK = "#212121";
const COLOR_BG_DARKER = "#424242";
const COLOR_FG_DARK = "#fafafa";
const COLOR_FG_DARKER = "#efefef";
const COLOR_BG_LIGHT = "#ffd54f";
const COLOR_BG_LIGHTER = "#fafafa";
const COLOR_FG_LIGHT = "#212121";
const COLOR_FG_LIGHTER = "#424242";
const COLOR_BG_HIGHLIGHT = "#f4ff8137";
const COLOR_BORDER = "#33691e";

const dark = {
	scheme: "dark",
	main: {
		flex: 1,
		color: COLOR_FG_DARK,
		backgroundColor: COLOR_BG_DARK,
		container: {
			flex: 1,
			minHeight: "100%",
			alignItems: "center",
			justifyContent: "center",
		} as ViewStyle,
	},
	text: {
		body: {
			color: COLOR_FG_DARK,
			fontFamily: FONT_REGULAR,
			fontSize: 16,
		} as TextStyle,
		strong: {
			color: COLOR_FG_DARK,
			fontFamily: FONT_STRONG,
			fontSize: 16,
			fontWeight: "700",
		} as TextStyle,
		emphasis: {
			color: COLOR_FG_DARK,
			fontFamily: FONT_EMPHASIS,
			fontSize: 16,
			fontStyle: "italic",
		} as TextStyle,
		code: {
			color: COLOR_FG_DARKER,
			backgroundColor: COLOR_BG_HIGHLIGHT,
			fontFamily: FONT_CODE,
			fontSize: 15,
		} as TextStyle,
		heading: {
			color: COLOR_FG_DARK,
			fontFamily: FONT_HEADING,
			fontSize: 28,
			fontWeight: "700",
		} as TextStyle,
	},
	card: {
		columns: 3,
		fadeDuration: 600,
		style: {
			width: 250,
			minHeight: 175,
			margin: 3,
		} as TextStyle,
		container: {
			flex: 1,
			backgroundColor: COLOR_BG_DARKER,
			borderRadius: 3,
		} as ViewStyle,
		heading: {
			fontSize: 24,
			fontFamily: FONT_HEADING,
			fontWeight: "700",
			paddingVertical: 10,
			paddingHorizontal: 15,
		} as TextStyle,
		excerpt: {
			flex: 1,
			paddingVertical: 10,
			paddingHorizontal: 15,
		} as ViewStyle,
		image: {
			width: "100%",
			minHeight: 120,
			maxHeight: 175,
			resizeMode: "cover",
		} as ImageStyle,
		list: {
			justifyContent: "flex-start",
			alignItems: "center",
		} as ViewStyle,
		tags: {
			paddingHorizontal: 20,
			margin: 0,
			marginBottom: 15,
		} as TextStyle,
	},
	markdown: {
		html: {
			contentWidth: 600,
			fallbackFonts: {
				"sans-serif": FONT_REGULAR,
				monospace: FONT_CODE,
				serif: FONT_REGULAR,
			},
			style: {
				color: COLOR_FG_DARK,
				fontFamily: FONT_REGULAR,
				fontSize: 16,
			} as TextStyle,
		},
		heading: {
			h1multiplier: 1,
			h2multiplier: 0.95,
			h3multiplier: 0.9,
			h4multiplier: 0.85,
			h5multiplier: 0.8,
			h6multiplier: 0.75,
		},
		blockquote: {
			backgroundColor: COLOR_BG_LIGHTER + "0d",
			paddingVertical: 10,
			paddingHorizontal: 15,
			borderTopColor: COLOR_BORDER,
			borderTopWidth: 8,
			margin: 0,
			marginStart: 20,
		} as ViewStyle,
		hr: {
			width: "95%",
			backgroundColor: COLOR_FG_DARKER,
		} as ViewStyle,
		image: {
			minWidth: 20,
			maxWidth: "100%",
			minHeight: 10,
			maxHeight: "500",
			resizeMode: "contain",
		} as ImageStyle,
		footnote: {
			container: {
				color: COLOR_FG_DARKER + "cc",
				fontFamily: FONT_REGULAR,
				fontSize: 13,
				margin: 0,
				marginBottom: 15,
			} as TextStyle,
			definition: {
				fontSize: 13,
				position: "relative",
				top: -7,
			} as TextStyle,
			reference: {
				fontSize: 8,
				position: "relative",
				top: -9,
			} as TextStyle,
		},
		table: {
			style: {
				alignSelf: "flex-start",
				borderColor: COLOR_FG_DARKER,
				borderWidth: 1,
				margin: 0,
				marginBottom: 30,
			} as ViewStyle,
			row: {
				borderColor: COLOR_FG_DARKER,
				borderWidth: 1,
			} as ViewStyle,
			cell: {
				paddingVertical: 5,
				paddingHorizontal: 10,
				borderColor: COLOR_FG_DARKER,
				borderWidth: 1,
			} as TextStyle,
			text: {
				color: COLOR_FG_DARK,
				fontFamily: FONT_REGULAR,
				fontSize: 16,
			} as TextStyle,
		},
	},
	article: {
		container: {
			backgroundColor: COLOR_BG_DARKER,
			alignSelf: "center",
			width: "80%",
			maxWidth: 800,
			paddingVertical: 20,
			paddingHorizontal: 50,
			borderRadius: 3,
		} as ViewStyle,
		image: {
			container: {
				alignItems: "center",
				marginBottom: 30,
			} as ViewStyle,
			style: {
				width: "100%",
				minHeight: 380,
				maxHeight: 500,
				resizeMode: "cover",
			} as ImageStyle,
			copyright: {
				color: COLOR_FG_DARKER + "77",
				fontSize: 13,
			} as TextStyle,
		},
		byline: {
			container: {
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-between",
				width: "100%",
				margin: 0,
				marginBottom: 30,
			} as ViewStyle,
			date: {
				fontSize: 12,
			} as TextStyle,
			author: {
				fontSize: 14,
			} as TextStyle,
		},
		footer: {
			source: {
				fontSize: 14,
			} as TextStyle,
			tag: {
				color: COLOR_FG_DARKER + "66",
				fontSize: 13,
				marginRight: 10,
			} as TextStyle,
		},
	},
	header: {
		opaque: {
			backgroundColor: COLOR_BG_DARKER,
			height: 80,
		} as ViewStyle,
		transparent: {
			backgroundColor: COLOR_BG_DARKER + "33",
			height: 40,
		} as ViewStyle,
		container: {
			alignItems: "stretch",
			width: "100vw",
		} as ViewStyle,
		inner: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			width: 330,
		} as ViewStyle,
		link: {
			flexDirection: "row",
			alignItems: "center",
		} as ViewStyle,
		style: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			paddingVertical: 3,
			paddingHorizontal: 20,
			margin: 0,
			marginBottom: 20,
		} as ViewStyle,
		textOpaque: {
			color: COLOR_FG_DARK,
			fontFamily: FONT_HEADING,
			fontSize: 22,
			maxWidth: 180,
		} as TextStyle,
		textTransparent: {
			color: COLOR_FG_DARKER,
			fontFamily: FONT_HEADING,
			fontSize: 17,
			maxWidth: 180,
		} as TextStyle,
		icon: {
			width: 24,
			height: 24,
			resizeMode: "contain",
			marginRight: 5,
		} as ImageStyle,
	},
	profile: {
		container: {
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
		} as ViewStyle,
		image: {
			width: 70,
			height: 70,
			borderColor: COLOR_FG_DARKER,
			borderRadius: 35,
			borderWidth: 5,
			marginRight: 15,
		} as ImageStyle,
		text: {
			fontSize: 20,
			textAlignVertical: "center",
		} as TextStyle,
	},
	footer: {
		container: {
			backgroundColor: COLOR_BG_DARKER,
			alignItems: "center",
			justifyContent: "space-around",
			width: "100%",
			height: 175,
			paddingVertical: 25,
			marginTop: 40,
		} as ViewStyle,
		paragraph: {
			color: COLOR_FG_DARKER,
			fontFamily: FONT_REGULAR,
			fontSize: 14,
			opacity: 0.7,
			margin: 0,
		} as TextStyle,
	},
	tagcloud: {
		container: {
			flex: 1,
			width: "100%",
			minHeight: "100%",
			alignItems: "center",
			justifyContent: "center",
		} as ViewStyle,
		style: {
			backgroundColor: COLOR_BG_DARKER,
			flexDirection: "row",
			flexWrap: "wrap",
			justifyContent: "space-around",
			alignItems: "center",
			width: "80%",
			maxWidth: 600,
			paddingVertical: 25,
			paddingHorizontal: 40,
			borderRadius: 3,
		} as ViewStyle,
		tag: {
			fontSize: 9,
			margin: 15,
		} as TextStyle,
		header: {
			fontSize: 32,
			alignSelf: "center",
			marginBottom: 20,
		} as TextStyle,
	},
	archive: {
		width: 300,
		height: 260,
		selectedColor: COLOR_FG_DARKER,
		selectedBackground: "transparent",
		scroller: {
			flex: 1,
			width: "100%",
		} as ViewStyle,
		container: {
			backgroundColor: COLOR_BG_DARKER,
			flex: 1,
			alignSelf: "center",
			flexDirection: "row",
			flexWrap: "wrap",
			alignItems: "baseline",
			justifyContent: "space-around",
			width: "80%",
			maxWidth: 800,
			minHeight: "100%",
			padding: 45,
			borderRadius: 3,
		} as ViewStyle,
		heading: {
			fontSize: 16,
			alignSelf: "center",
		} as TextStyle,
		text: {
			fontSize: 14,
		} as TextStyle,
		disabled: {
			fontSize: 13,
			opacity: 0.3,
		} as TextStyle,
	},
	about: {
		scroller: {
			flex: 1,
			width: "100%",
			minHeight: "100%",
		} as ViewStyle,
		container: {
			backgroundColor: COLOR_BG_DARKER,
			width: "80%",
			maxWidth: 800,
			alignSelf: "center",
			paddingVertical: 40,
			paddingHorizontal: 50,
			borderRadius: 3,
		} as ViewStyle,
		image: {
			width: 275,
			height: 275,
			alignSelf: "center",
			borderRadius: 138,
			borderColor: COLOR_FG_DARKER,
			borderWidth: 10,
			marginBottom: 50,
		} as ImageStyle,
	},
	credits: {
		image: {
			width: 256,
			height: 256,
		},
		scroller: {
			flex: 1,
			width: "100%",
			minHeight: "100%",
		} as ViewStyle,
		container: {
			backgroundColor: COLOR_BG_DARKER,
			width: "80%",
			maxWidth: 800,
			alignSelf: "center",
			paddingVertical: 40,
			paddingHorizontal: 50,
			borderRadius: 3,
			marginBottom: 50,
		} as ViewStyle,
	},
};

const light = {
	scheme: "dark",
	main: {
		flex: 1,
		color: COLOR_FG_LIGHT,
		backgroundColor: COLOR_BG_LIGHT,
		container: {
			flex: 1,
			minHeight: "100%",
			alignItems: "center",
			justifyContent: "center",
		} as ViewStyle,
	},
	text: {
		body: {
			color: COLOR_FG_LIGHT,
			fontFamily: FONT_REGULAR,
			fontSize: 16,
		} as TextStyle,
		strong: {
			color: COLOR_FG_LIGHT,
			fontFamily: FONT_STRONG,
			fontSize: 16,
			fontWeight: "700",
		} as TextStyle,
		emphasis: {
			color: COLOR_FG_LIGHT,
			fontFamily: FONT_EMPHASIS,
			fontSize: 16,
			fontStyle: "italic",
		} as TextStyle,
		code: {
			color: COLOR_FG_LIGHTER,
			backgroundColor: COLOR_BG_HIGHLIGHT,
			fontFamily: FONT_CODE,
			fontSize: 15,
		} as TextStyle,
		heading: {
			color: COLOR_FG_LIGHT,
			fontFamily: FONT_HEADING,
			fontSize: 28,
			fontWeight: "700",
		} as TextStyle,
	},
	card: {
		columns: 3,
		fadeDuration: 600,
		style: {
			width: 250,
			minHeight: 175,
			margin: 3,
		} as TextStyle,
		container: {
			flex: 1,
			backgroundColor: COLOR_BG_LIGHTER,
			borderRadius: 3,
		} as ViewStyle,
		heading: {
			fontSize: 24,
			fontFamily: FONT_HEADING,
			fontWeight: "700",
			paddingVertical: 10,
			paddingHorizontal: 15,
		} as TextStyle,
		excerpt: {
			flex: 1,
			paddingVertical: 10,
			paddingHorizontal: 15,
		} as ViewStyle,
		image: {
			width: "100%",
			minHeight: 120,
			maxHeight: 175,
			resizeMode: "cover",
		} as ImageStyle,
		list: {
			justifyContent: "flex-start",
			alignItems: "center",
		} as ViewStyle,
		tags: {
			paddingHorizontal: 20,
			margin: 0,
			marginBottom: 15,
		} as TextStyle,
	},
	markdown: {
		html: {
			contentWidth: 600,
			fallbackFonts: {
				"sans-serif": FONT_REGULAR,
				monospace: FONT_CODE,
				serif: FONT_REGULAR,
			},
			style: {
				color: COLOR_FG_LIGHT,
				fontFamily: FONT_REGULAR,
				fontSize: 16,
			} as TextStyle,
		},
		heading: {
			h1multiplier: 1,
			h2multiplier: 0.95,
			h3multiplier: 0.9,
			h4multiplier: 0.85,
			h5multiplier: 0.8,
			h6multiplier: 0.75,
		},
		blockquote: {
			backgroundColor: COLOR_BG_DARKER + "0d",
			paddingVertical: 10,
			paddingHorizontal: 15,
			borderTopColor: COLOR_BORDER,
			borderTopWidth: 8,
			margin: 0,
			marginStart: 20,
		} as ViewStyle,
		hr: {
			width: "95%",
			backgroundColor: COLOR_FG_LIGHTER,
		} as ViewStyle,
		image: {
			minWidth: 20,
			maxWidth: "100%",
			minHeight: 10,
			maxHeight: "500",
			resizeMode: "contain",
		} as ImageStyle,
		footnote: {
			container: {
				color: COLOR_FG_LIGHTER + "cc",
				fontFamily: FONT_REGULAR,
				fontSize: 13,
				margin: 0,
				marginBottom: 15,
			} as TextStyle,
			definition: {
				fontSize: 13,
				position: "relative",
				top: -7,
			} as TextStyle,
			reference: {
				fontSize: 8,
				position: "relative",
				top: -9,
			} as TextStyle,
		},
		table: {
			style: {
				alignSelf: "flex-start",
				borderColor: COLOR_FG_LIGHTER,
				borderWidth: 1,
				margin: 0,
				marginBottom: 30,
			} as ViewStyle,
			row: {
				borderColor: COLOR_FG_LIGHTER,
				borderWidth: 1,
			} as ViewStyle,
			cell: {
				paddingVertical: 5,
				paddingHorizontal: 10,
				borderColor: COLOR_FG_LIGHTER,
				borderWidth: 1,
			} as TextStyle,
			text: {
				color: COLOR_FG_LIGHT,
				fontFamily: FONT_REGULAR,
				fontSize: 16,
			} as TextStyle,
		},
	},
	article: {
		container: {
			backgroundColor: COLOR_BG_LIGHTER,
			alignSelf: "center",
			width: "80%",
			maxWidth: 800,
			paddingVertical: 20,
			paddingHorizontal: 50,
			borderRadius: 3,
		} as ViewStyle,
		image: {
			container: {
				alignItems: "center",
				marginBottom: 30,
			} as ViewStyle,
			style: {
				width: "100%",
				minHeight: 380,
				maxHeight: 500,
				resizeMode: "cover",
			} as ImageStyle,
			copyright: {
				color: COLOR_FG_LIGHTER + "77",
				fontSize: 13,
			} as TextStyle,
		},
		byline: {
			container: {
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-between",
				width: "100%",
				margin: 0,
				marginBottom: 30,
			} as ViewStyle,
			date: {
				fontSize: 12,
			} as TextStyle,
			author: {
				fontSize: 14,
			} as TextStyle,
		},
		footer: {
			source: {
				fontSize: 14,
			} as TextStyle,
			tag: {
				color: COLOR_FG_LIGHTER + "66",
				fontSize: 13,
				marginRight: 10,
			} as TextStyle,
		},
	},
	header: {
		opaque: {
			backgroundColor: COLOR_BG_LIGHTER,
			height: 80,
		} as ViewStyle,
		transparent: {
			backgroundColor: COLOR_BG_LIGHTER + "33",
			height: 40,
		} as ViewStyle,
		container: {
			alignItems: "stretch",
			width: "100vw",
		} as ViewStyle,
		inner: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			width: 330,
		} as ViewStyle,
		style: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			paddingVertical: 3,
			paddingHorizontal: 20,
			margin: 0,
			marginBottom: 20,
		} as ViewStyle,
		textOpaque: {
			color: COLOR_FG_LIGHT,
			fontFamily: FONT_HEADING,
			fontSize: 22,
			maxWidth: 180,
		} as TextStyle,
		textTransparent: {
			color: COLOR_FG_LIGHTER,
			fontFamily: FONT_HEADING,
			fontSize: 17,
			maxWidth: 180,
		} as TextStyle,
		icon: {
			width: 24,
			height: 24,
			resizeMode: "contain",
		} as ImageStyle,
	},
	profile: {
		container: {
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
		} as ViewStyle,
		image: {
			width: 70,
			height: 70,
			borderColor: COLOR_FG_LIGHTER,
			borderRadius: 35,
			borderWidth: 5,
			marginRight: 15,
		} as ImageStyle,
		text: {
			fontSize: 20,
			textAlignVertical: "center",
		} as TextStyle,
	},
	footer: {
		container: {
			backgroundColor: COLOR_BG_LIGHTER,
			alignItems: "center",
			justifyContent: "space-around",
			width: "100%",
			height: 175,
			paddingVertical: 25,
			marginTop: 40,
		} as ViewStyle,
		paragraph: {
			color: COLOR_FG_LIGHTER,
			fontFamily: FONT_REGULAR,
			fontSize: 14,
			opacity: 0.7,
			margin: 0,
		} as TextStyle,
	},
	tagcloud: {
		container: {
			flex: 1,
			width: "100%",
			minHeight: "100%",
			alignItems: "center",
			justifyContent: "center",
		} as ViewStyle,
		style: {
			backgroundColor: COLOR_BG_LIGHTER,
			flexDirection: "row",
			flexWrap: "wrap",
			justifyContent: "space-around",
			alignItems: "center",
			width: "80%",
			maxWidth: 600,
			paddingVertical: 25,
			paddingHorizontal: 40,
			borderRadius: 3,
		} as ViewStyle,
		tag: {
			fontSize: 9,
			margin: 15,
		} as TextStyle,
		header: {
			fontSize: 32,
			alignSelf: "center",
			marginBottom: 20,
		} as TextStyle,
	},
	archive: {
		width: 300,
		height: 260,
		selectedColor: COLOR_FG_LIGHTER,
		selectedBackground: "transparent",
		scroller: {
			flex: 1,
			width: "100%",
		} as ViewStyle,
		container: {
			backgroundColor: COLOR_BG_LIGHTER,
			flex: 1,
			alignSelf: "center",
			flexDirection: "row",
			flexWrap: "wrap",
			alignItems: "baseline",
			justifyContent: "space-around",
			width: "80%",
			maxWidth: 800,
			minHeight: "100%",
			padding: 45,
			borderRadius: 3,
		} as ViewStyle,
		heading: {
			fontSize: 16,
			alignSelf: "center",
		} as TextStyle,
		text: {
			fontSize: 14,
		} as TextStyle,
		disabled: {
			fontSize: 13,
			opacity: 0.3,
		} as TextStyle,
	},
	about: {
		scroller: {
			flex: 1,
			width: "100%",
			minHeight: "100%",
		} as ViewStyle,
		container: {
			backgroundColor: COLOR_BG_LIGHTER,
			width: "80%",
			maxWidth: 800,
			alignSelf: "center",
			paddingVertical: 40,
			paddingHorizontal: 50,
			borderRadius: 3,
		} as ViewStyle,
		image: {
			width: 275,
			height: 275,
			alignSelf: "center",
			borderRadius: 138,
			borderColor: COLOR_FG_LIGHTER,
			borderWidth: 10,
			marginBottom: 50,
		} as ImageStyle,
	},
	credits: {
		image: {
			width: 256,
			height: 256,
		},
		scroller: {
			flex: 1,
			width: "100%",
			minHeight: "100%",
		} as ViewStyle,
		container: {
			backgroundColor: COLOR_BG_DARKER,
			width: "80%",
			maxWidth: 800,
			alignSelf: "center",
			paddingVertical: 40,
			paddingHorizontal: 50,
			borderRadius: 3,
			marginBottom: 50,
		} as ViewStyle,
	},
};

export const Theme = { dark, light };

const useTheme = (): typeof Theme["dark"] | null => {
	const scheme = useColorScheme();
	const [theme, setTheme] = useState<typeof Theme["dark"] | null>(null);
	const [loaded] = useFonts({
		DancingScript_700Bold,
		Poppins_400Regular,
		Poppins_400Regular_Italic,
		Poppins_700Bold,
		FiraCode_400Regular,
	});
	const { width } = useWindowDimensions();

	useEffect(() => {
		const theme = Theme[scheme as "dark"];
		const articleWidthMultiplier =
			parseInt(theme.article.container.width as string) / 100;
		const contentWidth = width * articleWidthMultiplier - 100;
		theme.markdown.html.contentWidth = contentWidth;
		if (width <= 600) {
			theme.card.columns = 2;
			theme.card.style.width = 175;
			theme.article.container.width = "100%";
			theme.article.container.borderRadius = 0;
			theme.article.container.backgroundColor =
				(theme.article.container.backgroundColor as string).slice(
					0,
					7,
				) + "ee";
			theme.profile.container.display = "none";
		}
		setTheme(theme);
	}, [scheme, loaded, width]);

	return theme;
};

export default useTheme;
