import { cn } from "@util";
import type { JSX } from "solid-js";
import { type Component, Show, createMemo, splitProps } from "solid-js";
import IconPythonLang from "~icons/devicon/python";
import CopyButton from "./copy";

// highlight.js configuration
// the component is flexible but the imports are not.
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
hljs.registerLanguage("python", python);
import "highlight.js/styles/github-dark.min.css";

interface CodeBlockProps extends JSX.HTMLAttributes<HTMLElement> {
	code: string;
	copy?: boolean;
	details?: boolean;
}

const CodeBlock: Component<CodeBlockProps> = (props) => {
	const [local, rest] = splitProps(props, [
		"class",
		"classList",
		"copy",
		"details",
		"code",
	]);
	// DEFAULTS
	local.copy ??= true;
	local.details ??= true;

	const Code = () => {
		const highlightedCode = createMemo(
			() => hljs.highlight(local.code, { language: "python" }).value,
		);

		return (
			<div
				class="overflow-auto bg-[#151B23] p-2 font-mono!"
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
					<CopyButton
						class="tooltip tooltip-bottom absolute right-2 h-6 w-fit translate-y-1/4 transition duration-200 ease-in-out hover:cursor-pointer"
						code={local.code}
					/>
				</Show>
				<span class="inline-flex items-center justify-center gap-1.5 p-2 text-center align-middle text-base">
					<IconPythonLang />
					<p aria-label={"Language: python"}>python</p>
				</span>
				<Code />
			</div>
		</Show>
	);
};

export default CodeBlock;
