/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Personal portfolio URL shown on the About/Developer pages. Unset by default — see .env.example. */
  readonly VITE_PORTFOLIO_URL?: string
  /** LinkedIn profile URL shown on the About/Developer pages. Unset by default — see .env.example. */
  readonly VITE_LINKEDIN_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
