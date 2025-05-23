import { A } from "@solidjs/router";
import CodeBlock from "@ui/codeblock";
import GitHub from "~/components/github";
import AppThemeController, { AppThemeProvider } from "~/context/app-theme";
import ThemeManagement from "~/features/themes/components/management";

// State
import { ThemeProvider } from "~/features/themes/context/theme";

const Index = () => {
	return (
		<AppThemeProvider>
			<div class="flex max-h-fit min-h-screen w-full flex-col items-center gap-2 bg-base-100 px-10 py-5 text-center">
				<span class="mb-7 text-shadow-2xs">
					<h1 class="font-bold text-5xl">Textual Theme Generator</h1>
					<sub class="text-base">
						by{" "}
						<A
							class="text-blue-400 underline"
							href="https://github.com/xandertreat"
						>
							Xander Treat
						</A>
					</sub>
					<AppThemeController />
					<GitHub />
				</span>
				<h2 class="font-bold text-4xl">How-to</h2>
				<span class="mb-10 flex flex-col gap-2">
					<h3 class="inline-flex gap-2 text-3xl">
						<p class="font-semibold">#1.</p>
						Import required dependencies
					</h3>
					{/* <CodeBlock lang="python" code={"from textual import theme"} /> */}
				</span>
				<span class="mb-10 flex flex-col gap-2">
					<h3 class="inline-flex gap-2 place-self-center text-3xl">
						<p class="font-semibold">#2.</p>
						Create
					</h3>
					<ThemeManagement />
				</span>
			</div>
		</AppThemeProvider>
	);
};

export default Index;
