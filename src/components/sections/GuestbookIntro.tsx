type GuestbookIntroProps = {
  /** Human label for the current store, such as the local filesystem. */
  storageLabel: string;
  /** Server path or database name shown so the storage choice is explicit. */
  storagePath: string;
};

/** Guestbook heading, moderation note, and where submissions are stored. */
export function GuestbookIntro({
  storageLabel,
  storagePath,
}: GuestbookIntroProps) {
  return (
    <section className="section" aria-labelledby="guestbook-heading">
      <h1 className="section-heading" id="guestbook-heading">
        leave a note
      </h1>
      <p className="section-intro">
        Say hello, share a thought, or leave project feedback. Sign in with
        Google and the note keeps your first name. Your email is never stored.
        Notes appear here once approved.
      </p>

      <div className="callout" role="note">
        <p>
          <strong>Storage mode:</strong> {storageLabel} Path:{" "}
          <code>{storagePath}</code>.
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
  );
}
