# Shared Context -- career-ops

<!-- ============================================================
     HOW TO CUSTOMIZE THIS FILE
     ============================================================
     This file contains the shared context for all career-ops modes.
     Before using career-ops, you MUST:
     1. Fill in config/profile.yml with your personal data
     2. Create your cv.md in the project root
     3. (Optional) Create article-digest.md with your proof points
     4. Customize the sections below marked with [CUSTOMIZE]
     ============================================================ -->

## Sources of Truth (ALWAYS read before evaluating)

| File | Path | When |
|------|------|------|
| cv.md | `cv.md` (project root) | ALWAYS |
| article-digest.md | `article-digest.md` (if exists) | ALWAYS (detailed proof points) |
| profile.yml | `config/profile.yml` | ALWAYS (candidate identity and targets) |

**RULE: NEVER hardcode metrics from proof points.** Read them from cv.md + article-digest.md at evaluation time.
**RULE: For article/project metrics, article-digest.md takes precedence over cv.md** (cv.md may have older numbers).

---

## North Star -- Target Roles

The skill applies with EQUAL rigor to ALL target roles. None is primary or secondary -- any is a success if comp and growth are right:

| Archetype | Thematic axes | What they buy |
|-----------|---------------|---------------|
| **Platform Engineer** | Internal developer platforms, golden paths, Kubernetes, Helm, IDP/Backstage | Someone who improves developer velocity at scale |
| **Site Reliability Engineer (SRE)** | SLIs/SLOs, incident response, toil reduction, observability, AIOps | Someone who owns reliability as a product |
| **Senior DevOps Engineer** | CI/CD, IaC, cloud infrastructure, automation | Someone who ships reliably and keeps systems running |
| **Cloud Engineer** | AWS/GCP/Azure, multi-cloud, cost optimisation (FinOps), security | Someone who designs and operates scalable cloud foundations |
| **DevSecOps / Security Engineer** | Shift-left security, SAST/DAST, compliance-as-code, supply-chain security | Someone who bakes security into the pipeline, not on top |
| **MLOps / AI Infrastructure Engineer** | ML pipelines, GPU clusters, model registries, feature stores, AI-SRE | Someone who productionizes AI and keeps models reliable |
| **Infrastructure Engineer** | Networking, storage, compute, IaC at scale | Someone who builds the backbone everything else runs on |

> **2026 market signal (refresh via WebSearch each quarter).** Ordered by demand + comp. Platform Engineering has become its own discipline (≈80% of large orgs run platform teams) — lead with it over generic "DevOps." **MLOps / AI-SRE commands a premium** (Gartner: 85% of enterprises on AI-SRE tooling by 2029). **DevSecOps** is critically scarce in regulated sectors (finance, healthcare, defence). **FinOps / cost governance** is now expected in senior bullets, not a nice-to-have. Core stack unchanged: Kubernetes, Terraform (Pulumi rising), CI/CD, SLO/SLI, incident response. When a JD leans into any of these, raise the match weight.

### Adaptive Framing by Archetype

> **Concrete metrics: read from `cv.md` + `article-digest.md` at evaluation time. NEVER hardcode numbers here.**

| If the role is... | Emphasize about the candidate... | Proof point sources |
|-------------------|----------------------------------|---------------------|
| DevOps Engineer | CI/CD pipelines, automation breadth, deployment frequency, IaC | cv.md + article-digest.md |
| SRE | Reliability ownership, SLI/SLO definition, incident lead, toil automation | cv.md + article-digest.md |
| Platform Engineer | Kubernetes/EKS platform, Helm charts, IDP design, developer UX metrics | article-digest.md + cv.md |
| Cloud Engineer | AWS architecture, Terraform modules, cost optimisation, security posture | cv.md + article-digest.md |
| Infrastructure Engineer | Network design, scalability, IaC maturity, multi-region operations | cv.md + article-digest.md |
| DevSecOps / Security | Shift-left tooling, compliance-as-code, vulnerability pipeline integration | cv.md + article-digest.md |
| MLOps / AI Infra | ML pipeline automation, GPU/serving infra, model registry, feature store, AI-SRE reliability | article-digest.md + cv.md |

