import Lenis, { type ScrollToOptions } from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let lenisInstance: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;
let pluginRegistered = false;
let listenersBound = false;

function ensureScrollTrigger(): void {
  if (!pluginRegistered && typeof window !== 'undefined') {
    try {
      gsap.registerPlugin(ScrollTrigger);
      pluginRegistered = true;
    } catch {
      // Safe no-op in headless/JSDOM if plugin registration fails
    }
  }
}

function isReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isCalmMotion(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.getAttribute('data-motion') === 'calm';
}

function shouldDisableSmoothScroll(): boolean {
  return isReducedMotion() || isCalmMotion();
}

export function destroyLenis(): void {
  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback);
    tickerCallback = null;
  }

  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

function bindGlobalLifecycleListeners(): void {
  if (listenersBound || typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }
  listenersBound = true;

  document.addEventListener('astro:before-swap', () => {
    destroyLenis();
  });

  document.addEventListener('astro:page-load', () => {
    initLenis();
  });

  window.addEventListener('yuko:motion-change', () => {
    initLenis();
  });

  if (typeof window.matchMedia === 'function') {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    mq.addEventListener?.('change', () => {
      initLenis();
    });
  }
}

export function initLenis(): Lenis | null {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }

  ensureScrollTrigger();
  bindGlobalLifecycleListeners();
  destroyLenis();

  if (shouldDisableSmoothScroll()) {
    return null;
  }

  const lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    autoRaf: false,
    respectReducedMotion: true,
  });

  lenis.on('scroll', () => {
    ScrollTrigger.update();
  });

  tickerCallback = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  lenisInstance = lenis;
  return lenis;
}

export function scrollToTarget(
  elOrY: number | string | HTMLElement,
  options?: ScrollToOptions
): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  if (lenisInstance && !shouldDisableSmoothScroll()) {
    lenisInstance.scrollTo(elOrY, options);
    return;
  }

  const behavior: ScrollBehavior =
    options?.immediate || isReducedMotion() ? 'auto' : 'smooth';
  const offset = options?.offset ?? 0;

  if (typeof elOrY === 'number') {
    window.scrollTo({
      top: Math.max(0, elOrY + offset),
      behavior,
    });
    return;
  }

  const targetEl =
    typeof elOrY === 'string' ? document.querySelector<HTMLElement>(elOrY) : elOrY;

  if (!targetEl) return;

  if (offset !== 0) {
    const top = targetEl.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({
      top: Math.max(0, top),
      behavior,
    });
    return;
  }

  targetEl.scrollIntoView({ behavior, block: 'start' });
}
