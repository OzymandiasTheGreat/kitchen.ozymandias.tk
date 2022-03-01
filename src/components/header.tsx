import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
	useColorScheme,
	useWindowDimensions,
	Animated,
	Image,
	Text,
	View,
	ViewStyle,
} from "react-native";
import { A, Header, P } from "@expo/html-elements";
import {
	useSelectedLanguage,
	useLanguageQuery,
	useTranslation,
} from "next-export-i18n";
import { translations } from "../../i18n/index";
import { randInt } from "../util/random";
import {
	COLOR_TEXT_BG_DARK,
	COLOR_TEXT_BG_LIGHT,
	COLOR_TEXT_FG_DARK,
	COLOR_TEXT_FG_LIGHT,
	FONT_HEADING,
	setOpacity,
	STYLE_HEADING,
} from "../theme";
import useTheme from "../pages/_theme";

const languages = Object.keys(translations);
const flags: Record<string, string> = {
	en: "🇺🇸",
	lt: "🇱🇹",
};
const AnimatedHeader = Animated.createAnimatedComponent(Header);

const Profile: React.FC<{ visible: boolean }> = ({ visible }) => {
	const { t } = useTranslation();
	const scheme = useColorScheme();
	const [dark, setDark] = useState(false);
	const [index] = useState(randInt(1, 10));

	useEffect(() => setDark(scheme === "dark"), [scheme]);

	return (
		<View style={{ flexDirection: "row", alignItems: "center" }}>
			{/* eslint-disable-next-line jsx-a11y/alt-text */}
			<Image
				source={{
					uri: `/profile/${index}.jpg`,
				}}
				style={{
					display: visible ? "flex" : "none",
					width: 70,
					height: 70,
					borderColor: dark
						? COLOR_TEXT_FG_DARK
						: COLOR_TEXT_FG_LIGHT,
					borderRadius: "50%" as any,
					borderWidth: 5,
					marginRight: 15,
				}}></Image>
			<P
				style={[
					STYLE_HEADING,
					{
						display: visible ? "flex" : "none",
						color: dark ? COLOR_TEXT_FG_DARK : COLOR_TEXT_FG_LIGHT,
						fontSize: 20,
						textAlignVertical: "center",
					},
				]}>
				{t("site.tagline")}
			</P>
		</View>
	);
};

const BlogHeader: React.FC<{
	opaque: boolean;
	style?: ViewStyle;
}> = ({ opaque, style }) => {
	const scheme = useColorScheme();
	const [dark, setDark] = useState(false);
	const { width } = useWindowDimensions();
	const backgroundAnimation = useRef(new Animated.Value(0)).current;
	const backgroundColor = backgroundAnimation.interpolate({
		inputRange: [0, 1],
		outputRange: [
			setOpacity(dark ? COLOR_TEXT_BG_DARK : COLOR_TEXT_BG_LIGHT, 0.3),
			dark ? COLOR_TEXT_BG_DARK : COLOR_TEXT_BG_LIGHT,
		],
	});
	const heightAnimation = useRef(new Animated.Value(0)).current;
	const height = heightAnimation.interpolate({
		inputRange: [0, 1],
		outputRange: [40, 80],
	});
	const { lang } = useSelectedLanguage();
	const { t } = useTranslation();
	const [query] = useLanguageQuery();
	const params = new URLSearchParams({ lang }).toString();

	useEffect(() => setDark(scheme === "dark"), [scheme]);
	useEffect(
		() => {
			Animated.timing(backgroundAnimation, {
				toValue: +opaque,
				duration: 300,
				useNativeDriver: false,
			}).start();
			Animated.timing(heightAnimation, {
				toValue: +opaque,
				duration: 300,
				useNativeDriver: false,
			}).start();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[opaque],
	);

	return (
		<AnimatedHeader
			style={[
				{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					paddingVertical: 3,
					paddingHorizontal: 20,
					marginBottom: 20,
				},
				style,
				{
					backgroundColor,
					height,
				},
			]}>
			<Profile visible={opaque && width > 800}></Profile>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					width: 330,
				}}>
				<Link passHref href={{ pathname: "/", query: { lang } }}>
					<A>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
							}}>
							{/* eslint-disable-next-line jsx-a11y/alt-text */}
							<Image
								source={{
									uri: "/favicon.svg",
								}}
								style={{
									width: 24,
									height: 24,
									resizeMode: "contain",
									marginRight: 5,
								}}
							/>
							<Text
								style={
									opaque
										? {
												color: dark
													? COLOR_TEXT_FG_DARK
													: COLOR_TEXT_FG_LIGHT,
												fontFamily: FONT_HEADING,
												fontSize: 22,
												maxWidth: 180,
										  }
										: {
												color: dark
													? COLOR_TEXT_FG_DARK
													: COLOR_TEXT_FG_LIGHT,
												fontFamily: FONT_HEADING,
												fontSize: 17,
												maxWidth: 180,
										  }
								}>
								{t("site.title")}
							</Text>
						</View>
					</A>
				</Link>
				<A href={`https://tomasrav.me/?${params}`}>
					<View
						style={{ flexDirection: "row", alignItems: "center" }}>
						{/* eslint-disable-next-line jsx-a11y/alt-text */}
						<Image
							source={{
								uri: "/main_logo.svg",
							}}
							style={{
								width: 24,
								height: 24,
								resizeMode: "contain",
								marginRight: 5,
							}}></Image>
						<Text
							style={
								opaque
									? {
											color: dark
												? COLOR_TEXT_FG_DARK
												: COLOR_TEXT_FG_LIGHT,
											fontFamily: FONT_HEADING,
											fontSize: 22,
											maxWidth: 180,
									  }
									: {
											color: dark
												? COLOR_TEXT_FG_DARK
												: COLOR_TEXT_FG_LIGHT,
											fontFamily: FONT_HEADING,
											fontSize: 17,
											maxWidth: 180,
									  }
							}>
							{t("site.main")}
						</Text>
					</View>
				</A>
				{languages.map((lang, i) => {
					const last = languages.length === ++i;
					return (
						<Link
							key={lang}
							passHref
							href={{ query: { ...query, lang } }}>
							<A
								style={{
									fontSize: 24,
									marginLeft: 5,
								}}>
								{flags[lang]}
							</A>
						</Link>
					);
				})}
			</View>
		</AnimatedHeader>
	);
};

export default BlogHeader;
