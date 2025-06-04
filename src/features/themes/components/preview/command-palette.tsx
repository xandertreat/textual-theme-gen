import { type Component, type JSX, createMemo } from "solid-js";
import { useTheme } from "~/features/themes/context/theme";
import {
	calcAutoText,
	getContrastText,
	inverse,
} from "~/features/themes/lib/color";

const CommandPalette: Component<JSX.HTMLAttributes<HTMLElement>> = (props) => {
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
			<div class="invisible inline-flex gap-4 pt-1.5 md:visible">
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

export default CommandPalette;
