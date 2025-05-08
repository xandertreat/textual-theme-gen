import { type AccessorWithLatest, createAsync, query } from "@solidjs/router";
import sanitizeHtml from "sanitize-html";
import type { IOptions } from "sanitize-html";
import type { Accessor, Component, JSX } from "solid-js";
import {
	ErrorBoundary,
	Show,
	Suspense,
	createMemo,
	mergeProps,
	splitProps,
} from "solid-js";

/* ────────────────────────────── Types ─────────────────────────── */

export type IconifySpecifier = `${Lowercase<string>}:${Lowercase<string>}`;
export type IconifySize = number | "auto" | "unset" | "none";
export type IconifyFlip = "horizontal" | "vertical" | "horizontal,vertical";
export type IconifyRotate = "90deg" | 1 | "180deg" | 2 | "270deg" | 3;

export interface IconifyApiParameters {
	icon: IconifySpecifier | string;
	color?: string;
	width?: IconifySize;
	height?: IconifySize;
	size?: IconifySize;
	flip?: IconifyFlip;
	rotate?: IconifyRotate;
	download?: boolean;
	box?: boolean;
}

export type IconifyIconProps = JSX.SvgSVGAttributes<SVGSVGElement> &
	IconifyApiParameters & {
		showLoading?: boolean;
		showError?: boolean;
		onError?: (err: Error) => void;
		onLoad?: () => void;
	};

export interface IconData {
	attributes: Record<string, string>;
	vector: string;
}

export interface IconifyQueryResponse {
	data: AccessorWithLatest<IconData | undefined>;
	isLoading: Accessor<boolean>;
}

const validate = (s: string): s is IconifySpecifier =>
	/^[a-z0-9-]+:[a-z0-9-]+$/.test(s);

/* ────────────────────────────── Constants / Defaults ─────────────────────────── */

const DEFAULT_SVG_ATTRIBUTES = {
	xmlns: "http://www.w3.org/2000/svg",
	width: "2em",
	height: "2em",
	viewBox: "0 0 24 24",
	fill: "currentColor",
};

