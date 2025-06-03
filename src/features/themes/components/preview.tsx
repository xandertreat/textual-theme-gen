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
} from "solid-js";
import Icon from "../../../components/ui/icon";
import { DEFAULTS, useTheme } from "../context/theme";
import {
	DISABLED_ALPHA,
	MUTED_ALPHA,
	TEXT_ALPHA,
	calcAutoText,
	getContrastText,
	inverse,
} from "../lib/color";
import type { TextualColor } from "../types";

const TerminalWindow: Component<JSX.HTMLAttributes<HTMLDivElement>> = (
	props,
) => (
	<div
		class="flex size-full grow-0 flex-col rounded border border-primary bg-neutral shadow-md"
		{...props}
	>
		<div class="relative flex w-full items-center px-4 py-2">
			<div class="flex items-center gap-2 *:size-3 *:rounded-full">
				<button class="bg-error" type="button" />
				<button class="bg-warning" type="button" />
				<button class="bg-success" type="button" />
			</div>
			<h2 class="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-1/2 left-1/2 m-0 select-none text-center text-zinc-200">
				Terminal
			</h2>
		</div>
		<div
			class="relative row-span-12 flex h-96 w-full items-center justify-center rounded-br rounded-bl bg-primary/5 font-mono text-neutral-content xl:h-170"
			style={{
				"background-color":
					useTheme().selectedTheme().palette.background.base.color,
			}}
		>
			{props.children}
		</div>
	</div>
);

const CommandPaletteFooter: Component<JSX.HTMLAttributes<HTMLElement>> = (
	props,
) => {
	const { selectedTheme } = useTheme();
	const footerBackground = createMemo(
		() => selectedTheme().palette.panel.base.color,
	);
	const footerText = createMemo(() =>
		getContrastText(footerBackground()).hexa(),
	);
	const keyBindingColor = createMemo(() => inverse(footerBackground()).hexa());

	return (
		<footer
			class="absolute bottom-0 left-0 m-0 inline-flex h-4 w-full items-center justify-between gap-2 rounded-br rounded-bl bg-size-[90%] text-center text-sm"
			style={{
				"background-color": footerBackground(),
			}}
			{...props}
		>
			<div class="inline-flex gap-4 pt-1.5">
				<span class="inline-flex h-full gap-2">
					<kbd
						class="font-black"
						style={{
							color: keyBindingColor(),
						}}
					>
						[
					</kbd>
					<p
						style={{
							color: footerText(),
						}}
					>
						Previous theme
					</p>
				</span>
				<span class="inline-flex h-full gap-2">
					<kbd
						class="font-black"
						style={{
							color: keyBindingColor(),
						}}
					>
						]
					</kbd>
					<p
						style={{
							color: footerText(),
						}}
					>
						Next theme
					</p>
				</span>
				<p aria-hidden={"true"} class="-ml-3 text-transparent text-xl">
					|
				</p>
			</div>
			<span class="inline-flex items-center gap-2">
				<div
					class="h-4 w-px text-transparent opacity-30"
					style={{
						"background-color": calcAutoText({
							bg: footerBackground(),
							base: selectedTheme().palette.boost.base.color,
						}).hexa(),
					}}
				>
					|
				</div>
				<span class="mr-2.25 mb-1 inline-flex gap-2">
					<kbd
						class="font-black"
						style={{
							color: keyBindingColor(),
						}}
					>
						^p
					</kbd>
					<p
						style={{
							color: footerText(),
						}}
					>
						palette
					</p>
				</span>
			</span>
		</footer>
	);
};

const StylingTooltip: Component<JSX.HTMLAttributes<HTMLSpanElement>> = (
	props,
) => <span class="tooltip-content rounded-none text-justify" {...props} />;

