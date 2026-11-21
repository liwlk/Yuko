import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import {
  DISCORD_INVITE_URL,
  SIMULATOR_DEV_PROFILES,
  SIMULATOR_PERSPECTIVE_OPTIONS,
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

function buildLinearWavyPath(
  startX: number,
  endX: number,
  cy: number,
  amplitude: number,
  wavelength: number
): string {
  const parts: string[] = [];
  for (let x = startX; x < endX; x += 2) {
    const y = cy + Math.sin(((x - startX) / wavelength) * Math.PI * 2) * amplitude;
    parts.push(`${parts.length === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(2)}`);
  }
  const endY = cy + Math.sin(((endX - startX) / wavelength) * Math.PI * 2) * amplitude;
  parts.push(`L${endX.toFixed(1)} ${endY.toFixed(2)}`);
  return parts.join(' ');
}

function formatDeadlineRange(minDays: number, maxDays: number): { short: string; full: string } {
  const daysFull = `${minDays}–${maxDays} dias úteis`;
  if (maxDays <= 15) {
    return {
      short: `${minDays}–${maxDays} dias`,
      full: daysFull,
    };
  }
  const minWeeks = Math.max(1, Math.ceil(minDays / 5));
  const maxWeeks = Math.max(minWeeks, Math.ceil(maxDays / 5));
  const shortWeeks = minWeeks === maxWeeks ? `~${minWeeks} sem` : `${minWeeks}–${maxWeeks} sem`;
  const fullWeeks =
    minWeeks === maxWeeks ? `~${minWeeks} semanas` : `${minWeeks}–${maxWeeks} semanas`;
  return {
    short: shortWeeks,
    full: `${fullWeeks} (${daysFull})`,
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
  situation: SimulatorSituation,
  devRole: SimulatorDevRole
): HumanProfile {
  if (perspective === 'desenvolvedor') {
    const devMeta = SIMULATOR_DEV_PROFILES[devRole];
    const situationSuffix =
      situation === 'resgate'
        ? ' · Retomada'
        : situation === 'existente'
          ? ' · Evolução'
          : '';
    return {
      badge: devMeta.profileBadge,
      title: `${devMeta.profileTitle}${situationSuffix}`,
      summary: devMeta.shortSummary,
    };
  }

  if (perspective === 'cliente') {
    const baseClientTitle = CLIENT_PROFILE_TITLES[solution.id];
    const clientTitle =
      situation === 'resgate' && solution.id !== 'resgate-sistema'
        ? `${baseClientTitle} · Retomada`
        : baseClientTitle;

    return {
      badge: solution.profileBadge,
      title: clientTitle,
      summary: solution.clientShortSummary,
    };
  }

  const companyTitle =
    situation === 'resgate' && solution.id !== 'resgate-sistema'
      ? `${solution.profileTitle} · Retomada`
      : situation === 'existente'
        ? `${solution.profileTitle} · Evolução`
        : solution.profileTitle;

  return {
    badge: solution.profileBadge,
    title: companyTitle,
    summary: solution.shortSummary,
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

  const scopeLabel = scopeSize === 'essencial' ? 'Essencial' : 'Completo';
  const situationLabel =
    situation === 'zero' ? 'Do zero' : situation === 'existente' ? 'Evoluir' : 'Resgatar';

  const lgpdSummary = involvesClientData
    ? 'Ativa (empresa como Controladora, coleta mínima e testes exclusivos com dados fictícios)'
    : 'Informações públicas (sem coleta sensível e testes exclusivos com dados fictícios)';

  if (perspective === 'cliente') {
    const clientLgpdSummary = involvesClientData
      ? 'Seus dados ficam protegidos com coleta mínima, sigilo LGPD e testes apenas com exemplos fictícios.'
      : 'Sem exigir cadastro extra nem expor seu contato.';
    const rescueTag =
      situation === 'resgate' && solution.id !== 'resgate-sistema' ? ' · Retomada' : '';

    return [
      `INDICAÇÃO DE EXPERIÊNCIA · ${orderCode}`,
      `Experiência sugerida: ${profile.title} (${profile.badge})`,
      `Benefício para quem usa: ${solution.clientProfileHook}`,
      `Solução indicada: ${solution.shortTitle} · Alcance ${scopeLabel}${rescueTag}`,
      `Ritmo estimado: ${estimate.deadlineFull}`,
      `Cuidado com os dados: ${clientLgpdSummary}`,
      'Conferência de qualidade: validada por 2+ profissionais independentes antes de ir ao ar, com suporte após a entrega.',
      `Onde conversar: Discord Yuko (${solution.discordChannel}) · Manual v1.0`,
    ].join('\n');
  }

  if (perspective === 'desenvolvedor') {
    const devMeta = SIMULATOR_DEV_PROFILES[devRole];
    return [
      `FICHA DE ATUAÇÃO NA REDE · ${orderCode}`,
      `Papel escolhido: ${devMeta.label} — ${profile.title} (${profile.badge})`,
      `Atuação: ${devMeta.humanSummary}`,
      `Frente: ${solution.shortTitle} · ${scopeLabel} · ${situationLabel}`,
      `Nível da entrega: ${estimate.costLevelTitle} (Piso: ${estimate.costFloorLabel} → Teto: ${estimate.costCeilingLabel})`,
      `Ritmo estimado: ${estimate.deadlineFull}`,
      `Áreas Yuko: ${solution.extensions.join(' · ')}`,
      `Canal Discord: ${solution.discordChannel}`,
      'Revisão por pares: obrigatória por 2+ desenvolvedores independentes antes da publicação.',
      `Proteção LGPD: ${lgpdSummary}`,
      'Regra de 5 dias úteis: código e histórico ficam no espaço central; após 5 dias úteis sem resposta nem aviso, a vaga abre na ficha para continuidade sem perda.',
      'Manual v1.0: participação comunitária sem vínculo empregatício; condições comerciais e valores finais são combinados em contrato direto entre as partes.',
    ].join('\n');
  }

  return [
    `SOLICITAÇÃO YUKO · ${orderCode}`,
    'Origem: Empresa',
    `Perfil associado: ${profile.title} (${profile.badge})`,
    `Resumo: ${solution.humanSummary}`,
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

function SolutionIcon({ id, size = 18 }: { id: SimulatorSolutionId; size?: number }) {
  const shared = {
    width: size,
    height: size,
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

function ShieldIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
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
  );
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
  const [orderGenerated, setOrderGenerated] = useState<boolean>(false);
  const [copyNonce, setCopyNonce] = useState<number>(0);
  const [copiedRecently, setCopiedRecently] = useState<boolean>(false);

  const perspectiveRefs = useRef<Record<SimulatorPerspective, HTMLButtonElement | null>>({
    empresa: null,
    cliente: null,
    desenvolvedor: null,
  });
  const solutionsGridRef = useRef<HTMLDivElement | null>(null);
  const solutionRefs = useRef<Record<SimulatorSolutionId, HTMLButtonElement | null>>({
    'site-presenca': null,
    'agenda-pedidos': null,
    'cadastro-rotina': null,
    'automacao-ferramentas': null,
    'casa-em-ordem': null,
    'resgate-sistema': null,
  });
  const copyTimerRef = useRef<number | null>(null);
  const wavyTrackRef = useRef<HTMLDivElement | null>(null);
  const [wavyWidth, setWavyWidth] = useState<number>(420);

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

  const targetWavePct = clamp(Math.round((estimate.floorPct + estimate.ceilingPct) / 2), 22, 82);
  const [animatedWavePct, setAnimatedWavePct] = useState<number>(targetWavePct);
  const wavePctRef = useRef<number>(targetWavePct);

  useEffect(() => {
    const el = wavyTrackRef.current;
    if (!el || typeof window === 'undefined') {
      return;
    }
    const updateWidth = () => {
      if (el.clientWidth > 0) {
        setWavyWidth(el.clientWidth);
      }
    };
    updateWidth();
    if (typeof ResizeObserver === 'undefined') {
      return;
    }
    const ro = new ResizeObserver(updateWidth);
    ro.observe(el);
    return () => ro.disconnect();
  }, [perspective]);

  useEffect(() => {
    const startPct = wavePctRef.current;
    if (startPct === targetWavePct) {
      return;
    }
    if (typeof window === 'undefined') {
      wavePctRef.current = targetWavePct;
      setAnimatedWavePct(targetWavePct);
      return;
    }
    const calmMode =
      document.documentElement.dataset.motion === 'calm' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (calmMode) {
      wavePctRef.current = targetWavePct;
      setAnimatedWavePct(targetWavePct);
      return;
    }

    let rafId = 0;
    const duration = 260;
    const startTime = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = startPct + (targetWavePct - startPct) * eased;
      wavePctRef.current = next;
      setAnimatedWavePct(next);
      if (t < 1) {
        rafId = window.requestAnimationFrame(step);
      }
    };

    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [targetWavePct]);

  const wavyGeometry = useMemo(() => {
    const stroke = 4.6;
    const height = 18;
    const cy = height / 2;
    const startX = stroke / 2;
    const endCapX = Math.max(startX + 60, wavyWidth - stroke / 2);
    const gap = 12;
    const waveEndX = clamp(
      startX + ((endCapX - startX) * animatedWavePct) / 100,
      startX + 40,
      endCapX - gap - 22
    );
    const trackStartX = waveEndX + gap;
    const wavePath = buildLinearWavyPath(startX, waveEndX, cy, 3.8, 48);
    return {
      width: Math.max(120, wavyWidth),
      height,
      cy,
      stroke,
      wavePath,
      trackStartX,
      endCapX,
    };
  }, [wavyWidth, animatedWavePct]);

  const orderCode = useMemo(() => {
    return buildOrderCode(selectedSolution.id, scopeSize, estimate.costLevel);
  }, [selectedSolution.id, scopeSize, estimate.costLevel]);

  const profile = useMemo(() => {
    return resolveHumanProfile(perspective, selectedSolution, situation, devRole);
  }, [perspective, selectedSolution, situation, devRole]);

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

  const handleSolutionKeyDown = (e: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    if (
      e.key !== 'ArrowRight' &&
      e.key !== 'ArrowLeft' &&
      e.key !== 'ArrowDown' &&
      e.key !== 'ArrowUp' &&
      e.key !== 'Home' &&
      e.key !== 'End'
    ) {
      return;
    }
    e.preventDefault();
    const total = SIMULATOR_SOLUTIONS.length;
    let columns = 2;
    if (solutionsGridRef.current && typeof window !== 'undefined') {
      const colTemplate = window
        .getComputedStyle(solutionsGridRef.current)
        .gridTemplateColumns.trim();
      const count = colTemplate ? colTemplate.split(/\s+/).length : 2;
      if (count >= 1 && count <= total) {
        columns = count;
      }
    }

    const nextIndex =
      e.key === 'Home'
        ? 0
        : e.key === 'End'
          ? total - 1
          : e.key === 'ArrowRight'
            ? (currentIndex + 1) % total
            : e.key === 'ArrowLeft'
              ? (currentIndex - 1 + total) % total
              : e.key === 'ArrowDown'
                ? (currentIndex + columns) % total
                : (currentIndex - columns + total) % total;

    const nextItem = SIMULATOR_SOLUTIONS[nextIndex];
    if (nextItem) {
      solutionRefs.current[nextItem.id]?.focus();
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
      const recordNoun =
        perspective === 'cliente'
          ? 'Indicação'
          : perspective === 'desenvolvedor'
            ? 'Ficha'
            : 'Solicitação';

      window.dispatchEvent(
        new CustomEvent('yuko:toast', {
          detail: {
            message: copied
              ? `${recordNoun} ${orderCode} pronta e copiada para o Discord.`
              : `${recordNoun} ${orderCode} gerada. Abra o Discord para iniciar.`,
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

  const networkSignalValue =
    perspective === 'desenvolvedor'
      ? devRole === 'executor'
        ? '1 cria + 2 pares'
        : devRole === 'revisor'
          ? '2+ revisores'
          : 'Apoio · 5d'
      : '4+ pessoas';

  const primaryCtaLabel =
    perspective === 'empresa'
      ? 'Gerar solicitação'
      : perspective === 'cliente'
        ? 'Gerar indicação'
        : 'Gerar ficha';

  const panelId = `sim-workspace-${uid}`;

  return (
    <div className="sim-shell" aria-labelledby={headingId}>
      {/* Barra superior: seletor de perfil */}
      <div className="sim-top-bar">
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
        {/* Esquerda: Cards horizontais compactos + faixa única de ajuste */}
        <div className="sim-controls">
          <div
            ref={solutionsGridRef}
            className="sim-solutions-grid"
            role="group"
            aria-label="Escolha a categoria de serviço"
          >
            {SIMULATOR_SOLUTIONS.map((item, idx) => {
              const isSelected = item.id === solutionId;
              const titleId = `sim-sol-title-${item.id}-${uid}`;
              const descId = `sim-sol-desc-${item.id}-${uid}`;
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    solutionRefs.current[item.id] = el;
                  }}
                  type="button"
                  aria-pressed={isSelected}
                  aria-labelledby={titleId}
                  aria-describedby={descId}
                  className={`sim-solution-card${isSelected ? ' is-selected' : ''}`}
                  onClick={() => handleSelectSolution(item.id)}
                  onKeyDown={(e) => handleSolutionKeyDown(e, idx)}
                >
                  <span className="sim-solution-head">
                    <span className="sim-solution-icon" aria-hidden="true">
                      <SolutionIcon id={item.id} size={18} />
                    </span>
                    <strong id={titleId} className="sim-solution-title">
                      {item.shortTitle}
                    </strong>
                  </span>
                  <span id={descId} className="sim-solution-desc">
                    {item.categoryDescription}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="sim-tuning-strip">
            {perspective === 'desenvolvedor' && (
              <div className="sim-chip-row" role="group" aria-label="Papel na rede">
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
            )}

            <div className="sim-chip-row">
              <div className="sim-chip-row" role="group" aria-label="Alcance">
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

              <span className="sim-tuning-sep" aria-hidden="true" />

              <div className="sim-chip-row" role="group" aria-label="Momento">
                {SITUATION_OPTIONS.map((opt) => {
                  const isActive = situation === opt.id;
                  const isDisabled = solutionId === 'resgate-sistema' && opt.id !== 'resgate';
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isDisabled}
                      aria-pressed={isActive}
                      className={`sim-chip${isActive ? ' is-active' : ''}`}
                      title={isDisabled ? 'Resgate atua sempre no modo Resgatar' : undefined}
                      onClick={() => setSituation(opt.id)}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              <span className="sim-tuning-sep" aria-hidden="true" />

              <button
                type="button"
                aria-pressed={involvesClientData}
                aria-label="Envolve dados de pessoas (LGPD)"
                title="Ativar proteção LGPD para dados de pessoas"
                className={`sim-chip sim-chip-data${involvesClientData ? ' is-active' : ''}`}
                onClick={() => setInvolvesClientData((prev) => !prev)}
              >
                <ShieldIcon size={14} />
                <span>{involvesClientData ? '✓ LGPD' : '+ LGPD'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Direita: Síntese imediata do perfil */}
        <div className="sim-results">
          <section className="sim-profile-card" aria-label="Perfil recomendado">
            <div className="sim-profile-head" aria-live="polite">
              <span className="sim-profile-emblem" aria-hidden="true">
                <SolutionIcon id={selectedSolution.id} size={18} />
              </span>
              <div className="sim-profile-head-meta">
                <span className="sim-profile-badge">{profile.badge}</span>
                <h3 className="sim-profile-title">{profile.title}</h3>
                <p className="sim-profile-summary">{profile.summary}</p>
              </div>
            </div>

            <div className="sim-signals-strip">
              <div className="sim-signal-item">
                <span className="sim-signal-label">Prazo</span>
                <strong className="sim-signal-value">{estimate.deadlineShort}</strong>
              </div>

              <div className="sim-signal-item">
                <span className="sim-signal-label">Cuidado</span>
                <strong className="sim-signal-value">
                  {involvesClientData ? 'Sigilo LGPD' : 'Acesso seguro'}
                </strong>
              </div>

              <div className="sim-signal-item">
                <span className="sim-signal-label">Rede</span>
                <strong className="sim-signal-value">{networkSignalValue}</strong>
              </div>
            </div>

            {perspective !== 'cliente' && (
              <div
                className="sim-cost-meter"
                aria-label={`Nível de custo: ${estimate.costLevelTitle}, Piso ${estimate.costFloorLabel} até Teto ${estimate.costCeilingLabel}`}
              >
                <div className="sim-cost-meter-head">
                  <span className="sim-cost-end">Piso</span>
                  <span className="sim-cost-mid">{estimate.costLevelTitle}</span>
                  <span className="sim-cost-end">Teto</span>
                </div>
                <div
                  ref={wavyTrackRef}
                  className="sim-cost-wavy"
                  role="img"
                  aria-label={`Faixa do nível de custo de ${estimate.costFloorLabel} até ${estimate.costCeilingLabel}`}
                >
                  <svg
                    className="sim-wavy-svg"
                    viewBox={`0 0 ${wavyGeometry.width} ${wavyGeometry.height}`}
                    aria-hidden="true"
                  >
                    <line
                      className="sim-wavy-track"
                      x1={wavyGeometry.trackStartX}
                      y1={wavyGeometry.cy}
                      x2={wavyGeometry.endCapX}
                      y2={wavyGeometry.cy}
                      strokeWidth={wavyGeometry.stroke}
                      strokeLinecap="round"
                    />
                    <path
                      className="sim-wavy-active"
                      d={wavyGeometry.wavePath}
                      fill="none"
                      strokeWidth={wavyGeometry.stroke}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      className="sim-wavy-stop"
                      cx={wavyGeometry.endCapX}
                      cy={wavyGeometry.cy}
                      r={wavyGeometry.stroke / 2}
                    />
                  </svg>
                </div>
              </div>
            )}

            {!orderGenerated ? (
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
                  <span>{primaryCtaLabel}</span>
                </button>

                <a
                  href={DISCORD_INVITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-tonal"
                >
                  Abrir Discord ↗
                </a>
              </div>
            ) : (
              <div
                className="sim-order-bar"
                role="region"
                aria-label={
                  perspective === 'cliente'
                    ? 'Indicação gerada'
                    : perspective === 'desenvolvedor'
                      ? 'Ficha de atuação gerada'
                      : 'Solicitação gerada'
                }
              >
                <div className="sim-order-bar-left">
                  <span className="sim-order-code">{orderCode}</span>
                  {perspective !== 'cliente' && (
                    <span className="sim-order-level">{estimate.costLevelTitle}</span>
                  )}
                </div>

                <div className="sim-order-bar-actions">
                  <button
                    type="button"
                    className="btn btn-tonal"
                    onClick={() => void copyOrderToClipboard()}
                  >
                    {copiedRecently ? 'Copiado ✓' : 'Copiar'}
                  </button>
                  <a
                    href={DISCORD_INVITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Discord ↗
                  </a>
                  <button
                    type="button"
                    className="sim-order-close"
                    onClick={() => setOrderGenerated(false)}
                    aria-label="Fechar solicitação"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            <p className="sim-footer-note">
              Sem taxas ocultas · <a href="/manual/">Manual v1.0 ↗</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
