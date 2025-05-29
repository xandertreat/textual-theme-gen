import Color from "color";
import type { ColorInstance as ColorT } from "color";
import type {
	HexColorCode,
	TextualColor,
	TextualGeneratedColor,
	TextualTheme,
} from "../types";
import { randomName } from "./utils";

// ---------------------- from Textual's 'design.py' ---------------------- //
export const NUM_SHADES = 3;
export const LUMINOSITY_SPREAD = 0.15;
export const TEXT_ALPHA = 0.95;

export const DEFAULT_DARK_BG = "#121212" as HexColorCode;
export const DEFAULT_DARK_SURFACE = "1e1e1e" as HexColorCode;
export const DEFAULT_LIGHT_BG = "#efefef";
export const DEFAULT_LIGHT_SURFACE = "#f5f5f5";

export const COLOR_NAMES = [
	"primary",
	"secondary",
	"background",
	//  TODO: see if these are needed
	// "primary-background",
	// "secondary-background",
	"surface",
	"panel",
	"boost",
	"warning",
	"error",
	"success",
	"accent",
];

function adjustLuminosity(c: ColorT, delta: number): ColorT {
	return delta >= 0 ? c.lighten(delta) : c.darken(-delta);
}

function getContrastText(c: ColorT, alpha = 0.95): ColorT {
	return c.l() < 0.5 ? Color("white").a(alpha) : Color("black").a(alpha);
}

// ---------------------- new ---------------------- //

/**
 * Generates a TextualColor object with base, text, muted, and disabled colors from a base ColorT.
 * @param base The base color instance.
 * @returns A TextualColor object.
 */
export const getTextualColor = (base: ColorT): TextualColor => {
	const textColor = Color(base.isLight() ? "#000000FF" : "#FFFFFFFF");

	return {
		color: base.hexa() as HexColorCode,
		text: textColor.hexa() as HexColorCode,
		muted: textColor.mix(base.fade(0.3)).hexa() as HexColorCode,
		disabled: textColor.mix(base.fade(0.5)).hexa() as HexColorCode,
	};
};

/**
 * Generates a TextualGeneratedColor object with various shades of a base color.
 * @param hex The base color in hex format.
 * @returns A TextualGeneratedColor object.
 */
export const getColorData = (hex: HexColorCode): TextualGeneratedColor => {
	const color = Color(hex);
	const base = getTextualColor(color);
	color.contrast;

	const data = {
		base,
	};

	for (let i = -NUM_SHADES; i < NUM_SHADES; ++i)
		if (i < 0) data[`darken-${i}`] = getTextualColor();
		else data[`lighten-${i}`] = getTextualColor();

	return data;
};

// ------------------------------------------- util ------------------------------------------- //

/**
 * Generates a random theme object.
 * @returns A random TextualTheme object.
 */
export const genRandomTheme = (): TextualTheme => {
	const randomLCH = () =>
		Color().lch(Math.random() * 100, Math.random() * 130, Math.random() * 360);
	const randomHex = () => {
		return randomLCH().hex() as HexColorCode;
	};
	const bg = randomLCH();

	return {
		name: `random-${randomName()}`,
		palette: {
			primary: getColorData(randomHex()),
			secondary: getColorData(randomHex()),
			accent: getColorData(randomHex()),
			background: getColorData(bg.hex() as HexColorCode),
			foreground: getColorData(randomHex()),
			surface: getColorData(randomHex()),
			success: getColorData(randomHex()),
			warning: getColorData(randomHex()),
			error: getColorData(randomHex()),
			panel: getColorData(randomHex()),
			boost: getColorData(randomHex()),
		},
		dark: bg.isDark(),
		variables: {},
		source: "user",
	};
};
