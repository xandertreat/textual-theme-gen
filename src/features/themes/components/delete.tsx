import { useDialogContext } from "@corvu/popover";
import { action } from "@solidjs/router";
import type { Component, JSX } from "solid-js";
import { batch, splitProps } from "solid-js";
import ActionDialog from "~/components/ui/action-dialog";
import Icon from "~/components/ui/icon";
import { useTheme } from "../context/theme";
import type { TextualTheme } from "../types";

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
						<form method="post" action={deleteTheme.with(local.theme)}>
							<ActionDialog.Close tabIndex={-1} class="">
								<button
									class="size-full btn btn-lg btn-error"
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
