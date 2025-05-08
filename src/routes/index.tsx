import { A } from "@solidjs/router";
import CodeBlock from "@ui/codeblock";
import Preview from "~/components/preview";

const Index = () => {
	return (
		<div class="w-full max-h-fit min-h-screen flex flex-col items-center gap-2 text-center font-roboto **:!font-roboto px-10 py-5 bg-sky-100 text-slate-700">
			<span class="mb-7 text-shadow-2xs">
				<h1 class="text-5xl font-bold">Textual Theme Generator</h1>
				<sub class="text-base">
					by{" "}
					<A
						class="underline text-blue-400"
						href="https://github.com/xandertreat"
					>
						Xander Treat
					</A>
				</sub>
			</span>
			<h2 class="text-4xl font-bold">How-to</h2>
			<span class="flex flex-col gap-2">
				<h3 class="text-3xl inline-flex gap-2">
					<p class="font-semibold">#1.</p>
					Import required dependencies
				</h3>
				<CodeBlock lang="python" code={"from textual import theme"} />
				<Preview />
			</span>
		</div>
	);
};

export default Index;
