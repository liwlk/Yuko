import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import {
  DISCORD_INVITE_URL,
  SIMULATOR_DEV_ROLE_META,
  SIMULATOR_EXTENSION_LABELS,
  SIMULATOR_SOLUTIONS,
  SIMULATOR_STAGES,
  SIMULATOR_STRESS_SCENARIOS,
  type SimulatorDevRole,
  type SimulatorPerspective,
  type SimulatorScopeSize,
  type SimulatorSituation,
  type SimulatorSolutionId,
  type SimulatorSolutionItem,
} from '../data/yuko';

export interface YukoOrderSimulatorProps {
  defaultPerspective?: SimulatorPerspective;
  headingId?: string;
}

interface EstimateResult {
  daysMin: number;
  daysMax: number;
  deadlineLabel: string;
  deadlineSublabel: string;
  priceMin: number;
  priceMax: number;
  priceLabel: string;
  scopeMultiplier: number;
  scopeNote: string;
  situationMultiplier: number;
  situationNote: string;
  lgpdMultiplier: number;
  lgpdExtraDays: number;
  lgpdNote: string;
  stageSplit: {
    discovery: string;
    build: string;
    reviewAndTests: string;
  };
}

const PERSPECTIVE_OPTIONS: ReadonlyArray<{ id: SimulatorPerspective; label: string }> = [
  { id: 'empresa', label: 'Sou Microempresa / Cliente' },
  { id: 'desenvolvedor', label: 'Sou Desenvolvedor' },
];

const SCOPE_OPTIONS: ReadonlyArray<{ id: SimulatorScopeSize; label: string }> = [
  { id: 'essencial', label: 'Essencial (mais rápido)' },
  { id: 'completo', label: 'Completo (rotina inteira)' },
];

const SITUATION_OPTIONS: ReadonlyArray<{ id: SimulatorSituation; label: string }> = [
  { id: 'zero', label: 'Começar do zero' },
  { id: 'existente', label: 'Melhorar algo que já tenho' },
  { id: 'resgate', label: 'Resgatar sistema parado' },
];

const DEV_ROLE_OPTIONS: ReadonlyArray<{ id: SimulatorDevRole; label: string }> = [
  { id: 'executor', label: 'Executor' },
  { id: 'revisor', label: 'Revisor (2+ colegas)' },
  { id: 'suporte', label: 'Suporte' },
];

function formatExtensionLabel(ext: string): string {
  return SIMULATOR_EXTENSION_LABELS[ext] ?? ext;
}

function formatExtensionTag(tag: string): string {
  return tag
    .split(' · ')
    .map((part) => formatExtensionLabel(part.trim()))
    .join(' · ');
}

function roundToNearestFifty(value: number): number {
  return Math.round(value / 50) * 50;
}

