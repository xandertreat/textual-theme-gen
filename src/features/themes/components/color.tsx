import { ColorArea } from "@kobalte/core/color-area";
import { type Color, parseColor } from "@kobalte/core/colors";
import {
	type Component,
	type JSX,
	createEffect,
	createMemo,
	createSignal,
	splitProps,
} from "solid-js";
import ActionDialog from "~/components/ui/action-dialog";
import { useTheme } from "../context/theme";
import { getColorData } from "../lib/utils";
import type { HexColorCode } from "../types";

const ColorSwatch: Component<
	JSX.ButtonHTMLAttributes<HTMLButtonElement> & { color: string }
> = (props) => {
	const { selectedTheme } = useTheme();
	const canPick = createMemo(() => selectedTheme().source === "user");

	return (
		<span class="flex flex-col items-center gap-1">
			<ActionDialog.Trigger
				disabled={!canPick()}
				class={
					"size-12 aspect-square rounded-full shadow-md not-disabled:hover:scale-105 transition-[scale] duration-200 font-black text-2xl"
				}
				style={{
					"background-color": selectedTheme().palette[props.color].base.color,
					color: selectedTheme().palette[props.color].base.text,
					"--tw-shadow-color": selectedTheme().palette[props.color].base.color,
				}}
				{...props}
			>
				A
			</ActionDialog.Trigger>
			<p>{props.color[0].toUpperCase() + props.color.slice(1)}</p>
		</span>
	);
};

const DEBOUNCE_DELAY = 4.66; // ms (found through manual testing to be best responsive)

const ColorPicker: Component<
	JSX.HTMLAttributes<HTMLDivElement> & { color: string }
> = (props) => {
	const [local, rest] = splitProps(props, ["color"]);
	const { selectedTheme, modifySelected } = useTheme();
	const [color, setColor] = createSignal<Color>(
		parseColor(selectedTheme().palette[local.color].base.color),
	);
	let debounce = false;

	return (
		<ColorArea
			{...rest}
			class="w-full h-36 mt-5 touch-none select-none flex flex-col items-center"
			colorSpace="rgb"
			value={color()}
			onChange={(color: Color) => {
				setColor(color);
				if (!debounce) {
					debounce = true;
					setTimeout(() => {
						modifySelected({
							palette: {
								...selectedTheme().palette,
								[local.color]: getColorData(color.toString() as HexColorCode),
							},
						});
						debounce = false;
					}, DEBOUNCE_DELAY);
				}
			}}
		>
			<ColorArea.Background class="size-full rounded-md relative">
				<ColorArea.Thumb
					class="rounded-full border-2 border-solid size-4"
					style={{
						"background-color": "var(--kb-color-current)",
						"border-color":
							"color-mix(in srgb, var(--kb-color-current) 20%, var(--color-zinc-50))",
					}}
				>
					<ColorArea.HiddenInputX />
					<ColorArea.HiddenInputY />
				</ColorArea.Thumb>
			</ColorArea.Background>
		</ColorArea>
	);
};

const EditColor: Component<
	JSX.HTMLAttributes<HTMLDivElement> & { color: string }
> = (props) => {
	const [local, rest] = splitProps(props, ["color"]);

	return (
		<ActionDialog>
			<ColorSwatch color={local.color} />
			<ActionDialog.Portal>
				<ActionDialog.Overlay />
				<ActionDialog.Content
					class="flex flex-col items-center text-center bg-primary text-primary-content border-0 "
					{...rest}
				>
					<ActionDialog.Close />
					<ColorPicker color={local.color} />
				</ActionDialog.Content>
			</ActionDialog.Portal>
		</ActionDialog>
	);
};

export default EditColor;
