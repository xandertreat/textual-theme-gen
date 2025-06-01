import type { HexCodeCharacter as H } from "./z";
type HexColorCode =
	| `#${H}${H}${H}${H}${H}${H}`
	| `#${H}${H}${H}${H}${H}${H}${H}`
	| `#${H}${H}${H}${H}`
	| `#${H}${H}${H}`;

interface TextualColor {
	color: HexColorCode;
	text: HexColorCode;
	muted: HexColorCode;
	disabled: HexColorCode;
}

type TextualColorShade = `${"lighten" | "darken"}-${number}`;

interface TextualGeneratedColor {
	base: TextualColor;
	[shade: TextualColorShade]: TextualColor;
}

interface TextualColors {
	primary: TextualGeneratedColor;
	secondary: TextualGeneratedColor;
	// "primary-background": TextualGeneratedColor;
	// "secondary-background": TextualGeneratedColor;
	background: TextualGeneratedColor;
	foreground: TextualGeneratedColor;
	surface: TextualGeneratedColor;
	panel: TextualGeneratedColor;
	boost: TextualGeneratedColor;
	warning: TextualGeneratedColor;
	error: TextualGeneratedColor;
	success: TextualGeneratedColor;
	accent: TextualGeneratedColor;
	[color: string]: TextualGeneratedColor;
}

interface TextualVariables {
	[variable: string]: string;
}

type TextualThemeSource = "textual" | "preset" | "user";

interface TextualTheme {
	name: string;
	dark?: boolean;
	palette: TextualColors;
	variables?: TextualVariables;
	source?: TextualThemeSource;
}
