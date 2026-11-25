// The church's open-door-and-cross mark, redrawn in the site palette.
export default function Logo({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path d="M4 4.5 15.4 6v22L4 29.5Z" fill="var(--color-amber)" />
      <path d="M16.6 8 28 6.5V31l-11.4-1.6Z" fill="var(--color-champagne)" />
      <path d="M12.6 7.5h2.8v19.2h-2.8zM7 12.4h12.6v2.7H7z" fill="var(--color-mocha-deep)" />
    </svg>
  );
}