function formatBrl(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDaysRange(minDays: number, maxDays: number): { label: string; sublabel: string } {
  if (maxDays <= 15) {
    return {
      label: `${minDays} a ${maxDays} dias úteis`,
      sublabel: 'Estimativa em dias úteis de execução e revisão',
    };
  }
  const minWeeks = Math.max(1, Math.ceil(minDays / 5));
  const maxWeeks = Math.max(minWeeks, Math.ceil(maxDays / 5));
  return {
    label:
      minWeeks === maxWeeks
        ? `Cerca de ${minWeeks} ${minWeeks === 1 ? 'semana' : 'semanas'}`
        : `${minWeeks} a ${maxWeeks} semanas`,
    sublabel: `Aproximadamente ${minDays} a ${maxDays} dias úteis`,
  };
}

function formatSegmentDays(minDays: number, maxDays: number, ratio: number): string {
  const segMin = Math.max(1, Math.round(minDays * ratio));
  const segMax = Math.max(segMin, Math.round(maxDays * ratio));
  return segMin === segMax ? `${segMin} dia útil` : `${segMin} a ${segMax} dias úteis`;
}

function calculateEstimate(
  solution: SimulatorSolutionItem,
  scopeSize: SimulatorScopeSize,
  situation: SimulatorSituation,
  involvesClientData: boolean
): EstimateResult {
  const scopeMultiplier = scopeSize === 'essencial' ? 1.0 : 1.55;
  const scopeDaysMultiplier = scopeSize === 'essencial' ? 1.0 : 1.5;
  const scopeNote = scopeSize === 'essencial' ? 'Padrão' : '+55%';

  let situationMultiplier = 1.0;
  let situationDaysMultiplier = 1.0;
  let situationNote = 'Começar do zero (Padrão)';

  if (situation === 'existente') {
    situationMultiplier = 1.15;
    situationDaysMultiplier = 1.15;
    situationNote = 'Melhorar algo existente (+15%)';
  } else if (situation === 'resgate') {
    if (solution.id === 'resgate-sistema') {
      situationMultiplier = 1.0;
      situationDaysMultiplier = 1.0;
      situationNote = 'Resgate já incluído na base (Padrão)';
    } else {
      situationMultiplier = 1.25;
      situationDaysMultiplier = 1.25;
      situationNote = 'Resgatar sistema parado (+25%)';
    }
  }

  let lgpdMultiplier = 1.0;
  let lgpdExtraDays = 0;
  let lgpdNote = 'Só informações públicas (sem acréscimo)';

  if (involvesClientData) {
    if (solution.id === 'casa-em-ordem') {
      lgpdMultiplier = 1.0;
      lgpdExtraDays = 0;
      lgpdNote = 'LGPD já incluída na base (sem acréscimo)';
    } else if (solution.id === 'resgate-sistema') {
      lgpdMultiplier = 1.05;
      lgpdExtraDays = 3;
      lgpdNote = 'Proteção LGPD leve (+5%, +3 dias no prazo máximo)';
    } else {
      lgpdMultiplier = 1.1;
      lgpdExtraDays = 5;
      lgpdNote = 'Proteção LGPD ativa (+10%, +5 dias no prazo máximo)';
    }
  }

  const daysMin = Math.max(
    3,
    Math.round(solution.baseDaysMin * scopeDaysMultiplier * situationDaysMultiplier)
  );
  const daysMax = Math.max(
    daysMin + 2,
    Math.round(solution.baseDaysMax * scopeDaysMultiplier * situationDaysMultiplier) + lgpdExtraDays
  );

  const priceMin = roundToNearestFifty(
    solution.basePriceMin * scopeMultiplier * situationMultiplier * lgpdMultiplier
  );
  const priceMax = roundToNearestFifty(
    solution.basePriceMax * scopeMultiplier * situationMultiplier * lgpdMultiplier
  );

  const formattedDays = formatDaysRange(daysMin, daysMax);

  return {
    daysMin,
    daysMax,
    deadlineLabel: formattedDays.label,
    deadlineSublabel: formattedDays.sublabel,
    priceMin,
    priceMax,
    priceLabel: `${formatBrl(priceMin)} a ${formatBrl(priceMax)}`,
    scopeMultiplier,
    scopeNote,
    situationMultiplier,
    situationNote,
    lgpdMultiplier,
    lgpdExtraDays,
    lgpdNote,
    stageSplit: {
      discovery: formatSegmentDays(daysMin, daysMax, 0.2),
      build: formatSegmentDays(daysMin, daysMax, 0.5),
      reviewAndTests: formatSegmentDays(daysMin, daysMax, 0.3),
    },
  };
}

function SolutionIcon({ id }: { id: SimulatorSolutionId }) {
  const shared = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.9,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  };

  switch (id) {
    case 'site-presenca':
      return (
        <svg {...shared}>
          <rect x="3" y="4" width="18" height="16" rx="4" />
          <path d="M3 9h18" />
          <path d="M8 14h4" />
          <circle cx="16.5" cy="14" r="1.5" />
        </svg>
      );
    case 'agenda-pedidos':
      return (
        <svg {...shared}>
          <rect x="3.5" y="5" width="17" height="15.5" rx="3.5" />
          <path d="M8 3v4M16 3v4M3.5 10h17" />
          <path d="M8.5 14.5l2.2 2.2 4.8-4.5" />
        </svg>
      );
    case 'cadastro-rotina':
      return (
        <svg {...shared}>
          <rect x="4" y="4" width="7" height="7" rx="2" />
          <rect x="13" y="4" width="7" height="7" rx="2" />
          <rect x="4" y="13" width="7" height="7" rx="2" />
          <path d="M13.5 16.5h6M16.5 13.5v6" />
        </svg>
      );
    case 'automacao-ferramentas':
      return (
        <svg {...shared}>
          <circle cx="6.5" cy="7" r="2.5" />
          <circle cx="17.5" cy="7" r="2.5" />
          <circle cx="12" cy="17.5" r="2.5" />
          <path d="M9 7h6M7.8 9.2l3 6M16.2 9.2l-3 6" />
        </svg>
      );
    case 'casa-em-ordem':
      return (
        <svg {...shared}>
          <path d="M12 3l7 3v5.5c0 4.6-3 8.2-7 9.5-4-1.3-7-4.9-7-9.5V6l7-3z" />
          <path d="M9.2 12l2 2 3.8-4" />
        </svg>
      );
    case 'resgate-sistema':
      return (
        <svg {...shared}>
          <path d="M20 11a8 8 0 1 0-2.3 5.7" />
          <path d="M20 5v6h-6" />
          <path d="M9.5 12.2l1.8 1.8 3.5-3.6" />
        </svg>
      );
  }
}

