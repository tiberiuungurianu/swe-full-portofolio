import type { Metadata } from "next";

import { GuestbookForm } from "@/components/GuestbookForm";
import { GuestbookList } from "@/components/GuestbookList";
import { GuestbookIntro } from "@/components/sections";
import {
  getGuestbookFirstName,
  isGoogleSignInConfigured,
} from "@/lib/guestbook/session";
import {
  getGuestbookStorageMode,
  listApprovedMessages,
} from "@/lib/guestbook/store";

export const metadata: Metadata = {
  title: "guestbook",
  description:
    "Leave a note for Tiberiu Ungurianu — hellos, thoughts or project feedback.",
};

export const dynamic = "force-dynamic";

function signInPrompt(error: string | undefined): {
  open: boolean;
  notice: string | null;
} {
  switch (error) {
    case "config":
      return {
        open: true,
        notice: "Google sign-in is not set up on this server yet.",
      };
    case "name":
      return {
        open: true,
        notice: "Google did not share a first name, so the note cannot be signed.",
      };
    case "signin":
      return {
        open: true,
        notice: "Google sign-in did not complete. Please try again.",
      };
    default:
      return { open: false, notice: null };
  }
}

export default async function GuestbookPage({
  searchParams,
}: PageProps<"/guestbook">) {
  const [messages, storage, firstName, params] = await Promise.all([
    listApprovedMessages(),
    getGuestbookStorageMode(),
    getGuestbookFirstName(),
    searchParams,
  ]);
  const error = typeof params.error === "string" ? params.error : undefined;
  const prompt = firstName ? { open: false, notice: null } : signInPrompt(error);

  return (
    <div className="page">
      <GuestbookIntro
        storageLabel={storage.label}
        storagePath={storage.path}
      />

      <section className="guestbook-board" aria-labelledby="notes-heading">
        <h2 className="section-heading" id="notes-heading">
          messages
        </h2>
        <GuestbookList messages={messages} />
        <div className="guestbook-sign">
          <GuestbookForm
            firstName={firstName}
            googleReady={isGoogleSignInConfigured()}
            initiallyOpen={prompt.open}
            notice={prompt.notice}
          />
        </div>
      </section>
    </div>
  );
}
