import { createAsync } from "@solidjs/router";
import type { IOptions } from "sanitize-html";
import type { Component, JSX } from "solid-js";
import {
	ErrorBoundary,
	Show,
	Suspense,
	mergeProps,
	splitProps,
} from "solid-js";
import LRUCache from "~/lib/lru";

/* ────────────────────────────── Types ─────────────────────────── */

export type IconifySpecifier = `${Lowercase<string>}:${Lowercase<string>}`;
export type IconifySize = number | "auto" | "unset" | "none";
export type IconifyFlip = "horizontal" | "vertical" | "horizontal,vertical";
export type IconifyRotate = "90deg" | "180deg" | "270deg";

export interface IconifyApiParameters {
	icon: IconifySpecifier | string;
	color?: string;
	flip?: IconifyFlip;
	size?: IconifySize;
	rotate?: IconifyRotate;
	download?: boolean;
	box?: boolean;
}
export interface IconifyIconVisibility {
	showLoading?: boolean;
	showError?: boolean;
}

export type IconifyIconProps = JSX.SvgSVGAttributes<SVGSVGElement> &
	IconifyApiParameters &
	IconifyIconVisibility;

export interface IconData {
	attributes: Partial<JSX.SvgSVGAttributes<SVGSVGElement>>;
	vector: string;
}

export type NonEmptyArray<T> = readonly [T, ...T[]];

export type IconifySanitizeToggle =
	| { readonly SANITIZE: false; readonly SANITIZE_OPTIONS?: never }
	| { readonly SANITIZE?: true; readonly SANITIZE_OPTIONS?: IOptions };

export type IconifyConfiguration = Readonly<{
	DEFAULT_SVG_ATTRIBUTES?: Partial<JSX.SvgSVGAttributes<SVGSVGElement>>;
	REQUEST_OPTIONS?: RequestInit;
	CACHE_SIZE?: number | "unlimited" | "no-cache";
	ICONIFY_API: string | NonEmptyArray<string>;
}> &
	IconifySanitizeToggle;

// type guard
const validate = (s: string): s is IconifySpecifier =>
	/^[a-z0-9-]+:[a-z0-9-]+$/.test(s);

/* ────────────────────────────── Constants / Defaults ─────────────────────────── */
const DEFAULTS: Required<IconifyConfiguration> = {
	ICONIFY_API: "api.iconify.design",
	REQUEST_OPTIONS: {
		cache: "force-cache",
	} as RequestInit,
	CACHE_SIZE: 256,
	DEFAULT_SVG_ATTRIBUTES: {
		xmlns: "http://www.w3.org/2000/svg",
		width: "1em",
		height: "1em",
		viewBox: "0 0 24 24",
		fill: "currentColor",
	},
	SANITIZE: true,
	SANITIZE_OPTIONS: {
		allowedTags: [
			"svg",
			"g",
			"defs",
			"use",
			"symbol",
			"path",
			"rect",
			"circle",
			"ellipse",
			"line",
			"polyline",
			"polygon",
			"title",
			"desc",
			"linearGradient",
			"radialGradient",
			"stop",
			"clipPath",
			"mask",
			"filter",
			"animate",
			"animateTransform",
			"set",
		],
		allowedAttributes: {
			"*": [
				// presentation & geometry
				"id",
				"class",
				"fill",
				"stroke",
				"stroke-width",
				"stroke-linecap",
				"stroke-linejoin",
				"stroke-miterlimit",
				"stroke-dasharray",
				"stroke-dashoffset",
				"fill-rule",
				"fill-opacity",
				"stroke-opacity",
				"opacity",
				"vector-effect",
				"x",
				"y",
				"cx",
				"cy",
				"r",
				"rx",
				"ry",
				"x1",
				"y1",
				"x2",
				"y2",
				"width",
				"height",
				"viewBox",
				"preserveAspectRatio",
				"d",
				"points",
			],
		},
		allowedSchemes: ["https"],
		parser: {
			xmlMode: true,
			lowerCaseAttributeNames: false,
		},
		allowProtocolRelative: true,
		allowVulnerableTags: false,
	} as IOptions,
};

let CONFIGURATION: Required<IconifyConfiguration> = DEFAULTS;
let FALLBACKS = Array.isArray(CONFIGURATION.ICONIFY_API);

/* ─────────────────────────── DOM Management ────────────────────── */
let parser: DOMParser;
let serializer: XMLSerializer;
let domReady: Promise<void>;

