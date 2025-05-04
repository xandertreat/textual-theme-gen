import { toSolidStartHandler } from "better-auth/solid-start";
import { auth } from "~/features/auth/lib/auth";

export const { GET, POST } = toSolidStartHandler(auth);
