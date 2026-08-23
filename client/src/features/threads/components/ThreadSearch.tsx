/**
 * THREADLOOM DESIGN REMINDER — Search is a calm archive instrument, never an inbox command center.
 */

import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEFAULT_THREAD_SEARCH_FILTERS, STATE_LABELS, type ThreadSearchFilters, type ThreadState } from "../domain";

type ThreadSearchProps = {
  filters: ThreadSearchFilters;
  tags: string[];
  resultCount: number;
  totalCount: number;
  onChange: (next: ThreadSearchFilters) => void;
};

export function ThreadSearch({ filters, tags, resultCount, totalCount, onChange }: ThreadSearchProps) {
  const hasFilters = filters.query || filters.state !== "all" || filters.tag !== "all" || filters.sort !== "recent";
  const update = <Key extends keyof ThreadSearchFilters>(key: Key, value: ThreadSearchFilters[Key]) => onChange({ ...filters, [key]: value });

  return (
    <section className="archive-search" aria-label="Search and filter your weave">
      <div className="search-field">
        <Search size={16} aria-hidden="true" />
        <input value={filters.query} onChange={(event) => update("query", event.target.value)} placeholder="Search titles, reasons, cues, and contexts" aria-label="Search your weave" />
      </div>
      <div className="search-controls">
        <label><SlidersHorizontal size={14} /> State
          <select value={filters.state} onChange={(event) => update("state", event.target.value as ThreadSearchFilters["state"])}>
            <option value="all">All states</option>
            {(Object.keys(STATE_LABELS) as ThreadState[]).map((state) => <option key={state} value={state}>{STATE_LABELS[state]}</option>)}
          </select>
        </label>
        <label>Context
          <select value={filters.tag} onChange={(event) => update("tag", event.target.value)}>
            <option value="all">All contexts</option>
            {tags.map((tag) => <option key={tag} value={tag}>#{tag}</option>)}
          </select>
        </label>
        <label>Arrange
          <select value={filters.sort} onChange={(event) => update("sort", event.target.value as ThreadSearchFilters["sort"])}>
            <option value="recent">Last visited</option>
            <option value="newest">Recently added</option>
            <option value="oldest">Oldest first</option>
            <option value="title">Alphabetical</option>
          </select>
        </label>
        {hasFilters && <Button type="button" variant="ghost" size="sm" className="clear-filters" onClick={() => onChange(DEFAULT_THREAD_SEARCH_FILTERS)}><X size={14} /> Clear</Button>}
      </div>
      <p className="search-results">Showing <strong>{resultCount}</strong> of {totalCount} {totalCount === 1 ? "strand" : "strands"}.</p>
    </section>
  );
}
