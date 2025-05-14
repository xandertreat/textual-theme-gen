import type { Component, JSX } from "solid-js";
import ActionDialog from "~/components/ui/action-dialog";
import Icon from "~/components/ui/icon";
import { useTheme } from "../context/theme";

const ThemeReset: Component<JSX.HTMLAttributes<HTMLButtonElement>> = (
	props,
) => {
	const { resetData } = useTheme();

	return (
		<ActionDialog>
			<ActionDialog.Trigger class="inline-flex items-center" {...props}>
				<Icon class="size-full" icon="mdi:alert" />
				Reset data
			</ActionDialog.Trigger>
			<ActionDialog.Portal>
				<ActionDialog.Overlay />
				<ActionDialog.Content class="flex flex-col items-center text-center">
					<ActionDialog.Close />
					<span class="flex flex-col gap-2">
						<h2 class="text-3xl font-bold">Reset Data</h2>
						<span>
							<p>Are you sure you want to reset your data to default?</p>
							<p class="text-error text-xs">
								This action is <b>PERMANENT</b> and cannot be undone.
							</p>
						</span>
						<ActionDialog.Close tabIndex={-1} class="">
							<button
								onClick={() => resetData()}
								type="button"
								class="size-full btn btn-error"
							>
								RESET
							</button>
						</ActionDialog.Close>
					</span>
				</ActionDialog.Content>
			</ActionDialog.Portal>
		</ActionDialog>
	);
};

export default ThemeReset;
