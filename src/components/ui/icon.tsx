import { createAsync } from "@solidjs/router";
import {
	ErrorBoundary,
	Show,
	Suspense,
	mergeProps,
	splitProps,
} from "solid-js";
import LRUCache from "~/lib/lru";

/* ────────────────────────────── Types ─────────────────────────── */
import type { Component, JSX } from "solid-js";
import type { IFilterXSSOptions } from "xss";

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
	| {
			readonly SANITIZE: true;
			readonly SANITIZE_OPTIONS?: Partial<IFilterXSSOptions>;
	  }
	| {
			readonly SANITIZE?: false | null | undefined;
			readonly SANITIZE_OPTIONS?: never;
	  };

export type IconifyConfiguration = Readonly<{
	DEFAULT_SVG_ATTRIBUTES?: Partial<JSX.SvgSVGAttributes<SVGSVGElement>>;
	SHOW_LOADING_DEFAULT?: boolean;
	SHOW_ERROR_DEFAULT?: boolean;
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
	SHOW_LOADING_DEFAULT: false,
	SHOW_ERROR_DEFAULT: true,
	SANITIZE: true,
	SANITIZE_OPTIONS: {} as Partial<IFilterXSSOptions>,
};

let CONFIGURATION: Required<IconifyConfiguration> = DEFAULTS;
let FALLBACKS = Array.isArray(CONFIGURATION.ICONIFY_API);

/* ─────────────────────────── DOM Management ────────────────────── */
let domParser: DOMParser;
let domReady: Promise<void>;

async function ensureDOM(): Promise<void> {
	if (domParser) return Promise.resolve();
	if (!domReady)
		if (typeof DOMParser === "undefined")
			domReady = import("@xmldom/xmldom")
				.then(({ DOMParser, XMLSerializer }) => {
					domParser = new DOMParser();
				})
				.catch((e) => Promise.reject(e));
		else
			domReady = Promise.resolve()
				.then(() => {
					domParser = new DOMParser();
				})
				.catch((e) => Promise.reject(e));
	await domReady;
}

let sanitizeReady: Promise<void>;
async function ensureSanitize(): Promise<void> {
	if (typeof sanitizeHtml === "function") return Promise.resolve();
	if (!sanitizeReady)
		sanitizeReady = import("xss")
			.then(({ default: xss }) => {
				sanitizeHtml = (html: string) =>
					xss(html, CONFIGURATION.SANITIZE_OPTIONS);
			})
			.catch((e) => Promise.reject(e));
	await sanitizeReady;
}

/* ───────────────────────── Data ───────────────────────── */
let cache: LRUCache<string, Promise<IconData>> | undefined = new LRUCache<
	string,
	Promise<IconData>
>(DEFAULTS.CACHE_SIZE as number);

const normalizeAttributes = (
	attrs: NamedNodeMap | object,
): Partial<JSX.SvgSVGAttributes<SVGSVGElement>> => {
	const out: Record<string, string> = {};
	for (const attr of Object.values(attrs)) out[attr.name] = attr.value;
	return out;
};

const buildURL = (
	{ icon, ...rest }: IconifyApiParameters,
	api: string,
): [string, URL] => {
	const spec = validate(icon) ? icon : "material-symbols:error";
	const [collection, name] = spec.split(":");
	if (!collection || !name) throw Error("Iconify: bad specifier");

	const url = new URL(`${collection}/${name}.svg`, `https://${api}/`);
	for (const [k, v] of Object.entries(rest))
		v != null && url.searchParams.set(k, String(v));
	url.searchParams.sort();
	return [spec, url];
};

let sanitizeHtml: (html: string) => string;

const escapeHTML = (html: string): string =>
	html?.replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();

const getInnerHtml = (html: string): string =>
	html
		?.replace(/^<svg[^>]*>/, "")
		.replace(/<\/svg>$/, "")
		?.replace(/^<g[^>]*>/, "") // TODO: make sure this is safe
		.replace(/<\/g>$/, "");

