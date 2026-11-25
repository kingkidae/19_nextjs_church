"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { nav } from "../_lib/church";

type Props = { className?: string; itemClassName?: string };

// pathname is request data, so it streams in; the fallback is the same list without highlight
export default function NavLinks(props: Props) {
  return (
    <Suspense fallback={<Links {...props} path="" />}>
      <ActiveLinks {...props} />
    </Suspense>
  );
}

function ActiveLinks(props: Props) {
  return <Links {...props} path={usePathname()} />;
}

function Links({ className, itemClassName, path }: Props & { path: string }) {
  return (
    <ul className={className}>
      {nav.map(({ href, label }) => (
        <li key={href}>
          <Link
            href={href}
            aria-current={path.startsWith(href) ? "page" : undefined}
            className={itemClassName}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

// Mobile full-screen menu. Popover gives open/close/Esc for free; links close it on click.
export function MobileMenu({ children }: { children?: React.ReactNode }) {
  return (
    <div
      id="site-menu"
      popover="auto"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a")) e.currentTarget.hidePopover();
      }}
      className="menu-panel fixed inset-0 m-0 h-svh w-full bg-mocha-night p-[var(--gutter)] text-champagne"
    >
      <div className="flex h-[var(--nav-h)] items-center justify-end">
        <button popoverTarget="site-menu" popoverTargetAction="hide" className="px-2 py-1 text-sm">
          닫기
        </button>
      </div>
      <NavLinks
        className="mt-[4svh] space-y-[2.2svh]"
        itemClassName="font-serif text-[clamp(1.75rem,5.5svh,3rem)] aria-[current=page]:text-amber"
      />
      <div className="absolute inset-x-[var(--gutter)] bottom-[6svh] flex gap-5 text-sm">{children}</div>
    </div>
  );
}
