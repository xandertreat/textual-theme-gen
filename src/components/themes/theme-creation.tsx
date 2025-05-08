import type { Component, JSX } from "solid-js";
import Icon from "../ui/icon";

const ThemeCreation: Component<JSX.HTMLAttributes<HTMLDivElement>> = (
	passed,
) => {
	return (
		<div class="flex flex-col gap-2 h-full" {...passed}>
			<span class="inline-flex gap-2 items-center">
				<Icon class="size-9" icon="mdi:palette" />{" "}
				<h2 class="text-3xl font-bold">Colors</h2>
			</span>
		</div>
	);
};

export default ThemeCreation;
