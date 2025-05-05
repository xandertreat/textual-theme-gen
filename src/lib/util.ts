import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using `clsx` and merges them with `tailwind-merge`.
 *
 * @param inputs - An array of class values to be combined and merged.
 * @returns A single merged class name string.
 */
export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};
