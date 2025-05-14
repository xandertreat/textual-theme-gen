import Color, { type ColorInstance } from "color";
import type {
	HexColorCode,
	TextualColor,
	TextualGeneratedColor,
	TextualTheme,
} from "~/features/themes/types";

/**
 * Generates a TextualColor object with base, text, muted, and disabled colors from a base ColorInstance.
 * @param base The base color instance.
 * @returns A TextualColor object.
 */
export const getTextualColor = (base: ColorInstance): TextualColor => {
	const textColor = Color(base.isLight() ? "#000000" : "#FFFFFF");
	return {
		color: base.hex() as HexColorCode,
		text: textColor.hex() as HexColorCode,
		muted: textColor.mix(base.fade(0.3)).hex() as HexColorCode,
		disabled: textColor.mix(base.fade(0.5)).hex() as HexColorCode,
	};
};

/**
 * Generates a TextualGeneratedColor object with various shades of a base color.
 * @param hex The base color in hex format.
 * @returns A TextualGeneratedColor object.
 */
export const getColorData = (hex: HexColorCode): TextualGeneratedColor => {
	const color = Color(hex);
	return {
		base: getTextualColor(color),
		"lighten-1": getTextualColor(color.lighten(0.1)),
		"lighten-2": getTextualColor(color.lighten(0.2)),
		"lighten-3": getTextualColor(color.lighten(0.3)),
		"darken-1": getTextualColor(color.darken(0.1)),
		"darken-2": getTextualColor(color.darken(0.2)),
		"darken-3": getTextualColor(color.darken(0.3)),
	};
};

/**
 * Generates a random theme object.
 * @returns A random TextualTheme object.
 */
export const genRandomTheme = (): TextualTheme => {
	const randomName = () => {
		const chars = [
			"a",
			"b",
			"c",
			"d",
			"e",
			"f",
			"g",
			"h",
			"i",
			"j",
			"k",
			"l",
			"m",
			"n",
			"o",
			"p",
			"q",
			"r",
			"s",
			"t",
			"u",
			"v",
			"w",
			"x",
			"y",
			"1",
			"2",
			"3",
			"4",
			"5",
			"6",
			"7",
			"8",
			"9",
			"0",
		];
		return chars
			.map(() => {
				const char = chars[Math.floor(Math.random() * chars.length)];
				if (Math.random() > 0.5) return char.toUpperCase();
				return char;
			})
			.splice(0, 8)
			.join("");
	};
	const randomLCH = () =>
		Color().lch(Math.random() * 100, Math.random() * 130, Math.random() * 360);
	const randomHex = () => {
		return randomLCH().hex() as HexColorCode;
	};
	const bg = randomLCH();
	const darkTheme = bg.isDark();
	return {
		name: `random-${randomName()}`,
		palette: {
			primary: getColorData(randomHex()),
			secondary: getColorData(randomHex()),
			accent: getColorData(randomHex()),
			background: getColorData(bg.hex() as HexColorCode),
			foreground: getColorData(randomHex()),
			surface: getColorData(randomHex()),
			panel: getColorData(randomHex()),
			success: getColorData(randomHex()),
			warning: getColorData(randomHex()),
			error: getColorData(randomHex()),
			boost: getColorData(randomHex()),
		},
		dark: darkTheme,
		variables: {},
		source: "user",
	};
};

/**
 * Retrieves the base color hex code for a specific color key from a theme's palette.
 * @param theme The TextualTheme object.
 * @param color The key of the color in the palette.
 * @returns The hex color code.
 */
export const getPaletteColor = (
	theme: TextualTheme,
	color: string,
): HexColorCode => {
	if (
		!theme ||
		!theme.palette ||
		!theme.palette[color as keyof typeof theme.palette]
	)
		return "#000000";
	return theme.palette[color as keyof typeof theme.palette].base.color;
};

/**
 * Generates a Python code string for defining a Textual Theme object.
 * @param theme The TextualTheme object.
 * @returns A string containing the Python code.
 */
export const getThemeCode = (theme: TextualTheme) => {
	return `
${theme.name}_theme = Theme(
    name="${theme.name}",
    primary="${theme.palette.primary.base.color}",
    secondary="${theme.palette.secondary.base.color}",
    accent="${theme.palette.accent.base.color}",
    background="${theme.palette.background.base.color}",
    foreground="${theme.palette.foreground.base.color}",
    surface="${theme.palette.surface.base.color}",
    panel="${theme.palette.panel.base.color}",
    success="${theme.palette.success.base.color}",
    warning="${theme.palette.warning.base.color}",
    error="${theme.palette.error.base.color}",
    dark=${theme.dark ? "True" : "False"},
    variables=${theme.variables ? JSON.stringify(theme.variables) : "None"},
)
`;
};

/**
 * Generates a Python code string for registering and setting a theme in a Textual App.
 * @param theme The TextualTheme object.
 * @returns A string containing the Python code.
 */
export const getThemeRegistrationCode = (theme: TextualTheme) => {
	return `
from textual.app import App

class MyApp(App):
    def on_mount(self) -> None:
        # Register the theme
        self.register_theme(${theme.name}_theme)

        # Set the app's theme
        self.theme = "${theme.name}"
`;
};
