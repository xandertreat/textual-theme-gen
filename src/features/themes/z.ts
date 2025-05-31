import { z } from "zod";

const hexCharacterSchema = z
	.string()
	.length(1)
	.regex(/#([A-Fa-f0-9]{1})/);

export type HexCodeCharacter = z.infer<typeof hexCharacterSchema>;
