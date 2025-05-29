import type { TextualTheme } from "../types";

// TODO: maybe force underscores for less confusion?

/**
 * Generates a Python code string for defining a Textual Theme object.
 * @param theme The TextualTheme object.
 * @returns A string containing the Python code.
 */
export const getThemeCode = (theme: TextualTheme) => {
	return `
${theme.name.replaceAll(/-/g, "_")}_theme = Theme(
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

# YOUR APP CLASS HERE #
class MyApp(App):
    def on_mount(self) -> None:
        # Register the theme
        self.register_theme(${theme.name}_theme)

        # Set the app's theme (optional!)
        self.theme = "${theme.name}"
`;
};
