import React, { useCallback, useState } from "react";
import {
	Image,
	NativeScrollEvent,
	NativeSyntheticEvent,
	SafeAreaView,
	ScrollView,
	View,
} from "react-native";
import { useSelectedLanguage, useTranslation } from "next-export-i18n";
import { A, H1, P } from "@expo/html-elements";
import useTheme from "./_theme";
import { randInt } from "../util/random";
import Header from "../components/header";
import Footer from "../components/footer";

const About: React.FC = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const [header, setHeader] = useState(true);
	const [imageSource] = useState({
		uri: `/profile/${randInt(1, 10)}.jpg`,
	});

	const headerCallback = useCallback(
		(ev: NativeSyntheticEvent<NativeScrollEvent>) => {
			if (ev.nativeEvent.contentOffset.y <= 100 !== header) {
				setHeader(ev.nativeEvent.contentOffset.y <= 100);
			}
		},
		[header],
	);

	return (
		<SafeAreaView style={[theme?.main.container]}>
			<ScrollView
				onScroll={headerCallback}
				scrollEventThrottle={100}
				stickyHeaderIndices={[0]}
				style={[theme?.about.scroller]}>
				<Header opaque={header}></Header>
				<View style={[theme?.about.container]}>
					{/* eslint-disable-next-line jsx-a11y/alt-text */}
					<Image
						source={imageSource}
						style={[theme?.about.image]}></Image>
					<H1 style={[theme?.text.heading, { alignSelf: "center" }]}>
						{t("about.title")}
					</H1>
					<P style={[theme?.text.body]}>{t("about.p1")}</P>
					<P style={[theme?.text.body]}>{t("about.p2")}</P>
					<P style={[theme?.text.body]}>{t("about.p3")}</P>
					<P style={[theme?.text.body]}>{t("about.p4")}</P>
					<P style={[theme?.text.body]}>
						{t("about.p5")}{" "}
						<A href="https://tomasrav.me/">tomasrav.me</A>
					</P>
					<P style={[theme?.text.body]}>{t("about.p6")}</P>
				</View>
				<Footer></Footer>
			</ScrollView>
		</SafeAreaView>
	);
};

export default About;
