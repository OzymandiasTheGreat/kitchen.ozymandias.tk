import React, {
	MutableRefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import Link from "next/link";
import { Animated, Image, Text, View } from "react-native";
import { A, Header } from "@expo/html-elements";
import { useSelectedLanguage, useLanguageQuery } from "next-export-i18n";
import { translations } from "../../i18n/index";
import useTheme from "../pages/_theme";

const languages = Object.keys(translations);
const flags: Record<string, string> = {
	en: "🇺🇸",
	lt: "🇱🇹",
};
const AnimatedHeader = Animated.createAnimatedComponent(Header);

const BlogHeader: React.FC<{
	opaque: boolean;
}> = ({ opaque }) => {
	const theme = useTheme();
	const backgroundAnimation = useRef(new Animated.Value(0)).current;
	const backgroundColor = backgroundAnimation.interpolate({
		inputRange: [0, 1],
		outputRange: [
			theme?.headerContainer.backgroundColorOut as string,
			theme?.headerContainer.backgroundColorIn as string,
		],
	});
	const heightAnimation = useRef(new Animated.Value(1)).current;
	const height = heightAnimation.interpolate({
		inputRange: [0, 1],
		outputRange: [
			theme?.headerContainer.minHeight as number,
			theme?.headerContainer.maxHeight as number,
		],
	});
	const { lang } = useSelectedLanguage();
	const [query] = useLanguageQuery();

	useEffect(
		() => {
			Animated.timing(backgroundAnimation, {
				toValue: +opaque,
				duration: 200,
				useNativeDriver: false,
			}).start();
			Animated.timing(heightAnimation, {
				toValue: +!opaque,
				duration: 350,
				useNativeDriver: false,
			}).start();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[opaque],
	);

	return (
		<AnimatedHeader
			style={[
				theme?.headerContainer,
				{
					backgroundColor,
					height,
				},
			]}>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					width: 320,
				}}>
				<Link passHref href={{ pathname: "/", query: { lang } }}>
					<A
						style={[
							theme?.headerText,
							{
								fontSize:
									(theme?.headerText.fontSize || 20) *
									(opaque ? 0.8 : 1),
							},
						]}>
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
								style={[theme?.headerIcon, { marginRight: 5 }]}
							/>
							<Text
								style={[
									theme?.headerText,
									{
										fontSize:
											(theme?.headerText.fontSize ||
												20) * (opaque ? 0.8 : 1),
									},
								]}>
								Kitchen Escapades
							</Text>
						</View>
					</A>
				</Link>
				<A
					href="https://tomasrav.me/"
					style={[
						theme?.headerText,
						{
							fontSize:
								(theme?.headerText.fontSize || 20) *
								(opaque ? 0.8 : 1),
						},
					]}>
					<View
						style={{ flexDirection: "row", alignItems: "center" }}>
						{/* eslint-disable-next-line jsx-a11y/alt-text */}
						<Image
							source={{
								uri: "/main_logo.svg",
							}}
							style={[
								theme?.headerIcon,
								{ marginRight: 5 },
							]}></Image>
						<Text
							style={[
								theme?.headerText,
								{
									fontSize:
										(theme?.headerText.fontSize || 20) *
										(opaque ? 0.8 : 1),
								},
							]}>
							Main Website
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
									theme?.headerText,
									{
										fontSize: theme?.headerIcon.height,
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
