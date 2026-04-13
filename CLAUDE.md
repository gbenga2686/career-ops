# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Career-Ops -- AI Job Search Pipeline

## Commands

```bash
# Install dependencies (only Playwright)
npm install
npx playwright install chromium   # Required for PDF generation and scraping

# Pipeline maintenance (run after batch evaluations)
npm run merge        # Merge batch/tracker-additions/*.tsv into applications.md
npm run verify       # Health check: statuses, duplicates, broken report links
npm run normalize    # Clean non-canonical statuses in applications.md
npm run dedup        # Remove duplicate tracker entries

# PDF generation (standalone, called by modes internally)
node generate-pdf.mjs <input.html> <output.pdf> [--format=letter|a4]

# Pre-session setup check
npm run sync-check   # Validates cv.md, profile.yml, and no hardcoded metrics

# Dashboard (Go TUI)
cd dashboard && go build -o career-dashboard . && ./career-dashboard
```

All scripts support `--dry-run` to preview changes without writing. There is no build step, linter, or test suite — data integrity is validated through the npm run verify/normalize/dedup scripts.

## Architecture

### How modes work

Every skill mode is a markdown file in `modes/`. When the user triggers a mode (by pasting a URL, asking for a scan, etc.), Claude reads the relevant `.md` file and executes the instructions within it. `modes/_shared.md` is the backbone — it contains the 6 archetypes, scoring rubric, framing rules, and compensation guidance that all other modes import conceptually.

**Mode dispatch** (Claude selects the mode based on intent):

| Trigger | Mode file |
|---------|-----------|
| Paste URL or JD text | `modes/auto-pipeline.md` |
| "Evaluate this offer" | `modes/oferta.md` |
| "Compare offers" | `modes/ofertas.md` |
| "Search for jobs" | `modes/scan.md` |
| "Process pending URLs" | `modes/pipeline.md` |
| "Generate my CV / PDF" | `modes/pdf.md` |
| "Batch process" | `modes/batch.md` |
| "Research company" | `modes/deep.md` |
| "LinkedIn message" | `modes/contacto.md` |
| "Fill application form" | `modes/apply.md` |
| "Evaluate course/cert" | `modes/training.md` |
| "Evaluate project idea" | `modes/project.md` |
| "Show my applications" | `modes/tracker.md` |
| "Generate cover letter" | `modes/cover-letter.md` |

### Data flow: single offer (auto-pipeline)

```
URL/JD → [Playwright → WebFetch → WebSearch] → Extract JD text
       → Read cv.md + article-digest.md + config/profile.yml
       → Detect archetype (from modes/_shared.md)
       → A-F evaluation blocks → score
       → Save report: reports/{###}-{company-slug}-{YYYY-MM-DD}.md
       → If score ≥ 3.0: generate CV PDF + Cover Letter PDF via generate-pdf.mjs
       → Write TSV to batch/tracker-additions/{num}-{slug}.tsv
       → [Later] npm run merge → updates data/applications.md
```

### Data flow: batch processing

Batch mode (`modes/batch.md`) spawns headless `claude -p` workers using `batch/batch-prompt.md` as the system prompt. Each worker is self-contained (no external file access). Workers write results to `batch/tracker-additions/`. The conductor tracks state in `batch/batch-state.tsv` (resumable). After all workers finish, run `npm run merge`.

### Data flow: scanner

```
scan.md → Level 1: Playwright to careers pages (tracked_companies in portals.yml)
        → Level 2: Greenhouse API for companies with api: field
        → Level 3: WebSearch using search_queries in portals.yml
        → Filter by title_filter.positive/negative
        → Dedup against scan-history.tsv + applications.md + pipeline.md
        → Append new offers to data/pipeline.md
```

### Key architectural constraints

- **Tracker additions are write-once via TSV** — never add rows directly to `applications.md`; always write a TSV file and run `npm run merge`. You CAN edit existing rows to update status/notes.
- **Report numbers are sequential** — find the highest existing number in `reports/` and increment by 1.
- **JD extraction priority** — always try Playwright first, WebFetch second, WebSearch last.
- **Metrics must be dynamic** — always read from `cv.md` or `article-digest.md` at runtime; never hardcode numbers in mode files or prompts.
- **Batch workers are isolated** — `claude -p` workers cannot use Playwright; they use WebFetch and mark reports as `**Verification:** unconfirmed (batch mode)`.

---

## Origin

