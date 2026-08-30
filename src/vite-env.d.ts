/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public API endpoint for wishlist submissions. */
  readonly VITE_WISHLIST_ENDPOINT?: string
  /** Formspree form endpoint for the early-access form, e.g. https://formspree.io/f/xxxxxxx */
  readonly VITE_FORMSPREE_ENDPOINT?: string
  /** Canonical site origin (no trailing slash). Set when the custom domain lands. */
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
