import { useCallback, useEffect, useId, useRef, useState, type PointerEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import { scrollToTarget } from '../scripts/lenis-manager';
import type { ContinuityStageItem, StageLensId } from '../data/yuko';

export interface YukoContinuityStageProps {
  stages: ContinuityStageItem[];
  lensLabels: Record<StageLensId, string>;
  headingId?: string;
}

const LENS_ORDER: readonly StageLensId[] = ['fluxo', 'rede', 'blindagem'];
const RING_RADIUS = 17;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const STATION_COORDS = [
  { x: 250, y: 410 },
  { x: 560, y: 335 },
  { x: 880, y: 415 },
  { x: 1190, y: 330 },
] as const;

const SPLINE_PATH =
  'M 250 410 C 375 410 435 335 560 335 C 685 335 755 415 880 415 C 1005 415 1065 330 1190 330';

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function getStickyTop(): number {
  if (typeof window === 'undefined') return 82;
  return window.innerWidth >= 920 ? 82 : 118;
}

function isReducedMotionPreferred(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isMotionPaused(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  const calm = document.documentElement.getAttribute('data-motion') === 'calm';
  return calm || isReducedMotionPreferred();
}

export default function YukoContinuityStage({
  stages,
  lensLabels,
  headingId = 'continuidadeHeading',
}: YukoContinuityStageProps) {
  const uid = useId().replace(/:/g, '');
  const [activeIdx, setActiveIdx] = useState(0);
  const [lens, setLens] = useState<StageLensId>('fluxo');
  const [lensAnnouncement, setLensAnnouncement] = useState('');
  const [motionPaused, setMotionPaused] = useState(false);

  const scrollyRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const panoramaRef = useRef<HTMLDivElement>(null);
  const ringFillRef = useRef<SVGCircleElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const clickLockUntilRef = useRef(0);

  const rawMx = useMotionValue(0);
  const rawMy = useMotionValue(0);
  const springMx = useSpring(rawMx, { stiffness: 120, damping: 24, mass: 0.6 });
  const springMy = useSpring(rawMy, { stiffness: 120, damping: 24, mass: 0.6 });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const resetPointerVars = () => {
      rawMx.set(0);
      rawMy.set(0);
      const el = panoramaRef.current;
      if (!el) return;
      el.style.setProperty('--stage-mx', '0');
      el.style.setProperty('--stage-my', '0');
    };

    const syncMotionState = () => {
      const paused = isMotionPaused();
      setMotionPaused(paused);
      if (paused) {
        resetPointerVars();
      }
    };

    syncMotionState();

    if (isReducedMotionPreferred()) {
      resetPointerVars();
      return;
    }

    const syncPointerVars = () => {
      const el = panoramaRef.current;
      if (!el) return;
      if (isMotionPaused()) {
        el.style.setProperty('--stage-mx', '0');
        el.style.setProperty('--stage-my', '0');
        return;
      }
      el.style.setProperty('--stage-mx', springMx.get().toFixed(4));
      el.style.setProperty('--stage-my', springMy.get().toFixed(4));
    };

    const handleMotionChange = () => {
      syncMotionState();
    };

    const unsubX = springMx.on('change', syncPointerVars);
    const unsubY = springMy.on('change', syncPointerVars);
    window.addEventListener('yuko:motion-change', handleMotionChange);
    window.addEventListener('blur', resetPointerVars);
    document.addEventListener('astro:after-swap', handleMotionChange);

    let mq: MediaQueryList | null = null;
    if (typeof window.matchMedia === 'function') {
      mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      mq.addEventListener?.('change', handleMotionChange);
    }

    return () => {
      unsubX();
      unsubY();
      window.removeEventListener('yuko:motion-change', handleMotionChange);
      window.removeEventListener('blur', resetPointerVars);
      document.removeEventListener('astro:after-swap', handleMotionChange);
      mq?.removeEventListener?.('change', handleMotionChange);
    };
  }, [rawMx, rawMy, springMx, springMy]);

  const applyProgress = useCallback((progress: number) => {
    const p = clamp(progress, 0, 1);
    const pStr = p.toFixed(4);
    scrollyRef.current?.style.setProperty('--stage-progress', pStr);
    panoramaRef.current?.style.setProperty('--stage-progress', pStr);

    const ringEl = ringFillRef.current;
    if (ringEl) {
      ringEl.style.setProperty('--stage-progress', pStr);
      ringEl.style.strokeDasharray = RING_CIRCUMFERENCE.toFixed(2);
      ringEl.style.strokeDashoffset = (RING_CIRCUMFERENCE * (1 - p)).toFixed(2);
    }
  }, []);

  const activateChapter = useCallback(
    (idx: number) => {
      if (!stages.length) return;
      const clamped = clamp(Math.trunc(idx), 0, stages.length - 1);
      setActiveIdx(clamped);
    },
    [stages.length]
  );

  const getScrollRange = useCallback(() => {
    const scrollyEl = scrollyRef.current;
    if (!scrollyEl || typeof window === 'undefined') {
      return { startY: 0, travel: 1, progress: 0 };
    }
    const rect = scrollyEl.getBoundingClientRect();
    const vh = window.innerHeight || 800;
    const stickyTop = getStickyTop();
    const scrollyAbsTop = window.scrollY + rect.top;
    const startY = scrollyAbsTop - stickyTop;
    const endY = scrollyAbsTop + rect.height - vh;
    const travel = Math.max(120, endY - startY);
    const progress = clamp((window.scrollY - startY) / travel, 0, 1);
    return { startY, travel, progress };
  }, []);

  const updateActiveFromProgress = useCallback(
    (progressVal?: number) => {
      if (!stages.length || typeof window === 'undefined') return;
      if (typeof performance !== 'undefined' && performance.now() < clickLockUntilRef.current) {
        return;
      }

      const p =
        typeof progressVal === 'number' ? clamp(progressVal, 0, 1) : getScrollRange().progress;
      const idx = clamp(
        Math.floor(clamp(p, 0, 0.9999) * stages.length),
        0,
        stages.length - 1
      );
      activateChapter(idx);
    },
    [activateChapter, getScrollRange, stages.length]
  );

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const initialP = getScrollRange().progress;
    applyProgress(initialP);
    updateActiveFromProgress(initialP);

    const scrollyEl = scrollyRef.current;
    let gsapCtx: gsap.Context | null = null;
    let fallbackCleanup: (() => void) | null = null;

    const handleNativeSync = () => {
      const p = getScrollRange().progress;
      applyProgress(p);
      updateActiveFromProgress(p);
    };

    const cleanupScrollSync = () => {
      gsapCtx?.revert();
      gsapCtx = null;
      fallbackCleanup?.();
      fallbackCleanup = null;
    };

    if (scrollyEl) {
      try {
        gsap.registerPlugin(ScrollTrigger);
        gsapCtx = gsap.context(() => {
          ScrollTrigger.create({
            trigger: scrollyEl,
            start: () => `top ${getStickyTop()}px`,
            end: 'bottom bottom',
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              applyProgress(self.progress);
              updateActiveFromProgress(self.progress);
            },
          });
        }, scrollyRef);
        ScrollTrigger.refresh();
      } catch {
        window.addEventListener('scroll', handleNativeSync, { passive: true });
        window.addEventListener('resize', handleNativeSync, { passive: true });
        fallbackCleanup = () => {
          window.removeEventListener('scroll', handleNativeSync);
          window.removeEventListener('resize', handleNativeSync);
        };
      }
    }

    document.addEventListener('astro:before-swap', cleanupScrollSync);

    return () => {
      document.removeEventListener('astro:before-swap', cleanupScrollSync);
      cleanupScrollSync();
    };
  }, [applyProgress, getScrollRange, updateActiveFromProgress]);

  const handleSelectLens = (nextLens: StageLensId) => {
    setLens(nextLens);
    setLensAnnouncement(`Perspectiva de análise: ${lensLabels[nextLens]}`);
  };

  const handleSelectChapter = (idx: number, shouldScroll = true) => {
    if (!stages.length) return;
    const clampedIdx = clamp(Math.trunc(idx), 0, stages.length - 1);

    if (typeof performance !== 'undefined') {
      clickLockUntilRef.current = performance.now() + 920;
    }

    activateChapter(clampedIdx);

    const targetProgress =
      stages.length <= 1
        ? 0
        : clampedIdx === 0
          ? 0
          : clampedIdx === stages.length - 1
            ? 0.96
            : (clampedIdx + 0.38) / stages.length;

    applyProgress(targetProgress);

    if (shouldScroll && typeof window !== 'undefined') {
      const { startY, travel } = getScrollRange();
      const paused = isMotionPaused();
      const isDesktop = window.innerWidth >= 920;
      const cardEl = cardRefs.current[clampedIdx];
      const shellEl = shellRef.current;

      if (!isDesktop && cardEl && shellEl) {
        const cardRect = cardEl.getBoundingClientRect();
        const shellRect = shellEl.getBoundingClientRect();
        const stickyTop = getStickyTop();
        const stickyBottom =
          shellRect.top <= stickyTop + 1 && shellRect.top >= stickyTop - 1
            ? shellRect.bottom
            : stickyTop + shellRect.height;
        const offsetBelowShell = stickyBottom + 12;
        const rawTargetY = window.scrollY + cardRect.top - offsetBelowShell;
        const maxY = Math.max(0, startY + travel);
        const targetY = clamp(rawTargetY, Math.max(0, startY), maxY);
        scrollToTarget(targetY, {
          duration: paused ? 0 : 0.75,
          immediate: paused,
        });
      } else if (travel > 120) {
        const targetY = Math.max(0, startY + targetProgress * travel);
        scrollToTarget(targetY, {
          duration: paused ? 0 : 0.85,
          immediate: paused,
        });
      }
    }
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    if (isMotionPaused() || !panoramaRef.current) return;
    const rect = panoramaRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = clamp((e.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5) * 2;
    const ny = clamp((e.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5) * 2;
    rawMx.set(nx);
    rawMy.set(ny);
  };

  const handlePointerLeave = () => {
    rawMx.set(0);
    rawMy.set(0);
  };

  const totalCount = Math.max(stages.length, 1);
  const stepBadgeText = `${String(activeIdx + 1).padStart(2, '0')} / ${String(totalCount).padStart(2, '0')}`;
  const activeStage = stages[activeIdx] ?? stages[0];
  const activeStepLabel = String(activeIdx + 1).padStart(2, '0');

  const isNetworkLens = lens === 'rede';
  const isShieldLens = lens === 'blindagem';

  return (
    <div ref={scrollyRef} className="stage-scrolly">
      <div
        className="stage-sticky-stage"
        aria-label="Demonstração interativa de continuidade na Yuko"
      >
        <div ref={shellRef} className="stage-panorama-shell">
          <div
            ref={panoramaRef}
            id="yukoStagePanorama"
            className="stage-panorama"
            data-stage-lens={lens}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onPointerCancel={handlePointerLeave}
          >
            {/* Cenário Vetorial Expressionista (Topologia Cinética — Respaldo na Prática) */}
            <svg
              className="stage-svg-bg"
              viewBox="0 0 1440 760"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id={`gradFieldA-${uid}`}
                  x1="0"
                  y1="0"
                  x2="1440"
                  y2="760"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="var(--md-primary-container)" stopOpacity="0.64" />
                  <stop offset="52%" stopColor="var(--md-secondary-container)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--md-surface-container-low)" stopOpacity="0.16" />
                </linearGradient>

                <radialGradient id={`gradFieldB-${uid}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--md-tertiary-container)" stopOpacity="0.62" />
                  <stop offset="62%" stopColor="var(--md-secondary-container)" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="var(--md-surface-container)" stopOpacity="0" />
                </radialGradient>

                <linearGradient
                  id={`gradSpline-${uid}`}
                  x1="250"
                  y1="370"
                  x2="1190"
                  y2="370"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="var(--md-primary)" />
                  <stop offset="52%" stopColor="var(--md-secondary)" />
                  <stop offset="100%" stopColor="var(--md-tertiary)" />
                </linearGradient>

                <filter id={`glowSoft-${uid}`} x="-25%" y="-25%" width="150%" height="150%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <rect width="1440" height="760" fill="var(--md-surface-container-low)" />

              {/* Camada 1: 3 formas orgânicas amplas com paralaxe sutil */}
              <g className="stage-fields">
                <path
                  className="stage-field stage-field-primary"
                  d="M-60 205C130 65 370 95 530 220C685 342 615 565 385 655C175 735 -45 640 -90 445Z"
                  fill="var(--md-primary-container)"
                  opacity="0.38"
                  style={
                    motionPaused
                      ? undefined
                      : {
                          transform:
                            'translate3d(calc(var(--stage-mx, 0) * -14px + var(--stage-progress, 0) * 22px), calc(var(--stage-my, 0) * -10px + var(--stage-progress, 0) * -10px), 0)',
                        }
                  }
                />
                <path
                  className="stage-field stage-field-secondary"
                  d="M360 365C430 205 645 145 845 205C1035 262 1110 435 975 560C840 685 570 660 445 550C365 480 330 435 360 365Z"
                  fill="var(--md-secondary-container)"
                  opacity="0.36"
                  style={
                    motionPaused
                      ? undefined
                      : {
                          transform:
                            'translate3d(calc(var(--stage-mx, 0) * 10px + var(--stage-progress, 0) * -16px), calc(var(--stage-my, 0) * 8px + var(--stage-progress, 0) * 12px), 0)',
                        }
                  }
                />
                <path
                  className="stage-field stage-field-tertiary"
                  d="M895 145C1095 60 1335 125 1470 285C1550 445 1435 655 1205 685C970 715 825 540 845 365C856 255 825 175 895 145Z"
                  fill="var(--md-tertiary-container)"
                  opacity="0.36"
                  style={
                    motionPaused
                      ? undefined
                      : {
                          transform:
                            'translate3d(calc(var(--stage-mx, 0) * 16px + var(--stage-progress, 0) * -26px), calc(var(--stage-my, 0) * -12px + var(--stage-progress, 0) * 14px), 0)',
                        }
                  }
                />
                <path
                  d="M-40 160C280 95 560 270 840 215C1090 165 1290 220 1480 155V610C1250 655 1010 530 740 585C450 645 190 545 -40 610Z"
                  fill={`url(#gradFieldA-${uid})`}
                  opacity="0.46"
                />
                <circle
                  cx={STATION_COORDS[activeIdx]?.x ?? 250}
                  cy={STATION_COORDS[activeIdx]?.y ?? 410}
                  r="235"
                  fill={`url(#gradFieldB-${uid})`}
                  opacity="0.52"
                />
              </g>

              {/* Malha arquitetônica discreta + linhas ortogonais de lente */}
              <g className="stage-topology-grid" opacity="0.42">
                <line
                  x1="250"
                  y1="190"
                  x2="250"
                  y2="570"
                  stroke="var(--md-outline-variant)"
                  strokeWidth="1"
                  strokeDasharray="4 8"
                />
                <line
                  x1="560"
                  y1="190"
                  x2="560"
                  y2="570"
                  stroke="var(--md-outline-variant)"
                  strokeWidth="1"
                  strokeDasharray="4 8"
                />
                <line
                  x1="880"
                  y1="190"
                  x2="880"
                  y2="570"
                  stroke="var(--md-outline-variant)"
                  strokeWidth="1"
                  strokeDasharray="4 8"
                />
                <line
                  x1="1190"
                  y1="190"
                  x2="1190"
                  y2="570"
                  stroke="var(--md-outline-variant)"
                  strokeWidth="1"
                  strokeDasharray="4 8"
                />
              </g>

              {/* Camada 2: Trilha curva fluida conectando as 4 estações */}
              <g className="stage-spline">
                {/* Trilha base sutil */}
                <path
                  className="stage-spline-base"
                  d={SPLINE_PATH}
                  fill="none"
                  stroke="var(--md-outline-variant)"
                  strokeWidth="3"
                  strokeDasharray="7 8"
                  strokeLinecap="round"
                  opacity="0.82"
                />

                {/* Arcos de rede colaborativa (ganham destaque na lente 'rede') */}
                <g
                  className="stage-spline-network"
                  opacity={isNetworkLens ? 0.88 : 0.22}
                  filter={isNetworkLens ? `url(#glowSoft-${uid})` : undefined}
                >
                  <path
                    d="M 250 410 C 420 250 710 250 880 415"
                    fill="none"
                    stroke="var(--md-secondary)"
                    strokeWidth={isNetworkLens ? 2.6 : 1.5}
                    strokeDasharray="5 7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 560 335 C 745 485 1015 485 1190 330"
                    fill="none"
                    stroke="var(--md-secondary)"
                    strokeWidth={isNetworkLens ? 2.6 : 1.5}
                    strokeDasharray="5 7"
                    strokeLinecap="round"
                  />
                </g>

                {/* Arcos de blindagem e rota alternativa 5 dias úteis (ganham destaque na lente 'blindagem') */}
                <g
                  className="stage-spline-shield"
                  opacity={isShieldLens ? 0.92 : 0.24}
                  filter={isShieldLens ? `url(#glowSoft-${uid})` : undefined}
                >
                  <path
                    d="M 880 415 C 975 245 1110 235 1190 330"
                    fill="none"
                    stroke="var(--md-tertiary)"
                    strokeWidth={isShieldLens ? 3 : 1.5}
                    strokeDasharray="8 6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 250 410 C 490 520 940 520 1190 330"
                    fill="none"
                    stroke="var(--md-tertiary)"
                    strokeWidth={isShieldLens ? 2.4 : 1.25}
                    strokeDasharray="4 8"
                    strokeLinecap="round"
                  />
                </g>

                {/* Feixe secundário luminoso que brilha em 'rede' / 'blindagem' */}
                <path
                  className="stage-spline-beam"
                  d={SPLINE_PATH}
                  fill="none"
                  stroke={`url(#gradSpline-${uid})`}
                  strokeWidth={lens === 'fluxo' ? 9 : 13}
                  strokeLinecap="round"
                  pathLength={1}
                  opacity={lens === 'fluxo' ? 0.24 : lens === 'rede' ? 0.56 : 0.66}
                  filter={`url(#glowSoft-${uid})`}
                  style={{
                    strokeDasharray: 1,
                    strokeDashoffset: 'calc(1 - var(--stage-progress, 0))',
                  }}
                />

                {/* Trilha ativa principal em --md-primary */}
                <path
                  className="stage-spline-active"
                  d={SPLINE_PATH}
                  fill="none"
                  stroke="var(--md-primary)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  pathLength={1}
                  style={{
                    strokeDasharray: 1,
                    strokeDashoffset: 'calc(1 - var(--stage-progress, 0))',
                  }}
                />
              </g>

              {/* Camada 3: 4 estações geométricas M3 Expressive clicáveis */}
              <g className="stage-nodes">
                {/* Estação 01: Escuta & Combinado (anéis concêntricos de alinhamento) */}
                {(() => {
                  const stage0 = stages[0];
                  const isActive = activeIdx === 0;
                  const { x, y } = STATION_COORDS[0];
                  return (
                    <g
                      className={`stage-node stage-node-1${isActive ? ' is-active-node' : ''}`}
                      transform={`translate(${x} ${y}) scale(${isActive ? 1.12 : 0.96})`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSelectChapter(0, true)}
                    >
                      <title>
                        {stage0
                          ? `01 · ${stage0.stageLabel}: ${stage0.title}`
                          : '01 · Escuta & Combinado'}
                      </title>
                      <circle
                        className="stage-node-aura"
                        r={isActive ? 68 : 54}
                        fill="var(--md-primary-container)"
                        opacity={isActive ? 0.45 : 0.16}
                        filter={isActive ? `url(#glowSoft-${uid})` : undefined}
                      />
                      <circle
                        r="48"
                        fill="none"
                        stroke={isShieldLens ? 'var(--md-tertiary)' : 'var(--md-outline-variant)'}
                        strokeWidth={isShieldLens ? 2.2 : 1.5}
                        strokeDasharray="6 6"
                      />
                      <circle
                        r="34"
                        fill="var(--md-surface-container-lowest)"
                        stroke={isActive ? 'var(--md-primary)' : 'var(--md-outline-variant)'}
                        strokeWidth={isActive ? 3 : 1.75}
                      />
                      <circle
                        r="21"
                        fill={isActive ? 'var(--md-primary-container)' : 'var(--md-surface-container)'}
                        stroke="var(--md-primary)"
                        strokeWidth="1.5"
                        opacity="0.92"
                      />
                      <circle r="8.5" fill="var(--md-primary)" />
                      <path
                        d="M-42 0H-28M28 0H42M0 -42V-28M0 28V42"
                        stroke="var(--md-primary)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        opacity={isActive ? 0.9 : 0.45}
                      />
                    </g>
                  );
                })()}

                {/* Estação 02: Código Centralizado (núcleo compartilhado com conexões ao Discord/repositório) */}
                {(() => {
                  const stage1 = stages[1];
                  const isActive = activeIdx === 1;
                  const { x, y } = STATION_COORDS[1];
                  return (
                    <g
                      className={`stage-node stage-node-2${isActive ? ' is-active-node' : ''}`}
                      transform={`translate(${x} ${y}) scale(${isActive ? 1.12 : 0.96})`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSelectChapter(1, true)}
                    >
                      <title>
                        {stage1
                          ? `02 · ${stage1.stageLabel}: ${stage1.title}`
                          : '02 · Código Centralizado'}
                      </title>
                      <circle
                        className="stage-node-aura"
                        r={isActive ? 70 : 54}
                        fill="var(--md-secondary-container)"
                        opacity={isActive || isNetworkLens ? 0.48 : 0.18}
                        filter={isActive ? `url(#glowSoft-${uid})` : undefined}
                      />
                      {/* Conexões ao Discord / repositório central */}
                      <path
                        d="M-46 -32L-18 -14M46 -32L18 -14M-46 32L-18 14M46 32L18 14"
                        stroke={isNetworkLens ? 'var(--md-secondary)' : 'var(--md-primary)'}
                        strokeWidth={isNetworkLens || isActive ? 2.5 : 1.75}
                        strokeLinecap="round"
                      />
                      <circle cx="-48" cy="-34" r="6" fill="var(--md-secondary)" />
                      <circle cx="48" cy="-34" r="6" fill="var(--md-primary)" />
                      <circle cx="-48" cy="34" r="5.5" fill="var(--md-tertiary)" />
                      <circle cx="48" cy="34" r="6" fill="var(--md-secondary)" />
                      {/* Núcleo centralizado */}
                      <rect
                        x="-32"
                        y="-32"
                        width="64"
                        height="64"
                        rx="20"
                        fill="var(--md-surface-container-lowest)"
                        stroke={isActive ? 'var(--md-primary)' : 'var(--md-outline-variant)'}
                        strokeWidth={isActive ? 3 : 1.75}
                      />
                      <rect
                        x="-16"
                        y="-16"
                        width="32"
                        height="32"
                        rx="10"
                        fill={isActive ? 'var(--md-primary)' : 'var(--md-secondary-container)'}
                      />
                      <circle
                        r="5.5"
                        fill={
                          isActive
                            ? 'var(--md-on-primary)'
                            : 'var(--md-on-secondary-container)'
                        }
                      />
                    </g>
                  );
                })()}

                {/* Estação 03: 2+ Pares & LGPD (portais duplos de conferência + escudo de dados sintéticos) */}
                {(() => {
                  const stage2 = stages[2];
                  const isActive = activeIdx === 2;
                  const { x, y } = STATION_COORDS[2];
                  return (
                    <g
                      className={`stage-node stage-node-3${isActive ? ' is-active-node' : ''}`}
                      transform={`translate(${x} ${y}) scale(${isActive ? 1.12 : 0.96})`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSelectChapter(2, true)}
                    >
                      <title>
                        {stage2
                          ? `03 · ${stage2.stageLabel}: ${stage2.title}`
                          : '03 · 2+ Pares & LGPD'}
                      </title>
                      <circle
                        className="stage-node-aura"
                        r={isActive ? 72 : 56}
                        fill="var(--md-tertiary-container)"
                        opacity={isActive || isShieldLens ? 0.48 : 0.18}
                        filter={isActive ? `url(#glowSoft-${uid})` : undefined}
                      />
                      {/* Portais duplos de conferência (2+ revisores independentes) */}
                      <circle
                        cx="-17"
                        cy="0"
                        r="30"
                        fill="var(--md-surface-container-lowest)"
                        fillOpacity="0.86"
                        stroke={isNetworkLens ? 'var(--md-secondary)' : 'var(--md-primary)'}
                        strokeWidth={isActive ? 2.8 : 2}
                      />
                      <circle
                        cx="17"
                        cy="0"
                        r="30"
                        fill="var(--md-surface-container-lowest)"
                        fillOpacity="0.86"
                        stroke={isShieldLens ? 'var(--md-tertiary)' : 'var(--md-secondary)'}
                        strokeWidth={isActive ? 2.8 : 2}
                      />
                      {/* Escudo central de dados sintéticos / LGPD */}
                      <path
                        d="M0 -24L20 -15V2C20 15 11.5 25 0 30C-11.5 25 -20 15 -20 2V-15Z"
                        fill={isActive ? 'var(--md-tertiary)' : 'var(--md-tertiary-container)'}
                        stroke="var(--md-surface-container-lowest)"
                        strokeWidth="2"
                      />
                      <path
                        d="M-7 2L-2 7L8 -4"
                        fill="none"
                        stroke={
                          isActive
                            ? 'var(--md-on-tertiary)'
                            : 'var(--md-on-tertiary-container)'
                        }
                        strokeWidth="2.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  );
                })()}

                {/* Estação 04: Suporte & Continuidade (halo de proteção completo + rota alternativa 5 dias úteis) */}
                {(() => {
                  const stage3 = stages[3];
                  const isActive = activeIdx === 3;
                  const { x, y } = STATION_COORDS[3];
                  return (
                    <g
                      className={`stage-node stage-node-4${isActive ? ' is-active-node' : ''}`}
                      transform={`translate(${x} ${y}) scale(${isActive ? 1.12 : 0.96})`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSelectChapter(3, true)}
                    >
                      <title>
                        {stage3
                          ? `04 · ${stage3.stageLabel}: ${stage3.title}`
                          : '04 · Suporte & Continuidade'}
                      </title>
                      <circle
                        className="stage-node-aura"
                        r={isActive ? 74 : 58}
                        fill="var(--md-primary-container)"
                        opacity={isActive ? 0.54 : 0.22}
                        filter={isActive ? `url(#glowSoft-${uid})` : undefined}
                      />
                      {/* Halo de proteção completo */}
                      <circle
                        r="54"
                        fill="none"
                        stroke={isShieldLens ? 'var(--md-tertiary)' : 'var(--md-primary)'}
                        strokeWidth={isActive || isShieldLens ? 2.6 : 1.75}
                        opacity="0.88"
                      />
                      {/* Rota alternativa de transição (5 dias úteis) */}
                      <path
                        d="M-48 22C-36 52 20 56 46 24"
                        fill="none"
                        stroke="var(--md-tertiary)"
                        strokeWidth="2.6"
                        strokeDasharray="5 5"
                        strokeLinecap="round"
                      />
                      <circle cx="46" cy="24" r="5" fill="var(--md-tertiary)" />
                      {/* Selo M3 Expressive */}
                      <path
                        d="M0 -36C7 -36 12 -28 19 -26C26 -24 33 -30 37 -24C41 -18 35 -11 37 -4C39 3 45 8 43 15C41 22 33 23 28 29C23 35 24 43 17 45C10 47 5 39 -2 39C-9 39 -14 47 -21 45C-28 43 -27 35 -32 29C-37 23 -45 22 -47 15C-49 8 -43 3 -41 -4C-39 -11 -45 -18 -41 -24C-37 -30 -30 -24 -23 -26C-16 -28 -11 -36 0 -36Z"
                        transform="scale(0.84)"
                        fill={isActive ? 'var(--md-primary)' : 'var(--md-surface-container-lowest)'}
                        stroke="var(--md-primary)"
                        strokeWidth="2"
                      />
                      <circle
                        r="14"
                        fill={isActive ? 'var(--md-on-primary)' : 'var(--md-primary-container)'}
                      />
                      <path
                        d="M-5.5 0L-1.5 4L6 -3.5"
                        fill="none"
                        stroke={isActive ? 'var(--md-primary)' : 'var(--md-on-primary-container)'}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  );
                })()}
              </g>
            </svg>

            <div className="stage-sky-scrim" aria-hidden="true" />
            <div className="stage-floor-scrim" aria-hidden="true" />

            {/* HUD Superior do Palco */}
            <div className="stage-header-row">
              <div className="stage-intro">
                <span className="stage-kicker">Respaldo na Prática</span>
                <h2 id={headingId} className="stage-title">
                  Como preservamos a continuidade
                </h2>
                <p className="stage-lead">
                  Código centralizado, revisão por 2+ pares e transferência assistida após 5 dias úteis sem retorno.
                </p>
              </div>

              <div className="stage-hud-cluster">
                <div
                  className="connected-group stage-glass-group"
                  role="group"
                  aria-label="Perspectiva de análise"
                >
                  {LENS_ORDER.map((lensKey) => (
                    <button
                      key={lensKey}
                      className="connected-btn"
                      type="button"
                      data-stage-lens={lensKey}
                      aria-pressed={lens === lensKey}
                      onClick={() => handleSelectLens(lensKey)}
                    >
                      {lensLabels[lensKey]}
                    </button>
                  ))}
                </div>

                <span className="sr-only" aria-live="polite">
                  {lensAnnouncement}
                </span>

                <div className="stage-progress-hud">
                  <div className="stage-ring-wrap">
                    <svg
                      className="stage-ring-svg"
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      aria-hidden="true"
                    >
                      <circle
                        className="stage-ring-track"
                        cx="20"
                        cy="20"
                        r={RING_RADIUS}
                        fill="none"
                      />
                      <circle
                        ref={ringFillRef}
                        className="stage-ring-fill"
                        cx="20"
                        cy="20"
                        r={RING_RADIUS}
                        fill="none"
                        strokeDasharray={RING_CIRCUMFERENCE.toFixed(2)}
                        strokeDashoffset={RING_CIRCUMFERENCE.toFixed(2)}
                      />
                    </svg>
                    <span className="stage-step-badge">{stepBadgeText}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Camada 4: Título emergente e micro-chip da lente na base esquerda */}
            <div className="stage-rising-stage">
              <AnimatePresence mode="wait" initial={false}>
                {activeStage && (
                  <motion.div
                    key={activeIdx}
                    className="stage-rising-title"
                    initial={motionPaused ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={motionPaused ? { opacity: 0, y: 0 } : { opacity: 0, y: -14 }}
                    transition={{
                      duration: motionPaused ? 0 : 0.34,
                      ease: [0.2, 0, 0, 1],
                    }}
                  >
                    <span className="stage-rising-ref">{activeStepLabel}</span>
                    <span className="stage-rising-name">{activeStage.stageLabel}</span>
                    <span className="stage-rising-lens-chip">
                      {activeStage.lensNotes[lens]}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div
            className="stage-mobile-tabs"
            role="group"
            aria-label="Selecionar etapa de continuidade"
          >
            {stages.map((stage, idx) => {
              const isActive = idx === activeIdx;
              const stepLabel = String(idx + 1).padStart(2, '0');
              return (
                <button
                  key={`tab-${idx}-${stage.title}`}
                  type="button"
                  aria-pressed={isActive}
                  aria-label={`Etapa ${stepLabel}: ${stage.title}`}
                  className={`stage-mobile-tab${isActive ? ' is-active' : ''}`}
                  onClick={() => handleSelectChapter(idx, true)}
                >
                  {stepLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Cards Abaixo do Palco */}
        <div className="stage-below-wrap">
          <div
            className="stage-chapters stage-below-cards"
            aria-label="Etapas do respaldo coletivo"
          >
            {stages.map((stage, idx) => {
              const isActive = idx === activeIdx;
              const isLast = idx === stages.length - 1;
              const stepLabel = String(idx + 1).padStart(2, '0');
              const rawKicker = stage.kicker ?? '';
              const kickerParts = rawKicker.split('·').map((part) => part.trim());
              const kickerSuffix =
                kickerParts.length > 1
                  ? kickerParts.slice(1).join(' · ')
                  : rawKicker && rawKicker !== stepLabel
                    ? rawKicker
                    : '';

              return (
                <article
                  key={`chapter-${idx}-${stage.title}`}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  className={`stage-chapter${isActive ? ' is-active' : ''}`}
                  data-stage-chapter={idx}
                  aria-current={isActive ? 'step' : undefined}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('a, button')) return;
                    handleSelectChapter(idx, true);
                  }}
                >
                  <div className="stage-chapter-top">
                    <span className="stage-chapter-kicker">
                      <span className="stage-chapter-num">{stepLabel}</span>
                      {kickerSuffix && <span className="stage-chapter-tag">{kickerSuffix}</span>}
                    </span>
                    <span className="stage-chapter-pulse" aria-hidden="true" />
                  </div>

                  <h3 className="stage-chapter-title">
                    <button
                      type="button"
                      className="stage-chapter-trigger"
                      aria-pressed={isActive}
                      onClick={() => handleSelectChapter(idx, true)}
                    >
                      {stage.title}
                    </button>
                  </h3>

                  <p className="stage-chapter-body">{stage.body}</p>

                  {isLast && isActive && stage.ctaLabel && stage.ctaHref && (
                    <div className="stage-chapter-actions">
                      <a href={stage.ctaHref} className="stage-chapter-link">
                        {stage.ctaLabel}
                      </a>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