async function ensureDOM(): Promise<void> {
	if (parser) return;
	if (!domReady) {
		domReady = import("@xmldom/xmldom").then(({ DOMParser, XMLSerializer }) => {
			parser = new DOMParser();
			serializer = new XMLSerializer();
		});
	}
	await domReady;
}

let sanitizeHtml: (dirty: string, options: IOptions) => string;
let sanitizeReady: Promise<void>;
async function ensureSanitize(): Promise<void> {
	if (!CONFIGURATION.SANITIZE || typeof sanitizeHtml === "function") return;
	if (!sanitizeReady) {
		sanitizeReady = import("sanitize-html").then(({ default: sanitize }) => {
			sanitizeHtml = sanitize;
		});
	}
	await sanitizeReady;
}

/* ───────────────────────── Data ───────────────────────── */
let cache: LRUCache<string, Promise<IconData>> | undefined;

const fetchIconifyIcon = (
	params: IconifyApiParameters,
	apiUri: string,
): Promise<IconData> => {
	const iconSpecifier = validate(params.icon)
		? params.icon
		: "material-symbols:error";
	const [collection, name] = iconSpecifier.split(":");

	if (!collection || !name)
		throw new Error("Iconify Icon: Invalid icon specifier");

	// Construct the URL for the API request
	const url = new URL(`${collection}/${name}.svg`, `https://${apiUri}/`);
	for (const [k, v] of Object.entries(params))
		if (k !== "icon" && v != null) url.searchParams.set(k, String(v));
	url.searchParams.sort();

	// Check if the icon is already in the cache
	const cacheKey = `${collection}:${name} [${url.searchParams.toString()}]`;
	const hit = cache?.get(cacheKey);
	if (hit) return hit;

	// If not, fetch the icon from the API
	const call = fetch(url, CONFIGURATION.REQUEST_OPTIONS)
		.then(async (res) => {
			if (!res.ok) throw new Error(`Iconify API ${res.status}`);
			const svgText = await res.text();

			if (!parser || !serializer) await ensureDOM();
			const svg = parser.parseFromString(
				svgText,
				"image/svg+xml",
			).documentElement;
			if (!svg || svg.nodeName !== "svg")
				throw new Error("Iconify Icon: Invalid SVG");

			const outer = serializer.serializeToString(svg).replace(/^\s+|\s+$/g, "");
			const vector = outer.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
			let data: IconData;

			if (CONFIGURATION.SANITIZE) {
				await ensureSanitize();
				const sanitized = sanitizeHtml(vector, CONFIGURATION.SANITIZE_OPTIONS);
				if (!sanitized)
					throw new Error("Iconify Icon: Invalid SVG (sanitization failed)");

				const safeAttrs = Array.from(svg.attributes)
					.filter(
						(a) =>
							!/^on/i.test(a.name) && a.name !== "style" && a.name !== "href",
					)
					// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
					.reduce((acc, a) => ({ ...acc, [a.name]: a.value }), {});

				data = {
					attributes: {
						...CONFIGURATION.DEFAULT_SVG_ATTRIBUTES,
						...safeAttrs,
					},
					vector: sanitized,
				};
			} else {
				data = {
					attributes: {
						...CONFIGURATION.DEFAULT_SVG_ATTRIBUTES,
						...svg.attributes,
					},
					vector: vector,
				};
			}

			// Cache the icon data
			cache?.set(cacheKey, Promise.resolve(data));
			return data;
		})
		.catch((err) => {
			// see if list or string
			if (FALLBACKS) {
				const cur = CONFIGURATION.ICONIFY_API.indexOf(apiUri);
				const next = (cur + 1) % CONFIGURATION.ICONIFY_API.length;

				// No more URIs to try
				if (next === cur || next < cur) {
					cache?.delete(cacheKey);
					console.error("Iconify API error:", err);
					throw err;
				}

				// Try next URI after a delay
				return new Promise((resolve) => setTimeout(resolve, 500)).then(() =>
					fetchIconifyIcon(params, CONFIGURATION.ICONIFY_API[next]),
				);
			}

			// If we reach here, it means all URIs have failed
			cache?.delete(cacheKey);
			throw new Error("Iconify API: All URIs failed");
		});
	cache?.set(cacheKey, call);
	return call;
};

/* ───────────────────────── Components ─────────────────────── */

