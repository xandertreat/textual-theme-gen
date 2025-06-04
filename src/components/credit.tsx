import { A } from "@solidjs/router";
import type { Component, JSX } from "solid-js";

const Credit: Component<JSX.HTMLAttributes<HTMLSpanElement>> = (props) => (
	<span
		class="my-4 inline-flex h-fit w-screen items-center justify-center gap-1.5 font-extralight text-neutral text-sm"
		{...props}
	>
		<p class="pointer-events-none select-none opacity-50">created by</p>
		<A class="link link-hover" href="https://github.com/xandertreat">
			Xander Treat
		</A>
	</span>
);

export default Credit;
