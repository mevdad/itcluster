import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { company, contacts, getNav, requisitesView } from "@/content/site";

export const metadata: Metadata = {
  title: "Политика обработки данных",
};

// The wording is neutral on purpose: no operator details, retention periods or service names are invented here.
// The lawyer-approved text and the operator's details are tracked in docs/CONTENT-TODO.md.

export default function PrivacyPage() {
  return (
    <>
      <Header items={getNav()} />
      <main id="main" className="pt-[calc(var(--header-h)+40px)] pb-16">
        <article className="container-x max-w-3xl">
          <h1 className="h-section">Политика обработки персональных данных</h1>
          <div className="mt-8 flex flex-col gap-6 text-ink-soft">
            <section>
              <h2 className="h-card text-ink">Оператор</h2>
              <p className="mt-2">
                {company.name}.{" "}
                {requisitesView ? requisitesView.lines.join(", ") : "Полное наименование и реквизиты оператора предоставляем по запросу."}
              </p>
            </section>
            <section>
              <h2 className="h-card text-ink">Какие данные мы получаем</h2>
              <p className="mt-2">Через форму на сайте: имя, название компании (по желанию), телефон или email, описание задачи и файл технического задания (по желанию).</p>
            </section>
            <section>
              <h2 className="h-card text-ink">Зачем мы их используем</h2>
              <p className="mt-2">Чтобы ответить на обращение, подобрать конфигурацию, обсудить поставку или состав инженерных работ. Данные не используются для других целей без вашего согласия.</p>
            </section>
            <section>
              <h2 className="h-card text-ink">Как данные передаются</h2>
              <p className="mt-2">Заявка передаётся сотрудникам компании через канал приёма обращений (мессенджер или система учёта обращений). Сведения о сервисах, через которые проходит заявка, и о сроках хранения данных предоставляем по запросу.</p>
            </section>
            <section>
              <h2 className="h-card text-ink">Ваши права</h2>
              <p className="mt-2">
                Вы можете запросить уточнение, блокирование или удаление данных и отозвать согласие, написав нам
                {contacts.email ? (
                  <>
                    {" "}
                    на{" "}
                    <a className="font-semibold text-accent-600 underline" href={`mailto:${contacts.email}`}>
                      {contacts.email}
                    </a>
                  </>
                ) : (
                  <>
                    {" "}
                    через{" "}
                    <Link className="font-semibold text-accent-600 underline" href="/#contact">
                      форму обращения
                    </Link>
                  </>
                )}
                .
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
