import type { Component, JSX } from "solid-js";
import { ThemeProvider } from "../context/theme";
import ThemeCreation from "./creation";
import ThemeList from "./list";
import Preview from "./preview";

const ThemeManagement: Component<JSX.HTMLAttributes<HTMLDivElement>> = (
	passed,
) => {
	return (
		<ThemeProvider>
			<div class="flex w-[80vw] gap-10 p-5 max-xl:flex-col" {...passed}>
				<div class=" flex flex-col gap-10 xl:flex-row">
					<ThemeList />
					<ThemeCreation />
				</div>
				<Preview />
			</div>
		</ThemeProvider>
	);
};

export default ThemeManagement;
