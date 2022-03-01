/* eslint-disable jsx-a11y/alt-text */
import { basename, extname, join, relative, sep } from "path";
import fs from "fs/promises";
import klaw from "klaw";
import matter, { GrayMatterFile } from "gray-matter";
import { parseMarkdown } from "../../../../../util/markdown";
import { POSTSDIR } from "../../../../../constants";
import type { GetStaticPaths, GetStaticProps } from "next";
import type { Post } from "../../../../../types/post";

import React, { useEffect, useState } from "react";
import {
	useColorScheme,
	useWindowDimensions,
	Image,
	NativeSyntheticEvent,
	NativeScrollEvent,
	ScrollView,
	Text,
	View,
} from "react-native";
import Link from "next/link";
import { useTranslation, useSelectedLanguage } from "next-export-i18n";
import { A, EM, H1, HR, Main, P, Time } from "@expo/html-elements";
import Icon from "@mdi/react";
import { mdiCopyright } from "@mdi/js";
import { Markdown } from "@ozymandiasthegreat/react-native-markdown/src";
import Header from "../../../../../components/header";
import Footer from "../../../../../components/footer";
import {
	COLOR_LINK,
	COLOR_TEXT_BG_DARK,
	COLOR_TEXT_BG_LIGHT,
	COLOR_TEXT_FG_DARK,
	COLOR_TEXT_FG_LIGHT,
	FONT_CODE,
	FONT_REGULAR,
	setOpacity,
	STYLE_EMPHASIS,
	STYLE_HEADING,
	STYLE_REGULAR,
	STYLE_STRONG,
} from "../../../../../theme";

const PostDate: React.FC<{
	publish: string;
	edit: string | null;
	lang: string;
}> = ({ publish, edit, lang }) => {
	const scheme = useColorScheme();
	const [dark, setDark] = useState(false);
	const { t } = useTranslation();

	useEffect(() => setDark(scheme === "dark"), [scheme]);

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
			<P
				style={[
					STYLE_REGULAR,
					{
						color: dark ? COLOR_TEXT_FG_DARK : COLOR_TEXT_FG_LIGHT,
						fontSize: 12,
					},
				]}>
				<Text>{t("post.edited")}</Text>
				<Time dateTime={edited}>{edited}</Time>
				{"\n"}
				<Text>{t("post.published.edited")}</Text>
				<Time style={[STYLE_STRONG]} dateTime={published}>
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
		<P
			style={[
				STYLE_REGULAR,
				{
					color: dark ? COLOR_TEXT_FG_DARK : COLOR_TEXT_FG_LIGHT,
					fontSize: 12,
				},
			]}>
			<Text>{t("post.published.noedit")}</Text>
			<Time style={[STYLE_STRONG]} dateTime={published}>
				{published}
			</Time>
		</P>
	);
};

