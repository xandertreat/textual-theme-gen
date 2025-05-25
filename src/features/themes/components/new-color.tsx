import { type Component, type JSX, createMemo, splitProps } from "solid-js";
import ActionDialog from "~/components/ui/action-dialog";
import Icon from "~/components/ui/icon";
import { useTheme } from "../context/theme";

const NewColor: Component<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
	const { selectedTheme } = useTheme();
	const canModify = createMemo(() => selectedTheme().source === "user");

	return (
		<ActionDialog>
			<span class="flex flex-col items-center gap-1">
				<ActionDialog.Trigger
					class={
						"flex aspect-square size-12 items-center justify-center rounded-full bg-success font-black text-2xl text-neutral-content transition-[scale] duration-200 not-disabled:hover:scale-105"
					}
					disabled={!canModify()}
				>
					<Icon class="text-success-content" icon="mdi:plus-thick" />
				</ActionDialog.Trigger>
				<p class="pointer-events-none select-none text-success">Create Color</p>
			</span>
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
