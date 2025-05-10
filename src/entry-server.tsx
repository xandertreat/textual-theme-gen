// @refresh reload
import { StartServer, createHandler } from "@solidjs/start/server";
import { DEFAULT_THEME } from "./context/app-theme";

export default createHandler(() => (
	<StartServer
		document={({ assets, children, scripts }) => (
			<html lang="en-US" data-theme={DEFAULT_THEME}>
				<head>
					<meta charset="UTF-8" />
					<meta name="description" />
					<meta
						name="viewport"
						content="width=device-width, viewport-fit=cover, initial-scale=1.0"
					/>
					<link
						rel="icon"
						type="image/png"
						href="/favicon-96x96.png"
						sizes="96x96"
					/>
					<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
					<link rel="shortcut icon" href="/favicon.ico" />
					<link
						rel="apple-touch-icon"
						sizes="180x180"
						href="/apple-touch-icon.png"
					/>
					<meta name="apple-mobile-web-app-title" content="SolidBoard" />
					<link rel="manifest" href="/site.webmanifest" />
					<meta name="msapplication-TileColor" content="#ffffff" />
					<meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
					<meta name="theme-color" content="#ffffff" />
					{assets}
					<script>
						` const localData = localStorage.getItem("theme"); if (localData)
						document.documentElement.dataset.theme = localData; `
					</script>
				</head>
				<body>
					<div id="app">{children}</div>
					{scripts}
				</body>
			</html>
		)}
	/>
));
