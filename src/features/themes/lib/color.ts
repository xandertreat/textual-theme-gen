import Color from "color";
import type { ColorInstance as ColorT } from "color";
import type {
	HexColorCode,
	TextualColor,
	TextualGeneratedColor,
	TextualTheme,
} from "../types";
import { randomName } from "./utils";

// CONSTANTS / DEFAULTS //
export const NUM_SHADES = 3;
export const LUMINOSITY_SPREAD = 0.15;
export const TEXT_ALPHA = 0.95;

export const DEFAULT_DARK_BG = "#121212" as HexColorCode;
export const DEFAULT_DARK_SURFACE = "1e1e1e" as HexColorCode;
export const DEFAULT_LIGHT_BG = "#efefef";
export const DEFAULT_LIGHT_SURFACE = "#f5f5f5";

// HELPERS //
export function adjustLuminosity(c: ColorT, delta: number): ColorT {
	return delta >= 0 ? Color(c.lighten(delta)) : Color(c.darken(-delta));
}

export function getContrastText(c: ColorT, alpha = 0.95): ColorT {
	return c.l() < 0.5 ? Color("white").a(alpha) : Color("black").a(alpha);
}

export function blend(
	c1: ColorT,
	c2: ColorT,
	factor: number,
	alpha?: number,
): ColorT {
	if (factor <= 0) return c1;
	if (factor >= 1) return c2;

	const [r1, g1, b1, a1] = [...c1.rgb().array(), c1.a()];
	const [r2, g2, b2, a2] = [...c2.rgb().array(), c2.a()];

	return Color({
		r: r1 + (r2 - r1) * factor,
		g: g1 + (g2 - g1) * factor,
		b: b1 + (b2 - b1) * factor,
		a: alpha ?? a1 + (a2 - a1) * factor,
	});
}

export function tint(c1: ColorT, c2: ColorT): ColorT {
	const [r1, g1, b1, a] = [...c1.rgb().array(), c1.a()];
	const [r2, g2, b2, a2] = [...c2.rgb().array(), c2.a()];

	return Color({
		r: r1 + (r2 - r1) * a2,
		g: g1 + (g2 - g1) * a2,
		b: b1 + (b2 - b1) * a2,
		a,
	});
}

// UTILITY //

// MAIN //
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
		getTextualColor(adjustLuminosity(color, LUMINOSITY_SPREAD * i));

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

// some stuff taken from Textual's 'design.py'
// https://github.com/Textualize/textual/blob/main/src/textual/color.py#L624
