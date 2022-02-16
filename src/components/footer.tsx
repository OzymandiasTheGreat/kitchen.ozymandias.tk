import React from "react";
import Link from "next/link";
import { Text, View } from "react-native";
import { A, Footer, P } from "@expo/html-elements";
import { useTranslation, useSelectedLanguage } from "next-export-i18n";
import useTheme from "../pages/_theme";

const BlogFooter: React.FC<{
	page?: number;
	total?: number;
	query?: Record<string, string>;
}> = ({ page, total, query = {} }) => {
	const theme = useTheme();
	const { t } = useTranslation();
	const { lang } = useSelectedLanguage();
	const pager = typeof page !== "undefined" && typeof total !== "undefined";

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
				<View style={[theme?.pager.container]}>
					{!!page && (
						<Link
							passHref
							href={{
								pathname: `./${page === 1 ? "" : page}`,
								query: { lang, ...query },
							}}>
							<A
								style={[
									theme?.text.strong,
									theme?.pager.text,
									{ fontSize: 32, marginHorizontal: 15 },
								]}>
								{"‹"}
							</A>
						</Link>
					)}
					<Text style={[theme?.text.strong, theme?.pager.text]}>
						{(page || 0) + 1} /{" "}
						<Link
							passHref
							href={{
								pathname: `./${total}`,
								query: { lang, ...query },
							}}>
							<A>{total}</A>
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
									theme?.text.strong,
									theme?.pager.text,
									{
										fontSize: 32,
										marginHorizontal: 15,
									},
								]}>
								{"›"}
							</A>
						</Link>
					)}
				</View>
			)}
			<Footer style={[theme?.footer.container]}>
				<P
					style={[
						theme?.footer.paragraph,
						{
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
				<P style={[theme?.footer.paragraph]}>
					<A href="https://creativecommons.org/licenses/by/4.0/">
						{t("site.cc")}
					</A>
				</P>
				<P style={[theme?.footer.paragraph]}>{t("site.copyright")}</P>
				<P style={[theme?.footer.paragraph]}>
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

export default BlogFooter;
