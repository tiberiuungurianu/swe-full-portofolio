/** Live site. Google returns here after sign-in on the deployed app. */
export const productionOrigin = "https://tiberiuungurianu.com";

/** Local dev server from `npm run dev`. */
export const developmentOrigin = "http://localhost:4327";

function configuredOrigin(): string | null {
  const value = process.env.AUTH_URL?.trim().replace(/\/$/, "");
  return value || null;
}

/**
 * Public site origin for this process.
 * Development uses the local server. Production uses the live domain.
 * `AUTH_URL` overrides either one.
 */
export function siteOrigin(): string {
  const configured = configuredOrigin();
  if (configured) return configured;
  if (process.env.NODE_ENV === "production") return productionOrigin;
  return developmentOrigin;
}

/**
 * Origin embedded in the Google callback.
 * In development this follows the browser host, so localhost and 127.0.0.1 both work.
 */
export function deployOrigin(requestOrigin: string): string {
  const configured = configuredOrigin();
  if (configured) return configured;
  if (process.env.NODE_ENV !== "production") return requestOrigin;
  return productionOrigin;
}
