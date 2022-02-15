// @generated: @expo/next-adapter@3.1.18
import React from "react";
import Document, { Head, Main, NextScript } from "next/document";

class CustomDocument extends Document {
	render() {
		return (
			<html>
				<Head>
					<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
					<link
						rel="preconnect"
						href="https://fonts.googleapis.com"
					/>
					<link
						rel="preconnect"
						href="https://fonts.gstatic.com"
						crossOrigin="anonymous"
					/>
					<link
						href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Fira+Code&family=Poppins:ital,wght@0,400;0,700;1,400;1,700&display=swap"
						rel="stylesheet"
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</html>
		);
	}
}

export default CustomDocument;
