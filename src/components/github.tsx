import { A } from "@solidjs/router";
import type { Component, JSX } from "solid-js";
import Icon from "./ui/icon";

const AUTHOR = "xandertreat";
const REPOSITORY_NAME = "textual-theme-gen";
const REPOSITORY_URL = `https://github.com/${AUTHOR}/${REPOSITORY_NAME}`;
const GitHub: Component<JSX.HTMLAttributes<HTMLAnchorElement>> = (props) => (
	<A
		class="btn btn-ghost btn-circle fixed top-1 right-1 size-9 p-0.5 xl:size-11"
		href={REPOSITORY_URL}
		target="_blank"
		{...props}
	>
		<Icon icon="devicon:github" class="size-full" />
	</A>
);

export default GitHub;
