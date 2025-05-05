import { cn } from "@util";
import { animate, svg } from "animejs";
import rehypeHighlight from "rehype-highlight";
import type { JSX } from "solid-js";
import { type Component, Show, createSignal, splitProps } from "solid-js";
import { SolidMarkdown, type SolidMarkdownOptions } from "solid-markdown";
import Icon from "./icon";

interface CopyButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
	code: string;
}

const CopyButton: Component<CopyButtonProps> = (props) => {
	const [local, rest] = splitProps(props, ["code"]);
	const [label, setLabel] = createSignal("Copy");
	let svgCopy!: SVGSVGElement;
	let svgCheck!: SVGSVGElement;

	const handleClick = async () => {
		if (label() === "Copied") return;
		await navigator.clipboard.writeText(local.code);
		setLabel("Copied");

		const pathCopy = svgCopy.querySelector<SVGPathElement>("path")!;
		const pathCheck = svgCheck.querySelector<SVGPathElement>("path")!;

		const toCheck = svg.morphTo(pathCheck);
		const toCopy = svg.morphTo(pathCopy);

		animate(pathCopy, { d: toCheck, duration: 300, ease: "inOutQuad" });

		setTimeout(() => {
			animate(pathCopy, { d: toCopy, duration: 300, ease: "inOutQuad" });
			setLabel("Copy");
		}, 2000);
	};

	return (
		<button
			type="button"
			class="h-6 w-fit tooltip tooltip-right tooltip-info hover:cursor-pointer absolute right-2 translate-y-1/4 transition ease-in-out duration-200 opacity-10 group-hover:opacity-70 hover:opacity-100 hover:text-info"
			onClick={handleClick}
			data-tip={label()}
			{...rest}
		>
			<Icon ref={svgCheck} icon="mdi:check" class="size-full" />
			<Icon
				ref={svgCopy}
				icon="mdi:clipboard-multiple-outline"
				class="size-full transition-[scale] ease-in-out duration-150 active:scale-90 motion-duration-300 motion-ease-in motion-opacity-out-100 opacity-0"
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
	local.langIcon ??= `devicon:${local.lang}`;
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
					"bg-zinc-800 border-zinc-900/80 border-2 rounded-md text-left text-base-300 relative group",
					local.class,
					local.classList,
				)}
				{...rest}
			>
				<Show when={local.copy}>
					<CopyButton code={local.code} />
				</Show>
				<span class="inline-flex items-center justify-center text-center align-middle gap-1 p-2">
					<Icon class="size-6" icon={local.langIcon} />
					<p aria-label={`Language: ${local.lang}`}>{local.lang}</p>
				</span>
				<Markdown />
			</div>
		</Show>
	);
};

export default CodeBlock;
