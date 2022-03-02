import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useColorScheme, StyleSheet, Text, View } from "react-native";
import { A, Footer, P } from "@expo/html-elements";
import Icon from "@mdi/react";
import { mdiCopyright } from "@mdi/js";
import { useTranslation, useSelectedLanguage } from "next-export-i18n";
import {
	COLOR_LINK,
	COLOR_SITE_BG_DARK,
	COLOR_TEXT_BG_DARK,
	COLOR_TEXT_BG_LIGHT,
	COLOR_TEXT_FG_DARK,
	COLOR_TEXT_FG_LIGHT,
	FONT_REGULAR,
	STYLE_STRONG,
} from "../theme";

const BlogFooter: React.FC<{
	page?: number;
	total?: number;
	query?: Record<string, string>;
}> = ({ page, total, query = {} }) => {
	const { t } = useTranslation();
	const { lang } = useSelectedLanguage();
	const scheme = useColorScheme();
	const [dark, setDark] = useState(false);
	const pager = typeof page !== "undefined" && typeof total !== "undefined";
	const pagerShadowColor = dark ? COLOR_SITE_BG_DARK : COLOR_TEXT_BG_LIGHT;
	const pagerShadowRadius = 7;
	const paragraphColor = dark ? COLOR_TEXT_FG_DARK : COLOR_TEXT_FG_LIGHT;

	useEffect(() => setDark(scheme === "dark"), [scheme]);

	return (
		<View
			style={[
				{
					width: "100%",
					alignItems: "stretch",
					justifyContent: "flex-end",
				},
			]}>
			{pager && (
				<View
					style={{
						flex: 1,
						width: "100%",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						marginVertical: 50,
					}}>
					{!!page && (
						<Link
							passHref
							href={{
								pathname: `./${page === 1 ? "" : page}`,
								query: { lang, ...query },
							}}>
							<A
								style={[
									STYLE_STRONG,
									{
										color: COLOR_LINK,
										fontSize: 32,
										textShadowColor: pagerShadowColor,
										textShadowRadius: pagerShadowRadius,
										marginHorizontal: 15,
									},
								]}>
								{"‹"}
							</A>
						</Link>
					)}
					<Text
						style={[
							STYLE_STRONG,
							{
								color: paragraphColor,
								fontSize: 20,
								textShadowColor: pagerShadowColor,
								textShadowRadius: pagerShadowRadius,
								paddingTop: 3,
							},
						]}>
						{(page || 0) + 1} /{" "}
						<Link
							passHref
							href={{
								pathname: `./${total}`,
								query: { lang, ...query },
							}}>
							<A style={{ color: COLOR_LINK }}>{total}</A>
						</Link>
					</Text>
					{(page || 0) + 1 !== total && (
						<Link
							passHref
							href={{
								pathname: `./${(page || 0) + 2}`,
								query: { lang, ...query },
							}}>
							<A
								style={[
									STYLE_STRONG,
									{
										color: COLOR_LINK,
										fontSize: 32,
										textShadowColor: pagerShadowColor,
										textShadowRadius: pagerShadowRadius,
										marginHorizontal: 15,
									},
								]}>
								{"›"}
							</A>
						</Link>
					)}
				</View>
			)}
			<Footer
				style={{
					backgroundColor: dark
						? COLOR_TEXT_BG_DARK
						: COLOR_TEXT_BG_LIGHT,
					alignItems: "center",
					justifyContent: "space-around",
					width: "100%",
					height: 275,
					paddingVertical: 50,
				}}>
				<P
					style={[
						styles.paragraph,
						{
							color: paragraphColor,
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-around",
							width: 200,
						},
					]}>
					<Link
						passHref
						href={{ pathname: "/about", query: { lang } }}>
						<A>{t("site.about")}</A>
					</Link>
					<Link
						passHref
						href={{ pathname: "/tags", query: { lang } }}>
						<A>{t("site.tags")}</A>
					</Link>
					<Link
						passHref
						href={{ pathname: "/posts", query: { lang } }}>
						<A>{t("site.archive")}</A>
					</Link>
				</P>
				<P style={[styles.paragraph, { color: paragraphColor }]}>
					<A href="https://creativecommons.org/licenses/by/4.0/">
						{t("site.cc")}
					</A>
				</P>
				<P style={[styles.paragraph, { color: paragraphColor }]}>
					<Icon
						path={mdiCopyright}
						size="24px"
						color={paragraphColor}
						style={{
							verticalAlign: "middle",
							marginRight: "10px",
						}}
					/>
					{t("site.copyright")}
				</P>
				<P style={[styles.paragraph, { color: paragraphColor }]}>
					<Link
						passHref
						href={{ pathname: "/credits", query: { lang } }}>
						<A>{t("site.third-party")}</A>
					</Link>
				</P>
			</Footer>
		</View>
	);
};

const styles = StyleSheet.create({
	paragraph: {
		fontFamily: FONT_REGULAR,
		fontSize: 14,
		opacity: 0.7,
	},
});

export default BlogFooter;
