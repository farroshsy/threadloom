/**
 * THREADLOOM DESIGN REMINDER — Research remains a readable cabinet of possibilities, not a generic analytics table.
 */

import researchMarkdown from "../../../../docs/concept-research.md?raw";

export type ResearchIdea = {
  number: number;
  name: string;
  concept: string;
  returnValue: string;
  implementation: string;
  score: number;
};

function cellText(value: string): string {
  return value.replaceAll("**", "").trim();
}

export const researchIdeas: ResearchIdea[] = researchMarkdown
  .split("\n")
  .filter((line) => /^\|\s*\d+\s*\|/.test(line))
  .map((line) => line.split("|").slice(1, -1).map((cell) => cellText(cell)))
  .map(([number, name, concept, returnValue, implementation, scoreCell]) => ({
    number: Number(number),
    name,
    concept,
    returnValue,
    implementation,
    score: Number(scoreCell.match(/(\d+)\s*$/)?.[1] ?? 0),
  }))
  .filter((idea) => Number.isFinite(idea.number) && idea.score > 0);
