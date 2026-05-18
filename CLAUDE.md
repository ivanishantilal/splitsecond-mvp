# CLAUDE.md — Agent Instructions for SplitSecond

> This file briefs AI coding agents (Claude Code, Claude.ai, etc.) on the SplitSecond project. Read this **before** making changes.

---

## Project at a glance

**SplitSecond** is a FinTech MVP for end-to-end group bill splitting in the EU.
It demonstrates a single coordinated flow from receipt capture to bank-to-bank settlement, built on PSD2 open banking, SEPA Instant, and biometric Strong Customer Authentication (SCA).

This repository was built for the FinTech course (MSc Business Analytics & Management) and contains two artifacts:

1. **`app.py`** — a working Streamlit MVP that contains all the business logic (splitting, settlement, totals).
2. **`Prototype/`** — a hi-fidelity interactive HTML/React prototype that mocks the future native mobile app.

Both pieces should always stay in sync conceptually — when business logic changes in `app.py`, the prototype should reflect the same flow.

---

## Repository structure

```
splitsecond-mvp/
├── app.py                                    # Streamlit MVP (Python)
├── Prototype/
│   ├── SplitSecond Mobile (standalone).html  # Single-file standalone build (DO NOT hand-edit)
│   ├── SplitSecond Mobile.html               # Editable HTML host
│   ├── app.jsx                               # React app shell + state + Tweaks
│   ├── screens-1.jsx                         # Screens 1–4 (Welcome, Start, Receipt, People)
│   ├── screens-2.jsx                         # Screens 5–8 (Mode, Assign, Summary, Confirm)
│   ├── components.jsx                        # Shared UI (Avatar, Money, CountUp, icons)
│   ├── styles.css                            # Design tokens + base styles
│   ├── tweaks-panel.jsx                      # Tweaks panel scaffold
│   └── ios-frame.jsx                         # iPhone bezel/status bar component
├── SplitSecond_Assignment1_SlideDeck.pptx    # Pitch deck
├── CLAUDE.md                                 # ← you are here
├── AGENTS.md                                 # Vendor-neutral mirror of this file
├── .claude/context.md                        # Extended background notes
└── README.md
```

---

## Conventions to respect

### Python (Streamlit MVP)
- **Framework:** Streamlit — do not suggest Flask, FastAPI, or any other backend unless explicitly asked.
- **Architecture:** state-driven, single-file. All app state lives in `st.session_state`.
- **Style:** clear function names, docstrings, no over-engineering. The MVP is intentionally readable.
- **Currency:** Euros (€). Two decimal places everywhere.

### Prototype (HTML/React)
- The prototype is a **clickable mockup**, not a real app. Don't add real API calls.
- **No build step.** All JSX is transpiled in-browser via Babel standalone (script tags pinned in the HTML).
- **Design tokens** live in `styles.css` under `:root` / `[data-theme="dark"]`.
- **Typography:** Instrument Serif for hero/display, Manrope for UI, Geist Mono for technical chrome.
- **Money:** always rendered via the `Money` or `CountUp` component (tabular-nums, 2 decimals).
- **Standalone file:** `SplitSecond Mobile (standalone).html` is a **bundled output** — never edit it directly. To rebundle after editing the source files, follow the project workflow.

### General
- Maintain the EU/PSD2/SEPA framing throughout. This is the key differentiator vs. Splitwise / Venmo.
- Keep the eight-step flow consistent: Welcome → Start → Receipt → People → Mode → Assign → Summary → Confirm.
- Use clear, lowercase commit messages in imperative mood (e.g. `fix decimal formatting on receipt rows`).

---

## How the conceptual innovation maps to code

| Concept (pitch) | Implementation |
|---|---|
| NFC group discovery | `ScreenStart` → randomized "radar" scan with pulse rings |
| OCR receipt scanning | `ScreenReceipt` → randomized item pool, animated scan-line, sequential reveal |
| Item-level fairness | `ScreenAssign` → tap-to-claim chips, per-person live preview |
| Equal vs item split | `ScreenSplitMode` → mode selector with live preview of equal share |
| Settlement math | `calculate_totals` + `calculate_settlements` in `app.py` |
| PSD2 SCA | `ScreenConfirm` → Face ID animation with auth + settling phases |
| SEPA Instant | Final settlement phase, randomized 0.9–3.6s total (modeling real-world latency) |

---

## What NOT to do

- ❌ Do not hand-edit `SplitSecond Mobile (standalone).html`. Edit the source `.jsx`/`.css`/`.html` files and rebundle.
- ❌ Do not add a real backend or external API calls. This is an MVP demonstrating a concept.
- ❌ Do not change currency to USD by default. The product is EU-first.
- ❌ Do not break the 8-step flow ordering — it mirrors the pitch deck and the grading rubric.
- ❌ Do not invent new tech stack (no Next.js, no TypeScript build chain). Keep it inline-React + Babel for simplicity.

---

## When in doubt

- The pitch deck (`SplitSecond_Assignment1_SlideDeck.pptx`) is the source of truth for product vision.
- `app.py` is the source of truth for splitting/settlement math.
- The prototype is the source of truth for visual design and UX.

If a request conflicts with any of the above, ask the user before proceeding.
