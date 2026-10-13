type DecorativeMotifProps = {
  className?: string;
};

/** Faint ruled underline used as a spare decoration. Hidden from screen readers. */
export function DecorativeMotif({ className = "" }: DecorativeMotifProps) {
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
