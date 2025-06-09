import gsap from "gsap";
import type { Component, JSX } from "solid-js";
import { batch } from "solid-js";
import { useTheme } from "~/features/themes/context/theme";
import { genRandomTheme } from "~/features/themes/lib/color";
import IconDice from "~icons/mdi/dice";

const RandomTheme: Component<JSX.ButtonHTMLAttributes<HTMLButtonElement>> = (
	props,
) => {
	const { data, selectTheme } = useTheme();
	let old: gsap.core.Tween | undefined;
	let die!: SVGSVGElement;

	return (
		<button
			aria-label="Generate Random Theme"
			class="btn btn-circle tooltip tooltip-top"
			data-tip="Random"
			onClick={() => {
				const randomTheme = genRandomTheme();
				const newName = randomTheme.name;
				batch(() => {
					data.set(newName, randomTheme);
					selectTheme(newName);
				});
				if (old) old.kill();
				old = gsap.to(die, {
					rotate: "+=random(360,3600)",
					ease: "expo.out",
					duration: 1,
				});
			}}
			type="button"
		>
			<IconDice class="motion-ease-out-cubic size-6" ref={die} />
		</button>
	);
};

export default RandomTheme;
