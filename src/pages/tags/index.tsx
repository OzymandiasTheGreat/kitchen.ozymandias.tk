import fs from "fs/promises";
import klaw from "klaw";
import matter from "gray-matter";
import { POSTSDIR } from "../../constants";
import type { GetStaticProps } from "next";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
	useColorScheme,
	useWindowDimensions,
	NativeScrollEvent,
	NativeSyntheticEvent,
	SafeAreaView,
	ScrollView,
	View,
} from "react-native";
import { useSelectedLanguage } from "next-export-i18n";
import { A } from "@expo/html-elements";
import NoSSR from "react-no-ssr";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { randInt } from "../../util/random";
import {
	COLOR_TEXT_BG_DARK,
	COLOR_TEXT_BG_LIGHT,
	COLOR_TEXT_FG_DARK,
	COLOR_TEXT_FG_LIGHT,
	STYLE_REGULAR,
} from "../../theme";

const Tags: React.FC<{ tags: Record<string, number> }> = ({ tags }) => {
	const scheme = useColorScheme();
	const { width } = useWindowDimensions();
	const { lang } = useSelectedLanguage();
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
						flex: 1,
						width: "100%",
						alignItems: "center",
						justifyContent: "center",
						marginBottom: 50,
					}}>
					<View
						style={{
							backgroundColor: dark
								? COLOR_TEXT_BG_DARK
								: COLOR_TEXT_BG_LIGHT,
							flexDirection: "row",
							flexWrap: "wrap",
							alignItems: "center",
							justifyContent: "space-around",
							width: small ? "98%" : "80%",
							maxWidth: 600,
							paddingVertical: 25,
							paddingHorizontal: 50,
							borderRadius: 3,
						}}>
						<NoSSR>
							{Object.entries(tags)
								.sort(() => randInt(-1, 1))
								.map(([tag, count]) => (
									<Link
										key={tag}
										passHref
										href={{
											pathname: `/tags/${tag}`,
											query: { lang },
										}}>
										<A
											style={[
												STYLE_REGULAR,
												{
													color: dark
														? COLOR_TEXT_FG_DARK
														: COLOR_TEXT_FG_LIGHT,
													fontSize: 10,
													margin: 15,
												},
												{
													fontSize:
														10 * count * 0.75,
												},
											]}>
											{tag}
										</A>
									</Link>
								))}
						</NoSSR>
					</View>
				</View>
				<Footer></Footer>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Tags;

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const tags: Record<string, number> = {};
	for await (const { path, stats } of klaw(POSTSDIR)) {
		if (stats.isFile()) {
			const raw = await fs.readFile(path, "utf8");
			const matt = matter(raw);
			const found = matt.data.tags.split(" ");
			for (let tag of found) {
				if (tag in tags) {
					tags[tag]++;
				} else {
					tags[tag] = 1;
				}
			}
		}
	}
	return { props: { tags } };
};
