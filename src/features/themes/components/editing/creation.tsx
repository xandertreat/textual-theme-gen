import Icon from "@xtreat/solid-iconify";
import { type Component, For, type JSX, lazy } from "solid-js";
import { useTheme } from "~/features/themes/context/theme";
import ThemeOptions from "./theme-options";

const EditColor = lazy(() => import("./color"));

const ThemeCreation: Component<JSX.HTMLAttributes<HTMLDivElement>> = (
	props,
) => {
	const { data, firstThemeName } = useTheme();
	const paletteColors = Object.keys(data.get(firstThemeName)!.palette);

	return (
		<div {...props}>
			<span class="inline-flex items-center gap-2">
				<Icon class="size-9" icon="mdi:palette" />
				<h2 class="font-bold text-3xl">Colors</h2>
			</span>
			<div class="grid grid-cols-2 gap-2 qhd:gap-5 md:grid-cols-3">
				<For each={paletteColors}>
					{(paletteColor: string) => <EditColor color={paletteColor} />}
				</For>
			</div>
			<ThemeOptions />
		</div>
	);
};

export default ThemeCreation;
