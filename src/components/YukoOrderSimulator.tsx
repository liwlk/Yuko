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

type CostLevelNumber = 1 | 2 | 3 | 4;

interface EstimateResult {
  daysMin: number;
  daysMax: number;
  deadlineShort: string;
  deadlineFull: string;
  costLevel: CostLevelNumber;
  costLevelTitle: string;
  costTierShort: string;
  costFloorLabel: string;
  costCeilingLabel: string;
  floorPct: number;
  ceilingPct: number;
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

const SOLUTION_ORDER_CODES: Record<SimulatorSolutionId, string> = {
  'site-presenca': 'PR',
  'agenda-pedidos': 'AG',
  'cadastro-rotina': 'RT',
  'automacao-ferramentas': 'CX',
  'casa-em-ordem': 'LG',
  'resgate-sistema': 'RG',
};

const CLIENT_PROFILE_TITLES: Record<SimulatorSolutionId, string> = {
  'site-presenca': 'Visita Clara & Segura',
  'agenda-pedidos': 'Pedido Rápido no Balcão',
  'cadastro-rotina': 'Atendimento Ágil & Seguro',
  'automacao-ferramentas': 'Retorno Automático Fiel',
  'casa-em-ordem': 'Confiança nos Seus Dados',
  'resgate-sistema': 'Serviço Estável de Volta',
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
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

  // Peso interno relativo para posicionar Piso e Teto na barra (sem expor valores diretos)
  const rawMin = solution.basePriceMin * scopePriceMult * situationMult * lgpdPriceMult;
  const rawMax = solution.basePriceMax * scopePriceMult * situationMult * lgpdPriceMult;

  const floorPct = clamp(Math.round(((rawMin - 1000) / 11500) * 78 + 8), 8, 62);
  const ceilingPct = clamp(Math.round(((rawMax - 1200) / 13500) * 82 + 14), floorPct + 20, 94);
  const midPct = (floorPct + ceilingPct) / 2;

  let costLevel: CostLevelNumber = 1;
  let costTierShort = 'Base';
  let costFloorLabel = 'Enxuto';
  let costCeilingLabel = 'Essencial';

  if (midPct > 68) {
    costLevel = 4;
    costTierShort = 'Completo';
    costFloorLabel = 'Estruturado';
    costCeilingLabel = 'Sob medida';
  } else if (midPct > 48) {
    costLevel = 3;
    costTierShort = 'Estruturado';
    costFloorLabel = 'Moderado';
    costCeilingLabel = 'Amplo';
  } else if (midPct > 30) {
    costLevel = 2;
    costTierShort = 'Moderado';
    costFloorLabel = 'Base simples';
    costCeilingLabel = 'Equilibrado';
  }

  const deadline = formatDeadlineRange(daysMin, daysMax);

  return {
    daysMin,
    daysMax,
    deadlineShort: deadline.short,
    deadlineFull: deadline.full,
    costLevel,
    costLevelTitle: `Nível ${costLevel} · ${costTierShort}`,
    costTierShort,
    costFloorLabel,
    costCeilingLabel,
    floorPct,
    ceilingPct,
  };
}

function buildOrderCode(
  solutionId: SimulatorSolutionId,
  scopeSize: SimulatorScopeSize,
  costLevel: CostLevelNumber
): string {
  const solCode = SOLUTION_ORDER_CODES[solutionId];
  const scopeCode = scopeSize === 'essencial' ? 'E' : 'C';
  return `YK-${solCode}-${scopeCode}${costLevel}`;
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

function buildHiddenOrderRecord(params: {
  orderCode: string;
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
    orderCode,
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
    `SOLICITAÇÃO YUKO · PROTOCOLO ${orderCode}`,
    `Origem: ${perspectiveLabel}`,
    `Perfil associado: ${profile.title} (${profile.badge})`,
    `Frente solicitada: ${solution.shortTitle} · ${scopeLabel} · ${situationLabel}`,
    `Nível de custo: ${estimate.costLevelTitle} (Piso: ${estimate.costFloorLabel} → Teto: ${estimate.costCeilingLabel}, sem valor fechado prévio)`,
    `Ritmo estimado: ${estimate.deadlineFull}`,
    `Áreas Yuko: ${solution.extensions.join(' · ')}`,
    `Canal Discord: ${solution.discordChannel}`,
    'Rede de entrega: 4+ membros (1 executor, 2+ revisores independentes e 1 responsável de suporte)',
    `Proteção LGPD: ${lgpdSummary}`,
    'Continuidade (regra de 5 dias úteis): código e histórico ficam no espaço central; após 5 dias úteis sem resposta nem aviso, outro profissional assume sem perda.',
    'Ressalva Manual v1.0: participação comunitária sem vínculo empregatício; condições comerciais e valores finais são combinados apenas em contrato direto entre as partes após a escuta.',
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
  const [orderGenerated, setOrderGenerated] = useState<boolean>(false);
  const [copyNonce, setCopyNonce] = useState<number>(0);
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

  const orderCode = useMemo(() => {
    return buildOrderCode(selectedSolution.id, scopeSize, estimate.costLevel);
  }, [selectedSolution.id, scopeSize, estimate.costLevel]);

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

  const hiddenOrderRecord = useMemo(() => {
    return buildHiddenOrderRecord({
      orderCode,
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
    orderCode,
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

  const copyOrderToClipboard = async () => {
    let copied = false;
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(hiddenOrderRecord);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (!copied && typeof document !== 'undefined') {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = hiddenOrderRecord;
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
              ? `Solicitação ${orderCode} pronta e copiada para o Discord.`
              : `Solicitação ${orderCode} gerada. Abra o Discord para iniciar.`,
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

  useEffect(() => {
    if (copyNonce > 0) {
      void copyOrderToClipboard();
    }
  }, [copyNonce]);

  const handleGenerateOrder = () => {
    setOrderGenerated(true);
    setCopyNonce((prev) => prev + 1);
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
                      <path d="M4 17l5-5 4 4 7-8" />
                      <path d="M16 8h4v4" />
                    </svg>
                    <span>Nível de custo</span>
                  </span>
                  <strong className="sim-kpi-value">{estimate.costLevelTitle}</strong>
                  <span className="sim-kpi-sub">
                    {estimate.costFloorLabel} → {estimate.costCeilingLabel}
                  </span>
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

            {perspective !== 'cliente' && (
              <div className="sim-cost-meter" aria-label="Linha de nível de custo entre piso e teto">
                <div className="sim-cost-meter-head">
                  <span className="sim-cost-end">Piso · {estimate.costFloorLabel}</span>
                  <span className="sim-cost-mid">{estimate.costLevelTitle}</span>
                  <span className="sim-cost-end">Teto · {estimate.costCeilingLabel}</span>
                </div>
                <div
                  className="sim-cost-track"
                  role="img"
                  aria-label={`Faixa do nível de custo de ${estimate.costFloorLabel} até ${estimate.costCeilingLabel}`}
                >
                  <div
                    className="sim-cost-range"
                    style={{
                      left: `${estimate.floorPct}%`,
                      width: `${Math.max(18, estimate.ceilingPct - estimate.floorPct)}%`,
                    }}
                  >
                    <span className="sim-cost-dot is-floor" aria-hidden="true" />
                    <span className="sim-cost-dot is-ceiling" aria-hidden="true" />
                  </div>
                </div>
              </div>
            )}

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
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleGenerateOrder}
                aria-expanded={orderGenerated}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 3h10a2 2 0 0 1 2 2v14l-3.5-2-3.5 2-3.5-2L5 19V5a2 2 0 0 1 2-2z" />
                  <path d="M9 8h6M9 12h4" />
                </svg>
                <span>{orderGenerated ? 'Atualizar solicitação' : 'Gerar solicitação'}</span>
              </button>

              <a
                href={DISCORD_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-tonal"
              >
                Conversar no Discord ↗
              </a>
            </div>

            {orderGenerated && (
              <div className="sim-order-ticket" role="region" aria-label="Solicitação gerada">
                <div className="sim-order-head">
                  <div className="sim-order-code-wrap">
                    <span className="sim-order-code">{orderCode}</span>
                    <span className="sim-order-level">{estimate.costLevelTitle}</span>
                  </div>
                  <button
                    type="button"
                    className="sim-order-close"
                    onClick={() => setOrderGenerated(false)}
                    aria-label="Fechar solicitação gerada"
                  >
                    Fechar
                  </button>
                </div>
                <p className="sim-order-summary">
                  <strong>{profile.title}</strong> · {estimate.deadlineShort} · Piso{' '}
                  {estimate.costFloorLabel.toLowerCase()} até teto{' '}
                  {estimate.costCeilingLabel.toLowerCase()}.
                </p>
                <div className="sim-order-actions">
                  <button
                    type="button"
                    className="btn btn-tonal"
                    onClick={() => void copyOrderToClipboard()}
                  >
                    {copiedRecently ? 'Protocolo copiado ✓' : `Copiar protocolo (${orderCode})`}
                  </button>
                  <a
                    href={DISCORD_INVITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Enviar no Discord ↗
                  </a>
                </div>
              </div>
            )}

            <p className="sim-footer-note">
              <a href="/manual/">Manual v1.0</a> · sem vínculo nem taxas ocultas
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
