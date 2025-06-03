import type { Component, JSX } from "solid-js";
import Icon from "~/components/ui/icon";
import { useTheme } from "../context/theme";
import { VERSION_KEY } from "../data/themes";
import type { TextualTheme } from "../types";

const ImportThemes: Component<JSX.HTMLAttributes<HTMLLabelElement>> = (
	props,
) => {
	const { data } = useTheme();

	async function handleFileImport(e: Event) {
		const inputEl = e.target as EventTarget & HTMLInputElement;
		try {
			const files = inputEl.files!;
			const promises: Promise<string>[] = [];
			if (files.length > 0)
				for (const file of files)
					if (file.type === "application/json")
						if (file.name.includes(String(VERSION_KEY())))
							promises.push(file.text());
			const exportedFiles = await Promise.all(promises);
			if (exportedFiles.length > 0) {
				for (const exported of exportedFiles) {
					const themes = JSON.parse(exported) as TextualTheme[];
					for (const theme of themes) data.set(theme.name, theme);
				}
			}
		} catch (e) {
			console.error(e);
		}
	}

	return (
		<label
			class="inline-flex size-full items-center rounded text-center font-bold text-sm"
			{...props}
		>
			<input
				accept="application/json"
				hidden
				multiple
				onChange={handleFileImport}
				type="file"
			/>
			<Icon icon="mdi:file-import-outline" />
			Import
		</label>
	);
};

export default ImportThemes;
