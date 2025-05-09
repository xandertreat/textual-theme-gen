import Popover from "@corvu/popover";
import { action, useSubmission } from "@solidjs/router";
import { gsap } from "gsap";
import type { Component, JSX } from "solid-js";
import { createMemo, For, mergeProps, Show } from "solid-js";
import Icon from "../../../components/ui/icon";
import { useTheme } from "../context/theme";
import type { TextualTheme } from "../types";
import Dialog from "@corvu/dialog";

interface ThemeOptionProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	label: string;
	showDelete?: boolean;
}

const ThemeOption: Component<ThemeOptionProps> = (props) => {
	const { currentTheme, setCurrentTheme } = useTheme();

	const deleteAction = action(async () => {
		const { data } = useTheme();
		return await Promise.resolve(data.delete(props.label));
	}, "deleteAction");
	const submission = useSubmission(deleteAction);

	return (
		<li>
			<a
				type="button"
				class="btn btn-ghost h-fit p-0 px-1 py-0 rounded-sm font-light flex gap-1 justify-between"
				classList={{ "btn-active": currentTheme.name === props.label }}
				// biome-ignore lint/a11y/useValidAnchor: <explanation>
				onClick={() => setCurrentTheme(props.label)}
			>
				<span class="inline-flex items-center gap-1">
					{/* TODO: Add color preview */}
					<Icon class="size-6" icon="mdi:palette" />
					{props.label.toLocaleLowerCase()}
				</span>
				<Show when={props.showDelete}>
					<Dialog>
						<Dialog.Trigger
							type="button"
							data-tip={submission.pending ? "Deleting..." : "Delete"}
							formAction={deleteAction}
							class="tooltip tooltip-right tooltip-error btn btn-xs btn-circle btn-ghost"
						>
							<Icon class="size-2/3 text-error" icon="mdi:trash-can-outline" />
						</Dialog.Trigger>
						<Dialog.Portal>
							<Dialog.Overlay />
							<Dialog.Content>
								<Dialog.Close />
								<Dialog.Label> Hi</Dialog.Label>
								<Dialog.Description />
							</Dialog.Content>
						</Dialog.Portal>
					</Dialog>
				</Show>
			</a>
		</li>
	);
};

const SaveTheme: Component<JSX.ButtonHTMLAttributes<HTMLButtonElement>> = (
	props,
) => {
	const { data, currentTheme } = useTheme();

	const saveAction = action(async () => {
		data.set(currentTheme.name, currentTheme);
	}, "saveThemeAction");
	const submission = useSubmission(saveAction);

	return (
		<Dialog>
			<Dialog.Trigger
				type="button"
				class="btn btn-success btn-sm m-2 mx-4"
				data-tip={submission.pending ? "Deleting..." : "Delete"}
				formAction={saveAction}
			>
				<Icon class="size-6" icon="mdi:plus" />
				Save Theme
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay />
				<Dialog.Content>
					<Dialog.Close />
					<Dialog.Label> Hi</Dialog.Label>
					<Dialog.Description />
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog>
	);
};

interface ThemeListProps extends JSX.HTMLAttributes<HTMLDivElement> {
	showOptions?: boolean;
}

const ThemeList: Component<ThemeListProps> = (passed) => {
	// defaults
	const props = mergeProps({ showOptions: true }, passed);
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
				<Popover>
					<Popover.Anchor class="flex gap-3">
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
						<button
							type="button"
							data-tip="Random"
							class="btn btn-circle tooltip tooltip-top"
							onClick={(e) =>
								gsap.to(e.target.querySelector("path")!, {
									rotate: Math.random() * 360,
									duration: 1,
									onComplete: () => {
										gsap.to(e.target.querySelector("path")!, { rotate: 0 });
									},
								})
							}
						>
							<Icon class="size-6" icon="mdi:dice" />
						</button>
					</Popover.Anchor>
					<Popover.Portal>
						<Popover.Overlay />
						<Popover.Content>
							<Popover.Arrow />
							<Popover.Close />
							<Popover.Label />
							<Popover.Description />
						</Popover.Content>
					</Popover.Portal>
				</Popover>
			</div>
			<SaveTheme />
			<ul class="menu p-0 px-1 rounded-box space-y-1 w-56">
				<li class="menu-title py-0 p text-left mt-2">My themes</li>
				<li class="mx-1" />
				<Show
					when={userThemes().length > 0}
					fallback={
						<li>
							<span>No themes found</span>
						</li>
					}
				>
					<For each={userThemes()}>
						{(theme) => <ThemeOption label={theme.name} showDelete />}
					</For>
				</Show>
				<li class="menu-title py-0 p text-left mt-5">Included themes</li>
				<li class="mx-1" />
				<Show
					when={textualThemes().length > 0}
					fallback={
						<li>
							<span>No themes found</span>
						</li>
					}
				>
					<For each={textualThemes()}>
						{(theme) => <ThemeOption label={theme.name} showDelete />}
					</For>
				</Show>
				<li class="menu-title py-0 p text-left mt-5">Presets</li>
				<li class="mx-1" />
				<Show
					when={presetThemes().length > 0}
					fallback={
						<li>
							<span>No themes found</span>
						</li>
					}
				>
					<For each={presetThemes()}>
						{(theme) => <ThemeOption label={theme.name} />}
					</For>
				</Show>
			</ul>
		</div>
	);
};

export default ThemeList;
