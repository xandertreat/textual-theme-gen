import { createMemo, onCleanup, type Component, type JSX } from "solid-js";
import Icon from "~/components/ui/icon";
import { useTheme } from "../context/theme";

const ExportThemes: Component<JSX.AnchorHTMLAttributes<HTMLAnchorElement>> = (
	props,
) => {
	const { data } = useTheme();

	const exportUri = createMemo(() => {
		const userThemes = [...data.values().filter((t) => t.source === "user")];
		if (userThemes.length === 0) return undefined;

		const json = JSON.stringify(userThemes);
		const blob = new Blob([json], { type: "application/json" });
		const uri = URL.createObjectURL(blob);

		onCleanup(() => URL.revokeObjectURL(uri));
		return uri;
	});

	const fileName = createMemo(
		() => `textual-themes-${(new Date()).toLocaleString()}`,
	);

	return (
		<a
			href={exportUri()}
			download={fileName()}
			class="inline-flex size-full items-center rounded text-center font-bold text-sm"
			classList={{
				"cursor-not-allowed opacity-50": !exportUri(),
			}}
			{...props}
		>
			<Icon icon="mdi:file-export-outline" />
			Export
		</a>
	);
};

export default ExportThemes;
