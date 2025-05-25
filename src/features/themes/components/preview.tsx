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
		class="flex size-full flex-col rounded border border-primary bg-neutral shadow-md xl:size-2/3"
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
	return (
		<div class="absolute bottom-0 left-0 flex h-1/12 w-full items-center justify-end"></div>
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
	const [showCommandPalette, setCommandPaletteVisibility] = createSignal(false);
	const SelectPreview: Component<JSX.HTMLAttributes<HTMLDivElement>> = (
		props,
	) => <div {...props}>s</div>;

	return (
		<div class="flex flex-col items-center gap-1">
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
				<div class="flex items-center gap-1">
					<p>Current Preview: </p>
					<Select
						value={currentPreview()}
						onChange={setPreview}
						options={previewOptions}
						placeholder="Select a preview..."
						itemComponent={(props) => (
							<Select.Item item={props.item}>
								<Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
							</Select.Item>
						)}
					>
						<Select.Trigger aria-label="Preview">
							<Select.Value<string>>
								{(state) => state.selectedOption()}
							</Select.Value>
							<Icon class="size-4" icon="mdi:chevron-down" />
						</Select.Trigger>
						<Select.Portal>
							<Select.Content>
								<Select.Listbox />
							</Select.Content>
						</Select.Portal>
					</Select>
				</div>
				<div>
					<p>Show command palette? </p>
				</div>
			</div>
		</div>
	);
};

export default Preview;
