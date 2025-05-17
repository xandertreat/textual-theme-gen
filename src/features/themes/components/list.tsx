import Popover from "@corvu/popover";
import type { Component, JSX } from "solid-js";
import { For, Show, createMemo, mergeProps } from "solid-js";
import Icon from "../../../components/ui/icon";
import { useTheme } from "../context/theme";
import { genRandomTheme } from "../lib/utils";
import type { TextualTheme } from "../types";
import ThemeOption from "./option";
import ThemeReset from "./reset";
import SaveTheme from "./save";

interface DeleteThemeProps extends JSX.HTMLAttributes<HTMLButtonElement> {
	theme: string;
} // TODO: refactor into own file + make responsive (i.e. spammable no delay etc)
const RandomTheme: Component<JSX.ButtonHTMLAttributes<HTMLButtonElement>> = (
	props,
) => {
	const { addTheme } = useTheme();
	let die!: SVGSVGElement;
	let rotating = false;
	return (
		<button
			type="button"
			data-tip="Random"
			class="btn btn-circle tooltip tooltip-top"
			onClick={() => {
				if (rotating) return;
				rotating = true;
				const rotations = Math.round(
					(Math.random() + 1) * (Math.random() * 10),
				);
				const dur = Math.round((Math.random() + 0.15) * 2000);
				die.classList.toggle(`motion-rotate-out-[${rotations}turn]`);
				die.classList.toggle(`motion-duration-${dur}ms`);
				addTheme(genRandomTheme());
				setTimeout(() => {
					die.classList.toggle(`motion-duration-${dur}ms`);
					die.classList.toggle(`motion-rotate-out-[${rotations}turn]`);
					rotating = false;
				}, dur);
			}}
		>
			<Icon ref={die} class="size-6 motion-ease-out-cubic" icon="mdi:dice" />
		</button>
	);
};

interface ThemeListOptionsProps extends JSX.HTMLAttributes<HTMLDivElement> {}

const ThemeListOptions: Component<ThemeListOptionsProps> = (passed) => {
	return (
		<Popover>
			<Popover.Anchor>
				<Popover.Trigger
					type="button"
					class="btn btn-circle btn-ghost btn-neutral-content"
				>
					<Icon
						aria-label="Theme Options"
						class="size-full"
						icon="mdi:dots-horizontal"
					/>
				</Popover.Trigger>
			</Popover.Anchor>
			<Popover.Portal>
				<Popover.Content class="mt-1 w-36 bg-base-200 motion-duration-150 motion-scale-in-95 motion-opacity-in-0 data-closed:motion-scale-out-95 data-closed:motion-opacity-out-0 rounded-md border border-neutral-content/20">
					<ul class="menu size-full">
						<li>
							<ThemeReset class="size-full text-error font-bold rounded" />
						</li>
					</ul>
				</Popover.Content>
			</Popover.Portal>
		</Popover>
	);
};

interface ThemeListProps extends JSX.HTMLAttributes<HTMLDivElement> {
	showOptions?: boolean;
}

const ThemeList: Component<ThemeListProps> = (passed) => {
	const props = mergeProps({ showOptions: true }, passed);

	// state
	const { data } = useTheme();
	const userThemes = createMemo(() =>
		Array.from(data.values().filter((t) => t.source === "user")),
	);
	const textualThemes = createMemo(() =>
		Array.from(data.values().filter((t) => t.source === "textual")),
	);
	const presetThemes = createMemo(() =>
		Array.from(data.values().filter((t) => t.source === "preset")),
	);

	return (
		<div class="flex flex-col">
			<div class="flex gap-2">
				<h2 class="text-3xl font-bold">Themes</h2>
				<Show when={props.showOptions}>
					<ThemeListOptions />
					<RandomTheme />
				</Show>
			</div>
			<SaveTheme />
			<ul class="menu p-0 px-1 rounded-box space-y-1 w-56">
				<li class="menu-title py-0 p text-left mt-2">My themes</li>
				<li class="mx-1" />
				<Show
					when={userThemes().length > 0}
					fallback={<li>No themes found</li>}
				>
					<For each={userThemes()}>
						{(theme) => <ThemeOption theme={theme.name} showDelete />}
					</For>
				</Show>
				<li class="menu-title py-0 p text-left mt-5">Included themes</li>
				<li class="mx-1" />
				<Show
					when={textualThemes().length > 0}
					fallback={<li>No themes found</li>}
				>
					<For each={textualThemes()}>
						{(theme) => <ThemeOption theme={theme.name} />}
					</For>
				</Show>
				<li class="menu-title py-0 p text-left mt-5">Presets</li>
				<li class="mx-1" />
				<Show
					when={presetThemes().length > 0}
					fallback={<li>No themes found</li>}
				>
					<For each={presetThemes()}>
						{(theme) => <ThemeOption theme={theme.name} />}
					</For>
				</Show>
			</ul>
		</div>
	);
};

export default ThemeList;
