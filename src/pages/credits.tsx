import React, { useCallback, useEffect, useState } from "react";
import {
	useColorScheme,
	useWindowDimensions,
	Image,
	NativeSyntheticEvent,
	NativeScrollEvent,
	SafeAreaView,
	ScrollView,
	Text,
	View,
} from "react-native";
import { useTranslation } from "next-export-i18n";
import { A, LI, P, UL } from "@expo/html-elements";
import Header from "../components/header";
import Footer from "../components/footer";
import {
	COLOR_LINK,
	COLOR_TEXT_BG_DARK,
	COLOR_TEXT_BG_LIGHT,
	COLOR_TEXT_FG_DARK,
	COLOR_TEXT_FG_LIGHT,
	STYLE_REGULAR,
} from "../theme";

const Credits: React.FC = () => {
	const scheme = useColorScheme();
	const { width } = useWindowDimensions();
	const { t } = useTranslation();
	const [dark, setDark] = useState(false);
	const [small, setSmall] = useState(true);
	const [header, setHeader] = useState(true);

	useEffect(() => setDark(scheme === "dark"), [scheme]);
	useEffect(() => setSmall(width < 600), [width]);

	const headerCallback = useCallback(
		(ev: NativeSyntheticEvent<NativeScrollEvent>) => {
			if (ev.nativeEvent.contentOffset.y <= 100 !== header) {
				setHeader(ev.nativeEvent.contentOffset.y <= 100);
			}
		},
		[header],
	);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ScrollView
				onScroll={headerCallback}
				scrollEventThrottle={100}
				stickyHeaderIndices={[0]}>
				<Header opaque={header}></Header>
				<View
					style={{
						backgroundColor: dark
							? COLOR_TEXT_BG_DARK
							: COLOR_TEXT_BG_LIGHT,
						width: small ? "98%" : "80%",
						maxWidth: 800,
						alignSelf: "center",
						padding: 50,
						borderRadius: 3,
						marginBottom: 50,
					}}>
					<P
						style={[
							STYLE_REGULAR,
							{
								color: dark
									? COLOR_TEXT_FG_DARK
									: COLOR_TEXT_FG_LIGHT,
							},
						]}>
						{t("credits.content")}
						<A
							style={{ color: COLOR_LINK }}
							href="https://creativecommons.org/licenses/by/4.0/">
							CC-BY
						</A>{" "}
						©️ {t("credits.name")}.
					</P>
					<P
						style={[
							STYLE_REGULAR,
							{
								color: dark
									? COLOR_TEXT_FG_DARK
									: COLOR_TEXT_FG_LIGHT,
							},
						]}>
						{t("credits.third-party")}
					</P>
					<P
						style={[
							STYLE_REGULAR,
							{
								color: dark
									? COLOR_TEXT_FG_DARK
									: COLOR_TEXT_FG_LIGHT,
							},
						]}>
						{t("credits.graphics1")}
						<A
							style={{ color: COLOR_LINK }}
							href="https://thenounproject.com/">
							Noun Project{" "}
						</A>
						{t("credits.graphics2")}
						<A
							style={{ color: COLOR_LINK }}
							href="https://creativecommons.org/licenses/by/4.0/">
							CC-BY
						</A>{" "}
						{t("credits.graphics3")}
						{"\n"}
						<UL>
							<LI>
								{/* eslint-disable-next-line jsx-a11y/alt-text */}
								<Image
									source={{
										uri: "/credits/chef.svg",
										width: 256,
										height: 256,
									}}></Image>
								<Text
									style={[
										STYLE_REGULAR,
										{
											color: dark
												? COLOR_TEXT_FG_DARK
												: COLOR_TEXT_FG_LIGHT,
										},
									]}>
									{t("credits.byline")}
									<A
										style={{ color: COLOR_LINK }}
										href="https://thenounproject.com/susannanova/">
										Susannanova
									</A>
								</Text>
							</LI>
							<LI>
								{/* eslint-disable-next-line jsx-a11y/alt-text */}
								<Image
									source={{
										uri: "/credits/cat.svg",
										width: 256,
										height: 256,
									}}></Image>
								<Text
									style={[
										STYLE_REGULAR,
										{
											color: dark
												? COLOR_TEXT_FG_DARK
												: COLOR_TEXT_FG_LIGHT,
										},
									]}>
									{t("credits.byline")}
									<A
										style={{ color: COLOR_LINK }}
										href="https://thenounproject.com/mte/">
										m. turan ercan
									</A>
								</Text>
							</LI>
						</UL>
					</P>
					<P
						style={[
							STYLE_REGULAR,
							{
								color: dark
									? COLOR_TEXT_FG_DARK
									: COLOR_TEXT_FG_LIGHT,
							},
						]}>
						{t("credits.tech")}
						<A
							style={{ color: COLOR_LINK }}
							href="https://github.com/OzymandiasTheGreat/kitchen.tomasrav.me">
							{t("credits.github")}
						</A>
						.
					</P>
				</View>
				<Footer></Footer>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Credits;
