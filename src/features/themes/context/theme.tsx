import { ReactiveMap } from "@solid-primitives/map";
import { makePersisted } from "@solid-primitives/storage";
import type { Component, JSX } from "solid-js";
import { createContext, createEffect, onMount, useContext } from "solid-js";
import { type SetStoreFunction, createStore } from "solid-js/store";
import { DEFAULT_THEMES, VERSION_KEY } from "../data/themes";
import type { TextualTheme } from "../types";

const STORAGE_KEY = `saved-${VERSION_KEY()}`;
const LAST_SELECTED_KEY = `last-selected-${VERSION_KEY()}`;

type ThemeStorage = ReactiveMap<string, TextualTheme>;

export interface ThemeContext {
	data: ThemeStorage;
	selectedTheme: TextualTheme;
	addTheme: (theme: TextualTheme) => void;
	deleteTheme: (theme: TextualTheme | string) => boolean;
	modifyTheme: SetStoreFunction<TextualTheme>;
	getFirstTheme: () => TextualTheme;
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
	const data = new ReactiveMap<string, TextualTheme>(
		DEFAULT_THEMES().map((t) => [t.name, t]),
	);
	const getFirstTheme = () => data.get([...data.keys()][0])!;

	// current theme data
	const [selectedTheme, modifyTheme] = createStore<TextualTheme>(
		getFirstTheme(),
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
		if (lastSelected) {
			const lastSelectedTheme = JSON.parse(lastSelected);
			if (data.has(lastSelectedTheme.name))
				modifyTheme(JSON.parse(lastSelected));
		}

		// sync local storage from now on
		createEffect(() => {
			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify(Array.from(data.values())),
			);
		});
		createEffect(() => {
			localStorage.setItem(LAST_SELECTED_KEY, JSON.stringify(selectedTheme));
		});
	});

	const addTheme = (theme: TextualTheme) => {
		const clone = JSON.parse(JSON.stringify(theme));
		clone.source = "user";
		modifyTheme(clone);
		data.set(theme.name, clone);
	};

	const deleteTheme = (theme: TextualTheme | string) => {
		const name = typeof theme === "string" ? theme : theme.name;
		const success = data.delete(name);
		if (success && selectedTheme.name === name) modifyTheme(getFirstTheme());
		return success;
	};

	const resetData = () => {
		data.clear();
		for (const t of DEFAULT_THEMES()) data.set(t.name, t);
		modifyTheme(getFirstTheme());
	};

	return (
		<ThemeContext.Provider
			value={{
				data,
				selectedTheme,
				addTheme,
				deleteTheme,
				modifyTheme,
				getFirstTheme,
				resetData,
			}}
		>
			{props.children}
		</ThemeContext.Provider>
	);
};
