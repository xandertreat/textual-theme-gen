import { type Component, type JSX, createMemo } from "solid-js";
import ActionDialog from "~/components/ui/action-dialog";
import Icon from "~/components/ui/icon";
import { useTheme } from "~/features/themes/context/theme";

const NewColor: Component<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
	const { selectedTheme } = useTheme();
	const canModify = createMemo(() => selectedTheme().source === "user");

	return (
		<ActionDialog>
			<ActionDialog.Trigger
				class="btn m-2 mx-4 w-40 border-2 border-success text-success disabled:border-success/30 disabled:text-success/30"
				disabled={!canModify()}
			>
				<Icon class="size-5 " icon="mdi:plus-circle" />
				<p>Create Color</p>
			</ActionDialog.Trigger>
			<ActionDialog.Portal>
				<ActionDialog.Overlay />
				<ActionDialog.Content
					// {class="flex flex-col items-center border-0 bg-primary text-center text-primary-content "}
					{...props}
					class="pointer-events-none select-none border-0 bg-transparent text-center shadow-none"
				>
					{/* <ActionDialog.Close /> */}
					Coming soon...
				</ActionDialog.Content>
			</ActionDialog.Portal>
		</ActionDialog>
	);
};

export default NewColor;
