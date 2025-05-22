import { action, useSubmission } from "@solidjs/router";
import {
	type Component,
	type JSX,
	Match,
	Show,
	Switch,
	batch,
	createSignal,
	splitProps,
} from "solid-js";
import ActionDialog from "~/components/ui/action-dialog";
import Icon from "~/components/ui/icon";
import { useTheme } from "../context/theme";

interface RenameThemeProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	theme: string;
}

const RenameTheme: Component<RenameThemeProps> = (props) => {
	const [local, rest] = splitProps(props, ["theme"]);
	const { data, selectTheme, selectedTheme } = useTheme();
	const [isValid, setIsValid] = createSignal(false);
	const [invalidReason, setInvalidReason] = createSignal<
		"malformed" | "source" | "nodiff"
	>("nodiff");

	const renameAction = action(async (formData: FormData) => {
		try {
			const newName = formData
				?.get("name")
				?.toString()
				.trim()
				.normalize()
				.matchAll(/[a-zA-Z0-9]+/g)
				.toArray()
				.join("-")!;
			batch(() => {
				data.set(newName, { ...selectedTheme(), name: newName });
				selectTheme(newName);
				data.delete(local.theme);
			});
		} catch (error) {
			console.error(error);
			return { error: true };
		}
	}, "saveThemeAction");
	const submission = useSubmission(renameAction);

	return (
		<ActionDialog
			onOpenChange={(open) => {
				if (!open) setInvalidReason("nodiff");
			}}
		>
			<ActionDialog.Trigger
				class="inline-flex size-full items-center rounded text-center font-bold text-sm"
				{...props}
			>
				<Icon icon="mdi:pencil-outline" />
				Rename theme
			</ActionDialog.Trigger>
			<ActionDialog.Portal>
				<ActionDialog.Overlay />
				<ActionDialog.Content class="flex flex-col items-center text-center">
					<ActionDialog.Close />
					<span class="flex flex-col gap-2">
						<span class="text-xs">
							<h2 class="font-bold text-3xl">Rename Theme</h2>
							<sub class="opacity-50">
								(This will override any existing theme with the same name)
							</sub>
						</span>
						<form
							class="flex flex-col gap-2 text-neutral"
							method="post"
							action={renameAction}
						>
							<label
								class="label input size-fit text-base-content"
								classList={{
									"input-success": isValid(),
									"input-error": !isValid(),
								}}
								aria-invalid={!isValid()}
							>
								<p class="cursor-default select-none opacity-50">Theme Name</p>
								<input
									type="text"
									name="name"
									onInput={(e) => {
										const input = e.target.value;
										const validInput = e.target.validity.valid && input !== "";
										const overwriting = data.get(input);
										let reserved = false;
										if (overwriting) reserved = overwriting.source !== "user";
										const renaming = !(input === local.theme);
										setIsValid(validInput && !reserved && renaming);
										if (!renaming) setInvalidReason("nodiff");
										else if (overwriting) setInvalidReason("source");
										else setInvalidReason("malformed");
									}}
									value={local.theme}
									placeholder="Theme name"
									class="peer"
									pattern="[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*"
									title="Only letters, separated by single spaces, underscores or hyphens."
									required
								/>
								<Icon
									class="size-6 cursor-default text-error text-sm"
									classList={{
										hidden: isValid(),
										block: !isValid(),
									}}
									icon="mdi:alert"
								/>
								<Icon
									class="size-6 cursor-default text-sm text-success"
									classList={{
										hidden: !isValid(),
										block: isValid(),
									}}
									icon="mdi:check"
								/>
							</label>
							<Show when={!isValid()}>
								<Switch>
									<Match when={invalidReason() === "nodiff"}>
										<p class="text-error text-xs">New name isn't different</p>
									</Match>
									<Match when={invalidReason() === "source"}>
										<p class="text-error text-xs">
											No renaming included / preset themes.
										</p>
									</Match>
									<Match when={invalidReason() === "malformed"}>
										<p class="text-error text-xs">
											Invalid format. Only letters & separators allowed.
										</p>
									</Match>
								</Switch>
							</Show>
							<ActionDialog.Close
								tabIndex={-1}
								class=""
								classList={{
									"mt-1": isValid(),
									"pointer-events-none": submission.pending || !isValid(),
								}}
							>
								<button
									type="submit"
									class="btn btn-success size-full"
									disabled={submission.pending || !isValid()}
								>
									{submission.pending ? "..." : "Rename"}
								</button>
							</ActionDialog.Close>
						</form>
					</span>
				</ActionDialog.Content>
			</ActionDialog.Portal>
		</ActionDialog>
	);
};

export default RenameTheme;