export default function YukoOrderSimulator({
  defaultPerspective = 'empresa',
  headingId,
}: YukoOrderSimulatorProps) {
  const uid = useId().replace(/:/g, '');
  const [perspective, setPerspective] = useState<SimulatorPerspective>(defaultPerspective);
  const [solutionId, setSolutionId] = useState<SimulatorSolutionId>(
    SIMULATOR_SOLUTIONS[0]?.id ?? 'site-presenca'
  );
  const [scopeSize, setScopeSize] = useState<SimulatorScopeSize>('essencial');
  const [situation, setSituation] = useState<SimulatorSituation>('zero');
  const [involvesClientData, setInvolvesClientData] = useState<boolean>(false);
  const [devRole, setDevRole] = useState<SimulatorDevRole>('executor');
  const [activeStageStep, setActiveStageStep] = useState<number>(1);
  const [activeStressId, setActiveStressId] = useState<string | null>(null);
  const [isBreakdownOpen, setIsBreakdownOpen] = useState<boolean>(false);
  const [copiedRecently, setCopiedRecently] = useState<boolean>(false);

  const tabRefs = useRef<Record<SimulatorPerspective, HTMLButtonElement | null>>({
    empresa: null,
    desenvolvedor: null,
  });
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null && typeof window !== 'undefined') {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const selectedSolution = useMemo(() => {
    return (
      SIMULATOR_SOLUTIONS.find((item) => item.id === solutionId) ?? SIMULATOR_SOLUTIONS[0]
    );
  }, [solutionId]);

  const estimate = useMemo(() => {
    return calculateEstimate(selectedSolution, scopeSize, situation, involvesClientData);
  }, [selectedSolution, scopeSize, situation, involvesClientData]);

  const activeStage = useMemo(() => {
    return (
      SIMULATOR_STAGES.find((stage) => stage.step === activeStageStep) ?? SIMULATOR_STAGES[0]
    );
  }, [activeStageStep]);

  const activeStressScenario = useMemo(() => {
    if (!activeStressId) return null;
    return SIMULATOR_STRESS_SCENARIOS.find((item) => item.id === activeStressId) ?? null;
  }, [activeStressId]);

  const devRoleMeta = SIMULATOR_DEV_ROLE_META[devRole];

  const handleSelectSolution = (nextId: SimulatorSolutionId) => {
    setSolutionId(nextId);
    if (nextId === 'resgate-sistema') {
      setSituation('resgate');
    } else if (nextId === 'casa-em-ordem') {
      setInvolvesClientData(true);
    }
  };

  const handleTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, current: SimulatorPerspective) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End') {
      return;
    }
    e.preventDefault();
    const next: SimulatorPerspective =
      e.key === 'Home'
        ? 'empresa'
        : e.key === 'End'
          ? 'desenvolvedor'
          : current === 'empresa'
            ? 'desenvolvedor'
            : 'empresa';
    setPerspective(next);
    tabRefs.current[next]?.focus();
  };

  const scopeLabel =
    SCOPE_OPTIONS.find((item) => item.id === scopeSize)?.label ?? 'Essencial (mais rápido)';
  const situationLabel =
    SITUATION_OPTIONS.find((item) => item.id === situation)?.label ?? 'Começar do zero';
  const lgpdLabel = involvesClientData
    ? 'Sim, ativar proteção LGPD'
    : 'Não, só informações públicas';
  const profileLabel =
    perspective === 'empresa'
      ? 'Microempresa / Cliente'
      : `Desenvolvedor · ${devRoleMeta.label}`;

  const teamHeadline = '4+ membros';
  const teamSublabel = '1 Executor · 2+ Revisores · 1 Suporte';

  const clientNeedsList = useMemo(() => {
    if (!involvesClientData || selectedSolution.id === 'casa-em-ordem') {
      return selectedSolution.clientNeeds;
    }
    const filtered = selectedSolution.clientNeeds.filter(
      (item) => !/controladora|lgpd/i.test(item)
    );
    return [
      ...filtered,
      'Definição clara de quem responde pelos dados — sua empresa decide o uso como dona das informações e a equipe segue suas instruções (LGPD)',
    ];
  }, [selectedSolution, involvesClientData]);

  const summaryPlainText = useMemo(() => {
    const lines = [
      `PRÉ-FICHA SIMULADA · YUKO WORK`,
      `Perfil: ${profileLabel}`,
      `Pedido: ${selectedSolution.title} (${selectedSolution.shortTag})`,
      `Combinado: ${scopeLabel} · ${situationLabel}`,
      `Dados de clientes/equipe (LGPD): ${lgpdLabel}`,
      `Prazo estimado: ${estimate.deadlineLabel} (${estimate.deadlineSublabel})`,
      `Faixa de referência: ${estimate.priceLabel}`,
      `Equipe da comunidade: ${teamHeadline} (${teamSublabel})`,
      `Áreas Yuko: ${selectedSolution.extensions.map(formatExtensionLabel).join(' · ')}`,
      `Discord sugerido: ${selectedSolution.discordFocus}`,
      `Ressalva: Participação comunitária sem vínculo empregatício; quando comercial, os detalhes e valores são fechados em contrato direto entre você e quem executa, sem taxas ocultas.`,
    ];
    return lines.join('\n');
  }, [profileLabel, selectedSolution, scopeLabel, situationLabel, lgpdLabel, estimate]);

  const handleCopySummary = async () => {
    let copied = false;
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(summaryPlainText);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (!copied && typeof document !== 'undefined') {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = summaryPlainText;
        textarea.setAttribute('readonly', 'true');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.pointerEvents = 'none';
        document.body.appendChild(textarea);
        textarea.select();
        copied = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {
        copied = false;
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('yuko:toast', {
          detail: {
            message: copied
              ? 'Resumo copiado! Cole no Discord ou envie para alinhar seu pedido.'
              : 'Não foi possível copiar automaticamente. Selecione o texto da pré-ficha abaixo.',
          },
        })
      );

      if (copied) {
        setCopiedRecently(true);
        if (copyTimerRef.current !== null) {
          window.clearTimeout(copyTimerRef.current);
        }
        copyTimerRef.current = window.setTimeout(() => {
          setCopiedRecently(false);
        }, 2400);
      }
    }
  };

  const tabIdEmpresa = `sim-tab-empresa-${uid}`;
  const tabIdDev = `sim-tab-dev-${uid}`;
  const panelId = `sim-workspace-${uid}`;
  const breakdownPanelId = `sim-breakdown-panel-${uid}`;
  const stagePanelId = `sim-stage-panel-${uid}`;

  return (
    <div className="sim-shell" aria-labelledby={headingId}>
      {/* 1. Cabeçalho & Seletor de Papel */}
      <div className="sim-top-bar">
        <span className="sim-top-label">Escolha quem está testando</span>

        <div
          className="sim-perspective-switch"
          role="tablist"
          aria-label="Escolha quem está testando"
        >
          {PERSPECTIVE_OPTIONS.map((opt) => {
            const isSelected = perspective === opt.id;
            const tabId = opt.id === 'empresa' ? tabIdEmpresa : tabIdDev;
            return (
              <button
                key={opt.id}
                ref={(el) => {
                  tabRefs.current[opt.id] = el;
                }}
                id={tabId}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls={panelId}
                tabIndex={isSelected ? 0 : -1}
                className={`sim-perspective-btn${isSelected ? ' is-active' : ''}`}
                onClick={() => setPerspective(opt.id)}
                onKeyDown={(e) => handleTabKeyDown(e, opt.id)}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Grid Principal 2 Colunas */}
      <div
        id={panelId}
        className="sim-workspace"
        role="tabpanel"
        aria-labelledby={perspective === 'empresa' ? tabIdEmpresa : tabIdDev}
      >
        {/* Coluna Esquerda — Configurar Pedido / Atuação */}
        <div className="sim-controls">
          <section className="sim-step-block" aria-labelledby={`sim-step1-${uid}`}>
            <h3 id={`sim-step1-${uid}`} className="sim-step-title">
              Passo 1 — O que você quer testar na prática?
            </h3>

            <div className="sim-solutions-grid" role="group" aria-label="Tipos de pedido na Yuko">
              {SIMULATOR_SOLUTIONS.map((item) => {
                const isSelected = item.id === solutionId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={isSelected}
                    className={`sim-solution-card${isSelected ? ' is-selected' : ''}`}
                    onClick={() => handleSelectSolution(item.id)}
                  >
                    <div className="sim-solution-head">
                      <span className="sim-solution-icon" aria-hidden="true">
                        <SolutionIcon id={item.id} />
                      </span>
                      <span className="sim-solution-tag">{item.shortTag}</span>
                    </div>

                    <h4>{item.title}</h4>
                    <p>{item.popularSummary}</p>

                    <div className="sim-ext-chips" aria-label="Áreas Yuko envolvidas">
                      {item.extensions.map((ext) => (
                        <span key={ext} className="sim-ext-chip">
                          {formatExtensionLabel(ext)}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="sim-tuning-card" aria-labelledby={`sim-step2-${uid}`}>
            <h3 id={`sim-step2-${uid}`} className="sim-step-title">
              Passo 2 — Ajuste rápido (sem formulário longo)
            </h3>

            <div className="sim-tuning-group">
              <span className="sim-tuning-label">Tamanho do combinado</span>
              <div className="sim-chip-row" role="group" aria-label="Tamanho do combinado">
                {SCOPE_OPTIONS.map((opt) => {
                  const isActive = scopeSize === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      aria-pressed={isActive}
                      className={`sim-chip${isActive ? ' is-active' : ''}`}
                      onClick={() => setScopeSize(opt.id)}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="sim-tuning-group">
              <span className="sim-tuning-label">Situação atual</span>
              <div className="sim-chip-row" role="group" aria-label="Situação atual">
                {SITUATION_OPTIONS.map((opt) => {
                  const isActive = situation === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      aria-pressed={isActive}
                      className={`sim-chip${isActive ? ' is-active' : ''}`}
                      onClick={() => setSituation(opt.id)}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="sim-tuning-group">
              <span className="sim-tuning-label">
                Envolve dados de clientes ou equipe? (Lei de Proteção de Dados — LGPD)
              </span>
              <button
                type="button"
                aria-pressed={involvesClientData}
                className={`sim-toggle-btn${involvesClientData ? ' is-active' : ''}`}
                onClick={() => setInvolvesClientData((prev) => !prev)}
              >
                <span>{lgpdLabel}</span>
                <span aria-hidden="true">{involvesClientData ? 'LGPD ativa' : 'Público'}</span>
              </button>
            </div>

            {perspective === 'desenvolvedor' && (
              <div className="sim-tuning-group">
                <span className="sim-tuning-label">Papel que quero simular</span>
                <div className="sim-chip-row" role="group" aria-label="Papel que quero simular">
                  {DEV_ROLE_OPTIONS.map((opt) => {
                    const isActive = devRole === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        aria-pressed={isActive}
                        className={`sim-chip${isActive ? ' is-active' : ''}`}
                        onClick={() => setDevRole(opt.id)}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                <div className="sim-role-note">
                  <strong>{devRoleMeta.label}:</strong> {devRoleMeta.summary}{' '}
                  <span>{devRoleMeta.contractNote}</span>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Coluna Direita — Raio-X Vivo & Conexão com Comunidade/Manual */}
        <div className="sim-results" aria-live="polite">
          {/* Cartão Resumo */}
          <section className="sim-summary-card" aria-label="Estimativa e resumo da simulação">
            <div className="sim-summary-head">
              <div>
                <div className="sim-stage-meta">
                  <span>{profileLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedSolution.shortTag}</span>
                </div>
                <h3>{selectedSolution.title}</h3>
              </div>

              <div className="sim-ext-chips" aria-label="Áreas Yuko envolvidas">
                {selectedSolution.extensions.map((ext) => (
                  <span key={ext} className="sim-ext-chip">
                    {formatExtensionLabel(ext)}
                  </span>
                ))}
              </div>
            </div>

            <p className="sim-role-note">
              {perspective === 'empresa' ? (
                <>
                  <strong>O que você recebe:</strong> {selectedSolution.clientDeliverable}
                </>
              ) : (
                <>
                  <strong>Foco técnico na prática:</strong> {selectedSolution.devFocus}
                </>
              )}
            </p>

            <div className="sim-kpi-grid">
              <div className="sim-kpi-box">
                <span className="sim-kpi-label">Prazo estimado</span>
                <strong className="sim-kpi-value">{estimate.deadlineLabel}</strong>
                <span className="sim-kpi-sub">{estimate.deadlineSublabel}</span>
              </div>

              <div className="sim-kpi-box">
                <span className="sim-kpi-label">Faixa de referência</span>
                <strong className="sim-kpi-value">{estimate.priceLabel}</strong>
                <span className="sim-kpi-sub">Valor indicativo do método</span>
              </div>

              <div className="sim-kpi-box">
                <span className="sim-kpi-label">Equipe da comunidade</span>
                <strong className="sim-kpi-value">{teamHeadline}</strong>
                <span className="sim-kpi-sub">{teamSublabel}</span>
              </div>
            </div>

            <p className="sim-transparency-note">
              Participação comunitária sem vínculo empregatício; quando comercial, os detalhes e
              valores são fechados em contrato direto entre você e quem executa, sem taxas ocultas.
            </p>

            <button
              type="button"
              className="sim-breakdown-btn"
              aria-expanded={isBreakdownOpen}
              aria-controls={breakdownPanelId}
              onClick={() => setIsBreakdownOpen((prev) => !prev)}
            >
              <span>Como chegamos nessa conta e o que você precisa ter?</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {isBreakdownOpen ? (
                  <polyline points="18 15 12 9 6 15" />
                ) : (
                  <polyline points="6 9 12 15 18 9" />
                )}
              </svg>
            </button>

            {isBreakdownOpen && (
              <div id={breakdownPanelId} className="sim-breakdown-panel">
                <div className="sim-breakdown-bars" aria-hidden="true">
                  <span style={{ width: '20%' }} />
                  <span style={{ width: '50%' }} />
                  <span style={{ width: '30%' }} />
                </div>

                <ul className="sim-breakdown-list">
                  <li>
                    <strong>Conversa e combinado (20%)</strong>
                    <span>{estimate.stageSplit.discovery}</span>
                  </li>
                  <li>
                    <strong>Construção organizada (50%)</strong>
                    <span>{estimate.stageSplit.build}</span>
                  </li>
                  <li>
                    <strong>Revisão por 2+ pares e testes (30%)</strong>
                    <span>{estimate.stageSplit.reviewAndTests}</span>
                  </li>
                  <li>
                    <strong>Tamanho do combinado</strong>
                    <span>
                      {scopeLabel} ({estimate.scopeNote})
                    </span>
                  </li>
                  <li>
                    <strong>Situação atual</strong>
                    <span>{estimate.situationNote}</span>
                  </li>
                  <li>
                    <strong>Proteção de dados (LGPD)</strong>
                    <span>{estimate.lgpdNote}</span>
                  </li>
                </ul>

                <div className="sim-tuning-group">
                  <span className="sim-tuning-label">O que você precisa ter separado</span>
                  <ul className="clean-list">
                    {clientNeedsList.map((need) => (
                      <li key={need}>
                        <span>{need}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="sim-role-note">
                  <strong>Custo contínuo e propriedade em nome da empresa:</strong>{' '}
                  {selectedSolution.runningNote}
                </div>
              </div>
            )}
          </section>

          {/* Explorador Interativo das 6 Etapas + Discord */}
          <section className="sim-cycle-card" aria-labelledby={`sim-cycle-title-${uid}`}>
            <h3 id={`sim-cycle-title-${uid}`}>As 6 etapas na prática + canal no Discord</h3>

            <div className="sim-stage-tabs" role="tablist" aria-label="As 6 etapas do ciclo Yuko">
              {SIMULATOR_STAGES.map((stage) => {
                const isActive = stage.step === activeStage.step;
                return (
                  <button
                    key={stage.step}
                    id={`sim-stage-tab-${stage.step}-${uid}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={stagePanelId}
                    className={`sim-stage-tab${isActive ? ' is-active' : ''}`}
                    onClick={() => setActiveStageStep(stage.step)}
                  >
                    <span>Etapa {stage.step}</span>
                    <span>{stage.title}</span>
                  </button>
                );
              })}
            </div>

            <div
              id={stagePanelId}
              className="sim-stage-detail"
              role="tabpanel"
              aria-labelledby={`sim-stage-tab-${activeStage.step}-${uid}`}
            >
              <div className="sim-stage-meta">
                <span>{formatExtensionTag(activeStage.extensionTag)}</span>
                <span aria-hidden="true">·</span>
                <span>{activeStage.discordChannel}</span>
              </div>

              <p>
                <strong>O que acontece nesta etapa: </strong>
                {perspective === 'empresa'
                  ? activeStage.empresaAction
                  : activeStage.devActionByRole[devRole]}
              </p>

              <p>{activeStage.manualRule}</p>

              <a href={activeStage.manualHref}>{activeStage.manualLinkLabel}</a>
            </div>
          </section>

          {/* Simulador de Imprevisto */}
          <section className="sim-stress-card" aria-labelledby={`sim-stress-title-${uid}`}>
            <h3 id={`sim-stress-title-${uid}`}>Teste a proteção do Manual agora</h3>

            <div className="sim-stress-btns">
              {SIMULATOR_STRESS_SCENARIOS.map((scenario) => {
                const isOpen = activeStressId === scenario.id;
                return (
                  <button
                    key={scenario.id}
                    type="button"
                    aria-expanded={isOpen}
                    className={`sim-stress-btn${isOpen ? ' is-active' : ''}`}
                    onClick={() =>
                      setActiveStressId((prev) => (prev === scenario.id ? null : scenario.id))
                    }
                  >
                    {scenario.buttonLabel}
                  </button>
                );
              })}
            </div>

            {activeStressScenario && (
              <div
                className={`sim-stress-result${
                  activeStressScenario.id === 'dados-reais' ? ' is-secondary' : ''
                }`}
              >
                <span className="sim-solution-tag">{activeStressScenario.guaranteeBadge}</span>
                <strong>{activeStressScenario.alertTitle}</strong>
                <p>{activeStressScenario.responseText}</p>
                <a href={activeStressScenario.ruleHref}>{activeStressScenario.ruleLabel}</a>
              </div>
            )}
          </section>

          {/* Pré-Ficha Simulada & Ações Finais */}
          <section className="sim-actions-card" aria-labelledby={`sim-ficha-title-${uid}`}>
            <h3 id={`sim-ficha-title-${uid}`}>Pré-ficha simulada · Yuko Work</h3>

            <pre className="sim-ficha-preview" aria-label="Resumo legível estilo ficha Yuko Work">
              {summaryPlainText}
            </pre>

            <div className="sim-actions-row">
              <button type="button" className="btn btn-primary" onClick={handleCopySummary}>
                {copiedRecently ? 'Resumo copiado ✓' : 'Copiar resumo da simulação'}
              </button>

              <a
                href={DISCORD_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-tonal"
              >
                Levar para o Discord ↗
              </a>

              <a href="/manual/" className="btn btn-outline btn-sm">
                Ler Manual v1.0 completo
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
