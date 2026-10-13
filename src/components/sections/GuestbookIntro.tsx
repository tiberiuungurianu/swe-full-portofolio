/** Guestbook heading and short note about signing with Google. */
export function GuestbookIntro() {
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
    </section>
  );
}
