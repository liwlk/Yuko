import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { scrollToTarget } from '../scripts/lenis-manager';

export type YukonMood = 'alvorada' | 'travessia' | 'boreal';

export interface YukonChapter {
  id?: string | number;
  index?: number;
  step?: number;
  mood?: YukonMood;
  kicker?: string;
  tag?: string;
  title: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface YukonExperienceProps {
  chapters: YukonChapter[];
  moodLabels: Record<YukonMood, string>;
}

const MOOD_ORDER: readonly YukonMood[] = ['alvorada', 'travessia', 'boreal'];
const RING_RADIUS = 17;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function getAutoMoodForIndex(index: number, chapter?: YukonChapter): YukonMood {
  if (chapter?.mood) return chapter.mood;
  if (index <= 1) return 'alvorada';
  if (index === 2) return 'travessia';
  return 'boreal';
}

function getStickyTop(): number {
  if (typeof window === 'undefined') return 82;
  return window.innerWidth >= 920 ? 82 : 132;
}

function isMotionPaused(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  const calm = document.documentElement.getAttribute('data-motion') === 'calm';
  const reduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return calm || reduced;
}

export default function YukonExperience({ chapters, moodLabels }: YukonExperienceProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [mood, setMood] = useState<YukonMood>(() => getAutoMoodForIndex(0, chapters[0]));
  const [moodAnnouncement, setMoodAnnouncement] = useState('');
  const [motionPaused, setMotionPaused] = useState(false);

  const scrollyRef = useRef<HTMLDivElement>(null);
  const panoramaRef = useRef<HTMLDivElement>(null);
  const ringFillRef = useRef<SVGCircleElement>(null);
  const moodManuallyLockedRef = useRef(false);
  const clickLockUntilRef = useRef(0);

  const rawMx = useMotionValue(0);
  const rawMy = useMotionValue(0);
  const springMx = useSpring(rawMx, { stiffness: 120, damping: 24, mass: 0.6 });
  const springMy = useSpring(rawMy, { stiffness: 120, damping: 24, mass: 0.6 });

  useEffect(() => {
    const resetPointerVars = () => {
      rawMx.set(0);
      rawMy.set(0);
      const el = panoramaRef.current;
      if (!el) return;
      el.style.setProperty('--yukon-mx', '0');
      el.style.setProperty('--yukon-my', '0');
    };

    const syncPointerVars = () => {
      const el = panoramaRef.current;
      if (!el) return;
      if (isMotionPaused()) {
        el.style.setProperty('--yukon-mx', '0');
        el.style.setProperty('--yukon-my', '0');
        return;
      }
      el.style.setProperty('--yukon-mx', springMx.get().toFixed(4));
      el.style.setProperty('--yukon-my', springMy.get().toFixed(4));
    };

    const syncMotionState = () => {
      setMotionPaused(isMotionPaused());
    };

    const handleMotionChange = () => {
      syncMotionState();
      resetPointerVars();
    };

    syncMotionState();

    const unsubX = springMx.on('change', syncPointerVars);
    const unsubY = springMy.on('change', syncPointerVars);
    window.addEventListener('yuko:motion-change', handleMotionChange);
    window.addEventListener('blur', resetPointerVars);
    document.addEventListener('astro:after-swap', handleMotionChange);

    let mq: MediaQueryList | null = null;
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
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
    scrollyRef.current?.style.setProperty('--yukon-progress', pStr);
    panoramaRef.current?.style.setProperty('--yukon-progress', pStr);

    const ringEl = ringFillRef.current;
    if (ringEl) {
      ringEl.style.setProperty('--yukon-progress', pStr);
      ringEl.style.strokeDasharray = RING_CIRCUMFERENCE.toFixed(2);
      ringEl.style.strokeDashoffset = (RING_CIRCUMFERENCE * (1 - p)).toFixed(2);
    }
  }, []);

  const activateChapter = useCallback(
    (idx: number) => {
      if (!chapters.length) return;
      const clamped = clamp(Math.trunc(idx), 0, chapters.length - 1);
      setActiveIdx(clamped);

      if (!moodManuallyLockedRef.current) {
        setMood(getAutoMoodForIndex(clamped, chapters[clamped]));
      }
    },
    [chapters]
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
      if (!chapters.length || typeof window === 'undefined') return;
      if (typeof performance !== 'undefined' && performance.now() < clickLockUntilRef.current) {
        return;
      }

      const p =
        typeof progressVal === 'number' ? clamp(progressVal, 0, 1) : getScrollRange().progress;
      const idx = clamp(
        Math.floor(clamp(p, 0, 0.9999) * chapters.length),
        0,
        chapters.length - 1
      );
      activateChapter(idx);
    },
    [activateChapter, chapters.length, getScrollRange]
  );

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const initialP = getScrollRange().progress;
    applyProgress(initialP);
    updateActiveFromProgress(initialP);

