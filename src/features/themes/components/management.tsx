import type { Component, JSX } from "solid-js";
import { ThemeProvider } from "../context/theme";
import ThemeCreation from "./creation";
import ThemeList from "./list";
import Preview from "./preview";

const ThemeManagement: Component<JSX.HTMLAttributes<HTMLDivElement>> = (
	passed,
) => {
	return (
		<div class="flex w-[80vw] justify-between p-5 max-xl:flex-col" {...passed}>
			<ThemeProvider>
				<div class="flex gap-5 max-xl:flex-col">
					<ThemeList />
					<ThemeCreation />
				</div>
				<Preview />
			</ThemeProvider>
		</div>
	);
};

export default ThemeManagement;
