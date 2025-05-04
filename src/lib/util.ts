import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges and combines class names conditionally.
 *
 * @param inputs - An array of class values to be merged. Each class value can be a string,
 *                 object, or array as supported by `clsx`.
 * @returns A single string with all the class names merged using Tailwind's `twMerge`.
 *
 * This function uses `clsx` for conditional class name logic and `twMerge` to handle
 * Tailwind CSS class name merging, ensuring no duplicate Tailwind classes.
 *
 * @example
 * ```ts
 * cn('btn', { 'btn-primary': isActive }, ['mt-4', 'px-2']);
 * // Result: 'btn btn-primary mt-4 px-2'
 * ```
 */
export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};
