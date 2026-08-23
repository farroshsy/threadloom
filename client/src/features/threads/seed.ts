/**
 * THREADLOOM DESIGN REMINDER — Seed data is visibly illustrative, never presented as a user history.
 */

import type { Thread } from "./domain";

export const illustrativeThreads: Thread[] = [
  {
    id: "sample-bench",
    title: "The bench behind the old library",
    why: "You wanted to notice whether this is still where you think best without a screen.",
    tags: ["place", "thinking"],
    state: "open",
    createdAt: "2026-08-12T09:00:00.000Z",
    lastVisitedAt: "2026-08-12T09:00:00.000Z",
    cue: "When you need a longer answer than a search box can give.",
    origin: "sample",
  },
  {
    id: "sample-repair",
    title: "Ask Mara about repairing the blue kettle",
    why: "It is less about the kettle than learning how she keeps old objects alive.",
    tags: ["person", "repair"],
    state: "resting",
    createdAt: "2026-08-05T09:00:00.000Z",
    lastVisitedAt: "2026-08-06T09:00:00.000Z",
    cue: "The next time you make tea together.",
    origin: "sample",
  },
  {
    id: "sample-article",
    title: "Return to the essay about patient cities",
    why: "A sentence about public benches kept following you after reading it.",
    tags: ["reading", "idea"],
    state: "open",
    createdAt: "2026-07-25T09:00:00.000Z",
    lastVisitedAt: "2026-07-29T09:00:00.000Z",
    cue: "When choosing what to make room for next month.",
    origin: "sample",
  },
  {
    id: "sample-film",
    title: "Find the name of that quiet film score",
    why: "It made a rainy afternoon feel like a place you could revisit.",
    tags: ["music", "memory"],
    state: "resolved",
    createdAt: "2026-07-10T09:00:00.000Z",
    lastVisitedAt: "2026-07-15T09:00:00.000Z",
    origin: "sample",
  },
];
