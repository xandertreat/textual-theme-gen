import { type Component, For, type JSX, createMemo } from "solid-js";
import { useTheme } from "~/features/themes/context/theme";
import {
	DISABLED_ALPHA,
	MUTED_ALPHA,
	TEXT_ALPHA,
	calcAutoText,
} from "~/features/themes/lib/color";
import type { TextualColor } from "~/features/themes/types";

export default function PaletteColorPreview(
	props: JSX.HTMLAttributes<HTMLDivElement> & { paletteKey: string },
) {
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
}
