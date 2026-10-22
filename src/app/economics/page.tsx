import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { DirectionLink } from "@/components/DirectionLink";
import { StackEconomics } from "@/components/economics/StackEconomics";
import { TariffCards } from "@/components/economics/TariffCards";
import { ArrowRight } from "@/components/icons";
import { Section, SectionHeading } from "@/components/Section";
import { Contact } from "@/components/sections/Contact";
import { economicsAsOf, pricesAreExample } from "@/content/economics";
import { getNav } from "@/content/site";
import { economicsEnabled } from "@/lib/config";
import { formatDateRu } from "@/lib/ru";

export const metadata: Metadata = {
  title: "Экономика: тарифы и расчёт стека",
  description: "Тарифы на аренду GPU NVIDIA H200 и модельный расчёт экономики стека.",
  // Example numbers: keep out of search until they are replaced with real ones.
  robots: pricesAreExample ? { index: false, follow: true } : undefined,
};

export default function EconomicsPage() {
  if (!economicsEnabled) notFound();
  return (
    <>
      <Header items={getNav()} />
      <main id="main" className="pt-(--header-h)">
        <Section tone="base" labelledBy="eco-title">
          <div className="flex flex-col items-start gap-4 pt-6">
            <span className="eyebrow">Экономика</span>
            <h1 id="eco-title" className="h-hero max-w-4xl">
              Тарифы и экономика вычислений
            </h1>
            <p className="lead">Сколько стоит аренда NVIDIA H200 и как считается экономика стека из восьми карт. Все итоги ниже считаются из исходных цен.</p>
            <p className="text-sm text-muted">Данные на {formatDateRu(economicsAsOf)}</p>
            {pricesAreExample && (
              <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
                Цены и тарифы на этой странице примерные (макет): перед публикацией они заменяются реальными.
              </p>
            )}
          </div>
        </Section>

        <Section id="tariffs" tone="alt" labelledBy="tariffs-title">
          <SectionHeading
            id="tariffs-title"
            eyebrow="Тарифы"
            title="Аренда H200: от одной карты до кластера"
            lead="Цена всегда указана за ту же единицу аренды, что и в предложении: отдельный GPU, сервер (стек) целиком или кластер."
          />
          <div className="mt-10">
            <TariffCards />
          </div>
          <p className="reveal mt-6 max-w-3xl text-sm text-muted">Месяц считается как 30 суток непрерывной аренды. Скидки за срок и объём в примере не заложены.</p>
        </Section>

        <Section id="stack" tone="base" labelledBy="stack-title">
          <SectionHeading
            id="stack-title"
            eyebrow="Экономика стека"
            title="Что стоит стек из восьми H200 и что он приносит"
            lead="Модельный расчёт: из чего складывается стоимость, какую выручку даёт аренда по тарифу «GPU» и сколько остаётся после расходов."
          />
          <div className="mt-10">
            <StackEconomics />
          </div>
          <div className="reveal mt-8 grid grid-cols-1 gap-4 rounded-3xl bg-fog-100 p-6 text-[15px] text-ink-soft sm:p-8 md:grid-cols-2">
            <div>
              <h3 className="font-bold text-ink">Допущения</h3>
              <ul className="mt-2 list-disc pl-5">
                <li>цены закупки и ставка аренды — из примера;</li>
                <li>загрузка и часы работы одинаковы весь год;</li>
                <li>амортизация линейная, 10% в год.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-ink">Не учтено</h3>
              <ul className="mt-2 list-disc pl-5">
                <li>налоги и стоимость площадки;</li>
                <li>персонал, простои и резервирование;</li>
                <li>изменение курса и цен на оборудование.</li>
              </ul>
            </div>
            <p className="font-semibold text-ink md:col-span-2">Расчёт модельный, не является офертой, гарантией или обещанием доходности. Результат зависит от реальной загрузки и условий.</p>
          </div>
        </Section>

        <Section tone="alt" labelledBy="eco-cta-title">
          <div className="reveal flex flex-col items-start gap-5">
            <h2 id="eco-cta-title" className="h-section max-w-3xl">
              Посчитаем под вашу нагрузку
            </h2>
            <p className="lead">Расскажите о задаче: подберём тариф и пришлём расчёт с вашими параметрами.</p>
            <DirectionLink direction="rent" prefill="Прошу рассчитать стоимость под нашу нагрузку. Модель, объём и срок: " className="btn btn-primary">
              Запросить расчёт
              <ArrowRight className="size-5" />
            </DirectionLink>
          </div>
        </Section>

        <Contact tone="base" />
      </main>
      <Footer />
    </>
  );
}
