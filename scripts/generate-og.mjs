/**
 * Genera public/og.png (1200×630) y public/apple-touch-icon.png (180×180).
 * Sin dependencias: el PNG se escribe a mano (zlib de Node) y el cielo se pinta
 * con la misma seed que src/main.ts (20180531) — es el mismo cielo.
 *
 * Uso: npm run assets
 */
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

// ---------- PNG (RGBA 8-bit, filtro 0) ----------

const CRC_TABLE = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 'ascii');
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}

function encodePng(w, h, rgba) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0; // filtro None
    rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---------- Pintor (buffer float, mezcla aditiva sobre fondo oscuro) ----------

/** Mismo PRNG que src/main.ts. */
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

class Painter {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.px = new Float64Array(w * h * 3);
  }

  /** Gradiente radial del cielo: #0B1226 hacia el horizonte inferior → #050810. */
  background() {
    const c0 = [11, 18, 38];
    const c1 = [5, 8, 16];
    const cx = this.w / 2;
    const cy = this.h * 1.15;
    const r0 = this.h * 0.2;
    const r1 = Math.max(this.w, this.h) * 1.1;
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        const d = Math.hypot(x - cx, y - cy);
        const t = Math.min(1, Math.max(0, (d - r0) / (r1 - r0)));
        const i = (y * this.w + x) * 3;
        this.px[i] = c0[0] + (c1[0] - c0[0]) * t;
        this.px[i + 1] = c0[1] + (c1[1] - c0[1]) * t;
        this.px[i + 2] = c0[2] + (c1[2] - c0[2]) * t;
      }
    }
  }

  /** Punto suave con caída gaussiana, mezclado aditivamente. */
  dot(x, y, r, [cr, cg, cb], alpha) {
    const s = r / 1.4;
    const ext = Math.ceil(r * 3);
    for (let py = Math.max(0, Math.floor(y - ext)); py <= Math.min(this.h - 1, y + ext); py++) {
      for (let px = Math.max(0, Math.floor(x - ext)); px <= Math.min(this.w - 1, x + ext); px++) {
        const d2 = (px - x) ** 2 + (py - y) ** 2;
        const a = alpha * Math.exp(-d2 / (2 * s * s));
        if (a < 0.002) continue;
        const i = (py * this.w + px) * 3;
        this.px[i] += cr * a;
        this.px[i + 1] += cg * a;
        this.px[i + 2] += cb * a;
      }
    }
  }

  /** Trazo de constelación: puntos gaussianos muestreados a lo largo del segmento. */
  line(x0, y0, x1, y1, color, alpha, width) {
    const steps = Math.ceil(Math.hypot(x1 - x0, y1 - y0) / (width * 0.5));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      this.dot(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, width, color, alpha / (width * 1.6));
    }
  }

  toPng() {
    const rgba = Buffer.alloc(this.w * this.h * 4);
    for (let i = 0, j = 0; i < this.px.length; i += 3, j += 4) {
      rgba[j] = Math.min(255, Math.round(this.px[i]));
      rgba[j + 1] = Math.min(255, Math.round(this.px[i + 1]));
      rgba[j + 2] = Math.min(255, Math.round(this.px[i + 2]));
      rgba[j + 3] = 255;
    }
    return encodePng(this.w, this.h, rgba);
  }
}

const COMMON = [232, 237, 247]; // #E8EDF7
const INIGO_CORE = [255, 233, 196]; // #FFE9C4
const INIGO_HALO = [255, 217, 142]; // #FFD98E
const INAKI = [207, 228, 255]; // #CFE4FF
const TRAZO = [143, 168, 204]; // #8FA8CC

/** El cielo de la OG: estrellas de la seed, Iñigo, Iñaki y su constelación. */
function paintSky(w, h, { starScale = 1, withField = true } = {}) {
  const p = new Painter(w, h);
  p.background();

  if (withField) {
    const r = mulberry32(20180531);
    const count = Math.round((w * h) / 4200);
    for (let i = 0; i < count; i++) {
      const layer = [0.3, 0.6, 1][Math.floor(r() * 3)] ?? 1;
      const x = r() * w;
      const y = r() * h;
      const rad = (0.5 + r() * 1.5) * (0.5 + layer * 0.5) * starScale;
      const a = 0.3 + r() * 0.6;
      r(); r(); r(); r(); r(); // period, phase, period2, phase2, appear — mantiene la secuencia
      p.dot(x, y, rad, COMMON, a * 0.75);
    }
  }

  const m = Math.min(w, h);
  const ix = w * 0.54;
  const iy = h * 0.42;
  const kx = ix + m * 0.085;
  const ky = iy + m * 0.055;

  p.line(ix, iy, kx, ky, TRAZO, 0.12, 1.4 * starScale);

  p.dot(ix, iy, 26 * starScale, INIGO_HALO, 0.1);
  p.dot(ix, iy, 11 * starScale, INIGO_HALO, 0.4);
  p.dot(ix, iy, 3.4 * starScale, INIGO_CORE, 1);

  p.dot(kx, ky, 7 * starScale, INAKI, 0.22);
  p.dot(kx, ky, 2.2 * starScale, INAKI, 0.85);

  return p;
}

mkdirSync(PUBLIC, { recursive: true });

// OG 1200×630 — el cielo completo, como se ve al llegar.
writeFileSync(join(PUBLIC, 'og.png'), paintSky(1200, 630, { starScale: 1.6 }).toPng());
console.log('public/og.png (1200×630)');

// Ícono 180×180 — solo las dos estrellas, legibles en tamaño chico.
{
  const p = new Painter(180, 180);
  p.background();
  const ix = 84;
  const iy = 82;
  const kx = 126;
  const ky = 110;
  p.line(ix, iy, kx, ky, TRAZO, 0.18, 1.6);
  p.dot(ix, iy, 40, INIGO_HALO, 0.09);
  p.dot(ix, iy, 17, INIGO_HALO, 0.42);
  p.dot(ix, iy, 6, INIGO_CORE, 1);
  p.dot(kx, ky, 10, INAKI, 0.25);
  p.dot(kx, ky, 3.4, INAKI, 0.9);
  writeFileSync(join(PUBLIC, 'apple-touch-icon.png'), p.toPng());
  console.log('public/apple-touch-icon.png (180×180)');
}
