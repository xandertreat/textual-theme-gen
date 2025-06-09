import { type Component, type JSX, createMemo } from "solid-js";
import ActionDialog from "~/components/ui/action-dialog";
import { useTheme } from "~/features/themes/context/theme";
import IconMixerSettings from "~icons/mdi/mixer-settings";

const VariablesManagement: Component<JSX.HTMLAttributes<HTMLDivElement>> = (
	props,
) => {
	const { selectedTheme } = useTheme();
	const canModify = createMemo(() => selectedTheme().source === "user");

	return (
		<ActionDialog>
			<ActionDialog.Trigger
				class="btn m-2 mx-4 hd:w-40 border-2"
				disabled={!canModify()}
			>
				<IconMixerSettings class="size-5" />
				<p>Variables</p>
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

export default VariablesManagement;
