# Threadloom

> **A local-first personal context loom for keeping the “why” with the thing.**

Threadloom is a deliberately small prototype for an overlooked personal problem: people frequently preserve a link, thought, conversation, object, or intent but lose the original context that made it matter. It is not a to-do manager, habit tracker, calendar, generic notes app, dashboard, or AI wrapper. Instead, it treats unfinished personal context as **strands** that can rest, connect, resolve, or return at the user’s discretion.

The prototype is grounded in a simple premise: a long-lived personal system needs a reason to revisit, not merely more data. Research on personal information management describes fragmented storage and difficult later retrieval; lifelogging research further cautions that broad capture does not automatically create user value.[1] [2] Threadloom focuses on a smaller, explicit benefit: helping a person return to meaningful loose ends with the reason they mattered intact.[3]

## What is in this repository

| Area | What it provides |
|---|---|
| **Interactive prototype** | A woven workspace for capturing strands, selecting them, resting them, resolving them, and gently revisiting old context. |
| **Local-first persistence** | User-entered threads are stored in browser local storage. No account, server API, or third-party personal-data service is involved. |
| **Encrypted ownership controls** | The active workspace now lives in IndexedDB, while export files are encrypted in-browser with a user-supplied passphrase before download. |
| **Transparent return rules** | Users select eligible states, quiet interval, cue preference, and return-set size; every surfaced strand explains why it was selected. |
| **Archive navigation** | Personal strands support full-text search, state/context filters, and sorting. The 100-concept research catalog is a searchable, filterable research cabinet at `/research`. |
| **Feature-oriented architecture** | Domain rules, browser persistence, seed data, and presentation components are isolated to keep future migrations inexpensive. |
| **Research artifact** | `docs/concept-research.md` contains 100 original personal-software concepts, rankings, top-ten deep dives, and a critical final selection. |
| **Architecture decision record** | `docs/architecture-decision.md` explains the starter-template assessment, alternatives, trade-offs, selected design, risks, and planned increments. |

## Product experience

The **current weave** is the primary workspace. A user adds a strand by writing a title, why it matters, optional context tags, and an optional return cue. Selecting a strand opens a margin note with the preserved context. The user may let the strand rest, weave it in when it is resolved, or delete it. The right-side return rail favors open, least-recently-visited strands without sending push notifications or creating a due-date treadmill.

The starter content is explicitly marked **illustrative**, never presented as a user’s history. It can be cleared in one action. New strands are marked `personal` and stored only in the current browser.

## Secure backup and restore

The active workspace is persisted in **IndexedDB**, which is intended for significant quantities of structured browser data.[1] The Backup Vault creates a downloaded, versioned JSON envelope that is encrypted in the browser with a user-supplied passphrase. The implementation derives an AES-256-GCM encryption key with PBKDF2-SHA-256 and a fresh random salt; each encryption operation uses a fresh random initialization vector. The passphrase is never written to IndexedDB, local storage, the backup file, or analytics. Web Crypto is deliberately a low-level API, so the implementation keeps the format narrow and clearly scoped.[2]

> **Important boundary:** the downloaded backup is encrypted, but the active IndexedDB workspace is not application-encrypted while Threadloom is open in the browser. Browser profile protection and device encryption remain important. A forgotten backup passphrase cannot be recovered. Restoring a backup replaces the current workspace and return settings in the current browser.

## Transparent resurfacing

Threadloom’s return rail uses a deterministic, user-editable policy rather than opaque “smart” recommendations. Users can select which states are eligible, the minimum quiet interval, whether return cues receive a bonus, and the number of strands shown. Open strands are prioritized before resting strands, then less-recently-visited eligible strands are favored. The selected strand displays the complete explanation—such as its state, elapsed quiet time, and cue contribution—so the person can judge the rule rather than trust a hidden model.

## Search and research navigation

The main worktable now provides full-text search across titles, preserved reasons, cues, and context tags. It also supports state and context filters, plus last-visited, newest, oldest, and alphabetical arrangement. The separate **Research Cabinet** at `/research` parses the repository’s 100-idea catalog into searchable archival slips; it can be explored by text, curator weight, and arrangement without presenting the catalog as a generic ranked dashboard.

## Architecture

```text
client/src/
├── features/
│   └── threads/
│       ├── components/
│       │   ├── ResurfacingControls.tsx # User-editable return policy
│       │   ├── ThreadCapture.tsx      # Quick, contextual capture
│       │   ├── ThreadInspector.tsx    # Selected-strand detail and transitions
│       │   └── ThreadLoom.tsx         # Textile workspace visualization
│       │   ├── ThreadSearch.tsx       # Search, filters, and arrangement
│       │   └── VaultDialog.tsx         # Encrypted export and restore control
│       ├── crypto.ts                  # Versioned AES-GCM backup envelope
│       ├── domain.ts                  # Thread type, pure transitions, transparent return ordering
│       ├── domain.test.ts             # Pure behavior verification
│       ├── seed.ts                    # Explicitly illustrative prototype data
│       └── storage.ts                 # IndexedDB persistence and payload guard
├── features/research/catalog.ts       # Parsed research-catalog search index
├── pages/
│   └── Home.tsx                       # Route-level composition and UI state
│   └── Research.tsx                   # Searchable archival research cabinet
├── index.css                          # Global tactile visual system and responsive rules
└── App.tsx                            # Application providers and routes

docs/
├── architecture-decision.md
└── concept-research.md
```

