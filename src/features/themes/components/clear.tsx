import { action, useSubmission } from "@solidjs/router";
import type { Component, JSX } from "solid-js";
import ActionDialog from "~/components/ui/action-dialog";
import Icon from "~/components/ui/icon";
import { useTheme } from "../context/theme";

const ClearThemes: Component<JSX.HTMLAttributes<HTMLButtonElement>> = (
	props,
) => {
	const { data, selectTheme, firstThemeName } = useTheme();
	const clearThemes = action(async () => {
		await Promise.resolve(selectTheme(firstThemeName));
		for (const [name] of data
			.entries()
			.filter(([, theme]) => theme.source === "user"))
			data.delete(name);
	}, "clearThemes");
	const submission = useSubmission(clearThemes);

	return (
		<ActionDialog>
			<ActionDialog.Trigger
				class="inline-flex size-full items-center rounded text-center font-bold text-error"
				{...props}
			>
				<Icon icon="mdi:trash-can-outline" />
				Trash themes
			</ActionDialog.Trigger>
			<ActionDialog.Portal>
				<ActionDialog.Overlay />
				<ActionDialog.Content class="flex flex-col items-center text-center">
					<ActionDialog.Close />
					<span class="flex flex-col gap-2">
						<h2 class="font-bold text-3xl">Trash Themes</h2>
						<span>
							<p>Are you sure you want to delete all user made themes?</p>
							<p class="text-error text-xs">
								This action is <b>PERMANENT</b> and cannot be undone.
							</p>
						</span>
						<form action={clearThemes} method="post">
							<ActionDialog.Close class="" tabIndex={-1}>
								<button
									class="btn btn-error btn-lg size-full"
									disabled={submission.pending}
									type="submit"
								>
									{submission.pending ? "..." : "DELETE"}
								</button>
							</ActionDialog.Close>
						</form>
					</span>
				</ActionDialog.Content>
			</ActionDialog.Portal>
		</ActionDialog>
	);
};

export default ClearThemes;
