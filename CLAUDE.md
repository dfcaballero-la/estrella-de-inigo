# CLAUDE.md — Guía para agentes

## Qué es este proyecto

La Estrella de Iñigo: experiencia web contemplativa en memoria de Iñigo Francisco Caballero (31 may – 21 jun 2018), hermano gemelo de Iñaki. v1 es un cielo estrellado generativo con su historia; v2 lo abre como memorial colectivo donde otras familias encienden estrellas.

**Lee primero:** `docs/BRIEF.md` (experiencia y alcance) y `docs/DESIGN.md` (dirección visual — es vinculante, no sugerencia).

## Sensibilidad

Este proyecto trata el duelo por un hijo. Reglas de tono para cualquier texto, commit o UI que generes:

- El texto de la historia lo escribe/aprueba David (el padre). Puedes proponer borradores, nunca publicarlos sin su revisión.
- Sin dramatismo ni lenguaje de tragedia; el proyecto habla de luz, guía y compañía.
- (v2) Los mensajes de otras familias pasan por moderación antes de publicarse. Sin excepciones.

## Stack propuesto (v1)

- **Vite + TypeScript vanilla** (sin framework — es una pieza de arte, el DOM es mínimo).
- **Canvas 2D** para el cielo (suficiente para ~2000 estrellas a 60 fps con batching; WebGL solo si el perfilado lo exige).
- Cero dependencias de runtime en v1 si es posible. Audio con Web Audio API (archivo propio o generado, nada con licencias dudosas).
- Deploy: GitHub Pages con Actions (copiar patrón de `mi-album`: `.github/workflows/ci.yml`).
- v2: Supabase (tabla `stars` + RLS + rate limiting); mantener v1 funcional si el backend cae (el cielo base nunca depende de la red).

## Reglas

1. **Calma sobre feature**: ante la duda entre agregar algo o no, no. Ver anti-patrones en DESIGN.md.
2. `prefers-reduced-motion` y responsive no son opcionales.
3. 60 fps en móvil de gama media: perfila antes de optimizar, pero perfila.
4. Cero telemetría, cero cookies, cero tracking. Siempre.
5. Textos en ES primero; estructura preparada para EN.
6. Conventional Commits; TS strict.

## Plan de construcción sugerido

1. **Esqueleto**: Vite + TS + canvas full-viewport + loop de render con `requestAnimationFrame`.
2. **Campo de estrellas**: generación determinista (seed fija — el cielo de Iñigo es siempre el mismo), 3 capas de parallax, titilar con ruido desfasado.
3. **La estrella de Iñigo**: color cálido, halo, interacción de proximidad y click según DESIGN.md.
4. **La historia**: overlay de texto secuencial (contenido provisto por David), cierre → constelación Iñigo–Iñaki.
5. **Pulido**: reduced-motion, giroscopio móvil, estrella fugaz ocasional, audio opcional.
6. **Deploy**: CI + GitHub Pages + Lighthouse (Perf y A11y ≥ 95).
7. **v2** (rama aparte hasta que v1 esté aprobada por David): esquema Supabase, "enciende una estrella", moderación, permalinks.

## Contexto de portafolio

Este repo forma parte del GitHub de David (dfcaballero-la) junto a `mi-album`. Mantener el mismo estándar profesional: README bilingüe-amigable, LICENSE MIT, CI verde, docs actualizados.
