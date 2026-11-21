import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

export type GlossaryCardTone =
  | 'default'
  | 'tonal-primary'
  | 'tonal-secondary'
  | 'tonal-tertiary'
  | 'primary'
  | 'secondary'
  | 'tertiary';

export interface GlossaryTerm {
  term: string;
  definition: string;
  tone?: GlossaryCardTone;
}

export interface GlossaryExplorerProps {
  terms: GlossaryTerm[];
}

export default function GlossaryExplorer({ terms }: GlossaryExplorerProps) {
  const [query, setQuery] = useState('');
  const [isCalm, setIsCalm] = useState(false);
  const prefersReducedMotion = useReducedMotion();

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

  const trimmed = query.trim();
  const normalizedQuery = trimmed.toLowerCase();

  const filteredTerms = useMemo(() => {
    if (!normalizedQuery) return terms;
    return terms.filter(
      (item) =>
        item.term.toLowerCase().includes(normalizedQuery) ||
        item.definition.toLowerCase().includes(normalizedQuery)
    );
  }, [terms, normalizedQuery]);

  const count = filteredTerms.length;
  const empty = count === 0;

  const statusText = !trimmed
    ? `${count} ${count === 1 ? 'termo exibido' : 'termos exibidos'}.`
    : `${count} ${count === 1 ? 'termo encontrado' : 'termos encontrados'} para "${trimmed}".`;

  const disableSpring = Boolean(prefersReducedMotion) || isCalm;
  const cardTransition = disableSpring
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 380, damping: 30 };

  return (
    <div className="glossary-explorer">
      <div style={{ marginBottom: '18px' }}>
        <input
          id="glossarySearch"
          className="search-pill"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filtrar termos do glossário (ex: Peer, DoD, Issue)..."
          aria-label="Filtrar termos do glossário"
        />
      </div>

      <p id="glossaryStatus" className="glossary-status" aria-live="polite">
        {statusText}
      </p>

      <div className="grid-2">
        <AnimatePresence initial={false}>
          {filteredTerms.map((item) => {
            const toneClass =
              item.tone && item.tone !== 'default'
                ? item.tone.startsWith('tonal-')
                  ? ` ${item.tone}`
                  : ` tonal-${item.tone}`
                : '';

            return (
              <motion.article
                key={item.term}
                layout={!disableSpring}
                initial={disableSpring ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
                animate={disableSpring ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                exit={disableSpring ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
                transition={cardTransition}
                className={`m3-card${toneClass}`}
                data-glossary-item="true"
              >
                <h3>{item.term}</h3>
                <p>{item.definition}</p>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>

      <div id="glossaryEmpty" className="m3-card glossary-empty" hidden={!empty}>
        <h3>Nenhum termo encontrado</h3>
        <p>Tente buscar por outra palavra-chave do manual.</p>
      </div>
    </div>
  );
}
