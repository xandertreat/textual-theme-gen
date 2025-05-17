import type { Component, JSX } from "solid-js";
import Icon from "../../../components/ui/icon";
import EditColor from "./color";

const ThemeCreation: Component<JSX.HTMLAttributes<HTMLDivElement>> = (
	passed,
) => {
	return (
		<div class="flex flex-col gap-2 h-full" {...passed}>
			<span class="inline-flex gap-2 items-center">
				<Icon class="size-9" icon="mdi:palette" />{" "}
				<h2 class="text-3xl font-bold">Colors</h2>
			</span>
			<div>
				<EditColor color="primary" />
			</div>
		</div>
	);
};

export default ThemeCreation;
