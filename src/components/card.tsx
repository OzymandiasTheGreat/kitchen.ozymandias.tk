import React, { useEffect, useState } from "react";
import { useColorScheme, Image, Text, View } from "react-native";
import Link from "next/link";
import { useSelectedLanguage, useTranslation } from "next-export-i18n";
import { A, H2, P } from "@expo/html-elements";
import { Markdown } from "@ozymandiasthegreat/react-native-markdown/src";
import type { Post } from "../types/post";
import {
	setOpacity,
	COLOR_TEXT_BG_DARK,
	COLOR_TEXT_BG_LIGHT,
	COLOR_TEXT_FG_DARK,
	COLOR_TEXT_FG_LIGHT,
	FONT_CODE,
	FONT_REGULAR,
	STYLE_HEADING,
	STYLE_REGULAR,
	STYLE_EMPHASIS,
} from "../theme";

const BlogCard: React.FC<{ slug: string; post: Post }> = ({ slug, post }) => {
	const { lang } = useSelectedLanguage();
	const { t } = useTranslation();
	const scheme = useColorScheme();
	const [dark, setDark] = useState(false);

	useEffect(() => setDark(scheme === "dark"), [scheme]);

	return (
		<Link passHref href={{ pathname: `/posts/${slug}`, query: { lang } }}>
			<A style={{ width: 256, minHeight: 192, margin: "1vw" }}>
				{Object.entries(post).map(([postLang, content]) => (
					<View
						key={postLang}
						style={{
							display: lang === postLang ? "flex" : "none",
							backgroundColor: dark
								? COLOR_TEXT_BG_DARK
								: COLOR_TEXT_BG_LIGHT,
							width: "100%",
							borderRadius: 3,
						}}>
						<H2
							style={[
								STYLE_HEADING,
								{
									color: dark
										? COLOR_TEXT_FG_DARK
										: COLOR_TEXT_FG_LIGHT,
									fontSize: 24,
									paddingVertical: 10,
									paddingHorizontal: 15,
								},
							]}>
							{content.title}
						</H2>
						{content.image && (
							<Image
								source={{ uri: content.image.uri }}
								style={{
									width: "100%",
									minHeight: 128,
									maxHeight: 192,
									resizeMode: "cover",
								}}
							/>
						)}
						<Markdown
							source={{ ast: content.excerpt }}
							style={{
								width: "100%",
								paddingVertical: 10,
								paddingHorizontal: 15,
							}}
							pStyle={{
								...STYLE_REGULAR,
								color: dark
									? COLOR_TEXT_FG_DARK
									: COLOR_TEXT_FG_LIGHT,
							}}
							fontMap={{
								normal: FONT_REGULAR,
								bold: FONT_REGULAR,
								italic: FONT_REGULAR,
								monospace: FONT_CODE,
							}}
						/>
						<P
							style={[
								STYLE_EMPHASIS,
								{
									color: setOpacity(
										dark
											? COLOR_TEXT_FG_DARK
											: COLOR_TEXT_FG_LIGHT,
										0.6,
									),
									fontSize: 14,
									paddingHorizontal: 20,
									marginBottom: 15,
									marginRight: 10,
								},
							]}>
							{t("post.tag")}
							{content.tags.map((tag) => (
								<Text
									key={tag}
									style={[
										STYLE_EMPHASIS,
										{
											color: setOpacity(
												dark
													? COLOR_TEXT_FG_DARK
													: COLOR_TEXT_FG_LIGHT,
												0.6,
											),
											fontSize: 14,
											marginRight: 10,
										},
									]}>
									{tag}
								</Text>
							))}
						</P>
					</View>
				))}
			</A>
		</Link>
	);
};

export default BlogCard;
