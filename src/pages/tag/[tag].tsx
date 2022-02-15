import { basename, dirname, extname, join, relative } from "path";
import fs from "fs/promises";
import klaw from "klaw";
import matter from "gray-matter";
import { parseMarkdown } from "../../util/markdown";
import { POSTSDIR } from "../../constants";
import type { GetStaticPaths, GetStaticProps } from "next";
import type { Post } from "../../types/post";

import React, { useCallback, useRef, useState } from "react";
import {
	NativeScrollEvent,
	NativeSyntheticEvent,
	SafeAreaView,
	ScrollView,
	Text,
} from "react-native";
import { useSelectedLanguage, useTranslation } from "next-export-i18n";
import Masonry from "@react-native-seoul/masonry-list";
import useTheme from "../_theme";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Card from "../../components/card";

const TagListing: React.FC<{
	tag: string;
	posts: { [slug: string]: Post };
}> = ({ tag, posts }) => {
	const theme = useTheme();
	const { lang } = useSelectedLanguage();
	const { t } = useTranslation();
	const scrollView = useRef<ScrollView>();
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
	}): React.ReactElement<any, string> => (
		<Card slug={slug} post={post}></Card>
	);

	return (
		<SafeAreaView style={[theme?.main.container]}>
			<ScrollView stickyHeaderIndices={[0]} onScroll={headerCallback}>
				<Header opaque={header}></Header>
				<Masonry
					innerRef={scrollView}
					ListHeaderComponent={
						<Text
							style={[
								theme?.text.heading,
								theme?.tagcloud.header,
							]}>
							{t("post.tag")} {tag}
						</Text>
					}
					ListHeaderComponentStyle={[theme?.header.container]}
					ListFooterComponent={<Footer></Footer>}
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
					contentContainerStyle={[theme?.card.list]}></Masonry>
			</ScrollView>
		</SafeAreaView>
	);
};

export default TagListing;

export const getStaticPaths: GetStaticPaths = async () => {
	const tags = new Set<string>();
	for await (const { path, stats } of klaw(POSTSDIR)) {
		if (stats.isFile()) {
			const raw = await fs.readFile(path, "utf8");
			const matt = matter(raw);
			matt.data.tags.split(" ").forEach((tag: string) => tags.add(tag));
		}
	}
	return {
		paths: [...tags].map((tag) => ({
			params: { tag },
		})),
		fallback: false,
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const tag = params?.tag as string;
	const posts: { [slug: string]: Post } = {};
	for await (const { path, stats } of klaw(POSTSDIR)) {
		if (stats.isFile()) {
			const raw = await fs.readFile(path, "utf8");
			const matt = matter(raw, {
				excerpt: true,
				excerpt_separator: "<!--more-->",
			});
			const tags = matt.data.tags.split(" ");
			if (tags.includes(tag)) {
				const lang = basename(path, extname(path));
				const slug = relative(POSTSDIR, dirname(path));
				if (!posts[slug]) {
					posts[slug] = {};
				}
				posts[slug][lang] = {
					title: matt.data.title,
					publish: matt.data.publish,
					edited: matt.data.edited || null,
					tags,
					image: matt.data.image || null,
					source: matt.data.source || null,
					excerpt: parseMarkdown(matt.excerpt as string),
				};
			}
		}
	}
	return { props: { tag, posts } };
};
