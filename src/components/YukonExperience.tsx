import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
const RING_RADIUS = 20;
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

function isReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function YukonExperience({ chapters, moodLabels }: YukonExperienceProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [mood, setMood] = useState<YukonMood>(() => getAutoMoodForIndex(0, chapters[0]));

  const scrollyRef = useRef<HTMLDivElement>(null);
  const panoramaRef = useRef<HTMLDivElement>(null);
  const ringFillRef = useRef<SVGCircleElement>(null);
  const chapterRefs = useRef<(HTMLElement | null)[]>([]);
  const intersectingMapRef = useRef<Map<number, IntersectionObserverEntry>>(new Map());
  const moodManuallyLockedRef = useRef(false);
  const clickLockUntilRef = useRef(0);

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

  const computeFallbackProgress = useCallback((): number => {
    const scrollyEl = scrollyRef.current;
    if (!scrollyEl || typeof window === 'undefined') return 0;
    const rect = scrollyEl.getBoundingClientRect();
    if (!rect.height) return 0;
    const vh = window.innerHeight || 800;
    const stickyTop = 88;
    const travel = rect.height - vh * 0.72;
    const raw =
      travel > 80
        ? (stickyTop - rect.top) / travel
        : (vh - rect.top) / Math.max(1, vh + rect.height);
    return clamp(raw, 0, 1);
  }, []);

  const updateActiveFromViewport = useCallback(
    (progressFallback?: number) => {
      if (!chapters.length || typeof window === 'undefined') return;
      if (typeof performance !== 'undefined' && performance.now() < clickLockUntilRef.current) {
        return;
      }

      const vh = window.innerHeight || 800;
      const focusY = vh * 0.42;
      let bestIdx: number | null = null;
      let bestDist = Infinity;

      intersectingMapRef.current.forEach((entry, idx) => {
        if (!entry.isIntersecting) return;
        const rect = entry.target.getBoundingClientRect();
        const center = rect.top + rect.height * 0.5;
        const dist = Math.abs(center - focusY);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = idx;
        }
      });

      if (bestIdx !== null) {
        activateChapter(bestIdx);
        return;
      }

      const p =
        typeof progressFallback === 'number' ? progressFallback : computeFallbackProgress();
      const fallbackIdx = clamp(Math.floor(p * chapters.length), 0, chapters.length - 1);
      activateChapter(fallbackIdx);
    },
    [activateChapter, chapters.length, computeFallbackProgress]
  );

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    applyProgress(0);
    const scrollyEl = scrollyRef.current;
    let stInstance: ScrollTrigger | null = null;
    let observer: IntersectionObserver | null = null;

    if (scrollyEl) {
      try {
        gsap.registerPlugin(ScrollTrigger);
        stInstance = ScrollTrigger.create({
          trigger: scrollyEl,
          start: 'top 88px',
          end: 'bottom 72%',
          onUpdate: (self) => {
            applyProgress(self.progress);
            updateActiveFromViewport(self.progress);
          },
        });
      } catch {
        // Safe fallback in JSDOM/headless environments without full layout metrics
      }
    }

    if (typeof IntersectionObserver !== 'undefined' && chapters.length > 0) {
      try {
        const intersectingMap = intersectingMapRef.current;
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const rawIdx = Number((entry.target as HTMLElement).dataset.yukonChapter);
              if (Number.isInteger(rawIdx)) {
                intersectingMap.set(rawIdx, entry);
              }
            });
            updateActiveFromViewport();
          },
          {
            root: null,
            rootMargin: '-22% 0px -35% 0px',
            threshold: [0, 0.2, 0.5, 0.8, 1],
          }
        );

        chapterRefs.current.forEach((el) => {
          if (el) observer?.observe(el);
        });
      } catch {
        // Safe fallback if IntersectionObserver is incomplete
      }
    }

    const handleNativeSync = () => {
      const p = computeFallbackProgress();
      applyProgress(p);
      updateActiveFromViewport(p);
    };

    window.addEventListener('scroll', handleNativeSync, { passive: true });
    window.addEventListener('resize', handleNativeSync, { passive: true });

    const intersectingSnapshot = intersectingMapRef.current;
    return () => {
      stInstance?.kill();
      observer?.disconnect();
      intersectingSnapshot.clear();
      window.removeEventListener('scroll', handleNativeSync);
      window.removeEventListener('resize', handleNativeSync);
    };
  }, [applyProgress, chapters.length, computeFallbackProgress, updateActiveFromViewport]);

  const handleSelectMood = (nextMood: YukonMood) => {
    moodManuallyLockedRef.current = true;
    setMood(nextMood);
  };

  const handleCycleMood = () => {
    const idx = MOOD_ORDER.indexOf(mood);
    const nextMood = MOOD_ORDER[(idx + 1) % MOOD_ORDER.length];
    handleSelectMood(nextMood);
  };

  const handleSelectChapter = (idx: number, shouldScroll = true) => {
    if (typeof performance !== 'undefined') {
      clickLockUntilRef.current = performance.now() + 650;
    }
    activateChapter(idx);
    const totalSteps = Math.max(1, chapters.length - 1);
    applyProgress(chapters.length > 1 ? idx / totalSteps : 0);

    if (shouldScroll) {
      const target = chapterRefs.current[idx];
      if (target && typeof target.scrollIntoView === 'function') {
        target.scrollIntoView({
          behavior: isReducedMotion() ? 'auto' : 'smooth',
          block: 'center',
        });
      }
    }
  };

  const totalCount = Math.max(chapters.length, 1);
  const stepBadgeText = `${String(activeIdx + 1).padStart(2, '0')} / ${String(totalCount).padStart(2, '0')}`;

  return (
    <div ref={scrollyRef} className="yukon-scrolly">
      {/* Coluna Esquerda: Palco Sticky Panorâmico */}
      <aside className="yukon-sticky-stage" aria-label="Cenário atmosférico de Yukon">
        <div
          ref={panoramaRef}
          id="yukonPanorama"
          className="yukon-panorama"
          data-yukon-mood={mood}
        >
          {/* Theme-Responsive Firewatch-Style Parallax Yukon SVG (6 camadas) */}
          <svg
            className="yukon-svg-bg"
            viewBox="0 0 1200 640"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="yukonSkyGrad"
                x1="0"
                y1="0"
                x2="0"
                y2="640"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="var(--md-surface-container-low)" />
                <stop
                  offset="50%"
                  stopColor="var(--md-primary-container)"
                  stopOpacity="0.58"
                />
                <stop offset="100%" stopColor="var(--md-surface-container)" />
              </linearGradient>
              <linearGradient
                id="yukonAuroraGrad"
                x1="0"
                y1="40"
                x2="1200"
                y2="290"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="var(--md-primary)" stopOpacity="0.06" />
                <stop offset="42%" stopColor="var(--md-primary)" stopOpacity="0.52" />
                <stop offset="76%" stopColor="var(--md-tertiary)" stopOpacity="0.42" />
                <stop offset="100%" stopColor="var(--md-primary)" stopOpacity="0.06" />
              </linearGradient>
              <linearGradient
                id="yukonRiverGrad"
                x1="600"
                y1="360"
                x2="600"
                y2="640"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="var(--md-primary-container)" />
                <stop offset="100%" stopColor="var(--md-surface-container)" />
              </linearGradient>
            </defs>

            {/* 1. Céu */}
            <rect width="1200" height="640" fill="url(#yukonSkyGrad)" />

            {/* 2. Estrelas (Noite Boreal) */}
            <g className="yukon-stars">
              <circle cx="110" cy="76" r="2.2" fill="var(--md-primary-container)" opacity="0.85" />
              <circle cx="218" cy="122" r="1.6" fill="var(--md-tertiary-container)" opacity="0.78" />
              <circle cx="334" cy="64" r="2.4" fill="var(--md-primary-container)" opacity="0.9" />
              <circle cx="468" cy="96" r="1.8" fill="var(--md-secondary-container)" opacity="0.72" />
              <circle cx="592" cy="54" r="2.6" fill="var(--md-tertiary-container)" opacity="0.88" />
              <circle cx="716" cy="108" r="1.7" fill="var(--md-primary-container)" opacity="0.76" />
              <circle cx="842" cy="68" r="2.3" fill="var(--md-primary-container)" opacity="0.85" />
              <circle cx="956" cy="134" r="1.8" fill="var(--md-tertiary-container)" opacity="0.8" />
              <circle cx="1078" cy="82" r="2.5" fill="var(--md-primary-container)" opacity="0.92" />
              <circle cx="164" cy="186" r="1.5" fill="var(--md-secondary-container)" opacity="0.68" />
              <circle cx="640" cy="148" r="1.6" fill="var(--md-primary-container)" opacity="0.74" />
              <circle cx="1020" cy="176" r="1.5" fill="var(--md-tertiary-container)" opacity="0.7" />
            </g>

            {/* 3. Aurora Boreal */}
            <g className="yukon-aurora">
              <path
                d="M-40 185C180 105 360 235 610 148C860 62 1010 205 1240 120V265C990 310 830 185 590 258C350 330 170 225 -40 280Z"
                fill="url(#yukonAuroraGrad)"
              />
              <path
                d="M80 125C290 70 470 165 730 98C940 44 1080 135 1220 88V175C1050 205 900 132 700 178C460 232 270 145 80 185Z"
                fill="url(#yukonAuroraGrad)"
                opacity="0.62"
              />
            </g>

            {/* 4. Sol Nórdico */}
            <g className="yukon-sun">
              <circle cx="740" cy="250" r="118" fill="var(--md-primary-container)" opacity="0.54" />
              <circle cx="740" cy="250" r="60" fill="var(--md-surface-container-lowest)" opacity="0.92" />
            </g>

            {/* 5. Nuvens & Névoa */}
            <g className="yukon-clouds">
              <path
                d="M60 232C115 212 185 214 238 232C280 218 345 224 388 242H30C40 238 50 235 60 232Z"
                fill="var(--md-surface-container-lowest)"
                opacity="0.48"
              />
              <path
                d="M810 198C872 174 958 176 1016 198C1068 182 1138 188 1185 210H772C786 205 798 201 810 198Z"
                fill="var(--md-surface-container-lowest)"
                opacity="0.42"
              />
              <path
                d="M0 356C220 336 410 368 640 350C860 334 1030 358 1200 344V392H0V356Z"
                fill="var(--md-surface-container-low)"
                opacity="0.34"
              />
            </g>

            {/* 6. Cordilheira Distante */}
            <path
              className="yukon-ridge-far"
              d="M0 370L130 264L255 328L410 222L565 322L735 236L895 316L1060 218L1200 298V640H0V370Z"
              fill="var(--md-secondary-container)"
              opacity="0.88"
            />

            {/* 7. Cordilheira Média */}
            <path
              className="yukon-ridge-mid"
              d="M0 412L165 304L310 382L475 278L645 378L810 286L995 364L1200 276V640H0V412Z"
              fill="var(--md-secondary)"
              opacity="0.54"
            />

            {/* 8. Vale e Rio Yukon */}
            <path
              d="M0 426C280 404 540 416 1200 404V640H0V426Z"
              fill="var(--md-surface-container-high)"
            />
            <path
              d="M685 410C620 428 740 454 630 482C505 512 730 546 585 590C525 608 490 626 475 640H775C810 600 710 562 745 522C782 478 675 450 725 410H685Z"
              fill="url(#yukonRiverGrad)"
              opacity="0.95"
            />

            {/* 9. Cordilheira Próxima */}
            <g className="yukon-ridge-near">
              <path
                d="M0 354L115 390L225 446L375 508L455 640H0V354Z"
                fill="var(--md-primary)"
                opacity="0.34"
              />
              <path
                d="M1200 338L1070 390L930 458L820 532L785 640H1200V338Z"
                fill="var(--md-primary)"
                opacity="0.42"
              />
              <path
                d="M0 512C175 478 320 542 480 588C680 642 930 530 1200 564V640H0V512Z"
                fill="var(--md-surface-container)"
              />
            </g>

            {/* 10. Silhueta de Pinheiros Boreais */}
            <g className="yukon-pines">
              <path
                d="M24 640V514L4 514L28 476L12 476L34 440L56 476L40 476L64 514L44 514V640Z"
                fill="var(--md-secondary)"
                opacity="0.72"
              />
              <path
                d="M74 640V544L56 544L78 510L64 510L84 478L104 510L90 510L112 544L94 544V640Z"
                fill="var(--md-primary)"
                opacity="0.58"
              />
              <path
                d="M134 640V562L118 562L138 532L126 532L144 504L162 532L150 532L170 562L154 562V640Z"
                fill="var(--md-secondary)"
                opacity="0.64"
              />
              <path
                d="M196 640V580L184 580L200 556L190 556L205 532L220 556L210 556L226 580L214 580V640Z"
                fill="var(--md-primary)"
                opacity="0.48"
              />
              <path
                d="M982 640V574L968 574L986 548L975 548L991 522L1007 548L996 548L1014 574L1000 574V640Z"
                fill="var(--md-primary)"
                opacity="0.52"
              />
              <path
                d="M1044 640V552L1026 552L1048 518L1034 518L1054 486L1074 518L1060 518L1082 552L1064 552V640Z"
                fill="var(--md-secondary)"
                opacity="0.68"
              />
              <path
                d="M1112 640V522L1090 522L1116 482L1098 482L1122 444L1146 482L1128 482L1154 522L1132 522V640Z"
                fill="var(--md-primary)"
                opacity="0.62"
              />
              <path
                d="M1168 640V548L1152 548L1172 516L1160 516L1178 488L1196 516L1184 516L1200 542V640Z"
                fill="var(--md-secondary)"
                opacity="0.76"
              />
            </g>
          </svg>

          <div className="yukon-sky-scrim" aria-hidden="true" />

          <div className="yukon-header-row">
            <div className="yukon-intro">
              <span className="yukon-kicker">Yukon, Canadá</span>
              <h2 id="yukonHeading" className="yukon-title">
                Experiência em Yukon: resiliência em território aberto
              </h2>
              <p className="yukon-lead">
                A origem do nome Yuko reflete o horizonte canadense de Yukon — vastidão exploratória, sobriedade e software sólido para ambientes reais.
              </p>
            </div>

            <div className="yukon-mood-switch">
              <div
                className="connected-group"
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
          </div>

          <div className="yukon-progress-hud">
            <div className="yukon-ring-wrap">
              <svg
                className="yukon-ring-svg"
                width="48"
                height="48"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <circle className="yukon-ring-track" cx="24" cy="24" r="20" fill="none" />
                <circle
                  ref={ringFillRef}
                  id="yukonRingFill"
                  className="yukon-ring-fill"
                  cx="24"
                  cy="24"
                  r="20"
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
              aria-live="polite"
              onClick={handleCycleMood}
            >
              {moodLabels[mood]}
            </button>
          </div>
        </div>
      </aside>

      {/* Coluna Direita: Capítulos em Scrollytelling */}
      <div className="yukon-chapters" aria-label="Marcos da jornada em Yukon">
        {chapters.map((chapter, idx) => {
          const isActive = idx === activeIdx;
          const isLast = idx === chapters.length - 1;
          const kickerText =
            chapter.kicker ?? chapter.tag ?? `${String(idx + 1).padStart(2, '0')}`;

          return (
            <article
              key={chapter.id ?? chapter.index ?? chapter.title}
              ref={(el) => {
                chapterRefs.current[idx] = el;
              }}
              className={`yukon-chapter${isActive ? ' is-active' : ''}`}
              data-yukon-chapter={idx}
              aria-current={isActive ? 'step' : undefined}
              onClick={(e) => {
                if ((e.target as HTMLElement).closest('a, button')) return;
                handleSelectChapter(idx, true);
              }}
            >
              <div className="yukon-chapter-meta">
                <span className="yukon-chapter-kicker">{kickerText}</span>
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

              {isLast && (
                <div className="yukon-chapter-actions">
                  <a
                    href={chapter.ctaHref ?? '/extensoes/'}
                    className="btn btn-tonal btn-sm"
                  >
                    {chapter.ctaLabel ?? 'Explorar Extensões →'}
                  </a>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
