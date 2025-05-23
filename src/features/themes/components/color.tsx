import { ColorArea } from "@kobalte/core/color-area";
import { type Color, parseColor } from "@kobalte/core/colors";
import {
	type Accessor,
	type Component,
	type JSX,
	type Setter,
	createContext,
	createEffect,
	createMemo,
	createSignal,
	splitProps,
	useContext,
} from "solid-js";
import ActionDialog from "~/components/ui/action-dialog";
import { useTheme } from "../context/theme";
import { getColorData } from "../lib/utils";
import type { HexColorCode } from "../types";

const DEBOUNCE_DELAY = 4.66; // ms (found through manual testing to be best responsive / performance tradeoff)

type ColorContextType = {
	paletteKey: string;
	color: Accessor<Color>;
	setColor: Setter<Color>;
};
const colorContext = createContext<ColorContextType>();
const useColorContext = () => {
	const context = useContext(colorContext);
	if (!context) {
		throw new Error("useColorContext must be used within a ColorProvider");
	}
	return context;
};

interface ColorContextProviderProps
	extends Pick<ColorContextType, "paletteKey"> {
	children: JSX.Element;
}
const ColorContextProvider: Component<ColorContextProviderProps> = (props) => {
	const { selectedTheme, modifySelected } = useTheme();
	const [color, setColor] = createSignal<Color>(
		parseColor(selectedTheme().palette[props.paletteKey].base.color),
	);
	const hex = createMemo(
		() => color().toFormat("hexa").toString() as HexColorCode,
	);
	const palette = createMemo(() => selectedTheme().palette);

	let debounce = false;
	createEffect(() => {
		if (!debounce) {
			debounce = true;
			setTimeout(() => {
				modifySelected({
					palette: {
						...palette(),
						[props.paletteKey]: getColorData(hex() as HexColorCode),
					},
				});
				debounce = false;
			}, DEBOUNCE_DELAY);
		}
	});

	return (
		<colorContext.Provider
			value={{ paletteKey: props.paletteKey, color, setColor }}
		>
			{props.children}
		</colorContext.Provider>
	);
};

const EditColor: Component<
	JSX.HTMLAttributes<HTMLDivElement> & { color: string }
> = (props) => {
	const [local, rest] = splitProps(props, ["color"]);

	return (
		<ActionDialog>
			<ColorContextProvider paletteKey={local.color}>
				<ColorSwatch />
				<ActionDialog.Portal>
					<ActionDialog.Overlay />
					<ActionDialog.Content
						class="flex flex-col items-center border-0 bg-zinc-200 text-center text-neutral shadow-none [&>button]:text-error"
						{...rest}
					>
						<ActionDialog.Close />
						<ColorSelection />
					</ActionDialog.Content>
				</ActionDialog.Portal>
			</ColorContextProvider>
		</ActionDialog>
	);
};

const ColorSwatch: Component<JSX.ButtonHTMLAttributes<HTMLButtonElement>> = (
	props,
) => {
	const { paletteKey } = useColorContext();
	const { selectedTheme } = useTheme();
	const canPick = createMemo(() => selectedTheme().source === "user");
	const colorData = createMemo(() => selectedTheme().palette[paletteKey].base);

	return (
		<span class="flex flex-col items-center gap-1">
			<ActionDialog.Trigger
				disabled={!canPick()}
				class={
					"aspect-square size-12 rounded-full font-black text-2xl shadow-md/50 transition-[scale] duration-200 not-disabled:hover:scale-105"
				}
				style={{
					color: colorData().text,
					"background-color": colorData().color,
					"--tw-shadow-color": colorData().color,
				}}
				{...props}
			>
				A
			</ActionDialog.Trigger>
			<p>{paletteKey[0].toUpperCase() + paletteKey.slice(1)}</p>
		</span>
	);
};

const ColorSelection: Component<JSX.HTMLAttributes<HTMLDivElement>> = (
	props,
) => {
	const { color, setColor, paletteKey } = useColorContext();

	return (
		<div class="flex w-full flex-col items-center gap-2">
			<ColorArea
				{...props}
				class="mt-5 flex h-36 w-full touch-none select-none flex-col items-center"
				colorSpace="rgb"
				value={color()}
				onChange={setColor}
			>
				<ColorArea.Background class="relative size-full rounded-md">
					<ColorArea.Thumb
						class="size-4 rounded-full border-2 border-solid"
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
		</div>
	);
};

export default EditColor;
