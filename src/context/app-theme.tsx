import Popover, { useDialogContext } from "@corvu/popover";
import { cookieStorage, makePersisted } from "@solid-primitives/storage";
import {
	type Accessor,
	type Component,
	For,
	type JSX,
	Match,
	type Setter,
	Show,
	Switch,
	createContext,
	createEffect,
	createMemo,
	createSignal,
	onMount,
	useContext,
} from "solid-js";
import { isServer } from "solid-js/web";
import Icon from "~/components/ui/icon";

type AppTheme = "system" | "light" | "dark";
export const DEFAULT_APP_THEME: AppTheme = "system";
const PERSISTENCE_OPTIONS = {
	name: "theme",
	storage: cookieStorage,
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

type ThemeContextValue = {
	appTheme: Accessor<AppTheme>;
	setAppTheme: Setter<AppTheme>;
};
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
		createSignal<AppTheme>(
			!isServer
				? (localStorage.getItem("theme") as AppTheme)
				: DEFAULT_APP_THEME,
		),
		PERSISTENCE_OPTIONS,
	);
	createEffect(() => localStorage.setItem("theme", appTheme()));

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
		<ThemeContext.Provider value={{ appTheme, setAppTheme }}>
			{props.children}
		</ThemeContext.Provider>
	);
};

// TODO: fix weird bug where starting theme icon disappears? (sometimes) and it is always set to system icon? (context / storage off)
const AppThemeController: Component<
	JSX.ButtonHTMLAttributes<HTMLButtonElement>
> = (props) => {
	const { appTheme, setAppTheme } = useAppTheme();
	const cycle = ["system", "light", "dark"] as const;
	const nextThemeIdx = createMemo(() => {
		const current = cycle.indexOf(appTheme());
		return (current + 1) % cycle.length;
	});

	return (
		<button
			{...props}
			type="button"
			class="btn btn-ghost btn-circle motion-duration-500 motion-ease-in-out -motion-translate-x-in-[200%] motion-delay-500 fixed inset-1 size-9 translate-x-full p-0.5 xl:size-11"
			onClick={() => setAppTheme(cycle[nextThemeIdx()])}
		>
			<Show
				when={appTheme()}
				fallback={
					<Icon
						class="motion-duration-200 motion-rotate-in-[-135deg] motion-opacity-in-0 motion-ease-in-out size-full"
						icon="mdi:theme-light-dark"
					/>
				}
			>
				{(theme) => (
					<Switch
						fallback={
							<Icon
								class="motion-duration-200 motion-rotate-in-[-135deg] motion-opacity-in-0 motion-ease-in-out size-full"
								icon="mdi:theme-light-dark"
							/>
						}
					>
						<Match when={theme() === "system"}>
							<Icon
								class="motion-duration-200 motion-rotate-in-[-135deg] motion-opacity-in-0 motion-ease-in-out size-full"
								icon="mdi:theme-light-dark"
							/>
						</Match>
						<Match when={theme() === "light"}>
							<Icon
								class="motion-duration-200 motion-rotate-in-[-135deg] motion-opacity-in-0 motion-ease-in-out size-full"
								icon="tabler:sun-filled"
							/>
						</Match>
						<Match when={theme() === "dark"}>
							<Icon
								class="motion-duration-200 motion-rotate-in-[-135deg] motion-opacity-in-0 motion-ease-in-out size-full"
								icon="tabler:moon-filled"
							/>
						</Match>
					</Switch>
				)}
			</Show>
		</button>
	);
};

export default AppThemeController;
