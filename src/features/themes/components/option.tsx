import Popover from "@corvu/popover";
import type { Accessor, Component, JSX } from "solid-js";
import { Show, createMemo, createSignal, onMount, splitProps } from "solid-js";
import Icon from "../../../components/ui/icon";
import { useTheme } from "../context/theme";
import { getPaletteColor } from "../lib/utils";
import { CloneThemeOption } from "./clone";
import DeleteTheme from "./delete";
import RenameTheme from "./rename";

interface ThemeOptionPreviewProps extends JSX.HTMLAttributes<HTMLDivElement> {
	theme: string;
}

const ThemeOptionPreview: Component<ThemeOptionPreviewProps> = (props) => {
	const { data } = useTheme();
	const theme = createMemo(() => data.get(props.theme)!);

	return (
		<div
			{...props}
			style={{
				background: getPaletteColor(theme(), "background"),
			}}
		>
			<div
				style={{
					background: getPaletteColor(theme(), "primary"),
				}}
			/>
			<div
				style={{
					background: getPaletteColor(theme(), "secondary"),
				}}
			/>
			<div
				style={{
					background: getPaletteColor(theme(), "accent"),
				}}
			/>
			<div
				style={{
					background: getPaletteColor(theme(), "foreground"),
				}}
			/>
		</div>
	);
};

interface ThemeOptionMenuProps extends JSX.HTMLAttributes<HTMLDivElement> {
	theme: string;
}

const ThemeOptionMenu: Component<ThemeOptionMenuProps> = (props) => {
	const [local, rest] = splitProps(props, ["children", "theme"]);
	const { selectedThemeName } = useTheme();
	const isOptionSelected = createMemo(
		() => selectedThemeName() === local.theme,
	);

	return (
		<Popover>
			<Popover.Anchor class="aspect-square size-6">
				<Popover.Trigger
					type="button"
					class="tooltip xl:tooltip-right size-full cursor-pointer p-0.5 transition-opacity duration-200 group-hover:opacity-100"
					classList={{
						"opacity-0": !isOptionSelected(),
						"opacity-100 xl:opacity-20": isOptionSelected(),
					}}
				>
					<span class="tooltip-content">Options</span>
					<Icon
						aria-label="Theme Options"
						class="size-full"
						icon="mdi:dots-horizontal"
					/>
				</Popover.Trigger>
			</Popover.Anchor>
			<Popover.Portal>
				<Popover.Content
					class="motion-duration-150 motion-scale-in-95 motion-opacity-in-0 data-closed:motion-scale-out-95 data-closed:motion-opacity-out-0 mt-1 w-fit min-w-40 rounded-md border border-neutral-content/20 bg-base-200"
					{...rest}
				>
					<ul class="menu size-full">{local.children}</ul>
				</Popover.Content>
			</Popover.Portal>
		</Popover>
	);
};

interface ThemeOptionProps extends JSX.HTMLAttributes<HTMLLIElement> {
	theme: string;
	showDelete?: boolean;
}

const ThemeOption: Component<ThemeOptionProps> = (props) => {
	const [local, rest] = splitProps(props, ["theme", "showDelete"]);
	const { data, selectedThemeName, selectTheme } = useTheme();

	const [needsTooltip, setNeedsTooltip] = createSignal(false);
	const [hoveringLabel, setHoveringLabel] = createSignal(false);
	let hoverDelay: ReturnType<typeof setTimeout> | undefined;
	let label!: HTMLParagraphElement;

	onMount(() => setNeedsTooltip(label.scrollWidth > label.clientWidth));

	return (
		<li
			id={`theme-${local.theme}-option`}
			class="motion-duration-1000/opacity motion-ease-in-out motion-duration-300 motion-opacity-in-0 -motion-translate-x-in-50"
			classList={{
				"tooltip tooltip-open": needsTooltip() && hoveringLabel(),
			}}
			data-tip={local.theme}
			{...rest}
		>
			<a
				type="button"
				class="btn btn-ghost group flex h-fit justify-between gap-1 rounded-sm p-0 px-1 py-0 font-light"
				classList={{ "btn-active": selectedThemeName() === local.theme }}
				// biome-ignore lint/a11y/useValidAnchor: <explanation>
				onClick={() => selectTheme(local.theme)}
			>
				<span class="inline-flex items-center">
					<ThemeOptionPreview
						class="col-span-1 row-span-1 ml-0 grid size-6 grid-cols-2 grid-rows-2 gap-0.75 rounded p-1 shadow *:rounded"
						theme={local.theme}
					/>
					<p
						ref={label}
						onMouseEnter={() => {
							if (!needsTooltip()) return;
							clearTimeout(hoverDelay);
							hoverDelay = setTimeout(() => setHoveringLabel(true), 750);
						}}
						onMouseLeave={() => {
							if (!needsTooltip()) return;
							clearTimeout(hoverDelay);
							setHoveringLabel(false);
						}}
						class="w-48 max-w-max grow-0 flex-nowrap overflow-hidden overflow-ellipsis whitespace-nowrap text-nowrap pl-2 text-left xl:w-36"
					>
						{local.theme}
					</p>
				</span>
				<ThemeOptionMenu theme={local.theme}>
					<Show
						when={data.get(local.theme)?.source === "user"}
						fallback={
							<li>
								<CloneThemeOption />
							</li>
						}
					>
						<li>
							<RenameTheme theme={local.theme} />
						</li>
						<li>
							<CloneThemeOption />
						</li>
						<li>
							<DeleteTheme theme={local.theme} />
						</li>
					</Show>
				</ThemeOptionMenu>
			</a>
		</li>
	);
};

export default ThemeOption;
