import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import {
  DISCORD_INVITE_URL,
  SIMULATOR_DEV_PROFILES,
  SIMULATOR_JOURNEY_STEPS,
  SIMULATOR_PERSPECTIVE_OPTIONS,
  SIMULATOR_SHIELDS,
  SIMULATOR_SOLUTIONS,
  type SimulatorDevRole,
  type SimulatorPerspective,
  type SimulatorScopeSize,
  type SimulatorSituation,
  type SimulatorSolutionCard,
  type SimulatorSolutionId,
} from '../data/yuko';

export interface YukoOrderSimulatorProps {
  defaultPerspective?: SimulatorPerspective;
  headingId?: string;
}

interface EstimateResult {
  daysMin: number;
  daysMax: number;
  deadlineShort: string;
  deadlineFull: string;
  priceMin: number;
  priceMax: number;
  priceFriendly: string;
  priceFull: string;
}

interface HumanProfile {
  badge: string;
  title: string;
  summary: string;
}

const SCOPE_OPTIONS: ReadonlyArray<{ id: SimulatorScopeSize; label: string }> = [
  { id: 'essencial', label: 'Essencial' },
  { id: 'completo', label: 'Completo' },
];

const SITUATION_OPTIONS: ReadonlyArray<{ id: SimulatorSituation; label: string }> = [
  { id: 'zero', label: 'Do zero' },
  { id: 'existente', label: 'Evoluir' },
  { id: 'resgate', label: 'Resgatar' },
];

const DEV_ROLE_ORDER: readonly SimulatorDevRole[] = ['executor', 'revisor', 'suporte'];

const CLIENT_PROFILE_TITLES: Record<SimulatorSolutionId, string> = {
  'site-presenca': 'Visita Clara & Segura',
  'agenda-pedidos': 'Pedido Rápido no Balcão',
  'cadastro-rotina': 'Atendimento Ágil & Seguro',
  'automacao-ferramentas': 'Retorno Automático Fiel',
  'casa-em-ordem': 'Confiança nos Seus Dados',
  'resgate-sistema': 'Serviço Estável de Volta',
};

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

function formatPlainNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatFriendlyPriceRange(min: number, max: number): string {
  return `R$ ${formatPlainNumber(min)}–${formatPlainNumber(max)}`;
}

function formatDeadlineRange(minDays: number, maxDays: number): { short: string; full: string } {
  const daysRange = `${minDays}–${maxDays} dias úteis`;
  if (maxDays <= 15) {
    return {
      short: daysRange,
      full: daysRange,
    };
  }
  const minWeeks = Math.max(1, Math.ceil(minDays / 5));
  const maxWeeks = Math.max(minWeeks, Math.ceil(maxDays / 5));
  const weeksLabel =
    minWeeks === maxWeeks ? `~${minWeeks} semanas` : `${minWeeks}–${maxWeeks} semanas`;
  return {
    short: weeksLabel,
    full: `${weeksLabel} (${daysRange})`,
  };
}

function calculateEstimate(
  solution: SimulatorSolutionCard,
  scopeSize: SimulatorScopeSize,
  situation: SimulatorSituation,
  involvesClientData: boolean
): EstimateResult {
  const scopePriceMult = scopeSize === 'essencial' ? 1.0 : 1.55;
  const scopeDaysMult = scopeSize === 'essencial' ? 1.0 : 1.5;

  let situationMult = 1.0;
  if (situation === 'existente') {
    situationMult = 1.15;
  } else if (situation === 'resgate' && solution.id !== 'resgate-sistema') {
    situationMult = 1.25;
  }

  let lgpdPriceMult = 1.0;
  let lgpdExtraDays = 0;
  if (involvesClientData) {
    if (solution.id === 'resgate-sistema') {
      lgpdPriceMult = 1.05;
      lgpdExtraDays = 3;
    } else if (solution.id !== 'casa-em-ordem') {
      lgpdPriceMult = 1.1;
      lgpdExtraDays = 5;
    }
  }

  const daysMin = Math.max(3, Math.round(solution.baseDaysMin * scopeDaysMult * situationMult));
  const daysMax = Math.max(
    daysMin + 2,
    Math.round(solution.baseDaysMax * scopeDaysMult * situationMult) + lgpdExtraDays
  );

  const priceMin = roundToNearestFifty(
    solution.basePriceMin * scopePriceMult * situationMult * lgpdPriceMult
  );
  const priceMax = roundToNearestFifty(
    solution.basePriceMax * scopePriceMult * situationMult * lgpdPriceMult
  );

  const deadline = formatDeadlineRange(daysMin, daysMax);

  return {
    daysMin,
    daysMax,
    deadlineShort: deadline.short,
    deadlineFull: deadline.full,
    priceMin,
    priceMax,
    priceFriendly: formatFriendlyPriceRange(priceMin, priceMax),
    priceFull: `${formatBrl(priceMin)} a ${formatBrl(priceMax)}`,
  };
}

