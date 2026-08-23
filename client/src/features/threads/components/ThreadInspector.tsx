/**
 * THREADLOOM DESIGN REMINDER — Detail is a calm margin note, pairing beauty with usable plain language.
 */

import { Archive, Check, Pause, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatAge, STATE_LABELS, type Thread, type ThreadState } from "../domain";

type ThreadInspectorProps = {
  thread?: Thread;
  onStateChange: (state: ThreadState) => void;
  onDelete: () => void;
};

export function ThreadInspector({ thread, onStateChange, onDelete }: ThreadInspectorProps) {
  if (!thread) {
    return (
      <aside className="inspector inspector-empty" aria-live="polite">
        <Archive size={20} strokeWidth={1.5} />
        <p>Pull a strand close to read the context you left with it.</p>
      </aside>
    );
  }

  return (
    <aside className="inspector" aria-label="Selected thread details">
      <div className="inspector-rule" />
      <span className="eyebrow">Margin note · {STATE_LABELS[thread.state]}</span>
      <h3>{thread.title}</h3>
      <p className="inspector-why">{thread.why}</p>
      {thread.cue && (
        <div className="return-cue">
          <span>Return cue</span>
          <p>{thread.cue}</p>
        </div>
      )}
      <div className="thread-facts">
        <span>first left {formatAge(thread)}</span>
        <span>{thread.tags.length ? thread.tags.map((tag) => `#${tag}`).join(" ") : "unfiled context"}</span>
      </div>
      <div className="inspector-actions">
        {thread.state !== "open" && <Button variant="outline" onClick={() => onStateChange("open")}>Return to loom</Button>}
        {thread.state === "open" && <Button variant="outline" onClick={() => onStateChange("resting")}><Pause size={14} /> Let it rest</Button>}
        {thread.state !== "resolved" && <Button onClick={() => onStateChange("resolved")}><Check size={14} /> Weave it in</Button>}
        <Button variant="ghost" size="icon" onClick={onDelete} className="delete-thread" aria-label="Delete thread"><Trash2 size={15} /></Button>
      </div>
    </aside>
  );
}
