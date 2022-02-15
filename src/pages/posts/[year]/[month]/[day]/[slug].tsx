/* eslint-disable jsx-a11y/alt-text */
import { basename, extname, join, relative, sep } from "path";
import fs from "fs/promises";
import klaw from "klaw";
import matter, { GrayMatterFile } from "gray-matter";
import { parseMarkdown } from "../../../../../util/markdown";
import { POSTSDIR } from "../../../../../constants";
import type { GetStaticPaths, GetStaticProps } from "next";
import type { Root } from "mdast";
import type { Post } from "../../../../../types/post";

import React, { useState } from "react";
import {
	Image,
	NativeSyntheticEvent,
	NativeScrollEvent,
	ScrollView,
	Text,
	View,
} from "react-native";
import Link from "next/link";
import { useTranslation, useSelectedLanguage } from "next-export-i18n";
import { A, Article, H1, HR, P, Time } from "@expo/html-elements";
import Fade from "react-native-fade-in-out";
import Header from "../../../../../components/header";
import Footer from "../../../../../components/footer";
import useTheme from "../../../../_theme";
import { Markdown } from "../../../../../components/markdown";

const PostDate: React.FC<{
	publish: string;
	edit: string | null;
	lang: string;
}> = ({ publish, edit, lang }) => {
	const theme = useTheme();
	const { t } = useTranslation();

	if (edit) {
		const edited = new Date(edit).toLocaleString(lang, {
			year: "2-digit",
			month: "numeric",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
		});
		const published = new Date(publish).toLocaleString(lang, {
			year: "2-digit",
			month: "short",
			day: "numeric",
		});
		return (
			<P style={[theme?.text.body, theme?.article.byline.date]}>
				<Text>{t("post.edited")}</Text>
				<Time
					style={[theme?.text.strong, theme?.article.byline.date]}
					dateTime={edited}>
					{edited}
				</Time>
				{"\n"}
				<Text>{t("post.published.edited")}</Text>
				<Time
					style={[theme?.text.strong, theme?.article.byline.date]}
					dateTime={published}>
					{published}
				</Time>
			</P>
		);
	}
	const published = new Date(publish).toLocaleString(lang, {
		year: "numeric",
		month: "long",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
	return (
		<P style={[theme?.text.body, theme?.article.byline.date]}>
			<Text>{t("post.published.noedit")}</Text>
			<Time
				style={[theme?.text.strong, theme?.article.byline.date]}
				dateTime={published}>
				{published}
			</Time>
		</P>
	);
};

const PostRenderer: React.FC<{ post: Post }> = ({ post }) => {
	const theme = useTheme();
	const { lang } = useSelectedLanguage();
	const { t } = useTranslation();
	const [header, setHeader] = useState(true);

	const headerOpaqueCallback = (
		ev: NativeSyntheticEvent<NativeScrollEvent>,
	) => {
		if (ev.nativeEvent.contentOffset.y <= 100 !== header) {
			setHeader(ev.nativeEvent.contentOffset.y <= 80);
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<ScrollView
				onScroll={headerOpaqueCallback}
				scrollEventThrottle={100}
				stickyHeaderIndices={[0]}>
				<Header opaque={header}></Header>
				{Object.entries(post).map(([contentLang, content]) => (
					<Fade
						key={contentLang}
						visible={lang === contentLang}
						duration={700}
						useNativeDriver={false}
						style={{
							display: lang === contentLang ? "flex" : "none",
						}}>
						<Article style={[theme?.article.container]}>
							<H1 style={[theme?.text.heading]}>
								{content.title}
							</H1>
							<View style={[theme?.article.byline.container]}>
								<Text
									style={[
										theme?.text.body,
										theme?.article.byline.author,
									]}>
									{t("post.byline")}
									<Text
										style={[
											theme?.text.emphasis,
											theme?.article.byline.author,
										]}>
										Tomas Ravinskas
									</Text>
								</Text>
								<PostDate
									lang={contentLang}
									publish={content.publish}
									edit={content.edited}></PostDate>
							</View>
							{content.image && (
								<View style={[theme?.article.image.container]}>
									<Image
										source={{ uri: content.image.uri }}
										style={
											theme?.article.image.style
										}></Image>
									<Text
										style={[
											theme?.text.body,
											theme?.article.image.copyright,
										]}>
										©️ {content.image.copyright}
									</Text>
								</View>
							)}
							<Markdown
								node={content.content as Root}></Markdown>
							<HR style={[theme?.markdown.hr]}></HR>
							{content.source && (
								<P
									nativeID="via"
									style={[
										theme?.text.body,
										theme?.article.footer.source,
									]}>
									{t("post.via")}
									<A href={content.source}>
										{content.source}
									</A>
								</P>
							)}
							<P
								nativeID="tag"
								style={[
									theme?.text.body,
									theme?.article.footer.tag,
								]}>
								{t("post.tag")}
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
												theme?.text.emphasis,
												theme?.article.footer.tag,
											]}>
											{tag}
										</A>
									</Link>
								))}
							</P>
						</Article>
					</Fade>
				))}
				<Footer></Footer>
			</ScrollView>
		</View>
	);
};

export default PostRenderer;

export const getStaticPaths: GetStaticPaths = async () => {
	const paths: {
		params: { year: string; month: string; day: string; slug: string };
	}[] = [];
	for await (const { path, stats } of klaw(POSTSDIR, { depthLimit: 4 })) {
		if (stats.isDirectory()) {
			const parts = relative(POSTSDIR, path).split(sep);
			if (parts.length === 4) {
				const [year, month, day, slug] = parts;
				paths.push({ params: { year, month, day, slug } });
			}
		}
	}
	return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { year, month, day, slug } = params as any;
	const postMD = await Promise.all(
		(
			await fs.readdir(join(POSTSDIR, year, month, day, slug), {
				withFileTypes: true,
			})
		)
			.filter((fn) => fn.isFile())
			.map((fn) => {
				const lang = basename(fn.name, extname(fn.name));
				return fs
					.readFile(
						join(POSTSDIR, year, month, day, slug, fn.name),
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
			edited: matt.data.edited || null,
			tags: matt.data.tags.split(" "),
			image: matt.data.image || null,
			source: matt.data.source || null,
			content: parseMarkdown(matt.content),
		};
	}
	return { props: { post } };
};