function resolveHumanProfile(
  perspective: SimulatorPerspective,
  solution: SimulatorSolutionCard,
  scopeSize: SimulatorScopeSize,
  situation: SimulatorSituation,
  involvesClientData: boolean,
  devRole: SimulatorDevRole
): HumanProfile {
  const scopePhrase =
    scopeSize === 'essencial'
      ? 'Começando pelo essencial e validado por 2+ revisores antes de ir ao ar.'
      : 'Cobrindo a rotina completa com conferência coletiva e guia de uso.';

  const lgpdPhrase = involvesClientData
    ? 'Com sigilo LGPD ativo e testes feitos só com exemplos fictícios.'
    : 'Sem exposição de dados sensíveis e com acessos sempre no nome da empresa.';

  if (perspective === 'desenvolvedor') {
    const devMeta = SIMULATOR_DEV_PROFILES[devRole];
    const situationSuffix =
      situation === 'resgate'
        ? ' · Retomada'
        : situation === 'existente'
          ? ' · Evolução'
          : '';
    return {
      badge: `${devMeta.profileBadge} · ${solution.shortTitle}`,
      title: `${devMeta.profileTitle}${situationSuffix}`,
      summary: `${devMeta.humanSummary} Foco em ${solution.shortTitle.toLowerCase()} no ritmo ${
        scopeSize === 'essencial' ? 'enxuto' : 'completo'
      }.`,
    };
  }

  if (perspective === 'cliente') {
    const baseClientTitle = CLIENT_PROFILE_TITLES[solution.id];
    const clientTitle =
      situation === 'resgate' && solution.id !== 'resgate-sistema'
        ? `${baseClientTitle} · Retomada`
        : baseClientTitle;
    return {
      badge: `${solution.profileBadge} · Visão Cliente`,
      title: clientTitle,
      summary: `${solution.clientProfileHook} ${lgpdPhrase}`,
    };
  }

  const companyTitle =
    situation === 'resgate' && solution.id !== 'resgate-sistema'
      ? `${solution.profileTitle} · Retomada`
      : situation === 'existente'
        ? `${solution.profileTitle} · Evolução`
        : solution.profileTitle;

  return {
    badge: involvesClientData ? `${solution.profileBadge} · LGPD` : solution.profileBadge,
    title: companyTitle,
    summary: `${solution.humanSummary} ${scopePhrase}`,
  };
}

