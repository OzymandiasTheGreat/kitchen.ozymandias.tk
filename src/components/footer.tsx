import React from "react";
import Link from "next/link";
import {} from "react-native";
import { A, Footer, P } from "@expo/html-elements";
import { useTranslation, useSelectedLanguage } from "next-export-i18n";
import useTheme from "../pages/_theme";

const BlogFooter: React.FC = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const { lang } = useSelectedLanguage();

	return (
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
				<Link passHref href={{ pathname: "/about", query: { lang } }}>
					<A>{t("site.about")}</A>
				</Link>
				<Link passHref href={{ pathname: "/tag", query: { lang } }}>
					<A>{t("site.tags")}</A>
				</Link>
				<Link passHref href={{ pathname: "/posts", query: { lang } }}>
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
	);
};

export default BlogFooter;
