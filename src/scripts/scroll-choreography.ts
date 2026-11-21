import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const REVEAL_SELECTOR =
  '.section-head, .feature-card, .plan-card, .lab-panel, .m3-card:not([data-glossary-item]):not(#glossaryEmpty), .cta-banner, .control-table';

let pluginRegistered = false;
let listenersBound = false;
let progressTrigger: ScrollTrigger | null = null;
let batchTriggers: ScrollTrigger[] = [];
let scrollFallbackHandler: (() => void) | null = null;
let resizeRefreshHandler: (() => void) | null = null;
let resizeTimer: number | null = null;
let choreographyEpoch = 0;
let pendingRevealTargets = new Set<HTMLElement>();

function ensureScrollTrigger(): boolean {
  if (typeof window === 'undefined') return false;
  if (pluginRegistered) return true;
  try {
    gsap.registerPlugin(ScrollTrigger);
    pluginRegistered = true;
    return true;
  } catch {
    return false;
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

function shouldSimplifyMotion(): boolean {
  return isReducedMotion() || isCalmMotion();
}

function getRevealTargets(): HTMLElement[] {
  if (typeof document === 'undefined') return [];
  return Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)).filter(
    (el) => !el.hidden && !el.hasAttribute('hidden')
  );
}

function clearInlineRevealStyles(targets: HTMLElement[]): void {
  if (!targets.length) return;
  try {
    gsap.killTweensOf(targets);
  } catch {
    // Safe no-op in headless/JSDOM environments
  }
  for (const el of targets) {
    el.style.removeProperty('opacity');
    el.style.removeProperty('transform');
  }
}

function updateScrollProgress(progressOverride?: number): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const bar = document.getElementById('yukoScrollProgress');
  if (!bar) return;

  let progress = progressOverride;
  if (typeof progress !== 'number' || Number.isNaN(progress)) {
    const docEl = document.documentElement;
    const maxScroll = Math.max(0, docEl.scrollHeight - window.innerHeight);
    progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  }

  const clamped = Math.max(0, Math.min(1, progress));
  bar.style.transform = `scaleX(${clamped.toFixed(4)})`;
}

function bindGlobalLifecycleListeners(): void {
  if (listenersBound || typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }
  listenersBound = true;

  document.addEventListener('astro:before-swap', () => {
    destroyChoreography();
  });

  document.addEventListener('astro:page-load', () => {
    initChoreography();
  });

  window.addEventListener('yuko:motion-change', () => {
    initChoreography();
  });

  if (typeof window.matchMedia === 'function') {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionPrefChange = () => {
      initChoreography();
    };
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', handleMotionPrefChange);
    } else if (typeof mq.addListener === 'function') {
      mq.addListener(handleMotionPrefChange);
    }
  }
}

export function destroyChoreography(): void {
  choreographyEpoch += 1;
  pendingRevealTargets.clear();

  if (typeof window !== 'undefined' && resizeTimer !== null) {
    window.clearTimeout(resizeTimer);
    resizeTimer = null;
  }

  if (progressTrigger) {
    progressTrigger.kill();
    progressTrigger = null;
  }

  if (batchTriggers.length > 0) {
    for (const trigger of batchTriggers) {
      trigger.kill();
    }
    batchTriggers = [];
  }

  if (typeof window !== 'undefined' && scrollFallbackHandler) {
    window.removeEventListener('scroll', scrollFallbackHandler);
    scrollFallbackHandler = null;
  }

  if (typeof window !== 'undefined' && resizeRefreshHandler) {
    window.removeEventListener('resize', resizeRefreshHandler);
    resizeRefreshHandler = null;
  }

  const targets = getRevealTargets();
  if (targets.length > 0) {
    clearInlineRevealStyles(targets);
  }
}

