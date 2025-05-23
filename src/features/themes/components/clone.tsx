import { useDialogContext } from "@corvu/popover";
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
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
gsap.registerPlugin(MorphSVGPlugin);

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
		}, 1);
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
		let readyIcon!: SVGPathElement;
		let clonedIcon!: SVGPathElement;
		let errorIcon!: SVGPathElement;
		let currentIcon!: SVGPathElement;

		createEffect(() => {
			const state = phase();
			if (state === "ready")
				gsap.to(currentIcon, { duration: 0.2, morphSVG: readyIcon });
			else if (state === "cloned")
				gsap.to(currentIcon, { duration: 0.2, morphSVG: clonedIcon });
			else if (state === "error")
				gsap.to(currentIcon, { duration: 0.2, morphSVG: errorIcon });
		});

		return (
			<button
				type="button"
				class="btn btn-primary btn-sm tooltip tooltip-right m-2 mx-4 hidden bg-bottom xl:flex"
				classList={{
					"after:opacity-0!": phase() !== "ready",
					"after:opacity-100": phase() === "ready",
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
						ref={(el) => {
							currentIcon = el.querySelector<SVGPathElement>(QUERY_SELECTOR)!;
						}}
						class="motion-duration-150 motion-ease-in absolute inset-0 size-full scale-100"
						classList={{
							"motion-scale-out-0": phase() === "cloning",
							"motion-scale-in-0": phase() !== "cloning",
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
				</span>
				{/* Refs */}
				<Icon
					ref={(el) => {
						readyIcon = el.querySelector<SVGPathElement>(QUERY_SELECTOR)!;
					}}
					class="hidden"
					icon="pixelarticons:section-copy"
				/>
				<Icon
					ref={(el) => {
						clonedIcon = el.querySelector<SVGPathElement>(QUERY_SELECTOR)!;
					}}
					class="hidden"
					icon="material-symbols:check-rounded"
				/>
				<Icon
					ref={(el) => {
						errorIcon = el.querySelector<SVGPathElement>(QUERY_SELECTOR)!;
					}}
					class="hidden"
					icon="charm:cross"
				/>
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
