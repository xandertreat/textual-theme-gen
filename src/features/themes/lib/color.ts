import Color from "color";
import type { ColorLike, ColorInstance as ColorT } from "color";
import type {
	HexColorCode,
	TextualColor,
	TextualColorShade,
	TextualGeneratedColor,
	TextualTheme,
} from "../types";
import { randomName } from "./utils";

// CONSTANTS / DEFAULTS //
export const NUM_SHADES = 3;
export const LUMINOSITY_SPREAD = 0.15;

export const DEFAULT_DARK_BG = "#121212";
export const DEFAULT_DARK_SURFACE = "#1e1e1e";
export const DEFAULT_LIGHT_BG = "#efefef";
export const DEFAULT_LIGHT_SURFACE = "#f5f5f5";

export const TEXT_ALPHA = 0.87 * 0.95;
export const MUTED_ALPHA = 0.6;
export const DISABLED_ALPHA = 0.38;

// HELPERS //
function coerceToColor(passed: ColorT | ColorLike): ColorT {
	let c: ColorT;
	if (!(passed instanceof Color)) c = Color(passed);
	else c = passed;
	return c;
}

/**
 * Darken by manipulating CIE‑L*ab **L** by a 0 - 1 ratio,
 *
 * @param c       Base colour
 * @param amount  0 → 1  (fraction of full luminance swing, NOT percent)
 * @param alpha   Optional override for result alpha
 */
export function darken(c: ColorT, amount: number, alpha?: number): ColorT {
	const [lightness, a, b] = c.lab().array(); // l 0‑100
	const l = Math.max(0, Math.min(100, lightness - amount * 100));

	const darkened = Color({
		l,
		a,
		b,
	});
	return darkened.alpha(alpha ?? c.alpha());
}

/**
 * Lighten by manipulating CIE‑L*ab **L** by a 0 - 1 ratio,
 *
 * @param c       Base colour
 * @param amount  0 → 1  (fraction of full luminance swing, NOT percent)
 * @param alpha   Optional override for result alpha
 */
export const lighten = (c: ColorT, amount: number, alpha?: number) =>
	darken(c, -amount, alpha);

export function normalize(c: ColorT): number[] {
	const [r, g, b] = c.rgb().array();
	return [r / 255, g / 255, b / 255];
}

export function inverse(c: ColorT): ColorT {
	const [r, g, b] = c.rgb().array();

	return Color({
		r: 255 - r,
		g: 255 - g,
		b: 255 - b,
		alpha: c.alpha(),
	});
}

export function blend(
	c1: ColorT,
	c2: ColorT,
	factor: number,
	alpha?: number,
): ColorT {
	if (factor <= 0) return c1;
	if (factor >= 1) return c2;

	const [r1, g1, b1, a1] = [...c1.rgb().array(), c1.alpha()];
	const [r2, g2, b2, a2] = [...c2.rgb().array(), c2.alpha()];

	return Color({
		r: r1 + (r2 - r1) * factor,
		g: g1 + (g2 - g1) * factor,
		b: b1 + (b2 - b1) * factor,
		alpha: alpha ?? a1 + (a2 - a1) * factor,
	});
}

export function tint(c1: ColorT, c2: ColorT): ColorT {
	const [r1, g1, b1, a] = [...c1.rgb().array(), c1.alpha()];
	const [r2, g2, b2, a2] = [...c2.rgb().array(), c2.alpha()];

	return Color({
		r: r1 + (r2 - r1) * a2,
		g: g1 + (g2 - g1) * a2,
		b: b1 + (b2 - b1) * a2,
		alpha: a,
	});
}

export function getContrastText(
	base: ColorT | ColorLike,
	alpha = 0.95,
): ColorT {
	const c = coerceToColor(base);
	const [r, g, b] = normalize(c);
	const brightness = (299 * r + 587 * g + 114 * b) / 1000;
	return brightness < 0.5
		? Color("white").alpha(alpha)
		: Color("black").alpha(alpha);
}

export function calcAutoText(
	base: ColorT | ColorLike,
	bg: ColorT | ColorLike,
): ColorT {
	const c1 = coerceToColor(base);
	const c2 = coerceToColor(bg);

	return getContrastText(tint(c2, c1));
}

// MAIN //
function genDarkShades(base: ColorT) {
	// TODO: implement, allow users to manage and generate, integrate etc.
	return {};
}

/**
 * Generates a TextualColor object with base, text, muted, and disabled colors from a base ColorT.
 * @param base The base color instance.
 * @returns A TextualColor object.
 */
export const getTextualColor = (
	base: ColorT,
	bg?: ColorT,
	darkVariant?: boolean,
): TextualColor => {
	const contrastText = getContrastText(bg ?? base, 1.0);
	// const dark = darkVariant ? generateDarkShades(base) : undefined

	return {
		color: base.hexa() as HexColorCode,
		//dark,
		text: tint(contrastText, base.alpha(0.66)).hexa() as HexColorCode,
		muted: bg
			? (blend(base, bg, 0.7).hexa() as HexColorCode)
			: (base.alpha(MUTED_ALPHA).hexa() as HexColorCode),
		disabled: bg
			? (blend(base, bg, 0.7).hexa() as HexColorCode)
			: (base.alpha(DISABLED_ALPHA).hexa() as HexColorCode),
	};
};

/**
 * Generates a TextualGeneratedColor object with various shades of a base color.
 * @param hex The base color in hex format.
 * @returns A TextualGeneratedColor object.
 */
