import { getColorData } from "../lib/utils";
import type { HexColorCode, TextualTheme } from "../types";
import themes from "./themes.json" with { type: "json" };

// theme data
const THEMES = JSON.parse(JSON.stringify(themes));
for (const theme of THEMES)
	theme.palette = Object.fromEntries(
		Object.entries(theme.palette).map(([k, v]) => [
			k,
			getColorData(v as HexColorCode),
		]),
	);

const OLD = false;
const VERSION = 0.0_1;
export const VERSION_KEY = () => {
	let key = (VERSION ^ (VERSION >>> 16)) * 0x45d9f3b;
	key = (key ^ (key >>> 16)) * 0x45d9f3b;
	key = key ^ (key >>> 16);
	return key >>> 0;
};

export const DEFAULT_THEME = "textual-light";
export const DEFAULT_THEMES = (): TextualTheme[] =>
	JSON.parse(JSON.stringify(THEMES));
