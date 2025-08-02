import Popover from "@corvu/popover";
import type { Component, JSX } from "solid-js";
import {
	For,
	Show,
	createEffect,
	createMemo,
	mergeProps,
	onMount,
} from "solid-js";
import { createStore } from "solid-js/store";
import { useTheme } from "~/features/themes/context/theme";
import ClearThemes from "./clear";
import ExportThemes from "./export";
import ImportThemes from "./import";
import NewTheme from "./new";
import ThemeOption from "./option";
import RandomTheme from "./random";
import ThemeReset from "./reset";

interface ThemeListOptionsProps extends JSX.HTMLAttributes<HTMLDivElement> {}

const ThemeListOptions: Component<ThemeListOptionsProps> = (passed) => {
	return (
		<Popover>
			<Popover.Anchor>
				<Popover.Trigger
					aria-label="Open theme options menu"
					class="btn btn-circle btn-ghost btn-neutral-content tooltip"
					data-tip={"Theme Options"}
					type="button"
				>
					<IconMdiDotsHorizontal aria-hidden="true" class="size-full" />
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

interface ListVisibility {
	user: boolean;
	builtIn: boolean;
	preset: boolean;
}

const ThemeList: Component<ThemeListProps> = (passed) => {
	const props = mergeProps({ showOptions: true }, passed);

	// theme state
	const { data } = useTheme();
	const vals = createMemo(() => [...data.values()]);
	const userThemes = createMemo(() =>
		vals()
			.filter((t) => t.source === "user")
			.map((t) => t.name),
	);
	const builtInThemes = createMemo(() =>
		vals()
			.filter((t) => t.source === "textual")
			.map((t) => t.name),
	);
	const presetThemes = createMemo(() =>
		vals()
			.filter((t) => t.source === "preset")
			.map((t) => t.name),
	);

	// state
	const [listVisibility, setVisibility] = createStore<ListVisibility>({
		user: true,
		builtIn: true,
		preset: false,
	});

	onMount(() => {
		try {
			const localData = localStorage.getItem("listVisibility");
			if (localData) setVisibility(JSON.parse(localData));
		} catch (e) {
			console.error(
				"[ERROR] - Failed to load list visibility from local storage!",
			);
			localStorage.removeItem("listVisibility");
		}
		createEffect(() =>
			localStorage.setItem("listVisibility", JSON.stringify(listVisibility)),
		);
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
			<ol class="hd:flex grid hd:w-56 grid-cols-1 xs:grid-cols-2 hd:flex-col gap-2 rounded-box p-0 px-1 md:grid-cols-3">
				<li class="col-span-full mt-5 py-0 text-left font-semibold text-sm max-xl:mb-1 max-xl:px-1">
					<button
						aria-controls="user-themes-list"
						aria-expanded={listVisibility.user}
						aria-label={
							listVisibility.user ? "Hide My Themes" : "Show My Themes"
						}
						aria-pressed={!listVisibility.user}
						class="inline-flex w-full select-none items-center justify-between text-nowrap transition-opacity duration-150 ease-in-out *:size-5"
						classList={{
							"opacity-80": !listVisibility.user,
							"opacity-100": listVisibility.user,
						}}
						onClick={() => setVisibility("user", !listVisibility.user)}
						type="button"
					>
						My themes
						<Show
							fallback={
								<IconMdiEyeOffOutline
									aria-hidden="true"
									class="btn btn-xs btn-ghost btn-circle"
								/>
							}
							when={listVisibility.user}
						>
							<IconMdiEyeOutline
								aria-hidden="true"
								class="btn btn-xs btn-ghost btn-circle"
							/>
						</Show>
					</button>
				</li>
				<Show when={listVisibility.user}>
					<Show
						fallback={<li aria-live="polite">No themes made yet!</li>}
						when={userThemes().length > 0}
					>
						<For each={userThemes()}>
							{(theme) => <ThemeOption showDelete theme={theme} />}
						</For>
					</Show>
					<NewTheme />
				</Show>
				<li class="col-span-full mt-5 py-0 text-left font-semibold text-sm max-xl:mb-1 max-xl:px-1">
					<button
						aria-controls="built-in-themes-list"
						aria-expanded={listVisibility.builtIn}
						aria-label={
							listVisibility.builtIn
								? "Hide Built-in Themes"
								: "Show Built-in Themes"
						}
						aria-pressed={!listVisibility.builtIn}
						class="inline-flex w-full select-none items-center justify-between text-nowrap transition-opacity duration-150 ease-in-out *:size-5"
						classList={{
							"opacity-80": !listVisibility.builtIn,
							"opacity-100": listVisibility.builtIn,
						}}
						onClick={() => setVisibility("builtIn", !listVisibility.builtIn)}
						type="button"
					>
						Built-in themes
						<Show
							fallback={
								<IconMdiEyeOffOutline
									aria-hidden="true"
									class="btn btn-xs btn-ghost btn-circle"
								/>
							}
							when={listVisibility.builtIn}
						>
							<IconMdiEyeOutline
								aria-hidden="true"
								class="btn btn-xs btn-ghost btn-circle"
							/>
						</Show>
					</button>
				</li>
				<Show when={listVisibility.builtIn}>
					<Show
						fallback={<li>No textual themes found</li>}
						when={builtInThemes().length > 0}
					>
						<For each={builtInThemes()}>
							{(theme) => <ThemeOption theme={theme} />}
						</For>
					</Show>
				</Show>
				<li class="col-span-full mt-5 py-0 text-left font-semibold text-sm max-xl:mb-1 max-xl:px-1">
					<button
						aria-controls="preset-themes-list"
						aria-expanded={listVisibility.preset}
						aria-label={
							listVisibility.preset
								? "Hide Preset Themes"
								: "Show Preset Themes"
						}
						aria-pressed={!listVisibility.preset}
						class="inline-flex w-full select-none items-center justify-between text-nowrap transition-opacity duration-150 ease-in-out *:size-5"
						classList={{
							"opacity-80": !listVisibility.preset,
							"opacity-100": listVisibility.preset,
						}}
						onClick={() => setVisibility("preset", !listVisibility.preset)}
						type="button"
					>
						Presets
						<Show
							fallback={
								<IconMdiEyeOffOutline
									aria-hidden="true"
									class="btn btn-xs btn-ghost btn-circle"
								/>
							}
							when={listVisibility.preset}
						>
							<IconMdiEyeOutline
								aria-hidden="true"
								class="btn btn-xs btn-ghost btn-circle"
							/>
						</Show>
					</button>
				</li>
				<Show when={listVisibility.preset}>
					<Show
						fallback={<li>No presets found</li>}
						when={presetThemes().length > 0}
					>
						<For each={presetThemes()}>
							{(theme) => <ThemeOption theme={theme} />}
						</For>
					</Show>
				</Show>
			</ol>
		</div>
	);
};

export default ThemeList;
