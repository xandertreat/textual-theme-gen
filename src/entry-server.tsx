// @refresh reload
import { StartServer, createHandler } from "@solidjs/start/server";
import { DEFAULT_APP_THEME } from "./context/app-theme";

export default createHandler(() => (
	<StartServer
		document={({ assets, children, scripts }) => (
			<html data-theme={DEFAULT_APP_THEME} lang="en-US">
				<head>
					<meta charset="UTF-8" />
					<meta name="description" />
					<meta
						content="width=device-width, viewport-fit=cover, initial-scale=1.0"
						name="viewport"
					/>
					<link
						href="/favicon-96x96.png"
						rel="icon"
						sizes="96x96"
						type="image/png"
					/>
					<link href="/favicon.svg" rel="icon" type="image/svg+xml" />
					<link href="/favicon.ico" rel="shortcut icon" />
					<link
						href="/apple-touch-icon.png"
						rel="apple-touch-icon"
						sizes="180x180"
					/>
					<meta content="SolidBoard" name="apple-mobile-web-app-title" />
					<link href="/site.webmanifest" rel="manifest" />
					<meta content="#ffffff" name="msapplication-TileColor" />
					<meta content="/ms-icon-144x144.png" name="msapplication-TileImage" />
					<meta content="#ffffff" name="theme-color" />
					{assets}
					<script
						innerText={`document.documentElement.dataset.theme =
							localStorage.getItem("theme") ?? "${DEFAULT_APP_THEME}"`}
					/>
				</head>
				<body>
					<div id="app">{children}</div>
					{scripts}
				</body>
			</html>
		)}
	/>
));
