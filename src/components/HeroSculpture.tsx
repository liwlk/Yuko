import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
} from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const HERO_SPRING = { stiffness: 180, damping: 24, mass: 0.6 };

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export default function HeroSculpture() {
  const cardRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isCalm, setIsCalm] = useState(false);

  const rawMx = useMotionValue(0);
  const rawMy = useMotionValue(0);
  const rawScroll = useMotionValue(0);

  const smoothMx = useSpring(rawMx, HERO_SPRING);
  const smoothMy = useSpring(rawMy, HERO_SPRING);
  const smoothScroll = useSpring(rawScroll, HERO_SPRING);

  const rawPointerRef = useRef({ mx: 0, my: 0 });
  const lastScrollProgressRef = useRef(0);

  const writeCssVar = useCallback((name: string, value: number) => {
    const formatted = value.toFixed(4);
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty(name, formatted);
    const heroEl = card.closest<HTMLElement>('.hero');
    if (heroEl) {
      heroEl.style.setProperty(name, formatted);
    }
  }, []);

  useMotionValueEvent(smoothMx, 'change', (v) => {
    writeCssVar('--hero-mx', v);
  });

  useMotionValueEvent(smoothMy, 'change', (v) => {
    writeCssVar('--hero-my', v);
  });

  useMotionValueEvent(smoothScroll, 'change', (v) => {
    writeCssVar('--hero-scroll', v);
  });

  const getAmplitude = useCallback(() => {
    if (prefersReducedMotion) return 0;
    if (typeof document !== 'undefined' && document.documentElement.getAttribute('data-motion') === 'calm') {
      return 0.35;
    }
    return 1;
  }, [prefersReducedMotion]);

  const syncTargets = useCallback(() => {
    const amp = getAmplitude();
    if (amp === 0) {
      rawMx.set(0);
      rawMy.set(0);
      rawScroll.set(0);
      writeCssVar('--hero-mx', 0);
      writeCssVar('--hero-my', 0);
      writeCssVar('--hero-scroll', 0);
      return;
    }

    rawMx.set(rawPointerRef.current.mx * amp);
    rawMy.set(rawPointerRef.current.my * amp);
    rawScroll.set(lastScrollProgressRef.current * amp);
  }, [getAmplitude, rawMx, rawMy, rawScroll, writeCssVar]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const syncMotionAttr = () => {
      const calm = document.documentElement.getAttribute('data-motion') === 'calm';
      setIsCalm(calm);
      syncTargets();
    };

    syncMotionAttr();

    const cardEl = cardRef.current;
    const triggerEl = cardEl?.closest<HTMLElement>('.hero') ?? cardEl;

    let stInstance: ScrollTrigger | null = null;

    if (triggerEl) {
      try {
        gsap.registerPlugin(ScrollTrigger);
        stInstance = ScrollTrigger.create({
          trigger: triggerEl,
          start: 'top top',
          end: 'bottom top',
          onUpdate: (self) => {
            lastScrollProgressRef.current = clamp(self.progress, 0, 1);
            const amp = getAmplitude();
            rawScroll.set(amp === 0 ? 0 : lastScrollProgressRef.current * amp);
          },
        });
      } catch {
        // Fallback safely in headless/JSDOM environments
      }
    }

    const handleNativeScroll = () => {
      if (!triggerEl) return;
      const rect = triggerEl.getBoundingClientRect();
      const progress = clamp(window.scrollY / Math.max(1, rect.height), 0, 1);
      lastScrollProgressRef.current = progress;
      const amp = getAmplitude();
      rawScroll.set(amp === 0 ? 0 : progress * amp);
    };

    const handleResetPointer = () => {
      rawPointerRef.current = { mx: 0, my: 0 };
      rawMx.set(0);
      rawMy.set(0);
    };

    window.addEventListener('scroll', handleNativeScroll, { passive: true });
    window.addEventListener('blur', handleResetPointer);
    window.addEventListener('yuko:motion-change', syncMotionAttr);
    document.addEventListener('astro:after-swap', syncMotionAttr);

    return () => {
      stInstance?.kill();
      window.removeEventListener('scroll', handleNativeScroll);
      window.removeEventListener('blur', handleResetPointer);
      window.removeEventListener('yuko:motion-change', syncMotionAttr);
      document.removeEventListener('astro:after-swap', syncMotionAttr);
    };
  }, [getAmplitude, rawMx, rawMy, rawScroll, syncTargets]);

  const handlePointerMove = (e: PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion || e.pointerType === 'touch') return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const mx = clamp(((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1, -1, 1);
    const my = clamp(((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1, -1, 1);
    rawPointerRef.current = { mx, my };
    const amp = getAmplitude();
    rawMx.set(mx * amp);
    rawMy.set(my * amp);
  };

  const handlePointerLeave = () => {
    rawPointerRef.current = { mx: 0, my: 0 };
    rawMx.set(0);
    rawMy.set(0);
  };

  const disableCardHover = Boolean(prefersReducedMotion) || isCalm;

  return (
    <motion.aside
      ref={cardRef}
      className="hero-art-card"
      aria-label="Ilustração institucional da Yuko"
      whileHover={disableCardHover ? undefined : { y: -4 }}
      transition={{ type: 'spring', stiffness: 360, damping: 28 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
    >
      <figure className="hero-art-frame">
        <svg
          viewBox="0 0 640 480"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Composição visual simbolizando arquitetura modular, revisão por pares e sustentação coletiva da Yuko"
        >
          <defs>
            <linearGradient
              id="heroBgGrad"
              x1="0"
              y1="0"
              x2="640"
              y2="480"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="var(--md-surface-container-low)" />
              <stop
                offset="100%"
                stopColor="var(--md-primary-container)"
                stopOpacity="0.52"
              />
            </linearGradient>
            <linearGradient
              id="heroOrbGrad"
              x1="180"
              y1="90"
              x2="460"
              y2="390"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="var(--md-primary-container)" />
              <stop offset="100%" stopColor="var(--md-secondary-container)" />
            </linearGradient>
          </defs>

          <rect width="640" height="480" fill="url(#heroBgGrad)" />

          {/* Subtle Architectural Arches */}
          <path
            className="hero-arch-left"
            d="M52 480V228C52 162 106 108 172 108C238 108 292 162 292 228V480H52Z"
            fill="var(--md-surface-container-highest)"
            opacity="0.58"
          />
          <path
            className="hero-arch-right"
            d="M348 480V172C348 112 397 64 457 64C517 64 566 112 566 172V480H348Z"
            fill="var(--md-secondary-container)"
            opacity="0.56"
          />

          {/* Soft Organic Base Horizon */}
          <path
            d="M0 374C135 344 240 398 370 372C485 348 560 326 640 342V480H0V374Z"
            fill="var(--md-surface-container-lowest)"
            opacity="0.88"
          />
          <path
            d="M0 416C150 388 290 440 435 412C530 394 590 382 640 392V480H0V416Z"
            fill="var(--md-secondary-container)"
            opacity="0.52"
          />

          {/* Central 12-Petal Scalloped Medallion */}
          <g transform="translate(320 228)">
            <path
              className="hero-medallion-petals"
              d="M0 -132C18 -132 29 -111 46 -106C63 -101 82 -115 95 -102C108 -89 94 -70 99 -53C104 -36 125 -25 125 -7C125 11 104 22 99 39C94 56 108 75 95 88C82 101 63 87 46 92C29 97 18 118 0 118C-18 118 -29 97 -46 92C-63 87 -82 101 -95 88C-108 75 -94 56 -99 39C-104 22 -125 11 -125 -7C-125 -25 -104 -36 -99 -53C-94 -70 -108 -89 -95 -102C-82 -115 -63 -101 -46 -106C-29 -111 -18 -132 0 -132Z"
              fill="url(#heroOrbGrad)"
              opacity="0.92"
            />
            <circle
              cx="0"
              cy="-7"
              r="76"
              fill="var(--md-surface-container-lowest)"
              stroke="var(--md-outline-variant)"
              strokeWidth="1.5"
            />
            <circle cx="0" cy="-7" r="52" fill="var(--md-primary)" />
            {/* Stylized Yuko Core Node Geometry */}
            <circle cx="0" cy="-7" r="14" fill="var(--md-on-primary)" />
            <path
              d="M0 -42V-25M0 11V28M-35 -7H-18M18 -7H35M-24 -31L-12 -19M12 5L24 17M24 -31L12 -19M-12 5L-24 17"
              stroke="var(--md-on-primary)"
              strokeWidth="5.5"
              strokeLinecap="round"
            />
          </g>

          {/* Interlocking 3-Stage Peer Review & Support Circuit */}
          <path
            className="hero-circuit-lines"
            d="M168 182C210 182 222 221 258 221M472 152C428 152 414 221 382 221M320 342V376"
            stroke="var(--md-primary)"
            strokeWidth="3"
            strokeDasharray="6 6"
            strokeLinecap="round"
            opacity="0.65"
          />

          {/* Left Card: Executor / Escopo */}
          <g transform="translate(86 134)">
            <g className="hero-card-executor">
              <rect
                width="108"
                height="92"
                rx="24"
                fill="var(--md-surface-container-lowest)"
                stroke="var(--md-outline-variant)"
                strokeWidth="1.5"
              />
              <rect
                x="18"
                y="20"
                width="38"
                height="12"
                rx="6"
                fill="var(--md-primary-container)"
              />
              <rect
                x="18"
                y="42"
                width="72"
                height="10"
                rx="5"
                fill="var(--md-surface-container-highest)"
              />
              <rect
                x="18"
                y="60"
                width="52"
                height="10"
                rx="5"
                fill="var(--md-surface-container-highest)"
              />
              <circle cx="84" cy="26" r="8" fill="var(--md-primary)" />
            </g>
          </g>

          {/* Right Card: 2+ Pares Revisores */}
          <g transform="translate(446 106)">
            <g className="hero-card-reviewers">
              <rect
                width="112"
                height="94"
                rx="24"
                fill="var(--md-tertiary-container)"
                stroke="var(--md-outline-variant)"
                strokeWidth="1.5"
              />
              <circle cx="34" cy="38" r="13" fill="var(--md-tertiary)" />
              <circle cx="56" cy="38" r="13" fill="var(--md-primary)" />
              <rect
                x="20"
                y="62"
                width="72"
                height="12"
                rx="6"
                fill="var(--md-surface-container-lowest)"
                opacity="0.88"
              />
            </g>
          </g>

          {/* Bottom Pill: Sustentação & Entrega Registrada */}
          <g transform="translate(216 364)">
            <g className="hero-pill-support">
              <rect
                width="208"
                height="58"
                rx="29"
                fill="var(--md-secondary-container)"
                stroke="var(--md-outline-variant)"
                strokeWidth="1.5"
              />
              <circle cx="30" cy="29" r="14" fill="var(--md-primary)" />
              <path
                d="M24 29L28 33L36 25"
                stroke="var(--md-on-primary)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="58"
                y="20"
                width="120"
                height="8"
                rx="4"
                fill="var(--md-on-secondary-container)"
                opacity="0.72"
              />
              <rect
                x="58"
                y="34"
                width="84"
                height="7"
                rx="3.5"
                fill="var(--md-on-secondary-container)"
                opacity="0.4"
              />
            </g>
          </g>
        </svg>
      </figure>
      <div className="hero-art-caption">
        <span>Engenharia colaborativa · Revisão cruzada por pares</span>
        <a href="/extensoes/" className="studio-badge">
          Yuko Dev &amp; Make
        </a>
      </div>
    </motion.aside>
  );
}
