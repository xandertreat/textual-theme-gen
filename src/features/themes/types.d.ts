import type { z } from "zod";
import type { hexCharacterSchema } from "./zod";

type H = z.infer<typeof hexCharacterSchema>;
type HexColorCode =
	| `#${H}${H}${H}${H}${H}${H}`
	| `#${H}${H}${H}${H}${H}${H}${H}`
	| `#${H}${H}${H}${H}`
	| `#${H}${H}${H}`;

export interface TextualColor {
	color: HexColorCode;
	text: HexColorCode;
	muted: HexColorCode;
	disabled: HexColorCode;
}

export interface TextualGeneratedColor {
	base: TextualColor;
	"lighten-1": TextualColor;
	"lighten-2": TextualColor;
	"lighten-3": TextualColor;
	"darken-1": TextualColor;
	"darken-2": TextualColor;
	"darken-3": TextualColor;
	[key: string]: TextualColor;
}

export interface TextualColors {
	primary: TextualGeneratedColor;
	secondary: TextualGeneratedColor;
	accent: TextualGeneratedColor;
	background: TextualGeneratedColor;
	foreground: TextualGeneratedColor;
	surface: TextualGeneratedColor;
	panel: TextualGeneratedColor;
	boost: TextualGeneratedColor;
	warning: TextualGeneratedColor;
	error: TextualGeneratedColor;
	success: TextualGeneratedColor;
	[key: string]: TextualGeneratedColor;
}

export type TextualThemeSource = "textual" | "preset" | "user";

export interface TextualTheme {
	name: string;
	dark?: boolean;
	palette: TextualColors;
	variables?: Record<string, string>;
	source?: TextualThemeSource;
}
