# SplitSecond 

**Split bills in seconds, not minutes.**
A FinTech concept for EU-native, real-time group bill splitting — built around PSD2 open banking, SEPA Instant transfers, and biometric authentication (SCA).

---

## The Problem

Splitting bills in a group today is slow, awkward, and disconnected from how people actually pay. Existing apps either:
- only track *who-owes-whom* (Splitwise) and leave the actual money movement to you, or
- require everyone to be on the same closed-loop wallet (Venmo, Tikkie).

SplitSecond closes the loop: **scan the receipt, assign items, and settle instantly between bank accounts — all in one flow.**

---

## Key Features

- 📷 **Receipt scanning (OCR)** — snap a photo of the bill, items appear automatically
- 📡 **NFC group discovery** — nearby phones join the session with a tap, no group chats or QR codes
- 🍕 **Item-level assignment** — split equally or claim individual dishes
- 🏦 **SEPA Instant settlement** — bank-to-bank, EU-wide, in seconds
- 🔐 **Biometric SCA** — PSD2-compliant Face ID / fingerprint authentication
- 🇪🇺 **EU-native** — built on open banking rails, no closed wallet required

---

## 📂 Repository Structure

```
splitsecond-mvp/
├── app.py                                    # Streamlit MVP — the working logic prototype
├── Prototype/                                # Hi-fidelity interactive prototype (HTML)
│   └── SplitSecond Mobile (standalone).html
├── SplitSecond_Assignment1_SlideDeck.pptx    # Pitch deck
└── README.md
```

---

## Running the Prototypes

### Hi-Fi Interactive Prototype (recommended)
Just open the HTML file in any modern browser:
```
Prototype/SplitSecond Mobile (standalone).html
```
Works offline. No install required.

### Streamlit MVP (logic prototype)
```bash
pip install streamlit
streamlit run app.py
```

---

## The User Flow

1. **Welcome** — sign in (PSD2 framing)
2. **Start a split** — name the occasion + group
3. **Discover** — NFC pings nearby phones; they join automatically
4. **Scan** — OCR pulls items off the receipt
5. **Choose split mode** — equal or item-based
6. **Assign** — tap items to claim them
7. **Review** — see per-person totals
8. **Settle** — Face ID → SEPA Instant → done

---

## Tech Concept

| Layer | Technology |
|---|---|
| Mobile | React Native (concept) |
| Auth | PSD2 Strong Customer Authentication (biometric) |
| Payments | SEPA Instant Credit Transfer |
| Banking | Open Banking APIs (PSD2 AISP/PISP) |
| Receipt OCR | Cloud vision API (concept) |
| Group sync | NFC discovery + real-time backend |
