import { NextRequest, NextResponse } from "next/server";

import {
  decodeOauthAttempt,
  firstNameFromGoogleCode,
  guestbookOrigin,
  oauthCookie,
  oauthStateMatches,
} from "@/lib/guestbook/google-sign-in";
import { createSessionToken, sessionCookie } from "@/lib/guestbook/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function finish(request: NextRequest, error?: string, sessionToken?: string) {
  const url = new URL("/guestbook", request.nextUrl.origin);
  if (error) url.searchParams.set("error", error);
  const response = NextResponse.redirect(url);
  response.cookies.set(oauthCookie.name, "", { ...oauthCookie.options, maxAge: 0 });
  if (sessionToken) {
    response.cookies.set(sessionCookie.name, sessionToken, sessionCookie.options);
  }
  return response;
}

export async function GET(request: NextRequest) {
  const origin = guestbookOrigin(request);

  if (request.nextUrl.searchParams.get("error")) {
    return finish(request, "signin");
  }

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const attempt = decodeOauthAttempt(request.cookies.get(oauthCookie.name)?.value);

  if (!code || !state || !attempt || !oauthStateMatches(attempt, state)) {
    return finish(request, "signin");
  }

  const firstName = await firstNameFromGoogleCode(origin, code, attempt.verifier);
  if (!firstName) return finish(request, "name");

  const sessionToken = createSessionToken(firstName);
  if (!sessionToken) return finish(request, "name");

  return finish(request, undefined, sessionToken);
}