function buildHiddenProfileBrief(params: {
  perspective: SimulatorPerspective;
  profile: HumanProfile;
  solution: SimulatorSolutionCard;
  scopeSize: SimulatorScopeSize;
  situation: SimulatorSituation;
  involvesClientData: boolean;
  devRole: SimulatorDevRole;
  estimate: EstimateResult;
}): string {
  const {
    perspective,
    profile,
    solution,
    scopeSize,
    situation,
    involvesClientData,
    devRole,
    estimate,
  } = params;

  const perspectiveLabel =
    perspective === 'empresa'
      ? 'Empresa'
      : perspective === 'cliente'
        ? 'Cliente'
        : `Dev (${SIMULATOR_DEV_PROFILES[devRole].label})`;

  const scopeLabel = scopeSize === 'essencial' ? 'Essencial' : 'Completo';
  const situationLabel =
    situation === 'zero' ? 'Do zero' : situation === 'existente' ? 'Evoluir' : 'Resgatar';

  const lgpdSummary = involvesClientData
    ? 'Ativa (empresa como Controladora, coleta mínima e testes exclusivos com dados fictícios)'
    : 'Informações públicas (sem coleta sensível e testes exclusivos com dados fictícios)';

  return [
    'PERFIL SIMULADO · YUKO',
    `Modo: ${perspectiveLabel}`,
    `Perfil: ${profile.title} (${profile.badge})`,
    `Frente escolhida: ${solution.shortTitle} · ${scopeLabel} · ${situationLabel}`,
    `Áreas Yuko: ${solution.extensions.join(' · ')}`,
    `Canal Discord sugerido: ${solution.discordChannel}`,
    `Estimativa de prazo: ${estimate.deadlineFull}`,
    `Faixa de referência: ${estimate.priceFriendly} (${estimate.priceFull} — estimativa aberta)`,
    'Rede de entrega: 4+ membros (1 executor, 2+ revisores independentes e 1 responsável de suporte)',
    `Proteção LGPD: ${lgpdSummary}`,
    'Continuidade (regra de 5 dias úteis): código e histórico ficam no espaço central; após 5 dias úteis sem resposta nem aviso, outro profissional assume sem perda.',
    'Ressalva Manual v1.0: participação comunitária sem vínculo empregatício; relações comerciais exigem contrato direto entre as partes, sem taxas ocultas.',
  ].join('\n');
}

