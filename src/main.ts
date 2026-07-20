/**
 * La Estrella de Iñigo — el cielo.
 * Portado del diseño original de Claude Design a TS vanilla.
 * La seed del cielo es 20180531: el día en que nacieron Iñigo e Iñaki.
 */
import './style.css';

const CONFIG = {
  densidad: 1, // 0.5–2
  estrellasFugaces: true,
};

const STORY = [
  'Iñigo Francisco nació el 31 de mayo de 2018, junto a su hermano gemelo, Iñaki Valentino.',
  'Llegaron temprano, a las veinticinco semanas. Pequeños, y a la vez inmensos.',
  'Iñigo luchó veintiún días, con una valentía que no vamos a olvidar nunca.',
  'El 21 de junio partió. Desde entonces, brilla aquí.',
  'Hoy Iñaki lo lleva consigo: una estrella que lo guía, lo acompaña y cuida cada paso que da.',
  'Siempre juntos.',
];

interface Star {
  x: number;
  y: number;
  layer: number;
  rad: number;
  a: number;
  period: number;
  phase: number;
  period2: number;
  phase2: number;
  appear: number;
}

interface ShootingStar {
  x0: number;
  y0: number;
  dx: number;
  dy: number;
  t0: number;
  dur: number;
}

class Sky {
  private readonly root = document.getElementById('sky-root') as HTMLElement;
  private readonly canvas = document.getElementById('sky') as HTMLCanvasElement;
  private readonly story = document.getElementById('story') as HTMLElement;
  private readonly audioBtn = document.getElementById('audio') as HTMLButtonElement;
  private readonly ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

  private readonly openBtn = document.getElementById('open-story') as HTMLButtonElement;

  private readonly reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /** Sin hover no hay mousemove: la estrella se insinúa sola y el tap es más generoso. */
  private readonly touch = window.matchMedia('(hover: none)').matches;

  private w = 0;
  private h = 0;
  private dpr = 1;
  private stars: Star[] = [];
  private inigo = { x: 0, y: 0 };
  private inaki = { x: 0, y: 0 };
  private bg: HTMLCanvasElement | null = null;

  private mx = 0;
  private my = 0;
  private px = 0;
  private py = 0;
  private calm = 1;
  private halo = 1;

  private storyOpen = false;
  private nearStar = false;
  private constellation = false;
  private constStart = 0;
  private lastFocus: HTMLElement | null = null;
  private gyroAsked = false;

  private shoot: ShootingStar | null = null;
  private shootNext = 55 + Math.random() * 35;

  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private audioOn = false;

  private readonly t0 = performance.now();

