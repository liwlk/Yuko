import { useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export type SeedId = 'terracota' | 'botanico' | 'oceanico' | 'ameixa';
export type ModeId = 'light' | 'dark';
export type MotionMode = 'expressive' | 'calm';

export interface ThemeSeedOption {
  id: SeedId;
  label: string;
  swatch: string;
}

export interface ThemeControlsProps {
  seeds: ThemeSeedOption[];
}

const ALLOWED_SEEDS = new Set<string>(['terracota', 'botanico', 'oceanico', 'ameixa']);
const ALLOWED_MODES = new Set<string>(['light', 'dark']);
const ALLOWED_MOTIONS = new Set<string>(['expressive', 'calm']);

function isSeedId(val: string | null): val is SeedId {
  return val !== null && ALLOWED_SEEDS.has(val);
}

function isModeId(val: string | null): val is ModeId {
  return val !== null && ALLOWED_MODES.has(val);
}

function isMotionMode(val: string | null): val is MotionMode {
  return val !== null && ALLOWED_MOTIONS.has(val);
}

function safeGetStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage quota or privacy mode errors
  }
}

function dispatchToast(detail: string): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<string>('yuko:toast', { detail }));
}

function dispatchMotionChange(detail: MotionMode): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<MotionMode>('yuko:motion-change', { detail }));
}

export default function ThemeControls({ seeds }: ThemeControlsProps) {
  const prefersReducedMotion = useReducedMotion();
  const [seed, setSeed] = useState<SeedId>('terracota');
  const [mode, setMode] = useState<ModeId>('light');
  const [motionMode, setMotionMode] = useState<MotionMode>('expressive');

  const syncFromStorageAndDom = useCallback(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    const storedSeed = safeGetStorage('yuko_seed');
    const storedMode = safeGetStorage('yuko_mode');
    const storedMotion = safeGetStorage('yuko_motion');

    const attrSeed = root.getAttribute('data-seed');
    const attrMode = root.getAttribute('data-mode');
    const attrMotion = root.getAttribute('data-motion');

    const resolvedSeed: SeedId = isSeedId(storedSeed)
      ? storedSeed
      : isSeedId(attrSeed)
        ? attrSeed
        : 'terracota';

    const resolvedMode: ModeId = isModeId(storedMode)
      ? storedMode
      : isModeId(attrMode)
        ? attrMode
        : 'light';

    const resolvedMotion: MotionMode = isMotionMode(storedMotion)
      ? storedMotion
      : isMotionMode(attrMotion)
        ? attrMotion
        : 'expressive';

    root.setAttribute('data-seed', resolvedSeed);
    root.setAttribute('data-mode', resolvedMode);
    root.setAttribute('data-motion', resolvedMotion);

    setSeed(resolvedSeed);
    setMode(resolvedMode);
    setMotionMode(resolvedMotion);
  }, []);

  useEffect(() => {
    syncFromStorageAndDom();

    const handleAfterSwap = () => {
      syncFromStorageAndDom();
    };

    document.addEventListener('astro:after-swap', handleAfterSwap);
    return () => {
      document.removeEventListener('astro:after-swap', handleAfterSwap);
    };
  }, [syncFromStorageAndDom]);

  const handleSelectSeed = (nextSeed: SeedId, label: string) => {
    if (typeof document === 'undefined') return;
    const prev = document.documentElement.getAttribute('data-seed');
    document.documentElement.setAttribute('data-seed', nextSeed);
    safeSetStorage('yuko_seed', nextSeed);
    setSeed(nextSeed);
    if (prev !== nextSeed) {
      dispatchToast(`Tema: ${label}`);
    }
  };

  const handleToggleMode = () => {
    if (typeof document === 'undefined') return;
    const nextMode: ModeId = mode === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-mode', nextMode);
    safeSetStorage('yuko_mode', nextMode);
    setMode(nextMode);
    dispatchToast(nextMode === 'dark' ? 'Modo Escuro ativado' : 'Modo Claro ativado');
  };

  const handleToggleMotion = () => {
    if (typeof document === 'undefined') return;
    const nextMotion: MotionMode = motionMode === 'expressive' ? 'calm' : 'expressive';
    document.documentElement.setAttribute('data-motion', nextMotion);
    safeSetStorage('yuko_motion', nextMotion);
    setMotionMode(nextMotion);
    dispatchMotionChange(nextMotion);
    dispatchToast(
      nextMotion === 'expressive' ? 'Física: Mola Expressiva' : 'Física: Linear Calmo'
    );
  };

  const disableSpring = Boolean(prefersReducedMotion) || motionMode === 'calm';
  const springTransition = disableSpring
    ? { duration: 0.16 }
    : { type: 'spring' as const, stiffness: 460, damping: 26 };

  return (
    <div className="bar-controls">
      <div className="seed-dots" role="group" aria-label="Semente de cor dinâmica">
        {seeds.map((item) => {
          const isSelected = seed === item.id;
          return (
            <motion.button
              key={item.id}
              className="seed-dot"
              type="button"
              data-seed={item.id}
              aria-pressed={isSelected}
              title={item.label}
              aria-label={`Tema ${item.label}`}
              style={{ backgroundColor: item.swatch }}
              whileHover={disableSpring ? undefined : { scale: 1.15 }}
              whileTap={disableSpring ? undefined : { scale: 0.92 }}
              transition={springTransition}
              onClick={() => handleSelectSeed(item.id, item.label)}
            />
          );
        })}
      </div>

      <motion.button
        id="modeToggleBtn"
        className="icon-btn"
        type="button"
        aria-label="Alternar modo claro e escuro"
        title="Alternar Claro/Escuro"
        aria-pressed={mode === 'dark'}
        whileHover={disableSpring ? undefined : { scale: 1.06 }}
        whileTap={disableSpring ? undefined : { scale: 0.92 }}
        transition={springTransition}
        onClick={handleToggleMode}
      >
        {mode === 'dark' ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        )}
      </motion.button>

      <motion.button
        id="motionToggleBtn"
        className="motion-toggle-btn"
        type="button"
        aria-pressed={motionMode === 'calm'}
        aria-label="Alternar física de movimento entre Mola e Calmo"
        title={
          motionMode === 'expressive'
            ? 'Física: Mola Expressiva (clique para Calmo)'
            : 'Física: Linear Calmo (clique para Mola)'
        }
        whileHover={disableSpring ? undefined : { scale: 1.04 }}
        whileTap={disableSpring ? undefined : { scale: 0.94 }}
        transition={springTransition}
        onClick={handleToggleMotion}
        style={{
          height: '32px',
          padding: '0 10px',
          borderRadius: '9999px',
          border: '1px solid var(--md-outline-variant)',
          backgroundColor:
            motionMode === 'calm'
              ? 'var(--md-secondary-container)'
              : 'var(--md-surface-container-lowest)',
          color:
            motionMode === 'calm'
              ? 'var(--md-on-secondary-container)'
              : 'var(--md-on-surface-variant)',
          fontSize: '0.74rem',
          fontWeight: 700,
          letterSpacing: '0.01em',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {motionMode === 'expressive' ? 'Mola' : 'Calmo'}
      </motion.button>
    </div>
  );
}
