import React, { useCallback, useEffect, useState } from "react";
import {
	useColorScheme,
	useWindowDimensions,
	Image,
	NativeScrollEvent,
	NativeSyntheticEvent,
	SafeAreaView,
	ScrollView,
	View,
} from "react-native";
import { useTranslation } from "next-export-i18n";
import { A, H1, P } from "@expo/html-elements";
import { randInt } from "../util/random";
import Header from "../components/header";
import Footer from "../components/footer";
import {
	COLOR_TEXT_BG_DARK,
	COLOR_TEXT_BG_LIGHT,
	COLOR_TEXT_FG_DARK,
	COLOR_TEXT_FG_LIGHT,
	STYLE_HEADING,
	STYLE_REGULAR,
} from "../theme";

const About: React.FC = () => {
	const scheme = useColorScheme();
	const { width } = useWindowDimensions();
	const { t } = useTranslation();
	const [dark, setDark] = useState(false);
	const [small, setSmall] = useState(true);
	const [header, setHeader] = useState(true);
	const [imageSource] = useState({
		uri: `/profile/${randInt(1, 10)}.jpg`,
	});

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
		<SafeAreaView
			style={{
				flex: 1,
			}}>
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
					{/* eslint-disable-next-line jsx-a11y/alt-text */}
					<Image
						source={imageSource}
						style={{
							width: 256,
							height: 256,
							alignSelf: "center",
							borderRadius: "50%" as any,
							borderColor: dark
								? COLOR_TEXT_FG_DARK
								: COLOR_TEXT_FG_LIGHT,
							borderWidth: 10,
							marginBottom: 50,
						}}></Image>
					<H1
						style={[
							STYLE_HEADING,
							{
								color: dark
									? COLOR_TEXT_FG_DARK
									: COLOR_TEXT_FG_LIGHT,
								fontSize: 28,
								alignSelf: "center",
							},
						]}>
						{t("about.title")}
					</H1>
					<P
						style={[
							STYLE_REGULAR,
							{
								color: dark
									? COLOR_TEXT_FG_DARK
									: COLOR_TEXT_FG_LIGHT,
							},
						]}>
						{t("about.p1")}
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
						{t("about.p2")}
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
						{t("about.p3")}
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
						{t("about.p4")}
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
						{t("about.p5")}{" "}
						<A href="https://tomasrav.me/">tomasrav.me</A>
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
						{t("about.p6")}
					</P>
				</View>
				<Footer></Footer>
			</ScrollView>
		</SafeAreaView>
	);
};

export default About;
