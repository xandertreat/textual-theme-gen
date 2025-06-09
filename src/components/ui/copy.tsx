import Icon from "@xtreat/solid-iconify";
import type { JSX } from "solid-js";
import { type Component, createSignal, mergeProps, splitProps } from "solid-js";

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

	let el!: HTMLButtonElement;

	const handleClick = async () => {
		if (status() !== "ready") return;
		const curPath = el.querySelector<SVGPathElement>(`#cur ${QUERY_SELECTOR}`)!;
		try {
			await navigator.clipboard.writeText(local.code);
			setStatus("success");
			gsap.to(curPath, {
				duration: 0.2,
				morphSVG: el.querySelector<SVGPathElement>(
					`#success ${QUERY_SELECTOR}`,
				)!,
			});
		} catch {
			setStatus("error");
			gsap.to(curPath, {
				duration: 0.2,
				morphSVG: el.querySelector<SVGPathElement>(`#error ${QUERY_SELECTOR}`)!,
			});
		} finally {
			setTimeout(() => {
				gsap.to(curPath, {
					duration: 0.2,
					morphSVG: el.querySelector<SVGPathElement>(
						`#copy ${QUERY_SELECTOR}`,
					)!,
				});
				setStatus("ready");
			}, 1500);
		}
	};

	return (
		<button
			{...rest}
			aria-label={CopyStatusLabel[status()]}
			class="tooltip tooltip-bottom absolute right-2 h-6 w-fit translate-y-1/4 transition duration-200 ease-in-out hover:cursor-pointer"
			classList={{
				"tooltip-info opacity-10 hover:text-info hover:opacity-100 group-hover:opacity-70":
					status() === "ready",
				"tooltip-open tooltip-success text-success": status() === "success",
				"tooltip-open tooltip-error text-error": status() === "error",
			}}
			onClick={handleClick}
			ref={el}
			type="button"
		>
			{/* Tooltip */}
			<span class="tooltip-content z-999">{CopyStatusLabel[status()]}</span>
			{/* Button icon */}
			<Icon
				class="-scale-100 active:-scale-90 motion-duration-300 motion-ease-in motion-opacity-out-100 size-full rotate-180 opacity-0 transition-[scale] duration-150 ease-in-out"
				icon={local.copyIcon}
				id="cur"
				// ref={(el) => {
				// 	curPath = el.querySelector<SVGPathElement>(QUERY_SELECTOR)!;
				// }}
			/>
			{/* Morph targets */}
			<Icon
				class="hidden"
				icon={local.copyIcon}
				id="copy"
				// ref={(el) => {
				// 	copyPath = el.querySelector<SVGPathElement>(QUERY_SELECTOR)!;
				// }}
			/>
			<Icon
				class="hidden"
				icon={local.successIcon}
				id="success"
				// ref={(el) => {
				// 	successPath = el.querySelector<SVGPathElement>(QUERY_SELECTOR)!;
				// }}
			/>
			<Icon
				class="hidden"
				icon={local.errorIcon}
				id="error"
				// ref={(el) => {
				// 	errorPath = el.querySelector<SVGPathElement>(QUERY_SELECTOR)!;
				// }}
			/>
		</button>
	);
};

export default CopyButton;
