import Popover from "@corvu/popover";
import type { Component, JSX } from "solid-js";
import { For, Show, createMemo, mergeProps } from "solid-js";
import Icon from "../../../components/ui/icon";
import { useTheme } from "../context/theme";
import SaveTheme from "./save";
import ThemeOption from "./option";
import ThemeReset from "./reset";

interface DeleteThemeProps extends JSX.HTMLAttributes<HTMLButtonElement> {
	theme: string;
}

const RandomTheme: Component<JSX.ButtonHTMLAttributes<HTMLButtonElement>> = (
	props,
) => {
	let die!: SVGSVGElement;
	const timingFunctions = [
		"ease",
		"ease-linear",
		"ease-in",
		"ease-out",
		"ease-in-out",
		"ease-spring-smooth",
		"ease-spring-snappy",
		"ease-spring-bouncy",
		"ease-spring-bouncier",
		"ease-spring-bounciest",
		"ease-bounce",
		"ease-in-quad",
		"ease-in-cubic",
		"ease-in-quart",
		"ease-in-back",
		"ease-out-quad",
		"ease-out-cubic",
		"ease-out-quart",
		"ease-out-back",
		"ease-in-out-quad",
		"ease-in-out-cubic",
		"ease-in-out-quart",
		"ease-in-out-back",
	];

	return (
		<button
			type="button"
			data-tip="Random"
			class="btn btn-circle tooltip tooltip-top"
			onClick={() => {
				if (die.classList.contains("motion-running")) return;
				const randomTimingFunction =
					timingFunctions[Math.floor(Math.random() * timingFunctions.length)];
				const timingClass = `motion-${randomTimingFunction}`;
				die.classList.toggle(timingClass);
				die.classList.toggle("motion-paused");
				die.classList.toggle("motion-running");
				setTimeout(
					() => {
						die.classList.toggle("motion-paused");
						die.classList.toggle("motion-running");
						die.classList.toggle(timingClass);
					},
					Math.random() * 100 * Math.random() * 10 + 200,
				);
			}}
		>
			<Icon
				ref={die}
				class="size-6 motion-duration-200 motion-rotate-loop-[1turn] motion-ease-in-out motion-paused"
				icon="mdi:dice"
			/>
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
	const { themeData: data } = useTheme();
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
						{(theme) => <ThemeOption theme={theme.name} showDelete />}
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
