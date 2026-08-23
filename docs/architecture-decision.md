# Threadloom Architecture Decision Record

> **Decision:** Rebuild the starter page as a feature-oriented, local-first prototype that models personal context explicitly and isolates persistence from presentation.

## What existed

The starter repository was a healthy static React 19 and TypeScript scaffold, but it contained only a placeholder `Home` page. It had no product domain, persistence boundary, visual-system documentation, automated validation, or explanatory README. That is an appropriate starting point for a template, but not a durable foundation for a ten-year personal artifact.

| Area | What was good | What was inadequate |
|---|---|---|
| Runtime | React, TypeScript, Vite, and accessible component primitives are a pragmatic, low-friction baseline. | The product logic did not exist; all future behavior would have accumulated in one page component. |
| Scope | A static client is inexpensive, private by default, and quick to prototype. | There was no persistence strategy or model for long-lived personal records. |
| UI | The starter brought reusable primitives and a global token surface. | The visual language was generic and did not express the product’s core metaphor. |
| Maintainability | The scaffold has a conventional `pages`, `components`, and `lib` layout. | There was no feature boundary, domain vocabulary, test seam, or decision record. |

## Upgrade options considered

| Option | Advantages | Disadvantages | Decision |
|---|---|---|---|
| Keep a single `Home.tsx` page | Minimal file count and fastest one-off demonstration. | Domain logic, local persistence, interaction state, and visual rendering become coupled; testing and future migration become expensive. | Rejected. |
| Feature-oriented local-first architecture | Clear domain language; records stay in the browser; persistence is replaceable; components remain small; suitable for an intimate personal artifact. | Browser-local data does not synchronize across devices and needs an export path before serious adoption. | **Selected.** |
| Full-stack application with accounts and a hosted database | Enables sync, collaboration, backup, and cross-device access. | Introduces identity, security, retention, migration, hosting cost, and data-governance work before the core loop is proven. It also weakens the “my private artifact” posture. | Deferred. |
| PWA with IndexedDB, encrypted export, and optional sync | Strong offline behavior and a credible path to long-term ownership. | More operational and platform complexity; service-worker and migration testing need dedicated investment. | Planned next increment. |

## Why local-first is the best first revamp

The product’s early value is not network effects; it is trust, quick capture, and meaningful return. Research on personal information management identifies fragmented storage and later retrieval as persistent problems, while lifelogging research cautions against indiscriminate total capture. The selected architecture stores only deliberate, user-authored threads and preserves the context needed to revisit them.[1][2] This keeps the MVP focused on a human value proposition—reflection and contextual return—rather than the mechanics of a hosted archive.

Sellen and Whittaker argue that personal-memory systems should define the intended benefit and design retrieval cues rather than simply collect more data.[3] Threadloom therefore models an item as a **strand** with a title, why-it-matters note, context tags, optional return cue, and state. The model makes deliberate resurfacing testable and replaceable.

## Target layout

```text
client/src/
├── components/              # Cross-feature visual primitives only
├── features/
│   └── threads/
│       ├── components/      # Capture, loom, and inspector views
│       ├── domain.ts        # Stable product vocabulary and pure behavior
│       ├── seed.ts          # Clearly marked illustrative prototype data
│       └── storage.ts       # Browser persistence adapter
├── lib/                     # Shared framework-neutral utilities
├── pages/                   # Route composition only
├── App.tsx                  # Providers and routes
└── index.css                # Global visual tokens and interaction rules
```

The critical rule is: **React components do not own the definition of a strand or the storage mechanism.** A later IndexedDB adapter, encrypted export/import, or synchronization service can replace `storage.ts` without rewriting the loom UI.

## Key boundaries

| Boundary | Responsibility | Must not do |
|---|---|---|
| `domain.ts` | Define `Thread`, state transitions, age calculations, and pure filtering/sorting rules. | Read browser APIs or manipulate the DOM. |
| `storage.ts` | Serialize, validate, migrate, and persist a collection in local storage. | Contain UI state, animation choices, or business naming outside the domain. |
| Feature components | Render the loom, capture data, and raise user intents. | Encode storage keys or duplicate sorting logic. |
| `Home.tsx` | Compose the route-level experience. | Become a second domain layer. |

## Risks and mitigations

| Risk | Why it matters | MVP mitigation | Upgrade trigger |
|---|---|---|---|
| Local storage loss or quota | A personal archive must be owned and recoverable. | Keep data small, version the payload, and expose the storage boundary. | Add encrypted JSON export/import and IndexedDB before private beta. |
| Sample data mistaken for personal history | A meaningful archive must not fabricate personal memory. | Label seeded threads as **illustrative** and provide a one-click clear action. | Start new users with a guided empty weave. |
| Unhelpful resurfacing | Bad timing turns reflection into nagging. | No push notification system; surface only in the user-opened workspace. | Add user-controlled cue policies and feedback capture. |
| Metaphor overwhelms utility | A pretty scene can become a confusing interface. | Pair every strand with plain-language metadata and keyboard-accessible controls. | Conduct five qualitative prototype sessions before PWA work. |

## Planned technical sequence

| Increment | Scope | Why it comes next |
|---|---|---|
| 1. Current prototype | Typed strands, browser persistence, interactive loom, capture and resolution flow. | Validates the core loop with no account system. |
| 2. Ownership | IndexedDB, encrypted export/import, schema migrations, accessibility audit. | Makes the artifact safer for long-term use. |
| 3. Return intelligence | Local cue scoring, “why now?” explanations, revisit feedback. | Tests whether context beats generic reminders. |
| 4. Optional sync | End-to-end encrypted sync with a user-held recovery key. | Only justified when single-device use has proven insufficient. |

## Implemented ownership increment

The prototype now uses IndexedDB for its active workspace and exposes a versioned encrypted export/import path. The downloaded envelope derives a non-extractable AES-256-GCM key from a user passphrase through PBKDF2-SHA-256, carries a random salt and initialization vector, and validates the decrypted schema before restoring it. The passphrase remains transient UI input and is never stored. This is a practical ownership improvement, not a claim that active browser storage is encrypted at rest.

The resurfacing system is likewise deliberately bounded. It has no behavioral profiling or opaque predictive model: the user selects eligible states, a quiet interval, cue preference, and return-set size. The ranker emits the reasons for every suggested return. Search and archive navigation form an alternative route to recall when the user does not want any resurfacing at all.

## References

[1] [Sedghi et al., *A qualitative study on personal information management*](https://pmc.ncbi.nlm.nih.gov/articles/PMC4715425/)

[2] [Ribeiro, Trifan, and Neves, *Lifelog Retrieval From Daily Digital Data*](https://pmc.ncbi.nlm.nih.gov/articles/PMC9112086/)

[3] [Sellen and Whittaker, *Beyond total capture: a constructive critique of lifelogging*](https://dl.acm.org/doi/fullHtml/10.1145/1735223.1735243)
