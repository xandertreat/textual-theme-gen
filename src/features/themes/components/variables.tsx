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
						"size-12 aspect-square rounded-full shadow-md not-disabled:hover:scale-105 transition-[scale] duration-200 font-black text-2xl bg-neutral text-neutral-content"
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
					class="flex flex-col items-center text-center bg-primary text-primary-content border-0 "
					{...props}
				>
					<ActionDialog.Close />
				</ActionDialog.Content>
			</ActionDialog.Portal>
		</ActionDialog>
	);
};

export default VariablesManagement;
