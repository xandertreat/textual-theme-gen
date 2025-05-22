import {
	type Component,
	type JSX,
	Show,
	batch,
	createSignal,
	onMount,
} from "solid-js";
import Icon from "~/components/ui/icon";
import { useTheme } from "../context/theme";
import { randomName } from "../lib/utils";
import type { TextualTheme } from "../types";
import { useDialogContext } from "@corvu/popover";

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
			class="inline-flex items-center text-center size-full font-bold rounded text-sm"
			{...props}
			onClick={handleCloning}
		>
			<Icon icon="mdi:content-copy" />
			Clone
		</button>
	);
};

const CLONE_HOLD_TIME = 1000; // milliseconds

const CloneTheme: Component<JSX.ButtonHTMLAttributes<HTMLButtonElement>> = (
	props,
) => {
	const { data, selectedTheme, selectTheme } = useTheme();
	const [isHolding, setIsHolding] = createSignal(false);

	const handleCloning = () => {
		const cur: TextualTheme = { ...selectedTheme(), source: "user" };
		cur.name = `${cur.name.replace(/-clone(-\w+)?$/, "")}-clone`;
		if (data.has(cur.name)) cur.name = `${cur.name}-${randomName()}`;

		batch(() => {
			data.set(cur.name, cur);
			selectTheme(cur.name);
		});
	};

	const [isMobile, setIsMobile] = createSignal(false);
	onMount(() => setIsMobile(window.matchMedia("(max-width: 1280px)").matches));

	const DesktopButton = () => (
		<button
			type="button"
			class="btn btn-ghost btn-sm bg-bottom m-2 mx-4 tooltip"
			classList={{ "after:opacity-0!": isHolding() }}
			{...props}
			onMouseDown={() => {
				setIsHolding(true);
				document.addEventListener(
					"mouseup",
					() => {
						setIsHolding(false);
					},
					{ once: true },
				);
				setTimeout(() => {
					if (isHolding()) handleCloning();
				}, CLONE_HOLD_TIME);
			}}
			style={{
				"background-size": "100% 200%",
			}}
		>
			<span
				class="tooltip-content text-xs motion-duration-200"
				classList={{ "motion-opacity-out-0": isHolding() }}
			>
				(hold)
			</span>
			<Icon class="size-6" icon="mdi:content-copy" />
			{!isHolding() ? "Clone Theme" : "Cloning..."}
		</button>
	);

	const MobileButton = () => (
		<button
			type="button"
			class="btn btn-primary btn-sm bg-bottom m-2 mx-4"
			{...props}
			onClick={handleCloning}
		>
			<Icon class="size-6" icon="mdi:content-copy" />
			Clone Theme
		</button>
	);

	return (
		<Show when={isMobile()} fallback={<DesktopButton />}>
			<MobileButton />
		</Show>
	);
};

export default CloneTheme;
