/// <reference types="vite/client" />

// @fontsource packages ship CSS only, with no type declarations.
declare module "@fontsource/*";
declare module "@fontsource-variable/*";

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
