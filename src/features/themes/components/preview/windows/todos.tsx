import { type Component, type JSX, createMemo } from "solid-js";
import { useTheme } from "~/features/themes/context/theme";
import { MUTED_ALPHA, getContrastText } from "~/features/themes/lib/color";

const StylingTooltip: Component<JSX.HTMLAttributes<HTMLSpanElement>> = (
	props,
) => (
	<span class="tooltip-content z-999 rounded-none text-justify" {...props} />
);

const Todos: Component<JSX.HTMLAttributes<HTMLElement>> = (props) => {
	const { selectedTheme } = useTheme();

	// colors
	const bg = createMemo(() => selectedTheme().palette.background.base.color);
	const bgSurface = createMemo(
		() => selectedTheme().palette.surface.base.color,
	);

	return (
		<div
			aria-hidden={true}
			class="relative inset-0 size-full overflow-hidden text-2xl leading-7 tracking-[-0.075em]"
			style={{
				color: bgSurface(),
			}}
		>
			{"╱".repeat(300).concat("\n").repeat(100)}
			<main
				class="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 flex size-full xs:size-9/10 hd:h-2/3 flex-col gap-2 px-9 py-7 hd:text-lg text-xs tracking-normal md:h-80 md:w-11/20"
				style={{
					"background-color": bg(),
				}}
				{...props}
			>
				<div class="mb-4 flex justify-between">
					<span
						class="tooltip-info tooltip font-bold"
						style={{
							color: selectedTheme().palette.foreground.base.color,
						}}
					>
						<StylingTooltip>
							<b>color:</b> $foreground
						</StylingTooltip>
						Today
					</span>
					<div class="flex justify-center gap-3.5 *:px-3.5">
						<span
							class="tooltip tooltip-info"
							style={{
								color: selectedTheme().palette.error.base.text,
								"background-color": selectedTheme().palette.error.base.muted,
							}}
						>
							<StylingTooltip>
								<b>background:</b> $error-muted
								<br />
								<b>color:</b> $text-error
							</StylingTooltip>
							1 overdue
						</span>
						<span
							class="tooltip tooltip-info"
							style={{
								color: selectedTheme().palette.success.base.text,
								"background-color": selectedTheme().palette.success.base.muted,
							}}
						>
							<StylingTooltip>
								<b>background:</b> $success-muted
								<br />
								<b>color:</b> $text-success
							</StylingTooltip>
							1 done
						</span>
					</div>
				</div>
				<div
					class="tooltip tooltip-bottom tooltip-info flex size-full flex-col"
					style={{
						"background-color": bgSurface(),
					}}
				>
					<StylingTooltip>
						<b>background:</b> $surface
						<br />
						<b>color:</b> $boost {MUTED_ALPHA * 100}%
					</StylingTooltip>
					<div
						class="tooltip tooltip-right tooltip-info flex size-full flex-col border-3 px-3.5 py-6 *:flex *:items-center *:gap-3 *:*:px-3 *:*:py-1"
						style={{
							"border-color": selectedTheme().palette.primary.base.color,
						}}
					>
						<StylingTooltip>
							<b>border:</b> solid $primary
						</StylingTooltip>
						<span
							class="tooltip tooltip-info font-black"
							style={{
								"background-color": selectedTheme().palette.primary.base.color,
							}}
						>
							<StylingTooltip>
								<b>background:</b> $primary
								<br />
								<b>color:</b> $text
							</StylingTooltip>
							<p
								class="tooltip tooltip-info tooltip-left"
								style={{
									color: selectedTheme().palette.panel["darken-2"].color,
									"background-color": selectedTheme().palette.panel.base.color,
								}}
							>
								<StylingTooltip>
									<b>background:</b> $panel
									<br />
									<b>color:</b> $panel-darken-2
								</StylingTooltip>
								X
							</p>

							<p
								style={{
									color: getContrastText(
										selectedTheme().palette.primary.base.color,
									).hexa(),
								}}
							>
								Buy milk
							</p>
						</span>
						<div>
							<span
								class="tooltip tooltip-info tooltip-left"
								style={{
									color: selectedTheme().palette.panel["darken-2"].color,
									"background-color": selectedTheme().palette.panel.base.color,
								}}
							>
								<StylingTooltip>
									<b>background:</b> $panel
									<br />
									<b>color:</b> $panel-darken-2
								</StylingTooltip>
								X
							</span>
							<span
								class="tooltip tooltip-right tooltip-info"
								style={{
									color: selectedTheme().palette.foreground.base.color,
								}}
							>
								<StylingTooltip>
									<b>color:</b> $foreground
								</StylingTooltip>
								Buy Bread
							</span>
						</div>
						<div>
							<span
								class="tooltip tooltip-info tooltip-left"
								style={{
									color: selectedTheme().palette.success.base.text,
									"background-color": selectedTheme().palette.panel.base.color,
								}}
							>
								<StylingTooltip>
									<b>background:</b> $panel
									<br />
									<b>color:</b> $text-success
								</StylingTooltip>
								X
							</span>
							<span
								class="tooltip tooltip-right tooltip-info"
								style={{
									color: selectedTheme().palette.foreground.base.color,
								}}
							>
								<StylingTooltip>
									<b>color:</b> $foreground
								</StylingTooltip>
								Go and vote
							</span>
						</div>
						<div>
							<span
								class="tooltip tooltip-info tooltip-left"
								style={{
									color: selectedTheme().palette.panel["darken-2"].color,
									"background-color": selectedTheme().palette.panel.base.color,
								}}
							>
								<StylingTooltip>
									<b>background:</b> $panel
									<br />
									<b>color:</b> $panel-darken-2
								</StylingTooltip>
								X
							</span>
							<span
								class="tooltip tooltip-right tooltip-info"
								style={{
									color: selectedTheme().palette.foreground.base.color,
								}}
							>
								<StylingTooltip>
									<b>color:</b> $foreground
								</StylingTooltip>
								Return package
							</span>
						</div>
					</div>
					<span
						class="tooltip tooltip-right tooltip-info border-3 p-6 text-left"
						style={{
							color: selectedTheme().palette.boost.base.muted,
							"border-color": selectedTheme().palette.boost.base.color,
						}}
					>
						<StylingTooltip>
							<b>border:</b> solid $boost
						</StylingTooltip>
						Add a task
					</span>
				</div>
				<div class="fhd:mt-7 inline-flex justify-between">
					<span
						class="tooltip tooltip-bottom tooltip-info font-black"
						style={{
							color: selectedTheme().palette.foreground.base.color,
						}}
					>
						<StylingTooltip>
							<b>color:</b> $foreground
						</StylingTooltip>
						History
					</span>
					<span
						class="tooltip tooltip-bottom tooltip-info px-3.5"
						style={{
							color: selectedTheme().palette.primary.base.text,
							"background-color": selectedTheme().palette.primary.base.muted,
						}}
					>
						<StylingTooltip>
							<b>background:</b> $primary-muted
							<br />
							<b>color:</b> $text-primary
						</StylingTooltip>
						4 items
					</span>
				</div>
			</main>
		</div>
	);
};

export default Todos;