The domain is intentionally independent of React and storage. `domain.ts` owns the `Thread` vocabulary, state transitions, age formatting, and return ordering. `storage.ts` owns browser serialization. Components render user intent but do not know storage keys. This is the key revamp: a future IndexedDB, encrypted export/import, or sync adapter can replace persistence without rewriting the interface.

## Why this revamp was selected

| Upgrade path | Benefit | Cost or downside | Outcome |
|---|---|---|---|
| Keep one monolithic page | Lowest short-term change cost. | Domain rules, persistence, and rendering become tightly coupled; difficult to test or evolve. | Rejected. |
| **Feature-oriented local-first design** | Private by default; readable product vocabulary; small testable seams; appropriate for an intimate prototype. | No cross-device sync and local storage is not a durable archive. | **Implemented.** |
| Full-stack account/database app | Enables sync, sharing, backups, and collaboration. | Adds identity, security, operational cost, and retention policy before the core loop is validated. | Deferred. |
| Offline PWA with IndexedDB and encrypted export | Stronger ownership and a credible long-term artifact foundation. | Requires migrations, backup UX, service-worker discipline, and broad device testing. | Next major increment. |

The design choice also follows a substantive product constraint: personal memory systems are better when they target a defined human benefit and provide appropriate cues, rather than attempting indiscriminate “total capture.”[3]

## Technical stack

| Layer | Technology | Rationale |
|---|---|---|
| UI | React 19 + TypeScript | Typed, component-based interaction model with low deployment complexity. |
| Build | Vite | Fast local iteration and static deployment. |
| Styling | Tailwind foundation + bespoke CSS | The product needs a specific textile/editorial visual language, not a generic component-library appearance. |
| Icons | Lucide React | Accessible, restrained inline iconography. |
| Active persistence | IndexedDB | Transactional browser storage for the structured local-first workspace. |
| Backup encryption | Web Crypto: PBKDF2-SHA-256 + AES-256-GCM | Produces a passphrase-protected, versioned file without sending personal data to a server. |
| Tests | Vitest | Verifies pure domain behavior without binding tests to layout. |

## Local development

### Prerequisites

Use a recent Node.js release and `pnpm`. The repository already includes its dependency lockfile.

### Commands

```bash
pnpm install
pnpm dev
pnpm check
pnpm test
pnpm build
```

The app is frontend-only. No environment variables, account setup, database migration, or server configuration is necessary for the prototype.

## Current constraints

This is an intentionally bounded concept prototype, not a claim of durable personal archival software. Browser local storage can be cleared, has size limits, and is not encrypted. The current return set is a transparent deterministic ordering rule—open strands first, then least-recently-visited—rather than an opaque recommendation engine. The visual starter content is illustrative and should be deleted before personal use.

The production-quality roadmap should not begin with AI. It should begin with ownership: IndexedDB, versioned migrations, encrypted export/import, and a recovery story. Only after users demonstrate that contextual return is valuable should the product consider optional, on-device semantic grouping or explainable resurfacing.

## Roadmap

| Increment | Purpose | Evidence required before proceeding |
|---|---|---|
| **1. Prototype — completed** | Validate context-rich capture, manual return, and textile interaction. | Users can explain why a selected strand remains valuable. |
| **2. Ownership** | Add IndexedDB, encrypted export/import, storage migrations, and accessibility audit. | Users keep real personal strands for several weeks. |
| **3. Return intelligence** | Add user-controlled cue policies, “why now?” explanations, and feedback on resurfacing quality. | A weekly return produces a useful reconnection, not a generic review. |
| **4. Optional sync** | Support end-to-end encrypted multi-device sync with a user-held recovery key. | Single-device limitations demonstrably block continued use. |

## Validation performed

The revamp includes TypeScript checking, a production build, and six unit tests covering encrypted-envelope validation, transparent resurfacing reasons, return ordering, immutable state transitions, and date-age behavior. The interface is responsive, keyboard-focusable, and respects `prefers-reduced-motion` for nonessential motion.

## Research references

[1] [MDN, *IndexedDB API*](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

[2] [MDN, *Web Crypto API*](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

[3] [Sedghi et al., *A qualitative study on personal information management*](https://pmc.ncbi.nlm.nih.gov/articles/PMC4715425/)

[4] [Ribeiro, Trifan, and Neves, *Lifelog Retrieval From Daily Digital Data*](https://pmc.ncbi.nlm.nih.gov/articles/PMC9112086/)

[5] [Sellen and Whittaker, *Beyond total capture: a constructive critique of lifelogging*](https://dl.acm.org/doi/fullHtml/10.1145/1735223.1735243)
