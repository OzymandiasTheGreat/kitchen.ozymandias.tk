import "./fallback.css";
import "setimmediate";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { useColorScheme, SafeAreaView } from "react-native";
import TileBackground from "../components/tiles";
import { COLOR_SITE_BG_DARK, COLOR_SITE_BG_LIGHT } from "../theme";

function App({ Component, pageProps }: AppProps) {
	const scheme = useColorScheme();
	const [dark, setDark] = useState(false);

	useEffect(() => setDark(scheme === "dark"), [scheme]);

	return (
		<>
			<Head>
				<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
				<link rel="icon" type="image/png" href="/favicon.png" />
				<script
					src="https://cdn.jsdelivr.net/gh/virae/we-stand-with-ukraine@v1.0.1/badge.js"
					async
				/>
			</Head>

			<SafeAreaView
				style={{
					flex: 1,
					backgroundColor: dark
						? COLOR_SITE_BG_DARK
						: COLOR_SITE_BG_LIGHT,
				}}>
				<TileBackground
					src="/tile.svg"
					color={dark ? COLOR_SITE_BG_DARK : COLOR_SITE_BG_LIGHT}>
					<Component {...pageProps} />
				</TileBackground>
			</SafeAreaView>
		</>
	);
}

export default App;
