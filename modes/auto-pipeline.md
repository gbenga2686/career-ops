# Modo: auto-pipeline — Pipeline Completo Automático

Cuando el usuario pega un JD (texto o URL) sin sub-comando explícito, ejecutar TODO el pipeline en secuencia:

## Paso -1 — Verificar duplicado (OBLIGATORIO, antes de cualquier otra acción)

**Antes de extraer el JD o hacer ningún fetch**, leer `data/applications.md` y comprobar si ya existe una entrada con la misma empresa y rol.

**Cómo detectar duplicado:**
1. Extraer el nombre de la empresa y el título del rol del input del usuario (URL o texto del JD).
   - Para URLs: inferir empresa del dominio o del slug (e.g. `superpayments`, `greenhouse.io/mufg`).
   - Para texto: leer las primeras líneas del JD.
2. Buscar en `data/applications.md` una fila donde la columna **Company** y **Role** coincidan (coincidencia parcial, sin distinción de mayúsculas).
3. Si se encuentra una coincidencia:
   - **DETENER el pipeline.**
   - Notificar al usuario: `"⚠️ Already evaluated: {Company} — {Role} (#{num}, {date}, score {score}, status {status}). Report: {report_link}. Do you want to re-evaluate anyway?"`
   - Esperar confirmación explícita antes de continuar. No proceder automáticamente.
4. Si no hay coincidencia: continuar con Paso 0.

**Nota:** La comprobación debe ser tolerante a variaciones de nombre (e.g. "Visa (Currencycloud)" coincide con "Currencycloud", "MUFG Investor Services" coincide con "MUFG"). Ante la duda, preguntar.

## Paso 0 — Extraer JD

Si el input es una **URL** (no texto de JD pegado), seguir esta estrategia para extraer el contenido:

**Orden de prioridad:**

1. **Playwright (preferido):** La mayoría de portales de empleo (Lever, Ashby, Greenhouse, Workday) son SPAs. Usar `browser_navigate` + `browser_snapshot` para renderizar y leer el JD.
2. **WebFetch (fallback):** Para páginas estáticas (ZipRecruiter, WeLoveProduct, company career pages).
3. **WebSearch (último recurso):** Buscar título del rol + empresa en portales secundarios que indexan el JD en HTML estático.

**Si ningún método funciona:** Pedir al candidato que pegue el JD manualmente o comparta un screenshot.

**Si el input es texto de JD** (no URL): usar directamente, sin necesidad de fetch.

## Paso 1 — Evaluación A-F
Ejecutar exactamente igual que el modo `oferta` (leer `modes/oferta.md` para todos los bloques A-F).

## Paso 2 — Guardar Report .md
Guardar la evaluación completa en `reports/{###}-{company-slug}-{YYYY-MM-DD}.md` (ver formato en `modes/oferta.md`).

## Paso 3 — Generar PDF (+ Cover Letter solo si aplica)
Ejecutar el pipeline completo de `pdf` (leer `modes/pdf.md`).

- CV PDF → `output/YYYY-MM-DD/cv-gbenga-olusoto-{company-slug}-{YYYY-MM-DD}.pdf` (SIEMPRE)
- Cover Letter PDF → `output/YYYY-MM-DD/cover-letter-gbenga-olusoto-{company-slug}-{YYYY-MM-DD}.pdf`

**Política de cover letter (2026):** NO generar cover letter automáticamente. Solo generarlo (ver `modes/cover-letter.md`) si:
(a) el usuario lo pide, (b) el formulario de aplicación tiene un campo de cover letter, o (c) el JD lo exige explícitamente.
En los demás casos, saltar el cover letter y anotar en el report `Cover letter: skipped (not requested by posting)`. Solo lo lee ~26% de los hiring managers y casi nunca en tech — genera más valor un CV afinado que un cover letter genérico.

**Folder and filename date rule:**
- `YYYY-MM-DD` = the **actual date when `node generate-pdf.mjs` runs** — capture it with `date +%Y-%m-%d` immediately before generating PDFs.
- This is the physical creation date of the file, which may differ from the report/evaluation date if midnight passes mid-session.
- Folder name, filename date, and physical creation date must all match.
- Create the folder first: `mkdir -p output/$(date +%Y-%m-%d)/`
- Example: a PDF generated on 2026-05-06 at 09:38 → `output/2026-05-06/cv-gbenga-olusoto-{slug}-2026-05-06.pdf` — even if the evaluation report is dated 2026-05-05.

Ambos deben completarse antes de pasar al Paso 4.

## Paso 4 — Draft Application Answers (solo si score >= 4.5)

Si el score final es >= 4.5, generar borrador de respuestas para el formulario de aplicación:

1. **Extraer preguntas del formulario**: Usar Playwright para navegar al formulario y hacer snapshot. Si no se pueden extraer, usar las preguntas genéricas.
2. **Generar respuestas** siguiendo el tono (ver abajo).
3. **Guardar en el report** como sección `## G) Draft Application Answers`.

### Preguntas genéricas (usar si no se pueden extraer del formulario)

- Why are you interested in this role?
- Why do you want to work at [Company]?
- Tell us about a relevant project or achievement
- What makes you a good fit for this position?
- How did you hear about this role?

### Tono para Form Answers

**Posición: "I'm choosing you."** el candidato tiene opciones y está eligiendo esta empresa por razones concretas.

**Reglas de tono:**
- **Confiado sin arrogancia**: "I've spent the past year building production AI agent systems — your role is where I want to apply that experience next"
- **Selectivo sin soberbia**: "I've been intentional about finding a team where I can contribute meaningfully from day one"
- **Específico y concreto**: Siempre referenciar algo REAL del JD o de la empresa, y algo REAL de la experiencia del candidato
- **Directo, sin fluff**: 2-4 frases por respuesta. Sin "I'm passionate about..." ni "I would love the opportunity to..."
- **El hook es la prueba, no la afirmación**: En vez de "I'm great at X", decir "I built X that does Y"

**Framework por pregunta:**
- **Why this role?** → "Your [specific thing] maps directly to [specific thing I built]."
- **Why this company?** → Mencionar algo concreto sobre la empresa. "I've been using [product] for [time/purpose]."
- **Relevant experience?** → Un proof point cuantificado. "Built [X] that [metric]. Sold the company in 2025."
- **Good fit?** → "I sit at the intersection of [A] and [B], which is exactly where this role lives."
- **How did you hear?** → Honesto: "Found through [portal/scan], evaluated against my criteria, and it scored highest."

**Idioma**: Siempre en el idioma del JD (EN default). Aplicar `/tech-translate`.

## Paso 5 — Actualizar Tracker
Registrar en `data/applications.md` con todas las columnas incluyendo Report y PDF en ✅.

**Si algún paso falla**, continuar con los siguientes y marcar el paso fallido como pendiente en el tracker.
