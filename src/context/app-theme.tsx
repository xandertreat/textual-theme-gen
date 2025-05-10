import Icon from "~/components/ui/icon";
import {
	createSignal,
	createContext,
	type Component,
	type JSX,
	type Accessor,
	type Setter,
	useContext,
	createEffect,
	createMemo,
	For,
	Switch,
	Match,
} from "solid-js";
import { makePersisted } from "@solid-primitives/storage";
import Popover, { useDialogContext } from "@corvu/popover";

type AppTheme = "system" | "light" | "dark";
export const DEFAULT_APP_THEME: AppTheme = "system";
const PERSISTENCE_OPTIONS = {
	name: "theme",
};

const APP_THEME_TRANSITION_DURATION = 200;
const APP_THEME_TRANSITION_STYLES = `
  *,
::before,
::after {
    transition:
      color ${APP_THEME_TRANSITION_DURATION}ms ease-in-out,
      background-color ${APP_THEME_TRANSITION_DURATION}ms ease-in-out,
      border-color ${APP_THEME_TRANSITION_DURATION}ms ease-in-out,
      outline-color ${APP_THEME_TRANSITION_DURATION}ms ease-in-out,
      text-decoration-color ${APP_THEME_TRANSITION_DURATION}ms ease-in-out,
      fill ${APP_THEME_TRANSITION_DURATION}ms ease-in-out,
      stroke ${APP_THEME_TRANSITION_DURATION}ms ease-in-out,
      --tw-gradient-from ${APP_THEME_TRANSITION_DURATION}ms ease-in-out,
      --tw-gradient-via ${APP_THEME_TRANSITION_DURATION}ms ease-in-out,
      --tw-gradient-to ${APP_THEME_TRANSITION_DURATION}ms ease-in-out !important;
}
`;

type ThemeContextValue = [Accessor<AppTheme>, Setter<AppTheme>];
const ThemeContext = createContext<ThemeContextValue>();

export const useAppTheme = () => {
	const context = useContext(ThemeContext);
	if (!context)
		throw new Error(
			"useThemeContext must be used within a <ThemeProvider> component",
		);
	return context;
};

export const AppThemeProvider: Component<{ children: JSX.Element }> = (
	props,
) => {
	let transitioningTheme = false;
	const [appTheme, setAppTheme] = makePersisted(
		createSignal<AppTheme>(DEFAULT_APP_THEME),
		PERSISTENCE_OPTIONS,
	);

	createEffect(async () => {
		if (transitioningTheme) {
			document.documentElement.dataset.theme = appTheme();
			return;
		}

		try {
			transitioningTheme = true;
			const style = document.createElement("style");
			style.textContent = APP_THEME_TRANSITION_STYLES;

			document.head.appendChild(style);
			document.documentElement.dataset.theme = appTheme();

			await new Promise((resolve) =>
				setTimeout(resolve, APP_THEME_TRANSITION_DURATION),
			);
			style.remove();
		} catch (error) {
			console.error("Failed to change theme:", error);
			document.documentElement.dataset.theme = appTheme();
		} finally {
			transitioningTheme = false;
		}
	});

	return (
		<ThemeContext.Provider value={[appTheme, setAppTheme]}>
			{props.children}
		</ThemeContext.Provider>
	);
};

const AppThemeController: Component<
	JSX.ButtonHTMLAttributes<HTMLButtonElement>
> = (props) => {
	const [appTheme, setAppTheme] = useAppTheme();
	const cycle = ["system", "light", "dark"] as const;
	const nextThemeIdx = createMemo(
		() => (cycle.indexOf(appTheme()) + 1) % cycle.length,
	);

	return (
		<button
			type="button"
			class="btn btn-ghost btn-circle size-8 p-0.5 fixed inset-1"
			onClick={() => setAppTheme(cycle[nextThemeIdx()])}
			{...props}
		>
			<Switch
				fallback={
					<Icon
						class="size-full motion-duration-200 motion-rotate-in-[-135deg] motion-opacity-in-0 motion-ease-in-out"
						icon="mdi:theme-light-dark"
					/>
				}
			>
				<Match when={appTheme() === "system"}>
					<Icon
						class="size-full motion-duration-200 motion-rotate-in-[-135deg] motion-opacity-in-0 motion-ease-in-out"
						icon="mdi:theme-light-dark"
					/>
				</Match>
				<Match when={appTheme() === "light"}>
					<Icon
						class="size-full motion-duration-200 motion-rotate-in-[-135deg] motion-opacity-in-0 motion-ease-in-out"
						icon="tabler:sun-filled"
					/>
				</Match>
				<Match when={appTheme() === "dark"}>
					<Icon
						class="size-full motion-duration-200 motion-rotate-in-[-135deg] motion-opacity-in-0 motion-ease-in-out"
						icon="tabler:moon-filled"
					/>
				</Match>
			</Switch>
		</button>
	);
};

export default AppThemeController;
