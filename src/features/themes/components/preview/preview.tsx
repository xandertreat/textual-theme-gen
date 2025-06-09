import { Select } from "@kobalte/core/select";
import {
	type Component,
	For,
	type JSX,
	Match,
	Show,
	Switch,
	createEffect,
	createMemo,
	createSignal,
	onMount,
} from "solid-js";
import { DEFAULTS, useTheme } from "~/features/themes/context/theme";
import {
	DISABLED_ALPHA,
	MUTED_ALPHA,
	TEXT_ALPHA,
	calcAutoText,
} from "~/features/themes/lib/color";
import type { TextualColor } from "~/features/themes/types";
import IconChevronUpDown from "~icons/mdi/chevron-up-down";
import CommandPalette from "./command-palette";
import TerminalWindow from "./terminal";
import Todos from "./todos";

const PaletteColorPreview: Component<
	JSX.HTMLAttributes<HTMLDivElement> & { paletteKey: string }
> = (props) => {
	const { selectedTheme } = useTheme();
	const paletteColors = createMemo(() =>
		Object.entries(selectedTheme().palette[props.paletteKey]),
	);
	const sortedNonDarkPaletteColors = createMemo(() =>
		paletteColors().filter(([v]) => !v.includes("darken")),
	);
	const sortedDarkPaletteColors = createMemo(() =>
		paletteColors()
			.filter(([v]) => v.includes("darken"))
			.sort(([a], [b]) => Number(a.charAt(-1)) - Number(b.charAt(-1))),
	);

	const ColorPreview: Component<
		JSX.HTMLAttributes<HTMLSpanElement> & {
			variant: string;
			data: TextualColor;
		}
	> = (passed) => {
		const contrast = createMemo(() =>
			calcAutoText({
				base: passed.data.color,
				bg: selectedTheme().palette.background.base.color,
			}),
		);
		return (
			<span
				class="flex fhd:h-16 h-13 min-w-max items-center justify-between gap-8 text-nowrap px-2 py-2 pr-8 pl-16 text-center text-sm md:w-auto"
				style={{
					"background-color": passed.data.color,
				}}
			>
				<p
					class="mr-8 w-40"
					style={{
						color: contrast().alpha(TEXT_ALPHA).hexa(),
					}}
				>
					${props.paletteKey}
					{passed.variant !== "base" ? `-${passed.variant}` : undefined}
				</p>
				<p
					style={{
						color: contrast().alpha(MUTED_ALPHA).hexa(),
					}}
				>
					$text-muted
				</p>
				<p
					style={{
						color: contrast().alpha(DISABLED_ALPHA).hexa(),
					}}
				>
					$text-disabled
				</p>
			</span>
		);
	};

	return (
		<div
			class="mb-3 grid h-fit max-h-9/10 w-9/10 overflow-scroll border-2 px-10 hd:pb-10 md:max-h-5/6 md:w-5/6"
			style={{
				"background-color": selectedTheme().palette.surface.base.color,
				"border-color": selectedTheme().palette.primary.base.color,
			}}
			{...props}
		>
			<h2
				class="mt-2 mb-4 self-center font-bold"
				style={{
					color: selectedTheme().palette.foreground.base.text,
				}}
			>
				"{props.paletteKey}"
			</h2>
			<div class="flex w-full flex-col max-hd:mb-12">
				<For each={sortedDarkPaletteColors()}>
					{([variant, data]) => <ColorPreview data={data} variant={variant} />}
				</For>
				<For each={sortedNonDarkPaletteColors()}>
					{([variant, data]) => <ColorPreview data={data} variant={variant} />}
				</For>
			</div>
		</div>
	);
};

const TextColorsPreview: Component<
	JSX.HTMLAttributes<HTMLDivElement> & { showMutedBackgrounds: boolean }
> = (props) => {
	const { selectedTheme } = useTheme();
	const paletteColors = [
		"primary",
		"secondary",
		"warning",
		"error",
		"success",
		"accent",
	];

	return (
		<div
			class="flex size-full flex-col items-start justify-start pt-2 pl-2 text-3xl"
			style={{
				"background-color": selectedTheme().palette.background.base.color,
			}}
			{...props}
		>
			<For each={paletteColors}>
				{(paletteColor) => (
					<h3
						class="px-1 py-0.25"
						style={{
							color: selectedTheme().palette[paletteColor].base.text,
							"background-color": props.showMutedBackgrounds
								? selectedTheme().palette[paletteColor].base.muted
								: undefined,
						}}
					>{`$text-${paletteColor}`}</h3>
				)}
			</For>
		</div>
	);
};

