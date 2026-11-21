import { useCallback, useEffect, useState } from 'react';
import { syncFavicon } from '../scripts/theme-favicon';

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

function getSystemMode(): ModeId {
  if (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }
  return 'light';
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
      : typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? getSystemMode()
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
    syncFavicon(resolvedSeed, resolvedMode);
  }, []);

  useEffect(() => {
    syncFromStorageAndDom();

    const handleAfterSwap = () => {
      syncFromStorageAndDom();
    };

    document.addEventListener('astro:after-swap', handleAfterSwap);

    let mediaQuery: MediaQueryList | null = null;
    const handleSystemModeChange = (event: MediaQueryListEvent) => {
      if (isModeId(safeGetStorage('yuko_mode'))) return;
      const nextMode: ModeId = event.matches ? 'dark' : 'light';
      const storedSeed = safeGetStorage('yuko_seed');
      const attrSeed = document.documentElement.getAttribute('data-seed');
      const resolvedSeed: SeedId = isSeedId(storedSeed)
        ? storedSeed
        : isSeedId(attrSeed)
          ? attrSeed
          : 'terracota';

      document.documentElement.setAttribute('data-mode', nextMode);
      setMode(nextMode);
      syncFavicon(resolvedSeed, nextMode);
    };

    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', handleSystemModeChange);
      }
    }

    return () => {
      document.removeEventListener('astro:after-swap', handleAfterSwap);
      if (mediaQuery && typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', handleSystemModeChange);
      }
    };
  }, [syncFromStorageAndDom]);

  const handleSelectSeed = (nextSeed: SeedId, label: string) => {
    if (typeof document === 'undefined') return;
    const prev = document.documentElement.getAttribute('data-seed');
    document.documentElement.setAttribute('data-seed', nextSeed);
    safeSetStorage('yuko_seed', nextSeed);
    setSeed(nextSeed);
    syncFavicon(nextSeed, mode);
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
    syncFavicon(seed, nextMode);
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

  const motionLabel = motionMode === 'expressive' ? 'Mola' : 'Calmo';

  return (
    <div className="bar-controls">
      <div className="seed-dots" role="group" aria-label="Semente de cor dinâmica">
        {seeds.map((item) => {
          const isSelected = seed === item.id;
          return (
            <button
              key={item.id}
              className="seed-dot"
              type="button"
              data-seed={item.id}
              aria-pressed={isSelected}
              title={item.label}
              aria-label={`Tema ${item.label}`}
              style={{ backgroundColor: item.swatch }}
              onClick={() => handleSelectSeed(item.id, item.label)}
            />
          );
        })}
      </div>

      <button
        id="modeToggleBtn"
        className="icon-btn"
        type="button"
        aria-label="Alternar modo claro e escuro"
        title="Alternar Claro/Escuro"
        aria-pressed={mode === 'dark'}
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
      </button>

      <button
        id="motionToggleBtn"
        className="motion-toggle-btn"
        type="button"
        aria-pressed={motionMode === 'calm'}
        aria-label={`${motionLabel} — alternar física de movimento`}
        title={
          motionMode === 'expressive'
            ? 'Física: Mola Expressiva (clique para Calmo)'
            : 'Física: Linear Calmo (clique para Mola)'
        }
        onClick={handleToggleMotion}
      >
        {motionLabel}
      </button>
    </div>
  );
}
