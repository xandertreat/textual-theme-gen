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
		<div class="flex h-full min-w-fit flex-col gap-2" {...passed}>
			<span class="inline-flex items-center gap-2">
				<Icon class="size-9" icon="mdi:palette" />{" "}
				<h2 class="font-bold text-3xl">Colors</h2>
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
