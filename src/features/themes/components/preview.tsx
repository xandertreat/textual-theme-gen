import { Select } from "@kobalte/core/select";
import {
	type Component,
	For,
	type JSX,
	Match,
	Show,
	Switch,
	createMemo,
	createSignal,
} from "solid-js";
import Icon from "../../../components/ui/icon";
import { DEFAULTS, useTheme } from "../context/theme";
import type { TextualColor } from "../types";

const TerminalWindow: Component<JSX.HTMLAttributes<HTMLDivElement>> = (
	props,
) => (
	<div
		class="flex size-full flex-col rounded border border-primary bg-neutral shadow-md"
		{...props}
	>
		<div class="relative flex w-full items-center px-4 py-2">
			<div class="flex items-center gap-2">
				<div class="size-3 rounded-full bg-error" />
				<div class="size-3 rounded-full bg-warning" />
				<div class="size-3 rounded-full bg-success" />
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
	const keyBindingColor = createMemo(
		() => selectedTheme().palette.accent.base.color,
	);
	const panelColors = createMemo(() => selectedTheme().palette.panel.base);

	return (
		<footer
			class="absolute bottom-0 left-0 m-0 inline-flex h-4 w-full items-center justify-between gap-2 rounded-br rounded-bl bg-size-[90%] text-center text-sm"
			style={{ "background-color": panelColors().color }}
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
							color: panelColors().text,
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
							color: panelColors().text,
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
						"background-color": panelColors().text,
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
							color: panelColors().text,
						}}
					>
						palette
					</p>
				</span>
			</span>
		</footer>
	);
};

const TodosPreview: Component<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
	const { selectedTheme } = useTheme();

	return <div class="size-full">d</div>;
};

const PaletteColorPreview: Component<
	JSX.HTMLAttributes<HTMLDivElement> & { paletteKey: string }
> = (props) => {
	const { selectedTheme } = useTheme();
	const paletteColors = createMemo(() =>
		Object.entries(selectedTheme().palette[props.paletteKey]),
	);

	const ColorPreview: Component<
		JSX.HTMLAttributes<HTMLSpanElement> & {
			variant: string;
			data: TextualColor;
		}
	> = (passed) => (
		<span
			class="flex h-13 w-full items-center justify-between gap-8 text-nowrap py-2 pr-8 pl-16 text-center text-sm xl:h-16"
			style={{
				"background-color": passed.data.color,
			}}
		>
			<p
				class="mr-8 w-40"
				style={{
					color: passed.data.text,
				}}
			>
				${props.paletteKey}
				{passed.variant !== "base" ? `-${passed.variant}` : undefined}
			</p>
			<p
				style={{
					color: passed.data.muted,
				}}
			>
				$text-muted
			</p>
			<p
				style={{
					color: passed.data.disabled,
				}}
			>
				$text-disabled
			</p>
		</span>
	);

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
				<For
					each={paletteColors()
						.filter(([v]) => v.includes("darken"))
						.sort(([a], [b]) => Number(a.at(-1)) + Number(b.at(-1)))}
				>
					{([variant, data]) => <ColorPreview variant={variant} data={data} />}
				</For>
				<For each={paletteColors().filter(([v]) => !v.includes("darken"))}>
					{([variant, data]) => <ColorPreview variant={variant} data={data} />}
				</For>
			</main>
		</div>
	);
};

const paletteKeys = Object.keys(DEFAULTS[0].palette).map(
	(k) => `${k[0].toUpperCase()}${k.slice(1)}`,
);
const Preview = () => {
	const previewOptions = ["Todos App", ...paletteKeys];
	const initial = previewOptions[0];
	const [currentPreview, setPreview] = createSignal(initial);
	const [showCommandPalette, setCommandPaletteVisibility] = createSignal(true);
	const [selectOpen, setSelectOpen] = createSignal(false);

	return (
		<div class="flex h-fit flex-col items-center gap-2 xl:w-2/3">
			<TerminalWindow>
				<Switch>
					<Match when={currentPreview() === "Todos App"}>
						<TodosPreview />
					</Match>
					<For each={paletteKeys}>
						{(key) => (
							<Match when={currentPreview() === key}>
								<PaletteColorPreview paletteKey={key.toLowerCase()} />
							</Match>
						)}
					</For>
				</Switch>
				<Show when={showCommandPalette()}>
					<CommandPaletteFooter />
				</Show>
			</TerminalWindow>
			<div class="flex w-full items-center justify-between font-light text-sm">
				<Select
					disallowEmptySelection={true}
					open={selectOpen()}
					value={currentPreview()}
					onChange={setPreview}
					options={previewOptions}
					placeholder="Select a preview..."
					placement="bottom"
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
				>
					<Select.Label
						class="mr-2 cursor-default select-none"
						onClick={() => setSelectOpen(!selectOpen())}
					>
						Current Preview
					</Select.Label>
					<Select.Trigger
						onClick={() => setSelectOpen(!selectOpen())}
						class="inline-flex w-28 cursor-pointer items-center justify-between gap-2 rounded-md border border-base-content/30 p-2 transition-colors duration-150 hover:border-base-content/50"
						aria-label="Preview"
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
				<label class="flex items-center gap-2">
					<span class="label select-none">Show command palette? </span>
					<input
						class="checkbox rounded-md border border-base-content/30 text-green-600 transition-colors duration-150 hover:border-base-content/50"
						type="checkbox"
						checked={showCommandPalette()}
						onChange={(e) => setCommandPaletteVisibility(!showCommandPalette())}
					/>
				</label>
			</div>
		</div>
	);
};

export default Preview;
