---
name: No em dashes in CV and cover letter
description: Replace em dashes (—) with commas in all CV and cover letter content — never use em dashes
type: feedback
---

Replace all em dashes ( — ) with commas ( , ) in CV and cover letter HTML content. This applies to both Professional Summary and bullet point text.

**Why:** User explicitly requested — em dashes feel unnatural in a CV context. Commas read more fluently and are ATS-safer.

**How to apply:** Before generating any PDF (CV or cover letter), scan the HTML for " — " and replace with ", ". Use a colon only when introducing a list (e.g. "Stack: Terraform, Ansible"). Never use em dashes in any position.
