import AppThemeSwitcher from "~/components/app-theme";
import Credit from "~/components/credit";
import GitHub from "~/components/github";
import ThemeManagement from "~/features/themes/components/management";
import {
	Congratulations,
	DefinitionStep,
	ImportStep,
	RegistrationStep,
} from "~/features/themes/components/steps";
import { ThemeProvider } from "~/features/themes/context/theme";

const Index = () => {
	return (
		<>
			<div class="flex max-h-fit min-h-screen w-full flex-col items-center gap-2 bg-base-100 px-10 py-5 text-center">
				<span class="mb-7 text-shadow-2xs">
					<AppThemeSwitcher />
					<h1 class="font-bold text-6xl">Textual Theme Generator</h1>
					<GitHub />
				</span>
				<h2 class="font-bold text-3xl md:text-4xl">How-to</h2>
				<ImportStep />
				<ThemeProvider>
					<span class="mb-10 flex flex-col gap-2">
						<h3 class="inline-flex gap-2 place-self-center text-3xl">
							<p class="font-semibold">#2.</p>
							Create
						</h3>
						<ThemeManagement />
					</span>
					<div class="flex flex-col items-center gap-5 lg:flex-row lg:items-start">
						<DefinitionStep />
						<span class="flex flex-col items-center">
							<RegistrationStep />
							<Congratulations />
						</span>
					</div>
				</ThemeProvider>
			</div>
			<Credit />
		</>
	);
};

export default Index;
