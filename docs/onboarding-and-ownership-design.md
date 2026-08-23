# First-Run Support and Backup Checklist Design

Threadloom’s first-use support must make the product legible without turning it into a checklist-driven productivity application. The walkthrough is therefore a short, optional “first weave” invitation rather than a forced tour. It introduces only three moments: preserve a strand’s **why**, choose transparent return rules, and make a passphrase-protected backup. The interface never asks a new user for sensitive information and never puts the passphrase into onboarding state, local storage, or analytics.

| Feature | Design decision | Privacy and ownership boundary |
|---|---|---|
| First-run walkthrough | A three-card dialog appears only when the browser has no walkthrough-completion marker. It can be skipped, closed, or replayed from the header. | Completion is a local browser preference only; it contains no strand content or identity data. |
| Return-rule help | A small, keyboard-accessible help control sits beside each decision: eligibility, quiet interval, return-set size, and cue preference. | The explanations describe deterministic behavior; no hidden inference is introduced. |
| Backup checklist | The Backup Vault provides a print-ready sheet for a person’s own records. It lists safe export and recovery steps and intentionally tells users not to write their passphrase on the sheet. | The printable sheet contains no workspace content, file data, passphrase, or persistent account information. |

The walkthrough completion key is `threadloom.onboarding.v1.complete`. It is separate from both the IndexedDB workspace and the encrypted backup envelope. The backup checklist is generated as ordinary document markup and invokes the browser’s print dialog; Threadloom does not create or transmit a PDF.

> **Accessibility principle:** Tooltips supplement visible labels; they do not contain the only information necessary to use a control. The walkthrough can be completed entirely by keyboard and respects the existing dialog focus-management behavior.

The result is a first-run experience that teaches the product’s practice, while preserving Threadloom’s central premise: people stay in control of their own context, resurfacing rules, and backups.
