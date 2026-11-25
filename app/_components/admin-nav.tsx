"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

const items = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/info", label: "교회 정보·SNS" },
  { href: "/admin/about", label: "표어·교회 소개" },
  { href: "/admin/worship", label: "예배 시간" },
  { href: "/admin/videos", label: "온라인 예배" },
  { href: "/admin/posts", label: "소식·주보·댓글" },
  { href: "/admin/members", label: "회원" },
];

function Links({ path }: { path: string }) {
  return (
    <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
      {items.map(({ href, label }) => (
        <li key={href} className="shrink-0">
          <Link
            href={href}
            aria-current={path === href ? "page" : undefined}
            className="block whitespace-nowrap rounded-full px-4 py-2 text-sm hover:bg-mocha/10 aria-[current=page]:bg-mocha aria-[current=page]:text-champagne"
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Active() {
  return <Links path={usePathname()} />;
}

export default function AdminNav() {
  return (
    <nav aria-label="관리자 메뉴">
      <p className="mb-3 hidden font-serif text-2xl lg:block">관리자</p>
      <Suspense fallback={<Links path="" />}>
        <Active />
      </Suspense>
    </nav>
  );
}
