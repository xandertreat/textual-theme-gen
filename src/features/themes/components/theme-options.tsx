import type { Component, JSX } from "solid-js";
import Icon from "~/components/ui/icon";
import CloneTheme from "./clone";
import EditColor from "./color";
import NewColor from "./new-color";
import VariablesManagement from "./variables";

const ThemeOptions: Component<JSX.HTMLAttributes<HTMLDivElement>> = (
	passed,
) => {
	return (
		<div class="mt-8 flex h-full flex-col gap-2 xl:mt-10" {...passed}>
			<span class="inline-flex items-center gap-2">
				<Icon class="size-9" icon="mdi:cog" />{" "}
				<h2 class="font-bold text-3xl">Options</h2>
			</span>
			<div class="flex">
				<CloneTheme />
				<NewColor />
				<VariablesManagement />
			</div>
		</div>
	);
};

export default ThemeOptions;
