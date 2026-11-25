import { getContent } from "../_lib/content";

// Line icons in the site palette (brand colours would add new hues to the 6:3:1 scheme).
const ICONS = {
  youtube: {
    label: "유튜브",
    path: (
      <>
        <rect x="3" y="6" width="18" height="12" rx="3.5" />
        <path d="m10.5 9.5 4 2.5-4 2.5z" fill="currentColor" stroke="none" />
      </>
    ),
  },
  instagram: {
    label: "인스타그램",
    path: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="4.5" />
        <circle cx="12" cy="12" r="3.6" />
        <circle cx="16.9" cy="7.1" r="0.9" fill="currentColor" stroke="none" />
      </>
    ),
  },
  threads: {
    label: "쓰레드",
    path: <path d="M16.2 11.3c-.4-2.4-2-3.6-4.2-3.6-2.5 0-4.1 1.8-4.1 4.3s1.6 4.4 4.3 4.4c2 0 3.3-1.1 3.3-2.7 0-2.5-2.9-2.8-4.6-2.3M19.5 9.6C18.6 6 15.8 4 12.1 4 7.3 4 4.5 7.3 4.5 12s2.8 8 7.6 8c3.7 0 6.6-2 7.2-5" />,
  },
  kakao: {
    label: "카카오톡 채널",
    path: (
      <>
        <path d="M12 5c-4.7 0-8.5 2.9-8.5 6.6 0 2.3 1.5 4.4 3.9 5.6l-.8 3 3.4-2.2c.6.1 1.3.2 2 .2 4.7 0 8.5-2.9 8.5-6.6S16.7 5 12 5Z" />
        <path d="M9 10v3.4M14.6 10v3.4M14.6 11.7l1.9-1.7M15.4 11.4l1.4 2" />
      </>
    ),
  },
} as const;

export default async function SocialLinks() {
  const { church, social } = await getContent();
  const links = (Object.keys(ICONS) as (keyof typeof ICONS)[]).filter((k) => social[k]);
  if (!links.length) return null;
  return (
    <nav aria-label="교회 SNS" className="fixed right-[clamp(10px,1.6vw,24px)] top-1/2 z-40 -translate-y-1/2">
      <ul className="flex flex-col gap-2.5">
        {links.map((k) => (
          <li key={k}>
            <a
              href={social[k]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${church.name} ${ICONS[k].label} (새 창)`}
              title={ICONS[k].label}
              className="grid size-[clamp(36px,5svh,44px)] place-items-center rounded-full border border-champagne/25 bg-mocha-deep/80 text-champagne shadow-[0_8px_20px_-8px_rgb(12_8_4/0.7)] backdrop-blur transition-colors hover:border-amber hover:bg-amber hover:text-mocha-night"
            >
              <svg viewBox="0 0 24 24" className="size-[52%]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                {ICONS[k].path}
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
