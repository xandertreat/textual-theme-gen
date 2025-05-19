import { useDialogContext } from "@corvu/popover";
import { type Component, type JSX, createEffect } from "solid-js";
import ActionDialog from "~/components/ui/action-dialog";
import Icon from "~/components/ui/icon";
import { useTheme } from "../context/theme";

interface DeleteThemeProps extends JSX.HTMLAttributes<HTMLButtonElement> {
	theme: string;
}

const DeleteTheme: Component<DeleteThemeProps> = (props) => {
	const { deleteTheme } = useTheme();
	const { contentRef } = useDialogContext();

	return (
		<ActionDialog>
			<ActionDialog.Trigger
				class="inline-flex items-center text-center size-full text-error font-bold rounded text-sm"
				{...props}
			>
				<Icon class="size-4" icon="mdi:trash-can-outline" />
				Delete theme
			</ActionDialog.Trigger>
			<ActionDialog.Portal>
				<ActionDialog.Overlay />
				<ActionDialog.Content class="flex flex-col items-center text-center">
					<ActionDialog.Close />
					<span class="flex flex-col gap-2">
						<h2 class="text-3xl font-bold">Delete Theme</h2>
						<span>
							<p>Are you sure you want to delete this theme?</p>
							<p class="text-error text-xs">
								This action is <b>PERMANENT</b> and cannot be undone.
							</p>
						</span>
						<ActionDialog.Close tabIndex={-1} class="">
							<button
								onClick={() => {
									contentRef()?.classList.add("opacity-0");
									const el = document.querySelector(
										`#theme-${props.theme}-option`,
									)!;
									el.classList.add("pointer-events-none");
									el.classList.remove("motion-duration-1000/opacity");
									el.classList.add("motion-opacity-out-0");
									el.classList.add("motion-translate-x-out-50");
									setTimeout(() => {
										deleteTheme(props.theme);
									}, 300);
								}}
								type="submit"
								class="size-full btn btn-error"
							>
								DELETE
							</button>
						</ActionDialog.Close>
					</span>
				</ActionDialog.Content>
			</ActionDialog.Portal>
		</ActionDialog>
	);
};

export default DeleteTheme;