export const generateColorData = (
	base: ColorT | ColorLike,
	background?: ColorT | ColorLike,
): TextualGeneratedColor => {
	const c: ColorT = base instanceof Color ? base : Color(base);
	const bg: ColorT =
		background instanceof Color ? background : Color(background);
	const baseColorData = getTextualColor(c, bg);

	const data: TextualGeneratedColor = {
		base: baseColorData,
	};

	const luminosityStep = LUMINOSITY_SPREAD / 2;

	for (let n = -NUM_SHADES; n <= NUM_SHADES; ++n) {
		if (n === 0) continue;
		const delta = n * luminosityStep;
		const shade = n < 0 ? darken(c, Math.abs(delta)) : lighten(c, delta);
		data[(n < 0 ? `darken-${-n}` : `lighten-${n}`) as TextualColorShade] =
			getTextualColor(shade, bg);
	}

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
	const dark = Math.random() > 0.5;
	let bg: ColorT;
	let surface: ColorT;
	if (dark) {
		bg = Color(DEFAULT_DARK_BG);
		surface = Color(DEFAULT_DARK_SURFACE);
	} else {
		bg = Color(DEFAULT_LIGHT_BG);
		surface = Color(DEFAULT_LIGHT_SURFACE);
	}
	const primary = randomLCH();
	const secondary = randomLCH();
	const accent = randomLCH();
	const foreground = inverse(bg);
	const success = randomLCH();
	const warning = randomLCH();
	const error = randomLCH();
	const panel = blend(surface, primary, 0.1, 1);
	const boost = panel.mix(getContrastText(bg, 0.04), 0.1);

	const palette = {
		primary: generateColorData(primary, bg),
		secondary: generateColorData(secondary, bg),
		accent: generateColorData(accent, bg),
		background: generateColorData(bg),
		foreground: generateColorData(foreground, bg),
		surface: generateColorData(surface, bg),
		success: generateColorData(success, bg),
		warning: generateColorData(warning, bg),
		error: generateColorData(error, bg),
		panel: generateColorData(panel, bg),
		boost: generateColorData(boost, bg),
	};

	const scrollbarBackground = palette.background["darken-1"].color;
	const scrollbarCornerColor = scrollbarBackground;
	const scrollbarBackgroundHover = scrollbarBackground;
	const scrollbarBackgroundActive = scrollbarBackground;

	const markdownH6Color = palette.foreground.base.muted;
	const variables = {
		/* Block‑cursor styles ----------------------------------------------------*/
		blockCursorForeground: palette.background.base.text,
		blockCursorBackground: primary.hexa(),
		blockCursorTextStyle: "bold",
		blockCursorBlurredForeground: foreground.hexa(),
		blockCursorBlurredBackground: primary.alpha(0.3).hexa(),
		blockCursorBlurredTextStyle: "none",
		blockHoverBackground: boost.alpha(0.05).hexa(),

		/* Borders & surfaces -----------------------------------------------------*/
		border: primary.hexa(),
		borderBlurred: Color(surface).darken(0.025).hexa(),
		surfaceActive: Color(surface)
			.lighten(LUMINOSITY_SPREAD / 2.5)
			.hexa(),

		/* Scrollbars -------------------------------------------------------------*/
		scrollbar: blend(
			Color(palette.background["darken-1"].color),
			primary.alpha(0.4),
			0.5,
		).hexa(),
		scrollbarHover: blend(
			Color(palette.background["darken-1"].color),
			primary.alpha(0.5),
			0.5,
		).hexa(),
		scrollbarActive: primary.hexa(),
		scrollbarBackground,
		scrollbarCornerColor,
		scrollbarBackgroundHover,
		scrollbarBackgroundActive,

		/* Links ------------------------------------------------------------------*/
		linkBackground: "initial",
		linkBackgroundHover: primary.hexa(),
		linkColor: palette.background.base.text,
		linkStyle: "underline",
		linkColorHover: palette.background.base.text,
		linkStyleHover: "bold not underline",

		/* Footer -----------------------------------------------------------------*/
		footerForeground: foreground.hexa(),
		footerBackground: panel.hexa(),
		footerKeyForeground: accent.hexa(),
		footerKeyBackground: "transparent",
		footerDescriptionForeground: foreground.hexa(),
		footerDescriptionBackground: "transparent",
		footerItemBackground: "transparent",

		/* Input / caret ----------------------------------------------------------*/
		inputCursorBackground: foreground.hexa(),
		inputCursorForeground: bg.hexa(),
		inputCursorTextStyle: "none",
		inputSelectionBackground: Color(palette.primary["lighten-1"].color)
			.alpha(0.4)
			.hexa(),

		/* Markdown headers -------------------------------------------------------*/
		markdownH1Color: primary.hexa(),
		markdownH1Background: "transparent",
		markdownH1TextStyle: "bold",

		markdownH2Color: primary.hexa(),
		markdownH2Background: "transparent",
		markdownH2TextStyle: "underline",

		markdownH3Color: primary.hexa(),
		markdownH3Background: "transparent",
		markdownH3TextStyle: "bold",

		markdownH4Color: foreground.hexa(),
		markdownH4Background: "transparent",
		markdownH4TextStyle: "bold underline",

		markdownH5Color: foreground.hexa(),
		markdownH5Background: "transparent",
		markdownH5TextStyle: "bold",

		markdownH6Color,
		markdownH6Background: "transparent",
		markdownH6TextStyle: "bold",

		buttonForeground: foreground.hexa(),
		buttonColorForeground: palette.background.base.text,
		buttonFocusTextStyle: "b reverse",
	};

	return {
		name: `random-${randomName()}`,
		palette,
		dark: bg.isDark(),
		variables,
		source: "user",
	};
};

// some stuff taken from Textual's 'design.py'
// https://github.com/Textualize/textual/blob/main/src/textual/color.py#L624

// TODO: add color palette options based off textual docs color list (of built in colors)
