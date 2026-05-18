# SplitSecond — Extended Context for AI Agents

> This file holds deeper background that doesn't belong in the human-facing README,
> but helps an AI agent make better decisions when working on the project.

---

## Origin & academic context

SplitSecond was built for **FinTech (MSc Business Analytics & Management)** as a two-part assignment:

- **Assignment 1:** conceptual innovation + pitch deck. Output: `SplitSecond_Assignment1_SlideDeck.pptx`.
- **Assignment 2:** working MVP + clean repo + investor-oriented demo video. Output: this repo.

The grading criteria emphasize:
1. Clear mapping of concept → code.
2. Clean, well-commented, well-organized code.
3. Visible collaboration history (commit log).
4. Documentation (README + agent instructions).
5. Investor-oriented framing throughout.

---

## Product positioning (one paragraph)

Existing apps either *track* who owes whom (Splitwise, Tricount) or *move* money in closed-loop wallets (Venmo, Tikkie). Neither closes the loop end-to-end on EU bank rails. SplitSecond uses **PSD2 open banking** + **SEPA Instant** + **biometric SCA** to combine the two: receipt scanning, item allocation, and settlement happen inside one app, with funds moving bank-to-bank in under 10 seconds. The differentiator is not a new payment rail — it is a **new coordination layer** sitting on top of EU rails that already exist.

---

## Design system rationale

- **Instrument Serif** for hero numbers and titles → editorial, premium, signals "financial" without being corporate.
- **Manrope** for UI → modern geometric sans, neutral, excellent for product UI.
- **Geist Mono** for technical chrome (reference numbers, transaction IDs) → signals precision.
- **Warm off-white base (`#F4F2EE`)** instead of pure white → less clinical than a typical fintech UI, more "social dinner with friends" — which matches the beachhead market (students + young professionals).
- **Single confident accent** (default violet `#6948e0`) → resists "data slop" gradients and rainbow palettes.

---

## State model (prototype)

The React app holds a single state object passed down to every screen:

```js
{
  user: { name, email },
  occasion: string,
  group: string,
  people: string[],         // names; first `nfcCount` are "discovered", rest are manual
  nfcCount: number,
  items: { name, price }[],
  tax: number,
  tip: number,
  splitMode: 'equal' | 'items',
  assignments: { [itemName]: string[] },  // who claimed each line
  payer: string,            // who paid the bill upfront
}
```

A `set(patch)` function merges partial updates. Every screen receives `{ state, set, currency, onContinue, onBack }`.

---

## Settlement math (Python ↔ JS parity)

Both `app.py` and the prototype implement the same algorithm:

1. Compute each person's owed amount:
   - **Equal mode:** `totalBill / numPeople`
   - **Item mode:** for each line (items + tax + tip), `price / len(assigned)` summed over claims
2. Identify the upfront payer.
3. Produce settlement instructions: `for each person ≠ payer, "<person> pays <payer> €X.XX"`

Tax and tip are always shared (split among all valid people) unless the user assigns them otherwise in item-mode.

---

## Randomization (prototype only)

To make the demo feel alive across multiple recordings:
- **NFC discovery** pulls 2–4 names from a 12-name pool, after a 1.4–2.3s delay.
- **Receipt scan** pulls 4–6 items from a 16-item pool, tax = 8–12% of subtotal, after a 1.4–2.3s delay.
- **Settlement** runs Face ID (0.9–1.6s) + SEPA Instant (1.1–2.0s), total always under 3.6s.

These are intentional — never make them deterministic without first asking the user.

---

## Investor talking points (for video script)

Use these when framing demos or pitches:
- **TAM:** ~200M EU adults dine out monthly; group bills are ~30% of restaurant spend.
- **Revenue model:** 0.3% transaction fee + PSP revenue share + freemium analytics + B2B restaurant integrations.
- **Defensibility:** EU-native compliance moat (PSD2 + SCA + SEPA Instant integration is non-trivial for non-EU competitors).
- **Beachhead:** students + young professionals splitting restaurant bills.
- **Expansion path:** restaurant bills → multi-day travel → recurring household costs.

---

## Known limitations of the current MVP

- No real OCR — items are mocked from a curated pool.
- No real NFC — proximity is simulated with a scripted delay + random subset.
- No real banking integration — settlement is animated, not actually moved.
- No real biometric API — Face ID is a CSS/SVG animation.

All four are explicitly framed in the assignment as **simulated** in the MVP; the architecture and UI are real.

---

## Future work (what an agent might be asked to add)

- Multi-currency conversion at settlement time
- Per-trip history view
- Notifications/reminders for unpaid settlements
- Restaurant QR code → auto-join group session
- A11y pass (keyboard nav, screen reader labels, contrast audit)
- True PWA install (manifest + service worker)

If asked to implement any of these, keep them additive — don't disrupt the existing 8-step flow.
