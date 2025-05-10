import Color from "color";
import type {
	HexColorCode,
	TextualColor,
	TextualGeneratedColor,
	TextualTheme,
} from "~/features/themes/types";

export const getTextualColor = (hex: HexColorCode): TextualColor => {
	const color = Color(hex);
	const textHex = color.isLight() ? "#000000" : "#ffffff";
	const text = Color(textHex);
	return {
		color: hex,
		text: textHex as HexColorCode,
		muted: text.mix(Color(color).fade(0.3)).hex() as HexColorCode,
		disabled: text.mix(Color(color).fade(0.5)).hex() as HexColorCode,
	};
};

export const getColorData = (hex: HexColorCode): TextualGeneratedColor => {
	const color = Color(hex);
	return {
		base: getTextualColor(hex),
		"lighten-1": getTextualColor(color.lighten(0.1).hex() as HexColorCode),
		"lighten-2": getTextualColor(color.lighten(0.2).hex() as HexColorCode),
		"lighten-3": getTextualColor(color.lighten(0.3).hex() as HexColorCode),
		"darken-1": getTextualColor(color.darken(0.1).hex() as HexColorCode),
		"darken-2": getTextualColor(color.darken(0.2).hex() as HexColorCode),
		"darken-3": getTextualColor(color.darken(0.3).hex() as HexColorCode),
	};
};

export const genRandomTheme = (): TextualTheme => {
	const randomName = () => {
		const chars = [
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
		];
		return chars
			.map(() => {
				const char = chars[Math.floor(Math.random() * chars.length)];
				if (Math.random() > 0.5) return char.toUpperCase();
				return char;
			})
			.splice(0, 5)
			.join("");
	};
	const randomLCH = () =>
		Color().lch(Math.random() * 100, Math.random() * 100, Math.random() * 360);
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
