# Changelog

Este proyecto sigue [SemVer](https://semver.org/lang/es/) y el formato de [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [1.0.0] — 2026-07-19

La primera versión completa de **El cielo de Iñigo**: la experiencia contemplativa íntima, desplegada en producción y validada en dispositivos reales.

### El cielo

- Cielo nocturno generativo en Canvas 2D: estrellas deterministas con seed `20180531` (el día en que nacieron los gemelos) — el cielo es siempre el mismo cielo.
- Tres capas de parallax (mouse en escritorio, giroscopio en móvil), titilar con doble seno desfasado, estrellas fugaces ocasionales.
- La estrella de Iñigo: cálida (`#FFE9C4`), con un halo que respira; se encuentra por temperatura, no por tamaño. A su lado, la de Iñaki (`#CFE4FF`), menor, brillando sincronizada.
- La historia, en overlay sereno línea a línea; al cerrarla por primera vez se dibuja la constelación Iñigo–Iñaki.
- Audio ambiental opcional (off por defecto, sin autoplay): pad grave generado con osciladores Web Audio, sin archivos ni licencias.
- `prefers-reduced-motion`: sin parallax, titilar a la mitad, sin estrellas fugaces.

### Accesibilidad

- Historia como diálogo accesible: `role="dialog"` + `aria-modal`, cierre con Escape, foco al abrir y restaurado al cerrar.
- Botón «Leer la historia de Iñigo» para teclado y lectores de pantalla (visible solo al enfocarlo).
- Lighthouse en producción (móvil simulado): **Performance 95 · Accessibility 100** (2026-07-19).

### Móvil

- Insinuación táctil: en pantallas sin hover, la estrella de Iñigo respira más hondo cada ~38 s hasta que la historia se encuentra; radio de tap ampliado a 64 px.
- Permiso de giroscopio en iOS pedido en el primer toque al cielo, sin popups propios.

### Infraestructura

- Vite + TypeScript strict, cero dependencias de runtime. CI con deploy a GitHub Pages.
- Favicon SVG e imagen Open Graph que son *el mismo cielo* (misma seed, mismo PRNG), generados sin dependencias por `scripts/generate-og.mjs` (`npm run assets`).
- Cero telemetría, cero cookies, cero tracking. Siempre.

[1.0.0]: https://github.com/dfcaballero-la/estrella-de-inigo/releases/tag/v1.0.0