const TodosPreview: Component<JSX.HTMLAttributes<HTMLElement>> = (props) => {
	const { selectedTheme } = useTheme();

	// colors
	const bg = createMemo(() => selectedTheme().palette.background.base.color);
	const bgSurface = createMemo(
		() => selectedTheme().palette.surface.base.color,
	);

	return (
		<div
			aria-hidden={true}
			class="relative inset-0 size-full overflow-hidden text-2xl leading-7 tracking-[-0.075em]"
			style={{
				color: bgSurface(),
			}}
		>
			{"╱".repeat(300).concat("\n").repeat(100)}
			<main
				class="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 flex h-80 w-1/2 flex-col gap-2 px-9 py-7 text-md tracking-normal xl:h-2/3"
				style={{
					"background-color": bg(),
				}}
				{...props}
			>
				<div class="flex justify-between">
					<span
						class="tooltip tooltip-info font-bold"
						style={{
							color: selectedTheme().palette.foreground.base.color,
						}}
					>
						<StylingTooltip>
							<b>text:</b> $foreground
						</StylingTooltip>
						Today
					</span>
					<div class="flex justify-center gap-3 *:px-3.5">
						<span
							class="tooltip tooltip-info"
							style={{
								color: selectedTheme().palette.error.base.text,
								"background-color": selectedTheme().palette.error.base.muted,
							}}
						>
							<StylingTooltip>
								<b>background:</b> $error-muted
								<br />
								<b>text:</b> $text-error
							</StylingTooltip>
							1 overdue
						</span>
						<span
							class="tooltip tooltip-info"
							style={{
								color: selectedTheme().palette.success.base.text,
								"background-color": selectedTheme().palette.success.base.muted,
							}}
						>
							<StylingTooltip>
								<b>background:</b> $success-muted
								<br />
								<b>text:</b> $text-success
							</StylingTooltip>
							1 done
						</span>
					</div>
				</div>
				<div
					class="tooltip tooltip-bottom tooltip-info flex size-full flex-col"
					style={{
						"background-color": bgSurface(),
					}}
				>
					<StylingTooltip>
						<b>background:</b> $surface
						<br />
						<b>text:</b> $boost {MUTED_ALPHA * 100}%
					</StylingTooltip>
					<div
						class="tooltip tooltip-right tooltip-info flex size-full flex-col border-3 p-3 *:flex *:items-center *:gap-3 *:*:px-3 *:*:py-1"
						style={{
							"border-color": selectedTheme().palette.primary.base.color,
						}}
					>
						<StylingTooltip>
							<b>border:</b> $primary
						</StylingTooltip>
						<span
							class="tooltip tooltip-info font-black"
							style={{
								"background-color": selectedTheme().palette.primary.base.color,
							}}
						>
							<StylingTooltip>
								<b>background:</b> $primary
								<br />
								<b>text:</b> $text
							</StylingTooltip>
							<p
								class="tooltip tooltip-info tooltip-left"
								style={{
									color: selectedTheme().palette.panel["darken-2"].color,
									"background-color": selectedTheme().palette.panel.base.color,
								}}
							>
								<StylingTooltip>
									<b>background:</b> $panel
									<br />
									<b>text:</b> $panel-darken-2
								</StylingTooltip>
								X
							</p>

							<p
								style={{
									color: getContrastText(
										selectedTheme().palette.primary.base.color,
									).hexa(),
								}}
							>
								Buy milk
							</p>
						</span>
						<div>
							<span
								class="tooltip tooltip-info tooltip-left"
								style={{
									color: selectedTheme().palette.panel["darken-2"].color,
									"background-color": selectedTheme().palette.panel.base.color,
								}}
							>
								<StylingTooltip>
									<b>background:</b> $panel
									<br />
									<b>text:</b> $panel-darken-2
								</StylingTooltip>
								X
							</span>
							<span
								class="tooltip tooltip-right tooltip-info"
								style={{
									color: selectedTheme().palette.foreground.base.color,
								}}
							>
								<StylingTooltip>
									<b>text:</b> $foreground
								</StylingTooltip>
								Buy Bread
							</span>
						</div>
						<div>
							<span
								class="tooltip tooltip-info tooltip-left"
								style={{
									color: selectedTheme().palette.success.base.text,
									"background-color": selectedTheme().palette.panel.base.color,
								}}
							>
								<StylingTooltip>
									<b>background:</b> $panel
									<br />
									<b>text:</b> $text-success
								</StylingTooltip>
								X
							</span>
							<span
								class="tooltip tooltip-right tooltip-info"
								style={{
									color: selectedTheme().palette.foreground.base.color,
								}}
							>
								<StylingTooltip>
									<b>text:</b> $foreground
								</StylingTooltip>
								Go and vote
							</span>
						</div>
						<div>
							<span
								class="tooltip tooltip-info tooltip-left"
								style={{
									color: selectedTheme().palette.panel["darken-2"].color,
									"background-color": selectedTheme().palette.panel.base.color,
								}}
							>
								<StylingTooltip>
									<b>background:</b> $panel
									<br />
									<b>text:</b> $panel-darken-2
								</StylingTooltip>
								X
							</span>
							<span
								class="tooltip tooltip-right tooltip-info"
								style={{
									color: selectedTheme().palette.foreground.base.color,
								}}
							>
								<StylingTooltip>
									<b>text:</b> $foreground
								</StylingTooltip>
								Return package
							</span>
						</div>
					</div>
					<span
						class="tooltip tooltip-right tooltip-info border-3 p-6 text-left"
						style={{
							color: selectedTheme().palette.boost.base.muted,
							"border-color": selectedTheme().palette.boost.base.color,
						}}
					>
						<StylingTooltip>
							<b>border:</b> $boost
						</StylingTooltip>
						Add a task
					</span>
				</div>
				<div class="inline-flex justify-between">
					<span
						class="tooltip tooltip-bottom tooltip-info font-black"
						style={{
							color: selectedTheme().palette.foreground.base.color,
						}}
					>
						<StylingTooltip>
							<b>text:</b> $foreground
						</StylingTooltip>
						History
					</span>
					<span
						class="tooltip tooltip-bottom tooltip-info px-3.5"
						style={{
							color: selectedTheme().palette.primary.base.text,
							"background-color": selectedTheme().palette.primary.base.muted,
						}}
					>
						<StylingTooltip>
							<b>background:</b> $primary-muted
							<br />
							<b>text:</b> $text-primary
						</StylingTooltip>
						4 items
					</span>
				</div>
			</main>
		</div>
	);
};

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
				class="flex h-13 w-full items-center justify-between gap-8 text-nowrap py-2 pr-8 pl-16 text-center text-sm xl:h-16"
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
			class="mb-3 h-fit max-h-5/6 w-5/6 overflow-y-auto border-2 px-10 xl:pb-10"
			style={{
				"background-color": selectedTheme().palette.surface.base.color,
				"border-color": selectedTheme().palette.primary.base.color,
			}}
			{...props}
		>
			<h2
				class="mt-2 mb-4 font-bold"
				style={{
					color: selectedTheme().palette.surface.base.text,
				}}
			>
				"{props.paletteKey}"
			</h2>
			<main class="flex w-full flex-col max-xl:mb-12">
				<For each={sortedDarkPaletteColors()}>
					{([variant, data]) => <ColorPreview data={data} variant={variant} />}
				</For>
				<For each={sortedNonDarkPaletteColors()}>
					{([variant, data]) => <ColorPreview data={data} variant={variant} />}
				</For>
			</main>
		</div>
	);
};

