import { cn } from "@util";
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import rehypeHighlight from "rehype-highlight";
import type { JSX } from "solid-js";
import { type Component, Show, createSignal, splitProps } from "solid-js";
import { SolidMarkdown, type SolidMarkdownOptions } from "solid-markdown";
gsap.registerPlugin(MorphSVGPlugin);
import Icon from "./icon";

type CopyStatus = "ready" | "success" | "error";

enum CopyStatusLabel {
	ready = "Copy",
	success = "Copied!",
	error = "Failed.",
}

const COPY_ICON = "pixelarticons:section-copy";
const COPY_SUCCESS_ICON = "material-symbols:check-rounded";
const COPY_ERROR_ICON = "charm:cross";

const COPY_ICON_PROPS: Partial<JSX.SvgSVGAttributes<SVGSVGElement>> = {
	viewBox: "0 0 24 24",
	stroke: "currentColor",
	fill: "none",
	"stroke-width": "1",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
};

const QUERY_SELECTOR = "path";

interface CopyButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
	code: string;
}

const CopyButton: Component<CopyButtonProps> = (props) => {
	const [local, rest] = splitProps(props, ["code"]);
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
			class="tooltip tooltip-right tooltip-info absolute right-2 h-6 w-fit translate-y-1/4 transition duration-200 ease-in-out hover:cursor-pointer "
			classList={{
				"tooltip-info opacity-10 hover:text-info hover:opacity-100 group-hover:opacity-70":
					status() === "ready",
				"tooltip-open tooltip-success text-success": status() === "success",
				"tooltip-open tooltip-error text-error": status() === "error",
			}}
			onClick={handleClick}
			data-tip={CopyStatusLabel[status()]}
			{...rest}
		>
			{/* Button icon */}
			<Icon
				{...COPY_ICON_PROPS}
				ref={(el) => {
					curPath = el.querySelector<SVGPathElement>(QUERY_SELECTOR)!;
				}}
				icon={COPY_ICON}
				class="-scale-100 active:-scale-90 motion-duration-300 motion-ease-in motion-opacity-out-100 size-full rotate-180 opacity-0 transition-[scale] duration-150 ease-in-out"
			/>
			{/* Morph targets */}
			<Icon
				{...COPY_ICON_PROPS}
				class="hidden"
				ref={(el) => {
					copyPath = el.querySelector<SVGPathElement>(QUERY_SELECTOR)!;
				}}
				icon={COPY_ICON}
			/>
			<Icon
				{...COPY_ICON_PROPS}
				class="hidden"
				ref={(el) => {
					successPath = el.querySelector<SVGPathElement>(QUERY_SELECTOR)!;
				}}
				icon={COPY_SUCCESS_ICON}
			/>
			<Icon
				{...COPY_ICON_PROPS}
				class="hidden"
				ref={(el) => {
					errorPath = el.querySelector<SVGPathElement>(QUERY_SELECTOR)!;
				}}
				icon={COPY_ERROR_ICON}
			/>
		</button>
	);
};

interface CodeBlockProps extends JSX.HTMLAttributes<HTMLDivElement> {
	lang: string;
	code: string;
	copy?: boolean;
	details?: boolean;
	langIcon?: string;
	markdownProps?: Partial<SolidMarkdownOptions>;
}

const CodeBlock: Component<CodeBlockProps> = (props) => {
	const [local, rest] = splitProps(props, [
		"class",
		"classList",
		"copy",
		"details",
		"lang",
		"langIcon",
		"code",
		"markdownProps",
	]);
	// DEFAULTS
	local.copy ??= true;
	local.details ??= true;
	local.langIcon ??= `logos:${local.lang}`;
	const raw = `\`\`\`${local.lang}\n${local.code}\n\`\`\``;

	const Markdown = () => (
		<div
			class="overflow-hidden"
			classList={{
				"rounded-md": !local.details,
				"rounded-br-md rounded-bl-md": local.details,
			}}
		>
			<Show when={!local.details && local.copy}>
				<CopyButton code={local.code} />
			</Show>
			<SolidMarkdown {...local.markdownProps} rehypePlugins={[rehypeHighlight]}>
				{raw}
			</SolidMarkdown>
		</div>
	);

	return (
		<Show when={local.details} fallback={<Markdown />}>
			<div
				class={cn(
					"group relative rounded-md border-2 border-transparent bg-neutral text-left text-neutral-content",
					local.class,
					local.classList,
				)}
				{...rest}
			>
				<Show when={local.copy}>
					<CopyButton code={local.code} />
				</Show>
				<span class="inline-flex items-center justify-center gap-1.5 p-2 text-center align-middle">
					<Icon class="size-6" icon={local.langIcon} />
					<p aria-label={`Language: ${local.lang}`}>{local.lang}</p>
				</span>
				<Markdown />
			</div>
		</Show>
	);
};

export default CodeBlock;
