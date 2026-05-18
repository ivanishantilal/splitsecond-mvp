# SplitSecond

**Split bills in seconds, not minutes.**

A FinTech MVP for EU-native, end-to-end group bill splitting — built around PSD2 open banking, SEPA Instant transfers, and biometric Strong Customer Authentication (SCA).

> Built for BM26BAM: FinTech (MSc Business Analytics & Management) — Assignment 2
> Authors: Ivani Shantilal (639265) · Renee Huber (635014)

---

## Table of Contents

1. [The Problem](#the-problem)
2. [The Solution](#the-solution)
3. [Key Features](#key-features)
4. [Architecture & Concept-to-Code Mapping](#architecture--concept-to-code-mapping)
5. [Repository Structure](#repository-structure)
6. [Deployment & Usage](#deployment--usage)
7. [The 8-Step User Flow](#the-8-step-user-flow)
8. [Splitting & Settlement Logic](#splitting--settlement-logic)
9. [Simulated FinTech Features](#simulated-fintech-features)
10. [Scaling Prerequisites & Technical Risks](#scaling-prerequisites--technical-risks)
11. [Operations, Maintenance & Security](#operations-maintenance--security)
12. [AI Agent Orchestration](#ai-agent-orchestration)
13. [Investor Summary](#investor-summary)

---

## The Problem

Modern payment systems execute individual transactions efficiently, but they were never designed for group coordination. When one person pays a shared bill, the group still needs to:

- Decide how to divide the cost
- Calculate individual shares (items, tax, tip)
- Remind people to pay
- Move to a separate app or bank transfer to settle

This creates a coordination gap. Tools like **Splitwise** track who owes whom but leave the actual payment to you. Apps like **Venmo** or **Tikkie** move money but require everyone on the same closed-loop wallet — not viable across European banks.

**SplitSecond closes the loop**: scan the receipt, assign items, and settle instantly between bank accounts — all in one flow.

---

## The Solution

SplitSecond is a **coordination layer** on top of existing EU payment infrastructure. It does not replace banks or payment networks — it connects the steps that existing tools leave fragmented:

```
Receipt capture → Item allocation → Balance calculation → Bank-to-bank settlement
```

The key innovation is not a new payment rail. It is the **integration of group coordination directly with payment execution**, leveraging infrastructure that already exists: PSD2 open banking APIs, SEPA Instant transfers, and biometric SCA.

---

## Key Features

| Feature | Description |
|---|---|
| **OCR Receipt Scanning** | Snap a photo of the bill — items and prices appear automatically |
| **NFC Group Discovery** | Nearby phones join the session with a tap — no group chats or QR codes |
| **Item-Level Assignment** | Split equally or let each person claim their own dishes |
| **SEPA Instant Settlement** | Bank-to-bank, EU-wide, settled in seconds |
| **Biometric SCA** | PSD2-compliant Face ID / fingerprint before any payment |
| **EU-Native** | Built on open banking rails — no closed wallet required |

---

## Architecture & Concept-to-Code Mapping

SplitSecond consists of four conceptual layers. The table below shows how each maps to actual code in this MVP.

### Conceptual Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Mobile UI Layer                    │
│         (React prototype / Streamlit MVP)           │
├─────────────────────────────────────────────────────┤
│             Cloud Sync / Session Layer              │
│      (st.session_state in MVP / real-time DB        │
│       in production)                                │
├─────────────────────────────────────────────────────┤
│           Receipt Processing Layer                  │
│       (OCR simulation → item extraction)            │
├─────────────────────────────────────────────────────┤
│           Payment Integration Layer                 │
│    (PSD2 AISP/PISP APIs + SEPA Instant rails)       │
└─────────────────────────────────────────────────────┘
```

### Concept → Code Mapping

| Conceptual Innovation | MVP Implementation | File |
|---|---|---|
| **NFC group discovery** | Animated "radar" scan with randomised participant pool (2–4 names, 1.4–2.3s delay) | `Prototype/screens-1.jsx` · `app.py:simulate_group_scan()` |
| **OCR receipt scanning** | Animated scan-line with sequential item reveal from a 16-item pool; editable result | `Prototype/screens-1.jsx` · `app.py:simulate_receipt_scan()` |
| **Item-level assignment** | Tap-to-claim chips per line item; live per-person cost preview updates in real time | `Prototype/screens-2.jsx` · `app.py:render_step_assign_items()` |
| **Equal vs item-based split** | Mode selector with live preview of equal share; routes flow to assignment screen or skips it | `Prototype/screens-2.jsx` · `app.py:render_step_split_mode()` |
| **Settlement math** | `calculate_totals()` + `calculate_settlements()` — parity between Python and JS | `app.py` |
| **PSD2 SCA (biometric auth)** | Face ID SVG animation with auth + settling phases; button disabled until auth completes | `Prototype/screens-2.jsx` · `app.py:render_step_confirm_payment()` |
| **SEPA Instant settlement** | Randomised 0.9–3.6s total (models real-world latency range); final confirmed state | `Prototype/screens-2.jsx` · `app.py` |

### Tech Stack

| Layer | MVP Technology | Production Equivalent |
|---|---|---|
| Frontend | React (JSX, in-browser Babel) + Streamlit | React Native |
| State management | `st.session_state` (Python) / React `useState` | Cloud-synced session store |
| Authentication | Simulated biometric button | PSD2 SCA — device + biometric (FIDO2) |
| Payments | Animated settlement confirmation | SEPA Instant Credit Transfer via PSP |
| Banking connectivity | Mocked | PSD2 AISP / PISP open banking APIs |
| Receipt OCR | Randomised item pool | Cloud Vision API / Google ML Kit |
| Group discovery | Scripted delay + random subset | Bluetooth / NFC proximity |

---

## Repository Structure

```
splitsecond-mvp/
│
├── app.py                                     # Streamlit MVP — all business logic
│                                              # (splitting math, session state, UI steps)
│
├── Prototype/
│   ├── SplitSecond Mobile (standalone).html   # Bundled output — do not hand-edit
│   ├── SplitSecond Mobile.html                # HTML host (editable)
│   ├── app.jsx                                # React app shell, state model, Tweaks panel
│   ├── screens-1.jsx                          # Screens 1–4: Welcome, Start, Receipt, People
│   ├── screens-2.jsx                          # Screens 5–8: Mode, Assign, Summary, Confirm
│   ├── components.jsx                         # Shared UI: Avatar, Money, CountUp, icons
│   ├── styles.css                             # Design tokens + base styles (CSS vars)
│   ├── ios-frame.jsx                          # iPhone bezel / status bar chrome
│   ├── tweaks-panel.jsx                       # Developer tweaks panel
│   └── README.md                              # Prototype-specific notes
│
├── CLAUDE.md                                  # AI agent instructions (Claude-specific)
├── AGENTS.md                                  # AI agent instructions (vendor-neutral)
├── .claude/
│   └── context.md                             # Extended background for AI agents
└── README.md                                  # ← you are here
```

---

## Deployment & Usage

### Option 1 — Hi-Fidelity Interactive Prototype (recommended for demo)

No install required. Works fully offline.

```bash
# Just open in any modern browser:
Prototype/SplitSecond Mobile (standalone).html
```

This renders a pixel-accurate iPhone mockup of the full 8-step app flow. All interactions, animations, and settlement logic run in-browser via React + Babel.

### Option 2 — Streamlit Logic MVP

The Streamlit app exposes the full business logic (splitting, settlement math, session state) in a desktop UI.

**Requirements:** Python 3.8+

```bash
# 1. Clone the repository
git clone https://github.com/ivanishantilal/splitsecond-mvp.git
cd splitsecond-mvp

# 2. Install dependencies
pip install streamlit

# 3. Run
streamlit run app.py
```

The app opens at `http://localhost:8501` in your browser. Navigate through all 8 steps using the on-screen buttons.

### Rebuilding the Standalone HTML (developers only)

The standalone file bundles all JSX/CSS sources into one self-contained file. To rebuild after editing source files:

1. Edit `app.jsx`, `screens-1.jsx`, `screens-2.jsx`, `components.jsx`, `styles.css`, or `ios-frame.jsx`
2. Inline the updated sources into `SplitSecond Mobile.html`
3. Save the result as `SplitSecond Mobile (standalone).html`

> Never hand-edit the standalone file directly - your changes will be overwritten on the next rebuild.

---

## The 8-Step User Flow

```
Step 1: Welcome        →  Sign in / create account (simulates PSD2 onboarding)
Step 2: Start a Split  →  Name the occasion; NFC scans nearby participants
Step 3: Receipt        →  OCR scans the bill; items are editable
Step 4: People         →  Review / adjust who's in the group
Step 5: Split Mode     →  Choose: equal split or item-based split
Step 6: Assign Items   →  (item mode only) Tap to claim dishes; cost previews update live
Step 7: Summary        →  Per-person totals; select who paid upfront; settlement instructions
Step 8: Confirm        →  Biometric auth (Face ID / fingerprint) → SEPA Instant settlement
```

The flow is linear and intentionally narrow: **one occasion, one bill, one upfront payer, immediate settlement.** This is the highest-frequency use case (restaurant dinner) and the clearest demonstration of the end-to-end concept.

---

## Splitting & Settlement Logic

Both `app.py` (Python) and the React prototype implement the same algorithm, ensuring consistency between the logic MVP and the visual prototype.

### Step 1 — Compute each person's owed amount

**Equal mode:**
```
each_person_owes = total_bill / number_of_participants
```

**Item mode:**
```
for each line item (including tax and tip):
    each_assigned_person_owes += item_price / number_assigned_to_item
```

Tax and tip are treated as shared line items split equally among all participants unless manually assigned.

### Step 2 — Identify the upfront payer

The user selects who physically paid the restaurant. That person's balance is set to zero for settlement purposes (they are owed money, not paying).

### Step 3 — Generate settlement instructions

```
for each participant ≠ upfront_payer:
    → "{participant} pays {payer} €{amount:.2f}"
```

**Example output:**
```
Alex pays Ivani €18.11
Jordan pays Ivani €22.45
Taylor pays Ivani €14.00
```

### Core functions in `app.py`

| Function | Purpose |
|---|---|
| `calculate_totals()` | Returns `{person: amount_owed}` dict for current split mode |
| `calculate_settlements()` | Returns total bill + list of settlement instruction strings |
| `get_total_bill()` | Subtotal + tax + tip |
| `allocation_preview()` | Per-person cost for one item given current assignments |

---

## Simulated FinTech Features

The MVP simulates four features that would require real infrastructure in production. All simulations are explicit and intentional — they demonstrate the product logic without requiring regulated integrations.

| Feature | MVP Simulation | Production Implementation |
|---|---|---|
| **OCR** | Items drawn from a 16-item curated pool; tax auto-set to 8–12% | Google ML Kit / Azure Computer Vision |
| **NFC discovery** | 2–4 names from a 12-name pool after 1.4–2.3s delay | Bluetooth LE / NFC P2P |
| **Biometric SCA** | CSS/SVG Face ID animation; button-gated flow | FIDO2 / platform biometric API |
| **SEPA Instant** | 0.9–3.6s animated settlement phase | SEPA Instant Credit Transfer via licensed PSP |

The randomisation in the prototype is intentional — it makes each demo recording look distinct and reinforces that the system is "live."

---

## Scaling Prerequisites & Technical Risks

### Prerequisites to scale

- **PSD2 licensing:** Operating as a Payment Initiation Service Provider (PISP) requires authorisation from a national competent authority (e.g. DNB in the Netherlands) or a partnership with a licensed PSP to operate under their licence umbrella.
- **PSP integration:** Real settlement requires API agreements with one or more PSPs (e.g. Adyen, Stripe, Mollie) or direct bank API access via PSD2 open banking.
- **Real-time session sync:** `st.session_state` is per-session and local. Production requires a shared cloud backend (e.g. Firebase Realtime Database or Supabase) so all participants see the same bill state simultaneously.
- **True OCR pipeline:** Requires integration with a cloud vision API and a post-processing layer to handle noisy receipts, varying formats, and multiple languages.
- **NFC/Bluetooth:** Requires a native mobile app (React Native or Flutter) — browser-based NFC access is limited and inconsistent across devices.

### Technical risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| OCR inaccuracy on real receipts | High | User review + manual correction step (already in flow) |
| Real-time sync conflicts (two people claim same item) | Medium | Optimistic locking or last-write-wins with conflict UI |
| PSP API differences across EU banks | High | Abstract behind a payment orchestration layer (e.g. Stripe) |
| SEPA Instant not supported by all banks | Medium | Fallback to standard SEPA Credit Transfer (next-day) |
| SCA exemptions and edge cases | Medium | Delegate SCA logic entirely to licensed PSP |

---

## Operations, Maintenance & Security

### Operational challenges

- **Multi-bank interoperability:** Each participant may bank with a different institution. PSD2 standardises the API interface, but implementation quality varies significantly across banks in practice. A PSP integration layer reduces this surface area.
- **Session lifecycle:** A shared payment session must handle participants dropping off, late joiners, and timeout scenarios. Production requires explicit session state management with expiry and re-invite flows.
- **Receipt edge cases:** Receipts with service charges, variable tax rates, multi-currency (travel), or multi-page formats require additional processing logic beyond a basic OCR pass.

### Security risks

| Risk | Impact | Mitigation |
|---|---|---|
| Intercepted payment initiation request | High | TLS everywhere; all PSD2 API calls require mutual TLS (mTLS) |
| Fraudulent session join (spoofed NFC) | Medium | SCA required before any money moves; session tokens are short-lived |
| Biometric data storage | High | Never store raw biometrics — delegate to OS secure enclave (Face ID / Android Keystore) |
| Man-in-the-middle on open Wi-Fi | Medium | Certificate pinning in the native app |
| Replay attacks on payment confirmation | High | PSD2 mandates dynamic linking — each SCA is bound to the specific amount and payee |

### For operators

The platform never holds user funds (no e-money licence required in the base model). All money flows directly between user bank accounts via PSP. This significantly reduces regulatory overhead but also means the operator has no float or ability to reverse transactions — error handling and dispute resolution must be handled through the PSP partner.

---

## AI Agent Orchestration

This project was built using a **single-primary-agent + human-reviewer** pattern.

### Tools used

| Tool | Role | Why it was a good fit |
|---|---|---|
| **Claude (claude.ai)** | Primary code generation, UI/UX design, documentation | Strong multi-file reasoning; follows long-form architectural instructions; design-aware for the prototype; produces clean, commented code without over-engineering |
| **GitHub Desktop** | Version control | Visual commit history without CLI friction; keeps collaboration history clean for grading |
| **Streamlit** | Python MVP framework | Fastest path from business logic to a runnable GUI — no frontend build step, pure Python |

### Orchestration approach

```
Human defines task / change request
        ↓
Claude reads CLAUDE.md + context.md (project conventions + constraints)
        ↓
Claude proposes implementation + writes code
        ↓
Human reviews diff, tests locally, requests adjustments
        ↓
Human commits to main with a descriptive message
        ↓
(repeat)
```

The human acts as **orchestrator and quality gate**. Claude handles code generation, documentation, and design iteration. No multi-agent handoff is used — a single agent with rich context files (`CLAUDE.md`, `AGENTS.md`, `.claude/context.md`) produces more consistent output than chaining agents with partial context.

Agent instructions are stored in:
- `CLAUDE.md` — Claude-specific conventions and constraints
- `AGENTS.md` — vendor-neutral mirror for any other coding agent
- `.claude/context.md` — extended background, design rationale, state model, investor talking points

---

## Investor Summary

> **The market:** ~200M EU adults dine out monthly. Group bills are ~30% of restaurant spend. Coordination around those bills is still manual.

> **The product:** SplitSecond is the missing coordination layer between expense allocation and bank-to-bank settlement — built on EU rails that already exist.

> **Revenue model:** 0.3% transaction fee (split proportionally across participants) + PSP revenue share + freemium premium features (analytics, trip history, household budgeting).

> **Competitive moat:** EU-native PSD2 + SCA + SEPA Instant integration is non-trivial for US-first competitors (Venmo, Cash App) that lack EU banking relationships and regulatory standing.

> **Beachhead:** Students and young professionals splitting restaurant bills in the EU — high frequency, clear pain point, easy to explain.

> **Expansion path:** Restaurant bills → multi-day travel → recurring household costs → B2B restaurant integrations.

---

*SplitSecond does not change how payments are processed. It improves how they are coordinated — addressing a gap that existing financial infrastructure was never designed to solve.*