const fetchIconifyIcon = (
	params: IconifyApiParameters,
	apiUri: string,
	attempt = 0,
): Promise<IconData> => {
	const [spec, url] = buildURL(params, apiUri);
	const cacheKey = `${spec} [${url.searchParams.toString() ?? "-"}]`;
	const hit = cache?.get(cacheKey);
	if (hit) return hit;

	const task = fetch(url, CONFIGURATION.REQUEST_OPTIONS)
		.then(async (res) => {
			if (!res.ok) throw Error(`Iconify ${res.status}`);

			let raw = await res.text();
			if (!raw || raw.length === 0) throw Error("Iconify: empty SVG");
			if (CONFIGURATION.SANITIZE) {
				if (!sanitizeHtml) await ensureSanitize();
				raw = escapeHTML(sanitizeHtml(raw));
				console.log("here");
				if (!raw || raw.length === 0) throw Error("Iconify: empty SVG");
			}

			if (!domParser) await ensureDOM();
			const svgEl = domParser.parseFromString(
				raw,
				"image/svg+xml",
			).documentElement;
			if (svgEl.nodeName !== "svg") throw Error("Iconify: invalid SVG");

			return {
				attributes: {
					...CONFIGURATION.DEFAULT_SVG_ATTRIBUTES,
					...normalizeAttributes(svgEl.attributes),
				},
				vector: getInnerHtml(raw),
			} as IconData;
		})
		.finally(() => cache?.set(cacheKey, task))
		.catch((e) => {
			if (FALLBACKS && attempt + 1 < CONFIGURATION.ICONIFY_API.length) {
				const nextApi =
					CONFIGURATION.ICONIFY_API[
						(attempt + 1) % CONFIGURATION.ICONIFY_API.length
					];
				return new Promise((r) => setTimeout(r, 500)).then(() =>
					fetchIconifyIcon(params, nextApi, attempt + 1),
				);
			}
			cache?.delete(cacheKey);
			return Promise.reject(e);
		});

	return task;
};

/* ───────────────────────── Components ─────────────────────── */

const SVGWrapper: Component<JSX.SvgSVGAttributes<SVGSVGElement>> = (props) => {
	const [local, rest] = splitProps(props, ["children"]);

	return (
		<svg
			{...CONFIGURATION.DEFAULT_SVG_ATTRIBUTES}
			role={"img"}
			style={{
				"aspect-ratio": "1/1",
				"background-color": "transparent",
				"pointer-events": "none",
				"user-select": "none",
				display: "inline-block",
			}}
			{...rest}
		>
			{local.children}
		</svg>
	);
};

const LoadingFallback: Component<
	JSX.SvgSVGAttributes<SVGSVGElement> & { loadingIcon: boolean }
> = (props) => (
	<Show fallback={<SVGWrapper {...props} />} when={props.loadingIcon}>
		<SVGWrapper {...props}>
			<path
				d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
				fill="currentColor"
				opacity="0.25"
			/>
			<path
				d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
				fill="currentColor"
			>
				<animateTransform
					attributeName="transform"
					dur="0.75s"
					repeatCount="indefinite"
					type="rotate"
					values="0 12 12;360 12 12"
				/>
			</path>
		</SVGWrapper>
	</Show>
);

const ErrorFallback: Component<
	JSX.SvgSVGAttributes<SVGSVGElement> & { errorIcon: boolean }
> = (props) => (
	<Show fallback={<SVGWrapper {...props} />} when={props.errorIcon}>
		<SVGWrapper {...props}>
			<path
				d="M12 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-1-4h2V7h-2z"
				fill="currentColor"
			/>
			<circle cx="12" cy="12" fill="none" r="10" stroke="currentColor" />
		</SVGWrapper>
	</Show>
);

export const Icon: Component<IconifyIconProps> = (raw) => {
	const props = mergeProps(
		{
			showLoading: CONFIGURATION.SHOW_LOADING_DEFAULT,
			showError: CONFIGURATION.SHOW_ERROR_DEFAULT,
		},
		raw,
	);
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
		rest.width = `${apiParams.size}em`;
		rest.height = `${apiParams.size}em`;
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
		<Suspense
			fallback={
				<LoadingFallback loadingIcon={visibility.showLoading} {...rest} />
			}
		>
			<ErrorBoundary
				fallback={<ErrorFallback errorIcon={visibility.showError} {...rest} />}
			>
				<Show
					fallback={
						<LoadingFallback loadingIcon={visibility.showLoading} {...rest} />
					}
					when={data()}
				>
					{(data) => (
						<svg {...data().attributes} {...rest} innerHTML={data().vector} />
					)}
				</Show>
			</ErrorBoundary>
		</Suspense>
	);
};

export function configureIconify(
	patch: Partial<IconifyConfiguration>,
): Required<IconifyConfiguration> {
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

export function getIconifyConfiguration(): Required<IconifyConfiguration> {
	return CONFIGURATION;
}

export default Icon;

// TODO: shrink size down further, use json API + allow params but do it in JS (not a req)
// TODO: better host list handling (i.e. multiple attempts for 1, managing their status, delays between errors etc, as well as parsing)
// TODO: configuration consistent / stable (i.e. configuration always runs before any rendering / reading of config)
