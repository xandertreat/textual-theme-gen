import type { Component, JSX } from "solid-js";
import { ThemeProvider } from "../context/theme";
import Preview from "./preview";
import ThemeCreation from "./creation";
import ThemeList from "./list";

const ThemeManagement: Component<JSX.HTMLAttributes<HTMLDivElement>> = (
	passed,
) => {
	return (
		<div class="flex p-5 justify-between w-[80vw]" {...passed}>
			<ThemeProvider>
				<div class="grid grid-cols-2 col-span-1 justify-normal gap-3">
					<ThemeList />
					<ThemeCreation />
				</div>
				<Preview />
			</ThemeProvider>
		</div>
	);
};

export default ThemeManagement;
