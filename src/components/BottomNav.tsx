"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string; icon: React.ReactNode };

const ITEMS: Item[] = [
  {
    href: "/",
    label: "홈",
    icon: (
      <>
        <path d="M3 10.5L12 3l9 7.5" />
        <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
      </>
    ),
  },
  {
    href: "/teams",
    label: "팀별 현황",
    icon: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <circle cx="17.5" cy="9" r="2.3" />
        <path d="M16 14.4c2.5.5 4.5 2.6 4.5 5.6" />
      </>
    ),
  },
  {
    href: "/tasks",
    label: "할 일",
    icon: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
        <path d="M8 12l2.5 2.5L16.5 8.5" />
      </>
    ),
  },
  {
    href: "/schedule",
    label: "일정",
    icon: (
      <>
        <rect x="3.5" y="4.5" width="17" height="16" rx="4" />
        <path d="M3.5 9.5h17M8 2.5v4M16 2.5v4" />
      </>
    ),
  },
  {
    href: "/resources",
    label: "자료",
    icon: (
      <path d="M3.5 7a2 2 0 0 1 2-2h3.8l2 2H18.5a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" />
    ),
  },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-[env(safe-area-inset-bottom)]">
      <div className="mb-3 flex w-full max-w-[460px] items-stretch justify-around rounded-[22px] border border-[#EAE3D5] bg-white/93 px-2 py-2 shadow-[0_10px_30px_-12px_rgba(38,52,46,0.35)] backdrop-blur-md">
        {ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className="flex flex-1 flex-col items-center gap-1 py-1"
              style={{ color: active ? "#2F5D50" : "#ABA597" }}
            >
              <svg
                width="23"
                height="23"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={active ? 2.4 : 1.9}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {item.icon}
              </svg>
              <span
                className="text-[10px]"
                style={{ fontWeight: active ? 800 : 600 }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