    const scrollyEl = scrollyRef.current;
    let stInstance: ScrollTrigger | null = null;
    let fallbackCleanup: (() => void) | null = null;

    const handleNativeSync = () => {
      const p = getScrollRange().progress;
      applyProgress(p);
      updateActiveFromProgress(p);
    };

    if (scrollyEl) {
      try {
        gsap.registerPlugin(ScrollTrigger);
        stInstance = ScrollTrigger.create({
          trigger: scrollyEl,
          start: () => `top ${getStickyTop()}px`,
          end: 'bottom bottom',
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            applyProgress(self.progress);
            updateActiveFromProgress(self.progress);
          },
        });
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

    return () => {
      stInstance?.kill();
      fallbackCleanup?.();
    };
  }, [applyProgress, getScrollRange, updateActiveFromProgress]);

  const handleSelectMood = (nextMood: YukonMood) => {
    moodManuallyLockedRef.current = true;
    setMood(nextMood);
    setMoodAnnouncement(`Momento atmosférico em Yukon: ${moodLabels[nextMood]}`);
  };

  const handleCycleMood = () => {
    const idx = MOOD_ORDER.indexOf(mood);
    const nextMood = MOOD_ORDER[(idx + 1) % MOOD_ORDER.length];
    handleSelectMood(nextMood);
  };

  const handleSelectChapter = (idx: number, shouldScroll = true) => {
    if (!chapters.length) return;
    const clampedIdx = clamp(Math.trunc(idx), 0, chapters.length - 1);

    if (typeof performance !== 'undefined') {
      clickLockUntilRef.current = performance.now() + 920;
    }

    activateChapter(clampedIdx);

    const targetProgress =
      chapters.length <= 1
        ? 0
        : clampedIdx === 0
          ? 0
          : clampedIdx === chapters.length - 1
            ? 0.96
            : (clampedIdx + 0.38) / chapters.length;

    applyProgress(targetProgress);

    if (shouldScroll && typeof window !== 'undefined') {
      const { startY, travel } = getScrollRange();
      if (travel > 120) {
        const targetY = Math.max(0, startY + targetProgress * travel);
        const paused = isMotionPaused();
        scrollToTarget(targetY, {
          duration: paused ? 0 : 0.85,
          immediate: paused,
        });
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
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

  const totalCount = Math.max(chapters.length, 1);
  const stepBadgeText = `${String(activeIdx + 1).padStart(2, '0')} / ${String(totalCount).padStart(2, '0')}`;

  return (
    <div ref={scrollyRef} className="yukon-scrolly">
      <div className="yukon-sticky-stage" aria-label="Cenário atmosférico e etapas em Yukon">
        <div
          ref={panoramaRef}
          id="yukonPanorama"
          className="yukon-panorama"
          data-yukon-mood={mood}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onPointerCancel={handlePointerLeave}
        >
          {/* Full-Bleed Animated Yukon Panoramic Illustration (Material You Token-Driven) */}
          <svg
            className="yukon-svg-bg"
            viewBox="0 0 1440 760"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="yukonSkyGrad"
                x1="0"
                y1="0"
                x2="0"
                y2="760"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="var(--md-surface-container-low)" />
                <stop
                  offset="48%"
                  stopColor="var(--md-primary-container)"
                  stopOpacity="0.68"
                />
                <stop offset="100%" stopColor="var(--md-surface-container)" />
              </linearGradient>

              <radialGradient id="yukonSunHalo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--md-surface-container-lowest)" stopOpacity="0.95" />
                <stop offset="45%" stopColor="var(--md-primary-container)" stopOpacity="0.56" />
                <stop offset="100%" stopColor="var(--md-primary-container)" stopOpacity="0" />
              </radialGradient>

              <linearGradient
                id="yukonAuroraGrad"
                x1="0"
                y1="50"
                x2="1440"
                y2="340"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="var(--md-primary)" stopOpacity="0.06" />
                <stop offset="32%" stopColor="var(--md-primary)" stopOpacity="0.58" />
                <stop offset="68%" stopColor="var(--md-tertiary)" stopOpacity="0.48" />
                <stop offset="100%" stopColor="var(--md-primary)" stopOpacity="0.08" />
              </linearGradient>

              <linearGradient
                id="yukonRiverGrad"
                x1="720"
                y1="420"
                x2="720"
                y2="760"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="var(--md-primary-container)" stopOpacity="0.96" />
                <stop offset="55%" stopColor="var(--md-secondary-container)" stopOpacity="0.88" />
                <stop offset="100%" stopColor="var(--md-surface-container-high)" stopOpacity="0.95" />
              </linearGradient>

              <linearGradient
                id="yukonMistGrad"
                x1="0"
                y1="380"
                x2="0"
                y2="540"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="var(--md-surface-container-lowest)" stopOpacity="0" />
                <stop offset="50%" stopColor="var(--md-surface-container-lowest)" stopOpacity="0.34" />
                <stop offset="100%" stopColor="var(--md-surface-container-lowest)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* 1. Céu Ártico */}
            <rect width="1440" height="760" fill="url(#yukonSkyGrad)" />

            {/* 2. Estrelas Boreais */}
            <g className="yukon-stars">
              <circle cx="118" cy="86" r="2.2" fill="var(--md-primary-container)" opacity="0.88" />
              <circle cx="242" cy="136" r="1.6" fill="var(--md-tertiary-container)" opacity="0.78" />
              <circle cx="384" cy="72" r="2.4" fill="var(--md-primary-container)" opacity="0.92" />
              <circle cx="518" cy="108" r="1.8" fill="var(--md-secondary-container)" opacity="0.75" />
              <circle cx="662" cy="64" r="2.6" fill="var(--md-tertiary-container)" opacity="0.9" />
              <circle cx="798" cy="116" r="1.8" fill="var(--md-primary-container)" opacity="0.8" />
              <circle cx="942" cy="74" r="2.4" fill="var(--md-primary-container)" opacity="0.86" />
              <circle cx="1096" cy="142" r="1.9" fill="var(--md-tertiary-container)" opacity="0.82" />
              <circle cx="1234" cy="88" r="2.5" fill="var(--md-primary-container)" opacity="0.92" />
              <circle cx="1352" cy="156" r="1.7" fill="var(--md-secondary-container)" opacity="0.76" />
              <circle cx="192" cy="204" r="1.5" fill="var(--md-secondary-container)" opacity="0.68" />
              <circle cx="728" cy="168" r="1.7" fill="var(--md-primary-container)" opacity="0.78" />
              <circle cx="1160" cy="198" r="1.6" fill="var(--md-tertiary-container)" opacity="0.74" />
            </g>

            {/* 3. Aurora Boreal em Camadas */}
            <g className="yukon-aurora">
              <path
                d="M-60 220C210 120 430 275 730 165C1030 55 1210 235 1500 130V310C1195 365 995 215 705 298C415 385 190 265 -60 330Z"
                fill="url(#yukonAuroraGrad)"
              />
              <path
                d="M90 145C350 75 565 195 875 112C1130 45 1295 162 1465 104V212C1255 248 1075 156 835 214C545 280 315 170 90 220Z"
                fill="url(#yukonAuroraGrad)"
                opacity="0.68"
              />
            </g>

            {/* 4. Sol Nórdico + Halo */}
            <g className="yukon-sun">
              <circle cx="885" cy="265" r="195" fill="url(#yukonSunHalo)" />
              <circle cx="885" cy="265" r="62" fill="var(--md-surface-container-lowest)" opacity="0.94" />
            </g>

            {/* 5. Nuvens Altas */}
            <g className="yukon-clouds">
              <path
                d="M90 258C155 234 240 236 304 258C354 242 432 250 484 270H54C66 265 78 261 90 258Z"
                fill="var(--md-surface-container-lowest)"
                opacity="0.52"
              />
              <path
                d="M960 218C1032 192 1134 195 1204 218C1266 200 1350 208 1406 232H916C932 226 946 222 960 218Z"
                fill="var(--md-surface-container-lowest)"
                opacity="0.46"
              />
            </g>

            {/* 6. Cordilheira Distante de Yukon + Cristas Nevadas */}
            <g className="yukon-ridge-far">
              <path
                d="M0 438L145 304L290 384L475 246L660 374L860 264L1050 364L1255 240L1440 338V760H0V438Z"
                fill="var(--md-secondary-container)"
                opacity="0.9"
              />
              {/* Cristas iluminadas pela alvorada alinhadas às encostas */}
              <path
                d="M475 246L545 294L505 320L486 290Z M860 264L930 301L888 326L870 295Z M1255 240L1325 277L1284 304L1266 274Z"
                fill="var(--md-surface-container-lowest)"
                opacity="0.28"
              />
            </g>

            {/* 7. Névoa de Vale */}
            <rect
              className="yukon-valley-mist"
              x="-60"
              y="380"
              width="1560"
              height="160"
              fill="url(#yukonMistGrad)"
            />

            {/* 8. Cordilheira Média */}
            <path
              className="yukon-ridge-mid"
              d="M0 486L190 352L365 446L565 322L770 438L975 330L1195 426L1440 318V760H0V486Z"
              fill="var(--md-secondary)"
              opacity="0.58"
            />

            {/* 9. Planície do Vale & Rio Yukon sinuoso */}
            <path
              d="M0 492C340 468 680 482 1440 468V760H0V492Z"
              fill="var(--md-surface-container-high)"
            />
            <g className="yukon-river">
              <path
                d="M808 474C726 498 886 534 736 574C578 614 854 662 678 724C616 744 574 754 554 760H938C988 708 860 658 906 604C958 544 824 512 878 474H808Z"
                fill="url(#yukonRiverGrad)"
              />
              <path
                d="M780 518C796 518 824 522 838 522 M712 586C742 582 786 588 808 586 M694 662C742 656 798 666 832 662"
                stroke="var(--md-surface-container-lowest)"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.45"
              />
            </g>

            {/* 10. Encostas Próximas */}
            <g className="yukon-ridge-near">
              <path
                d="M0 404L140 452L275 518L455 596L550 760H0V404Z"
                fill="var(--md-primary)"
                opacity="0.34"
              />
              <path
                d="M1440 388L1285 452L1115 534L985 624L944 760H1440V388Z"
                fill="var(--md-primary)"
                opacity="0.42"
              />
              <path
                d="M0 598C210 558 380 634 575 688C815 754 1115 620 1440 658V760H0V598Z"
                fill="var(--md-surface-container)"
              />
            </g>

            {/* 11. Silhuetas de Pinheiros Boreais em Primeiro Plano */}
            <g className="yukon-pines">
              <path
                d="M28 760V596L4 596L34 548L14 548L40 502L66 548L46 548L76 596L52 596V760Z"
                fill="var(--md-secondary)"
                opacity="0.76"
              />
              <path
                d="M92 760V632L70 632L96 590L80 590L104 550L128 590L112 590L138 632L116 632V760Z"
                fill="var(--md-primary)"
                opacity="0.62"
              />
              <path
                d="M164 760V656L144 656L168 618L154 618L176 582L198 618L184 618L208 656L188 656V760Z"
                fill="var(--md-secondary)"
                opacity="0.66"
              />
              <path
                d="M238 760V682L224 682L242 652L230 652L248 622L266 652L254 652L272 682L258 682V760Z"
                fill="var(--md-primary)"
                opacity="0.52"
              />
              <path
                d="M1180 760V674L1164 674L1185 642L1172 642L1191 610L1210 642L1197 642L1218 674L1202 674V760Z"
                fill="var(--md-primary)"
                opacity="0.54"
              />
              <path
                d="M1254 760V646L1232 646L1258 604L1242 604L1266 564L1290 604L1274 604L1300 646L1278 646V760Z"
                fill="var(--md-secondary)"
                opacity="0.7"
              />
              <path
                d="M1336 760V608L1310 608L1340 558L1318 558L1348 510L1378 558L1356 558L1386 608L1360 608V760Z"
                fill="var(--md-primary)"
                opacity="0.64"
              />
              <path
                d="M1404 760V642L1384 642L1408 602L1394 602L1416 566L1438 602L1424 602L1444 636V760Z"
                fill="var(--md-secondary)"
                opacity="0.78"
              />
            </g>

            {/* 12. Partículas Atmosféricas Sutis */}
            <g className="yukon-particles">
              <circle cx="290" cy="270" r="2.2" fill="var(--md-surface-container-lowest)" opacity="0.55" />
              <circle cx="520" cy="310" r="1.8" fill="var(--md-primary-container)" opacity="0.65" />
              <circle cx="760" cy="240" r="2.4" fill="var(--md-surface-container-lowest)" opacity="0.5" />
              <circle cx="1010" cy="300" r="2" fill="var(--md-tertiary-container)" opacity="0.62" />
              <circle cx="1220" cy="275" r="2.1" fill="var(--md-surface-container-lowest)" opacity="0.52" />
            </g>
          </svg>

          <div className="yukon-sky-scrim" aria-hidden="true" />
          <div className="yukon-floor-scrim" aria-hidden="true" />

          {/* Barra Superior Minimalista sobre o Céu de Yukon */}
          <div className="yukon-header-row">
            <div className="yukon-intro">
              <span className="yukon-kicker">Yukon, Canadá</span>
              <h2 id="yukonHeading" className="yukon-title">
                Experiência em Yukon: resiliência em território aberto
              </h2>
              <p className="yukon-lead">
                Vastidão exploratória, sobriedade e software sólido para ambientes reais.
              </p>
            </div>

            <div className="yukon-hud-cluster">
              <div className="yukon-mood-switch">
                <div
                  className="connected-group yukon-glass-group"
                  role="group"
                  aria-label="Momento da expedição em Yukon"
                >
                  {MOOD_ORDER.map((moodKey) => (
                    <button
                      key={moodKey}
                      className="connected-btn"
                      type="button"
                      data-yukon-mood={moodKey}
                      aria-pressed={mood === moodKey}
                      onClick={() => handleSelectMood(moodKey)}
                    >
                      {moodLabels[moodKey]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="yukon-progress-hud">
                <div className="yukon-ring-wrap">
                  <svg
                    className="yukon-ring-svg"
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    aria-hidden="true"
                  >
                    <circle className="yukon-ring-track" cx="20" cy="20" r={RING_RADIUS} fill="none" />
                    <circle
                      ref={ringFillRef}
                      id="yukonRingFill"
                      className="yukon-ring-fill"
                      cx="20"
                      cy="20"
                      r={RING_RADIUS}
                      fill="none"
                      strokeDasharray={RING_CIRCUMFERENCE.toFixed(2)}
                      strokeDashoffset={RING_CIRCUMFERENCE.toFixed(2)}
                    />
                  </svg>
                  <span id="yukonStepBadge" className="yukon-step-badge">
                    {stepBadgeText}
                  </span>
                </div>
                <button
                  id="yukonMoodLabel"
                  className="yukon-mood-label"
                  type="button"
                  onClick={handleCycleMood}
                  title="Alternar momento atmosférico em Yukon"
                >
                  {moodLabels[mood]}
                </button>
                <span className="sr-only" aria-live="polite">
                  {moodAnnouncement}
                </span>
              </div>
            </div>
          </div>

          {/* Dock Inferior de Cards Translúcidos Incorporados à Imagem de Yukon */}
          <div className="yukon-dock-wrap">
            {/* Seletor compacto mobile para navegar rapidamente entre os 4 marcos */}
            <div className="yukon-mobile-tabs" role="group" aria-label="Selecionar etapa em Yukon">
              {chapters.map((chapter, idx) => {
                const isActive = idx === activeIdx;
                const stepLabel = String(idx + 1).padStart(2, '0');
                return (
                  <button
                    key={`tab-${chapter.id ?? chapter.index ?? idx}`}
                    type="button"
                    aria-pressed={isActive}
                    aria-label={`Etapa ${stepLabel}: ${chapter.title}`}
                    className={`yukon-mobile-tab${isActive ? ' is-active' : ''}`}
                    onClick={() => handleSelectChapter(idx, true)}
                  >
                    {stepLabel}
                  </button>
                );
              })}
            </div>

            <div className="yukon-chapters" aria-label="Marcos da jornada em Yukon">
              {chapters.map((chapter, idx) => {
                const isActive = idx === activeIdx;
                const isLast = idx === chapters.length - 1;
                const kickerText =
                  chapter.kicker ?? chapter.tag ?? `${String(idx + 1).padStart(2, '0')}`;

                return (
                  <motion.article
                    key={chapter.id ?? chapter.index ?? chapter.title}
                    className={`yukon-chapter${isActive ? ' is-active' : ''}`}
                    data-yukon-chapter={idx}
                    aria-current={isActive ? 'step' : undefined}
                    initial={false}
                    animate={{
                      opacity: 1,
                      y: isActive || motionPaused ? 0 : 3,
                    }}
                    transition={{
                      duration: motionPaused ? 0 : 0.34,
                      ease: [0.2, 0, 0, 1],
                    }}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest('a, button')) return;
                      handleSelectChapter(idx, true);
                    }}
                  >
                    <div className="yukon-chapter-top">
                      <span className="yukon-chapter-kicker">{kickerText}</span>
                      <span className="yukon-chapter-pulse" aria-hidden="true" />
                    </div>

                    <h3 className="yukon-chapter-title">
                      <button
                        type="button"
                        className="yukon-chapter-trigger"
                        aria-pressed={isActive}
                        onClick={() => handleSelectChapter(idx, true)}
                      >
                        {chapter.title}
                      </button>
                    </h3>

                    <p className="yukon-chapter-body">{chapter.body}</p>

                    {isLast && isActive && (
                      <div className="yukon-chapter-actions">
                        <a
                          href={chapter.ctaHref ?? '/extensoes/'}
                          className="btn btn-tonal btn-sm"
                        >
                          {chapter.ctaLabel ?? 'Explorar Extensões →'}
                        </a>
                      </div>
                    )}
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
