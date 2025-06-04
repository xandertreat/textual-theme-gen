// @refresh reload
import { StartClient, mount } from "@solidjs/start/client";

// Styles
import "~/assets/styles/app.css";

export default mount(() => <StartClient />, document.getElementById("app")!);
