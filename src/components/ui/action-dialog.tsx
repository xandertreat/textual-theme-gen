import Dialog from "@corvu/dialog";
import type {
	CloseProps,
	ContentProps,
	OverlayProps,
	PortalProps,
	RootProps,
	TriggerProps,
} from "@corvu/dialog";
import {
	type Component,
	type ComponentProps,
	type JSX,
	mergeProps,
} from "solid-js";
import type { Portal } from "solid-js/web";
import { cn } from "~/lib/util";
import Icon from "./icon";

const Root: Component<RootProps> = (props) => <Dialog {...props} />;

interface ActionTriggerProps
	extends TriggerProps,
		JSX.HTMLAttributes<HTMLButtonElement> {
	children?: JSX.Element;
}
const Trigger: Component<ActionTriggerProps> = (props) => (
	<Dialog.Trigger {...mergeProps({ "aria-label": "Open dialog" }, props)} />
);

interface SolidPortalProps extends PortalProps, ComponentProps<typeof Portal> {}
const SolidPortal: Component<SolidPortalProps> = (props) => (
	<Dialog.Portal {...props} />
);

interface ActionOverlayProps
	extends OverlayProps,
		JSX.HTMLAttributes<HTMLDivElement> {}
const Overlay: Component<ActionOverlayProps> = (props) => (
	<Dialog.Overlay
		{...mergeProps(
			{
				class:
					"fixed inset-0 z-50 bg-black opacity-50 h-full w-full motion-duration-200 motion-ease-in-out motion-opacity-in-0",
			},
			props,
		)}
	/>
);

interface ActionContentProps
	extends ContentProps,
		JSX.HTMLAttributes<HTMLDivElement> {}
const Content: Component<ActionContentProps> = (props) => (
	<Dialog.Content
		{...props}
		class={cn(
			"text-neutral-content fixed inset-0 z-50 min-w-80 m-auto size-fit rounded-lg border-2 border-neutral bg-neutral px-6 py-5 shadow-2xl motion-duration-200 motion-ease-in-out motion-opacity-in-0 motion-scale-in-95 motion-translate-y-in-[20%] data-closed:motion-opacity-out-0 motion-duration-150/opacity data-closed:motion-scale-out-95 data-closed:motion-translate-y-out-[-20%]",
			props.class,
		)}
	/>
);

interface ActionCloseProps
	extends CloseProps,
		JSX.HTMLAttributes<HTMLButtonElement> {
	children?: JSX.Element;
}
const Close: Component<ActionCloseProps> = (props) => (
	<Dialog.Close
		{...mergeProps(
			{
				class: "absolute top-2 right-2 btn btn-circle btn-ghost btn-xs",
				children: <Icon class="size-full" icon="mdi:close" />,
			},
			props,
		)}
	/>
);

const ActionDialog = Object.assign(Root, {
	Trigger,
	Portal: SolidPortal,
	Overlay,
	Content,
	Close,
});

export default ActionDialog;
