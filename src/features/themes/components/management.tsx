import type { Component, JSX } from "solid-js";
import { ThemeProvider } from "../context/theme";
import ThemeCreation from "./editing/creation";
import ThemeList from "./list/list";
import Preview from "./preview/preview";

const ThemeManagement: Component<JSX.HTMLAttributes<HTMLElement>> = (
	passed,
) => {
	return (
		<ThemeProvider>
			<main
				class="mt-5 flex fhd:w-[80vw] hd:w-screen uhd:w-[50vw] w-[90vw] uhd:gap-10 hd:pr-20 fhd:pl-0 hd:pl-5 max-xl:flex-col"
				{...passed}
			>
				<aside class="flex flex-col gap-5 qhd:gap-10 xl:flex-row">
					<ThemeList />
					<ThemeCreation class="hd:mr-5 qhd:mr-0 flex h-full flex-col gap-2" />
				</aside>
				<Preview />
			</main>
		</ThemeProvider>
	);
};

export default ThemeManagement;
