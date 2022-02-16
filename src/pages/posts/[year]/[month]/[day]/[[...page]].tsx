import { basename, dirname, extname, join, relative, sep } from "path";
import fs from "fs/promises";
import klaw from "klaw";
import matter from "gray-matter";
import { parseMarkdown } from "../../../../../util/markdown";
import { POSTSDIR, POSTSPERPAGE } from "../../../../../constants";
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

const Day: React.FC<{
	year: string;
	month: string;
	day: string;
	posts: [string, Post][];
	page: number;
	total: number;
}> = ({ year, month, day, posts, page, total }) => {
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
							{new Date(
								`${year}-${month}-${day}`,
							).toLocaleDateString(lang)}
						</Text>
					}
					data={posts}
					renderItem={renderItem}
					centerContent={true}
					numColumns={theme?.card.columns}
					containerStyle={[{ minHeight: "100%" }]}
					contentContainerStyle={[theme?.card.list]}></Masonry>
				<Footer
					page={page}
					total={total}
					query={{ year, month, day }}></Footer>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Day;

export const getStaticPaths: GetStaticPaths = async () => {
	const counter: Record<string, number> = {};
	for await (const { path, stats } of klaw(POSTSDIR, { depthLimit: 4 })) {
		const parts = relative(POSTSDIR, dirname(path)).split(sep);
		if (parts.length === 3) {
			const slug = parts.join("-");
			if (slug in counter) {
				counter[slug]++;
			} else {
				counter[slug] = 1;
			}
		}
	}
	return {
		paths: Object.entries(counter)
			.map(([slug, count]) =>
				new Array(Math.ceil(count / POSTSPERPAGE))
					.fill(null)
					.map((_, i) => {
						const [year, month, day] = slug.split("-");
						return {
							params: {
								page: !!i ? [`${++i}`] : [],
								year,
								month,
								day,
							},
						};
					}),
			)
			.flat(1),
		fallback: false,
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const year = params?.year as string;
	const month = params?.month as string;
	const day = params?.day as string;
	const page = parseInt(params?.page?.[0] || "1") - 1;
	const root = join(POSTSDIR, year, month, day);
	const posts: { [slug: string]: Post } = {};
	const langs: Set<string> = new Set();
	for await (const { path, stats } of klaw(root, { depthLimit: 2 })) {
		if (stats.isFile()) {
			const raw = await fs.readFile(path, "utf8");
			const matt = matter(raw, {
				excerpt: true,
				excerpt_separator: "<!--more-->",
			});
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
				tags: matt.data.tags.split(" "),
				image: matt.data.image || null,
				source: matt.data.source || null,
				excerpt: parseMarkdown(matt.excerpt as string),
			};
		}
	}
	return {
		props: {
			year,
			month,
			day,
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
