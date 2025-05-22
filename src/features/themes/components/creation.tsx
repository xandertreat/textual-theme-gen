import { type Component, For, type JSX } from "solid-js";
import Icon from "../../../components/ui/icon";
import { useTheme } from "../context/theme";
import CloneTheme from "./clone";
import EditColor from "./color";
import VariablesManagement from "./variables";

const ThemeCreation: Component<JSX.HTMLAttributes<HTMLDivElement>> = (
	passed,
) => {
	const { data, firstThemeName } = useTheme();
	const paletteColors = Object.keys(data.get(firstThemeName)!.palette);

	return (
		<div class="flex flex-col gap-2 h-full" {...passed}>
			<span class="inline-flex gap-2 items-center">
				<Icon class="size-9" icon="mdi:palette" />{" "}
				<h2 class="text-3xl font-bold">Colors</h2>
			</span>
			<CloneTheme />
			<div class="grid grid-cols-3 gap-5">
				<For each={paletteColors}>
					{(paletteColor: string) => <EditColor color={paletteColor} />}
				</For>
				<VariablesManagement />
			</div>
		</div>
	);
};

export default ThemeCreation;
