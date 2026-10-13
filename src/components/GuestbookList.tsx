import { formatDisplayDate } from "@/lib/format";
import type { GuestbookMessage } from "@/lib/guestbook/types";

type GuestbookListProps = {
  messages: GuestbookMessage[];
};

export function GuestbookList({ messages }: GuestbookListProps) {
  if (messages.length === 0) {
    return (
      <div className="empty-state">
        <p>No approved notes yet. Be the first to leave one.</p>
      </div>
    );
  }

  return (
    <ul className="guestbook-list">
      {messages.map((entry) => (
        <li key={entry.id}>
          <article>
            <header>
              <h3>{entry.name}</h3>
              <time dateTime={entry.createdAt}>
                {formatDisplayDate(entry.createdAt)}
              </time>
            </header>
            <p>{entry.message}</p>
          </article>
        </li>
      ))}
    </ul>
  );
}
