# AGENTS.md — Vendor-neutral agent instructions

> Mirror of `CLAUDE.md` for any AI coding agent (Cursor, Copilot, Gemini, Codex, etc.).
> If your tool reads `CLAUDE.md` specifically, prefer that file. Otherwise, read this.

See **[`CLAUDE.md`](./CLAUDE.md)** for the full briefing.

---

## Quick start for agents

1. **Read `CLAUDE.md` first** — it contains the full project context, conventions, and constraints.
2. **Read `README.md`** for the human-facing project description.
3. **Read `.claude/context.md`** for deeper background notes (pitch context, design rationale, AI workflow history).

## Tooling used in this project

| Tool | Used for | Why |
|---|---|---|
| **Claude (Claude.ai)** | Primary code generation, UI/UX design of the prototype, README + documentation | Strong at multi-file React/HTML projects, design-aware, follows long-form instructions |
| **GitHub Desktop** | Version control | Visual commits without command-line friction |
| **Streamlit** | Python MVP framework | Fastest path from logic to GUI for a single-developer FinTech demo |

## Agent orchestration approach

This project uses a **single-agent-with-context-files** pattern:
- One primary agent (Claude) drives all changes.
- The agent reads `CLAUDE.md` / `AGENTS.md` on entry to load project conventions.
- Human reviews each commit before pushing to `main`.
- No multi-agent handoff; the human is the orchestrator and reviewer.

## Constraints summary (read `CLAUDE.md` for full detail)

- Streamlit MVP stays Python-only, single file.
- Prototype stays JSX-in-browser (no build step).
- Standalone HTML is a build artifact — never hand-edited.
- EU/PSD2/SEPA framing must be preserved.
- 8-step flow ordering must be preserved.
