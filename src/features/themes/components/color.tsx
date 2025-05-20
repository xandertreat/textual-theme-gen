import Dialog from "@corvu/dialog";
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

	return (
		<span class="flex flex-col items-center gap-1">
			<ActionDialog.Trigger
				disabled={selectedTheme().source !== "user"}
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

const ColorPicker: Component<
	JSX.HTMLAttributes<HTMLDivElement> & { color: string }
> = (props) => {
	const [local, rest] = splitProps(props, ["color"]);
	const { selectedTheme } = useTheme();
	const [color, setColor] = createSignal<Color>(
		parseColor(selectedTheme().palette[local.color].base.color),
	);
	createEffect(() => {
		selectedTheme().palette[local.color] = getColorData(
			color().toString() as HexColorCode,
		);
	});

	return (
		<ColorArea
			class="w-full h-36 mt-5 touch-none select-none flex flex-col items-center "
			colorSpace="rgb"
			value={color()}
			onChange={setColor}
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
