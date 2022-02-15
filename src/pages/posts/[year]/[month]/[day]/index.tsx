import { basename, dirname, extname, join, relative, sep } from "path";
import fs from "fs/promises";
import klaw from "klaw";
import matter from "gray-matter";
import { parseMarkdown } from "../../../../../util/markdown";
import { POSTSDIR } from "../../../../../constants";
import type { GetStaticPaths, GetStaticProps } from "next";
import type { Post } from "../../../../../types/post";

import React, { useCallback, useState } from "react";
import {
	NativeSyntheticEvent,
	NativeScrollEvent,
	SafeAreaView,
	ScrollView,
	Text,
} from "react-native";
import { useSelectedLanguage } from "next-export-i18n";
import Masonry from "@react-native-seoul/masonry-list";
import useTheme from "../../../../_theme";
import Header from "../../../../../components/header";
import Footer from "../../../../../components/footer";
import Card from "../../../../../components/card";

const Day: React.FC<{ date: string; posts: { [slug: string]: Post } }> = ({
	date,
	posts,
}) => {
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

	const renderItem = ({
		item: [slug, post],
		i,
	}: {
		item: [string, Post];
		i: number;
	}) => <Card slug={slug} post={post}></Card>;

	return (
		<SafeAreaView style={[theme?.main.container]}>
			<ScrollView
				stickyHeaderIndices={[0]}
				onScroll={headerCallback}
				scrollEventThrottle={100}
				style={[theme?.archive.scroller]}>
				<Header opaque={header}></Header>
				<Masonry
					ListHeaderComponent={
						<Text
							style={[
								theme?.text.heading,
								{ marginBottom: 40 },
							]}>
							{new Date(date).toLocaleDateString(lang)}
						</Text>
					}
					data={Object.entries(posts)
						.sort(([_, a], [$, b]) =>
							(
								a[lang]?.edited || a[lang]?.publish
							).localeCompare(
								b[lang]?.edited || b[lang]?.publish,
							),
						)
						.reverse()}
					renderItem={renderItem}
					centerContent={true}
					numColumns={theme?.card.columns}
					containerStyle={[{ minHeight: "100%" }]}
					contentContainerStyle={[theme?.card.list]}></Masonry>
				<Footer></Footer>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Day;

export const getStaticPaths: GetStaticPaths = async () => {
	const paths: { params: { year: string; month: string; day: string } }[] =
		[];
	for await (const { path, stats } of klaw(POSTSDIR, { depthLimit: 3 })) {
		const parts = relative(POSTSDIR, path).split(sep);
		if (parts.length === 3) {
			const [year, month, day] = parts;
			paths.push({ params: { year, month, day } });
		}
	}
	return {
		paths,
		fallback: false,
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const date: string[] = [
		params?.year as string,
		params?.month as string,
		params?.day as string,
	];
	const root = join(POSTSDIR, ...date);
	const posts: { [slug: string]: Post } = {};
	for await (const { path, stats } of klaw(root, { depthLimit: 2 })) {
		if (stats.isFile()) {
			const raw = await fs.readFile(path, "utf8");
			const matt = matter(raw, {
				excerpt: true,
				excerpt_separator: "<!--more-->",
			});
			const lang = basename(path, extname(path));
			const slug = relative(POSTSDIR, dirname(path));
			if (!posts[slug]) {
				posts[slug] = {};
			}
			posts[slug][lang] = {
				title: matt.data.title,
				publish: matt.data.publish,
				edited: matt.data.edited || null,
				tags: matt.data.tags.split(" "),
				image: matt.data.image || null,
				source: matt.data.source || null,
				excerpt: parseMarkdown(matt.excerpt as string),
			};
		}
	}
	return { props: { date: date.join("-"), posts } };
};
