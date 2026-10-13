import { timingSafeEqual } from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

import {
  listAllMessages,
  moderateMessage,
} from "@/lib/guestbook/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorised(request: NextRequest): boolean {
  const secret = process.env.GUESTBOOK_MODERATION_SECRET;
  if (!secret) {
    return false;
  }

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    return false;
  }

  const token = header.slice("Bearer ".length).trim();
  const expected = Buffer.from(secret);
  const provided = Buffer.from(token);

  if (expected.length !== provided.length) {
    return false;
  }

  return timingSafeEqual(expected, provided);
}

export async function GET(request: NextRequest) {
  if (!process.env.GUESTBOOK_MODERATION_SECRET) {
    return NextResponse.json(
      {
        error:
          "Moderation is not configured. Set GUESTBOOK_MODERATION_SECRET on the server.",
      },
      { status: 503 },
    );
  }

  if (!authorised(request)) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }

  const messages = await listAllMessages();
  return NextResponse.json({ messages });
}

export async function POST(request: NextRequest) {
  if (!process.env.GUESTBOOK_MODERATION_SECRET) {
    return NextResponse.json(
      {
        error:
          "Moderation is not configured. Set GUESTBOOK_MODERATION_SECRET on the server.",
      },
      { status: 503 },
    );
  }

  if (!authorised(request)) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const payload = body as { id?: unknown; status?: unknown };
  if (typeof payload.id !== "string") {
    return NextResponse.json({ error: "Message id is required." }, { status: 400 });
  }
  if (payload.status !== "approved" && payload.status !== "rejected") {
    return NextResponse.json(
      { error: "Status must be approved or rejected." },
      { status: 400 },
    );
  }

  const updated = await moderateMessage(payload.id, payload.status);
  if (!updated) {
    return NextResponse.json({ error: "Message not found." }, { status: 404 });
  }

  return NextResponse.json({ message: updated });
}
