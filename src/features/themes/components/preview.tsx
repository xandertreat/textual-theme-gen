import {
	createSignal,
	For,
	Match,
	Show,
	Switch,
	type Component,
	type JSX,
} from "solid-js";
import { Select } from "@kobalte/core/select";
import Icon from "../../../components/ui/icon";
import { DEFAULTS, useTheme } from "../context/theme";

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

const CommandPaletteFooter: Component<JSX.HTMLAttributes<HTMLDivElement>> = (
	props,
) => {
	const { selectedTheme } = useTheme();

	return (
		<footer
			class="absolute bottom-0 left-0 m-0 inline-flex h-4 w-full items-center justify-end gap-2 rounded-br rounded-bl bg-size-[90%] text-center"
			style={{ "background-color": selectedTheme().palette.panel.base.color }}
		>
			<div
				class="h-full w-px text-transparent opacity-30"
				style={{
					"background-color": selectedTheme().palette.panel.base.disabled,
				}}
			>
				|
			</div>
			<span class="inline-flex gap-2">
				<kbd
					class="font-black"
					style={{
						color: selectedTheme().palette.accent.base.color,
					}}
				>
					^p
				</kbd>
				<p>palette</p>
				<p aria-hidden={"true"} class="-ml-3 text-transparent text-xl">
					|
				</p>
			</span>
		</footer>
	);
};

const TodosPreview: Component<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
	return <div class="size-full">d</div>;
};

const PaletteColorPreview: Component<
	JSX.HTMLAttributes<HTMLDivElement> & { paletteKey: string }
> = (props) => {
	return <div class="size-9/10">d</div>;
};

const paletteKeys = Object.keys(DEFAULTS[0].palette).map(
	(k) => `${k[0].toUpperCase()}${k.slice(1)}`,
);
const Preview = () => {
	const previewOptions = ["Todos App", ...paletteKeys];
	const initial = previewOptions[0];
	const [currentPreview, setPreview] = createSignal(initial);
	const [showCommandPalette, setCommandPaletteVisibility] = createSignal(true);
	const SelectPreview: Component<JSX.HTMLAttributes<HTMLDivElement>> = (
		props,
	) => <div {...props}>s</div>;

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
				<div class="flex items-center gap-2">
					<p class="cursor-default">Current Preview</p>
					<Select
						disallowEmptySelection={true}
						value={currentPreview()}
						onChange={setPreview}
						options={previewOptions}
						placeholder="Select a preview..."
						placement="bottom"
						itemComponent={(props) => (
							<Select.Item item={props.item}>
								<Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
							</Select.Item>
						)}
					>
						<Select.Trigger
							class="inline-flex w-28 cursor-pointer items-center justify-between gap-2 rounded-md border border-neutral/30 p-2 transition-colors duration-150 hover:border-neutral/50"
							aria-label="Preview"
						>
							<Select.Value<string>>
								{(state) => state.selectedOption()}
							</Select.Value>
							<Icon icon="mdi:chevron-up-down" />
						</Select.Trigger>
						<Select.Portal>
							<Select.Content class="motion-duration-200 motion-opacity-in motion-scale-in-95 data-[closed]:motion-opacity-out data-[closed]:motion-scale-out-95">
								<Select.Listbox class="menu menu-vertical space-y-0.5 rounded border border-base-300 bg-base-200 shadow **:cursor-default **:rounded" />
							</Select.Content>
						</Select.Portal>
					</Select>
				</div>
				<label class="flex items-center gap-2">
					<span class="label">Show command palette? </span>
					<input
						class="checkbox rounded-md border"
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
