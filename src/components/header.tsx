import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Animated, Image, Text, View, ViewStyle } from "react-native";
import { A, Header, P } from "@expo/html-elements";
import {
	useSelectedLanguage,
	useLanguageQuery,
	useTranslation,
} from "next-export-i18n";
import { translations } from "../../i18n/index";
import useTheme from "../pages/_theme";
import { randInt } from "../util/random";

const languages = Object.keys(translations);
const flags: Record<string, string> = {
	en: "🇺🇸",
	lt: "🇱🇹",
};
const AnimatedHeader = Animated.createAnimatedComponent(Header);

const Profile: React.FC<{ visible: boolean }> = ({ visible }) => {
	const [index] = useState(randInt(1, 10));
	const { t } = useTranslation();
	const theme = useTheme();

	return (
		<View style={[theme?.profile.container]}>
			{/* eslint-disable-next-line jsx-a11y/alt-text */}
			<Image
				source={{
					uri: `/profile/${index}.jpg`,
				}}
				style={[
					theme?.profile.image,
					,
					{ display: visible ? "flex" : "none" },
				]}></Image>
			<P
				style={[
					theme?.text.heading,
					theme?.profile.text,
					,
					{ display: visible ? "flex" : "none" },
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
	const theme = useTheme();
	const backgroundAnimation = useRef(new Animated.Value(0)).current;
	const backgroundColor = backgroundAnimation.interpolate({
		inputRange: [0, 1],
		outputRange: [
			theme?.header.transparent.backgroundColor as string,
			theme?.header.opaque.backgroundColor as string,
		],
	});
	const heightAnimation = useRef(new Animated.Value(0)).current;
	const height = heightAnimation.interpolate({
		inputRange: [0, 1],
		outputRange: [
			theme?.header.transparent.height as number,
			theme?.header.opaque.height as number,
		],
	});
	const { lang } = useSelectedLanguage();
	const { t } = useTranslation();
	const [query] = useLanguageQuery();
	const params = new URLSearchParams({ lang }).toString();

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
				theme?.header.style,
				style,
				{
					backgroundColor,
					height,
				},
			]}>
			<Profile visible={opaque}></Profile>
			<View style={[theme?.header.inner]}>
				<Link passHref href={{ pathname: "/", query: { lang } }}>
					<A>
						<View style={[theme?.header.link]}>
							{/* eslint-disable-next-line jsx-a11y/alt-text */}
							<Image
								source={{
									uri: "/favicon.svg",
								}}
								style={[
									theme?.header.icon,
									{ marginRight: 5 },
								]}
							/>
							<Text
								style={[
									opaque
										? theme?.header.textOpaque
										: theme?.header.textTransparent,
								]}>
								{t("site.title")}
							</Text>
						</View>
					</A>
				</Link>
				<A href={`https://tomasrav.me/?${params}`}>
					<View style={[theme?.header.link]}>
						{/* eslint-disable-next-line jsx-a11y/alt-text */}
						<Image
							source={{
								uri: "/main_logo.svg",
							}}
							style={[theme?.header.icon]}></Image>
						<Text
							style={[
								opaque
									? theme?.header.textOpaque
									: theme?.header.textTransparent,
							]}>
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
								style={[
									theme?.header.textOpaque,
									{
										fontSize: theme?.header.icon.height,
										marginLeft: 5,
									},
								]}>
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
