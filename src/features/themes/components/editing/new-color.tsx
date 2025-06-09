import { type Component, type JSX, createMemo } from "solid-js";
import ActionDialog from "~/components/ui/action-dialog";
import { useTheme } from "~/features/themes/context/theme";
import IconPlusCircle from "~icons/mdi/plus-circle";

const NewColor: Component<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
	const { selectedTheme } = useTheme();
	const canModify = createMemo(() => selectedTheme().source === "user");

	return (
		<ActionDialog>
			<ActionDialog.Trigger
				class="btn m-2 mx-4 hd:w-40 border-2 border-green-600 text-green-600 disabled:border-green-600/30 disabled:text-green-600/30"
				disabled={!canModify()}
			>
				<IconPlusCircle class="size-5" />
				<p>Create Color</p>
			</ActionDialog.Trigger>
			<ActionDialog.Portal>
				<ActionDialog.Overlay />
				<ActionDialog.Content {...props} />
			</ActionDialog.Portal>
		</ActionDialog>
	);
};

export default NewColor;
