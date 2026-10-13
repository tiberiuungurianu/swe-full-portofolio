/** One original decorative motif used sparingly — a faint ruled understroke. */
export function DecorativeMotif({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`motif ${className}`.trim()}
      viewBox="0 0 120 12"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M2 7c18-4 38-4 58 0s40 4 58 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <circle cx="60" cy="6.5" r="1.4" fill="currentColor" />
    </svg>
  );
}
