// @refresh reload
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";

// Iconify configuration
import { configureIconify } from "@xtreat/solid-iconify";
configureIconify({
	SANITIZE: false,
});

// Styles
import "~/assets/styles/app.css";

export default function App() {
	return (
		<Router root={(props) => <Suspense>{props.children}</Suspense>}>
			<FileRoutes />
		</Router>
	);
}
