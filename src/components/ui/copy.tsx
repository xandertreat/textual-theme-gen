import type { JSX } from "solid-js";
import { type Component, createSignal, splitProps } from "solid-js";

import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
gsap.registerPlugin(MorphSVGPlugin);

type CopyStatus = "ready" | "success" | "error";
enum CopyStatusLabel {
	ready = "Copy",
	success = "Copied!",
	error = "Failed.",
}

const QUERY_SELECTOR = "path";

interface CopyButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
	code: string;
}

const CopyButton: Component<CopyButtonProps> = (props) => {
	const [local, rest] = splitProps(props, ["code"]);
	const [status, setStatus] = createSignal<CopyStatus>("ready");

	let curPath!: SVGPathElement;
	let copyPath!: SVGPathElement;
	let successPath!: SVGPathElement;
	let errorPath!: SVGPathElement;

	const handleClick = async () => {
		if (status() !== "ready") return;
		try {
			await navigator.clipboard.writeText(local.code);
			setStatus("success");
			gsap.to(curPath, {
				duration: 0.2,
				morphSVG: successPath,
			});
		} catch {
			setStatus("error");
			gsap.to(curPath, {
				duration: 0.2,
				morphSVG: errorPath,
			});
		} finally {
			setTimeout(() => {
				gsap.to(curPath, {
					duration: 0.2,
					morphSVG: copyPath,
				});
				setStatus("ready");
			}, 1500);
		}
	};

	return (
		<button
			{...rest}
			aria-label={CopyStatusLabel[status()]}
			classList={{
				"tooltip-info opacity-10 hover:text-info hover:opacity-100 group-hover:opacity-70":
					status() === "ready",
				"tooltip-open tooltip-success text-success": status() === "success",
				"tooltip-open tooltip-error text-error": status() === "error",
			}}
			data-tip={CopyStatusLabel[status()]}
			onClick={handleClick}
			type="button"
		>
			{/* Button icon */}
			<IconPixelarticonsSectionCopy
				class="-scale-100 active:-scale-90 motion-duration-300 motion-ease-in motion-opacity-out-100 size-full rotate-180 opacity-0 transition-[scale] duration-150 ease-in-out"
				ref={(el) => {
					curPath = el.querySelector<SVGPathElement>(QUERY_SELECTOR)!;
				}}
			/>
			{/* Morph targets */}
			<IconPixelarticonsSectionCopy
				class="hidden"
				ref={(el) => {
					copyPath = el.querySelector<SVGPathElement>(QUERY_SELECTOR)!;
				}}
			/>
			<IconMaterialSymbolsCheckRounded
				class="hidden"
				ref={(el) => {
					successPath = el.querySelector<SVGPathElement>(QUERY_SELECTOR)!;
				}}
			/>
			<IconMdiClose
				class="hidden"
				ref={(el) => {
					errorPath = el.querySelector<SVGPathElement>(QUERY_SELECTOR)!;
				}}
			/>
		</button>
	);
};

export default CopyButton;
