import { For, type JSX } from "solid-js";
import { useTheme } from "~/features/themes/context/theme";

export default function TextColorsPreview(
	props: JSX.HTMLAttributes<HTMLDivElement> & { showMutedBackgrounds: boolean },
) {
	const { selectedTheme } = useTheme();
	const paletteColors = [
		"primary",
		"secondary",
		"accent",
		"warning",
		"error",
		"success",
	];

	return (
		<div
			class="flex size-full flex-col items-start justify-start pt-2 pl-2 text-3xl"
			style={{
				"background-color": selectedTheme().palette.background.base.color,
			}}
			{...props}
		>
			<For each={paletteColors}>
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
		</div>
	);
}
