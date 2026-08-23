/**
 * THREADLOOM DESIGN REMINDER — Capture is an edge-of-the-loom gesture: brief, permissive, and meaningful.
 */

import { useState, type FormEvent } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { NewThreadInput } from "../domain";

type ThreadCaptureProps = {
  onCreate: (input: NewThreadInput) => void;
};

export function ThreadCapture({ onCreate }: ThreadCaptureProps) {
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [why, setWhy] = useState("");
  const [tags, setTags] = useState("");
  const [cue, setCue] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;
    onCreate({
      title,
      why,
      tags: tags.split(","),
      cue,
      state: "open",
    });
    setTitle("");
    setWhy("");
    setTags("");
    setCue("");
    setExpanded(false);
  }

  return (
    <section className={`capture-panel ${expanded ? "is-expanded" : ""}`} aria-label="Add a new thread">
      <div className="capture-heading">
        <span className="eyebrow">Feed the loom</span>
        <p>Leave a marker for the version of you who returns.</p>
      </div>
      <form onSubmit={submit} className="capture-form">
        <div className="capture-title-row">
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onFocus={() => setExpanded(true)}
            placeholder="What is still asking for you?"
            aria-label="Thread title"
          />
          <Button type="submit" size="icon" aria-label="Add thread" className="capture-submit">
            {expanded ? <ArrowRight size={18} /> : <Plus size={18} />}
          </Button>
        </div>
        {expanded && (
          <div className="capture-details">
            <Textarea
              value={why}
              onChange={(event) => setWhy(event.target.value)}
              placeholder="Why does this matter?"
              aria-label="Why this thread matters"
              rows={2}
            />
            <div className="capture-meta-row">
              <Input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="contexts, not categories" aria-label="Context tags" />
              <Input value={cue} onChange={(event) => setCue(event.target.value)} placeholder="return when…" aria-label="Return cue" />
            </div>
          </div>
        )}
      </form>
    </section>
  );
}
