import { ReactiveMap } from "@solid-primitives/map";
import type { Component, JSX } from "solid-js";
import { createContext, createEffect, onMount, useContext } from "solid-js";
import { type SetStoreFunction, type Store, createStore } from "solid-js/store";
import { STARTING_THEMES, VER_KEY } from "../data/themes";
import type { TextualTheme } from "../types";

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

	const saveData = () => {
		localStorage.setItem(
			`themeData-${VER_KEY}`,
			JSON.stringify(Array.from(data.values())),
		);
	};

	const [currentTheme, setCurrent] = createStore<TextualTheme>(
		STARTING_THEMES[0],
		{ name: "currentTheme" },
	);

	const setCurrentTheme = (name: string) => setCurrent(data.get(name)!);

	// load user data from storage
	onMount(() => {
		const localData = localStorage.getItem(`themeData-${VER_KEY}`) ?? undefined;
		if (localData) {
			data.clear();
			for (const [k, v] of Object.entries(JSON.parse(localData)))
				data.set(k, v as TextualTheme);
		} else {
			localStorage.setItem(
				`themeData-${VER_KEY}`,
				JSON.stringify(STARTING_THEMES),
			);
		}
	});

	// save user data to storage
	createEffect(saveData);

	return (
		<ThemeContext.Provider value={{ data, currentTheme, setCurrentTheme }}>
			{props.children}
		</ThemeContext.Provider>
	);
};
