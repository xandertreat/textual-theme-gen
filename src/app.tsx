// @refresh reload
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";

// Styles
import "~/assets/styles/app.css";

// Iconify configuration
import { configureIconify } from "./components/ui/icon";
configureIconify({
	SANITIZE: false,
});

export default function App() {
	return (
		<Router root={(props) => <Suspense>{props.children}</Suspense>}>
			<FileRoutes />
		</Router>
	);
}
