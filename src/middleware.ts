import { redirect } from "@solidjs/router";
import { createMiddleware } from "@solidjs/start/middleware";
import { auth } from "~/features/auth/lib/auth";

export default createMiddleware({
	onRequest: async ({ request }) => {
		const paths = request.url.split("/").splice(1).filter(Boolean);
		const session = await auth.api.getSession({
			headers: request.headers,
		});
		if (!session) return redirect("/login");

		const slashCount =
			(request.url.startsWith("http://") &&
				[...request.url.matchAll(/\//g)].length) ||
			0;
		if (3 <= slashCount && request.url.endsWith("/"))
			return redirect(request.url.slice(0, request.url.lastIndexOf("/")));
	},
});