const PostRenderer: React.FC<{ post: Post }> = ({ post }) => {
	const scheme = useColorScheme();
	const { width } = useWindowDimensions();
	const [dark, setDark] = useState(false);
	const [small, setSmall] = useState(true);
	const { lang } = useSelectedLanguage();
	const { t } = useTranslation();
	const [header, setHeader] = useState(true);
	const [comments, setComments] = useState(false);

	useEffect(() => setDark(scheme === "dark"), [scheme]);
	useEffect(() => setSmall(width < 600), [width]);
	const headerOpaqueCallback = (
		ev: NativeSyntheticEvent<NativeScrollEvent>,
	) => {
		if (ev.nativeEvent.contentOffset.y <= 100 !== header) {
			setHeader(ev.nativeEvent.contentOffset.y <= 80);
		}
	};
	const loadComments = () => setComments(true);

	return (
		<View style={{ flex: 1 }}>
			<ScrollView
				onScroll={headerOpaqueCallback}
				scrollEventThrottle={100}
				stickyHeaderIndices={[0]}>
				<Header opaque={header}></Header>
				{Object.entries(post).map(([contentLang, content]) => (
					<View
						key={contentLang}
						style={{
							display: lang === contentLang ? "flex" : "none",
						}}>
						<Main
							style={{
								backgroundColor: dark
									? COLOR_TEXT_BG_DARK
									: COLOR_TEXT_BG_LIGHT,
								alignSelf: "center",
								width: small ? "98%" : "80%",
								maxWidth: 800,
								paddingVertical: 20,
								paddingHorizontal: 50,
								borderRadius: 3,
							}}>
							<H1
								style={[
									STYLE_HEADING,
									{
										color: dark
											? COLOR_TEXT_FG_DARK
											: COLOR_TEXT_FG_LIGHT,
										fontSize: 28,
									},
								]}>
								{content.title}
							</H1>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
									width: "100%",
									marginBottom: 30,
								}}>
								<Text
									style={[
										STYLE_REGULAR,
										{
											color: dark
												? COLOR_TEXT_FG_DARK
												: COLOR_TEXT_FG_LIGHT,
											fontSize: 14,
										},
									]}>
									{t("post.byline")}
									<Text
										style={[
											STYLE_EMPHASIS,
											{
												color: dark
													? COLOR_TEXT_FG_DARK
													: COLOR_TEXT_FG_LIGHT,
												fontSize: 14,
											},
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
								<View
									style={{
										alignItems: "center",
										marginBottom: 30,
									}}>
									<Image
										source={{ uri: content.image.uri }}
										style={{
											width: "100%",
											minHeight: 380,
											maxHeight: 500,
											resizeMode: "cover",
										}}></Image>
									<Text
										style={[
											STYLE_REGULAR,
											{
												color: dark
													? setOpacity(
															COLOR_TEXT_FG_DARK,
															0.7,
													  )
													: setOpacity(
															COLOR_TEXT_FG_LIGHT,
															0.7,
													  ),
												fontSize: 13,
											},
										]}>
										<Icon
											path={mdiCopyright}
											color={
												dark
													? setOpacity(
															COLOR_TEXT_FG_DARK,
															0.7,
													  )
													: setOpacity(
															COLOR_TEXT_FG_LIGHT,
															0.7,
													  )
											}
											size="14px"
											style={{
												verticalAlign: "middle",
												marginRight: "10px",
											}}
										/>
										{content.image.copyright}
									</Text>
								</View>
							)}
							<Markdown
								source={{ ast: content.content }}
								style={{ width: "100%" }}
								pStyle={{
									...STYLE_REGULAR,
									color: dark
										? COLOR_TEXT_FG_DARK
										: COLOR_TEXT_FG_LIGHT,
								}}
								hStyle={{
									...STYLE_HEADING,
									color: dark
										? COLOR_TEXT_FG_DARK
										: COLOR_TEXT_FG_LIGHT,
								}}
								aStyle={{ color: COLOR_LINK }}
								fontMap={{
									normal: FONT_REGULAR,
									italic: FONT_REGULAR,
									bold: FONT_REGULAR,
									monospace: FONT_CODE,
								}}></Markdown>
							<HR
								style={{
									backgroundColor: dark
										? setOpacity(COLOR_TEXT_FG_DARK, 0.75)
										: setOpacity(
												COLOR_TEXT_FG_LIGHT,
												0.75,
										  ),
									width: "95%",
								}}></HR>
							{content.source && (
								<P
									nativeID="via"
									style={[
										STYLE_REGULAR,
										{
											color: dark
												? COLOR_TEXT_FG_DARK
												: COLOR_TEXT_FG_LIGHT,
											fontSize: 14,
										},
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
									STYLE_REGULAR,
									{
										color: dark
											? setOpacity(
													COLOR_TEXT_FG_DARK,
													0.6,
											  )
											: setOpacity(
													COLOR_TEXT_FG_LIGHT,
													0.6,
											  ),
										fontSize: 13,
										marginRight: 10,
									},
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
												STYLE_EMPHASIS,
												{
													color: dark
														? setOpacity(
																COLOR_TEXT_FG_DARK,
																0.6,
														  )
														: setOpacity(
																COLOR_TEXT_FG_LIGHT,
																0.6,
														  ),
													fontSize: 13,
													marginRight: 10,
												},
											]}>
											{tag}
										</A>
									</Link>
								))}
							</P>
						</Main>
					</View>
				))}
				{!comments && (
					<View
						style={{
							width: 300,
							alignSelf: "center",
							backgroundColor: dark
								? COLOR_TEXT_BG_DARK
								: COLOR_TEXT_BG_LIGHT,
							paddingVertical: 10,
							borderRadius: 3,
							margin: 30,
						}}>
						<Text
							style={[
								STYLE_REGULAR,
								STYLE_STRONG,
								{
									color: dark
										? COLOR_TEXT_FG_DARK
										: COLOR_TEXT_FG_LIGHT,
									marginHorizontal: "auto",
								},
							]}
							onPress={loadComments}>
							{t("post.commentsLoad")}
						</Text>
					</View>
				)}
				{comments && (
					<View
						style={{
							flex: 1,
							alignSelf: "center",
							width: small ? "98%" : "80%",
							maxWidth: 800,
							backgroundColor: dark
								? COLOR_TEXT_BG_DARK
								: COLOR_TEXT_BG_LIGHT,
							borderRadius: 3,
							margin: 30,
						}}>
						<Text
							style={[
								STYLE_REGULAR,
								{
									color: dark
										? COLOR_TEXT_FG_DARK
										: COLOR_TEXT_FG_LIGHT,
									alignSelf: "center",
									paddingVertical: 15,
								},
							]}>
							{t("post.commentsPre1")}
							<EM style={[STYLE_EMPHASIS]}>
								{t("post.commentsPre2")}
							</EM>
							<A href="https://github.com/signup">
								{t("post.commentsPre3")}
							</A>
						</Text>
						<script
							src="https://utteranc.es/client.js"
							// @ts-ignore
							repo="OzymandiasTheGreat/kitchen.tomasrav.me"
							issue-term="pathname"
							label="comment"
							theme="preferred-color-scheme"
							crossOrigin="anonymous"
							async></script>
					</View>
				)}
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
