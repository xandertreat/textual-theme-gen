/// <reference types="vinxi/types/client" />

// CLIENT ENVIRONMENT
interface ImportMetaEnv {}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

// SERVER ENVIRONMENT

// SERVER ENVIRONMENT
declare namespace NodeJS {
	interface ProcessEnv {
	}
}
