# Threadloom — Design Directions

## Three possible directions

### 1. The Tactile Archive

**Very Brief Intro:** An intimate, editorial workspace that turns unfinished thoughts into visible strands on a living textile. It should feel like handling a well-used field notebook crossed with a handmade loom.

**Probability:** 0.07

### 2. The Quiet Observatory

**Very Brief Intro:** A calm, night-sky instrument panel where loose ends move like slowly charted celestial bodies. The emotional register is patient, contemplative, and slightly mysterious.

**Probability:** 0.04

### 3. The Cabinet of Return

**Very Brief Intro:** A warm, archival collection of small personal artifacts, presented as drawers, labels, and cards that invite rediscovery. It emphasizes material memory rather than productivity.

**Probability:** 0.09

## Chosen direction: The Tactile Archive

### Design Movement

The interface draws on **editorial modernism, Japanese stationery, and textile craft**. It avoids dashboard tropes: no dense grids, no status widgets, no productivity gamification. Instead, it should resemble a large piece of linen under active work, with threads arranged by tension, age, and resonance.

### Core Principles

1. **Meaning before management:** Every strand preserves *why it matters* rather than reducing it to a task title.
2. **Unfinished is allowed:** Open loops are not failures; they are materials that can rest, reconnect, fade, or resolve.
3. **Texture signals time:** Age, revisit history, and emotional weight should alter a strand’s texture, density, and luminosity.
4. **Small actions, deep history:** Capture must take seconds. Reflection should deepen naturally with time.

### Color Philosophy

The base is an unbleached-paper neutral with charcoal ink for focus. **Loom red** is the owned accent: a slightly oxidized vermilion that marks living attention without the alarm semantics of pure red. Indigo and faded sage establish context categories. The palette is deliberately low-saturation so the user’s words feel more important than the interface.

### Layout Paradigm

The primary workspace is an **asymmetric worktable**. A narrow editorial rail carries the current moment; the large field is a woven landscape of open strands. Capture enters from the edge, as though a thread is being fed into the loom. There is no centered hero or conventional card grid.

### Signature Elements

1. **Thread lines:** Curving strokes physically connect related contexts, with variation in thickness and opacity.
2. **Margin notes:** Small, serif annotations explain age, source, and why an item resurfaced.
3. **Woven density:** Crossed lines and subtle fibers create visual texture that grows richer as the archive accrues history.

### Interaction Philosophy

Interactions should be deliberate and quiet. A user pulls a loose thread into focus, annotates its meaning, then either leaves it to rest, ties it to another, or closes it. The product suggests one meaningful revisit rather than demanding an inbox-zero sweep.

### Animation

Thread movement uses gentle 180–240ms transform and opacity transitions. When a strand is added, it stretches in from the capture edge and settles with a slight deceleration; when it is resolved, it retreats into the weave rather than disappearing abruptly. Motion must respect `prefers-reduced-motion` and never delay keyboard actions.

### Typography System

**DM Serif Display** provides human warmth for names, questions, and margin notes. **DM Sans** handles capture, navigation, and metadata with clear compact proportions. Display copy is sparse and sentence-like; interface labels are small, tracked, and practical.

### Brand Essence

**Threadloom is a local-first personal context loom for people who want their unfinished thoughts to become a meaningful record instead of a forgotten pile.**

Personality: **attentive, tactile, unhurried.**

### Brand Voice

Headlines speak like a patient archivist; CTAs are concrete, not coercive. Avoid productivity jargon, streaks, and generic welcomes.

Example lines:

> “What is still quietly asking for you?”

> “Leave a marker for the version of you who returns.”

### Wordmark & Logo

The mark is a **split spindle**: two offset charcoal strokes bound by one vermilion filament, forming a subtle “T” without using text. The wordmark is custom-set in DM Serif Display, with the “h” and “l” visually echoing parallel loom uprights.

### Signature Brand Color

**Loom red — `#C94832`**. It signifies live context: neither an error nor a generic call to action.
