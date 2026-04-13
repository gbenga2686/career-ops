# Modo: pdf — Generación de PDF ATS-Optimizado

## Pipeline completo

1. Lee `cv.md` como fuentes de verdad
2. Pide al usuario el JD si no está en contexto (texto o URL)
3. Extrae 15-20 keywords del JD
4. Detecta idioma del JD → idioma del CV (EN default)
5. Detecta ubicación empresa → formato papel:
   - US/Canada → `letter`
   - UK/Europe/Resto del mundo → `a4`
   - UK default: A4, date format "Mon YYYY – Mon YYYY" (e.g. "Feb 2024 – Present")
6. Detecta arquetipo del rol → adapta framing
7. Reescribe Professional Summary inyectando keywords del JD + exit narrative bridge ("Built and sold a business. Now applying systems thinking to [domain del JD].")
8. Selecciona top 3-4 proyectos más relevantes para la oferta
9. Reordena bullets de experiencia por relevancia al JD
10. Construye competency grid desde requisitos del JD (6-8 keyword phrases)
11. Inyecta keywords naturalmente en logros existentes (NUNCA inventa)
12. Genera HTML completo desde template + contenido personalizado
13. Escribe HTML a `/tmp/cv-candidate-{company}.html`
14. Ejecuta: `node generate-pdf.mjs /tmp/cv-candidate-{company}.html output/cv-candidate-{company}-{YYYY-MM-DD}.pdf --format={letter|a4}`
15. Reporta: ruta del PDF, nº páginas, % cobertura de keywords

## Cover Letter (always generated alongside the CV)

After the CV PDF is generated, **always** generate a cover letter PDF using `modes/cover-letter.md`.

- Output: `output/cover-letter-{company-slug}-{YYYY-MM-DD}.pdf`
- Same paper format as CV (A4 or letter)
- Must be 1 page — if it renders as 2, trim and regenerate
- Report both PDF paths together to the user

## Reglas de estilo (legibilidad humana)

- **No em dashes (" —")** in CV content. Use a colon (":"), comma (","), or rewrite the sentence instead.
  - Bad: "DevSecOps — IAM, access controls" → Good: "DevSecOps: IAM, access controls"
  - Bad: "pipelines — building CI/CD" → Good: "pipelines, building CI/CD" or split into two sentences
  - Bad: "HCNA — Huawei Certified" → Good: "HCNA, Huawei Certified"

## Reglas ATS (parseo limpio)

- Layout single-column (sin sidebars, sin columnas paralelas)
- Headers estándar: "Professional Summary", "Work Experience", "Education", "Skills", "Certifications", "Projects"
- Sin texto en imágenes/SVGs
- Sin info crítica en headers/footers del PDF (ATS los ignora)
- UTF-8, texto seleccionable (no rasterizado)
- Sin tablas anidadas
- Keywords del JD distribuidas: Summary (top 5), primer bullet de cada rol, Skills section
- **LinkedIn aparece UNA SOLA VEZ** — en el contact row del header. NUNCA repetirlo en body, Skills, ni Profile
- **No incluir emojis** en el cuerpo del CV (LinkedIn, email, phone son plain text en el HTML)
- **Core Competencies como bullet list** — más parseable por ATS que tags/chips

## Diseño del PDF

- **Fonts**: Space Grotesk (headings, 600-700) + DM Sans (body, 400-500)
- **Fonts self-hosted**: `fonts/`
- **Header**: nombre en Space Grotesk 24px bold + línea gradiente `linear-gradient(to right, hsl(187,74%,32%), hsl(270,70%,45%))` 2px + fila de contacto
- **Section headers**: Space Grotesk 13px, uppercase, letter-spacing 0.05em, color cyan primary
- **Body**: DM Sans 11px, line-height 1.5
- **Company names**: color accent purple `hsl(270,70%,45%)`
- **Márgenes**: 0.6in
- **Background**: blanco puro

## Orden de secciones (optimizado "6-second recruiter scan")

1. Header (nombre grande, gradiente, contacto, link portfolio)
2. Professional Summary (3-4 líneas, keyword-dense)
3. Core Competencies (6-8 keyword phrases en flex-grid)
4. Work Experience (cronológico inverso)
5. Projects (top 3-4 más relevantes)
6. Education & Certifications
7. Skills (idiomas + técnicos)

## Estrategia de keyword injection (ético, basado en verdad)

Ejemplos de reformulación legítima:
- JD dice "RAG pipelines" y CV dice "LLM workflows with retrieval" → cambiar a "RAG pipeline design and LLM orchestration workflows"
- JD dice "MLOps" y CV dice "observability, evals, error handling" → cambiar a "MLOps and observability: evals, error handling, cost monitoring"
- JD dice "stakeholder management" y CV dice "collaborated with team" → cambiar a "stakeholder management across engineering, operations, and business"

**NUNCA añadir skills que el candidato no tiene. Solo reformular experiencia real con el vocabulario exacto del JD.**

## Template HTML

Usar el template en `cv-template.html`. Reemplazar los placeholders `{{...}}` con contenido personalizado:

| Placeholder | Contenido |
|-------------|-----------|
| `{{LANG}}` | `en` o `es` |
| `{{PAGE_WIDTH}}` | `8.5in` (letter) o `210mm` (A4) |
| `{{NAME}}` | (from profile.yml) |
| `{{EMAIL}}` | (from profile.yml) |
| `{{PHONE}}` | (from profile.yml — plain text, no emoji) |
| `{{LINKEDIN_URL}}` | full URL from profile.yml (e.g. `https://linkedin.com/in/...`) |
| `{{LINKEDIN_DISPLAY}}` | display text only (e.g. `linkedin.com/in/...`) |
| `{{PORTFOLIO_SECTION}}` | If portfolio_url set: `<span class="separator">\|</span><a href="URL">DISPLAY</a>` — else **empty string** |
| `{{LOCATION}}` | (from profile.yml) |
| `{{SECTION_SUMMARY}}` | Professional Summary / Resumen Profesional |
| `{{SUMMARY_TEXT}}` | Summary personalizado con keywords |
| `{{SECTION_COMPETENCIES}}` | Core Competencies / Competencias Core |
| `{{COMPETENCIES}}` | `<li>keyword phrase</li>` × 6-8 (plain bullet list items, NO span tags) |
| `{{SECTION_EXPERIENCE}}` | Work Experience / Experiencia Laboral |
| `{{EXPERIENCE}}` | HTML de cada trabajo con bullets reordenados |
| `{{SECTION_PROJECTS}}` | Projects / Proyectos |
| `{{PROJECTS}}` | HTML de top 3-4 proyectos |
| `{{SECTION_EDUCATION}}` | Education / Formación |
| `{{EDUCATION}}` | HTML de educación |
| `{{SECTION_CERTIFICATIONS}}` | Certifications / Certificaciones |
| `{{CERTIFICATIONS}}` | HTML de certificaciones |
| `{{SECTION_SKILLS}}` | Skills / Competencias |
| `{{SKILLS}}` | HTML de skills |

## Post-generación

Actualizar tracker si la oferta ya está registrada: cambiar PDF de ❌ a ✅.
