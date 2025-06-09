import { A } from "@solidjs/router";
import type { Component, JSX } from "solid-js";
import IconGithub from "~icons/mdi/github";

const AUTHOR = "xandertreat";
const REPOSITORY_NAME = "textual-theme-gen";
const REPOSITORY_URL = `https://github.com/${AUTHOR}/${REPOSITORY_NAME}`;
const GitHub: Component<JSX.HTMLAttributes<HTMLAnchorElement>> = (props) => (
	<A
		aria-label="GitHub"
		class="tooltip tooltip-left btn btn-ghost btn-circle motion-duration-500 motion-ease-in-out motion-translate-x-in-[200%] motion-delay-500 -translate-x-full fixed top-1 right-1 z-1 fhd:size-11 size-6 p-0.5 md:size-9"
		data-tip="GitHub"
		href={REPOSITORY_URL}
		target="_blank"
		{...props}
	>
		<IconGithub class="size-full" />
	</A>
);

export default GitHub;
