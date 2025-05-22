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

interface CloneThemeOptionProps
	extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {}

export const CloneThemeOption: Component<CloneThemeOptionProps> = (props) => {
	const { data, selectTheme, selectedTheme } = useTheme();

	return (
		<button
			type="button"
			class="btn btn-circle tooltip tooltip-top"
			data-tip="Clone"
			onClick={() => {
				const newName = `${selectedTheme().name}-cloned`;
				batch(() => {
					data.set(newName, { ...selectedTheme(), name: newName });
					selectTheme(newName);
				});
			}}
		>
			<Icon class="size-6" icon="mdi:content-copy" />
		</button>
	);
};

const CLONE_HOLD_TIME = 1000; // milliseconds

const CloneTheme: Component<JSX.ButtonHTMLAttributes<HTMLButtonElement>> = (
	props,
) => {
	const { data, selectedTheme, selectTheme } = useTheme();
	const [isHolding, setIsHolding] = createSignal(false);

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

	return (
		<Show when={isMobile()} fallback={<DesktopButton />}>
			<MobileButton />
		</Show>
	);
};

export default CloneTheme;
