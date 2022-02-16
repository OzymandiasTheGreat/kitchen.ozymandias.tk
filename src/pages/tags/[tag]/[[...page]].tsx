import { basename, dirname, extname, relative, sep } from "path";
import fs from "fs/promises";
import klaw from "klaw";
import matter from "gray-matter";
import { parseMarkdown } from "../../../util/markdown";
import { POSTSDIR, POSTSPERPAGE } from "../../../constants";
import type { GetStaticPaths, GetStaticProps } from "next";
import type { Post } from "../../../types/post";

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
import useTheme from "../../_theme";
import Header from "../../../components/header";
import Footer from "../../../components/footer";
import Card from "../../../components/card";

const TagListing: React.FC<{
	tag: string;
	posts: [string, Post][];
	page: number;
	total: number;
}> = ({ tag, posts, page, total }) => {
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
					ListFooterComponent={
						<Footer
							page={page}
							total={total}
							query={{ tag }}></Footer>
					}
					data={posts}
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
	const counter: Record<string, number> = {};
	for await (const { path, stats } of klaw(POSTSDIR)) {
		if (stats.isFile()) {
			const raw = await fs.readFile(path, "utf8");
			const matt = matter(raw);
			matt.data.tags.split(" ").forEach((tag: string) => {
				if (tag in counter) {
					counter[tag]++;
				} else {
					counter[tag] = 2;
				}
			});
		}
	}
	return {
		paths: Object.entries(counter)
			.map(([tag, count]) =>
				new Array(Math.ceil(count / 2 / POSTSPERPAGE))
					.fill(null)
					.map((_, i) => ({
						params: {
							tag,
							page: !!i ? [`${++i}`] : [],
						},
					})),
			)
			.flat(1),
		fallback: false,
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const tag = params?.tag as string;
	const page = parseInt(params?.page?.[0] || "1") - 1;
	const posts: { [slug: string]: Post } = {};
	const langs: Set<string> = new Set();
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
				langs.add(lang);
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
	return {
		props: {
			tag,
			posts: Object.entries(posts)
				.sort(([_, a], [$, b]) => {
					const lang = [...langs][0];
					return (a[lang]?.edited || a[lang]?.publish).localeCompare(
						b[lang]?.edited || b[lang]?.publish,
					);
				})
				.reverse()
				.slice(
					page * POSTSPERPAGE,
					page * POSTSPERPAGE + POSTSPERPAGE,
				),
			page,
			total: Math.ceil(Object.entries(posts).length / POSTSPERPAGE),
		},
	};
};
