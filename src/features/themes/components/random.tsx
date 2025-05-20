import gsap from "gsap";
import type { Component, JSX } from "solid-js";
import { batch } from "solid-js";
import Icon from "../../../components/ui/icon";
import { useTheme } from "../context/theme";
import { genRandomTheme } from "../lib/utils";

const RandomTheme: Component<JSX.ButtonHTMLAttributes<HTMLButtonElement>> = (
	props,
) => {
	const { data, selectTheme } = useTheme();
	let old: gsap.core.Tween | undefined;
	let die!: SVGSVGElement;

	return (
		<button
			type="button"
			data-tip="Random"
			class="btn btn-circle tooltip tooltip-top"
			onClick={() => {
				const randomTheme = genRandomTheme();
				const newName = randomTheme.name;
				batch(() => {
					data.set(newName, randomTheme);
					selectTheme(newName);
				});
				if (old) {
					old.kill();
					old = undefined;
				}
				old = gsap.to(die, {
					rotate: "+=random(360,3600)",
					ease: "expo.out",
					duration: 1,
				});
			}}
		>
			<Icon ref={die} class="size-6 motion-ease-out-cubic" icon="mdi:dice" />
		</button>
	);
};

export default RandomTheme;
