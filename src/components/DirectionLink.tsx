"use client";

import type { ReactNode } from "react";
import { requestDirection } from "@/lib/lead-direction";
import type { Direction } from "@/lib/lead-schema";

interface Props {
  direction: Direction;
  /** Optional starter text for the task field (only used if the visitor has not typed anything yet). */
  prefill?: string;
  /** Extra side effect on click, e.g. closing the mobile menu. */
  onNavigate?: () => void;
  className?: string;
  children: ReactNode;
}

/**
 * A normal anchor to #contact (works without JS, the browser does the scrolling) that additionally tells the
 * form which direction to preselect. This is why it is a Client Component: it needs an onClick handler.
 */
export function DirectionLink({ direction, prefill, onNavigate, className, children }: Props) {
  return (
    <a href="#contact" className={className} onClick={() => {
        requestDirection(direction, prefill);
        onNavigate?.();
      }}>
      {children}
    </a>
  );
}
