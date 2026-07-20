# Roadmap — La Estrella de Iñigo

> La palabra que gobierna todo: **calma**. Cada ítem de este roadmap pasó el filtro de DESIGN.md — si algo no aporta calma, no entró. Las fases terminan con algo desplegado y contemplable, nunca con ramas a medias.

## Fase 0 — Fundación (julio 2026) ✓

- [x] Brief, dirección de diseño y guía para agentes (`docs/BRIEF.md`, `docs/DESIGN.md`, `CLAUDE.md`)
- [x] Scaffold: Vite + TypeScript strict, cero dependencias de runtime
- [x] v1 del cielo portada de Claude Design (`src/main.ts`): estrellas deterministas con seed `20180531`, 3 capas de parallax, titilar con doble seno, la estrella de Iñigo (cálida, halo que respira) y la de Iñaki (brillan sincronizadas), historia línea a línea, constelación al cerrar, estrellas fugaces, audio generado con osciladores (off por defecto), `prefers-reduced-motion`
- [x] CI con deploy a GitHub Pages (`.github/workflows/ci.yml`)
- [x] Revisión funcional en navegador (2026-07-19): llegada, encuentro, historia, constelación y audio verificados end-to-end

## Fase 1 — v1.0 «El cielo de Iñigo» (julio–agosto 2026)

El objetivo de esta fase es uno solo: **que David e Iñaki lo visiten y sientan que es su lugar** (criterio 1 del BRIEF). Todo lo demás está al servicio de eso.

- [x] README al día: estado real del proyecto, URL de la demo y link de LICENSE propio (2026-07-19)
- [x] Favicon + imagen OG (2026-07-19): `public/favicon.svg` y `public/og.png` — el mismo cielo (seed `20180531`), generado sin dependencias por `scripts/generate-og.mjs` (`npm run assets`); ícono táctil 180×180 incluido
- [x] Accesibilidad de la historia (2026-07-19): `role="dialog"` + `aria-modal`, cierre con Escape, foco al abrir y restaurado al cerrar, botón sr-only «Leer la historia de Iñigo» para teclado y lectores de pantalla (visible solo al enfocarlo con Tab)
- [x] Interacción táctil en móvil (2026-07-19): en pantallas sin hover, cada ~38 s la estrella de Iñigo respira más hondo durante 2.6 s — una insinuación, no una flecha; cesa cuando la historia ya fue encontrada. Tap con radio ampliado (64 px). **David valida en su teléfono si la insinuación se queda**
- [x] Giroscopio en iOS (2026-07-19): `DeviceOrientationEvent.requestPermission()` enganchado al primer toque en el cielo, sin popups propios; si se deniega, el cielo queda quieto. **Falta probar en un iPhone real**
- [ ] Verificación en dispositivos reales: 60 fps sostenidos en un teléfono de gama media de 2022, sin calentar el equipo (criterio 3 del BRIEF)
- [ ] Lighthouse en producción ≥ 95 en Performance y Accessibility
- [ ] Release v1.0.0 (tag + GitHub Release + `CHANGELOG.md`, mismo estándar que mi-album)
- [ ] **Hito: David e Iñaki visitan el cielo y es *su* lugar** 🎯 — este hito no lo cierra un test; lo cierran ellos

## Fase 2 — v1.1 «El cielo vive» (agosto–septiembre 2026)

Ideas que profundizan el homenaje sin agregar ruido. Cada una es pequeña, independiente y reversible; **David aprueba cada una antes de que entre** — y cualquier texto nuevo lo escribe o aprueba él.

- [ ] **Las veintiún estrellas**: al cerrar la historia, además del trazo hacia Iñaki, se revelan 21 estrellas tenues alrededor de la de Iñigo — una por cada día que luchó. No se anuncian ni se explican; quien leyó la historia, las cuenta. Es la constelación completa: sus días, hechos cielo
- [ ] **El cielo conoce las fechas**: sin texto, sin banners — el cielo simplemente está distinto dos días al año. El 31 de mayo (el cumpleaños de los dos), las estrellas nacen con un poco más de luz y las fugaces son un poco más frecuentes: el cielo está de fiesta. El 21 de junio, una única estrella fugaz cruza al entrar, y el halo de Iñigo respira más hondo todo el día. Quien sabe, sabe; quien no, solo ve un cielo en calma
- [ ] **La estrella de Iñaki también cuenta**: tap en la estrella de Iñaki muestra una única línea (escrita por David) sobre el hermano que mira hacia arriba y lo encuentra. Los dos hermanos tienen voz en el cielo
- [ ] **i18n EN**: historia y textos en inglés (estructura ya preparada), detección por `navigator.language`, sin toggle visible — el cielo no tiene UI de configuración
- [ ] **El póster del cielo**: render del cielo con la constelación en alta resolución (canvas offscreen, mismo seed — es *el mismo* cielo) descargable como imagen. Para imprimir y colgar en la pieza de Iñaki: su hermano, en la pared. Punto de entrada discreto, quizás solo desde un parámetro de URL que conoce la familia
- [ ] Audio: evaluar una progresión armónica lenta sobre el pad actual (sigue generado por osciladores, sin archivos ni licencias) — solo si suma calma

