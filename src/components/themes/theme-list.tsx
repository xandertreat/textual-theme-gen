import type { Component, JSX } from "solid-js";
import { mergeProps } from "solid-js";
import { gsap } from "gsap";
import Popover from "@corvu/popover";
import Icon from "../ui/icon";

interface ThemeOptionProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	label: string;
}

const ThemeOption: Component<ThemeOptionProps> = (passed) => (
	<li>
		<button
			type="button"
			class="btn btn-ghost menu-active h-fit p-0 px-1 py-0 rounded-sm justify-normal font-light"
		>
			<Icon class="size-6" icon="mdi:palette" />
			{passed.label.toLocaleLowerCase()}
		</button>
	</li>
);

const SaveTheme: Component<JSX.ButtonHTMLAttributes<HTMLButtonElement>> = (
	props,
) => (
	<button type="button" class="btn btn-success btn-sm m-2 mx-4">
		<Icon class="size-6" icon="mdi:plus" />
		Save Theme
	</button>
);

interface ThemeListProps extends JSX.HTMLAttributes<HTMLDivElement> {
	showOptions?: boolean;
}

const ThemeList: Component<ThemeListProps> = (passed) => {
	// defaults
	const props = mergeProps({ showOptions: true }, passed);
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
								gsap.to(e.target.querySelector("svg")!, {
									rotate: Math.random() * 360,
									duration: 1,
									onComplete: () => {
										gsap.to(e.target.querySelector("svg")!, { rotate: 0 });
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
				<li class="menu-title py-0 p text-left mt-2">
					<span>My themes</span>
				</li>
				<li class="mx-1" />
				<ThemeOption label="My Theme" />
				<li class="menu-title py-0 p text-left mt-5">
					<span>Included themes</span>
				</li>
				<li class="mx-1" />
				<ThemeOption label="Textual Light" />
				<ThemeOption label="Textual Dark" />
				<ThemeOption label="Tokyo Night" />
				<ThemeOption label="Dracula" />
			</ul>
		</div>
	);
};

export default ThemeList;
