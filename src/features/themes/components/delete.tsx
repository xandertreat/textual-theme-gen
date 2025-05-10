import type { Component, JSX } from "solid-js";
import Icon from "~/components/ui/icon";
import { useTheme } from "../context/theme";
import { action, useSubmission, useAction } from "@solidjs/router";
import ActionDialog from "~/components/ui/action-dialog";

interface DeleteThemeProps extends JSX.HTMLAttributes<HTMLButtonElement> {
	theme: string;
}

const DeleteTheme: Component<DeleteThemeProps> = (props) => {
	const { themeData: data, currentTheme, updateCurrentTheme } = useTheme();

	return (
		<ActionDialog>
			<ActionDialog.Trigger data-tip="Delete" {...props}>
				<Icon class="size-full" icon="mdi:trash-can-outline" />
			</ActionDialog.Trigger>
			<ActionDialog.Portal>
				<ActionDialog.Overlay class="absolute inset-0 w-screen h-screen bg-black opacity-50 motion-duration-200 motion-ease-in-out motion-opacity-in-0" />
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
									const el = document.querySelector(
										`#theme-${props.theme}-option`,
									)!;
									el.classList.remove("motion-duration-1000/opacity");
									el.classList.add("motion-opacity-out-0");
									el.classList.add("motion-translate-x-out-50");
									setTimeout(() => {
										if (currentTheme.name === props.theme && data.size >= 1)
											updateCurrentTheme(data.get([...data.keys()][0])!);
										data.delete(props.theme);
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
