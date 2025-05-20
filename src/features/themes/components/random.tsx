import Popover from "@corvu/popover";
import type { Component, JSX } from "solid-js";
import { For, Show, batch, createMemo, mergeProps, onMount } from "solid-js";
import Icon from "../../../components/ui/icon";
import { useTheme } from "../context/theme";
import ThemeOption from "./option";
import ThemeReset from "./reset";
import SaveTheme from "./save";
import { genRandomTheme } from "../lib/utils";
import gsap from "gsap";

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