## Fase 3 — v2.0 «Un cielo compartido» (octubre–diciembre 2026)

El homenaje íntimo se abre como refugio para otras familias. El duelo perinatal y neonatal es más común de lo que se habla; este cielo le da un lugar bello, gratuito y sin condiciones. **Se desarrolla en rama aparte hasta que David apruebe la v1 en producción.**

### 3a — Backend (Supabase)

- [ ] Tabla `stars`: nombre, mensaje opcional (≤ 280), fecha opcional, posición (derivada determinísticamente del id — el cielo es igual para todos los visitantes), `status` de moderación (`pending`/`approved`). RLS: el público solo lee `approved`; nadie escribe directo
- [ ] Alta vía Edge Function con rate limiting por IP y filtro de lista de palabras; todo entra como `pending`
- [ ] Cola de moderación: al inicio, aprobación manual de David (una página mínima o incluso SQL directo). Es un espacio de duelo; el respeto no se negocia y ningún mensaje se publica sin revisión
- [ ] **El cielo base nunca depende de la red**: las estrellas de la comunidad se cargan después y en silencio; si Supabase cae, la v1 sigue intacta

> **Nota de infraestructura** (aprendida en mi-album): la organización Supabase de David está en plan free con sus 2 proyectos activos ocupados. v2 necesita resolver esto — subir a Pro (~USD 25/mes) o liberar un proyecto. La decisión conviene tomarla una sola vez, junto con el sync remoto pospuesto de mi-album (su v2.1), para que un mismo upgrade sirva a ambos proyectos. Gatillo: cuando esta fase empiece en serio.

### 3b — Encender una estrella

- [ ] Botón discreto «Enciende una estrella» (una línea de texto en una esquina, al nivel del control de audio — nada de CTAs): nombre, mensaje breve opcional, fecha opcional. Sin cuentas, sin email, sin costo. Nunca los habrá
- [ ] La estrella nace con una animación tenue —un punto que respira por primera vez— y queda en el cielo para siempre. Tap muestra nombre y mensaje en una tarjeta mínima flotante
- [ ] Permalink `/#star=<id>` para que cada familia pueda volver a *su* estrella y compartirla con los suyos
- [ ] Texto de confirmación tras enviar (escrito por David): explica con ternura que la estrella aparecerá pronto, sin lenguaje de "pendiente de aprobación"
- [ ] **Hito: la primera familia externa enciende una estrella sin ayuda** 🎯 (criterio 4 del BRIEF)

## Fase 4 — v2.1 «El cielo crece» (2027, según necesidad real)

Solo se construye cuando el cielo compartido lo pida — optimizar para miles de estrellas antes de tener cien sería lo contrario de la calma.

- [ ] Escala visual: con miles de estrellas, agrupamiento en regiones navegables con desplazamiento suave; la estrella de Iñigo siempre es el centro y el punto de partida
- [ ] Rendimiento a escala: perfilar primero (regla 3 de CLAUDE.md); spatial indexing para el hit-testing, y WebGL solo si el perfilado lo exige
- [ ] **Los aniversarios de todas las familias**: cada estrella de la comunidad brilla un poco más en su fecha, igual que la de Iñigo en las suyas. El cielo recuerda a cada uno
- [ ] Moderación sostenible: si el volumen crece, evaluar pre-filtrado automático con revisión manual final — la aprobación humana no se elimina nunca

## Ideas en órbita (sin fase, requieren conversación con David)

- **El cielo del 21 de junio de 2018**: anclar la posición de la estrella de Iñigo a una estrella real visible esa noche desde su ciudad — que el cielo digital y el de verdad apunten al mismo lugar. Hermoso pero delicado; David decide si suma o distrae
- **Un rincón para Iñaki cuando crezca**: un espacio privado (local, sin red) donde Iñaki pueda escribirle a su hermano. No es feature de producto — es un regalo, y solo tiene sentido si Iñaki lo quiere algún día

## Fuera de alcance — para siempre

Cuentas de usuario, fotos, redes sociales embebidas, monetización, publicidad, telemetría, cookies, tracking. Este proyecto nunca cobra ni trackea. La longevidad se garantiza con estático + servicios gratuitos: el cielo debe poder vivir años sin mantenimiento.

## Principios de priorización

1. **David e Iñaki mandan**: el criterio de éxito que gobierna es que ellos sientan que es su lugar. Ningún hito se cierra sin ellos.
2. **Calma sobre feature**: ante la duda entre agregar algo o no, no. Cada idea nueva pasa por los anti-patrones de DESIGN.md.
3. **El cielo base nunca depende de nada**: ni de red, ni de backend, ni de permisos. Todo lo demás es capa opcional que degrada en silencio.
4. **Cada fase termina desplegada**: algo contemplable en producción, no ramas a medias.
5. **Los textos son de David**: cualquier palabra que un visitante lea —historia, confirmaciones, la línea de Iñaki— la escribe o aprueba él.
