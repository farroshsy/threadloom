/**
 * THREADLOOM DESIGN REMINDER — The domain is quiet, tactile, and human-first.
 * It models meaningful unfinished context, never productivity pressure.
 */

export type ThreadState = "open" | "resting" | "resolved";
export type ThreadOrigin = "sample" | "personal";

export type ResurfacingSettings = {
  eligibleStates: ThreadState[];
  minimumDaysSinceVisit: 3 | 7 | 14 | 30;
  includeCueBonus: boolean;
  setSize: 1 | 2 | 3 | 4 | 5;
};

export type ReturnCandidate = {
  thread: Thread;
  score: number;
  reasons: string[];
};

export type ThreadSearchFilters = {
  query: string;
  state: "all" | ThreadState;
  tag: "all" | string;
  sort: "recent" | "oldest" | "newest" | "title";
};

export const DEFAULT_THREAD_SEARCH_FILTERS: ThreadSearchFilters = {
  query: "",
  state: "all",
  tag: "all",
  sort: "recent",
};

export const DEFAULT_RESURFACING_SETTINGS: ResurfacingSettings = {
  eligibleStates: ["open", "resting"],
  minimumDaysSinceVisit: 7,
  includeCueBonus: true,
  setSize: 3,
};

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

export function isThread(value: unknown): value is Thread {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<Thread>;
  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.why === "string" &&
    Array.isArray(item.tags) &&
    item.tags.every((tag) => typeof tag === "string") &&
    typeof item.createdAt === "string" &&
    typeof item.lastVisitedAt === "string" &&
    (item.state === "open" || item.state === "resting" || item.state === "resolved") &&
    (item.origin === "sample" || item.origin === "personal")
  );
}

export function isResurfacingSettings(value: unknown): value is ResurfacingSettings {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<ResurfacingSettings>;
  const permittedIntervals = [3, 7, 14, 30];
  const permittedSizes = [1, 2, 3, 4, 5];
  return (
    Array.isArray(item.eligibleStates) &&
    item.eligibleStates.every((state) => state === "open" || state === "resting" || state === "resolved") &&
    permittedIntervals.includes(item.minimumDaysSinceVisit ?? -1) &&
    typeof item.includeCueBonus === "boolean" &&
    permittedSizes.includes(item.setSize ?? -1)
  );
}

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

export function getReturnCandidates(
  threads: Thread[],
  settings: ResurfacingSettings = DEFAULT_RESURFACING_SETTINGS,
  now = new Date(),
): ReturnCandidate[] {
  return threads
    .filter((thread) => settings.eligibleStates.includes(thread.state))
    .map((thread) => {
      const daysAway = ageInDays(thread.lastVisitedAt, now);
      const reasons = [`You have not visited it for ${daysAway === 1 ? "one day" : `${daysAway} days`}.`];
      let score = daysAway;

      if (thread.state === "open") {
        score += 100;
        reasons.unshift("It is still an open thread.");
      } else if (thread.state === "resting") {
        score += 50;
        reasons.unshift("You set it aside rather than closing it.");
      } else {
        reasons.unshift("You chose to include woven-in strands.");
      }

      if (thread.cue && settings.includeCueBonus) {
        score += 4;
        reasons.push("You left a return cue for this strand.");
      }

      return { thread, score, reasons };
    })
    .filter((candidate) => ageInDays(candidate.thread.lastVisitedAt, now) >= settings.minimumDaysSinceVisit)
    .sort((a, b) => b.score - a.score || a.thread.lastVisitedAt.localeCompare(b.thread.lastVisitedAt))
    .slice(0, settings.setSize);
}

export function getReturnSet(threads: Thread[], settings: ResurfacingSettings = DEFAULT_RESURFACING_SETTINGS): Thread[] {
  return getReturnCandidates(threads, settings).map((candidate) => candidate.thread);
}

export function filterThreads(threads: Thread[], filters: ThreadSearchFilters): Thread[] {
  const needle = filters.query.trim().toLocaleLowerCase();
  return threads
    .filter((thread) => {
      const haystack = [thread.title, thread.why, thread.cue ?? "", ...thread.tags].join(" ").toLocaleLowerCase();
      const matchesQuery = !needle || haystack.includes(needle);
      const matchesState = filters.state === "all" || thread.state === filters.state;
      const matchesTag = filters.tag === "all" || thread.tags.includes(filters.tag);
      return matchesQuery && matchesState && matchesTag;
    })
    .sort((a, b) => {
      if (filters.sort === "oldest") return a.createdAt.localeCompare(b.createdAt);
      if (filters.sort === "newest") return b.createdAt.localeCompare(a.createdAt);
      if (filters.sort === "title") return a.title.localeCompare(b.title);
      return b.lastVisitedAt.localeCompare(a.lastVisitedAt);
    });
}
