import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export type SplitButtonItem = NavItem;

export interface SplitButtonProps {
  mainLabel: string;
  mainHref: string;
  items: SplitButtonItem[];
}

export default function SplitButton({ mainLabel, mainHref, items }: SplitButtonProps) {
  const uid = useId();
  const btnId = `splitMenuBtn-${uid}`;
  const menuId = `splitMenu-${uid}`;

  const [isOpen, setIsOpen] = useState(false);
  const [isCalm, setIsCalm] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const pendingFocusIdxRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const syncMotion = () => {
      setIsCalm(document.documentElement.getAttribute('data-motion') === 'calm');
    };
    syncMotion();
    window.addEventListener('yuko:motion-change', syncMotion);
    document.addEventListener('astro:after-swap', syncMotion);
    return () => {
      window.removeEventListener('yuko:motion-change', syncMotion);
      document.removeEventListener('astro:after-swap', syncMotion);
    };
  }, []);

  const closeMenu = useCallback((returnFocus = false) => {
    setIsOpen(false);
    pendingFocusIdxRef.current = null;
    if (returnFocus) {
      triggerRef.current?.focus();
    }
  }, []);

  const openMenu = useCallback((focusIndex: number | null = null) => {
    pendingFocusIdxRef.current = focusIndex;
    setIsOpen(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    if (pendingFocusIdxRef.current !== null && items.length > 0) {
      const targetIdx = Math.max(0, Math.min(items.length - 1, pendingFocusIdxRef.current));
      pendingFocusIdxRef.current = null;
      const rafId = window.requestAnimationFrame(() => {
        itemRefs.current[targetIdx]?.focus();
      });
      return () => window.cancelAnimationFrame(rafId);
    }
    return undefined;
  }, [isOpen, items.length]);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const container = containerRef.current;
      if (container && !container.contains(e.target as Node)) {
        closeMenu(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen, closeMenu]);

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!items.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (isOpen) {
        itemRefs.current[0]?.focus();
      } else {
        openMenu(0);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (isOpen) {
        itemRefs.current[items.length - 1]?.focus();
      } else {
        openMenu(items.length - 1);
      }
    } else if (e.key === 'Escape' && isOpen) {
      e.preventDefault();
      closeMenu(true);
    }
  };

  const handleMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!items.length) return;
    const activeEl = document.activeElement;
    const currentIdx = itemRefs.current.findIndex((el) => el === activeEl);

    if (e.key === 'Escape') {
      e.preventDefault();
      closeMenu(true);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = currentIdx >= 0 ? (currentIdx + 1) % items.length : 0;
      itemRefs.current[nextIdx]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIdx =
        currentIdx >= 0 ? (currentIdx - 1 + items.length) % items.length : items.length - 1;
      itemRefs.current[prevIdx]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      itemRefs.current[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      itemRefs.current[items.length - 1]?.focus();
    }
  };

  const handleContainerFocusOut = (e: FocusEvent<HTMLDivElement>) => {
    if (!isOpen) return;
    const next = e.relatedTarget as Node | null;
    if (!next || !containerRef.current?.contains(next)) {
      closeMenu(false);
    }
  };

  const disableSpring = Boolean(prefersReducedMotion) || isCalm;
  const menuTransition = disableSpring
    ? { duration: 0.14 }
    : { type: 'spring' as const, stiffness: 440, damping: 28, mass: 0.85 };

  return (
    <div
      ref={containerRef}
      className="split-btn"
      onBlur={handleContainerFocusOut}
    >
      <a href={mainHref} className="btn btn-primary split-btn-main">
        {mainLabel}
      </a>

      <button
        ref={triggerRef}
        id={btnId}
        className="btn btn-primary split-btn-side"
        type="button"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label="Abrir atalhos das subpáginas"
        onClick={(e) => {
          e.stopPropagation();
          if (isOpen) {
            closeMenu(false);
          } else {
            openMenu(null);
          }
        }}
        onKeyDown={handleTriggerKeyDown}
      >
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={menuTransition}
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={menuId}
            className="split-menu open"
            style={{ display: 'grid', animation: 'none', transformOrigin: 'top right' }}
            initial={disableSpring ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.94 }}
            animate={disableSpring ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={disableSpring ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.96 }}
            transition={menuTransition}
            onKeyDown={handleMenuKeyDown}
          >
            <ul
              aria-labelledby={btnId}
              style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '4px' }}
            >
              {items.map((item, idx) => (
                <li key={item.href + item.label}>
                  <a
                    ref={(el) => {
                      itemRefs.current[idx] = el;
                    }}
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    onClick={() => closeMenu(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
