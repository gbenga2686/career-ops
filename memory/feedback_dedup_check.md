---
name: Deduplication check before pipeline
description: Always check applications.md for existing company+role match before running the evaluation pipeline
type: feedback
---

Before evaluating any new JD or URL, read `data/applications.md` and check if the same company + role has already been evaluated.

**Why:** Prevents wasted time re-evaluating roles already in the tracker, and avoids accidentally applying twice to the same position.

**How to apply:**
- Infer company and role from the URL slug or the first lines of the JD text.
- Search applications.md for a matching Company + Role (case-insensitive, partial match is fine).
- If a match is found: STOP and notify the user with the existing entry details (number, date, score, status, report link). Ask for explicit confirmation before re-evaluating.
- If no match: proceed with the pipeline normally.
- Be tolerant of name variants: "Visa (Currencycloud)" matches "Currencycloud"; "MUFG Investor Services" matches "MUFG".
