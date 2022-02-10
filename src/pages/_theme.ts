import { useColorScheme, ViewStyle, TextStyle } from "react-native";

const dark = {
	text: {
		color: "#efefef",
	} as TextStyle,
	container: {
		backgroundColor: "#212121",
	} as ViewStyle,
};

const light = {
	text: {
		color: "#212121",
	} as TextStyle,
	container: {
		backgroundColor: "#ffd54f",
	} as ViewStyle,
};

const Theme = { dark, light };

const useTheme = (): typeof Theme["dark"] => {
	const scheme = useColorScheme();
	return Theme[scheme || "light"];
};

export default useTheme;
