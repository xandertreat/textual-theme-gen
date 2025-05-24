import {
	createSignal,
	For,
	Match,
	Show,
	Switch,
	type Component,
	type JSX,
} from "solid-js";
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
	const [currentPreview, setPreview] = createSignal(previewOptions[0]);
	const [showCommandPalette, setCommandPaletteVisibility] = createSignal(false);
	const SelectPreview: Component<JSX.HTMLAttributes<HTMLDivElement>> = (
		props,
	) => <div {...props}>s</div>;

	return (
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
	);
};

export default Preview;
