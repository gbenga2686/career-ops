# Mode: interview-prep — Interview Prep Doc + Branded PDF

Generate a tailored, role-specific interview prep document AND a branded PDF for it.

## Trigger

- User says "create interview prep", "interview prep for [company]", "prep me for the [company] interview"
- User pastes a recruiter interview pack / competency framework (PDF or text) and asks for prep
- Internally relevant after a role reaches `Interview` status in the tracker

## Inputs

1. **The role** — match to an existing report in `reports/` (and tracker entry). If the user pasted a recruiter pack, tie it to the most relevant open application.
2. `reports/{###}-{slug}-{date}.md` — the evaluation (Blocks A-F, especially F = interview plan)
3. `cv.md` + `config/profile.yml` — proof points and metrics
4. `interview-prep/story-bank.md` — reusable STAR+R stories
5. Any recruiter pack / JD the user provides — mine it for the exact question set and interview stages

## Pipeline

### Step 1 — Write the prep doc (Markdown)

Save to `interview-prep/{###}-{slug}-interview-prep.md` (use the role's report number `{###}`; add a stage suffix like `-stage2` if it's stage-specific).

Structure (adapt to what the role/recruiter provides):
- **Header:** role, source (recruiter pack / report link + score), and the **interview process / stages**
- **Company context** ("know this cold") + a one-line "why {company}"
- **The stack** and where the candidate stands (✅ strong / ⚠️ gap), pulled from the report's Block B
- **Strongest cards** to lead with
- **Standard questions** (tell me about yourself, why here, why leaving, strengths/weaknesses, goals, why hire you, **salary**) with rehearsed answers
- **Competency questions** — map every competency the recruiter lists to a STAR+R story (reuse `story-bank.md`; append new stories there)
- **Tough questions** (motivation, criticism, pressure, dislikes, job-hopping)
- **Technical assessment prep** if the process has a technical stage
- **Questions for the candidate to ask** (~6-8)
- **Red flags to handle** — pull the gaps/flags from the report and give positive framing
- **Pre-interview checklist**

Use native tech English, concrete metrics from `cv.md` (never invent), and STAR+R (Reflection signals seniority).

### Step 2 — Append new stories to the Story Bank

If the prep introduced STAR+R stories not already in `interview-prep/story-bank.md`, append them so they're reusable next time.

### Step 3 — Generate the branded PDF (ALWAYS)

Convert the Markdown prep doc to a branded PDF (same visual identity as the CV). The PDF goes in a **dated folder** under `output/interview-prep/`:

```bash
# Output path is auto-built as output/interview-prep/<YYYY-MM-DD>/<basename>-<YYYY-MM-DD>.pdf
node interview-prep-pdf.mjs interview-prep/{###}-{slug}-interview-prep.md --format=a4
# or: npm run prep-pdf -- interview-prep/{###}-{slug}-interview-prep.md --format=a4
```

- `interview-prep-pdf.mjs` does Markdown → branded HTML → PDF in one step (Space Grotesk + DM Sans, cyan/purple gradient, styled tables/blockquotes/lists).
- **Folder convention:** `output/interview-prep/<YYYY-MM-DD>/` where the date is the actual generation date (`date +%Y-%m-%d`). The script creates the folder automatically.
- Paper format: `a4` for UK/Europe (default), `letter` for US/Canada.
- Multi-page is fine for prep docs (unlike CV/cover letter).

### Step 4 — Update the tracker

Add a note on the existing tracker row pointing to the prep doc (edit in place — this is an update, not a new entry). If an interview is confirmed, set status to `Interview` with the date/stage in the note.

### Step 5 — Report to the user

Give: the prep doc path, the PDF path (with the dated folder), and a short summary of what to prioritise (e.g. the salary play, a hard gap to frame).
