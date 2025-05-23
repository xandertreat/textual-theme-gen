import type { JSX } from "solid-js";
import { type Component, createSignal, mergeProps, splitProps } from "solid-js";
import Icon from "./icon";

import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
gsap.registerPlugin(MorphSVGPlugin);

type CopyStatus = "ready" | "success" | "error";
enum CopyStatusLabel {
	ready = "Copy",
	success = "Copied!",
	error = "Failed.",
}

const DEFAULT_ICONS = {
	copyIcon: "pixelarticons:section-copy",
	successIcon: "material-symbols:check-rounded",
	errorIcon: "charm:cross",
};

const QUERY_SELECTOR = "path";

interface CopyButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
	code: string;
	copyIcon?: string;
	successIcon?: string;
	errorIcon?: string;
}

const CopyButton: Component<CopyButtonProps> = (passed) => {
	const props = mergeProps(DEFAULT_ICONS, passed);
	const [local, rest] = splitProps(props, [
		"code",
		"copyIcon",
		"successIcon",
		"errorIcon",
	]);
	const [status, setStatus] = createSignal<CopyStatus>("ready");
	let curPath!: SVGPathElement;
	let successPath!: SVGPathElement;
	let errorPath!: SVGPathElement;
	let copyPath!: SVGPathElement;

	const handleClick = async () => {
		if (status() !== "ready") return;
		try {
			await navigator.clipboard.writeText(local.code);
			setStatus("success");
			gsap.to(curPath, { duration: 0.2, morphSVG: successPath });
		} catch {
			setStatus("error");
			gsap.to(curPath, { duration: 0.2, morphSVG: errorPath });
		} finally {
			setTimeout(() => {
				gsap.to(curPath, { duration: 0.2, morphSVG: copyPath });
				setStatus("ready");
			}, 1500);
		}
	};

	return (
		<button
			type="button"
			class="tooltip tooltip-right absolute right-2 h-6 w-fit translate-y-1/4 transition duration-200 ease-in-out hover:cursor-pointer"
			{...rest}
			classList={{
				"tooltip-info opacity-10 hover:text-info hover:opacity-100 group-hover:opacity-70":
					status() === "ready",
				"tooltip-open tooltip-success text-success": status() === "success",
				"tooltip-open tooltip-error text-error": status() === "error",
			}}
			onClick={handleClick}
			data-tip={CopyStatusLabel[status()]}
		>
			{/* Button icon */}
			<Icon
				ref={(el) => {
					curPath = el.querySelector<SVGPathElement>(QUERY_SELECTOR)!;
				}}
				icon={local.copyIcon}
				class="-scale-100 active:-scale-90 motion-duration-300 motion-ease-in motion-opacity-out-100 size-full rotate-180 opacity-0 transition-[scale] duration-150 ease-in-out"
			/>
			{/* Morph targets */}
			<Icon
				class="hidden"
				ref={(el) => {
					copyPath = el.querySelector<SVGPathElement>(QUERY_SELECTOR)!;
				}}
				icon={local.copyIcon}
			/>
			<Icon
				class="hidden"
				ref={(el) => {
					successPath = el.querySelector<SVGPathElement>(QUERY_SELECTOR)!;
				}}
				icon={local.successIcon}
			/>
			<Icon
				class="hidden"
				ref={(el) => {
					errorPath = el.querySelector<SVGPathElement>(QUERY_SELECTOR)!;
				}}
				icon={local.errorIcon}
			/>
		</button>
	);
};

export default CopyButton;
