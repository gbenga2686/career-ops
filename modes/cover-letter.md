# Mode: cover-letter — Cover Letter PDF Generator

Generate a tailored, 1-page cover letter PDF that matches the CV's visual identity.

## Trigger

- User says "generate cover letter", "write a cover letter", "cover letter for [company/role]"
- Called internally by `auto-pipeline` (when score >= 3.0) and `pdf` mode
- Requires a JD in context (text or URL)

## Inputs required

Before generating, ensure you have:
1. JD text (or URL — extract it first)
2. `cv.md` — candidate experience and metrics
3. `config/profile.yml` — name, email, phone, LinkedIn, location, title
4. Hiring manager name (optional — use "Hiring Team" if unknown)
5. Paper format: A4 for UK/Europe, letter for US/Canada

## Pipeline

### Step 1 — Extract hiring manager (if not already known)

Try to find the hiring manager from:
1. The JD itself (often signed or posted by a named person)
2. WebSearch: `[company] [role] hiring manager LinkedIn site:linkedin.com`
3. If not found: use `Hiring Team`

### Step 2 — Write the 4 content blocks

Use native tech English. Short sentences. No "I'm passionate about...". No fluff.

#### Opening paragraph (3-4 sentences)

**Framework:**
- Sentence 1: Name the role and what drew you to it specifically — quote or paraphrase something real from the JD.
- Sentence 2: Bridge to your background in one line — the clearest proof that you can do this job.
- Sentence 3-4: The hook — one concrete achievement that maps to the JD's primary requirement.

**Tone:** "I'm choosing you" — confident, not supplicant.

**Example structure:**
> "Your job post for [Role] describes [specific JD detail] — that's exactly the problem I've been solving at [current company]. As an SRE with [N] years on AWS, I've [specific achievement with metric]. [Company]'s [specific product/mission] is where I want to apply that experience next."

**NEVER write:**
- "I am writing to express my interest in..."
- "I am passionate about..."
- "I would love the opportunity to..."

#### Proof bullets (3 bullets, each one line)

Map the 3 strongest JD requirements to 3 concrete proof points from `cv.md`. Format:

```
<li><strong>[JD keyword/requirement]:</strong> [achievement with metric from cv.md]</li>
```

Examples:
- `<li><strong>Observability at scale:</strong> Deployed DataDog, Prometheus, Grafana, and Splunk at William Hill, cutting MTTD by 55% across production betting services.</li>`
- `<li><strong>Infrastructure as Code:</strong> Codified multi-environment AWS infrastructure with Terraform and CloudFormation, reducing provisioning time by 70%.</li>`
- `<li><strong>Incident response ownership:</strong> Led RCA on production incidents and improved runbooks, reducing MTTR by 40% at a high-traffic, SLA-critical platform.</li>`

**Rules:**
- Every bullet must include a metric from `cv.md` — no metric, no bullet
- Use the JD's exact vocabulary as the bold prefix (ATS + human signal)
- Max 1 line per bullet

#### Closing paragraph (2-3 sentences)

- Restate enthusiasm briefly (specific to company, not generic)
- Ask for the interview
- Mention availability or next step

**Example:**
> "I've been deliberate about which opportunities to pursue — ENSEK's SaaS platform in a sector going through real transformation is one I'm genuinely excited about. I'd welcome the chance to walk through how I've approached reliability engineering at William Hill and how that maps to what you're building. Available at your convenience."

#### Candidate title line (under sign-off name)

Pull from `config/profile.yml → narrative.headline`. Example: `Senior Site Reliability Engineer | AWS | Kubernetes | DataDog`

### Step 3 — Populate the template

Read `templates/cover-letter-template.html`. Replace all placeholders:

| Placeholder | Value |
|-------------|-------|
| `{{LANG}}` | `en` or `es` |
| `{{PAGE_WIDTH}}` | `8.5in` (letter) or `210mm` (A4) |
| `{{NAME}}` | from profile.yml |
| `{{EMAIL}}` | from profile.yml |
| `{{PHONE}}` | from profile.yml |
| `{{LINKEDIN_URL}}` | full URL from profile.yml |
| `{{LINKEDIN_DISPLAY}}` | display text from profile.yml |
| `{{PORTFOLIO_SECTION}}` | same as CV: separator + link if portfolio_url set, else empty |
| `{{LOCATION}}` | from profile.yml |
| `{{HIRING_MANAGER}}` | name if found, else "Hiring Team" |
| `{{COMPANY}}` | company name |
| `{{OPENING_PARAGRAPH}}` | Step 2 output |
| `{{PROOF_BULLETS}}` | 3 `<li>` items from Step 2 |
| `{{CLOSING_PARAGRAPH}}` | Step 2 output |
| `{{CANDIDATE_TITLE}}` | from profile.yml → narrative.headline |

### Step 4 — Generate PDF

Write HTML to `/tmp/cover-letter-{company-slug}.html`

Run:
```bash
node generate-pdf.mjs /tmp/cover-letter-{company-slug}.html output/cover-letter-{company-slug}-{YYYY-MM-DD}.pdf --format={a4|letter}
```

### Step 5 — Report output

Tell the user:
- PDF path
- Number of pages (must be 1 — if 2, flag it and suggest trimming the opening or closing paragraph)
- Which 3 JD requirements were used as proof bullets

## Page limit enforcement

If the PDF renders as 2 pages:
1. Shorten the opening paragraph to 2-3 sentences
2. Trim the closing paragraph to 1-2 sentences
3. Regenerate
4. If still 2 pages: flag to user with a suggestion on what to cut

## Style rules

- **No em dashes (" —")** anywhere in the letter. Use a colon, comma, or rewrite the sentence.
- **No date** in the letter body.
- **No "Re:" subject line.** The letter opens directly with the recipient block then the first paragraph.
- **No emojis**
- **URLs with `white-space: nowrap`** (already in template)
- **Font path:** use absolute path when writing to `/tmp/` (same as CV generation)
- Generate in the **language of the JD** (EN default)
