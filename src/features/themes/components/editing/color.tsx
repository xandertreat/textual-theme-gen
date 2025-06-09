import { ColorArea } from "@kobalte/core/color-area";
import { ColorField } from "@kobalte/core/color-field";
import { ColorSlider } from "@kobalte/core/color-slider";
import {
	type ColorChannel,
	type Color as ColorT,
	parseColor,
} from "@kobalte/core/colors";
import Icon from "@xtreat/solid-iconify";
import {
	type Accessor,
	type Component,
	type JSX,
	Show,
	createContext,
	createEffect,
	createMemo,
	createSignal,
	splitProps,
	useContext,
} from "solid-js";
import ActionDialog from "~/components/ui/action-dialog";
import CopyButton from "~/components/ui/copy";
import { useTheme } from "~/features/themes/context/theme";
import {
	TEXT_ALPHA,
	generateColorData,
	getContrastText,
} from "~/features/themes/lib/color";
import type { HexColorCode } from "~/features/themes/types";
import debounce from "~/lib/debounce";

const DEBOUNCE_DELAY = 2.5; // ms (found through manual testing to be best responsive / performance tradeoff)

type ColorContextType = {
	color: Accessor<ColorT>;
	setColor: (val: ColorT) => void;
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

interface ColorContextProviderProps {
	paletteKey: string;
	children: JSX.Element;
}
const ColorContextProvider: Component<ColorContextProviderProps> = (props) => {
	const { selectedTheme, modifySelected } = useTheme();
	const bg = createMemo(() => selectedTheme().palette.background.base.color);

	const INITIAL = parseColor(
		selectedTheme().palette[props.paletteKey].base.color,
	).toFormat("hexa");
	const [color, internalSetColor] = createSignal<ColorT>(INITIAL);

	const hexCode = createMemo(() => color().toString("hexa") as HexColorCode);

	const modifyDebounce = debounce(
		() =>
			modifySelected({
				palette: {
					...selectedTheme().palette,
					[props.paletteKey]: generateColorData(hexCode(), bg()),
				},
			}),
		DEBOUNCE_DELAY,
	);

	const setColor = (val: ColorT) => {
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
		<colorContext.Provider value={{ color, setColor, hexCode }}>
			{props.children}
		</colorContext.Provider>
	);
};

const ColorSwatch: Component<
	JSX.ButtonHTMLAttributes<HTMLButtonElement> & { paletteKey: string }
> = (props) => {
	const { selectedTheme } = useTheme();

	const textColor = createMemo(() =>
		getContrastText(selectedTheme().palette[props.paletteKey].base.color)
			.alpha(TEXT_ALPHA)
			.hexa(),
	);
	const baseColor = createMemo(() => {
		const hex = selectedTheme().palette[props.paletteKey].base.color;
		if (hex.length > 6) return hex.slice(0, -2);
		return hex;
	});

	const disabled = createMemo(() => !(selectedTheme().source === "user"));

	return (
		<span class="m-1 flex flex-col items-center gap-1">
			<ActionDialog.Trigger
				class={
					"aspect-square size-12 rounded-full font-black text-2xl shadow-md/50 transition-[scale] duration-200 not-disabled:hover:scale-105"
				}
				classList={{ "pointer-events-none": disabled() }}
				disabled={disabled()}
				style={{
					color: textColor(),
					"background-color": baseColor(),
					"--tw-shadow-color": baseColor(),
				}}
				{...props}
			>
				A
			</ActionDialog.Trigger>
			<p class="hd:text-xs! qhd:text-base! text-xs md:text-base!">
				{props.paletteKey[0].toUpperCase() + props.paletteKey.slice(1)}
			</p>
		</span>
	);
};

const HexCodeField: Component<JSX.HTMLAttributes<HTMLDivElement>> = ({
	onChange,
	...rest
}) => {
	const { setColor, hexCode } = useColorContext();
	const [isEditingHex, setEditingHex] = createSignal(false);
	const [inputVal, setInputVal] = createSignal(
		hexCode().length > 6 ? hexCode().slice(0, -2) : hexCode(),
	);

	const currentCode = createMemo(() =>
		isEditingHex() ? inputVal() : hexCode(),
	);
	createEffect(() =>
		setInputVal(hexCode().length > 6 ? hexCode().slice(0, -2) : hexCode()),
	);

	let inputEl!: HTMLInputElement;

	return (
		<ColorField {...rest} readOnly={!isEditingHex()} required={true}>
			<ColorField.Label class="input validator group text-primary">
				<span class="label pointer-events-none select-none" tabIndex={-1}>
					Hex Code
				</span>
				<ColorField.Input
					class="pointer-events-none select-none"
					id="colorInput"
					onChange={(e) => {
						const inputEl = e.target as HTMLInputElement;
						const val = inputEl.value
							.replace(/#/g, "")
							.trim()
							.normalize()
							.slice(0, 6);
						setInputVal(`${val.length === 0 ? "" : "#"}${val}`);
					}}
					onKeyPress={(e) => {
						if (isEditingHex() && e.key === "Enter") {
							inputEl.blur();
							inputEl.closest("div")?.querySelector("button")?.click();
						}
					}}
					ref={(el) => {
						inputEl = el;
						setTimeout(() => el.focus(), 100);
					}}
					value={currentCode()}
				/>
				<div class=" -translate-y-1/2 absolute top-1/2 right-2 flex h-6 w-fit justify-between gap-2">
					<button
						aria-label={isEditingHex() ? "Done" : "Edit"}
						class="tooltip tooltip-bottom btn btn-circle btn-ghost btn-xs aspect-square h-full"
						data-tip={isEditingHex() ? "Done" : "Edit"}
						onClick={() => {
							const editing = isEditingHex();
							if (editing)
								try {
									const color = parseColor(inputVal());
									if (color) setColor(color);
									document?.documentElement.style.removeProperty("cursor");
								} catch {
									setInputVal(hexCode());
								}
							setEditingHex(!editing);
							inputEl.focus();
						}}
						type="button"
					>
						<Show
							fallback={
								<Icon class="size-full" icon={"mdi:pencil-circle-outline"} />
							}
							when={isEditingHex()}
						>
							<Icon
								class="size-full text-green-600"
								icon={"mdi:pencil-circle"}
							/>
						</Show>
					</button>
					<CopyButton
						class="tooltip tooltip-bottom tooltip-info size-full transition duration-200 ease-in-out hover:cursor-pointer"
						code={`#${currentCode()
							.replace(/#/g, "")
							.trim()
							.normalize()
							.slice(0, 6)}`}
						copyIcon="mdi:content-copy"
					/>
				</div>
			</ColorField.Label>
			<ColorField.ErrorMessage />
		</ColorField>
	);
};

// TODO: re-implement hex input field myself so it can use HEXA and not require such bloat
const ColorSelection: Component<JSX.HTMLAttributes<HTMLDivElement>> = (
	props,
) => {
	const { color, setColor } = useColorContext();

	return (
		<div {...props}>
			<ColorArea
				class=" flex h-36 w-64 flex-col items-center"
				colorSpace="rgb"
				onChange={(val) => {
					setColor(val);
					document.addEventListener(
						"pointerup",
						() => {
							for (const inputEl of document.querySelectorAll<HTMLInputElement>(
								"#hexCodeField",
							))
								if (inputEl.style.getPropertyValue("display") !== "hidden")
									inputEl.focus();
						},
						{
							once: true,
						},
					);
				}}
				value={color()}
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
		</div>
	);
};

const ColorFields: Component<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
	const { color, setColor } = useColorContext();

	const Slider: Component<{ channel: ColorChannel }> = (props) => (
		<ColorSlider
			channel={props.channel}
			class="relative flex h-50 w-6 touch-none select-none flex-col items-center"
			onChange={(val) => {
				setColor(val);
				document.addEventListener(
					"pointerup",
					() =>
						document.querySelector<HTMLInputElement>("#colorInput")!.focus(),
					{
						once: true,
					},
				);
			}}
			orientation={"vertical"}
			value={color()}
		>
			<div class="ColorSliderLabel">
				<ColorSlider.Label>
					{props.channel[0].toLocaleUpperCase() + props.channel.slice(1)}
				</ColorSlider.Label>
			</div>
			<ColorSlider.Track class="relative my-2 size-full rounded border-2 border-zinc-50">
				<ColorSlider.Thumb
					class="-translate-x-1/2 absolute left-1/2 z-10 size-6 cursor-grab rounded-full border-2 border-zinc-50 border-solid shadow md:size-4"
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
		<div class="flex w-full items-center justify-center gap-10 md:justify-between md:gap-2">
			<Slider channel="red" />
			<Slider channel="green" />
			<Slider channel="blue" />
			<Slider channel="alpha" />
		</div>
	);
};

const EditColor: Component<
	JSX.HTMLAttributes<HTMLDivElement> & { color: string }
> = (props) => {
	const [local, rest] = splitProps(props, ["color"]);

	return (
		<ActionDialog>
			<ColorSwatch paletteKey={local.color} />
			<ActionDialog.Portal>
				<ActionDialog.Overlay />
				<ActionDialog.Content
					class="flex w-1/2 items-center gap-3 border-0 text-center max-md:flex-col max-md:rounded-none md:size-max md:pt-8 [&>button]:text-error"
					{...rest}
				>
					<ActionDialog.Close class="btn btn-circle btn-ghost btn-xs absolute top-2 left-2" />
					<ColorContextProvider paletteKey={local.color}>
						<div class=" hidden flex-col gap-3 md:flex">
							<ColorSelection class="flex w-max flex-col items-center gap-2" />
							<HexCodeField class="size-full" />
						</div>
						<ColorFields />
						<ColorSelection class="flex w-max flex-col items-center gap-2 md:hidden" />
						<HexCodeField class="block size-full md:hidden" />
					</ColorContextProvider>
				</ActionDialog.Content>
			</ActionDialog.Portal>
		</ActionDialog>
	);
};

export default EditColor;
// TODO: use cn everywhere in codebase
