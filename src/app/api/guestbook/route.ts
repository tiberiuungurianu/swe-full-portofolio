import { NextRequest, NextResponse } from "next/server";

import { checkRateLimit } from "@/lib/guestbook/rate-limit";
import {
  createPendingMessage,
  getGuestbookStorageMode,
  listApprovedMessages,
} from "@/lib/guestbook/store";
import { readSessionToken, sessionCookie } from "@/lib/guestbook/session";
import { validateGuestbookMessage } from "@/lib/guestbook/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function GET() {
  const messages = await listApprovedMessages();
  return NextResponse.json({
    messages,
    storage: getGuestbookStorageMode(),
  });
}

export async function POST(request: NextRequest) {
  const rate = checkRateLimit(`guestbook:${clientKey(request)}`);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        error: "Too many notes from this address. Please try again later.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSeconds) },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const firstName = readSessionToken(request.cookies.get(sessionCookie.name)?.value);
  if (!firstName) {
    return NextResponse.json(
      { error: "Sign in with Google before leaving a note." },
      { status: 401 },
    );
  }

  const parsed = validateGuestbookMessage(
    (body as { message?: unknown } | null)?.message,
  );
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  await createPendingMessage({
    name: firstName,
    message: parsed.message,
  });

  return NextResponse.json(
    {
      ok: true,
      detail:
        "Thanks — your note was submitted for review and will appear once approved.",
      storage: getGuestbookStorageMode(),
    },
    { status: 201 },
  );
}
