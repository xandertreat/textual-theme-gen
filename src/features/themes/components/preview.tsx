import type { Component, JSX } from "solid-js";
import Icon from "../../../components/ui/icon";

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
		<div class="row-span-12 h-96 w-full rounded-br rounded-bl bg-primary/5 font-mono text-neutral-content xl:h-170">
			{props.children}
		</div>
	</div>
);

const Preview = () => {
	return <TerminalWindow>Text here.</TerminalWindow>;
};

export default Preview;
