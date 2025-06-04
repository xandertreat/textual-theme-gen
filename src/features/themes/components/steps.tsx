import { type Component, type JSX, createMemo } from "solid-js";
import CodeBlock from "~/components/ui/codeblock";
import { useTheme } from "../context/theme";
import type { TextualTheme } from "../types";

// TODO: maybe force underscores for less confusion?

interface StepProps extends Component<JSX.HTMLAttributes<HTMLSpanElement>> {}

const ImportStep: StepProps = (props) => (
	<span class="mb-10 flex flex-col gap-2" {...props}>
		<h3 class="gap-2 text-nowrap text-lg">
			<b class="text-3xl">#1. </b>
			Import required dependencies
		</h3>
		<CodeBlock code={"from textual import theme"} lang="python" />
	</span>
);

/**
 * Generates a Python code string for defining a Textual Theme object.
 * @param theme The TextualTheme object.
 * @returns A string containing the Python code.
 */
export const getThemeCode = (theme: TextualTheme) => {
	const pythonFormattedName = theme.name.replaceAll(/-/g, "_");
	return `${pythonFormattedName}_theme = Theme(
	name="${theme.name}",
	primary="${theme.palette.primary.base.color}",
	secondary="${theme.palette.secondary.base.color}",
	accent="${theme.palette.accent.base.color}",
	background="${theme.palette.background.base.color}",
	foreground="${theme.palette.foreground.base.color}",
	surface="${theme.palette.surface.base.color}",
	panel="${theme.palette.panel.base.color}",
	success="${theme.palette.success.base.color}",
	warning="${theme.palette.warning.base.color}",
	error="${theme.palette.error.base.color}",
	dark=${theme.dark ? "True" : "False"},
	variables={},
)
`;
};

const DefinitionStep: StepProps = (props) => {
	const { selectedTheme } = useTheme();
	const code = createMemo(() => getThemeCode(selectedTheme()));

	return (
		<span class="mb-10 flex w-fit flex-col gap-2" {...props}>
			<h3 class="gap-2 text-nowrap text-3xl">
				<b>#3. </b>
				Define theme
			</h3>
			<CodeBlock code={code()} lang="python" />
		</span>
	);
};

/**
 * Generates a Python code string for registering and setting a theme in a Textual App.
 * @param theme The TextualTheme object.
 * @returns A string containing the Python code.
 */
export const getThemeRegistrationCode = (name: string) => {
	const pythonFormattedName = name.replaceAll(/-/g, "_");
	return `from textual.app import App

# YOUR APP CLASS HERE #
class MyApp(App):
    def on_mount(self) -> None:
        # Register the theme
        self.register_theme(${pythonFormattedName}_theme)

        # Set the app's theme (optional!)
        self.theme = "${pythonFormattedName}"
`;
};

const RegistrationStep: StepProps = (props) => {
	const { selectedTheme } = useTheme();
	const code = createMemo(() => getThemeRegistrationCode(selectedTheme().name));

	return (
		<span class="mb-10 flex w-[95vw] flex-col gap-2 md:w-fit" {...props}>
			<h3 class="gap-2 text-nowrap text-3xl">
				<b>#4. </b>
				Register theme
			</h3>
			<CodeBlock class="text-xs" code={code()} lang="python" />
		</span>
	);
};

const Congratulations: StepProps = (props) => (
	<h3 class="gap-2 text-nowrap text-3xl text-green-600">
		<b>#5. </b>
		Done!
		<br />
		Enjoy 🥳
	</h3>
);

export { ImportStep, DefinitionStep, RegistrationStep, Congratulations };
