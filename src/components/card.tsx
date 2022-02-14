import React from "react";
import { Image, Text, View } from "react-native";
import Link from "next/link";
import { useSelectedLanguage, useTranslation } from "next-export-i18n";
import { A, H2, P } from "@expo/html-elements";
import Fade from "react-native-fade-in-out";
import useTheme from "../pages/_theme";
import { Markdown } from "./markdown";
import type { Post } from "../types/post";

const BlogCard: React.FC<{ slug: string; post: Post }> = ({ slug, post }) => {
	const theme = useTheme();
	const { lang } = useSelectedLanguage();
	const { t } = useTranslation();

	return (
		<Link passHref href={{ pathname: `/posts/${slug}`, query: { lang } }}>
			<A style={[theme?.card.style]}>
				{Object.entries(post).map(([postLang, content]) => (
					<Fade
						key={postLang}
						visible={lang === postLang}
						duration={theme?.card.fadeDuration}
						useNativeDriver={false}
						style={{
							display: lang === postLang ? "flex" : "none",
						}}>
						<View style={[theme?.card.container]}>
							<H2 style={[theme?.card.heading]}>
								{content.title}
							</H2>
							{content.image && (
								// eslint-disable-next-line jsx-a11y/alt-text
								<Image
									source={{ uri: content.image.uri }}
									style={[theme?.card.image]}></Image>
							)}
							<View style={[theme?.card.excerpt]}>
								<Markdown
									node={
										content.excerpt || {
											type: "root",
											children: [],
										}
									}></Markdown>
							</View>
							<P
								style={[
									theme?.article.footer.tag,
									theme?.card.tags,
								]}>
								{t("post.tag")}
								{content.tags.map((tag) => (
									<Text
										key={tag}
										style={[
											theme?.text.emphasis,
											theme?.article.footer.tag,
										]}>
										{tag}
									</Text>
								))}
							</P>
						</View>
					</Fade>
				))}
			</A>
		</Link>
	);
};

export default BlogCard;
