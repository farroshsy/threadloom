/**
 * THREADLOOM DESIGN REMINDER — The guide is a patient field manual: tactile, editorial,
 * and specific about ownership. It teaches a practice, not a productivity system.
 */

import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

type LoomMarkVariant = "entry" | "context" | "return" | "search" | "shape" | "vault";

function LoomMark({ variant }: { variant: LoomMarkVariant }) {
  return <span className={`loom-mark loom-mark-${variant}`} aria-hidden="true"><i /><i /><i /></span>;
}

const steps = [
  {
    number: "01",
    title: "Leave a strand, not a task.",
    detail: "Capture a question, person, place, object, or half-formed thought that deserves a way back. A strand does not need a due date to be worth holding.",
    mark: "entry" as LoomMarkVariant,
  },
  {
    number: "02",
    title: "Keep the why beside it.",
    detail: "Write one line about why it matters now. Add a context tag or a return cue only when it helps the future version of you recognise the moment.",
    mark: "context" as LoomMarkVariant,
  },
  {
    number: "03",
    title: "Return on your terms.",
    detail: "Choose which strands may reappear, how quiet they should be before returning, whether cues matter, and how many suggestions you want. Every return shows its reasons.",
    mark: "return" as LoomMarkVariant,
  },
  {
    number: "04",
    title: "Search the weave directly.",
    detail: "Use search, context, state, and arrangement controls whenever you want to find something on purpose. The loom never replaces your ability to browse your own archive.",
    mark: "search" as LoomMarkVariant,
  },
  {
    number: "05",
    title: "Decide what changes shape.",
    detail: "When you return, you may let a strand rest, weave it in, or remove it. Unfinished does not mean overdue; it is simply material whose shape is still becoming clear.",
    mark: "shape" as LoomMarkVariant,
  },
  {
    number: "06",
    title: "Carry the archive with you.",
    detail: "Use the Backup Vault to download an encrypted copy. Keep the passphrase separately. Threadloom cannot recover a forgotten passphrase or restore a file without it.",
    mark: "vault" as LoomMarkVariant,
  },
];

export default function Guide() {
  return (
    <div className="guide-page">
      <header className="site-header">
        <Link className="brand" href="/"><img src="/manus-storage/threadloom-logo_c83984d2.png" alt="" /><span>threadloom</span></Link>
        <div className="header-status"><i /> field manual</div>
        <nav className="guide-nav" aria-label="Guide navigation">
          <Link href="/research">Research cabinet</Link>
          <Link href="/"><ArrowLeft size={14} /> Return to loom</Link>
        </nav>
      </header>
      <main className="guide-main">
        <svg className="guide-threads" viewBox="0 0 1200 1480" preserveAspectRatio="none" aria-hidden="true">
          <path d="M -30 132 C 180 72, 347 205, 558 127 S 866 167, 1230 86" className="guide-thread-red" />
          <path d="M -20 462 C 187 390, 376 540, 601 446 S 920 534, 1240 403" className="guide-thread-ink" />
          <path d="M 186 0 C 112 422, 309 752, 209 1480" className="guide-fiber-line" />
          <path d="M 911 0 C 844 384, 1028 928, 891 1480" className="guide-fiber-line" />
        </svg>
        <section className="guide-hero">
          <div>
            <span className="eyebrow">How to use Threadloom</span>
            <h1>A place for the things that <em>keep asking.</em></h1>
          </div>
          <p>Threadloom is a local-first personal context loom. It helps you preserve the original reason a question, person, place, object, or idea mattered—so it can become useful again later.</p>
          <aside className="guide-thread-note"><span>Margin note</span><p>Meaning is the material.<br />The loom only holds it.</p></aside>
        </section>

        <section className="guide-intent" aria-labelledby="intent-heading">
          <div className="guide-margin"><span>Intent</span><i /></div>
          <div>
            <h2 id="intent-heading">What Threadloom is—and what it refuses to become.</h2>
            <p>Threadloom is for contextual loose ends: the bench that helped you think, a question you want to live with, a person you meant to ask, the specific workaround that once solved a difficult problem. It is intentionally not a to-do manager, a reminder engine, a habit tracker, a generic notebook, or a feed.</p>
            <blockquote>“The goal is not to finish every thread. The goal is to keep the meaning from falling away.”</blockquote>
          </div>
        </section>

        <section className="guide-outcome" aria-labelledby="outcome-heading">
          <span className="eyebrow">The deliverable</span>
          <h2 id="outcome-heading">Over time, you are making a personal weave.</h2>
          <div className="outcome-grid">
            <article><span>After the first week</span><p>A small, legible place for open context—without needing a system of folders or deadlines.</p></article>
            <article><span>After a few months</span><p>A pattern of questions, conditions, people, places, and experiments that continue to matter.</p></article>
            <article><span>After years</span><p>A private life artifact: not a log of activity, but a textured record of what held your attention and how you changed.</p></article>
          </div>
        </section>

        <section className="guide-steps" aria-labelledby="steps-heading">
          <div className="steps-heading"><span className="eyebrow">A practical first session</span><h2 id="steps-heading">Six quiet moves.</h2><p>You can use the entire workflow in a few minutes. The point is to create enough context for a future return, not to document your day.</p></div>
          <div className="steps-list">
            {steps.map(({ number, title, detail, mark }) => (
              <article className="guide-step" key={number}>
                <span className="step-number">{number}</span>
                <LoomMark variant={mark} />
                <div><h3>{title}</h3><p>{detail}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="guide-return" aria-labelledby="return-heading">
          <div>
            <span className="eyebrow">A transparent invitation</span>
            <h2 id="return-heading">How resurfacing works.</h2>
            <p>The return rail does not predict your needs or profile your life. It only follows the rules you choose: eligible strand states, the minimum quiet interval, whether a return cue matters, and the number of strands offered. When a strand comes back, Threadloom states exactly why.</p>
          </div>
          <div className="return-example">
            <span>Why this strand returned</span>
            <p>It is still an open thread.</p>
            <p>You have not visited it for 14 days.</p>
            <p>You left a return cue for this strand.</p>
          </div>
        </section>

        <section className="guide-safety" aria-labelledby="safety-heading">
          <LoomMark variant="vault" />
          <div><span className="eyebrow">Ownership note</span><h2 id="safety-heading">Back up the weave before it matters too much.</h2><p>Your active workspace lives in this browser. The Backup Vault creates a passphrase-protected encrypted file you can keep elsewhere. Make a backup after meaningful additions and before changing devices. The passphrase is never stored by Threadloom, so write it down or save it in a trusted password manager.</p></div>
        </section>

        <section className="guide-close">
          <p>Start with one thing you do not want to lose the reason for.</p>
          <Link href="/">Begin at the loom <ArrowLeft size={15} /></Link>
        </section>
      </main>
    </div>
  );
}
