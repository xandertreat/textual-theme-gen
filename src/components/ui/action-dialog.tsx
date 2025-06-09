import Dialog, { useContext } from "@corvu/dialog";
import type {
	CloseProps,
	ContentProps,
	OverlayProps,
	PortalProps,
	RootProps,
	TriggerProps,
} from "@corvu/dialog";
import Icon from "@xtreat/solid-iconify";
import {
	type Component,
	type ComponentProps,
	type JSX,
	mergeProps,
} from "solid-js";
import type { Portal } from "solid-js/web";
import { cn } from "~/lib/util";

const Root: Component<RootProps> = (props) => <Dialog {...props} />;
type ActionTriggerProps = TriggerProps &
	JSX.ButtonHTMLAttributes<HTMLButtonElement>;
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
					"fixed inset-0 z-50 bg-black opacity-50 h-full w-full motion-duration-200 motion-ease-in-out motion-opacity-in-0 flex items-end justify-center",
			},
			props,
		)}
	>
		<span class="motion-delay-[3000ms] motion-opacity-out-100 motion-duration-200 motion-ease-in-out mb-2 opacity-0">
			<sub class=" text-neutral-content/80 text-xs">
				{/* Mobile hint */}
				<p class="hidden xl:block">
					Press <kbd class="kbd kbd-xs text-neutral">ESC</kbd> or click{" "}
					<kbd class="kbd kbd-xs text-neutral">M1</kbd> outside to close
				</p>
				{/* Desktop hint */}
				<p class="block xl:hidden">Tap outside to close modal</p>
			</sub>
		</span>
	</Dialog.Overlay>
);

interface ActionContentProps
	extends ContentProps,
		JSX.HTMLAttributes<HTMLDivElement> {}
const Content: Component<ActionContentProps> = (props) => (
	<Dialog.Content
		{...props}
		class={cn(
			"motion-duration-200 motion-ease-in-out motion-opacity-in-0 motion-scale-in-95 motion-translate-y-in-[20%] data-closed:motion-opacity-out-0 motion-duration-150/opacity data-closed:motion-scale-out-95 data-closed:motion-translate-y-out-[-20%] fixed inset-0 z-50 m-auto size-fit min-w-80 rounded-lg border-2 border-neutral bg-zinc-600 px-6 py-5 text-neutral-content shadow-2xl",
			props.class,
		)}
	/>
);

type ActionCloseProps = CloseProps & JSX.HTMLAttributes<HTMLButtonElement>;
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
	useContext,
});

export default ActionDialog;
