import Dialog from "@corvu/dialog";
import { action, useSubmission } from "@solidjs/router";
import type { Component, JSX } from "solid-js";
import { createMemo, Show } from "solid-js";
import Icon from "../../../components/ui/icon";
import { useTheme } from "../context/theme";
import DeleteTheme from "./delete";
import { getPaletteColor } from "../lib/utils";

interface ThemeOptionPreviewProps extends JSX.HTMLAttributes<HTMLDivElement> {
	theme: string;
}

const ThemeOptionPreview: Component<ThemeOptionPreviewProps> = (props) => {
	const { themeData: data } = useTheme();
	const theme = createMemo(() => data.get(props.theme)!);

	return (
		<div
			{...props}
			style={{ background: getPaletteColor(theme(), "background") }}
		>
			<div style={{ background: getPaletteColor(theme(), "primary") }} />
			<div style={{ background: getPaletteColor(theme(), "secondary") }} />
			<div style={{ background: getPaletteColor(theme(), "accent") }} />
			<div style={{ background: getPaletteColor(theme(), "foreground") }} />
		</div>
	);
};

interface ThemeOptionProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	theme: string;
	showDelete?: boolean;
}

const ThemeOption: Component<ThemeOptionProps> = (props) => {
	const { themeData, currentTheme, updateCurrentTheme } = useTheme();

	return (
		<li
			id={`theme-${props.theme}-option`}
			class="motion-duration-1000/opacity motion-ease-in-out motion-duration-300 motion-opacity-in-0 -motion-translate-x-in-50"
		>
			<a
				type="button"
				class="btn btn-ghost h-fit p-0 px-1 py-0 rounded-sm font-light flex gap-1 justify-between"
				classList={{ "btn-active": props.theme === currentTheme.name }}
				// biome-ignore lint/a11y/useValidAnchor: <explanation>
				onClick={() => updateCurrentTheme(themeData.get(props.theme)!)}
			>
				<span class="inline-flex items-center gap-2">
					<ThemeOptionPreview
						class="ml-0 size-6 grid grid-cols-2 grid-rows-2 gap-0.75 p-1 rounded *:rounded shadow col-span-1 row-span-1"
						theme={props.theme}
					/>
					{props.theme.toLocaleLowerCase()}
				</span>
				<Show when={props.showDelete}>
					<DeleteTheme
						class="tooltip tooltip-right tooltip-error h-5/6 cursor-pointer text-error"
						theme={props.theme}
					/>
				</Show>
			</a>
		</li>
	);
};

export default ThemeOption;
