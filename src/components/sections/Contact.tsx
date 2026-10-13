import { contacts, phoneHref } from "@/content/site";
import { LeadForm } from "../LeadForm";
import { Mail, Phone } from "../icons";
import { Section, SectionHeading } from "../Section";
import type { Tone } from "../Section";

export function Contact({ tone }: { tone: Tone }) {
  const hasContacts = Boolean(contacts.email || contacts.phone);
  return (
    <Section id="contact" tone={tone} labelledBy="contact-title">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
        <div className="flex flex-col gap-8 lg:col-span-5">
          <SectionHeading
            id="contact-title"
            eyebrow="Обсудить задачу"
            title="Расскажите, какую задачу нужно решить"
            lead="Подберём конфигурацию, обсудим поставку или определим состав инженерных работ."
          />
          <div className="reveal flex flex-col gap-3">
            {contacts.email && (
              <a href={`mailto:${contacts.email}`} className="inline-flex min-h-12 items-center gap-3 font-semibold hover:text-accent-600">
                <span className="flex size-10 items-center justify-center rounded-full bg-accent-50 text-accent-600">
                  <Mail className="size-5" />
                </span>
                {contacts.email}
              </a>
            )}
            {contacts.phone && (
              <a href={phoneHref(contacts.phone)} className="inline-flex min-h-12 items-center gap-3 font-semibold hover:text-accent-600">
                <span className="flex size-10 items-center justify-center rounded-full bg-accent-50 text-accent-600">
                  <Phone className="size-5" />
                </span>
                {contacts.phone}
              </a>
            )}
            {!hasContacts && <p className="text-muted">Основной способ связи — форма: опишите задачу, и мы свяжемся с вами по указанным контактам.</p>}
          </div>
        </div>
        <div className="reveal lg:col-span-7">
          <LeadForm />
        </div>
      </div>
    </Section>
  );
}
