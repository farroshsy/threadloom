/**
 * THREADLOOM DESIGN REMINDER — The loom makes unfinished context tangible without becoming a dashboard.
 */

import type { CSSProperties } from "react";
import { Check, Pause, Sparkles } from "lucide-react";
import { STATE_LABELS, type Thread } from "../domain";

type ThreadLoomProps = {
  threads: Thread[];
  selectedId?: string;
  onSelect: (thread: Thread) => void;
};

const positions = [
  [16, 22],
  [44, 15],
  [72, 29],
  [29, 61],
  [58, 52],
  [83, 67],
  [10, 78],
  [48, 84],
  [73, 87],
];

export function ThreadLoom({ threads, selectedId, onSelect }: ThreadLoomProps) {
  return (
    <section className="loom-shell" aria-label="Your current weave">
      <div className="loom-title-row">
        <div>
          <span className="eyebrow">The current weave</span>
          <h2>Loose ends, kept with their context.</h2>
        </div>
        <span className="loom-key"><i /> live attention</span>
      </div>
      <div className="loom-canvas">
        <svg className="loom-lines" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true">
          {Array.from({ length: 24 }, (_, index) => (
            <path key={`warp-${index}`} d={`M ${index * 44 - 60} 0 C ${index * 38 + 40} 145, ${index * 52 - 10} 350, ${index * 44 + 50} 560`} className="warp-line" />
          ))}
          <path d="M -20 136 C 220 56, 405 253, 640 161 S 848 190, 1060 89" className="accent-thread" />
          <path d="M -20 358 C 180 263, 338 420, 530 326 S 770 392, 1045 307" className="charcoal-thread" />
          <path d="M 102 0 C 192 143, 275 264, 184 560" className="faded-thread" />
          <path d="M 701 0 C 618 188, 807 331, 733 560" className="faded-thread" />
        </svg>

        {threads.map((thread, index) => {
          const [left, top] = positions[index % positions.length];
          const style = { "--thread-left": `${left}%`, "--thread-top": `${top}%`, "--thread-delay": `${index * 55}ms` } as CSSProperties;
          const Icon = thread.state === "resolved" ? Check : thread.state === "resting" ? Pause : Sparkles;
          return (
            <button
              type="button"
              className={`thread-node state-${thread.state} ${selectedId === thread.id ? "is-selected" : ""}`}
              key={thread.id}
              style={style}
              onClick={() => onSelect(thread)}
              aria-pressed={selectedId === thread.id}
              aria-label={`${thread.title}, ${STATE_LABELS[thread.state]}`}
            >
              <span className="thread-node-icon"><Icon size={13} strokeWidth={2.2} /></span>
              <span className="thread-node-copy">
                <strong>{thread.title}</strong>
                <small>{thread.tags.slice(0, 2).join(" · ") || STATE_LABELS[thread.state]}</small>
              </span>
            </button>
          );
        })}
        {threads.length === 0 && (
          <div className="loom-empty">
            <span className="loom-empty-mark">+</span>
            <p>Nothing is asking for you yet.<br />The first thread changes the texture.</p>
          </div>
        )}
      </div>
    </section>
  );
}
