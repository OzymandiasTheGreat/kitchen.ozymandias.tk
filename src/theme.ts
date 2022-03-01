import { TextStyle } from "react-native";

export const FONT_HEADING = "Dancing Script";
export const FONT_REGULAR = "Poppins";
export const FONT_CODE = "Fira Code";
export const FONT_WEIGHT_H = "700";
export const FONT_WEIGHT_R = "400";
export const FONT_WEIGHT_S = "700";
export const FONT_STYLE_H = "normal";
export const FONT_STYLE_R = "normal";
export const FONT_STYLE_E = "italic";
export const FONT_SIZE_R = 16;
export const FONT_SIZE_C = 14;
export const COLOR_SITE_BG_DARK = "#212121";
export const COLOR_TEXT_BG_DARK = "#424242";
export const COLOR_TEXT_FG_DARK = "#fafafa";
export const COLOR_SITE_BG_LIGHT = "#ffd54f";
export const COLOR_TEXT_BG_LIGHT = "#fafafa";
export const COLOR_TEXT_FG_LIGHT = "#212121";
export const COLOR_LINK = "#4fc3f7";
export const STYLE_HEADING = {
	fontFamily: FONT_HEADING,
	fontWeight: FONT_WEIGHT_H,
	fontStyle: FONT_STYLE_H,
} as TextStyle;
export const STYLE_REGULAR = {
	fontFamily: FONT_REGULAR,
	fontWeight: FONT_WEIGHT_R,
	fontStyle: FONT_STYLE_R,
	fontSize: FONT_SIZE_R,
} as TextStyle;
export const STYLE_EMPHASIS = {
	fontFamily: FONT_REGULAR,
	fontWeight: FONT_WEIGHT_R,
	fontStyle: FONT_STYLE_E,
} as TextStyle;
export const STYLE_STRONG = {
	fontFamily: FONT_REGULAR,
	fontWeight: FONT_WEIGHT_S,
	fontStyle: FONT_STYLE_R,
} as TextStyle;
export const STYLE_CODE = {
	fontFamily: FONT_CODE,
	fontWeight: FONT_WEIGHT_R,
	fontStyle: FONT_STYLE_R,
	fontSize: FONT_SIZE_C,
} as TextStyle;

export function setOpacity(color: string, opacity: number): string {
	return (
		color +
		Math.floor(opacity * 255)
			.toString(16)
			.padStart(2, "0")
	);
}
