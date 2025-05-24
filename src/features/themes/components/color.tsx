import { ColorArea } from "@kobalte/core/color-area";
import { ColorField } from "@kobalte/core/color-field";
import { ColorSlider } from "@kobalte/core/color-slider";
import {
	type Color,
	type ColorChannel,
	parseColor,
} from "@kobalte/core/colors";
import {
	type Accessor,
	type Component,
	type JSX,
	type Setter,
	Show,
	createContext,
	createEffect,
	createMemo,
	createSignal,
	onMount,
	splitProps,
	useContext,
} from "solid-js";
import ActionDialog from "~/components/ui/action-dialog";
import CopyButton from "~/components/ui/copy";
import Icon from "~/components/ui/icon";
import debounce from "~/lib/debounce";
import { useTheme } from "../context/theme";
import { getColorData } from "../lib/utils";
import type { HexColorCode } from "../types";

const DEBOUNCE_DELAY = 2.5; // ms (found through manual testing to be best responsive / performance tradeoff)

type ColorContextType = {
	paletteKey: string;
	color: Accessor<Color>;
	setColor: (val: Color) => void;
	hexCode: Accessor<HexColorCode>;
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
	const INITIAL = parseColor(
		selectedTheme().palette[props.paletteKey].base.color,
	).toFormat("hexa");
	const [color, internalSetColor] = createSignal<Color>(INITIAL);

	const hexCode = createMemo(() => color().toString("hexa") as HexColorCode);

	const modifyDebounce = debounce(
		() =>
			modifySelected({
				palette: {
					...selectedTheme().palette,
					[props.paletteKey]: getColorData(hexCode()),
				},
			}),
		DEBOUNCE_DELAY,
	);

	const setColor = (val: Color) => {
		internalSetColor(val);
		modifyDebounce.refresh();
		const styleSheet = document?.documentElement.style;
		if (!styleSheet.getPropertyValue("cursor")) {
			styleSheet.setProperty("cursor", "grabbing", "important");
			document.addEventListener(
				"pointerup",
				() => document?.documentElement.style.removeProperty("cursor"),
				{ once: true },
			);
		}
	};

	return (
		<colorContext.Provider
			value={{ paletteKey: props.paletteKey, color, setColor, hexCode }}
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
						class="flex size-max items-center gap-3 border-0 bg-zinc-200 pt-8 text-center text-neutral [&>button]:text-error"
						{...rest}
					>
						<ActionDialog.Close />
						<ColorSelection />
						<ColorFields />
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
	const colorData = createMemo(() => selectedTheme().palette[paletteKey].base);
	const disabled = createMemo(() => !(selectedTheme().source === "user"));

	return (
		<span class="flex flex-col items-center gap-1">
			<ActionDialog.Trigger
				disabled={disabled()}
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

// TODO: re-implement hex input field myself so it can use HEXA and not require such bloat
const ColorSelection: Component<JSX.HTMLAttributes<HTMLDivElement>> = (
	props,
) => {
	const { color, setColor, hexCode } = useColorContext();
	const [inputVal, setInputVal] = createSignal(
		hexCode().length > 6 ? hexCode().slice(0, -2) : hexCode(),
	);
	createEffect(() =>
		setInputVal(hexCode().length > 6 ? hexCode().slice(0, -2) : hexCode()),
	);
	const [isEditingHex, setEditingHex] = createSignal(false);

	return (
		<div class="flex w-max flex-col items-center gap-2">
			<ColorArea
				{...props}
				class=" flex h-36 w-64 flex-col items-center"
				colorSpace="rgb"
				value={color()}
				onChange={setColor}
			>
				<ColorArea.Label class="select-none pb-0.5">Color</ColorArea.Label>
				<ColorArea.Background class="relative size-full rounded-xl border-2 border-zinc-50">
					<ColorArea.Thumb
						class="relative size-4 cursor-grab rounded-full border-2 border-zinc-50 border-solid shadow"
						style={{
							background:
								"linear-gradient(var(--kb-color-current), var(--kb-color-current)) border-box, linear-gradient(black, white)",
							"--tw-shadow-color":
								"color-mix(in srgb, var(--kb-color-current) 20%, var(--color-zinc-50))",
						}}
					>
						<ColorArea.HiddenInputX />
						<ColorArea.HiddenInputY />
					</ColorArea.Thumb>
				</ColorArea.Background>
			</ColorArea>
			<Show
				when={!isEditingHex()}
				fallback={
					<ColorField
						class="size-full"
						value={inputVal()}
						onChange={(val) => setInputVal(`#${val.replace(/#/g, "")}`)}
						required={true}
					>
						<ColorField.Label class="input validator group text-primary">
							<span class="label pointer-events-none select-none" tabIndex={-1}>
								Hex Code
							</span>
							<ColorField.Input
								ref={(el) => setTimeout(() => el.focus(), 100)}
								onKeyPress={(e) => {
									if (e.key === "Enter") {
										const inputBox = e.target as HTMLInputElement;
										inputBox.blur();
										inputBox.closest("div")?.querySelector("button")?.click();
									}
								}}
								class="pointer-events-none select-none"
							/>
							<div class=" -translate-y-1/2 absolute top-1/2 right-2 flex h-6 w-fit justify-between gap-2">
								<button
									type="button"
									class="tooltip tooltip-bottom btn btn-circle btn-ghost btn-xs aspect-square h-full text-green-600"
									data-tip="Done"
									onClick={() => {
										setEditingHex(false);
										try {
											const color = parseColor(inputVal());
											if (color) setColor(color);
											document?.documentElement.style.removeProperty("cursor");
										} catch {
											setInputVal(hexCode());
										}
									}}
								>
									<Icon class="size-full" icon="mdi:pencil-circle" />
								</button>
								<CopyButton
									class="tooltip tooltip-bottom tooltip-info size-full transition duration-200 ease-in-out hover:cursor-pointer"
									copyIcon="mdi:content-copy"
									code={inputVal()}
								/>
							</div>
						</ColorField.Label>
						<ColorField.ErrorMessage />
					</ColorField>
				}
			>
				<ColorField class="size-full" value={hexCode()} readOnly={true}>
					<ColorField.Label class="input validator group text-primary">
						<span class="label pointer-events-none select-none" tabIndex={-1}>
							Hex Code
						</span>
						<ColorField.Input class="pointer-events-none select-none" />
						{/* TODO: fix copy morphing on gsap */}
						<div class=" -translate-y-1/2 absolute top-1/2 right-2 flex h-6 w-fit justify-between gap-2">
							<button
								type="button"
								class="btn btn-circle btn-ghost btn-xs tooltip tooltip-bottom aspect-square h-full opacity-10 group-hover:opacity-100"
								data-tip="Edit"
								onClick={() => setEditingHex(true)}
							>
								<Icon class="size-full" icon="mdi:pencil-circle-outline" />
							</button>
							<CopyButton
								class="tooltip tooltip-bottom tooltip-info size-full transition duration-200 ease-in-out hover:cursor-pointer"
								copyIcon="mdi:content-copy"
								code={hexCode()}
							/>
						</div>
					</ColorField.Label>
					<ColorField.ErrorMessage />
				</ColorField>
			</Show>
		</div>
	);
};

const ColorFields: Component<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
	const { color, setColor } = useColorContext();

	const Slider: Component<{ channel: ColorChannel }> = (props) => (
		<ColorSlider
			class="relative flex h-50 touch-none select-none flex-col items-center"
			value={color()}
			onChange={setColor}
			channel={props.channel}
			orientation="vertical"
		>
			<div class="ColorSliderLabel">
				<ColorSlider.Label>
					{props.channel[0].toLocaleUpperCase() + props.channel.slice(1)}
				</ColorSlider.Label>
			</div>
			<ColorSlider.Track class="relative my-2 h-full w-6 rounded border-2 border-zinc-50">
				<ColorSlider.Thumb
					class="-translate-x-1/2 left-1/2 z-10 size-4 cursor-grab rounded-full border-2 border-zinc-50 border-solid shadow"
					style={{
						background:
							"linear-gradient(var(--kb-color-current), var(--kb-color-current)) border-box, linear-gradient(black, white)",
						"--tw-shadow-color":
							"color-mix(in srgb, var(--kb-color-current) 20%, var(--color-zinc-50))",
					}}
				>
					<ColorSlider.Input />
				</ColorSlider.Thumb>
			</ColorSlider.Track>
			<ColorSlider.ValueLabel class="pt-2 text-xs opacity-50" />
		</ColorSlider>
	);

	return (
		<div class="flex w-full items-center justify-between gap-2">
			<Slider channel="red" />
			<Slider channel="green" />
			<Slider channel="blue" />
			<Slider channel="alpha" />
		</div>
	);
};

export default EditColor;
// TODO: use cn everywhere in codebase
