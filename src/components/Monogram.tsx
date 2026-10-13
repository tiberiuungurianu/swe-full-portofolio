type MonogramProps = {
  className?: string;
  title?: string;
};

export function Monogram({
  className = "h-8 w-8",
  title = "tu monogram",
}: MonogramProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <path
        fill="currentColor"
        d="M10.5 14.2c0-1.4 1.1-2.5 2.5-2.5h10.8c1.4 0 2.5 1.1 2.5 2.5v2.1c0 1.1-.9 2-2 2h-2.8v18.4c0 6.7-4.2 10.6-11.1 10.6-1.5 0-2.7-1.2-2.7-2.7v-1.9c0-1.3 1-2.4 2.3-2.5 2.4-.2 3.8-1.6 3.8-4.3V18.8H13c-1.4 0-2.5-1.1-2.5-2.5v-2.1zM36.2 26.4c6.9 0 11.6 4.5 11.6 12.1 0 7.8-5 12.5-12.4 12.5-7.5 0-12.3-4.8-12.3-12.4 0-7.5 5-12.2 13.1-12.2zm-.7 7.1c-2.9 0-4.6 2.2-4.6 5.2s1.7 5.3 4.6 5.3 4.6-2.2 4.6-5.3-1.7-5.2-4.6-5.2z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M8 52.5c14.5 3.2 33.5 3.1 48 0"
        opacity="0.35"
        aria-hidden="true"
      />
    </svg>
  );
}