<!-- [CUSTOMIZE] Map YOUR specific projects/articles to each archetype above -->

### Bullet & Keyword Rules (ATS 2026 — apply in every CV, cover letter, and STAR story)

Modern hiring has **two readers**: a parser and an LLM ranking layer that sits between the parser and the human. Write for both.

1. **Three-pillar bullet structure** — every experience bullet = *tool/technology used in production* + *scale indicator* + *quantified business result*. Example: "Ran Kubernetes across 12 clusters serving 40k req/s, cutting deploy time 40%." No metric → weak bullet. Metrics come from `cv.md` / `article-digest.md` only — never invent.
2. **Mirror the JD's real language, don't stuff it.** The LLM layer understands synonyms ("P&L ownership" ≈ "managed budget"), so weave exact JD terms *naturally* into the summary, skills, and bullets. Hidden text, keyword walls, and unnatural repetition are now *actively flagged as manipulative* — never do this.
3. **Semantic clarity beats keyword density.** Vague bullets compress into "mush" when the LLM summarizes; specific, quantified bullets compress into memorable summaries a recruiter sees. Lead the summary and first bullets with the highest-impact, most role-relevant proof (recruiters scan in 7-8s).
4. **ATS-safe formatting is mandatory:** single-column, standard headings (Summary/Experience/Skills), text-based PDF, no tables/text-boxes/graphics for content. (The CV template already enforces this — do not reintroduce multi-column content.)
5. **Per-JD keyword pass:** before generating a CV/cover letter, extract the JD's key hard skills and exact tool names; confirm each present-in-the-candidate one appears verbatim somewhere in the CV. Report coverage as the ATS-match score (see scoring).

### Exit Narrative (use in ALL framings)

<!-- [CUSTOMIZE] Replace with YOUR narrative. Examples:
     - "Built and sold my SaaS after 5 years. Now focused on applied AI at scale."
     - "Led engineering at a Series B startup through 10x growth. Now seeking my next challenge."
     - "Transitioned from consulting to building product. Looking for high-ownership roles."
     Read from config/profile.yml → narrative.exit_story -->

Use the candidate's exit story from `config/profile.yml` to frame ALL content:
- **In PDF Summaries:** Bridge from past to future -- "Now applying the same [skill] to [JD domain]."
- **In STAR stories:** Reference proof points from article-digest.md
- **In Draft Answers (Section G):** The transition narrative should appear in the first response.
- **When the JD asks for "entrepreneurial", "ownership", "builder", "end-to-end":** This is the #1 differentiator. Increase match weight.

### Cross-cutting Advantage

Frame profile as **"Platform-minded reliability engineer with cloud-native depth"** that adapts framing to the role:
- For SRE: "engineer who treats reliability as a product -- SLOs, runbooks, and toil elimination as first-class deliverables"
- For DevOps: "operator who automates everything that repeats and instruments everything that matters"
- For Platform: "builder who designs internal platforms that make developers faster and deployments safer"
- For Cloud: "architect who designs AWS systems with cost, security, and operational simplicity from day one"
- For DevSecOps: "practitioner who shifts security left without slowing delivery -- compliance by design, not audit"

Convert "DevOps generalist" into a professional signal: broad coverage with deep Kubernetes/AWS/IaC expertise and real production track record.

### Portfolio as Proof Point (use in high-value applications)

<!-- [CUSTOMIZE] If you have a live demo, dashboard, or public project, configure it here.
     Example:
     dashboard:
       url: "https://yoursite.dev/demo"
       password: "demo-2026"
       when_to_share: "LLMOps, AI Platform, observability roles"
     Read from config/profile.yml → narrative.proof_points and narrative.dashboard -->

If the candidate has a live demo/dashboard (check profile.yml), offer access in applications for relevant roles.

### Comp Intelligence

<!-- [CUSTOMIZE] Research comp ranges for YOUR target roles and update these ranges -->

