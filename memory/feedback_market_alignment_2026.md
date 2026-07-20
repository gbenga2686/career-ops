---
name: feedback-market-alignment-2026
description: Keep career-ops aligned with current job-market standards; 2026 refresh policies (ATS score, on-demand cover letters, 7 archetypes)
metadata:
  type: feedback
---

The user wants career-ops kept current with the live job market, not frozen at its defaults. On 2026-07-20 the system was refreshed to 2026 hiring standards. Treat these as deliberate policy (do not revert to older defaults), and re-verify them via WebSearch periodically:

- **7 archetypes**, ordered by 2026 demand+comp: Platform Engineer leads; MLOps/AI-Infra added; FinOps/DevSecOps/AIOps signals folded in. Source of truth: `modes/_shared.md` (North Star table) + `batch/batch-prompt.md`.
- **ATS Match score** in every evaluation: Bloque B reports `ATS Match: NN% (X/Y keywords)` (✅ verbatim / 🟡 synonym / ❌ absent). Header carries it. Defined in `modes/oferta.md` + `batch/batch-prompt.md`.
- **Bullet & keyword rules (ATS 2026)** in `modes/_shared.md`: three-pillar bullets (tool + scale + quantified result), mirror JD language naturally, NEVER keyword-stuff (flagged as manipulative in 2026).
- **Cover letters are on-demand, not automatic** — only when the user asks, the form has a field, or the JD requires one. See `_shared.md` ALWAYS rule 0. Ties to [[feedback-no-em-dashes]].
- **CV template is strictly single-column** (`templates/cv-template.html`); Core Competencies is single-column (CSS multi-column garbles ATS parsing). Do not reintroduce multi-column content.

**Why:** Two-reader hiring (parser + LLM ranking layer) and declining cover-letter readership (~26%) changed what works; the user asked to research the market and apply it.

**How to apply:** When editing modes/templates, preserve these. When the market shifts (new tools, comp bands, archetype demand), refresh via WebSearch and update the source files — then update this memory. Related: [[feedback-experience-framing]], [[feedback-dedup-check]].
