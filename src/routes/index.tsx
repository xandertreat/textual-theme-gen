import { A } from "@solidjs/router";
import CodeBlock from "@ui/codeblock";
import ThemeManagement from "~/features/themes/components/theme-management";

// State
import { ThemeProvider } from "~/features/themes/context/theme";

const Index = () => {
	return (
		<ThemeProvider>
			<div class="w-full max-h-fit min-h-screen flex flex-col items-center gap-2 text-center px-10 py-5 bg-base-100">
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
				<span class="flex flex-col gap-2 mb-10">
					<h3 class="text-3xl inline-flex gap-2">
						<p class="font-semibold">#1.</p>
						Import required dependencies
					</h3>
					<CodeBlock lang="python" code={"from textual import theme"} />
				</span>
				<span class="flex flex-col gap-2  mb-10">
					<h3 class="text-3xl inline-flex gap-2 place-self-center">
						<p class="font-semibold">#2.</p>
						Create
					</h3>
					<ThemeManagement />
				</span>
			</div>
		</ThemeProvider>
	);
};

export default Index;
