import { cn } from "@util";
import rehypeHighlight from "rehype-highlight";
import type { JSX } from "solid-js";
import { type Component, Show, splitProps } from "solid-js";
import { SolidMarkdown, type SolidMarkdownOptions } from "solid-markdown";
import CopyButton from "./copy";
import Icon from "./icon";

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
		<Show fallback={<Markdown />} when={local.details}>
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
