import type { Component, JSX } from "solid-js";
import { ThemeProvider } from "../context/theme";
import Preview from "./preview";
import ThemeCreation from "./theme-creation";
import ThemeList from "./theme-list";

const ThemeManagement: Component<JSX.HTMLAttributes<HTMLDivElement>> = (
	passed,
) => {
	return (
		<div class="flex p-5 justify-between w-[80vw]" {...passed}>
			<div class="grid grid-cols-2 col-span-1 justify-normal gap-3">
				<ThemeList />
				<ThemeCreation />
			</div>
			<Preview />
		</div>
	);
};

export default ThemeManagement;
