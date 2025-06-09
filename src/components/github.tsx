import { A } from "@solidjs/router";
import Icon from "@xtreat/solid-iconify";
import type { Component, JSX } from "solid-js";

const AUTHOR = "xandertreat";
const REPOSITORY_NAME = "textual-theme-gen";
const REPOSITORY_URL = `https://github.com/${AUTHOR}/${REPOSITORY_NAME}`;
const GitHub: Component<JSX.HTMLAttributes<HTMLAnchorElement>> = (props) => (
	<A
		aria-label="GitHub"
		class="tooltip tooltip-right btn btn-ghost btn-circle motion-duration-500 motion-ease-in-out motion-translate-x-in-[200%] motion-delay-500 -translate-x-full fixed top-1 right-1 z-1 fhd:size-11 size-6 p-0.5 md:size-9"
		data-tip="GitHub"
		href={REPOSITORY_URL}
		target="_blank"
		{...props}
	>
		<Icon class="size-full" icon="mdi:github" />
	</A>
);

export default GitHub;
