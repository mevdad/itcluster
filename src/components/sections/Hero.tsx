import { ArrowRight } from "../icons";
import { DemoNote } from "../DemoNote";
import { Illustration } from "../Illustration";

export function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="tone-dark on-dark relative overflow-hidden pt-[calc(var(--header-h)+40px)] pb-14 md:pb-20 md:pt-[calc(var(--header-h)+56px)]">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 -left-40 size-[640px] rounded-full bg-accent-500/20 blur-[140px]" />
      <div className="container-x relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[55fr_45fr] lg:gap-12">
        <div className="flex flex-col items-start gap-6 lg:pr-6">
          <DemoNote>показаны все блоки сайта, включая неподтверждённые; данные в [скобках] — заглушки</DemoNote>
          <span className="eyebrow">Вычислительная инфраструктура и поставка оборудования</span>
          <h1 id="hero-title" className="h-hero">
            ИИ-инфраструктура для задач вашего бизнеса
          </h1>
          <p className="lead">
            Предоставляем GPU-серверы в аренду, поставляем оборудование из Китая, выполняем настройку и сопровождаем эксплуатацию. Помогаем пройти путь от технической задачи до работающей системы.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a href="#contact" className="btn btn-primary">
              Обсудить задачу
              <ArrowRight className="size-5" />
            </a>
            <a href="#infrastructure" className="btn btn-secondary">
              Посмотреть инфраструктуру
            </a>
          </div>
          <p className="text-sm font-medium text-on-dark-muted">Аренда вычислительных мощностей · Поставка оборудования · Инженерное сопровождение</p>
        </div>
        <div className="rounded-[1.75rem] border border-white/10 bg-graphite-800 p-2 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.7)]">
          <Illustration id="img-01" priority badge="Визуализация" className="rounded-[1.25rem]" />
        </div>
      </div>
    </section>
  );
}