const paletteKeys = Object.keys(DEFAULTS[0].palette).map(
	(k) => `${k[0].toUpperCase()}${k.slice(1)}`,
);
const Preview = () => {
	const previewOptions = ["Todos App", "Colors", "Text"];
	const [currentPreview, setPreview] = createSignal(previewOptions[0]);
	// ordered to match `textual colors` preview
	const colorPreviewOptions = [
		"Primary",
		"Secondary",
		"Background",
		"Foreground",
		"Surface",
		"Panel",
		"Boost",
		"Warning",
		"Error",
		"Success",
		"Accent",
	];
	const [currentColorPreview, setColorPreview] = createSignal(
		colorPreviewOptions[0],
	);
	const [showCommandPalette, setCommandPaletteVisibility] = createSignal(false);
	const [showMutedBackgrounds, setMutedBackgroundsVisibility] =
		createSignal(false);
	const [selectOpen, setSelectOpen] = createSignal(false);

	onMount(() => {
		// load from local storage (if any)
		const lastPreview = localStorage.getItem("lastPreview");
		if (lastPreview) setPreview(lastPreview);
		const lastColorPreview = localStorage.getItem("lastColorPreview");
		if (lastColorPreview) setColorPreview(lastColorPreview);
		const persistedVisibility = localStorage.getItem("cmdVis");
		if (persistedVisibility)
			setCommandPaletteVisibility(Boolean(persistedVisibility));
		const showMuted = localStorage.getItem("mutedVis");
		if (showMuted) setMutedBackgroundsVisibility(Boolean(showMuted));

		// sync local storage from now on
		createEffect(() => {
			localStorage.setItem("lastPreview", currentPreview());
		});
		createEffect(() => {
			localStorage.setItem("lastColorPreview", currentColorPreview());
		});
		createEffect(() => {
			localStorage.setItem("cmdVis", String(showCommandPalette()));
		});
		createEffect(() => {
			localStorage.setItem("mutedVis", String(showMutedBackgrounds()));
		});
	});

	createEffect(() => {
		if (selectOpen())
			document.addEventListener("click", () => setSelectOpen(false), {
				once: true,
			});
	});

	const [colorSelectOpen, setColorSelectOpen] = createSignal(false);

	createEffect(() => {
		if (colorSelectOpen())
			document.addEventListener("click", () => setColorSelectOpen(false), {
				once: true,
			});
	});

	return (
		<div class="flex h-fit w-full hd:min-w-2/3 qhd:min-w-3/5 hd:max-w-2/3 qhd:max-w-3/5 flex-col items-center gap-2 overflow-clip">
			<TerminalWindow>
				<Switch>
					<Match when={currentPreview() === "Todos App"}>
						<Todos />
					</Match>
					<For each={paletteKeys}>
						{(key) => (
							<Match
								when={
									currentPreview() === "Colors" && currentColorPreview() === key
								}
							>
								<PaletteColorPreview paletteKey={key.toLowerCase()} />
							</Match>
						)}
					</For>
					<Match when={currentPreview() === "Text"}>
						<TextColorsPreview showMutedBackgrounds={showMutedBackgrounds()} />
					</Match>
				</Switch>
				<Show when={showCommandPalette()}>
					<CommandPalette />
				</Show>
			</TerminalWindow>
			<div class="mt-1 flex w-full flex-col items-start justify-between gap-2 font-light text-sm md:flex-row">
				<div class=" flex flex-col gap-2 md:hidden">
					<label class="label flex items-center justify-between gap-2">
						<span class="cursor-default select-none text-base-content">
							Show command palette?
						</span>
						<input
							checked={showCommandPalette()}
							class="checkbox rounded-md border border-base-content/30 text-green-600 transition-colors duration-150 hover:border-base-content/50"
							onChange={(e) =>
								setCommandPaletteVisibility(!showCommandPalette())
							}
							type="checkbox"
						/>
					</label>
					<Show when={currentPreview() === "Text"}>
						<label class="label flex items-center justify-between gap-2">
							<span class="cursor-default select-none text-base-content">
								Show muted backgrounds?
							</span>
							<input
								checked={showMutedBackgrounds()}
								class="checkbox rounded-md border border-base-content/30 text-green-600 transition-colors duration-150 hover:border-base-content/50"
								onChange={(e) =>
									setMutedBackgroundsVisibility(!showMutedBackgrounds())
								}
								type="checkbox"
							/>
						</label>
					</Show>
				</div>
				<div class="flex items-start gap-2 lg:flex-col">
					<Select
						class="flex w-full flex-col items-center justify-between gap-1 lg:flex-row"
						disallowEmptySelection={true}
						itemComponent={(props) => (
							<Select.Item item={props.item}>
								<Select.ItemLabel
									classList={{
										"menu-active": currentPreview() === props.item.rawValue,
									}}
								>
									{props.item.rawValue}
								</Select.ItemLabel>
							</Select.Item>
						)}
						onChange={setPreview}
						open={selectOpen()}
						options={previewOptions}
						placeholder="Select a preview..."
						placement="bottom"
						value={currentPreview()}
					>
						<Select.Label
							class="mr-2 cursor-default select-none"
							onClick={() => setSelectOpen(!selectOpen())}
						>
							Current Preview
						</Select.Label>
						<Select.Trigger
							aria-label="Preview"
							class="inline-flex w-28 cursor-pointer items-center justify-between gap-2 rounded-md border border-base-content/30 p-2 transition-colors duration-150 hover:border-base-content/50"
							onClick={() => setSelectOpen(!selectOpen())}
						>
							<Select.Value<string>>
								{(state) => state.selectedOption()}
							</Select.Value>
							<IconChevronUpDown class="size-4" />
						</Select.Trigger>
						<Select.Portal>
							<Select.Content class="motion-duration-200 motion-opacity-in motion-scale-in-95 data-[closed]:motion-opacity-out data-[closed]:motion-scale-out-95">
								<Select.Listbox class="menu menu-vertical space-y-0.75 rounded border border-base-300 bg-base-200 shadow **:cursor-default **:rounded" />
							</Select.Content>
						</Select.Portal>
					</Select>
					<Show when={currentPreview() === "Colors"}>
						<Select
							class="flex w-full flex-col items-center justify-between gap-1 lg:flex-row"
							disallowEmptySelection={true}
							itemComponent={(props) => (
								<Select.Item item={props.item}>
									<Select.ItemLabel
										classList={{
											"menu-active":
												currentColorPreview() === props.item.rawValue,
										}}
									>
										{props.item.rawValue}
									</Select.ItemLabel>
								</Select.Item>
							)}
							onChange={setColorPreview}
							open={colorSelectOpen()}
							options={colorPreviewOptions}
							placeholder="Select a color..."
							placement="bottom"
							value={currentColorPreview()}
						>
							<Select.Label
								class="mr-2 cursor-default select-none"
								onClick={() => setColorSelectOpen(!colorSelectOpen())}
							>
								Current Color
							</Select.Label>
							<Select.Trigger
								aria-label="Color Preview"
								class="inline-flex w-28 cursor-pointer items-center justify-between gap-2 rounded-md border border-base-content/30 p-2 transition-colors duration-150 hover:border-base-content/50"
								onClick={() => setColorSelectOpen(!colorSelectOpen())}
							>
								<Select.Value<string>>
									{(state) => state.selectedOption()}
								</Select.Value>
								<IconChevronUpDown class="size-4" />
							</Select.Trigger>
							<Select.Portal>
								<Select.Content class="motion-duration-200 motion-opacity-in motion-scale-in-95 data-[closed]:motion-opacity-out data-[closed]:motion-scale-out-95">
									<Select.Listbox class="menu menu-vertical space-y-0.75 rounded border border-base-300 bg-base-200 shadow **:cursor-default **:rounded" />
								</Select.Content>
							</Select.Portal>
						</Select>
					</Show>
				</div>
				<div class=" hidden flex-col gap-2 md:flex">
					<label class="label flex items-center justify-between gap-2">
						<span class="cursor-default select-none text-base-content">
							Show command palette?
						</span>
						<input
							checked={showCommandPalette()}
							class="checkbox rounded-md border border-base-content/30 text-green-600 transition-colors duration-150 hover:border-base-content/50"
							onChange={(e) =>
								setCommandPaletteVisibility(!showCommandPalette())
							}
							type="checkbox"
						/>
					</label>
					<Show when={currentPreview() === "Text"}>
						<label class="label flex items-center justify-between gap-2">
							<span class="cursor-default select-none text-base-content">
								Show muted backgrounds?
							</span>
							<input
								checked={showMutedBackgrounds()}
								class="checkbox rounded-md border border-base-content/30 text-green-600 transition-colors duration-150 hover:border-base-content/50"
								onChange={(e) =>
									setMutedBackgroundsVisibility(!showMutedBackgrounds())
								}
								type="checkbox"
							/>
						</label>
					</Show>
				</div>
			</div>
		</div>
	);
};

export default Preview;
