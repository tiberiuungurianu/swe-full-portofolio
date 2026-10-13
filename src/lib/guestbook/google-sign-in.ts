import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

import { deployOrigin } from "@/lib/site";

import { openPayload, sealPayload } from "./session";
import { validateDisplayName } from "./validation";

const OAUTH_COOKIE = "guestbook_oauth";
const OAUTH_MAX_AGE_SECONDS = 10 * 60;

type OauthAttempt = {
  state: string;
  verifier: string;
  exp: number;
};

export const oauthCookie = {
  name: OAUTH_COOKIE,
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: OAUTH_MAX_AGE_SECONDS,
  },
};

function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Origin Google will redirect back to. Development follows the browser. Production uses the live domain. */
export function guestbookOrigin(request: NextRequest): string {
  return deployOrigin(request.nextUrl.origin);
}

export function createOauthAttempt(): OauthAttempt {
  return {
    state: randomBytes(24).toString("base64url"),
    verifier: randomBytes(32).toString("base64url"),
    exp: Date.now() + OAUTH_MAX_AGE_SECONDS * 1000,
  };
}

export function encodeOauthAttempt(attempt: OauthAttempt): string | null {
  return sealPayload(attempt);
}

export function decodeOauthAttempt(token: string | undefined): OauthAttempt | null {
  const parsed = openPayload<Partial<OauthAttempt>>(token);
  if (
    !parsed ||
    typeof parsed.state !== "string" ||
    typeof parsed.verifier !== "string" ||
    typeof parsed.exp !== "number"
  ) {
    return null;
  }
  if (parsed.exp < Date.now()) return null;
  return { state: parsed.state, verifier: parsed.verifier, exp: parsed.exp };
}

export function oauthStateMatches(attempt: OauthAttempt, state: string): boolean {
  return safeEqual(attempt.state, state);
}

function redirectUri(origin: string): string {
  return `${origin}/api/auth/google/callback`;
}

export function googleAuthorizeUrl(origin: string, attempt: OauthAttempt): string {
  const challenge = createHash("sha256").update(attempt.verifier).digest("base64url");
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", process.env.AUTH_GOOGLE_ID?.trim() ?? "");
  url.searchParams.set("redirect_uri", redirectUri(origin));
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid profile");
  url.searchParams.set("state", attempt.state);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("prompt", "select_account");
  return url.toString();
}

/**
 * Exchanges the Google code for a first name.
 * The email scope is not requested, and email is never read from the profile.
 */
export async function firstNameFromGoogleCode(
  origin: string,
  code: string,
  verifier: string,
): Promise<string | null> {
  const clientId = process.env.AUTH_GOOGLE_ID?.trim();
  const clientSecret = process.env.AUTH_GOOGLE_SECRET?.trim();
  if (!clientId || !clientSecret) return null;

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      code_verifier: verifier,
      grant_type: "authorization_code",
      redirect_uri: redirectUri(origin),
    }),
  });

  if (!tokenResponse.ok) return null;
  const tokenJson = (await tokenResponse.json()) as { access_token?: unknown };
  if (typeof tokenJson.access_token !== "string" || !tokenJson.access_token) {
    return null;
  }

  const profileResponse = await fetch(
    "https://openidconnect.googleapis.com/v1/userinfo",
    {
      cache: "no-store",
      headers: { Authorization: `Bearer ${tokenJson.access_token}` },
    },
  );
  if (!profileResponse.ok) return null;

  const profile = (await profileResponse.json()) as {
    given_name?: unknown;
    name?: unknown;
  };
  const givenName = typeof profile.given_name === "string" ? profile.given_name : "";
  const fullName = typeof profile.name === "string" ? profile.name : "";
  const candidate = givenName.trim() || fullName.trim().split(/\s+/)[0] || "";
  const parsed = validateDisplayName(candidate);
  return parsed.ok ? parsed.name : null;
}
