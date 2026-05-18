# CLAUDE.md — Agent Instructions for SplitSecond

> This file briefs AI coding agents (Claude Code, Claude.ai, etc.) on the SplitSecond project.
> Read this **before** making any changes.

---

## Project at a glance

**SplitSecond** is a FinTech MVP for end-to-end group bill splitting in the EU.
It demonstrates a single coordinated flow from receipt capture to bank-to-bank settlement, built on PSD2 open banking, SEPA Instant, and biometric Strong Customer Authentication (SCA).

This repository was built for **BM26BAM: FinTech (MSc Business Analytics & Management)** as a two-part assignment:

- **Assignment 1:** Conceptual innovation + investor pitch deck → `SplitSecond_Assignment1_SlideDeck.pptx`
- **Assignment 2:** Working MVP + clean repo + investor-oriented demo video → this repository

The repo contains two artifacts:

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
├── CLAUDE.md                                 # ← you are here (Claude-specific agent instructions)
├── AGENTS.md                                 # Vendor-neutral mirror of this file
├── .claude/context.md                        # Extended background notes
└── README.md                                 # Source of truth for architecture + deployment
```

---

## Sources of truth

| Question | Where to look |
|---|---|
| Product vision and investor framing | `SplitSecond_Assignment1_SlideDeck.pptx` |
| Splitting / settlement math | `app.py` (`calculate_totals`, `calculate_settlements`) |
| Visual design and UX flow | `Prototype/` — the hi-fi prototype |
| Architecture and deployment | `README.md` |
| Extended background and design rationale | `.claude/context.md` |

If a request conflicts with any of the above, ask the user before proceeding.

---

## Agent orchestration model

This project uses a **single-primary-agent + human-reviewer** pattern. There is no multi-agent handoff.

### Workflow

```
1. Human defines a task or change request in chat
2. Agent reads CLAUDE.md + .claude/context.md to load project conventions
3. Agent proposes implementation and writes code
4. Human reviews, tests locally, and requests adjustments if needed
5. Human commits the final version to main with a descriptive commit message
6. Repeat
```

### The human's role

The human acts as **orchestrator and quality gate**. They define what to build, review every change before it is committed, and decide when the output is good enough to ship. The agent does not commit or push autonomously.

### Why a single agent works here

A single agent with rich context files produces more consistent output than chaining multiple agents with partial context. The project conventions, constraints, and architecture are all documented in this file and in `.claude/context.md` — loading these at the start of each session is sufficient to maintain continuity across conversations.

### Commit message convention

Use lowercase imperative mood, e.g.:
- `add item assignment screen to prototype`
- `fix decimal formatting on receipt rows`
- `update readme with architecture diagram`

---

## Conventions to respect

### Python (Streamlit MVP)

- **Framework:** Streamlit only — do not suggest Flask, FastAPI, or any other backend unless explicitly asked.
- **Architecture:** state-driven, single-file. All app state lives in `st.session_state`.
- **Style:** clear function names, docstrings, no over-engineering. The MVP is intentionally readable.
- **Currency:** Euros (€). Two decimal places everywhere.

### Prototype (HTML/React)

- The prototype is a **clickable mockup**, not a real app. Do not add real API calls.
- **No build step.** All JSX is transpiled in-browser via Babel standalone (script tags pinned in the HTML).
- **Design tokens** live in `styles.css` under `:root` / `[data-theme="dark"]`.
- **Typography:** Instrument Serif for hero/display, Manrope for UI, Geist Mono for technical chrome.
- **Money:** always rendered via the `Money` or `CountUp` component (tabular-nums, 2 decimals).
- **Standalone file:** `SplitSecond Mobile (standalone).html` is a **bundled output** — never edit it directly. Edit the source `.jsx` / `.css` / `.html` files and rebuild.

### General

- Maintain the EU / PSD2 / SEPA framing throughout. This is the key differentiator vs. Splitwise / Venmo.
- Keep the eight-step flow consistent: Welcome → Start → Receipt → People → Mode → Assign → Summary → Confirm.
- All simulated features (OCR, NFC, biometric SCA, SEPA Instant) must remain clearly framed as simulations — do not present them as real integrations.

---

## How the conceptual innovation maps to code

| Concept (pitch) | Implementation | Location |
|---|---|---|
| NFC group discovery | Animated "radar" scan with pulse rings; randomised participant pool | `Prototype/screens-1.jsx` · `app.py:simulate_group_scan()` |
| OCR receipt scanning | Animated scan-line + sequential item reveal from a 16-item pool | `Prototype/screens-1.jsx` · `app.py:simulate_receipt_scan()` |
| Item-level fairness | Tap-to-claim chips; per-person live cost preview | `Prototype/screens-2.jsx` · `app.py:render_step_assign_items()` |
| Equal vs item split | Mode selector with live equal-share preview; routes flow accordingly | `Prototype/screens-2.jsx` · `app.py:render_step_split_mode()` |
| Settlement math | `calculate_totals()` + `calculate_settlements()` — parity between Python and JS | `app.py` |
| PSD2 SCA | Face ID SVG animation; payment button disabled until auth completes | `Prototype/screens-2.jsx` · `app.py:render_step_confirm_payment()` |
| SEPA Instant | Randomised 0.9–3.6s settlement phase modelling real-world latency | `Prototype/screens-2.jsx` · `app.py` |

---

## What NOT to do

- Do not hand-edit `SplitSecond Mobile (standalone).html` — it is a build artifact.
- Do not add real backend API calls or external service integrations — this is a concept MVP.
- Do not change default currency to USD — the product is EU-first.
- Do not break the 8-step flow ordering — it mirrors the pitch deck and the grading rubric.
- Do not introduce a new tech stack (no Next.js, no TypeScript build chain) — keep it inline React + Babel.
- Do not present simulated features (OCR, NFC, SCA, SEPA) as real — always frame them as simulations.
