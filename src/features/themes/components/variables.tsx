import { type Component, type JSX, createMemo, splitProps } from "solid-js";
import ActionDialog from "~/components/ui/action-dialog";
import { useTheme } from "../context/theme";

const VariablesManagement: Component<JSX.HTMLAttributes<HTMLDivElement>> = (
	props,
) => {
	const { selectedTheme } = useTheme();
	const canModify = createMemo(() => selectedTheme().source === "user");

	return (
		<ActionDialog>
			<span class="flex flex-col items-center gap-1">
				<ActionDialog.Trigger
					class={
						"aspect-square size-12 rounded-full bg-neutral font-black text-2xl text-neutral-content transition-[scale] duration-200 not-disabled:hover:scale-105"
					}
					disabled={!canModify()}
				>
					?
				</ActionDialog.Trigger>
				<p>Variables</p>
			</span>
			<ActionDialog.Portal>
				<ActionDialog.Overlay />
				<ActionDialog.Content
					class="flex flex-col items-center border-0 bg-primary text-center text-primary-content "
					{...props}
				>
					<ActionDialog.Close />
				</ActionDialog.Content>
			</ActionDialog.Portal>
		</ActionDialog>
	);
};

export default VariablesManagement;
