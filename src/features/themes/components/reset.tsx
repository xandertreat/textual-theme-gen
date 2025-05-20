import type { Component, JSX } from "solid-js";
import ActionDialog from "~/components/ui/action-dialog";
import Icon from "~/components/ui/icon";
import { useTheme } from "../context/theme";
import { action, useSubmission } from "@solidjs/router";
import { DEFAULT_THEMES } from "../data/themes";

const ThemeReset: Component<JSX.HTMLAttributes<HTMLButtonElement>> = (
	props,
) => {
	const { data, selectTheme, firstDefaultTheme } = useTheme();
	const resetData = action(async () => {
		for (const t of DEFAULT_THEMES()) data.set(t.name, t);
		await Promise.resolve(selectTheme(firstDefaultTheme()));
		for (const [name, t] of data.entries())
			if (t.source === "user") data.delete(name);
	}, "resetThemeData");
	const submission = useSubmission(resetData);

	return (
		<ActionDialog>
			<ActionDialog.Trigger
				class="inline-flex items-center text-center size-full text-error font-bold rounded"
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
						<h2 class="text-3xl font-bold">Reset Data</h2>
						<span>
							<p>Are you sure you want to reset your data to default?</p>
							<p class="text-error text-xs">
								This action is <b>PERMANENT</b> and cannot be undone.
							</p>
						</span>
						<form action={resetData} method="post">
							<ActionDialog.Close tabIndex={-1} class="">
								<button
									type="submit"
									class="size-full btn btn-error btn-lg"
									disabled={submission.pending}
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
