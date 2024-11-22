/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_ENVIRONMENT: string;
    readonly VITE_API_URL_LOCAL: string;
    readonly VITE_API_URL_PROD: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
