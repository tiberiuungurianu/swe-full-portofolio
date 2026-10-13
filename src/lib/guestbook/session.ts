import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

import { validateDisplayName } from "./validation";

const SESSION_COOKIE = "guestbook_name";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

type SessionPayload = {
  name: string;
  exp: number;
};

function signingSecret(): string | null {
  const value = process.env.AUTH_SECRET?.trim();
  if (!value || value.length < 16) return null;
  return value;
}

export function isGoogleSignInConfigured(): boolean {
  const hasGoogle = Boolean(
    signingSecret() &&
      process.env.AUTH_GOOGLE_ID?.trim() &&
      process.env.AUTH_GOOGLE_SECRET?.trim(),
  );
  return hasGoogle;
}

function sign(body: string): string | null {
  const secret = signingSecret();
  if (!secret) return null;
  const mac = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${mac}`;
}

function unsign(token: string): string | null {
  const secret = signingSecret();
  if (!secret) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;

  const body = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  const expected = createHmac("sha256", secret).update(body).digest("base64url");
  const provided = Buffer.from(mac);
  const actual = Buffer.from(expected);
  if (provided.length !== actual.length || !timingSafeEqual(provided, actual)) {
    return null;
  }
  return body;
}

export function sealPayload(value: unknown): string | null {
  const body = Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
  return sign(body);
}

export function openPayload<T>(token: string | undefined): T | null {
  if (!token) return null;
  const body = unsign(token);
  if (!body) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

export function createSessionToken(name: string): string | null {
  const parsed = validateDisplayName(name);
  if (!parsed.ok) return null;
  const payload: SessionPayload = {
    name: parsed.name,
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  };
  return sealPayload(payload);
}

export function readSessionToken(token: string | undefined): string | null {
  const payload = openPayload<Partial<SessionPayload>>(token);
  if (!payload) return null;
  if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
  const parsed = validateDisplayName(payload.name);
  return parsed.ok ? parsed.name : null;
}

export const sessionCookie = {
  name: SESSION_COOKIE,
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  },
};

export async function getGuestbookFirstName(): Promise<string | null> {
  const cookieStore = await cookies();
  return readSessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}
