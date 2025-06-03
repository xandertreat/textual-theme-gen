import { type Component, type JSX, createMemo } from "solid-js";
import Icon from "~/components/ui/icon";
import { useTheme } from "~/features/themes/context/theme";
import CloneTheme from "./clone";
import NewColor from "./new-color";
import VariablesManagement from "./variables";

const DarkThemeToggle: Component<JSX.HTMLAttributes<HTMLInputElement>> = (
	props,
) => {
	const { selectedTheme, modifySelected } = useTheme();
	const disabled = createMemo(() => selectedTheme().source !== "user");

	return (
		<label class="mt-2 flex qhd:w-1/3 w-4/5 items-center justify-between qhd:self-auto hd:self-center">
			<span class="label select-none text-base-content">Dark theme?</span>
			<input
				checked={selectedTheme().dark ?? false}
				class="toggle"
				disabled={disabled()}
				onChange={(e) => modifySelected({ dark: !selectedTheme().dark })}
				type="checkbox"
			/>
		</label>
	);
};

const ThemeOptions: Component<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
	return (
		<div class="hd:mt-2 mt-8 flex h-full flex-col gap-2" {...props}>
			<span class="inline-flex gap-2">
				<Icon class="size-9" icon="mdi:cog" />
				<h2 class="font-bold text-3xl">Options</h2>
			</span>
			<div class="flex qhd:flex-row flex-col">
				<CloneTheme />
				<NewColor />
				<VariablesManagement />
			</div>
			<DarkThemeToggle />
		</div>
	);
};

export default ThemeOptions;
