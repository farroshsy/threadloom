/**
 * THREADLOOM DESIGN REMINDER — Tests protect humane context behavior, not productivity mechanics.
 */

import { describe, expect, it } from "vitest";
import { ageInDays, getReturnSet, transitionThread, type Thread } from "./domain";

function thread(id: string, state: Thread["state"], lastVisitedAt: string): Thread {
  return {
    id,
    title: id,
    why: "why it matters",
    tags: [],
    state,
    createdAt: "2026-08-01T00:00:00.000Z",
    lastVisitedAt,
    origin: "personal",
  };
}

describe("thread domain", () => {
  it("prioritizes open, least-recently-visited strands for a gentle return", () => {
    const result = getReturnSet([
      thread("resting", "resting", "2026-08-01T00:00:00.000Z"),
      thread("new-open", "open", "2026-08-20T00:00:00.000Z"),
      thread("old-open", "open", "2026-08-03T00:00:00.000Z"),
      thread("resolved", "resolved", "2026-08-01T00:00:00.000Z"),
    ]);

    expect(result.map((item) => item.id)).toEqual(["old-open", "new-open", "resting"]);
  });

  it("records state transitions as a fresh interaction", () => {
    const original = thread("one", "open", "2026-08-01T00:00:00.000Z");
    const updated = transitionThread(original, "resolved");

    expect(updated.state).toBe("resolved");
    expect(updated.lastVisitedAt).not.toBe(original.lastVisitedAt);
    expect(original.state).toBe("open");
  });

  it("calculates whole days without returning a negative age", () => {
    expect(ageInDays("2026-08-20T00:00:00.000Z", new Date("2026-08-23T00:00:00.000Z"))).toBe(3);
    expect(ageInDays("2026-08-24T00:00:00.000Z", new Date("2026-08-23T00:00:00.000Z"))).toBe(0);
  });
});
