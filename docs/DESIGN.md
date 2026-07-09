# Dirección de diseño — La Estrella de Iñigo

Documento para Claude Design / exploración visual. La palabra que gobierna todo: **calma**.

## Paleta

| Rol | Color | Notas |
|-----|-------|-------|
| Cielo profundo | `#050810` → `#0B1226` | Gradiente radial sutil, más claro hacia el horizonte inferior |
| Estrellas comunes | `#E8EDF7` con alfas 0.3–0.9 | Tamaños 0.5–2 px, titilar independiente |
| Estrella de Iñigo | `#FFE9C4` (halo `#FFD98E`) | Cálida entre estrellas frías — se encuentra por temperatura, no por tamaño |
| Estrella de Iñaki | `#CFE4FF` | Menor, brilla sincronizada con la de Iñigo |
| Texto | `#DDE4F0` | Serif suave o humanista (p. ej. Fraunces, Source Serif) |
| Trazo de constelación | `#8FA8CC` al 25% | Línea de 1 px, dibujada con animación de 2 s |

## Tipografía y texto

- La historia se muestra en fragmentos cortos (1-2 oraciones por vez), fade-in secuencial, interlineado generoso.
- Nada de negritas ni títulos gritones dentro de la experiencia. El texto susurra.
- Tono de la historia: primera persona del padre. Hechos, ternura, sin dramatismo. Cierra con la imagen de la estrella que guía a Iñaki.

## Movimiento

- Titilar: variación de opacidad por estrella con ruido (períodos 2–6 s, desfasados). Nunca parpadeo brusco.
- Parallax: 3 capas de profundidad, desplazamiento máximo 12 px. En móvil, giroscopio con el mismo límite.
- Ocasional (cada 40–90 s): una estrella fugaz tenue cruza un borde. Detalle, no espectáculo.
- `prefers-reduced-motion`: sin parallax, titilar a la mitad, sin estrellas fugaces.

## Sonido (opcional, off por defecto)

- Un pad ambiental grave y suave (tipo drone cálido), loop imperceptible, volumen bajo.
- Control: un único ícono discreto en esquina inferior. Sin autoplay jamás.

## Interacción

- Cursor cerca de la estrella de Iñigo (< 80 px): el titilar global se aquieta un 50%, su halo crece 1.2×.
- Click/tap en ella: el cielo se atenúa al 40%, la historia aparece centrada. Click fuera: la historia se disuelve, el cielo vuelve.
- Tras cerrar la historia por primera vez: se dibuja la constelación Iñigo–Iñaki.
- (v2) Estrellas de la comunidad: tap muestra nombre y mensaje en una tarjeta mínima flotante.

## Anti-patrones (prohibido)

Spinners, skeletons, banners, badges, contadores de visitas, botones de compartir en redes, cookies banners (no hay cookies), cualquier elemento con urgencia o gamificación. Si un elemento no aporta calma, no entra.