  constructor() {
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('deviceorientation', (e) => {
      if (this.reduced || e.gamma == null || e.beta == null) return;
      this.mx = Math.max(-1, Math.min(1, e.gamma / 30));
      this.my = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
    });
    this.root.addEventListener('mousemove', (e) => this.onMove(e));
    this.root.addEventListener('click', (e) => this.onSkyClick(e));
    this.root.addEventListener('pointerdown', () => this.askGyro());
    this.story.addEventListener('click', () => this.closeStory());
    this.openBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!this.storyOpen) this.openStory();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.storyOpen) this.closeStory();
    });
    this.audioBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleAudio();
    });

    this.resize();
    const loop = (now: number) => {
      requestAnimationFrame(loop);
      this.draw((now - this.t0) / 1000);
    };
    requestAnimationFrame(loop);
  }

  /** PRNG determinista (mulberry32). El cielo de Iñigo es siempre el mismo cielo. */
  private rng(seed: number): () => number {
    let a = seed >>> 0;
    return () => {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  private resize(): void {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = this.w * this.dpr;
    this.canvas.height = this.h * this.dpr;
    this.canvas.style.width = `${this.w}px`;
    this.canvas.style.height = `${this.h}px`;
    this.genStars();
    this.bg = null;
  }

  private genStars(): void {
    const r = this.rng(20180531);
    const count = Math.min(1200, Math.round(((this.w * this.h) / 4200) * CONFIG.densidad));
    const layers = [0.3, 0.6, 1] as const;
    this.stars = [];
    for (let i = 0; i < count; i++) {
      const layer = layers[Math.floor(r() * 3)] ?? 1;
      this.stars.push({
        x: r() * this.w,
        y: r() * this.h,
        layer,
        rad: (0.5 + r() * 1.5) * (0.5 + layer * 0.5),
        a: 0.3 + r() * 0.6,
        period: 2 + r() * 4,
        phase: r() * Math.PI * 2,
        period2: 3 + r() * 5,
        phase2: r() * Math.PI * 2,
        appear: r() * 3.2,
      });
    }
    const m = Math.min(this.w, this.h);
    this.inigo = { x: this.w * 0.54, y: this.h * 0.42 };
    this.inaki = { x: this.inigo.x + m * 0.085, y: this.inigo.y + m * 0.055 };
  }

  private drawBg(ctx: CanvasRenderingContext2D): void {
    if (!this.bg) {
      const c = document.createElement('canvas');
      c.width = this.w;
      c.height = this.h;
      const g = c.getContext('2d') as CanvasRenderingContext2D;
      const grad = g.createRadialGradient(
        this.w / 2, this.h * 1.15, this.h * 0.2,
        this.w / 2, this.h * 0.3, Math.max(this.w, this.h) * 1.1,
      );
      grad.addColorStop(0, '#0B1226');
      grad.addColorStop(1, '#050810');
      g.fillStyle = grad;
      g.fillRect(0, 0, this.w, this.h);
      this.bg = c;
    }
    ctx.drawImage(this.bg, 0, 0);
  }

  private draw(t: number): void {
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.drawBg(ctx);

    const pk = 0.04;
    if (!this.reduced) {
      this.px += (this.mx - this.px) * pk;
      this.py += (this.my - this.py) * pk;
    }
    this.calm += ((this.nearStar ? 0.5 : 1) - this.calm) * 0.05;
    this.halo += ((this.nearStar ? 1.2 : 1) - this.halo) * 0.06;
    const amp = (this.reduced ? 0.5 : 1) * this.calm;

    for (const s of this.stars) {
      const born = Math.max(0, Math.min(1, (t - 0.3 - s.appear) / 1.6));
      if (born <= 0) continue;
      const tw =
        0.5 +
        0.5 *
          Math.sin((t * 2 * Math.PI) / s.period + s.phase) *
          Math.sin((t * 2 * Math.PI) / s.period2 + s.phase2);
      const alpha = s.a * (1 - 0.45 * amp + 0.45 * amp * tw) * born;
      ctx.globalAlpha = Math.max(0.05, Math.min(1, alpha));
      ctx.fillStyle = '#E8EDF7';
      const ox = this.px * 12 * s.layer;
      const oy = this.py * 12 * s.layer;
      ctx.beginPath();
      ctx.arc(s.x + ox, s.y + oy, s.rad, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Iñigo — estrella cálida con halo
    const born = Math.max(0, Math.min(1, (t - 1.2) / 2));
    const ox = this.px * 12;
    const oy = this.py * 12;
    const ix = this.inigo.x + ox;
    const iy = this.inigo.y + oy;
    const breathe = 1 + 0.06 * Math.sin((t * 2 * Math.PI) / 5);
    const sync = 0.75 + 0.25 * Math.sin((t * 2 * Math.PI) / 4.2);

    // Insinuación táctil: sin cursor que se acerque, cada ~38 s la estrella
    // respira más hondo durante 2.6 s. Cesa cuando la historia ya fue encontrada.
    let hint = 0;
    if (this.touch && !this.constellation && !this.storyOpen) {
      const ht = (t - 14) % 38;
      if (ht > 0 && ht < 2.6) {
        hint = Math.sin((Math.PI * ht) / 2.6) * (this.reduced ? 0.5 : 1);
      }
    }

    if (born > 0) {
      const hr = 30 * this.halo * breathe * (1 + 0.55 * hint);
      const g = ctx.createRadialGradient(ix, iy, 0, ix, iy, hr);
      g.addColorStop(0, `rgba(255, 217, 142, ${(0.5 + 0.2 * hint) * sync * born})`);
      g.addColorStop(0.35, `rgba(255, 217, 142, ${(0.14 + 0.06 * hint) * sync * born})`);
      g.addColorStop(1, 'rgba(255, 217, 142, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(ix, iy, hr, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = born * (0.85 + 0.15 * sync);
      ctx.fillStyle = '#FFE9C4';
      ctx.beginPath();
      ctx.arc(ix, iy, 2.6, 0, Math.PI * 2);
      ctx.fill();

      // Iñaki — menor, fría, brilla al unísono
      const kx = this.inaki.x + ox;
      const ky = this.inaki.y + oy;
      const kg = ctx.createRadialGradient(kx, ky, 0, kx, ky, 12);
      kg.addColorStop(0, `rgba(207, 228, 255, ${0.3 * sync * born})`);
      kg.addColorStop(1, 'rgba(207, 228, 255, 0)');
      ctx.globalAlpha = 1;
      ctx.fillStyle = kg;
      ctx.beginPath();
      ctx.arc(kx, ky, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = born * (0.7 + 0.3 * sync);
      ctx.fillStyle = '#CFE4FF';
      ctx.beginPath();
      ctx.arc(kx, ky, 1.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Constelación Iñigo–Iñaki: se dibuja tras cerrar la historia por primera vez
      if (this.constellation) {
        if (!this.constStart) this.constStart = t;
        const p = Math.min(1, (t - this.constStart) / 2);
        ctx.strokeStyle = 'rgba(143, 168, 204, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ix, iy);
        ctx.lineTo(ix + (kx - ix) * p, iy + (ky - iy) * p);
        ctx.stroke();
      }
    }

    this.drawShootingStar(ctx, t);
  }

  private drawShootingStar(ctx: CanvasRenderingContext2D, t: number): void {
    if (this.reduced || !CONFIG.estrellasFugaces || this.storyOpen) return;
    if (!this.shoot && t > this.shootNext) {
      const top = Math.random() < 0.7;
      this.shoot = {
        x0: top ? this.w * (0.1 + Math.random() * 0.6) : -40,
        y0: top ? -20 : this.h * (0.05 + Math.random() * 0.2),
        dx: 180 + Math.random() * 120,
        dy: 90 + Math.random() * 60,
        t0: t,
        dur: 1.3,
      };
      this.shootNext = t + 40 + Math.random() * 50;
    }
    if (!this.shoot) return;
    const sp = (t - this.shoot.t0) / this.shoot.dur;
    if (sp >= 1) {
      this.shoot = null;
      return;
    }
    const sx = this.shoot.x0 + this.shoot.dx * sp;
    const sy = this.shoot.y0 + this.shoot.dy * sp;
    const tail = 0.12;
    const tx = this.shoot.x0 + this.shoot.dx * Math.max(0, sp - tail);
    const ty = this.shoot.y0 + this.shoot.dy * Math.max(0, sp - tail);
    const fade = Math.sin(Math.PI * sp) * 0.35;
    const lg = ctx.createLinearGradient(tx, ty, sx, sy);
    lg.addColorStop(0, 'rgba(232, 237, 247, 0)');
    lg.addColorStop(1, `rgba(232, 237, 247, ${fade})`);
    ctx.strokeStyle = lg;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(sx, sy);
    ctx.stroke();
  }

  private starDist(clientX: number, clientY: number): number {
    const r = this.canvas.getBoundingClientRect();
    const x = clientX - r.left;
    const y = clientY - r.top;
    return Math.hypot(x - (this.inigo.x + this.px * 12), y - (this.inigo.y + this.py * 12));
  }

  private onMove(e: MouseEvent): void {
    this.mx = (e.clientX / this.w) * 2 - 1;
    this.my = (e.clientY / this.h) * 2 - 1;
    const near = this.starDist(e.clientX, e.clientY) < 80;
    if (near !== this.nearStar) {
      this.nearStar = near;
      this.root.classList.toggle('near-star', near && !this.storyOpen);
    }
  }

  private onSkyClick(e: MouseEvent): void {
    if (this.storyOpen) return;
    if (this.starDist(e.clientX, e.clientY) < (this.touch ? 64 : 48)) this.openStory();
  }

  /**
   * iOS exige un gesto del usuario para `DeviceOrientationEvent.requestPermission()`.
   * Se pide una sola vez, en el primer toque al cielo; si se deniega, el cielo
   * queda quieto y sigue siendo hermoso. Sin popups propios.
   */
  private askGyro(): void {
    if (this.gyroAsked || !this.touch || this.reduced) return;
    this.gyroAsked = true;
    const doe = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    doe.requestPermission?.().catch(() => undefined);
  }

  private openStory(): void {
    this.storyOpen = true;
    this.root.classList.remove('near-star');
    const lines = document.createElement('div');
    lines.className = 'lines';
    lines.addEventListener('click', (e) => e.stopPropagation());
    STORY.forEach((text, i) => {
      const p = document.createElement('p');
      p.textContent = text;
      p.style.animationDelay = `${(0.6 + i * 1.4).toFixed(1)}s`;
      lines.appendChild(p);
    });
    this.story.replaceChildren(lines);
    this.story.hidden = false;
    this.lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.story.focus();
  }

  private closeStory(): void {
    this.storyOpen = false;
    this.story.hidden = true;
    this.constellation = true;
    this.lastFocus?.focus();
    this.lastFocus = null;
  }

  /** Pad ambiental generado con osciladores — sin archivos, sin licencias. */
  private ensureAudio(): void {
    if (this.audioCtx) return;
    const ctx = new AudioContext();
    const master = ctx.createGain();
    master.gain.value = 0;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 220;
    filter.Q.value = 0.4;
    filter.connect(master);
    master.connect(ctx.destination);
    const mk = (freq: number, gain: number, type: OscillatorType = 'sine') => {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = gain;
      o.connect(g);
      g.connect(filter);
      o.start();
    };
    mk(55, 0.5);
    mk(55.6, 0.4);
    mk(110, 0.18);
    mk(164.8, 0.06, 'triangle');
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.05;
    const lfoG = ctx.createGain();
    lfoG.gain.value = 0.012;
    lfo.connect(lfoG);
    lfoG.connect(master.gain);
    lfo.start();
    this.audioCtx = ctx;
    this.masterGain = master;
  }

  private toggleAudio(): void {
    this.ensureAudio();
    if (!this.audioCtx || !this.masterGain) return;
    this.audioOn = !this.audioOn;
    const g = this.masterGain.gain;
    const now = this.audioCtx.currentTime;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    if (this.audioOn) {
      void this.audioCtx.resume();
      g.linearRampToValueAtTime(0.045, now + 3);
    } else {
      g.linearRampToValueAtTime(0, now + 1.5);
    }
    this.audioBtn.setAttribute('aria-pressed', String(this.audioOn));
    this.audioBtn.title = this.audioOn ? 'Silenciar' : 'Sonido';
  }
}

new Sky();
