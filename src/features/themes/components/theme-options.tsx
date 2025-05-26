import {
	createEffect,
	createMemo,
	createSignal,
	type Component,
	type JSX,
} from "solid-js";
import Icon from "~/components/ui/icon";
import CloneTheme from "./clone";
import EditColor from "./color";
import NewColor from "./new-color";
import VariablesManagement from "./variables";
import { useTheme } from "../context/theme";

const DarkThemeToggle: Component<JSX.HTMLAttributes<HTMLInputElement>> = (
	props,
) => {
	const { selectedTheme, modifySelected } = useTheme();
	const disabled = createMemo(() => selectedTheme().source !== "user");

	return (
		<input
			type="checkbox"
			class="toggle"
			disabled={disabled()}
			checked={selectedTheme().dark ?? false}
			onChange={(e) => modifySelected({ dark: !selectedTheme().dark })}
		/>
	);
};

const ThemeOptions: Component<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
	return (
		<div class="mt-8 flex h-full flex-col gap-2 xl:mt-10" {...props}>
			<span class="inline-flex items-center gap-2">
				<Icon class="size-9" icon="mdi:cog" />{" "}
				<h2 class="font-bold text-3xl">Options</h2>
			</span>
			<div class="flex">
				<CloneTheme />
				<NewColor />
				<VariablesManagement />
			</div>
			<span class="flex w-1/3 items-center justify-between">
				<p>Dark theme</p>
				<DarkThemeToggle />
			</span>
		</div>
	);
};

export default ThemeOptions;
