import type { Component, JSX } from "solid-js";
import { useTheme } from "~/features/themes/context/theme";

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

export default TerminalWindow;
