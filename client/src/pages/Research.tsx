/**
 * THREADLOOM DESIGN REMINDER — The catalog feels like an editorial cabinet of possibilities, not a business backlog.
 */

import { useMemo, useState } from "react";
import { ArrowLeft, BookOpenText, Search, SlidersHorizontal } from "lucide-react";
import { Link } from "wouter";
import { researchIdeas } from "@/features/research/catalog";

export default function Research() {
  const [query, setQuery] = useState("");
  const [minimumScore, setMinimumScore] = useState("0");
  const [sort, setSort] = useState<"score" | "number" | "name">("score");
  const [limit, setLimit] = useState(18);
  const ideas = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return researchIdeas
      .filter((idea) => !needle || [idea.name, idea.concept, idea.returnValue, idea.implementation].join(" ").toLocaleLowerCase().includes(needle))
      .filter((idea) => idea.score >= Number(minimumScore))
      .sort((a, b) => sort === "name" ? a.name.localeCompare(b.name) : sort === "number" ? a.number - b.number : b.score - a.score || a.number - b.number);
  }, [minimumScore, query, sort]);

  return (
    <div className="research-page">
      <header className="site-header">
        <Link className="brand" href="/"><img src="/manus-storage/threadloom-logo_c83984d2.png" alt="" /><span>threadloom</span></Link>
        <div className="header-status"><i /> research cabinet</div>
        <Link className="research-back" href="/"><ArrowLeft size={15} /> Return to loom</Link>
      </header>
      <main className="research-main">
        <section className="research-hero">
          <span className="eyebrow">One hundred directions</span>
          <h1>Concepts for personal software that grows more meaningful with time.</h1>
          <p>Browse the cabinet by problem, visual metaphor, return value, or technical seed. Curator weight is only a quiet prioritization note, never a measure of worth.</p>
        </section>
        <section className="research-controls" aria-label="Search the research catalog">
          <div className="research-search"><Search size={17} /><input value={query} onChange={(event) => { setQuery(event.target.value); setLimit(18); }} placeholder="Find a problem, metaphor, or technical seed" aria-label="Search research catalog" /></div>
          <label><SlidersHorizontal size={14} /> Curator weight<select value={minimumScore} onChange={(event) => { setMinimumScore(event.target.value); setLimit(18); }}><option value="0">All materials</option><option value="40">Strong resonance</option><option value="43">Weighty notes</option><option value="45">Most resonant</option></select></label>
          <label>Arrange<select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}><option value="score">Curator notes</option><option value="number">Cabinet order</option><option value="name">Alphabetical</option></select></label>
        </section>
        <div className="research-meta"><span><BookOpenText size={15} /> {ideas.length} of {researchIdeas.length} cabinet slips visible</span><span>Each slip holds a problem, metaphor, return loop, and technical seed.</span></div>
        <section className="catalog-grid" aria-label="Concept research cabinet">
          {ideas.slice(0, limit).map((idea) => (
            <article className="catalog-card" key={idea.number}>
              <div className="catalog-card-head"><span>cabinet #{String(idea.number).padStart(3, "0")}</span><strong>margin weight {idea.score}</strong></div>
              <h2>{idea.name}</h2>
              <p>{idea.concept}</p>
              <div className="catalog-return"><span>Why return</span><p>{idea.returnValue}</p></div>
              <small>{idea.implementation}</small>
            </article>
          ))}
        </section>
        {ideas.length > limit && <button type="button" className="show-more" onClick={() => setLimit((current) => current + 18)}>Open another drawer of 18</button>}
        {ideas.length === 0 && <div className="catalog-empty">No concept matches that search. Try a wider phrase or a lower score threshold.</div>}
      </main>
    </div>
  );
}
