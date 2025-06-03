import gsap from "gsap";
import type { Component, JSX } from "solid-js";
import { batch } from "solid-js";
import Icon from "../../../components/ui/icon";
import { useTheme } from "../context/theme";
import { genRandomTheme } from "../lib/color";

const RandomTheme: Component<JSX.ButtonHTMLAttributes<HTMLButtonElement>> = (
	props,
) => {
	const { data, selectTheme } = useTheme();
	let old: gsap.core.Tween | undefined;
	let die!: SVGSVGElement;

	return (
		<button
			class="btn btn-circle tooltip tooltip-top"
			data-tip="Random"
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
			type="button"
		>
			<Icon class="motion-ease-out-cubic size-6" icon="mdi:dice" ref={die} />
		</button>
	);
};

export default RandomTheme;
