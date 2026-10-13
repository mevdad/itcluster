import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "./globals.css";
import { company } from "@/content/site";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: { default: `${company.name} — ИИ-инфраструктура, аренда GPU-серверов и поставка оборудования`, template: `%s — ${company.name}` },
  description: "Предоставляем GPU-серверы в аренду, поставляем оборудование из Китая, выполняем настройку и сопровождаем эксплуатацию. Обсудите задачу с инженерами.",
  openGraph: { type: "website", locale: "ru_RU", siteName: company.name },
};

export const viewport: Viewport = {
  themeColor: "#12161b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <a href="#main" className="sr-only z-[60] rounded-full bg-white px-4 py-3 font-semibold text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
          К содержанию
        </a>
        {children}
      </body>
    </html>
  );
}