const SVG_SANITIZE_OPTIONS = {
	allowedTags: [
		"svg",
		"g",
		"defs",
		"symbol",
		"use",
		"marker",
		"mask",
		"pattern",
		"clipPath",
		"foreignObject",
		"switch",
		"view",
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
		"filter",
		"feBlend",
		"feColorMatrix",
		"feComponentTransfer",
		"feComposite",
		"feConvolveMatrix",
		"feDiffuseLighting",
		"feDisplacementMap",
		"feDropShadow",
		"feFlood",
		"feGaussianBlur",
		"feImage",
		"feMerge",
		"feMergeNode",
		"feMorphology",
		"feOffset",
		"feSpecularLighting",
		"feTile",
		"feTurbulence",
		"feFuncA",
		"feFuncB",
		"feFuncG",
		"feFuncR",
		"feDistantLight",
		"fePointLight",
		"feSpotLight",
		"text",
		"tspan",
		"textPath",
		"animate",
		"animateMotion",
		"animateTransform",
		"set",
		// "style",
	],
	allowedAttributes: {
		"*": [
			// Core attributes
			"id",
			"class",
			"style",
			"tabindex",
			"xml:lang",
			"xml:space",
			"lang",
			"requiredFeatures",
			"requiredExtensions",
			"systemLanguage",
			"alignment-baseline",
			"baseline-shift",
			"clip",
			"clip-path",
			"clip-rule",
			"color",
			"color-interpolation",
			"color-interpolation-filters",
			"cursor",
			"display",
			"dominant-baseline",
			"fill",
			"fill-opacity",
			"fill-rule",
			"filter",
			"flood-color",
			"flood-opacity",
			"font-family",
			"font-size",
			"font-size-adjust",
			"font-stretch",
			"font-style",
			"font-variant",
			"font-weight",
			"image-rendering",
			"letter-spacing",
			"lighting-color",
			"marker-end",
			"marker-mid",
			"marker-start",
			"mask",
			"opacity",
			"pointer-events",
			"shape-rendering",
			"stop-color",
			"stop-opacity",
			"stroke",
			"stroke-dasharray",
			"stroke-dashoffset",
			"stroke-linecap",
			"stroke-linejoin",
			"stroke-miterlimit",
			"stroke-opacity",
			"stroke-width",
			"text-anchor",
			"text-decoration",
			"text-rendering",
			"unicode-bidi",
			"visibility",
			"word-spacing",
			"writing-mode",
			"x",
			"y",
			"width",
			"height",
			"rx",
			"ry",
			"cx",
			"cy",
			"r",
			"x1",
			"y1",
			"x2",
			"y2",
			"pathLength",
			"d",
			"points",
			"gradientUnits",
			"gradientTransform",
			"spreadMethod",
			"fx",
			"fy",
			"fr",
			"offset",
			"patternUnits",
			"patternTransform",
			"patternContentUnits",
			"filterUnits",
			"primitiveUnits",
			"result",
			"in",
			"in2",
			"type",
			"values",
			"tableValues",
			"slope",
			"intercept",
			"amplitude",
			"exponent",
			"offset",
			"kernelMatrix",
			"kernelUnitLength",
			"order",
			"targetX",
			"targetY",
			"limitingConeAngle",
			"preserveAlpha",
			"surfaceScale",
			"diffuseConstant",
			"specularConstant",
			"specularExponent",
			"stdDeviation",
			"edgeMode",
			"mode",
			"attributeName",
			"attributeType",
			"begin",
			"dur",
			"end",
			"min",
			"max",
			"restart",
			"repeatCount",
			"repeatDur",
			"fill",
			"calcMode",
			"values",
			"keyTimes",
			"keySplines",
			"from",
			"to",
			"by",
			"additive",
			"accumulate",
			"keyPoints",
			"rotate",
			"path",
			"origin",
			"autoReverse",
			"href",
			"target",
			"download",
			"rel",
			"hreflang",
			"type",
			"referrerPolicy",
			"xlink:href",
			"xlink:title",
			"xlink:show",
			"xlink:actuate",
			"crossorigin",
			"markerUnits",
			"markerWidth",
			"markerHeight",
			"orient",
			"refX",
			"refY",
			"preserveAspectRatio",
			"viewBox",
			"zoomAndPan",
			"pointsAtX",
			"pointsAtY",
			"pointsAtZ",
			"local",
			"media",
			"orientation",
		],
	},
	allowedSchemes: ["http", "https", "ftp", "mailto", "tel", "data"],
	allowedSchemesAppliedToAttributes: ["href", "xlink:href", "src", "cite"],
	allowProtocolRelative: true,
	parser: {
		lowerCaseTags: false,
		lowerCaseAttributeNames: false,
		xmlMode: true,
	},
	allowVulnerableTags: false,
} as IOptions;
/* ─────────────────────────── DOM Management ────────────────────── */
let imported = false;
let parser: DOMParser;
let serializer: XMLSerializer;

if (typeof DOMParser === "undefined") {
	(async () => {
		const { DOMParser, XMLSerializer } = await import("@xmldom/xmldom");
		imported = true;
		parser = new DOMParser();
		serializer = new XMLSerializer();
	})();
} else {
	parser = new DOMParser();
	serializer = new XMLSerializer();
}

/* ───────────────────────── Data ───────────────────────── */

