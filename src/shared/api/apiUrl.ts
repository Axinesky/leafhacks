/*
 * Builds API URLs for both local development and deployed environments.
 *
 * Local development:
 * - Leave VITE_API_BASE_URL unset and Vite will proxy /api to the local API.
 *
 * Deployment (for example on GCE):
 * - Set VITE_API_BASE_URL to the API origin, for example
 *   https://api.example.com
 */
const configuredBase = import.meta.env.VITE_API_BASE_URL?.trim() ?? "";
const API_BASE = configuredBase.replace(/\/+$/, "");

/**
 * Prefixes an absolute API path with the configured base URL when present.
 */
export function apiUrl(path: string): string {
  if (!path.startsWith("/")) {
    throw new Error(`API path must start with '/': ${path}`);
  }
  return `${API_BASE}${path}`;
}
