# CLAUDE.md — Guía para agentes

## Qué es este proyecto

La Estrella de Iñigo: experiencia web contemplativa en memoria de Iñigo Francisco Caballero (31 may – 21 jun 2018), hermano gemelo de Iñaki. v1 es un cielo estrellado generativo con su historia; v2 lo abre como memorial colectivo donde otras familias encienden estrellas.

**Lee primero:** `docs/BRIEF.md` (experiencia y alcance), `docs/DESIGN.md` (dirección visual — es vinculante, no sugerencia) y `docs/ROADMAP.md` (fases, hitos y qué va en cada versión).

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

## Estado actual (julio 2026)

La v1 base está **implementada**, portada del diseño original hecho en Claude Design:

- `src/main.ts`: clase `Sky` con todo el cielo — estrellas deterministas (seed `20180531`, la fecha de nacimiento de los gemelos; el cielo es siempre el mismo), 3 capas de parallax (mouse + giroscopio), titilar con doble seno desfasado, la estrella de Iñigo (cálida, halo que respira) y la de Iñaki (menor, brilla sincronizada), historia en overlay con líneas secuenciales, constelación que se dibuja al cerrar la historia por primera vez, estrellas fugaces ocasionales, audio ambiental generado con osciladores (off por defecto), `prefers-reduced-motion`.
- `index.html` + `src/style.css`: estructura y estilos según DESIGN.md.
- CI con deploy a GitHub Pages (`.github/workflows/ci.yml`).

El texto de la historia (constante `STORY` en main.ts) viene del diseño aprobado por David — cualquier cambio pasa por él.

Desde julio 2026 también están implementados: accesibilidad de la historia (diálogo con Escape, foco y botón sr-only), insinuación táctil en móvil, permiso de giroscopio iOS, favicon/OG (`npm run assets` regenera `public/og.png` y el ícono con `scripts/generate-og.mjs`, sin dependencias).

## Pendiente / backlog

El backlog vive en **`docs/ROADMAP.md`** — única fuente de verdad de fases, hitos y qué entra en cada versión. No dupliques listas aquí.

## Contexto de portafolio

Este repo forma parte del GitHub de David (dfcaballero-la) junto a `mi-album`. Mantener el mismo estándar profesional: README bilingüe-amigable, LICENSE MIT, CI verde, docs actualizados.
