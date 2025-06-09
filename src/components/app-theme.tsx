import { cookieStorage, makePersisted } from "@solid-primitives/storage";
import Icon from "@xtreat/solid-iconify";
import {
	type Component,
	type JSX,
	Match,
	Show,
	Switch,
	createEffect,
	createMemo,
	createSignal,
} from "solid-js";

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

// TODO: fix weird bug where starting theme icon disappears? (sometimes) and it is always set to system icon? (context / storage off)
const AppThemeSwitcher: Component<
	JSX.ButtonHTMLAttributes<HTMLButtonElement>
> = (props) => {
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

	const cycle = ["system", "light", "dark"] as const;
	const nextThemeIdx = createMemo(() => {
		const current = cycle.indexOf(appTheme());
		return (current + 1) % cycle.length;
	});

	return (
		<button
			{...props}
			aria-label={`Switch theme (current: ${appTheme() || "system"})`}
			class="tooltip tooltip-right btn btn-ghost btn-circle motion-duration-500 motion-ease-in-out -motion-translate-x-in-[200%] motion-delay-500 fixed inset-1 z-1 fhd:size-11 size-6 translate-x-full p-0.5 md:size-9"
			data-tip={appTheme()[0].toLocaleUpperCase() + appTheme().slice(1)}
			onClick={() => setAppTheme(cycle[nextThemeIdx()])}
			type="button"
		>
			<Show
				fallback={
					<Icon
						class="motion-duration-200 motion-rotate-in-[-135deg] motion-opacity-in-0 motion-ease-in-out size-full"
						icon="mdi:theme-light-dark"
					/>
				}
				when={appTheme()}
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

export default AppThemeSwitcher;
