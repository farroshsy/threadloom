# Threadloom

> **A local-first personal context loom for keeping the “why” with the thing.**

Threadloom is a deliberately small prototype for an overlooked personal problem: people frequently preserve a link, thought, conversation, object, or intent but lose the original context that made it matter. It is not a to-do manager, habit tracker, calendar, generic notes app, dashboard, or AI wrapper. Instead, it treats unfinished personal context as **strands** that can rest, connect, resolve, or return at the user’s discretion.

The prototype is grounded in a simple premise: a long-lived personal system needs a reason to revisit, not merely more data. Research on personal information management describes fragmented storage and difficult later retrieval; lifelogging research further cautions that broad capture does not automatically create user value.[1] [2] Threadloom focuses on a smaller, explicit benefit: helping a person return to meaningful loose ends with the reason they mattered intact.[3]

## What is in this repository

| Area | What it provides |
|---|---|
| **Interactive prototype** | A woven workspace for capturing strands, selecting them, resting them, resolving them, and gently revisiting old context. |
| **Local-first persistence** | User-entered threads are stored in browser local storage. No account, server API, or third-party personal-data service is involved. |
| **Feature-oriented architecture** | Domain rules, browser persistence, seed data, and presentation components are isolated to keep future migrations inexpensive. |
| **Research artifact** | `docs/concept-research.md` contains 100 original personal-software concepts, rankings, top-ten deep dives, and a critical final selection. |
| **Architecture decision record** | `docs/architecture-decision.md` explains the starter-template assessment, alternatives, trade-offs, selected design, risks, and planned increments. |

## Product experience

The **current weave** is the primary workspace. A user adds a strand by writing a title, why it matters, optional context tags, and an optional return cue. Selecting a strand opens a margin note with the preserved context. The user may let the strand rest, weave it in when it is resolved, or delete it. The right-side return rail favors open, least-recently-visited strands without sending push notifications or creating a due-date treadmill.

The starter content is explicitly marked **illustrative**, never presented as a user’s history. It can be cleared in one action. New strands are marked `personal` and stored only in the current browser.

## Architecture

```text
client/src/
├── features/
│   └── threads/
│       ├── components/
│       │   ├── ThreadCapture.tsx      # Quick, contextual capture
│       │   ├── ThreadInspector.tsx    # Selected-strand detail and transitions
│       │   └── ThreadLoom.tsx         # Textile workspace visualization
│       ├── domain.ts                  # Thread type, pure transitions, return ordering
│       ├── domain.test.ts             # Pure behavior verification
│       ├── seed.ts                    # Explicitly illustrative prototype data
│       └── storage.ts                 # Local-storage persistence and payload guard
├── pages/
│   └── Home.tsx                       # Route-level composition and UI state
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
| Persistence | Browser local storage | Appropriate for proving the local-first core loop before adding an operational backend. |
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

The revamp includes TypeScript checking, a production build, and unit coverage for gentle return ordering, immutable state transitions, and date-age behavior. The interface is responsive, keyboard-focusable, and respects `prefers-reduced-motion` for nonessential motion.

## Research references

[1] [Sedghi et al., *A qualitative study on personal information management*](https://pmc.ncbi.nlm.nih.gov/articles/PMC4715425/)

[2] [Ribeiro, Trifan, and Neves, *Lifelog Retrieval From Daily Digital Data*](https://pmc.ncbi.nlm.nih.gov/articles/PMC9112086/)

[3] [Sellen and Whittaker, *Beyond total capture: a constructive critique of lifelogging*](https://dl.acm.org/doi/fullHtml/10.1145/1735223.1735243)
