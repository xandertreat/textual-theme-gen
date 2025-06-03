import Popover from "@corvu/popover";
import type { Component, JSX } from "solid-js";
import {
	For,
	Show,
	createEffect,
	createMemo,
	createSignal,
	mergeProps,
	onMount,
} from "solid-js";
import Icon from "../../../components/ui/icon";
import { useTheme } from "../context/theme";
import ClearThemes from "./clear";
import ExportThemes from "./export";
import ImportThemes from "./import";
import ThemeOption from "./option";
import RandomTheme from "./random";
import ThemeReset from "./reset";

// TODO: add export / import options (either from a textual code config or json files from app)
interface ThemeListOptionsProps extends JSX.HTMLAttributes<HTMLDivElement> {}

const ThemeListOptions: Component<ThemeListOptionsProps> = (passed) => {
	return (
		<Popover>
			<Popover.Anchor>
				<Popover.Trigger
					class="btn btn-circle btn-ghost btn-neutral-content tooltip"
					data-tip={"Options"}
					type="button"
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
					class="motion-duration-150 motion-scale-in-95 motion-opacity-in-0 data-closed:motion-scale-out-95 data-closed:motion-opacity-out-0 mt-1 w-fit min-w-36 rounded-md border border-neutral-content/20 bg-base-200"
					{...passed}
				>
					<ul class="menu size-full">
						<li>
							<ImportThemes />
						</li>
						<li>
							<ExportThemes />
						</li>
						<li>
							<ClearThemes />
						</li>
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

	// theme state
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

	// state
	const userVisibility = 1 << 0;
	const includedVisibility = 1 << 1;
	const presetVisibility = 1 << 2;

	const STORAGE_KEY = "listVisibility";
	const initialVisibility = userVisibility | includedVisibility;
	const [visibility, setVisibility] = createSignal(initialVisibility);
	const isVisible = (flag: number) => (visibility() & flag) !== 0;

	onMount(() => {
		// load from local storage (if any)
		const localData = localStorage.getItem(STORAGE_KEY);
		if (localData) setVisibility(Number(localData));

		// sync local storage from now on
		createEffect(() => {
			localStorage.setItem(STORAGE_KEY, String(visibility()));
		});
	});

	return (
		<div {...props}>
			<div class="flex justify-between">
				<h2 class="font-bold text-3xl">Themes</h2>
				<Show when={props.showOptions}>
					<div class="flex gap-2">
						<ThemeListOptions />
						<RandomTheme />
					</div>
				</Show>
			</div>
			<ul class="hd:flex grid hd:w-56 grid-cols-2 grid-rows-2 hd:flex-col gap-2 rounded-box p-0 px-1 max-xl:items-center md:grid-cols-3">
				<li class="menu-title col-span-full mt-5 py-0 text-left max-xl:mb-1 max-xl:px-1">
					<span class="flex select-none items-center justify-between">
						My themes
						<button
							class="btn btn-xs btn-ghost btn-circle"
							onClick={() => setVisibility(visibility() ^ userVisibility)}
							type="button"
						>
							<Icon
								class="size-5/6"
								icon={
									isVisible(userVisibility)
										? "mdi:eye-outline"
										: "mdi:eye-off-outline"
								}
							/>
						</button>
					</span>
				</li>
				<Show when={isVisible(userVisibility)}>
					<Show
						fallback={<li>No themes made yet!</li>}
						when={userThemes().length > 0}
					>
						<For each={userThemes()}>
							{(theme) => <ThemeOption showDelete theme={theme} />}
						</For>
					</Show>
				</Show>
				<li class="menu-title col-span-full mt-5 py-0 text-left max-xl:mb-1 max-xl:px-1">
					<span class="flex select-none items-center justify-between">
						Included themes
						<button
							class="btn btn-xs btn-ghost btn-circle"
							onClick={() => setVisibility(visibility() ^ includedVisibility)}
							type="button"
						>
							<Icon
								class="size-5/6"
								icon={
									isVisible(includedVisibility)
										? "mdi:eye-outline"
										: "mdi:eye-off-outline"
								}
							/>
						</button>
					</span>
				</li>
				<Show when={isVisible(includedVisibility)}>
					<Show
						fallback={<li>No textual themes found</li>}
						when={textualThemes().length > 0}
					>
						<For each={textualThemes()}>
							{(theme) => <ThemeOption theme={theme} />}
						</For>
					</Show>
				</Show>
				<li class="menu-title col-span-full mt-5 py-0 text-left max-xl:mb-1 max-xl:px-1">
					<span class="flex select-none items-center justify-between">
						Presets
						<button
							class="btn btn-xs btn-ghost btn-circle"
							onClick={() => setVisibility(visibility() ^ presetVisibility)}
							type="button"
						>
							<Icon
								class="size-5/6"
								icon={
									isVisible(presetVisibility)
										? "mdi:eye-outline"
										: "mdi:eye-off-outline"
								}
							/>
						</button>
					</span>
				</li>
				<Show when={isVisible(presetVisibility)}>
					<Show
						fallback={<li>No presets found</li>}
						when={presetThemes().length > 0}
					>
						<For each={presetThemes()}>
							{(theme) => <ThemeOption theme={theme} />}
						</For>
					</Show>
				</Show>
			</ul>
		</div>
	);
};

export default ThemeList;
