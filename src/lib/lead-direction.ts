"use client";

import { useSyncExternalStore } from "react";
import type { Direction } from "./lead-schema";

// A tiny external store: service cards and CTAs (far from the form in the tree) ask the form to
// preselect a direction. Context would force the whole page client-side; this keeps the sections
// server components.

export interface DirectionRequest {
  direction: Direction | null;
  prefill: string | null;
  nonce: number;
}

const EMPTY: DirectionRequest = { direction: null, prefill: null, nonce: 0 };
let current: DirectionRequest = EMPTY;
const listeners = new Set<() => void>();

export function requestDirection(direction: Direction, prefill?: string): void {
  current = { direction, prefill: prefill ?? null, nonce: current.nonce + 1 };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useDirectionRequest(): DirectionRequest {
  return useSyncExternalStore(subscribe, () => current, () => EMPTY);
}
