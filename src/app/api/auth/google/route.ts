import { NextRequest, NextResponse } from "next/server";

import {
  createOauthAttempt,
  encodeOauthAttempt,
  googleAuthorizeUrl,
  guestbookOrigin,
  oauthCookie,
} from "@/lib/guestbook/google-sign-in";
import { isGoogleSignInConfigured } from "@/lib/guestbook/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function guestbookRedirect(request: NextRequest, error?: string) {
  const url = new URL("/guestbook", request.nextUrl.origin);
  if (error) url.searchParams.set("error", error);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  if (!isGoogleSignInConfigured()) {
    return guestbookRedirect(request, "config");
  }

  const origin = guestbookOrigin(request);

  const attempt = createOauthAttempt();
  const sealed = encodeOauthAttempt(attempt);
  if (!sealed) {
    return guestbookRedirect(request, "config");
  }

  const response = NextResponse.redirect(googleAuthorizeUrl(origin, attempt));
  response.cookies.set(oauthCookie.name, sealed, oauthCookie.options);
  return response;
}
