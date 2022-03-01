// @generated: @expo/next-adapter@3.1.18
import { basename, dirname, extname, relative, sep } from "path";
import fs from "fs/promises";
import klaw from "klaw";
import matter from "gray-matter";
import { parseMarkdown } from "../util/markdown";
import { POSTSDIR, POSTSPERPAGE } from "../constants";
import type { GetStaticPaths, GetStaticProps } from "next";
import type { Post } from "../types/post";

import React, { useEffect, useState } from "react";
import { useWindowDimensions, SafeAreaView, ScrollView } from "react-native";
import Masonry from "@react-native-seoul/masonry-list";
import Header from "../components/header";
import Footer from "../components/footer";
import Card from "../components/card";

const App: React.FC<{
	posts: [string, Post][];
	page: number;
	total: number;
}> = ({ posts, page, total }) => {
	const { width } = useWindowDimensions();
	const [header, setHeader] = useState(true);
	const [columns, setColumns] = useState(3);

	useEffect(
		() =>
			setColumns(
				Math.max(1, Math.min(3, Math.floor((width - 100) / 282))),
			),
		[width],
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
		<SafeAreaView
			style={{
				flex: 1,
			}}>
			<ScrollView
				onScroll={(ev) => {
					if (ev.nativeEvent.contentOffset.y <= 100 !== header) {
						setHeader(!header);
					}
				}}
				scrollEventThrottle={100}
				stickyHeaderIndices={[0]}>
				<Header opaque={header} />
				<Masonry
					data={posts}
					renderItem={renderItem}
					numColumns={columns}
					contentContainerStyle={{ alignItems: "center" }}
				/>
				<Footer page={page} total={total} />
			</ScrollView>
		</SafeAreaView>
	);
};

export default App;

export const getStaticPaths: GetStaticPaths = async () => {
	let counter = 0;
	for await (const { path, stats } of klaw(POSTSDIR, { depthLimit: 4 })) {
		const parts = relative(POSTSDIR, path).split(sep);
		if (parts.length === 4) {
			counter++;
		}
	}
	return {
		paths: new Array(Math.ceil(counter / POSTSPERPAGE))
			.fill(null)
			.map((_, i) => ({ params: { page: !!i ? [`${++i}`] : [] } })),
		fallback: false,
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
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
