/**
 * THREADLOOM DESIGN REMINDER — Persistence is private, replaceable, and separate from the interface.
 */

import type { Thread } from "./domain";
import { illustrativeThreads } from "./seed";

const STORAGE_KEY = "threadloom.threads.v1";

function isThread(value: unknown): value is Thread {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<Thread>;
  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.why === "string" &&
    Array.isArray(item.tags) &&
    typeof item.createdAt === "string" &&
    typeof item.lastVisitedAt === "string" &&
    (item.state === "open" || item.state === "resting" || item.state === "resolved") &&
    (item.origin === "sample" || item.origin === "personal")
  );
}

export function loadThreads(): Thread[] {
  if (typeof window === "undefined") return illustrativeThreads;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return illustrativeThreads;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.every(isThread) ? parsed : illustrativeThreads;
  } catch {
    return illustrativeThreads;
  }
}

export function saveThreads(threads: Thread[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
}
