import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

declare global {
  interface Window {
    __yukoIntroCompleted?: boolean;
    __yukoIntroBooted?: boolean;
  }
}

const LOGO_DURATION_MS = 5000;
const BAR_DURATION_MS = 2500;
const TOTAL_INTRO_MS = LOGO_DURATION_MS + BAR_DURATION_MS;
const EXIT_TRANSITION_MS = 520;

const RADIAL_VECTORS: Record<0 | 1 | 2 | 3, { dx: number; dy: number; dr: number }> = {
  0: { dx: 5.5, dy: -6.5, dr: -12 },
  3: { dx: 4.0, dy: 7.5, dr: 14 },
  2: { dx: -7.5, dy: 3.0, dr: -14 },
  1: { dx: -7.0, dy: -7.0, dr: 22 },
};

let rafId: number | null = null;
let exitTimer: number | undefined;
let keyListenerBound = false;

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1);
}

function seg(t: number, a: number, b: number): number {
  return clamp((t - a) / (b - a), 0, 1);
}

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

function easeOutBack(x: number): number {
  const c1 = 1.65;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function isReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function refreshScrollTriggersSafely(): void {
  try {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.refresh();
  } catch {
    // Safe fallback
  }
}

export function finishSiteIntro(immediate = false): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  if (rafId !== null) {
    window.cancelAnimationFrame(rafId);
    rafId = null;
  }

  window.__yukoIntroCompleted = true;
  const root = document.documentElement;
  const overlay = document.getElementById('yukoIntro');

  if (!overlay) {
    root.removeAttribute('data-intro-active');
    root.setAttribute('data-intro-done', 'true');
    return;
  }

  if (immediate) {
    root.removeAttribute('data-intro-active');
    root.setAttribute('data-intro-done', 'true');
    overlay.setAttribute('hidden', '');
    refreshScrollTriggersSafely();
    return;
  }

  overlay.setAttribute('data-state', 'exiting');
  root.removeAttribute('data-intro-active');
  root.setAttribute('data-intro-revealing', 'true');

  if (exitTimer !== undefined) {
    window.clearTimeout(exitTimer);
  }
  exitTimer = window.setTimeout(() => {
    root.removeAttribute('data-intro-revealing');
    root.setAttribute('data-intro-done', 'true');
    overlay.setAttribute('hidden', '');
    refreshScrollTriggersSafely();
  }, EXIT_TRANSITION_MS);
}

function resetVisualsToStill(
  group: Element | null,
  halo: Element | null,
  pieces: Record<0 | 1 | 2 | 3, HTMLElement | null>
): void {
  if (group instanceof SVGElement || group instanceof HTMLElement) {
    group.style.transform = 'rotate(360deg) scale(1)';
    group.style.opacity = '1';
  }
  if (halo instanceof SVGElement) {
    halo.setAttribute('opacity', '0');
  }
  ([0, 1, 2, 3] as const).forEach((id) => {
    const piece = pieces[id];
    if (piece) {
      piece.style.transform = 'translate(0px, 0px) rotate(0deg)';
    }
  });
}

