import Popover from "@corvu/popover";
import type { Component, JSX } from "solid-js";
import { For, Show, createMemo, mergeProps } from "solid-js";
import Icon from "../../../components/ui/icon";
import { useTheme } from "../context/theme";
import ThemeOption from "./option";
import RandomTheme from "./random";
import ThemeReset from "./reset";

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
				<Popover.Content
					class="mt-1 w-36 bg-base-200 motion-duration-150 motion-scale-in-95 motion-opacity-in-0 data-closed:motion-scale-out-95 data-closed:motion-opacity-out-0 rounded-md border border-neutral-content/20"
					{...passed}
				>
					<ul class="menu size-full">
						<li>
							<ThemeReset />
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
	const userThemes = createMemo(() => [
		...data
			.values()
			.filter((t) => t.source === "user")
			.map((t) => t.name),
	]);
	const textualThemes = createMemo(() => [
		...data
			.values()
			.filter((t) => t.source === "textual")
			.map((t) => t.name),
	]);
	const presetThemes = createMemo(() => [
		...data
			.values()
			.filter((t) => t.source === "preset")
			.map((t) => t.name),
	]);

	return (
		<div class="flex flex-col">
			<div class="flex gap-2">
				<h2 class="text-3xl font-bold">Themes</h2>
				<Show when={props.showOptions}>
					<ThemeListOptions />
					<RandomTheme />
				</Show>
			</div>
			<ul class="menu p-0 px-1 rounded-box space-y-1 w-56">
				<li class="menu-title py-0 p text-left mt-2">My themes</li>
				<li class="mx-1" />
				<Show
					when={userThemes().length > 0}
					fallback={<li>No themes made yet!</li>}
				>
					<For each={userThemes()}>
						{(theme) => <ThemeOption theme={theme} showDelete />}
					</For>
				</Show>
				<li class="menu-title py-0 p text-left mt-5">Included themes</li>
				<li class="mx-1" />
				<Show
					when={textualThemes().length > 0}
					fallback={<li>No textual themes found</li>}
				>
					<For each={textualThemes()}>
						{(theme) => <ThemeOption theme={theme} />}
					</For>
				</Show>
				<li class="menu-title py-0 p text-left mt-5">Presets</li>
				<li class="mx-1" />
				<Show
					when={presetThemes().length > 0}
					fallback={<li>No presets found</li>}
				>
					<For each={presetThemes()}>
						{(theme) => <ThemeOption theme={theme} />}
					</For>
				</Show>
			</ul>
		</div>
	);
};

export default ThemeList;
