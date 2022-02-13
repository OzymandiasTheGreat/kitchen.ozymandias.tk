import { useEffect, useState } from "react";
import {
	useColorScheme,
	useWindowDimensions,
	ImageStyle,
	TextStyle,
	ViewStyle,
} from "react-native";
import {
	useFonts,
	DancingScript_700Bold,
	Poppins_400Regular,
	Poppins_400Regular_Italic,
	Poppins_700Bold,
	FiraCode_400Regular,
} from "@expo-google-fonts/dev";

const dark = {
	scheme: "dark",
	text: {
		color: "#efefef",
		fontFamily: "Poppins",
		fontItalic: "Poppins_Italic",
		fontBold: "Poppins_Bold",
		fontSize: 18,
	} as TextStyle & {
		fontItalic: string;
		fontBold: string;
		fontCode: string;
	},
	code: {
		backgroundColor: "#f4ff8133",
		fontSizeMultiplier: 0.9,
	},
	html: {
		contentWidth: 100,
		fallbackFont: {
			"sans-serif": "Poppins",
			monospace: "FiraCode",
			serif: "Poppins",
		},
		props: {
			color: "#efefef",
			fontFamily: "Poppins",
			fontSize: 18,
		} as TextStyle,
	},
	image: {
		width: "100%",
		height: 450,
		resizeMode: "cover",
	} as ImageStyle,
	heading: {
		color: "#fafafa",
		fontFamily: "DancingScript",
	} as TextStyle,
	background: {
		backgroundColor: "#212121",
	} as ViewStyle,
	headerContainer: {
		backgroundColorIn: "#42424233",
		backgroundColorOut: "#424242ef",
		maxHeight: 80,
		minHeight: 30,
		alignItems: "flex-end",
		justifyContent: "center",
		paddingHorizontal: 20,
		marginBottom: 20,
	} as ViewStyle & { backgroundColorIn: string; backgroundColorOut: string },
	headerText: {
		color: "#efefef",
		fontFamily: "DancingScript",
		fontSize: 20,
		maxWidth: 160,
	} as TextStyle,
	headerIcon: {
		width: 24,
		height: 24,
		resizeMode: "contain",
	} as ImageStyle,
	article: {
		alignSelf: "center",
		backgroundColor: "#424242",
		width: "80%",
		paddingHorizontal: 45,
		paddingVertical: 20,
		borderRadius: 15,
	} as ViewStyle,
	blockquote: {
		backgroundColor: "#efefef11",
		borderTopColor: "#33691e",
		borderTopWidth: 8,
		margin: 0,
		marginStart: 20,
		paddingHorizontal: 15,
		paddingVertical: 10,
	} as ViewStyle,
};

const light = {
	scheme: "light",
	text: {
		color: "#212121",
		fontFamily: "Poppins",
		fontItalic: "Poppins_Italic",
		fontBold: "Poppins_Bold",
		fontCode: "FiraCode",
		fontSize: 18,
	} as TextStyle & {
		fontItalic: string;
		fontBold: string;
		fontCode: string;
	},
	code: {
		backgroundColor: "#f4ff8199",
		fontSizeMultiplier: 0.9,
	},
	html: {
		contentWidth: 100,
		fallbackFont: {
			"sans-serif": "Poppins",
			monospace: "FiraCode",
			serif: "Poppins",
		},
		props: {
			color: "#212121",
			fontFamily: "Poppins",
			fontSize: 18,
		} as TextStyle,
	},
	image: {
		width: "100%",
		height: 450,
		resizeMode: "cover",
	} as ImageStyle,
	heading: {
		color: "#000000",
		fontFamily: "DancingScript",
	} as TextStyle,
	background: {
		backgroundColor: "#ffd54f",
	} as ViewStyle,
	headerContainer: {
		backgroundColorIn: "#efefef33",
		backgroundColorOut: "#efefefef",
		maxHeight: 80,
		minHeight: 30,
		alignItems: "flex-end",
		justifyContent: "center",
		paddingHorizontal: 20,
		marginBottom: 20,
	} as ViewStyle & { backgroundColorIn: string; backgroundColorOut: string },
	headerText: {
		color: "#212121",
		fontFamily: "DancingScript",
		fontSize: 20,
		maxWidth: 160,
	} as TextStyle,
	headerIcon: {
		width: 24,
		height: 24,
		resizeMode: "contain",
	} as ImageStyle,
	article: {
		alignSelf: "center",
		backgroundColor: "#fafafa",
		width: "80%",
		paddingHorizontal: 45,
		paddingVertical: 20,
	} as ViewStyle,
	blockquote: {
		backgroundColor: "#42424211",
		borderTopColor: "#33691e",
		borderTopWidth: 8,
		margin: 0,
		marginStart: 20,
		paddingHorizontal: 15,
		paddingVertical: 10,
	} as ViewStyle,
};

export const Theme = { dark, light };

const useTheme = (): typeof Theme["dark"] | null => {
	const scheme = useColorScheme();
	const [theme, setTheme] = useState<typeof Theme["dark"] | null>(null);
	const [loaded] = useFonts({
		DancingScript: DancingScript_700Bold,
		Poppins: Poppins_400Regular,
		Poppins_Italic: Poppins_400Regular_Italic,
		Poppins_Bold: Poppins_700Bold,
		FiraCode: FiraCode_400Regular,
	});
	const { width } = useWindowDimensions();

	useEffect(() => {
		const theme = Theme[scheme as "dark"];
		const articleWidthMultiplier =
			parseInt(theme.article.width as string) / 100;
		const contentWidth = width * articleWidthMultiplier - 100;
		theme.html.contentWidth = contentWidth;
		theme.image.width = contentWidth;
		theme.image.height = contentWidth * (9 / 16);
		setTheme(theme);
	}, [scheme, loaded, width]);

	return theme;
};

export default useTheme;