export function initSiteIntro(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const root = document.documentElement;
  const overlay = document.getElementById('yukoIntro');

  if (!overlay || window.__yukoIntroCompleted || root.getAttribute('data-intro-done') === 'true') {
    finishSiteIntro(true);
    return;
  }

  if (window.__yukoIntroBooted) {
    return;
  }
  window.__yukoIntroBooted = true;

  root.setAttribute('data-intro-active', 'true');

  const group = document.getElementById('yukoIntroGroup');
  const halo = document.getElementById('yukoIntroHalo');
  const barWrap = document.getElementById('yukoIntroBarWrap');
  const barFill = document.getElementById('yukoIntroBarFill');
  const skipBtn = document.getElementById('yukoIntroSkip');

  const pieces: Record<0 | 1 | 2 | 3, HTMLElement | null> = {
    0: document.getElementById('yukoIntroPiece0') as HTMLElement | null,
    1: document.getElementById('yukoIntroPiece1') as HTMLElement | null,
    2: document.getElementById('yukoIntroPiece2') as HTMLElement | null,
    3: document.getElementById('yukoIntroPiece3') as HTMLElement | null,
  };

  skipBtn?.addEventListener(
    'click',
    () => {
      finishSiteIntro(false);
    },
    { once: true }
  );

  if (!keyListenerBound) {
    keyListenerBound = true;
    window.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && !window.__yukoIntroCompleted) {
        finishSiteIntro(false);
      }
    });
  }

  if (isReducedMotion()) {
    resetVisualsToStill(group, halo, pieces);
    barWrap?.classList.add('is-active');
    const reducedStart = performance.now();
    const reducedDuration = 650;
    const stepReduced = (now: number) => {
      const p = clamp((now - reducedStart) / reducedDuration, 0, 1);
      if (barFill) {
        barFill.style.transform = `scaleX(${p.toFixed(4)})`;
      }
      barWrap?.setAttribute('aria-valuenow', String(Math.round(p * 100)));
      if (p < 1) {
        rafId = window.requestAnimationFrame(stepReduced);
      } else {
        finishSiteIntro(false);
      }
    };
    rafId = window.requestAnimationFrame(stepReduced);
    return;
  }

  let startTime: number | null = null;

  const tick = (now: number) => {
    if (window.__yukoIntroCompleted) return;
    if (startTime === null) {
      startTime = now;
    }

    const elapsed = now - startTime;

    if (elapsed <= LOGO_DURATION_MS) {
      const t = clamp(elapsed / LOGO_DURATION_MS, 0, 1);

      let rotDeg: number;
      let groupScale: number;
      let spread = 0;
      let masterOpacity = 1;
      let haloOpacity = 0;
      let haloScale = 0.85;

      if (t < 0.26) {
        const k = easeOutCubic(seg(t, 0, 0.26));
        masterOpacity = clamp(seg(t, 0, 0.09), 0, 1);
        rotDeg = lerp(-40, 185, k);
        groupScale = lerp(0.68, 1.04, k);
        spread = lerp(0.55, 0.85, Math.sin(k * Math.PI * 0.65));
      } else if (t < 0.52) {
        const k = easeInOutCubic(seg(t, 0.26, 0.52));
        rotDeg = lerp(185, 342, k);
        groupScale = lerp(1.04, 0.34, k);
        spread = lerp(0.85, -0.25, k);
      } else if (t < 0.8) {
        const k = seg(t, 0.52, 0.8);
        const sp = easeOutBack(k);
        rotDeg = lerp(342, 360, easeOutCubic(k));
        groupScale = lerp(0.34, 1.0, sp);
        spread = lerp(-0.25, 0.0, clamp(sp, -0.1, 1.08));
      } else {
        const k = seg(t, 0.8, 1.0);
        rotDeg = 360;
        const env = Math.max(0, 1 - k * 1.12);
        const beat = Math.sin(k * Math.PI * 3.0);
        groupScale = 1 + 0.095 * Math.max(0, beat) * env;
        spread = 0.22 * Math.max(0, beat) * env;
        haloOpacity = 0.22 * Math.max(0, Math.sin(k * Math.PI)) * (1 - k * 0.8);
        haloScale = lerp(0.92, 1.24, k);
      }

      if (group instanceof SVGElement || group instanceof HTMLElement) {
        group.style.transform = `rotate(${rotDeg.toFixed(2)}deg) scale(${groupScale.toFixed(3)})`;
        group.style.opacity = masterOpacity.toFixed(2);
      }
      if (halo instanceof SVGElement) {
        halo.setAttribute('opacity', haloOpacity.toFixed(3));
        halo.style.transform = `scale(${haloScale.toFixed(3)})`;
      }

      ([0, 1, 2, 3] as const).forEach((id) => {
        const piece = pieces[id];
        if (!piece) return;
        const rv = RADIAL_VECTORS[id];
        const localSpread = id === 1 && t >= 0.52 && t < 0.8 ? spread * 1.25 : spread;
        piece.style.transform = `translate(${(rv.dx * localSpread).toFixed(2)}px, ${(rv.dy * localSpread).toFixed(2)}px) rotate(${(rv.dr * localSpread).toFixed(2)}deg)`;
      });

      if (elapsed >= LOGO_DURATION_MS - 320) {
        barWrap?.classList.add('is-active');
      }
    } else if (elapsed <= TOTAL_INTRO_MS) {
      resetVisualsToStill(group, halo, pieces);
      barWrap?.classList.add('is-active');

      const barRaw = clamp((elapsed - LOGO_DURATION_MS) / BAR_DURATION_MS, 0, 1);
      const barEased = easeInOutCubic(barRaw);
      if (barFill) {
        barFill.style.transform = `scaleX(${barEased.toFixed(4)})`;
      }
      barWrap?.setAttribute('aria-valuenow', String(Math.round(barEased * 100)));
    } else {
      resetVisualsToStill(group, halo, pieces);
      if (barFill) {
        barFill.style.transform = 'scaleX(1)';
      }
      barWrap?.setAttribute('aria-valuenow', '100');
      finishSiteIntro(false);
      return;
    }

    rafId = window.requestAnimationFrame(tick);
  };

  rafId = window.requestAnimationFrame(tick);
}