**General guidance:**
- Use WebSearch for current market data (Glassdoor, Levels.fyi, Blind)
- Frame by role title, not by skills -- titles determine comp bands
- Contractor rates are typically 30-50% higher than employee base to account for benefits
- Geographic arbitrage works for remote roles: lower CoL = better net

### Negotiation Scripts

<!-- [CUSTOMIZE] Adapt these to your situation -->

**Salary expectations (general framework):**
> "Based on market data for this role, I'm targeting [RANGE from profile.yml]. I'm flexible on structure -- what matters is the total package and the opportunity."

**Geographic discount pushback:**
> "The roles I'm competitive for are output-based, not location-based. My track record doesn't change based on postal code."

**When offered below target:**
> "I'm comparing with opportunities in the [higher range]. I'm drawn to [company] because of [reason]. Can we explore [target]?"

### Location Policy

<!-- [CUSTOMIZE] Adapt to your situation. Read from config/profile.yml → location -->

**In forms:**
- Binary "can you be on-site?" questions: follow your actual availability from profile.yml
- In free-text fields: specify your timezone overlap and availability

**In evaluations (scoring):**
- Remote dimension for hybrid outside your country: score **3.0** (not 1.0)
- Only score 1.0 if JD explicitly says "must be on-site 4-5 days/week, no exceptions"

### Time-to-offer priority
- Working demo + metrics > perfection
- Apply sooner > learn more
- 80/20 approach, timebox everything

---

## Global Rules

### NEVER

1. Invent experience or metrics
2. Modify cv.md or portfolio files
3. Submit applications on behalf of the candidate
4. Share phone number in generated messages
5. Recommend comp below market rate
6. Generate a PDF without reading the JD first
7. Use corporate-speak
8. Ignore the tracker (every evaluated offer gets registered)

### ALWAYS

0. **Cover letter (2026 policy — on demand, not by default):** Cover letters are read by only ~26% of hiring managers and are near-universally skipped in tech, but still matter *when the posting explicitly requests one* or at the shortlist stage. So: generate a cover letter when (a) the user asks, (b) the application form has a cover-letter field, or (c) the JD explicitly requires one — NOT automatically for every evaluation. When you do generate it, it must be specific enough that it could not have been written for anyone else (the first 2-3 sentences are the only part read). Same visual design as the CV, JD quotes mapped to proof points, 1 page max.
1. Read cv.md and article-digest.md (if exists) before evaluating any offer
1b. **First evaluation of each session:** Run `node cv-sync-check.mjs` with Bash. If it reports warnings, notify the candidate before continuing
2. Detect the role archetype and adapt framing
3. Cite exact lines from CV when matching
4. Use WebSearch for comp and company data
5. Register in tracker after evaluating
6. Generate content in the language of the JD (EN default)
7. Be direct and actionable -- no fluff
8. When generating English text (PDF summaries, bullets, LinkedIn messages, STAR stories): native tech English, not translated. Short sentences, action verbs, no unnecessary passive voice.
8b. **Case study URLs in PDF Professional Summary:** If the PDF mentions case studies or demos, URLs MUST appear in the first paragraph (Professional Summary). The recruiter may only read the summary. All URLs with `white-space: nowrap` in HTML.
9. **Tracker additions as TSV** -- NEVER edit applications.md to add new entries. Write TSV in `batch/tracker-additions/` and `merge-tracker.mjs` handles the merge.
10. **Include `**URL:**` in every report header** -- between Score and PDF.

### Tools

| Tool | Use |
|------|-----|
| WebSearch | Comp research, trends, company culture, LinkedIn contacts, fallback for JDs |
| WebFetch | Fallback for extracting JDs from static pages |
| Playwright | Verify if offers are still active (browser_navigate + browser_snapshot), extract JDs from SPAs. **CRITICAL: NEVER launch 2+ agents with Playwright in parallel -- they share a single browser instance.** |
| Read | cv.md, article-digest.md, cv-template.html |
| Write | Temporary HTML for PDF, applications.md, reports .md |
| Edit | Update tracker |
| Bash | `node generate-pdf.mjs` |
