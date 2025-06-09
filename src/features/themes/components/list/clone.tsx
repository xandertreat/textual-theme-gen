import { useDialogContext } from "@corvu/popover";
import Icon from "@xtreat/solid-iconify";
import { type Component, type JSX, batch } from "solid-js";
import { useTheme } from "~/features/themes/context/theme";
import { randomName } from "~/features/themes/lib/utils";
import type { TextualTheme } from "~/features/themes/types";

interface CloneThemeOptionProps
	extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {}

export const CloneThemeOption: Component<CloneThemeOptionProps> = (props) => {
	const { data, selectedTheme, selectTheme } = useTheme();
	const { setOpen } = useDialogContext();

	const handleCloning = () => {
		const cur: TextualTheme = { ...selectedTheme(), source: "user" };
		cur.name = `${cur.name.replace(/-clone(-\w+)?$/, "")}-clone`;
		if (data.has(cur.name)) cur.name = `${cur.name}-${randomName()}`;

		setOpen(false);
		// need to defer the cloning to allow the dialog to close
		setTimeout(() => {
			batch(() => {
				data.set(cur.name, cur);
				selectTheme(cur.name);
			});
		});
	};

	return (
		<button
			class="inline-flex size-full items-center rounded text-center font-bold text-sm"
			type="button"
			{...props}
			onClick={handleCloning}
		>
			<Icon icon="mdi:content-copy" />
			Clone
		</button>
	);
};
