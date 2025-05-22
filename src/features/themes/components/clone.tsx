import { useDialogContext } from "@corvu/popover";
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

	const DesktopButton = () => (
		<button
			type="button"
			class="btn btn-ghost btn-sm tooltip m-2 mx-4 hidden bg-bottom xl:flex"
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
				class="tooltip-content motion-duration-200 text-xs"
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
