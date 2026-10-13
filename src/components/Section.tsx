import type { ReactNode } from "react";

export type Tone = "base" | "alt" | "dark";

interface Props {
  id?: string;
  tone: Tone;
  labelledBy?: string;
  className?: string;
  children: ReactNode;
}

export function Section({ id, tone, labelledBy, className = "", children }: Props) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`section tone-${tone} ${tone === "dark" ? "on-dark" : ""} ${className}`}>
      <div className="container-x">{children}</div>
    </section>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  className = "",
}: {
  id: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  className?: string;
}) {
  return (
    <div className={`reveal flex flex-col items-start gap-4 ${className}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 id={id} className="h-section max-w-4xl">
        {title}
      </h2>
      {lead && <p className="lead">{lead}</p>}
    </div>
  );
}
