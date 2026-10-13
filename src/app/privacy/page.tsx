import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { company, contacts, navItems } from "@/content/site";

export const metadata: Metadata = {
  title: "Политика обработки данных",
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <Header items={navItems.filter((i) => i.id !== "projects")} />
      <main id="main" className="pt-[calc(var(--header-h)+40px)] pb-16">
        <article className="container-x max-w-3xl">
          <p className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
            Черновик структуры. Перед публикацией сайта текст должен быть утверждён юристом компании, а данные оператора (наименование, ИНН, адрес) — внесены в блок ниже.
          </p>
          <h1 className="h-section mt-8">Политика обработки персональных данных</h1>
          <div className="mt-8 flex flex-col gap-6 text-ink-soft">
            <section>
              <h2 className="h-card text-ink">Оператор</h2>
              <p className="mt-2">
                {company.name}.{" "}
                {company.requisites ? company.requisites.lines.join(", ") : "Полное наименование и реквизиты оператора будут указаны здесь после подтверждения."}
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
              <p className="mt-2">Заявка передаётся сотрудникам компании через настроенный канал связи (мессенджер или система учёта обращений). Конкретные сервисы и сроки хранения должны быть указаны перед публикацией.</p>
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
                  " по контактам, указанным на сайте"
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
