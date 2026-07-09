# Brief — La Estrella de Iñigo

**Versión:** 1.0 · **Fecha:** julio 2026 · **Autor:** David Caballero

## 1. Visión

Un memorial digital que no se siente como memorial, sino como un cielo. La experiencia central es contemplativa: entrar, estar, mirar. La tecnología desaparece; queda la calma y una estrella que brilla distinto.

El proyecto tiene dos vidas: primero un homenaje íntimo (v1), luego un espacio colectivo donde el homenaje a Iñigo se convierte en refugio para otras familias (v2). El duelo perinatal y neonatal es más común de lo que se habla; este proyecto le da un lugar bello y gratuito.

## 2. La experiencia (v1)

1. **Llegada**: pantalla negra que se desvanece a un cielo nocturno profundo. Estrellas aparecen gradualmente (3-4 s). Sin UI visible, sin botones — solo el cielo.
2. **El cielo**: cientos de estrellas generativas titilando suavemente. Movimiento de parallax sutil con el mouse/giroscopio. Una estrella —la de Iñigo— brilla con un halo cálido, apenas distinta, encontrable sin ser señalada.
3. **El encuentro**: al acercar el cursor/dedo a la estrella de Iñigo, el cielo se aquieta y ella crece levemente. Al tocarla, la historia aparece en texto sereno, línea a línea: quién fue, sus 21 días, lo que significa para Iñaki.
4. **La constelación**: tras la historia, un trazo suave conecta la estrella de Iñigo con una estrella vecina más pequeña que brilla al unísono — Iñaki. Siempre juntas.
5. **Salida**: el visitante puede quedarse el tiempo que quiera. El cielo nunca termina ni apura.

## 3. La experiencia (v2 — cielo compartido)

- Botón discreto "Enciende una estrella": nombre, mensaje breve opcional (280 chars), fecha opcional. Sin cuentas, sin email.
- La estrella nueva nace con una animación tenue y queda en el cielo para siempre. Al tocarla, muestra su nombre y mensaje.
- El cielo escala visualmente: con miles de estrellas se agrupa en "regiones" navegables; la de Iñigo siempre es el centro.
- Moderación: cola de revisión simple (lista de palabras + aprobación manual al inicio) antes de publicar. Es un espacio de duelo; el respeto no se negocia.

## 4. Alcance

**v1 (EN alcance):** cielo generativo (Canvas/WebGL), estrella de Iñigo + historia, constelación con Iñaki, parallax, audio ambiental opcional (off por defecto, activable), responsive, `prefers-reduced-motion`, deploy en GitHub Pages, ES/EN.

**v2 (planificado):** backend Supabase (tabla `stars`: nombre, mensaje, fecha, posición, estado de moderación), rate limiting, cola de moderación, compartir link directo a una estrella (`/#star=<id>`).

**Fuera de alcance:** cuentas de usuario, fotos, redes sociales embebidas, monetización de cualquier tipo, publicidad. Este proyecto nunca cobra ni trackea.

## 5. Requisitos no funcionales

| Atributo | Objetivo |
|----------|----------|
| Rendimiento | 60 fps en gama media; carga < 3 s; el cielo funciona en móvil sin calentar el equipo |
| Accesibilidad | `prefers-reduced-motion` reduce titilar y parallax; historia legible por lectores de pantalla; contraste AA en textos |
| Tono | Nada de UI ruidosa, badges, popups ni llamados a la acción. Silencio visual |
| Privacidad | v1: cero datos. v2: solo lo que la familia escribe, sin identificadores |
| Longevidad | Estático + servicios gratuitos; debe poder vivir años sin mantenimiento |

## 6. Criterios de éxito

1. David e Iñaki lo visitan y sienten que es *su* lugar. Ese es el criterio que manda.
2. Un visitante que no conoce la historia la descubre solo, sin instrucciones.
3. 60 fps sostenidos en un teléfono de gama media de 2022.
4. (v2) La primera familia externa enciende una estrella sin ayuda.
