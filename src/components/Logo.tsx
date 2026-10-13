import Link from "next/link";
import { company } from "@/content/site";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="9" fill="#2f6bff" />
      <rect x="7" y="8" width="18" height="4.4" rx="1.4" fill="#fff" />
      <rect x="7" y="13.8" width="18" height="4.4" rx="1.4" fill="#fff" opacity="0.8" />
      <rect x="7" y="19.6" width="18" height="4.4" rx="1.4" fill="#fff" opacity="0.55" />
      <circle cx="21.6" cy="10.2" r="1" fill="#2f6bff" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label={`${company.name} — на главную`} className={`inline-flex items-center gap-2.5 font-bold tracking-tight ${className}`}>
      <LogoMark className="size-8" />
      <span className="text-lg">{company.name}</span>
    </Link>
  );
}
