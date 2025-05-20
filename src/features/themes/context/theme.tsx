import { ReactiveMap } from "@solid-primitives/map";
import type { Accessor, Component, JSX, Setter } from "solid-js";
import {
	createContext,
	createEffect,
	createMemo,
	createSignal,
	onMount,
	useContext,
} from "solid-js";
import { DEFAULT_THEMES, VERSION_KEY } from "../data/themes";
import type { TextualTheme } from "../types";

const STORAGE_KEY = `saved-${VERSION_KEY()}`;
const LAST_SELECTED_KEY = `last-selected-${VERSION_KEY()}`;

type ThemeStorage = ReactiveMap<string, TextualTheme>;

export interface ThemeContext {
	data: ThemeStorage;
	selectedTheme: Accessor<TextualTheme>;
	selectTheme: Setter<string>;
	firstDefaultTheme: () => string;
	getFirstThemeName: Accessor<string>;
	getFirstTheme: Accessor<TextualTheme>;
}

const ThemeContext = createContext<ThemeContext>();

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context)
		throw new Error("useTheme must be used within a <ThemeProvider> component");
	return context;
};

export const ThemeProvider: Component<{ children: JSX.Element }> = (props) => {
	// all stored theme data
	const data = new ReactiveMap<string, TextualTheme>(
		DEFAULT_THEMES().map((t) => [t.name, t]),
	);

	const getFirstThemeName = createMemo<string>(() => [...data.keys()][0]!);
	const getFirstTheme = createMemo<TextualTheme>(
		() => data.get(getFirstThemeName())!,
	);

	const firstDefaultTheme = () => DEFAULT_THEMES()[0].name;

	// current theme data
	const [selectedName, selectTheme] = createSignal<string>(getFirstThemeName());
	const selectedTheme = createMemo<TextualTheme>(
		() => data.get(selectedName())!,
	);

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
			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify(Array.from(data.values())),
			);
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
				selectTheme,
				firstDefaultTheme,
				getFirstThemeName,
				getFirstTheme,
			}}
		>
			{props.children}
		</ThemeContext.Provider>
	);
};
