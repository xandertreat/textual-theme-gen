import { useDialogContext } from "@corvu/popover";
import {
	type Component,
	type JSX,
	Match,
	Show,
	Switch,
	batch,
	createEffect,
	createSignal,
	onMount,
} from "solid-js";
import Icon from "~/components/ui/icon";
import { useTheme } from "../context/theme";
import { randomName } from "../lib/utils";
import type { TextualTheme } from "../types";

interface CloneThemeOptionProps
	extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {}

export const CloneThemeOption: Component<CloneThemeOptionProps> = (props) => {
	const { data, selectedTheme, selectTheme } = useTheme();
	const { setOpen } = useDialogContext();

	const handleCloning = () => {
		const cur: TextualTheme = { ...selectedTheme(), source: "user" };
		cur.name = `${cur.name.replace(/-clone(-\w+)?$/, "")}-clone`;
		if (data.has(cur.name)) cur.name = `${cur.name}-${randomName()}`;

		setOpen(false);
		// need to defer the cloning to allow the dialog to close
		setTimeout(() => {
			batch(() => {
				data.set(cur.name, cur);
				selectTheme(cur.name);
			});
		});
	};

	return (
		<button
			type="button"
			class="inline-flex size-full items-center rounded text-center font-bold text-sm"
			{...props}
			onClick={handleCloning}
		>
			<Icon icon="mdi:content-copy" />
			Clone
		</button>
	);
};

type CloneState = "ready" | "cloning" | "cloned" | "error";
const CLONE_HOLD_TIME = 1500; // milliseconds
const CLONE_SUCCESS_DELAY = 3000; // milliseconds
const QUERY_SELECTOR = "path";

const CloneTheme: Component<JSX.ButtonHTMLAttributes<HTMLButtonElement>> = (
	props,
) => {
	const { data, selectedTheme, selectTheme } = useTheme();
	const [phase, setPhase] = createSignal<CloneState>("ready");
	let debounce: ReturnType<typeof setTimeout> | undefined;
	const controller = new AbortController();
	const signal: AbortSignal = controller.signal;

	const handleCloning = () => {
		const cur: TextualTheme = { ...selectedTheme(), source: "user" };
		cur.name = `${cur.name.replace(/-clone(-\w+)?$/, "")}-clone`;
		if (data.has(cur.name)) cur.name = `${cur.name}-${randomName()}`;

		batch(() => {
			data.set(cur.name, cur);
			selectTheme(cur.name);
		});

		setPhase("cloned");
		setTimeout(() => {
			setPhase("ready");
		}, CLONE_SUCCESS_DELAY);
	};

	const DesktopButton = () => {
		return (
			<button
				type="button"
				class="btn btn-primary btn-sm tooltip tooltip-right m-2 mx-4 hidden bg-bottom xl:flex"
				classList={{
					"after:opacity-0!": phase() !== "ready",
				}}
				{...props}
				onMouseDown={() => {
					if (phase() !== "ready") return;

					setPhase("cloning");
					try {
						document.addEventListener(
							"mouseup",
							() => {
								if (phase() === "cloning") setPhase("ready");
							},
							{
								once: true,
								signal,
							},
						);
						if (debounce) clearTimeout(debounce);
						debounce = setTimeout(() => {
							if (phase() === "cloning") handleCloning();
						}, CLONE_HOLD_TIME);
					} catch (e) {
						controller.abort();
						setPhase("error");
						setTimeout(() => setPhase("ready"), CLONE_SUCCESS_DELAY);
					}
				}}
				style={{
					"background-size": "100% 200%",
				}}
			>
				<span
					class="tooltip-content motion-duration-200 text-xs"
					classList={{
						"motion-opacity-out-0": phase() !== "ready",
						"motion-opacity-in": phase() === "ready",
					}}
				>
					(hold)
				</span>
				<span class="relative size-6">
					<Icon
						class="motion-duration-150 motion-ease-in absolute inset-0 size-full scale-100"
						classList={{
							"motion-scale-in-0": phase() === "ready",
							"motion-scale-out-0": phase() !== "ready",
						}}
						icon="pixelarticons:section-copy"
					/>
					<Icon
						class="motion-duration-150 motion-ease-in absolute inset-0 size-full scale-0"
						classList={{
							"motion-scale-in-0": phase() === "cloning",
							"motion-scale-out-0": phase() !== "cloning",
						}}
						icon="svg-spinners:blocks-wave"
					/>
					<Icon
						class="motion-duration-150 motion-ease-in absolute inset-0 size-full scale-0"
						classList={{
							"motion-scale-in-0": phase() === "cloned",
							"motion-scale-out-0": phase() !== "cloned",
						}}
						icon="material-symbols:check-rounded"
					/>
					<Icon
						class="motion-duration-150 motion-ease-in absolute inset-0 size-full scale-0"
						classList={{
							"motion-scale-in-0": phase() === "error",
							"motion-scale-out-0": phase() !== "error",
						}}
						icon="charm:cross"
					/>
				</span>
				<Switch>
					<Match when={phase() === "ready"}>Clone Theme</Match>
					<Match when={phase() === "cloning"}>Cloning...</Match>
					<Match when={phase() === "cloned"}>Cloned!</Match>
					<Match when={phase() === "error"}>Failed...</Match>
				</Switch>
			</button>
		);
	};

	const MobileButton = () => (
		<button
			type="button"
			class="btn btn-primary btn-sm m-2 mx-4 bg-bottom xl:hidden"
			{...props}
			onClick={handleCloning}
		>
			<Icon class="size-6" icon="mdi:content-copy" />
			Clone Theme
		</button>
	);

	return (
		<>
			<DesktopButton />
			<MobileButton />
		</>
	);
};

export default CloneTheme;
