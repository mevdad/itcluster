import { confirmed } from "@/content/site";
import Link from "next/link";
import { economicsEnabled } from "@/lib/config";
import { DemoNote } from "../DemoNote";
import { DirectionLink } from "../DirectionLink";
import { Illustration } from "../Illustration";
import { ArrowRight } from "../icons";
import { Section } from "../Section";
import type { Tone } from "../Section";

export function Partners({ tone }: { tone: Tone }) {
  return (
    <Section id="partners" tone={tone} labelledBy="partners-title">
      <div className="reveal grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-6">
        <div className="flex flex-col items-start gap-5 lg:col-span-7">
          <DemoNote>строка про проекты расширения включена для показа и не подтверждена</DemoNote>
          <h2 id="partners-title" className="h-section">
            Партнёрам
          </h2>
          <p className="lead">
            Рассматриваем сотрудничество с поставщиками оборудования, интеграторами и партнёрами по развитию вычислительной инфраструктуры.
            {confirmed.investmentSearch && " Информацию о проектах расширения предоставляем по запросу."}
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <DirectionLink direction="partners" prefill="Предлагаем сотрудничество. О нас и предложении: " className="btn btn-dark">
              Предложить сотрудничество
            </DirectionLink>
            <DirectionLink direction="partners" prefill="Прошу прислать материалы о развитии. Организация и интерес: " className="btn btn-secondary">
              Запросить материалы о развитии
            </DirectionLink>
          </div>
          {economicsEnabled && (
            <Link href="/economics/" className="link-arrow">
              Экономика стека и тарифы
              <ArrowRight className="size-5" />
            </Link>
          )}
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <Illustration id="img-18" badge className="rounded-3xl" />
        </div>
      </div>
    </Section>
  );
}
