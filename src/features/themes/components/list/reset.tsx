import { action, useSubmission } from "@solidjs/router";
import Icon from "@xtreat/solid-iconify";
import type { Component, JSX } from "solid-js";
import ActionDialog from "~/components/ui/action-dialog";
import { useTheme } from "~/features/themes/context/theme";
import { DEFAULT_THEMES } from "~/features/themes/data/themes";

const ThemeReset: Component<JSX.HTMLAttributes<HTMLButtonElement>> = (
	props,
) => {
	const { data, selectTheme, firstThemeName } = useTheme();
	const resetData = action(async () => {
		for (const t of DEFAULT_THEMES()) data.set(t.name, t);
		await Promise.resolve(selectTheme(firstThemeName));
		for (const [name, t] of data.entries())
			if (t.source === "user") data.delete(name);
	}, "resetThemeData");
	const submission = useSubmission(resetData);

	return (
		<ActionDialog>
			<ActionDialog.Trigger
				class="inline-flex size-full items-center rounded text-center font-bold text-error"
				{...props}
			>
				<Icon icon="mdi:alert" />
				Reset data
			</ActionDialog.Trigger>
			<ActionDialog.Portal>
				<ActionDialog.Overlay />
				<ActionDialog.Content class="flex flex-col items-center text-center">
					<ActionDialog.Close />
					<span class="flex flex-col gap-2">
						<h2 class="font-bold text-3xl">Reset Data</h2>
						<span>
							<p>Are you sure you want to reset all data to defaults?</p>
							<p class="text-error text-xs">
								This action is <b>PERMANENT</b> and cannot be undone.
							</p>
						</span>
						<form action={resetData} method="post">
							<ActionDialog.Close class="" tabIndex={-1}>
								<button
									aria-label={submission.pending ? "..." : "RESET"}
									class="btn btn-error btn-lg size-full"
									disabled={submission.pending}
									type="submit"
								>
									{submission.pending ? "..." : "RESET"}
								</button>
							</ActionDialog.Close>
						</form>
					</span>
				</ActionDialog.Content>
			</ActionDialog.Portal>
		</ActionDialog>
	);
};

export default ThemeReset;