function PerspectiveIcon({ id }: { id: SimulatorPerspective }) {
  const shared = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  };

  switch (id) {
    case 'empresa':
      return (
        <svg {...shared}>
          <path d="M4 10h16v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9z" />
          <path d="M3 10l2-5h14l2 5" />
          <path d="M9.5 21v-6h5v6" />
        </svg>
      );
    case 'cliente':
      return (
        <svg {...shared}>
          <circle cx="12" cy="8.5" r="3.5" />
          <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
        </svg>
      );
    case 'desenvolvedor':
      return (
        <svg {...shared}>
          <polyline points="8 8 3.5 12 8 16" />
          <polyline points="16 8 20.5 12 16 16" />
          <line x1="13.5" y1="6" x2="10.5" y2="18" />
        </svg>
      );
  }
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
  const [activeJourneyStep, setActiveJourneyStep] = useState<number>(1);
  const [activeShieldId, setActiveShieldId] = useState<'continuidade' | 'lgpd' | null>(null);
  const [copiedRecently, setCopiedRecently] = useState<boolean>(false);

  const perspectiveRefs = useRef<Record<SimulatorPerspective, HTMLButtonElement | null>>({
    empresa: null,
    cliente: null,
    desenvolvedor: null,
  });
  const journeyRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null && typeof window !== 'undefined') {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const selectedSolution = useMemo(() => {
    return SIMULATOR_SOLUTIONS.find((item) => item.id === solutionId) ?? SIMULATOR_SOLUTIONS[0];
  }, [solutionId]);

  const estimate = useMemo(() => {
    return calculateEstimate(selectedSolution, scopeSize, situation, involvesClientData);
  }, [selectedSolution, scopeSize, situation, involvesClientData]);

  const profile = useMemo(() => {
    return resolveHumanProfile(
      perspective,
      selectedSolution,
      scopeSize,
      situation,
      involvesClientData,
      devRole
    );
  }, [perspective, selectedSolution, scopeSize, situation, involvesClientData, devRole]);

  const activeStep = useMemo(() => {
    return (
      SIMULATOR_JOURNEY_STEPS.find((step) => step.step === activeJourneyStep) ??
      SIMULATOR_JOURNEY_STEPS[0]
    );
  }, [activeJourneyStep]);

  const activeShield = useMemo(() => {
    if (!activeShieldId) return null;
    return SIMULATOR_SHIELDS.find((shield) => shield.id === activeShieldId) ?? null;
  }, [activeShieldId]);

  const hiddenProfileBrief = useMemo(() => {
    return buildHiddenProfileBrief({
      perspective,
      profile,
      solution: selectedSolution,
      scopeSize,
      situation,
      involvesClientData,
      devRole,
      estimate,
    });
  }, [
    perspective,
    profile,
    selectedSolution,
    scopeSize,
    situation,
    involvesClientData,
    devRole,
    estimate,
  ]);

  const handleSelectSolution = (nextId: SimulatorSolutionId) => {
    setSolutionId(nextId);
    if (nextId === 'resgate-sistema') {
      setSituation('resgate');
    } else if (nextId === 'casa-em-ordem') {
      setInvolvesClientData(true);
    }
  };

  const handlePerspectiveKeyDown = (
    e: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number
  ) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End') {
      return;
    }
    e.preventDefault();
    const total = SIMULATOR_PERSPECTIVE_OPTIONS.length;
    const nextIndex =
      e.key === 'Home'
        ? 0
        : e.key === 'End'
          ? total - 1
          : e.key === 'ArrowRight'
            ? (currentIndex + 1) % total
            : (currentIndex - 1 + total) % total;

    const nextOption = SIMULATOR_PERSPECTIVE_OPTIONS[nextIndex];
    if (nextOption) {
      setPerspective(nextOption.id);
      perspectiveRefs.current[nextOption.id]?.focus();
    }
  };

  const handleJourneyKeyDown = (e: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End') {
      return;
    }
    e.preventDefault();
    const total = SIMULATOR_JOURNEY_STEPS.length;
    const nextIndex =
      e.key === 'Home'
        ? 0
        : e.key === 'End'
          ? total - 1
          : e.key === 'ArrowRight'
            ? (currentIndex + 1) % total
            : (currentIndex - 1 + total) % total;

    const nextStep = SIMULATOR_JOURNEY_STEPS[nextIndex];
    if (nextStep) {
      setActiveJourneyStep(nextStep.step);
      journeyRefs.current[nextStep.step]?.focus();
    }
  };

  const handleCopyProfile = async () => {
    let copied = false;
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(hiddenProfileBrief);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (!copied && typeof document !== 'undefined') {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = hiddenProfileBrief;
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
              ? 'Perfil copiado! Cole no Discord para começar sua conversa.'
              : 'Não foi possível copiar automaticamente. Abra o Discord para conversar com a rede.',
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

  const networkKpiValue =
    perspective === 'desenvolvedor'
      ? devRole === 'executor'
        ? 'Executar + 2+ pares'
        : devRole === 'revisor'
          ? 'Revisar (2+ pares)'
          : 'Apoio · 5 dias'
      : '4+ membros';

  const networkKpiSub =
    perspective === 'desenvolvedor' ? 'atuação na rede' : '1 cria · 2+ revisam · suporte';

  const panelId = `sim-workspace-${uid}`;
  const journeyPanelId = `sim-journey-note-${uid}`;

  return (
    <div className="sim-shell" aria-labelledby={headingId}>
      {/* Barra superior: Seletor de perfil em pílula */}
      <div className="sim-top-bar">
        <span className="sim-top-label">Seu olhar</span>

        <div
          className="sim-perspective-switch"
          role="tablist"
          aria-label="Escolha seu perfil no simulador"
        >
          {SIMULATOR_PERSPECTIVE_OPTIONS.map((opt, idx) => {
            const isSelected = perspective === opt.id;
            const tabId = `sim-tab-${opt.id}-${uid}`;
            return (
              <button
                key={opt.id}
                ref={(el) => {
                  perspectiveRefs.current[opt.id] = el;
                }}
                id={tabId}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls={panelId}
                tabIndex={isSelected ? 0 : -1}
                className={`sim-perspective-btn${isSelected ? ' is-active' : ''}`}
                onClick={() => setPerspective(opt.id)}
                onKeyDown={(e) => handlePerspectiveKeyDown(e, idx)}
              >
                <PerspectiveIcon id={opt.id} />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Workspace 2 colunas */}
      <div
        id={panelId}
        className="sim-workspace"
        role="tabpanel"
        aria-labelledby={`sim-tab-${perspective}-${uid}`}
      >
        {/* Esquerda: Seleções minimalistas por símbolos */}
        <div className="sim-controls">
          <div className="sim-solutions-grid" role="group" aria-label="Escolha o que deseja simular">
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
                  <span className="sim-solution-icon" aria-hidden="true">
                    <SolutionIcon id={item.id} />
                  </span>
                  <span className="sim-solution-meta">
                    <strong className="sim-solution-title">{item.shortTitle}</strong>
                    <span className="sim-solution-mood">{item.moodTag}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="sim-tuning-stack">
            <div className="sim-tuning-group">
              <span className="sim-tuning-label">Alcance</span>
              <div className="sim-chip-row" role="group" aria-label="Alcance da entrega">
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
              <span className="sim-tuning-label">Momento</span>
              <div className="sim-chip-row" role="group" aria-label="Momento atual">
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
              <span className="sim-tuning-label">Dados</span>
              <button
                type="button"
                aria-pressed={involvesClientData}
                className={`sim-toggle-btn${involvesClientData ? ' is-active' : ''}`}
                onClick={() => setInvolvesClientData((prev) => !prev)}
              >
                <span className="sim-toggle-label">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 3l7 3v5.5c0 4.6-3 8.2-7 9.5-4-1.3-7-4.9-7-9.5V6l7-3z" />
                    <path d="M9.5 12l1.8 1.8 3.4-3.6" />
                  </svg>
                  <span>Com dados de pessoas</span>
                </span>
                <span className="sim-solution-tag" aria-hidden="true">
                  {involvesClientData ? 'LGPD ativa' : 'Opcional'}
                </span>
              </button>
            </div>

            {perspective === 'desenvolvedor' && (
              <div className="sim-tuning-group">
                <span className="sim-tuning-label">Papel na rede</span>
                <div className="sim-chip-row" role="group" aria-label="Papel na rede Yuko">
                  {DEV_ROLE_ORDER.map((roleId) => {
                    const isActive = devRole === roleId;
                    const roleMeta = SIMULATOR_DEV_PROFILES[roleId];
                    return (
                      <button
                        key={roleId}
                        type="button"
                        aria-pressed={isActive}
                        className={`sim-chip${isActive ? ' is-active' : ''}`}
                        onClick={() => setDevRole(roleId)}
                      >
                        {roleMeta.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Direita: Perfil humanizado completo */}
        <div className="sim-results" aria-live="polite">
          <section className="sim-profile-card" aria-label="Perfil recomendado">
            <div className="sim-profile-head">
              <div className="sim-profile-head-top">
                <span className="sim-profile-emblem" aria-hidden="true">
                  <SolutionIcon id={selectedSolution.id} />
                </span>
                <span className="sim-profile-badge">{profile.badge}</span>
              </div>
              <h3 className="sim-profile-title">{profile.title}</h3>
            </div>

            <p className="sim-profile-summary">{profile.summary}</p>

            {/* 3 Indicadores visuais compactos */}
            <div className="sim-kpi-grid">
              <div className="sim-kpi-box">
                <span className="sim-kpi-label">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                  <span>Prazo</span>
                </span>
                <strong className="sim-kpi-value">{estimate.deadlineShort}</strong>
                <span className="sim-kpi-sub">ritmo estimado</span>
              </div>

              {perspective === 'cliente' ? (
                <div className="sim-kpi-box">
                  <span className="sim-kpi-label">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 3l7 3v5.5c0 4.6-3 8.2-7 9.5-4-1.3-7-4.9-7-9.5V6l7-3z" />
                      <path d="M9.5 12l1.8 1.8 3.4-3.6" />
                    </svg>
                    <span>Cuidado</span>
                  </span>
                  <strong className="sim-kpi-value">
                    {involvesClientData ? 'Sigilo LGPD' : 'Acesso seguro'}
                  </strong>
                  <span className="sim-kpi-sub">
                    {involvesClientData ? 'exemplos fictícios em testes' : 'experiência protegida'}
                  </span>
                </div>
              ) : (
                <div className="sim-kpi-box">
                  <span className="sim-kpi-label">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 3v18" />
                      <path d="M16.5 7.5a4 4 0 0 0-4.5-2c-2.3 0-4 1.3-4 3.2 0 4 8.5 2 8.5 6.3 0 2-1.8 3.5-4.5 3.5a4.6 4.6 0 0 1-4.5-2.2" />
                    </svg>
                    <span>Referência</span>
                  </span>
                  <strong className="sim-kpi-value">{estimate.priceFriendly}</strong>
                  <span className="sim-kpi-sub">estimativa aberta</span>
                </div>
              )}

              <div className="sim-kpi-box">
                <span className="sim-kpi-label">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="9" cy="8" r="3" />
                    <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
                    <circle cx="17" cy="9" r="2.2" />
                    <path d="M16 14.5a4.5 4.5 0 0 1 4.5 4.5" />
                  </svg>
                  <span>Rede</span>
                </span>
                <strong className="sim-kpi-value">{networkKpiValue}</strong>
                <span className="sim-kpi-sub">{networkKpiSub}</span>
              </div>
            </div>

            {/* Trilha visual das 6 etapas */}
            <div className="sim-journey-block">
              <div
                className="sim-journey-tabs"
                role="tablist"
                aria-label="Trilha das 6 etapas Yuko"
              >
                {SIMULATOR_JOURNEY_STEPS.map((step, idx) => {
                  const isActive = step.step === activeStep.step;
                  const stepTabId = `sim-journey-tab-${step.step}-${uid}`;
                  return (
                    <button
                      key={step.step}
                      ref={(el) => {
                        journeyRefs.current[step.step] = el;
                      }}
                      id={stepTabId}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={journeyPanelId}
                      tabIndex={isActive ? 0 : -1}
                      className={`sim-journey-tab${isActive ? ' is-active' : ''}`}
                      onClick={() => setActiveJourneyStep(step.step)}
                      onKeyDown={(e) => handleJourneyKeyDown(e, idx)}
                    >
                      {step.label}
                    </button>
                  );
                })}
              </div>

              <div
                id={journeyPanelId}
                className="sim-journey-note"
                role="tabpanel"
                aria-labelledby={`sim-journey-tab-${activeStep.step}-${uid}`}
              >
                <p>
                  {perspective === 'desenvolvedor' ? activeStep.devLine : activeStep.humanLine}
                </p>
                {perspective === 'desenvolvedor' ? (
                  <p>
                    <strong>{activeStep.area}</strong> · {selectedSolution.discordChannel}{' '}
                    <a href={activeStep.href}>Ver etapa →</a>
                  </p>
                ) : (
                  <p>
                    <a href={activeStep.href}>Entender essa etapa →</a>
                  </p>
                )}
              </div>
            </div>

            {/* Pílulas de cuidado */}
            <div className="sim-shields-row" role="group" aria-label="Garantias de cuidado">
              {SIMULATOR_SHIELDS.map((shield) => {
                const isOpen = activeShieldId === shield.id;
                return (
                  <button
                    key={shield.id}
                    type="button"
                    aria-pressed={isOpen}
                    aria-expanded={isOpen}
                    className={`sim-shield-pill${isOpen ? ' is-active' : ''}`}
                    onClick={() =>
                      setActiveShieldId((prev) => (prev === shield.id ? null : shield.id))
                    }
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {shield.id === 'continuidade' ? (
                        <>
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 7v5l3 2" />
                        </>
                      ) : (
                        <>
                          <rect x="5" y="11" width="14" height="9" rx="2.5" />
                          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                        </>
                      )}
                    </svg>
                    <span>{shield.label}</span>
                  </button>
                );
              })}
            </div>

            {activeShield && (
              <div
                className={`sim-shield-caption${
                  activeShield.id === 'lgpd' ? ' is-secondary' : ''
                }`}
              >
                <p>
                  {activeShield.microNote}{' '}
                  <a href={activeShield.href}>
                    {activeShield.id === 'continuidade' ? 'Ver Ciclo →' : 'Ver LGPD →'}
                  </a>
                </p>
              </div>
            )}

            {/* Ações estratégicas */}
            <div className="sim-actions-row">
              <a
                href={DISCORD_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Conversar no Discord ↗
              </a>

              <button type="button" className="btn btn-tonal" onClick={handleCopyProfile}>
                {copiedRecently ? 'Perfil copiado ✓' : 'Copiar meu perfil'}
              </button>
            </div>

            <p className="sim-footer-note">
              <a href="/manual/">Manual v1.0</a> · sem vínculo nem taxas ocultas
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
