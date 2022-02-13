/* eslint-disable jsx-a11y/alt-text */
import path from "path";
import fs from "fs/promises";
import matter, { GrayMatterFile } from "gray-matter";
import type { Root } from "mdast";
import type { JsonValue } from "type-fest";
import { parseMarkdown } from "../../../../../util/markdown";

import React, { useEffect, useRef, useState } from "react";
import {
	Animated,
	Image,
	NativeSyntheticEvent,
	NativeScrollEvent,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
	useTranslation,
	useLanguageQuery,
	useSelectedLanguage,
} from "next-export-i18n";
import { A, Article, H1, HR, P } from "@expo/html-elements";
import Fade from "react-native-fade-in-out";
import Header from "../../../../../components/header";
import useTheme from "../../../../_theme";
import { Markdown } from "../../../../../components/markdown";

interface Serializable {
	[x: string]: Root | JsonValue | undefined;
}

interface PostMatter extends Serializable {
	title: string;
	publish: string;
	edited?: string;
	tags: string[];
	excerpt: string;
	content: Root;
	image?: {
		uri: string;
		copyright: string;
	};
	source?: string;
}

interface Post {
	[lang: string]: PostMatter;
}

const Post: React.FC<{ post: Post }> = ({ post }) => {
	const theme = useTheme();
	const [query] = useLanguageQuery();
	const { lang } = useSelectedLanguage();
	const [headerOpaque, setHeaderOpaque] = useState(false);

	const headerOpaqueCallback = (
		ev: NativeSyntheticEvent<NativeScrollEvent>,
	) => {
		if (ev.nativeEvent.contentOffset.y > 80 !== headerOpaque) {
			setHeaderOpaque(ev.nativeEvent.contentOffset.y > 80);
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<ScrollView
				onScroll={headerOpaqueCallback}
				scrollEventThrottle={10000}
				stickyHeaderIndices={[0]}>
				<Header opaque={headerOpaque}></Header>
				{Object.entries(post).map(([contentLang, content]) => (
					<Fade
						key={contentLang}
						visible={lang === contentLang}
						duration={700}
						useNativeDriver={false}
						style={{
							display: lang === contentLang ? "flex" : "none",
						}}>
						<Article style={theme?.article}>
							<H1 style={[theme?.heading]}>{content.title}</H1>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
									width: "100%",
									marginBottom: 50,
								}}>
								<Text
									style={[
										theme?.text,
										{
											fontSize:
												(theme?.text.fontSize || 18) *
												0.7,
										},
									]}>
									by{" "}
									<Text
										style={[
											theme?.text,
											{
												fontSize:
													(theme?.text.fontSize ||
														18) * 0.8,
												fontStyle: "italic",
												fontFamily:
													theme?.text.fontItalic,
											},
										]}>
										Tomas Ravinskas
									</Text>
								</Text>
								<Text
									style={[
										theme?.text,
										{
											fontSize:
												(theme?.text.fontSize || 18) *
												0.7,
											fontWeight: "bold",
											fontFamily: theme?.text.fontBold,
										},
									]}>
									{new Date(
										content.edited || content.publish,
									).toLocaleString(contentLang)}
								</Text>
							</View>
							{content.image && (
								<View
									style={{
										alignItems: "center",
										marginBottom: 30,
									}}>
									<Image
										source={{ uri: content.image.uri }}
										style={theme?.image}></Image>
									<Text
										style={[
											theme?.text,
											{
												fontSize:
													(theme?.text.fontSize ||
														18) * 0.8,
												opacity: 0.5,
											},
										]}>
										©️ {content.image.copyright}
									</Text>
								</View>
							)}
							<Markdown node={content.content}></Markdown>
							<HR
								style={{
									backgroundColor: theme?.text.color,
									width: "95%",
								}}></HR>
							{content.source && (
								<P
									style={[
										theme?.text,
										{
											fontSize:
												(theme?.text.fontSize || 18) *
												0.85,
										},
									]}>
									Via{" "}
									<A href={content.source}>
										{content.source}
									</A>
								</P>
							)}
							<P
								style={[
									theme?.text,
									{
										fontSize:
											(theme?.text.fontSize || 18) *
											0.85,
										opacity: 0.6,
									},
								]}>
								Tagged:{" "}
								{content.tags.map((tag) => (
									<Link
										key={tag}
										passHref
										href={{
											pathname: `/tags/${tag}`,
											query: { lang },
										}}>
										<A
											style={[
												theme?.text,
												{
													fontFamily:
														theme?.text.fontItalic,
													fontStyle: "italic",
													opacity: 0.6,
													marginRight: 10,
												},
											]}>
											{tag}
										</A>
									</Link>
								))}
							</P>
						</Article>
					</Fade>
				))}
			</ScrollView>
		</View>
	);
};

export default Post;

const POSTS_PATH = path.join(process.cwd(), "content/posts");

export const getStaticPaths: GetStaticPaths = async () => {
	const years = (await fs.readdir(POSTS_PATH, { withFileTypes: true }))
		.filter((y) => y.isDirectory())
		.map((y) => y.name);
	const months = (
		await Promise.all(
			years.map((y) =>
				fs
					.readdir(path.join(POSTS_PATH, y), { withFileTypes: true })
					.then((ms) =>
						ms
							.filter((m) => m.isDirectory())
							.map((m) => path.join(y, m.name)),
					),
			),
		)
	).flat();
	const days = (
		await Promise.all(
			months.map((m) =>
				fs
					.readdir(path.join(POSTS_PATH, m), { withFileTypes: true })
					.then((ds) =>
						ds
							.filter((d) => d.isDirectory())
							.map((d) => path.join(m, d.name)),
					),
			),
		)
	).flat();
	const posts = (
		await Promise.all(
			days.map((d) =>
				fs
					.readdir(path.join(POSTS_PATH, d), { withFileTypes: true })
					.then((ps) => ps.map((p) => path.join(d, p.name))),
			),
		)
	).flat();
	return {
		paths: posts.map((p) => {
			const [year, month, day, slug] = p.split(path.sep);
			return { params: { year, month, day, slug } };
		}),
		fallback: false,
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { year, month, day, slug } = params as any;
	const postMD = await Promise.all(
		(
			await fs.readdir(path.join(POSTS_PATH, year, month, day, slug), {
				withFileTypes: true,
			})
		)
			.filter((fn) => fn.isFile())
			.map((fn) => {
				const lang = path.basename(fn.name, path.extname(fn.name));
				return fs
					.readFile(
						path.join(POSTS_PATH, year, month, day, slug, fn.name),
						"utf8",
					)
					.then((content) => ({ lang, content }));
			}),
	);
	const parsed: [string, GrayMatterFile<string>][] = postMD.map((p) => [
		p.lang,
		matter(p.content, {
			excerpt: true,
			excerpt_separator: "<!--more-->",
		}),
	]);
	const post: Post = {};
	for (let [lang, matt] of parsed) {
		post[lang] = {
			title: matt.data.title,
			publish: matt.data.publish,
			tags: matt.data.tags.split(" "),
			image: matt.data.image || null,
			source: matt.data.source || null,
			excerpt: matt.excerpt as string,
			content: parseMarkdown(matt.content),
		};
	}
	return { props: { post } };
};
