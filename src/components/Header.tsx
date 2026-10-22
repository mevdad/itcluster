"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Close, Menu } from "./icons";
import { Logo } from "./Logo";
import { DirectionLink } from "./DirectionLink";
import type { NavItem } from "@/content/site";

interface Props {
  items: readonly NavItem[];
  /** True on pages that start with the dark hero: the header is transparent-dark until the hero scrolls away. */
  overHero?: boolean;
}

export function Header({ items, overHero = false }: Props) {
  const [open, setOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!overHero) return;
    const hero = document.getElementById("hero");
    if (!hero) return;
    const header = document.getElementById("site-header");
    const offset = header?.offsetHeight ?? 72;
    // Observing the hero (not scroll events): no work on every scroll tick, no layout reads.
    const io = new IntersectionObserver(([entry]) => setPastHero(!entry?.isIntersecting), { rootMargin: `-${offset}px 0px 0px 0px` });
    io.observe(hero);
    return () => io.disconnect();
  }, [overHero]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const dark = overHero && !pastHero && !open;
  const close = () => setOpen(false);

  return (
    <header
      id="site-header"
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        dark ? "on-dark bg-graphite-900/70 text-white backdrop-blur-md" : "border-b border-fog-200 bg-white/90 text-ink backdrop-blur-md"
      }`}
    >
      <div className="container-x flex h-(--header-h) items-center justify-between gap-6">
        <Logo />
        <nav aria-label="Основная навигация" className="hidden items-center gap-7 text-[15px] font-medium lg:flex">
          {items.map((item) => (
            <Link key={item.id} href={item.href ?? `/#${item.id}`} className={dark ? "text-white/80 hover:text-white" : "text-ink-soft hover:text-accent-600"}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <DirectionLink direction="complex" className="btn btn-primary hidden sm:inline-flex">
            Обсудить задачу
          </DirectionLink>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex size-12 items-center justify-center rounded-full lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <Close className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>
      <div id="mobile-menu" hidden={!open} className="max-h-[calc(100svh-var(--header-h))] overflow-y-auto border-t border-fog-200 bg-white text-ink lg:hidden">
        <nav aria-label="Мобильная навигация" className="container-x flex flex-col py-3">
          {items.map((item) => (
            <Link key={item.id} href={item.href ?? `/#${item.id}`} onClick={close} className="flex min-h-14 items-center border-b border-fog-200 text-lg font-semibold">
              {item.label}
            </Link>
          ))}
          <DirectionLink direction="complex" onNavigate={close} className="btn btn-primary mt-4 mb-2 w-full">
            Обсудить задачу
          </DirectionLink>
        </nav>
      </div>
    </header>
  );
}
