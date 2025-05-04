/// <reference types="vinxi/types/client" />

// CLIENT ENVIRONMENT
type ImportMetaEnv = {
	BASE_URL: string;
};

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

// SERVER ENVIRONMENT

// SERVER ENVIRONMENT
declare namespace NodeJS {
	type ProcessEnv = {
		BASE_URL: string;
	};
}
