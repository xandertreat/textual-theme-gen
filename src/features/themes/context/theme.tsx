import { ReactiveMap } from "@solid-primitives/map";
import type { Component, JSX } from "solid-js";
import { createContext, createEffect, onMount, useContext } from "solid-js";
import {
	type SetStoreFunction,
	type Store,
	createStore,
	reconcile,
} from "solid-js/store";
import { STARTING_THEMES, VERSION_KEY } from "../data/themes";
import type { TextualTheme } from "../types";

const STORAGE_KEY = `themes-${VERSION_KEY()}`;

type ThemeStorage = ReactiveMap<string, TextualTheme>;

export interface ThemeContext {
	data: ThemeStorage;
	currentTheme: Store<TextualTheme>;
	setCurrentTheme: (name: string) => void;
}

const ThemeContext = createContext<ThemeContext>();

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context)
		throw new Error("useTheme must be used within a <ThemeProvider> component");
	return context;
};

export const ThemeProvider: Component<{ children: JSX.Element }> = (props) => {
	const data = new ReactiveMap<string, TextualTheme>(
		STARTING_THEMES.map((t) => [t.name, t]),
	);

	const [currentTheme, setCurrent] = createStore<TextualTheme>(
		STARTING_THEMES[0],
	);

	const setCurrentTheme = (name: string) =>
		setCurrent(reconcile(data.get(name)!, { merge: false }));

	onMount(() => {
		// load from local storage (if any)
		const localData = localStorage.getItem(STORAGE_KEY);
		if (localData) {
			data.clear();
			for (const [k, v] of Object.entries(JSON.parse(localData)))
				data.set(k, v as TextualTheme);
		}

		// sync local storage from now on
		createEffect(() => {
			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify(Array.from(data.values())),
			);
		});
	});

	return (
		<ThemeContext.Provider value={{ data, currentTheme, setCurrentTheme }}>
			{props.children}
		</ThemeContext.Provider>
	);
};
