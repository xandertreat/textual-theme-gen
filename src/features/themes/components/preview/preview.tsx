import { Select } from "@kobalte/core/select";
import {
	For,
	Match,
	Show,
	Switch,
	createEffect,
	createSignal,
	onMount,
} from "solid-js";
import { DEFAULTS } from "~/features/themes/context/theme";
import CommandPalette from "./command-palette";
import TerminalWindow from "./terminal";
import Todos from "./windows/todos";
import PaletteColorPreview from "./windows/colors";
import TextColorsPreview from "./windows/text";

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
		<div class="flex flex-col flex-nowrap items-center gap-2 overflow-clip">
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
							<IconMdiChevronUpDown class="size-4" />
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
								<IconMdiChevronUpDown class="size-4" />
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