const TextColorsPreview: Component<
	JSX.HTMLAttributes<HTMLElement> & { showMutedBackgrounds: boolean }
> = (props) => {
	const { selectedTheme } = useTheme();
	const paletteColors = createMemo(() => Object.keys(selectedTheme().palette));

	return (
		<main
			class="flex size-full flex-col items-start justify-start pt-2 pl-2 text-xl xl:text-3xl"
			style={{
				"background-color": selectedTheme().palette.background.base.color,
			}}
			{...props}
		>
			<For each={paletteColors()}>
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
		</main>
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
		<div class="flex h-fit min-w-3/5 flex-col items-center gap-2 overflow-clip">
			<TerminalWindow>
				<Switch>
					<Match when={currentPreview() === "Todos App"}>
						<TodosPreview />
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
					<CommandPaletteFooter />
				</Show>
			</TerminalWindow>
			<div class="mt-1 flex w-full justify-between font-light text-sm">
				<div class="flex flex-col items-start gap-2">
					<Select
						class="w-full"
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
							<Icon icon="mdi:chevron-up-down" />
						</Select.Trigger>
						<Select.Portal>
							<Select.Content class="motion-duration-200 motion-opacity-in motion-scale-in-95 data-[closed]:motion-opacity-out data-[closed]:motion-scale-out-95">
								<Select.Listbox class="menu menu-vertical space-y-0.75 rounded border border-base-300 bg-base-200 shadow **:cursor-default **:rounded" />
							</Select.Content>
						</Select.Portal>
					</Select>
					<Show when={currentPreview() === "Colors"}>
						<Select
							class="flex w-full items-center justify-between"
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
								<Icon icon="mdi:chevron-up-down" />
							</Select.Trigger>
							<Select.Portal>
								<Select.Content class="motion-duration-200 motion-opacity-in motion-scale-in-95 data-[closed]:motion-opacity-out data-[closed]:motion-scale-out-95">
									<Select.Listbox class="menu menu-vertical space-y-0.75 rounded border border-base-300 bg-base-200 shadow **:cursor-default **:rounded" />
								</Select.Content>
							</Select.Portal>
						</Select>
					</Show>
				</div>
				<div class="flex flex-col gap-2">
					<label class="flex items-center justify-between gap-2">
						<span class="label select-none">Show command palette? </span>
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
						<label class="flex items-center justify-between gap-2">
							<span class="label select-none">Show muted backgrounds? </span>
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
