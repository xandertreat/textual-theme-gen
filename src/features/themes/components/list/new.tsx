import { action, useSubmission } from "@solidjs/router";
import {
	type Component,
	type JSX,
	Match,
	Show,
	Switch,
	batch,
	createMemo,
	createSignal,
} from "solid-js";
import ActionDialog from "~/components/ui/action-dialog";
import Icon from "~/components/ui/icon";
import { useTheme } from "~/features/themes/context/theme";
import { genRandomTheme } from "../../lib/color";

type InvalidReason = "malformed" | "empty" | "exists" | undefined;
interface NewThemeProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {}

const NewTheme: Component<NewThemeProps> = (props) => {
	const { data, selectTheme, selectedTheme } = useTheme();
	const [invalidReason, setInvalidReason] =
		createSignal<InvalidReason>("empty");
	const isValid = createMemo(() => invalidReason() === undefined);

	const newThemeAction = action(async (formData: FormData) => {
		try {
			const newName = formData
				?.get("name")
				?.toString()
				.trim()
				.normalize()
				.matchAll(/[a-zA-Z0-9]+/g)
				.toArray()
				.join("-")!;
			if (data.get(newName) !== undefined) return;
			const isDark = formData?.get("isDark")?.toString() === "on";
			const genTheme = genRandomTheme(isDark);
			genTheme.name = newName;
			batch(() => {
				data.set(newName, genTheme);
				selectTheme(newName);
			});
			setInvalidReason("exists");
		} catch (error) {
			console.error(error);
			return { error: true };
		}
	}, "newThemeAction");
	const submission = useSubmission(newThemeAction);

	let dialogClose!: HTMLButtonElement;

	return (
		<ActionDialog
			onOpenChange={(open) => {
				if (!open) setInvalidReason("empty");
			}}
		>
			<li class="motion-duration-1000/opacity motion-ease-in-out motion-duration-300 motion-opacity-in-0 -motion-translate-x-in-50 ">
				<ActionDialog.Trigger class="btn btn-ghost group flex h-fit w-full justify-normal gap-3.5 rounded-sm p-0 px-1 py-0 pl-2 font-semibold text-green-600">
					<Icon icon="mdi:plus" />
					New theme
				</ActionDialog.Trigger>
			</li>
			<ActionDialog.Portal>
				<ActionDialog.Overlay />
				<ActionDialog.Content class="flex flex-col items-center text-center">
					<ActionDialog.Close ref={dialogClose} />
					<span class="flex flex-col gap-2">
						<h2 class="font-bold text-3xl">New Theme</h2>
						<form
							action={newThemeAction}
							class="flex flex-col gap-2 "
							method="post"
						>
							<label
								aria-invalid={!isValid()}
								aria-selected={true}
								class="label input size-fit text-base-content"
								classList={{
									"input-success": isValid(),
									"input-error": !isValid(),
								}}
							>
								<p class="cursor-default select-none opacity-50">Theme Name</p>
								<input
									class="peer"
									name="name"
									onInput={(e) => {
										const input = e.target.value;

										const empty = !input.length || input.length === 0;
										if (empty) {
											setInvalidReason("empty");
											return;
										}

										const validInput = e.target.validity.valid && input !== "";
										if (!validInput) {
											setInvalidReason("malformed");
											return;
										}

										const overwriting = data.get(input) !== undefined;
										if (overwriting) {
											setInvalidReason("exists");
											return;
										}

										setInvalidReason(undefined);
									}}
									pattern="[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*"
									placeholder="Enter a name..."
									ref={(el) => setTimeout(() => el.focus(), 100)}
									required
									title="Only letters, separated by single spaces, underscores or hyphens."
									type="text"
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
									<Match when={invalidReason() === "empty"}>
										<p class="text-error text-xs">No name entered</p>
									</Match>
									<Match when={invalidReason() === "exists"}>
										<p class="text-error text-xs">Theme already exists!</p>
									</Match>
									<Match when={invalidReason() === "malformed"}>
										<p class="text-error text-xs">
											Invalid format. Only letters & separators allowed.
										</p>
									</Match>
								</Switch>
							</Show>
							<label class="label flex cursor-default! items-center justify-between gap-2">
								<span class="select-none">Is a dark theme?</span>
								<input
									class="checkbox rounded-md border border-neutral-content/30 text-green-600 transition-colors duration-150 hover:border-neutral-content/50"
									name="isDark"
									type="checkbox"
								/>
							</label>
							<button
								class="btn btn-success size-full"
								disabled={submission.pending || !isValid()}
								onClick={() => setTimeout(() => dialogClose.click())}
								type="submit"
							>
								{submission.pending ? "..." : "Create"}
							</button>
						</form>
					</span>
				</ActionDialog.Content>
			</ActionDialog.Portal>
		</ActionDialog>
	);
};

export default NewTheme;
