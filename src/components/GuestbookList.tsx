import { formatDisplayDate } from "@/lib/format";
import type { GuestbookMessage } from "@/lib/guestbook/types";

type GuestbookListProps = {
  /** Approved notes only. Pending submissions are filtered out before this list. */
  messages: GuestbookMessage[];
};

/** Renders approved guestbook notes, or an empty state when none are public yet. */
export function GuestbookList({ messages }: GuestbookListProps) {
  if (messages.length === 0) {
    return (
      <div className="empty-state">
        <p>No notes yet. Be the first to sign.</p>
      </div>
    );
  }

  return (
    <ul className="guestbook-list">
      {messages.map((approvedNote) => (
        <li key={approvedNote.id}>
          <article className="guestbook-entry">
            <time dateTime={approvedNote.createdAt}>
              {formatDisplayDate(approvedNote.createdAt)}
            </time>
            <p>
              <span className="guestbook-entry__name">{approvedNote.name}:</span>{" "}
              {approvedNote.message}
            </p>
          </article>
        </li>
      ))}
    </ul>
  );
}