export function initChoreography(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  bindGlobalLifecycleListeners();
  destroyChoreography();

  const epochAtInit = choreographyEpoch;
  const stReady = ensureScrollTrigger();

  updateScrollProgress();

  const attachScrollFallback = () => {
    if (scrollFallbackHandler) return;
    scrollFallbackHandler = () => {
      updateScrollProgress();
    };
    window.addEventListener('scroll', scrollFallbackHandler, { passive: true });
  };

  if (stReady) {
    try {
      progressTrigger = ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          updateScrollProgress(self.progress);
        },
      });
    } catch {
      progressTrigger = null;
      attachScrollFallback();
    }
  } else {
    attachScrollFallback();
  }

  const revealPendingInFoldAndRefresh = () => {
    if (epochAtInit !== choreographyEpoch) return;
    updateScrollProgress();

    if (pendingRevealTargets.size > 0) {
      const threshold = window.innerHeight * 0.92;
      const nowVisible: HTMLElement[] = [];

      for (const el of pendingRevealTargets) {
        if (!el.isConnected) {
          pendingRevealTargets.delete(el);
          continue;
        }
        if (el.getBoundingClientRect().top <= threshold) {
          pendingRevealTargets.delete(el);
          nowVisible.push(el);
        }
      }

      if (nowVisible.length > 0) {
        try {
          gsap.to(nowVisible, {
            opacity: 1,
            y: 0,
            duration: 0.48,
            stagger: 0.06,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
            overwrite: 'auto',
          });
        } catch {
          clearInlineRevealStyles(nowVisible);
        }
      }
    }

    if (stReady) {
      try {
        ScrollTrigger.refresh();
      } catch {
        // Safe no-op in headless/JSDOM environments
      }
    }
  };

  resizeRefreshHandler = () => {
    if (resizeTimer !== null) {
      window.clearTimeout(resizeTimer);
    }
    resizeTimer = window.setTimeout(() => {
      resizeTimer = null;
      revealPendingInFoldAndRefresh();
    }, 150);
  };
  window.addEventListener('resize', resizeRefreshHandler, { passive: true });

  if (document.fonts && typeof document.fonts.ready?.then === 'function') {
    document.fonts.ready
      .then(() => {
        revealPendingInFoldAndRefresh();
      })
      .catch(() => {
        // Safe no-op
      });
  }

  const targets = getRevealTargets();
  if (!targets.length) return;

  if (shouldSimplifyMotion()) {
    clearInlineRevealStyles(targets);
    return;
  }

  // Clear prior inline styles before measuring viewport positions so repeated calls stay accurate
  clearInlineRevealStyles(targets);

  const foldThreshold = window.innerHeight * 0.92;
  const aboveOrInFold: HTMLElement[] = [];
  const belowFold: HTMLElement[] = [];

  for (const el of targets) {
    const rect = el.getBoundingClientRect();
    if (rect.top > foldThreshold) {
      belowFold.push(el);
    } else {
      aboveOrInFold.push(el);
    }
  }

  // Guarantee elements above or already inside the fold never stay hidden
  clearInlineRevealStyles(aboveOrInFold);

  if (!belowFold.length || !stReady) {
    return;
  }

  pendingRevealTargets = new Set(belowFold);

  try {
    gsap.set(belowFold, { opacity: 0, y: 16 });
    const created = ScrollTrigger.batch(belowFold, {
      start: 'top 92%',
      once: true,
      onEnter: (batch) => {
        const toReveal = (batch as HTMLElement[]).filter((el) => pendingRevealTargets.has(el));
        if (!toReveal.length) return;
        for (const el of toReveal) {
          pendingRevealTargets.delete(el);
        }
        gsap.to(toReveal, {
          opacity: 1,
          y: 0,
          duration: 0.48,
          stagger: 0.06,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          overwrite: 'auto',
        });
      },
    });
    batchTriggers = Array.isArray(created) ? created : [];
    ScrollTrigger.refresh();
  } catch {
    pendingRevealTargets.clear();
    clearInlineRevealStyles(belowFold);
  }
}
