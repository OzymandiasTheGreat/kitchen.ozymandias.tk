// @generated: @expo/next-adapter@3.1.18
import { basename, dirname, extname, join, relative } from "path";
import fs from "fs/promises";
import klaw from "klaw";
import matter from "gray-matter";
import { parseMarkdown } from "../util/markdown";
import type { GetStaticProps } from "next";
import type { Post } from "../types/post";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { useSelectedLanguage } from "next-export-i18n";
import Masonry from "@react-native-seoul/masonry-list";
import useTheme from "./_theme";
import Header from "../components/header";
import Footer from "../components/footer";
import Card from "../components/card";

const App: React.FC<{ posts: { [slug: string]: Post } }> = ({ posts }) => {
	const theme = useTheme();
	const { lang } = useSelectedLanguage();
	const scrollView = useRef<ScrollView>();
	const [header, setHeader] = useState(true);

	const headerCallback = useCallback(
		(ev: any) => {
			if (ev.target.scrollTop <= 100 !== header) {
				setHeader(ev.target.scrollTop <= 100);
			}
		},
		[header],
	);

	useEffect(() => {
		let node: any;
		if (scrollView.current) {
			node = scrollView.current.getScrollableNode();
			node.addEventListener("scroll", headerCallback);
		}
		return () => node?.removeEventListener("scroll", headerCallback);
	}, [headerCallback]);

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
			<Masonry
				innerRef={scrollView}
				ListHeaderComponent={<Header opaque={header}></Header>}
				ListHeaderComponentStyle={[theme?.header.container]}
				ListFooterComponent={<Footer></Footer>}
				data={Object.entries(posts)
					.sort(([_, a], [$, b]) =>
						(a[lang]?.edited || a[lang]?.publish).localeCompare(
							b[lang]?.edited || b[lang]?.publish,
						),
					)
					.reverse()}
				renderItem={renderItem}
				stickyHeaderIndices={[0]}
				centerContent={true}
				numColumns={theme?.card.columns}
				contentContainerStyle={[theme?.card.list]}></Masonry>
		</SafeAreaView>
	);
};

export default App;

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const postsDir = join(process.cwd(), "content/posts");
	const posts: { [slug: string]: Post } = {};
	for await (const { path, stats } of klaw(postsDir)) {
		if (stats.isFile()) {
			const raw = await fs.readFile(path, "utf8");
			const matt = matter(raw, {
				excerpt: true,
				excerpt_separator: "<!--more-->",
			});
			const lang = basename(path, extname(path));
			const slug = relative(postsDir, dirname(path));
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
	return { props: { posts } };
};
