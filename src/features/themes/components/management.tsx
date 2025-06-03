import type { Component, JSX } from "solid-js";
import { ThemeProvider } from "../context/theme";
import ThemeCreation from "./creation";
import ThemeList from "./list";
import Preview from "./preview";

const ThemeManagement: Component<JSX.HTMLAttributes<HTMLElement>> = (
	passed,
) => {
	return (
		<main class="flex w-[80vw] gap-10 p-5 max-xl:flex-col" {...passed}>
			<ThemeProvider>
				<aside class=" flex flex-col gap-10 xl:flex-row">
					<ThemeList />
					<ThemeCreation class="flex h-full flex-col gap-2" />
				</aside>
				<Preview />
			</ThemeProvider>
		</main>
	);
};

export default ThemeManagement;
