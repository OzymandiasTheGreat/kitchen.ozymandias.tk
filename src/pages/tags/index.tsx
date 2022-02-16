import { join } from "path";
import fs from "fs/promises";
import klaw from "klaw";
import matter from "gray-matter";
import { POSTSDIR } from "../../constants";
import type { GetStaticProps } from "next";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import {
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
import useTheme from "../_theme";
import { randInt } from "../../util/random";

const Tags: React.FC<{ tags: Record<string, number> }> = ({ tags }) => {
	const theme = useTheme();
	const { lang } = useSelectedLanguage();
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
		<SafeAreaView style={{ flex: 1 }}>
			<ScrollView
				onScroll={headerCallback}
				scrollEventThrottle={100}
				stickyHeaderIndices={[0]}>
				<Header opaque={header}></Header>
				<View style={[theme?.tagcloud.container]}>
					<View style={[theme?.tagcloud.style]}>
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
												theme?.text.body,
												theme?.tagcloud.tag,
												{
													fontSize:
														(theme?.tagcloud.tag
															.fontSize || 9) *
														count *
														0.75,
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
