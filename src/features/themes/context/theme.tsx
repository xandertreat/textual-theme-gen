import { ReactiveMap } from "@solid-primitives/map";
import type { Component, JSX } from "solid-js";
import { createContext, createEffect, onMount, useContext } from "solid-js";
import { createStore, type SetStoreFunction } from "solid-js/store";
import { STARTING_THEMES, VERSION_KEY } from "../data/themes";
import type { TextualTheme } from "../types";
import { makePersisted } from "@solid-primitives/storage";

const STORAGE_KEY = `themes-${VERSION_KEY()}`;

type ThemeStorage = ReactiveMap<string, TextualTheme>;

export interface ThemeContext {
	themeData: ThemeStorage;
	currentTheme: TextualTheme;
	updateCurrentTheme: SetStoreFunction<TextualTheme>;
	resetData: () => void;
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
	const themeData = new ReactiveMap<string, TextualTheme>(
		STARTING_THEMES.map((t) => [t.name, t]),
	);
	const INITIAL_THEME = STARTING_THEMES[0];

	// current theme data
	const [currentTheme, updateCurrentTheme] = makePersisted(
		createStore<TextualTheme>(INITIAL_THEME),
		{ name: `theme-${VERSION_KEY()}-current` },
	);

	onMount(() => {
		// load from local storage (if any)
		const localData = localStorage.getItem(STORAGE_KEY);
		if (localData) {
			themeData.clear();
			for (const t of JSON.parse(localData))
				themeData.set(t.name, t as TextualTheme);
		}

		// sync local storage from now on
		createEffect(() => {
			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify(Array.from(themeData.values())),
			);
		});
	});

	const resetData = () => {
		themeData.clear();
		for (const t of STARTING_THEMES) themeData.set(t.name, t as TextualTheme);
	};

	return (
		<ThemeContext.Provider
			value={{
				themeData,
				currentTheme,
				updateCurrentTheme,
				resetData,
			}}
		>
			{props.children}
		</ThemeContext.Provider>
	);
};
