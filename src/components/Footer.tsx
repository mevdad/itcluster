import Link from "next/link";
import { company, contacts, demoContactPlaceholders, phoneHref, requisitesView } from "@/content/site";
import { Logo } from "./Logo";

const SERVICE_LINKS = [
  { href: "/#services", label: "Аренда GPU-серверов" },
  { href: "/#supply", label: "Поставка оборудования" },
  { href: "/#process", label: "Настройка и сопровождение" },
  { href: "/#ai", label: "Собственный ИИ для компании" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="tone-dark on-dark pt-14 pb-8">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-6">
          <div className="flex flex-col gap-4">
            <Logo className="text-white" />
            <p className="max-w-sm text-[15px] text-on-dark-muted">{company.description}</p>
          </div>
          <nav aria-label="Услуги">
            <h2 className="text-sm font-bold text-white">Услуги</h2>
            <ul className="mt-3 flex flex-col">
              {SERVICE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-11 items-center text-[15px] text-on-dark-muted hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className="text-sm font-bold text-white">Контакты</h2>
            <ul className="mt-3 flex flex-col text-[15px] text-on-dark-muted">
              {contacts.email && (
                <li>
                  <a href={`mailto:${contacts.email}`} className="inline-flex min-h-11 items-center hover:text-white">
                    {contacts.email}
                  </a>
                </li>
              )}
              {contacts.phone && (
                <li>
                  <a href={phoneHref(contacts.phone)} className="inline-flex min-h-11 items-center hover:text-white">
                    {contacts.phone}
                  </a>
                </li>
              )}
              {demoContactPlaceholders && (
                <>
                  <li className="inline-flex min-h-11 items-center">{demoContactPlaceholders.email}</li>
                  <li className="inline-flex min-h-11 items-center">{demoContactPlaceholders.phone}</li>
                </>
              )}
              <li>
                <Link href="/#contact" className="inline-flex min-h-11 items-center hover:text-white">
                  Форма обращения
                </Link>
              </li>
            </ul>
          </div>
          <div id="requisites" className="scroll-mt-24">
            <h2 className="text-sm font-bold text-white">Реквизиты</h2>
            {requisitesView ? (
              <ul className="mt-3 flex flex-col gap-1 text-[15px] text-on-dark-muted">
                {requisitesView.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-[15px] text-on-dark-muted">Реквизиты предоставляем по запросу.</p>
            )}
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-on-dark-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.name}
          </p>
          <ul className="flex flex-wrap gap-x-6">
            <li>
              <Link href="/privacy" className="inline-flex min-h-11 items-center hover:text-white">
                Политика обработки данных
              </Link>
            </li>
            <li>
              <Link href="/#partners" className="inline-flex min-h-11 items-center hover:text-white">
                Партнёрам
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
