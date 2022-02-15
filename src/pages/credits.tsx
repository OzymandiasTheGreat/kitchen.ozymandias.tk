import React, { useCallback, useState } from "react";
import {
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
import useTheme from "./_theme";
import Header from "../components/header";
import Footer from "../components/footer";

const Credits: React.FC = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const [header, setHeader] = useState(true);

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
				style={[theme?.credits.scroller]}>
				<Header opaque={header}></Header>
				<View style={[theme?.credits.container]}>
					<P style={[theme?.text.body]}>
						{t("credits.content")}
						<A href="https://creativecommons.org/licenses/by/4.0/">
							CC-BY
						</A>{" "}
						©️ {t("credits.name")}.
					</P>
					<P style={[theme?.text.body]}>
						{t("credits.third-party")}
					</P>
					<P style={[theme?.text.body]}>
						{t("credits.graphics1")}
						<A href="https://thenounproject.com/">Noun Project </A>
						{t("credits.graphics2")}
						<A href="https://creativecommons.org/licenses/by/4.0/">
							CC-BY
						</A>{" "}
						{t("credits.graphics3")}:
						<UL>
							<LI>
								{/* eslint-disable-next-line jsx-a11y/alt-text */}
								<Image
									source={{
										uri: "/credits/chef.svg",
										...theme?.credits.image,
									}}></Image>
								<Text style={[theme?.text.body]}>
									{t("credits.byline")}
									<A href="https://thenounproject.com/susannanova/">
										Susannanova
									</A>
								</Text>
							</LI>
							<LI>
								{/* eslint-disable-next-line jsx-a11y/alt-text */}
								<Image
									source={{
										uri: "/credits/cat.svg",
										...theme?.credits.image,
									}}></Image>
								<Text style={[theme?.text.body]}>
									{t("credits.byline")}
									<A href="https://thenounproject.com/mte/">
										m. turan ercan
									</A>
								</Text>
							</LI>
						</UL>
					</P>
					<P style={[theme?.text.body]}>
						{t("credits.tech")}
						<A href="https://github.com/OzymandiasTheGreat/kitchen.tomasrav.me">
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
