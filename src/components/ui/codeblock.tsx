import { cn } from "@util";
import Icon from "@xtreat/solid-iconify";
import type { JSX } from "solid-js";
import { type Component, Show, createMemo, splitProps } from "solid-js";
import CopyButton from "./copy";

// highlight.js configuration
// the component is flexible but the imports are not.
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
hljs.registerLanguage("python", python);
import "highlight.js/styles/github-dark.min.css";

interface CodeBlockProps extends JSX.HTMLAttributes<HTMLElement> {
	lang: string;
	code: string;
	copy?: boolean;
	details?: boolean;
	langIcon?: string;
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
	]);
	// DEFAULTS
	local.copy ??= true;
	local.details ??= true;
	local.langIcon ??= `logos:${local.lang}`;

	const Code = () => {
		const highlightedCode = createMemo(
			() => hljs.highlight(local.code, { language: local.lang }).value,
		);

		return (
			<div
				class="overflow-scroll bg-[#151B23] px-2 pt-2 pb-0.5 font-mono!"
				classList={{
					"rounded-md": !local.details,
					"rounded-br-md rounded-bl-md": local.details,
				}}
			>
				<Show when={!local.details && local.copy}>
					<CopyButton code={local.code} />
				</Show>
				<pre>
					<code {...rest} innerHTML={highlightedCode()} />
				</pre>
			</div>
		);
	};

	return (
		<Show fallback={<Code />} when={local.details}>
			<div
				class={cn(
					"group relative rounded-md border-2 border-transparent bg-[#0d1117] text-left text-neutral-content",
					local.class,
					local.classList,
				)}
			>
				<Show when={local.copy}>
					<CopyButton code={local.code} />
				</Show>
				<span class="inline-flex items-center justify-center gap-1.5 p-2 text-center align-middle">
					<Icon class="size-6" icon={local.langIcon} />
					<p aria-label={`Language: ${local.lang}`}>{local.lang}</p>
				</span>
				<Code />
			</div>
		</Show>
	);
};

export default CodeBlock;
