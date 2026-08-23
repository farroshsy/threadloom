/**
 * THREADLOOM DESIGN REMINDER — The Tactile Archive uses an asymmetric worktable,
 * loom-red live attention, editorial serif margin notes, and no dashboard tropes.
 */

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Sparkles, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ThreadCapture } from "@/features/threads/components/ThreadCapture";
import { ThreadInspector } from "@/features/threads/components/ThreadInspector";
import { ThreadLoom } from "@/features/threads/components/ThreadLoom";
import { ThreadSearch } from "@/features/threads/components/ThreadSearch";
import { VaultDialog } from "@/features/threads/components/VaultDialog";
import { ResurfacingControls } from "@/features/threads/components/ResurfacingControls";
import { createThread, DEFAULT_RESURFACING_SETTINGS, DEFAULT_THREAD_SEARCH_FILTERS, filterThreads, getReturnCandidates, touchThread, transitionThread, type NewThreadInput, type ResurfacingSettings, type Thread, type ThreadSearchFilters, type ThreadState } from "@/features/threads/domain";
import { illustrativeThreads } from "@/features/threads/seed";
import { loadWorkspace, saveWorkspace, type WorkspaceSnapshot } from "@/features/threads/storage";

export default function Home() {
  const [threads, setThreads] = useState<Thread[]>(illustrativeThreads);
  const [settings, setSettings] = useState<ResurfacingSettings>(DEFAULT_RESURFACING_SETTINGS);
  const [selectedId, setSelectedId] = useState<string | undefined>(illustrativeThreads[0]?.id);
  const [isReady, setIsReady] = useState(false);
  const [searchFilters, setSearchFilters] = useState<ThreadSearchFilters>(DEFAULT_THREAD_SEARCH_FILTERS);

  useEffect(() => {
    let active = true;
    void loadWorkspace().then((workspace) => {
      if (!active) return;
      setThreads(workspace.threads);
      setSettings(workspace.settings);
      setSelectedId(workspace.threads[0]?.id);
      setIsReady(true);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (isReady) void saveWorkspace({ threads, settings });
  }, [isReady, settings, threads]);

  const selectedThread = threads.find((thread) => thread.id === selectedId);
  const returnCandidates = useMemo(() => getReturnCandidates(threads, settings), [settings, threads]);
  const visibleThreads = useMemo(() => filterThreads(threads, searchFilters), [searchFilters, threads]);
  const selectedCandidate = returnCandidates.find((candidate) => candidate.thread.id === selectedId);
  const tags = useMemo(() => Array.from(new Set(threads.flatMap((thread) => thread.tags))).sort(), [threads]);
  const openCount = threads.filter((thread) => thread.state === "open").length;
  const sampleCount = threads.filter((thread) => thread.origin === "sample").length;

  function handleCreate(input: NewThreadInput) {
    const thread = createThread(input);
    setThreads((current) => [thread, ...current]);
    setSelectedId(thread.id);
  }

  function handleSelect(thread: Thread) {
    setThreads((current) => current.map((item) => (item.id === thread.id ? touchThread(item) : item)));
    setSelectedId(thread.id);
  }

  function changeState(state: ThreadState) {
    if (!selectedId) return;
    setThreads((current) => current.map((item) => (item.id === selectedId ? transitionThread(item, state) : item)));
  }

  function deleteSelected() {
    if (!selectedId) return;
    setThreads((current) => current.filter((thread) => thread.id !== selectedId));
    setSelectedId(undefined);
  }

  function clearIllustrations() {
    setThreads((current) => current.filter((thread) => thread.origin !== "sample"));
    setSelectedId(undefined);
  }

  function restoreWorkspace(workspace: WorkspaceSnapshot) {
    setThreads(workspace.threads);
    setSettings(workspace.settings);
    setSelectedId(workspace.threads[0]?.id);
  }

  return (
    <div className="threadloom-app">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Threadloom home">
          <img src="/manus-storage/threadloom-logo_c83984d2.png" alt="" />
          <span>threadloom</span>
        </a>
        <div className="header-status"><i /> local weave</div>
        <Link className="header-catalog-link" href="/research">Research catalog</Link>
        <VaultDialog threads={threads} settings={settings} onRestore={restoreWorkspace} />
      </header>

      <main id="top" className="workspace">
        <aside className="editorial-rail">
          <div className="rail-intro">
            <span className="eyebrow">A personal context loom</span>
            <h1>Keep the <em>why</em><br />with the thing.</h1>
            <p>Threadloom is not a list of obligations. It is a place for thoughts, people, questions, and places that deserve a way back.</p>
          </div>
          <div className="rail-stats">
            <div><strong>{openCount.toString().padStart(2, "0")}</strong><span>living strands</span></div>
            <div><strong>{threads.length.toString().padStart(2, "0")}</strong><span>in this weave</span></div>
          </div>
          <div className="rail-note">
            <Sparkles size={15} />
            <p>No pings. No inbox zero. Just context held until you want it again.</p>
          </div>
        </aside>

        <section className="main-worktable">
          <div className="worktable-hero">
            <div className="hero-copy">
              <span className="eyebrow">August 23 · a quiet return</span>
              <p>Some things become more useful when they are allowed to remain unfinished.</p>
            </div>
            <div className="hero-image" aria-hidden="true" />
          </div>
          <ThreadCapture onCreate={handleCreate} />
          <ThreadSearch filters={searchFilters} tags={tags} resultCount={visibleThreads.length} totalCount={threads.length} onChange={setSearchFilters} />
          {sampleCount > 0 && (
            <div className="sample-notice">
              <span><i /> This is an illustrative starter weave, not personal history.</span>
              <button type="button" onClick={clearIllustrations}><Trash2 size={13} /> Clear examples</button>
            </div>
          )}
          <ThreadLoom threads={visibleThreads} selectedId={selectedId} onSelect={handleSelect} />
        </section>

        <aside className="return-rail">
          <div className="return-heading">
            <span className="eyebrow">Return gently</span>
            <p>Not due. Simply ready to notice.</p>
          </div>
          <ResurfacingControls settings={settings} onChange={setSettings} />
          <ol className="return-list">
            {returnCandidates.map((candidate, index) => (
              <li key={candidate.thread.id}>
                <button type="button" onClick={() => handleSelect(candidate.thread)} className={candidate.thread.id === selectedId ? "active" : ""}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><strong>{candidate.thread.title}</strong><small>{candidate.thread.cue || candidate.thread.why}</small></div>
                  <ArrowUpRight size={15} />
                </button>
              </li>
            ))}
            {returnCandidates.length === 0 && <li className="return-empty">No strand meets the current return rules. Adjust the quiet interval or eligible states above.</li>}
          </ol>
          <ThreadInspector thread={selectedThread} returnReasons={selectedCandidate?.reasons} onStateChange={changeState} onDelete={deleteSelected} />
        </aside>
      </main>

      <footer className="site-footer">
        <span>Threadloom prototype · IndexedDB workspace · encrypted backup</span>
        <span>Built for long-lived context, not productivity theater.</span>
      </footer>
    </div>
  );
}
