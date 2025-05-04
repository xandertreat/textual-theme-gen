import { createAuthClient } from "better-auth/solid";

export const authClient = createAuthClient({
	baseURL: import.meta.env.BASE_URL,
});
