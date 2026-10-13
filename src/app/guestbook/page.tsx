import type { Metadata } from "next";

import { GuestbookForm } from "@/components/GuestbookForm";
import { GuestbookList } from "@/components/GuestbookList";
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

export default async function GuestbookPage() {
  const messages = await listApprovedMessages();
  const storage = getGuestbookStorageMode();

  return (
    <div className="page">
      <section className="section" aria-labelledby="guestbook-heading">
        <h1 className="section-heading" id="guestbook-heading">
          leave a note
        </h1>
        <p className="section-intro">
          Say hello, share a thought, or leave project feedback. Notes are held
          for moderation and only appear here once approved. No account is
          required.
        </p>

        <div className="callout" role="note">
          <p>
            <strong>Storage mode:</strong> {storage.label} Path:{" "}
            <code>{storage.path}</code>.
          </p>
          <p>
            This local/dev implementation persists on the server filesystem.
            Configure a hosted database and{" "}
            <code>GUESTBOOK_MODERATION_SECRET</code> before treating submissions
            as production-ready. Browser localStorage is not used as shared
            storage.
          </p>
        </div>
      </section>

      <div className="guestbook-layout">
        <section aria-labelledby="write-heading">
          <h2 className="section-heading" id="write-heading">
            write
          </h2>
          <GuestbookForm />
          <p className="privacy-note">
            Privacy: the site stores the display name, message text, submission
            time and moderation status. Email addresses are not collected on
            this form and are never shown publicly. Rate limiting applies per
            client address.
          </p>
        </section>

        <section aria-labelledby="notes-heading">
          <h2 className="section-heading" id="notes-heading">
            approved notes
          </h2>
          <GuestbookList messages={messages} />
        </section>
      </div>
    </div>
  );
}
