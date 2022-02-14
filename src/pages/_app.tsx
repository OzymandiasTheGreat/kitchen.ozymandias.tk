import "./fallback.css";
import "setimmediate";
import Head from "next/head";
import { AppProps } from "next/app";
import { SafeAreaView } from "react-native";
import useTheme from "./_theme";
import TileBackground from "../components/tiles";

function App({ Component, pageProps }: AppProps) {
	const theme = useTheme();

	return (
		<>
			<Head>
				<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
				<link rel="icon" type="image/png" href="/favicon.png" />
			</Head>

			<SafeAreaView style={[theme?.main]}>
				<TileBackground
					src="/tile.svg"
					color={theme?.main.backgroundColor as string}>
					<Component {...pageProps} />
				</TileBackground>
			</SafeAreaView>
		</>
	);
}

export default App;
