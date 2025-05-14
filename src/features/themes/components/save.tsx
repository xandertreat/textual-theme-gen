import { action, useSubmission } from "@solidjs/router";
import { type Component, type JSX, createSignal } from "solid-js";
import ActionDialog from "~/components/ui/action-dialog";
import Icon from "../../../components/ui/icon";
import { useTheme } from "../context/theme";

const SaveTheme: Component<JSX.ButtonHTMLAttributes<HTMLButtonElement>> = (
	props,
) => {
	const { data, selectedTheme, modifyTheme } = useTheme();
	const [isValid, setIsValid] = createSignal(true);

	const saveAction = action(async (formData: FormData) => {
		try {
			const name = formData
				.get("name")!
				.toString()
				.normalize()
				.trim()
				.toLocaleLowerCase()
				.matchAll(/[a-zA-Z]+/g)
				.toArray()
				.join("-");
			console.log(`Saving theme "${name}"`);
			modifyTheme("name", name);
			modifyTheme("source", "user");
			data.set(name, JSON.parse(JSON.stringify(selectedTheme)));
			console.log(`Saved theme "${name}"!`);
		} catch (error) {
			console.error(error);
			return { error: true };
		}
	}, "saveThemeAction");
	const submission = useSubmission(saveAction);

	return (
		<ActionDialog>
			<ActionDialog.Trigger
				type="button"
				class="btn btn-success btn-sm m-2 mx-4"
				{...props}
			>
				<Icon class="size-6" icon="mdi:plus" />
				Save Theme
			</ActionDialog.Trigger>
			<ActionDialog.Portal>
				<ActionDialog.Overlay />
				<ActionDialog.Content class="flex flex-col items-center text-center">
					<ActionDialog.Close />
					<span class="flex flex-col gap-2">
						<span class="text-xs">
							<h2 class="text-3xl font-bold">Save Theme</h2>
							<sub class="opacity-50">
								(This will override any existing theme with the same name)
							</sub>
						</span>
						<form
							class="text-neutral flex flex-col gap-2"
							method="post"
							action={saveAction}
						>
							<label class="label validator input input-bordered size-fit text-neutral-content">
								<p class="cursor-default select-none opacity-50">Theme Name</p>
								<input
									type="text"
									name="name"
									value={selectedTheme.name}
									onInput={(e) => {
										setIsValid(
											e.target.validity.valid && e.target.value !== "",
										);
									}}
									placeholder="Theme name"
									class="peer"
									pattern="[a-zA-Z]+(?:-[a-zA-Z]+)*"
									title="Only letters, separated by single spaces, underscores or hyphens."
									required
								/>
								<Icon
									class="text-sm text-error hidden peer-invalid:block size-6"
									icon="mdi:alert"
								/>
								<Icon
									class="text-sm text-success hidden peer-valid:block size-6"
									icon="mdi:check"
								/>
							</label>
							<p class="validator-hint hidden -mt-1.5">
								Invalid format. Only letters & separators allowed.
							</p>
							<ActionDialog.Close
								tabIndex={-1}
								class=""
								classList={{
									"pointer-events-none": submission.pending || !isValid(),
								}}
							>
								<button
									type="submit"
									class="size-full btn btn-success"
									disabled={submission.pending || !isValid()}
								>
									{submission.pending ? "..." : "Save"}
								</button>
							</ActionDialog.Close>
						</form>
					</span>
				</ActionDialog.Content>
			</ActionDialog.Portal>
		</ActionDialog>
	);
};

export default SaveTheme;
