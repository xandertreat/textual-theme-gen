// @refresh reload
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";

// Styles
import "highlight.js/styles/tokyo-night-dark.min.css";
import "~/assets/styles/app.css";

export default function App() {
	return (
		<Router root={(props) => <Suspense>{props.children}</Suspense>}>
			<FileRoutes />
		</Router>
	);
}
