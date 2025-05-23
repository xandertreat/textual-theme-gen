import type { Component, JSX } from "solid-js";
import { ThemeProvider } from "../context/theme";
import ThemeCreation from "./creation";
import ThemeList from "./list";
import Preview from "./preview";

const ThemeManagement: Component<JSX.HTMLAttributes<HTMLDivElement>> = (
	passed,
) => {
	return (
		<div
			class="flex w-[80vw] justify-between p-5 max-xl:flex-col max-xl:gap-10"
			{...passed}
		>
			<ThemeProvider>
				<div class="flex flex-col gap-10 xl:flex-row xl:gap-5">
					<ThemeList />
					<ThemeCreation />
				</div>
				<Preview />
			</ThemeProvider>
		</div>
	);
};

export default ThemeManagement;
