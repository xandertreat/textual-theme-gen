import { z } from "zod";

export const hexCharacterSchema = z
	.string()
	.length(1)
	.regex(/#([A-Fa-f0-9]{1})/);
