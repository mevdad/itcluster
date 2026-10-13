import { demo } from "@/lib/config";

/** Marks content that exists only in the demo build. Renders nothing in a real build. */
export function DemoNote({ children, className = "" }: { children: string; className?: string }) {
  if (!demo) return null;
  return <p className={`inline-flex w-fit items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 ${className}`}>Демо · {children}</p>;
}
