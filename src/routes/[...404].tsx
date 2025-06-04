import { A } from "@solidjs/router";

export default function NotFound() {
	return (
		<main class="flex h-screen w-screen flex-col items-center justify-center">
			<span class="text-center leading-tight">
				<h1 class="font-black text-[14rem] text-error">404</h1>
				<h2 class="font-light text-4xl ">Not Found</h2>
				<A class="link text-xl" href="/">
					Home
				</A>
			</span>
		</main>
	);
}