const SVGWrapper: Component<JSX.SvgSVGAttributes<SVGSVGElement>> = (props) => {
	const [local, rest] = splitProps(props, ["children"]);

	return (
		<svg
			{...CONFIGURATION.DEFAULT_SVG_ATTRIBUTES}
			style={{
				"aspect-ratio": "1/1",
				"background-color": "transparent",
				"pointer-events": "none",
				"user-select": "none",
				display: "inline-block",
			}}
			role={"img"}
			{...rest}
		>
			{local.children}
		</svg>
	);
};

const LoadingFallback: Component<
	JSX.SvgSVGAttributes<SVGSVGElement> & { loadingIcon: boolean }
> = (props) => (
	<Show when={props.loadingIcon} fallback={<SVGWrapper {...props} />}>
		<SVGWrapper {...props}>
			<path
				fill="currentColor"
				d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
				opacity="0.25"
			/>
			<path
				fill="currentColor"
				d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
			>
				<animateTransform
					attributeName="transform"
					type="rotate"
					values="0 12 12;360 12 12"
					dur="0.75s"
					repeatCount="indefinite"
				/>
			</path>
		</SVGWrapper>
	</Show>
);

const ErrorFallback: Component<
	JSX.SvgSVGAttributes<SVGSVGElement> & { errorIcon: boolean }
> = (props) => (
	<Show when={props.errorIcon} fallback={<SVGWrapper {...props} />}>
		<SVGWrapper {...props}>
			<path
				fill="currentColor"
				d="M12 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-1-4h2V7h-2z"
			/>
			<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" />
		</SVGWrapper>
	</Show>
);

export const Icon: Component<IconifyIconProps> = (raw) => {
	const props = mergeProps({ showLoading: false, showError: false }, raw);
	const [visibility, _] = splitProps(props, ["showLoading", "showError"]);
	const [apiParams, rest]: [
		IconifyApiParameters,
		JSX.SvgSVGAttributes<SVGSVGElement>,
	] = splitProps(_, [
		"icon",
		"color",
		"size",
		"flip",
		"rotate",
		"download",
		"box",
	]);

	if (typeof apiParams.size === "number") {
		rest.width = apiParams.size;
		rest.height = apiParams.size;
		apiParams.size = undefined;
	}

	const api = FALLBACKS
		? CONFIGURATION.ICONIFY_API[0]
		: (CONFIGURATION.ICONIFY_API as string);

	const data = createAsync(() => fetchIconifyIcon(apiParams, api), {
		name: `[solid-iconify-resource] ${props.icon}`,
		initialValue: undefined,
		deferStream: false,
	});

	return (
		<ErrorBoundary
			fallback={<ErrorFallback errorIcon={visibility.showError} {...rest} />}
		>
			<Suspense
				fallback={
					<LoadingFallback loadingIcon={visibility.showLoading} {...rest} />
				}
			>
				<Show
					when={data()}
					fallback={
						<LoadingFallback loadingIcon={visibility.showLoading} {...rest} />
					}
				>
					{(data) => (
						<svg {...rest} {...data().attributes} innerHTML={data().vector} />
					)}
				</Show>
			</Suspense>
		</ErrorBoundary>
	);
};

export function configureIconify(
	patch: Partial<IconifyConfiguration>,
): IconifyConfiguration {
	CONFIGURATION = {
		...CONFIGURATION,
		...patch,
		SANITIZE: patch.SANITIZE ?? CONFIGURATION.SANITIZE,
		SANITIZE_OPTIONS:
			patch.SANITIZE === false
				? undefined
				: (patch.SANITIZE_OPTIONS ?? CONFIGURATION.SANITIZE_OPTIONS),
	} as Required<IconifyConfiguration>;
	cache =
		CONFIGURATION.CACHE_SIZE !== "no-cache"
			? CONFIGURATION.CACHE_SIZE === "unlimited"
				? new LRUCache<string, Promise<IconData>>(4096)
				: new LRUCache<string, Promise<IconData>>(CONFIGURATION.CACHE_SIZE)
			: undefined;
	FALLBACKS = Array.isArray(CONFIGURATION.ICONIFY_API);
	return CONFIGURATION;
}
export default Icon;

// TODO: shrink size down further, use json API + allow params but do it in JS (not a req)
// TODO: better host list handling (i.e. multiple attempts for 1, managing their status, delays between errors etc, as well as parsing)
// TODO: make into actual package with actual structure
