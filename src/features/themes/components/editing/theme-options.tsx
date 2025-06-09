import Icon from "@xtreat/solid-iconify";
import { type Component, type JSX, createMemo } from "solid-js";
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
		<label class="mt-2 flex fhd:w-full hd:w-4/5 w-full items-center justify-between qhd:px-5 fhd:pr-5 max-fhd:self-center">
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
		<div
			class="hd:mt-2 mt-8 hd:mb-0 mb-8 flex h-full flex-col gap-2"
			{...props}
		>
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
