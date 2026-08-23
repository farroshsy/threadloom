/**
 * THREADLOOM DESIGN REMINDER — The domain is quiet, tactile, and human-first.
 * It models meaningful unfinished context, never productivity pressure.
 */

export type ThreadState = "open" | "resting" | "resolved";
export type ThreadOrigin = "sample" | "personal";

export type Thread = {
  id: string;
  title: string;
  why: string;
  tags: string[];
  state: ThreadState;
  createdAt: string;
  lastVisitedAt: string;
  cue?: string;
  origin: ThreadOrigin;
};

export type NewThreadInput = Pick<Thread, "title" | "why" | "tags" | "cue"> & {
  state?: Extract<ThreadState, "open" | "resting">;
};

export const STATE_LABELS: Record<ThreadState, string> = {
  open: "open thread",
  resting: "set aside",
  resolved: "woven in",
};

export function createThread(input: NewThreadInput): Thread {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    why: input.why.trim() || "A note for the person who returns to this.",
    tags: input.tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean).slice(0, 4),
    cue: input.cue?.trim(),
    state: input.state ?? "open",
    createdAt: now,
    lastVisitedAt: now,
    origin: "personal",
  };
}

export function transitionThread(thread: Thread, state: ThreadState): Thread {
  return { ...thread, state, lastVisitedAt: new Date().toISOString() };
}

export function touchThread(thread: Thread): Thread {
  return { ...thread, lastVisitedAt: new Date().toISOString() };
}

export function ageInDays(isoDate: string, now = new Date()): number {
  return Math.max(0, Math.floor((now.getTime() - new Date(isoDate).getTime()) / 86_400_000));
}

export function formatAge(thread: Thread): string {
  const days = ageInDays(thread.createdAt);
  if (days === 0) return "today";
  if (days === 1) return "one day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "one week ago";
  if (days < 60) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

export function getReturnSet(threads: Thread[]): Thread[] {
  const order: Record<ThreadState, number> = { open: 0, resting: 1, resolved: 2 };
  return [...threads]
    .sort((a, b) => order[a.state] - order[b.state] || a.lastVisitedAt.localeCompare(b.lastVisitedAt))
    .slice(0, 3);
}
