import {
	type Component,
	type JSX,
	Match,
	Switch,
	batch,
	createSignal,
} from "solid-js";
import { useTheme } from "~/features/themes/context/theme";
import { randomName } from "~/features/themes/lib/utils";
import type { TextualTheme } from "~/features/themes/types";
import IconCross from "~icons/charm/cross";
import IconCheckRounded from "~icons/material-symbols/check-rounded";
import IconContentCopy from "~icons/mdi/content-copy";
import IconSpinnersBlocksWave from "~icons/svg-spinners/blocks-wave";

type CloneState = "ready" | "cloning" | "cloned" | "error";
const CLONE_HOLD_TIME = 1000; // milliseconds
const CLONE_SUCCESS_DELAY = 1750; // milliseconds

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
				aria-label="Clone Theme"
				class="btn tooltip tooltip-bottom m-2 mx-4 hidden w-40 border-2 border-primary bg-primary/15 xl:flex"
				classList={{
					"after:opacity-0!": phase() !== "ready",
				}}
				type="button"
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
			>
				<span
					class="tooltip-content text-xs"
					classList={{
						"opacity-0!": phase() !== "ready",
					}}
				>
					(hold)
				</span>
				<span class="relative size-6">
					<IconSpinnersBlocksWave
						class="motion-duration-150 motion-ease-in absolute inset-0 size-full scale-0"
						classList={{
							"motion-scale-in-0": phase() === "cloning",
							"motion-scale-out-0": phase() !== "cloning",
						}}
					/>
					<IconCheckRounded
						class="motion-duration-150 motion-ease-in absolute inset-0 size-full scale-0"
						classList={{
							"motion-scale-in-0": phase() === "cloned",
							"motion-scale-out-0": phase() !== "cloned",
						}}
					/>
					<IconCross
						class="motion-duration-150 motion-ease-in absolute inset-0 size-full scale-0"
						classList={{
							"motion-scale-in-0": phase() === "error",
							"motion-scale-out-0": phase() !== "error",
						}}
					/>
				</span>
				<p>
					<Switch>
						<Match when={phase() === "ready"}>Clone Theme</Match>
						<Match when={phase() === "cloning"}>Cloning...</Match>
						<Match when={phase() === "cloned"}>Cloned!</Match>
						<Match when={phase() === "error"}>Failed...</Match>
					</Switch>
				</p>
			</button>
		);
	};

	const MobileButton = () => (
		<button
			aria-label="Clone Theme"
			class="btn btn-primary btn-sm m-2 mx-4 bg-bottom xl:hidden"
			type="button"
			{...props}
			onClick={handleCloning}
		>
			<IconContentCopy class="size-6" />
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
