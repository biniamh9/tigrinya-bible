"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Home", glyph: "⌂" },
  { href: "/bible", label: "Bible", glyph: "▤" },
  { href: "/groups", label: "Groups", glyph: "◉" },
  { href: "/prayer", label: "Prayer", glyph: "♡" },
] as const;

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-10 border-t border-[var(--border)] bg-white/95 backdrop-blur">
      <ul className="mx-auto grid max-w-2xl grid-cols-4 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {items.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link href={item.href} aria-current={active ? "page" : undefined} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-xs font-medium ${active ? "bg-emerald-50 text-[var(--brand)]" : "text-[var(--muted)]"}`}>
                <span aria-hidden="true" className="text-xl leading-none">{item.glyph}</span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
