import Dialog from "@corvu/dialog";
import { type Component, type JSX, splitProps } from "solid-js";
import ActionDialog from "~/components/ui/action-dialog";
import { useTheme } from "../context/theme";

const Color: Component<
	JSX.ButtonHTMLAttributes<HTMLButtonElement> & { color: string }
> = (props) => {
	const { selectedTheme } = useTheme();

	return (
		<span class="flex flex-col items-center gap-1">
			<ActionDialog.Trigger
				class="size-12 aspect-square rounded-full border-2 border-solid border-neutral hover:scale-105 transition-[scale] duration-200"
				style={{
					"background-color":
						selectedTheme.palette[
							props.color as keyof typeof selectedTheme.palette
						].base.color,
					color:
						selectedTheme.palette[
							props.color as keyof typeof selectedTheme.palette
						].base.text,
				}}
				{...props}
			>
				a
			</ActionDialog.Trigger>
			<p>{props.color[0].toUpperCase() + props.color.slice(1)}</p>
		</span>
	);
};

const EditColor: Component<
	JSX.HTMLAttributes<HTMLDivElement> & { color: string }
> = (props) => {
	const [local, rest] = splitProps(props, ["color"]);

	return (
		<ActionDialog>
			<Color color={local.color} />
			<ActionDialog.Portal>
				<ActionDialog.Overlay />
				<ActionDialog.Content
					class="flex flex-col items-center text-center bg-primary text-primary-content border-0"
					{...rest}
				>
					<ActionDialog.Close />
					{/* edit here */}
				</ActionDialog.Content>
			</ActionDialog.Portal>
		</ActionDialog>
	);
};

export default EditColor;
