import Color from "color";
import type {
	HexColorCode,
	TextualColor,
	TextualGeneratedColor,
	TextualTheme,
} from "~/features/themes/types";

export const cleanThemeName = (name: string) => {
	return name
		.replace(/[^a-zA-Z0-9]/g, "_")
		.trim()
		.toLowerCase();
};

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
