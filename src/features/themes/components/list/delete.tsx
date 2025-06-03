import { useDialogContext } from "@corvu/popover";
import { action } from "@solidjs/router";
import type { Component, JSX } from "solid-js";
import { batch, splitProps } from "solid-js";
import ActionDialog from "~/components/ui/action-dialog";
import Icon from "~/components/ui/icon";
import { useTheme } from "~/features/themes/context/theme";
import type { TextualTheme } from "~/features/themes/types";

interface DeleteThemeProps extends JSX.HTMLAttributes<HTMLButtonElement> {
	theme: string;
}

const DeleteTheme: Component<DeleteThemeProps> = (props) => {
	const [local, rest] = splitProps(props, ["theme"]);
	const { data, selectTheme } = useTheme();
	const deleteTheme = action(async (theme: TextualTheme | string) => {
		const name = typeof theme === "string" ? theme : theme.name;
		await Promise.resolve(
			setTimeout(() => {
				const names = [...data.keys()];
				const nextSelected = (names.indexOf(local.theme) + 1) % names.length;
				batch(() => {
					selectTheme(names[nextSelected]);
					data.delete(name);
				});
			}, 300),
		);
	}, "deleteTheme");
	const { contentRef } = useDialogContext();

	return (
		<ActionDialog>
			<ActionDialog.Trigger
				class="inline-flex size-full items-center rounded text-center font-bold text-error text-sm"
				{...props}
			>
				<Icon icon="mdi:trash-can-outline" />
				Delete theme
			</ActionDialog.Trigger>
			<ActionDialog.Portal>
				<ActionDialog.Overlay />
				<ActionDialog.Content class="flex flex-col items-center text-center">
					<ActionDialog.Close />
					<span class="flex flex-col gap-2">
						<h2 class="font-bold text-3xl">Delete Theme</h2>
						<span>
							<p>Are you sure you want to delete this theme?</p>
							<p class="text-error text-xs">
								This action is <b>PERMANENT</b> and cannot be undone.
							</p>
						</span>
						<form action={deleteTheme.with(local.theme)} method="post">
							<ActionDialog.Close class="" tabIndex={-1}>
								<button
									class="btn btn-lg btn-error size-full"
									{...rest}
									onClick={() => {
										contentRef()?.classList.add("opacity-0");
										const el = document.querySelector(
											`#theme-${props.theme}-option`,
										)!;
										el.setAttribute("disabled", "");
										el.classList.add("pointer-events-none");
										el.classList.remove("motion-duration-1000/opacity");
										el.classList.add("motion-opacity-out-0");
										el.classList.add("motion-translate-x-out-50");
									}}
									type="submit"
								>
									DELETE
								</button>
							</ActionDialog.Close>
						</form>
					</span>
				</ActionDialog.Content>
			</ActionDialog.Portal>
		</ActionDialog>
	);
};

export default DeleteTheme;
