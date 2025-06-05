import { type Component, type JSX, lazy } from "solid-js";
import ThemeCreation from "./editing/creation";
import ThemeList from "./list/list";

const Preview = lazy(() => import("./preview/preview"));

const ThemeManagement: Component<JSX.HTMLAttributes<HTMLDivElement>> = (
	passed,
) => {
	return (
		<div
			class="mt-5 flex fhd:w-[80vw] hd:w-screen uhd:w-[50vw] w-[90vw] uhd:gap-10 hd:pr-20 fhd:pl-0 hd:pl-5 max-xl:flex-col"
			{...passed}
		>
			<main class="flex flex-col gap-5 qhd:gap-10 xl:flex-row">
				<ThemeList />
				<ThemeCreation class="hd:mr-5 qhd:mr-0 flex h-full flex-col gap-2" />
			</main>
			<Preview />
		</div>
	);
};

export default ThemeManagement;
