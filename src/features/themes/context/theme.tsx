import { ReactiveMap } from "@solid-primitives/map";
import type { Accessor, Component, JSX, Setter } from "solid-js";
import {
	createContext,
	createEffect,
	createSignal,
	onMount,
	useContext,
} from "solid-js";
import { DEFAULT_THEMES, VERSION_KEY } from "../data/themes";
import type { TextualTheme } from "../types";

export const DEFAULTS = DEFAULT_THEMES();
const STORAGE_KEY = `saved-${VERSION_KEY()}`;
const LAST_SELECTED_KEY = `last-selected-${VERSION_KEY()}`;

type ThemeStorage = ReactiveMap<string, TextualTheme>;
export interface ThemeContext {
	data: ThemeStorage;
	selectedTheme: () => TextualTheme;
	modifySelected: (modified: Partial<TextualTheme>) => void;
	selectedThemeName: Accessor<string>;
	selectTheme: Setter<string>;
	firstThemeName: string;
}

const ThemeContext = createContext<ThemeContext>();

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context)
		throw new Error("useTheme must be used within a <ThemeProvider> component");
	return context;
};

export const ThemeProvider: Component<{ children: JSX.Element }> = (props) => {
	// state
	const data = new ReactiveMap<string, TextualTheme>(
		DEFAULTS.map((t) => [t.name, t]),
	);
	const keys = data.keys().toArray();

	const firstThemeName = [...keys][keys.indexOf("textual-light")];
	const [selectedName, selectTheme] = createSignal<string>(firstThemeName);
	const [selectedTheme, modifySelected] = [
		() => data.get(selectedName())!,
		(modified: Partial<TextualTheme>) =>
			data.set(selectedName(), { ...selectedTheme(), ...modified }),
	];

	// lifecycle
	onMount(() => {
		// load from local storage (if any)
		const localData = localStorage.getItem(STORAGE_KEY);
		if (localData) {
			data.clear();
			for (const t of JSON.parse(localData))
				data.set(t.name, t as TextualTheme);
		}
		const lastSelected = localStorage.getItem(LAST_SELECTED_KEY);
		if (lastSelected && data.has(lastSelected)) selectTheme(lastSelected);

		// sync local storage from now on
		createEffect(() => {
			localStorage.setItem(STORAGE_KEY, JSON.stringify([...data.values()]));
		});
		createEffect(() => {
			localStorage.setItem(LAST_SELECTED_KEY, selectedTheme().name);
		});
	});

	return (
		<ThemeContext.Provider
			value={{
				data,
				selectedTheme,
				modifySelected,
				selectedThemeName: selectedName,
				selectTheme,
				firstThemeName,
			}}
		>
			{props.children}
		</ThemeContext.Provider>
	);
};
