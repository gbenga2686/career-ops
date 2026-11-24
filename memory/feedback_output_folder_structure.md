---
name: Output folder and filename date convention
description: Folder name, filename date, and physical creation date must all match — use actual PDF generation date, not the report/evaluation date
type: feedback
---

All CV and cover letter PDFs are stored in `output/YYYY-MM-DD/` subfolders. The date used in the folder name AND in the filename is the **actual date when `node generate-pdf.mjs` runs** — captured with `date +%Y-%m-%d` immediately before generating.

**Pattern:**
- Folder: `output/2026-05-06/`
- CV: `output/2026-05-06/cv-gbenga-olusoto-{company-slug}-2026-05-06.pdf`
- Cover letter: `output/2026-05-06/cover-letter-gbenga-olusoto-{company-slug}-2026-05-06.pdf`

**Why:** Folder date = filename date = physical file creation date. These three must always match. If midnight passes mid-session, the PDF generation date may differ from the evaluation/report date — that is fine. The file goes into the folder matching when it was actually created, not when the report was written.

**How to apply every time:**
```bash
TODAY=$(date +%Y-%m-%d)
mkdir -p output/$TODAY/
node generate-pdf.mjs /tmp/cv-....html output/$TODAY/cv-gbenga-olusoto-{slug}-$TODAY.pdf --format=a4
node generate-pdf.mjs /tmp/cover-letter-....html output/$TODAY/cover-letter-gbenga-olusoto-{slug}-$TODAY.pdf --format=a4
```

**If files end up in the wrong folder** (e.g. folder says 2026-05-05 but file was created on 2026-05-06):
1. Create correct folder: `mkdir -p output/2026-05-06/`
2. Move and rename: `mv output/2026-05-05/file-2026-05-05.pdf output/2026-05-06/file-2026-05-06.pdf`
3. Update the report's `**PDF:**` line to the new path