This system was built and used by [santifer](https://santifer.io) to evaluate 740+ job offers, generate 100+ tailored CVs, and land a Head of Applied AI role. The archetypes, scoring logic, negotiation scripts, and proof point structure all reflect his specific career search in AI/automation roles.

The portfolio that goes with this system is also open source: [cv-santiago](https://github.com/santifer/cv-santiago).

**It will work out of the box, but it's designed to be made yours.** If the archetypes don't match your career, the modes are in the wrong language, or the scoring doesn't fit your priorities -- just ask. You (Claude) can edit any file in this system. The user says "change the archetypes to data engineering roles" and you do it. That's the whole point.

## What is career-ops

AI-powered job search automation built on Claude Code: pipeline tracking, offer evaluation, CV generation, portal scanning, batch processing.

### Main Files

| File | Function |
|------|----------|
| `data/applications.md` | Application tracker |
| `data/pipeline.md` | Inbox of pending URLs |
| `data/scan-history.tsv` | Scanner dedup history |
| `portals.yml` | Query and company config |
| `templates/cv-template.html` | HTML template for CVs |
| `generate-pdf.mjs` | Puppeteer: HTML to PDF |
| `article-digest.md` | Compact proof points from portfolio (optional) |
| `interview-prep/story-bank.md` | Accumulated STAR+R stories across evaluations |
| `reports/` | Evaluation reports (format: `{###}-{company-slug}-{YYYY-MM-DD}.md`) |

### First Run — Onboarding (IMPORTANT)

**Before doing ANYTHING else, check if the system is set up.** Run these checks silently every time a session starts:

1. Does `cv.md` exist?
2. Does `config/profile.yml` exist (not just profile.example.yml)?
3. Does `portals.yml` exist (not just templates/portals.example.yml)?

**If ANY of these is missing, enter onboarding mode.** Do NOT proceed with evaluations, scans, or any other mode until the basics are in place. Guide the user step by step:

#### Step 1: CV (required)
If `cv.md` is missing, ask:
> "I don't have your CV yet. You can either:
> 1. Paste your CV here and I'll convert it to markdown
> 2. Paste your LinkedIn URL and I'll extract the key info
> 3. Tell me about your experience and I'll draft a CV for you
>
> Which do you prefer?"

Create `cv.md` from whatever they provide. Make it clean markdown with standard sections (Summary, Experience, Projects, Education, Skills).

#### Step 2: Profile (required)
If `config/profile.yml` is missing, copy from `config/profile.example.yml` and then ask:
> "I need a few details to personalize the system:
> - Your full name and email
> - Your location and timezone
> - What roles are you targeting? (e.g., 'Senior Backend Engineer', 'AI Product Manager')
> - Your salary target range
>
> I'll set everything up for you."

Fill in `config/profile.yml` with their answers. For archetypes, map their target roles to the closest matches and update `modes/_shared.md` if needed.

#### Step 3: Portals (recommended)
If `portals.yml` is missing:
> "I'll set up the job scanner with 45+ pre-configured companies. Want me to customize the search keywords for your target roles?"

Copy `templates/portals.example.yml` → `portals.yml`. If they gave target roles in Step 2, update `title_filter.positive` to match.

#### Step 4: Tracker
If `data/applications.md` doesn't exist, create it:
```markdown
# Applications Tracker

| # | Date | Company | Role | Score | Status | PDF | Report | Notes |
|---|------|---------|------|-------|--------|-----|--------|-------|
```

#### Step 5: Get to know the user (important for quality)

After the basics are set up, proactively ask for more context. The more you know, the better your evaluations will be:

> "The basics are ready. But the system works much better when it knows you well. Can you tell me more about:
> - What makes you unique? What's your 'superpower' that other candidates don't have?
> - What kind of work excites you? What drains you?
> - Any deal-breakers? (e.g., no on-site, no startups under 20 people, no Java shops)
> - Your best professional achievement — the one you'd lead with in an interview
> - Any projects, articles, or case studies you've published?
>
> The more context you give me, the better I filter. Think of it as onboarding a recruiter — the first week I need to learn about you, then I become invaluable."

Store any insights the user shares in `config/profile.yml` (under narrative) or in `article-digest.md` if they share proof points. Update `modes/_shared.md` archetypes and framing if what they describe doesn't match the defaults.

**After every evaluation, learn.** If the user says "this score is too high, I wouldn't apply here" or "you missed that I have experience in X", update your understanding. Adjust the framing in `_shared.md` or add notes to `profile.yml`. The system should get smarter with every interaction.

#### Step 6: Ready
Once all files exist, confirm:
> "You're all set! You can now:
> - Paste a job URL to evaluate it
> - Run `/career-ops scan` to search portals
> - Run `/career-ops` to see all commands
>
> Everything is customizable — just ask me to change anything.
>
> Tip: Having a personal portfolio dramatically improves your job search. If you don't have one yet, the author's portfolio is also open source: github.com/santifer/cv-santiago — feel free to fork it and make it yours."

Then suggest automation:
> "Want me to scan for new offers automatically? I can set up a recurring scan every few days so you don't miss anything. Just say 'scan every 3 days' and I'll configure it."

If the user accepts, use the `/loop` or `/schedule` skill (if available) to set up a recurring `/career-ops scan`. If those aren't available, suggest adding a cron job or remind them to run `/career-ops scan` periodically.

### Personalization

This system is designed to be customized by YOU (Claude). When the user asks you to change archetypes, translate modes, adjust scoring, add companies, or modify negotiation scripts -- do it directly. You read the same files you use, so you know exactly what to edit.

**Common customization requests:**
- "Change the archetypes to [backend/frontend/data/devops] roles" → edit `modes/_shared.md`
- "Translate the modes to English" → edit all files in `modes/`
- "Add these companies to my portals" → edit `portals.yml`
- "Update my profile" → edit `config/profile.yml`
- "Change the CV template design" → edit `templates/cv-template.html`
- "Adjust the scoring weights" → edit `modes/_shared.md` and `batch/batch-prompt.md`

### Skill Modes

| If the user... | Mode |
|----------------|------|
| Pastes JD or URL | auto-pipeline (evaluate + report + PDF + tracker) |
| Asks to evaluate offer | `oferta` |
| Asks to compare offers | `ofertas` |
| Wants LinkedIn outreach | `contacto` |
| Asks for company research | `deep` |
| Wants to generate CV/PDF | `pdf` |
| Wants a cover letter | `cover-letter` |
| Evaluates a course/cert | `training` |
| Evaluates portfolio project | `project` |
| Asks about application status | `tracker` |
| Fills out application form | `apply` |
| Searches for new offers | `scan` |
| Processes pending URLs | `pipeline` |
| Batch processes offers | `batch` |

### CV Source of Truth

- `cv.md` in project root is the canonical CV
- `article-digest.md` has detailed proof points (optional)
- **NEVER hardcode metrics** -- read them from these files at evaluation time

---

## Ethical Use -- CRITICAL

**This system is designed for quality, not quantity.** The goal is to help the user find and apply to roles where there is a genuine match -- not to spam companies with mass applications.

- **NEVER submit an application without the user reviewing it first.** Fill forms, draft answers, generate PDFs -- but always STOP before clicking Submit/Send/Apply. The user makes the final call.
- **Strongly discourage low-fit applications.** If a score is below 4.0/5, explicitly recommend against applying. The user's time and the recruiter's time are both valuable. Only proceed if the user has a specific reason to override the score.
- **Quality over speed.** A well-targeted application to 5 companies beats a generic blast to 50. Guide the user toward fewer, better applications.
- **Respect recruiters' time.** Every application a human reads costs someone's attention. Only send what's worth reading.

---

## Offer Verification -- MANDATORY

**NEVER trust WebSearch/WebFetch to verify if an offer is still active.** ALWAYS use Playwright:
1. `browser_navigate` to the URL
2. `browser_snapshot` to read content
3. Only footer/navbar without JD = closed. Title + description + Apply = active.

**Exception for batch workers (`claude -p`):** Playwright is not available in headless pipe mode. Use WebFetch as fallback and mark the report header with `**Verification:** unconfirmed (batch mode)`. The user can verify manually later.

---

## Stack and Conventions

- Node.js (mjs modules), Playwright (PDF + scraping), YAML (config), HTML/CSS (template), Markdown (data)
- Scripts in `.mjs`, configuration in YAML
- Output in `output/` (gitignored), Reports in `reports/`
- JDs in `jds/` (referenced as `local:jds/{file}` in pipeline.md)
- Batch in `batch/` (gitignored except scripts and prompt)
- Report numbering: sequential 3-digit zero-padded, max existing + 1
- **RULE: After each batch of evaluations, run `node merge-tracker.mjs`** to merge tracker additions and avoid duplications.
- **RULE: NEVER create new entries in applications.md if company+role already exists.** Update the existing entry.

### TSV Format for Tracker Additions

Write one TSV file per evaluation to `batch/tracker-additions/{num}-{company-slug}.tsv`. Single line, 9 tab-separated columns:

```
{num}\t{date}\t{company}\t{role}\t{status}\t{score}/5\t{pdf_emoji}\t[{num}](reports/{num}-{slug}-{date}.md)\t{note}
```

**Column order (IMPORTANT -- status BEFORE score):**
1. `num` -- sequential number (integer)
2. `date` -- YYYY-MM-DD
3. `company` -- short company name
4. `role` -- job title
5. `status` -- canonical status (e.g., `Evaluated`)
6. `score` -- format `X.X/5` (e.g., `4.2/5`)
7. `pdf` -- `✅` or `❌`
8. `report` -- markdown link `[num](reports/...)`
9. `notes` -- one-line summary

**Note:** In applications.md, score comes BEFORE status. The merge script handles this column swap automatically.

### Pipeline Integrity

1. **NEVER edit applications.md to ADD new entries** -- Write TSV in `batch/tracker-additions/` and `merge-tracker.mjs` handles the merge.
2. **YES you can edit applications.md to UPDATE status/notes of existing entries.**
3. All reports MUST include `**URL:**` in the header (between Score and PDF).
4. All statuses MUST be canonical (see `templates/states.yml`).
5. Health check: `node verify-pipeline.mjs`
6. Normalize statuses: `node normalize-statuses.mjs`
7. Dedup: `node dedup-tracker.mjs`

### Canonical States (applications.md)

**Source of truth:** `templates/states.yml`

| State | When to use |
|-------|-------------|
| `Evaluated` | Report completed, pending decision |
| `Applied` | Application sent |
| `Responded` | Company responded |
| `Interview` | In interview process |
| `Offer` | Offer received |
| `Rejected` | Rejected by company |
| `Discarded` | Discarded by candidate or offer closed |
| `SKIP` | Doesn't fit, don't apply |

**RULES:**
- No markdown bold (`**`) in status field
- No dates in status field (use the date column)
- No extra text (use the notes column)