export const queryIconifyApi = query(
	(params: IconifyApiParameters): Promise<IconData> => {
		const iconSpecifier = validate(params.icon)
			? params.icon
			: "material-symbols:error";
		const [collection, name] = iconSpecifier.split(":");

		// Construct API call
		const url = new URL(`https://api.iconify.design/${collection}/${name}.svg`);
		for (const [k, v] of Object.entries(params))
			if (k !== "icon" && v != null) url.searchParams.set(k, String(v));

		const key = url.pathname + url.search;

		return fetch(url)
			.then(async (res) => {
				if (!res.ok) throw new Error(`Iconify API ${res.status}`);
				const svgText = await res.text();

				const svg = parser.parseFromString(
					svgText,
					"image/svg+xml",
				).documentElement;
				if (!svg || svg.nodeName !== "svg")
					throw new Error("Iconify Icon: Invalid SVG");

				const outer = serializer.serializeToString(svg);
				const vector = outer.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
				const sanitized = sanitizeHtml(vector, SVG_SANITIZE_OPTIONS);

				const data: IconData = {
					attributes: {
						xmlns:
							svg.getAttribute("xmlns")?.trim() || DEFAULT_SVG_ATTRIBUTES.xmlns,
						width:
							svg.getAttribute("width")?.trim() || DEFAULT_SVG_ATTRIBUTES.width,
						height:
							svg.getAttribute("height")?.trim() ||
							DEFAULT_SVG_ATTRIBUTES.height,
						viewBox:
							svg.getAttribute("viewBox")?.trim() ||
							DEFAULT_SVG_ATTRIBUTES.viewBox,
						fill:
							svg.getAttribute("fill")?.trim() || DEFAULT_SVG_ATTRIBUTES.fill,
					},
					vector: sanitized,
				};
				return data;
			})
			.catch((err) => {
				console.error("Iconify API error:", err);
				throw err;
			});
	},
	"@xtreat/iconify-solids",
);

/* ───────────────────────── Components ─────────────────────── */

const SVGWrapper: Component<JSX.SvgSVGAttributes<SVGSVGElement>> = (passed) => {
	const props = mergeProps(DEFAULT_SVG_ATTRIBUTES, passed);
	const [local, rest] = splitProps(props, ["children", "class", "classList"]);

	return (
		<svg
			class={local.class}
			classList={{
				...local.classList,
				"size-8 inline-block bg-transparent": !local.class,
			}}
			role={"img"}
			{...rest}
		>
			{local.children}
		</svg>
	);
};

const LoadingFallback: Component<
	JSX.SvgSVGAttributes<SVGSVGElement> & { showLoading: boolean }
> = (props) => (
	<Show when={props.showLoading} fallback={<SVGWrapper {...props} />}>
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
	JSX.SvgSVGAttributes<SVGSVGElement> & { showError: boolean }
> = (props) => (
	<Show when={props.showError} fallback={<SVGWrapper {...props} />}>
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
	const props = mergeProps(
		{ showLoading: false, showError: false } as const,
		raw,
	);
	const [events, rest] = splitProps(props, [
		"onError",
		"onLoad",
		"showLoading",
		"showError",
	]);
	const [iconAttrs, svgAttrs] = splitProps(rest, [
		"icon",
		"color",
		"width",
		"height",
		"size",
		"flip",
		"rotate",
		"download",
		"box",
	]);

	const params = createMemo(() => ({
		...iconAttrs,
		width: iconAttrs.size ?? iconAttrs.width,
		height: iconAttrs.size ?? iconAttrs.height,
	}));

	const data = createAsync(() => queryIconifyApi(params()), {
		name: `icon:${props.icon}`,
		initialValue: undefined,
		deferStream: true,
	});

	return (
		<ErrorBoundary
			fallback={<ErrorFallback showError={events.showError} {...svgAttrs} />}
		>
			<Suspense
				fallback={
					<LoadingFallback showLoading={events.showLoading} {...svgAttrs} />
				}
			>
				<Show
					when={data()}
					fallback={
						<LoadingFallback showLoading={events.showLoading} {...svgAttrs} />
					}
				>
					{(data) => (
						<svg
							{...svgAttrs}
							{...data().attributes}
							innerHTML={`${data().vector}`}
						/>
					)}
				</Show>
			</Suspense>
		</ErrorBoundary>
	);
};

export default Icon;
