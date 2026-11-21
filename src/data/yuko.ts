export const DISCORD_INVITE_URL = 'https://discord.gg/a3kSmBDxp3';

export type SeedId = 'terracota' | 'botanico' | 'oceanico' | 'ameixa';
export type ModeId = 'light' | 'dark';
export type MotionId = 'expressive' | 'calm';
export type StageLensId = 'fluxo' | 'rede' | 'blindagem';

export type CardTone = 'default' | 'tonal-primary' | 'tonal-secondary' | 'tonal-tertiary';

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface ColorSeed {
  id: SeedId;
  label: string;
  swatch: string;
}

export interface HeroMetric {
  value: string;
  label: string;
}

export interface ContinuityStageItem {
  index: number;
  kicker: string;
  stageLabel: string;
  title: string;
  body: string;
  defaultLens: StageLensId;
  lensNotes: Record<StageLensId, string>;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface HomePillar {
  variant: 'arch' | 'xl' | 'soft';
  href: string;
  title: string;
  description: string;
  tag: string;
}

export interface AudienceCard {
  id: string;
  badge: string;
  title: string;
  description: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
  ctaVariant: 'outline' | 'primary';
  featured: boolean;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  secondaryExternal?: boolean;
}

export interface IdentityItem {
  title: string;
  description: string;
}

export interface ExtensionItem {
  name: string;
  description: string;
  code: string;
  tone: CardTone;
}

export interface FrontItem {
  title: string;
  description: string;
}

export interface DiscordChannelItem {
  title: string;
  description: string;
  kind: 'channel' | 'guideline';
}

export interface CycleStage {
  title: string;
  description: string;
  code: string;
  tone: CardTone;
}

export interface RoleItem {
  title: string;
  description: string;
  tone: CardTone;
}

export interface ContinuityRule {
  title: string;
  description: string;
  tone: CardTone;
}

export interface SecurityCard {
  title: string;
  description: string;
  code: string;
}

export interface ControlRow {
  label: string;
  value: string;
}

export interface ManualOriginLink {
  label: string;
  href: string;
  description: string;
}

export interface ManualOriginLinhagemItem {
  label: string;
  text: string;
}

export interface ManualOriginCard {
  title: string;
  tone: CardTone;
  paragraphs?: string[];
  lineage?: ManualOriginLinhagemItem[];
  links?: ManualOriginLink[];
}

export type GlossaryTone = 'default' | 'primary' | 'secondary' | 'tertiary';

export interface GlossaryTerm {
  term: string;
  definition: string;
  tone?: GlossaryTone;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Início', href: '/' },
  { label: 'Extensões', href: '/extensoes/' },
  { label: 'Ciclo', href: '/ciclo/' },
  { label: 'Qualidade & LGPD', href: '/governanca/' },
  { label: 'Manual v1.0', href: '/manual/' },
];

export const COLOR_SEEDS: ColorSeed[] = [
  { id: 'terracota', label: 'Terracota Solar', swatch: '#a93714' },
  { id: 'botanico', label: 'Botânico Vivo', swatch: '#276841' },
  { id: 'oceanico', label: 'Índigo Oceânico', swatch: '#1d5796' },
  { id: 'ameixa', label: 'Ameixa Editorial', swatch: '#7d3b66' },
];

export const SPLIT_SHORTCUTS: NavItem[] = [
  { label: 'Extensões & Frentes', href: '/extensoes/' },
  { label: 'Papéis & Continuidade', href: '/ciclo/#papeis' },
  { label: 'Qualidade & LGPD', href: '/governanca/' },
  { label: 'Glossário Institucional', href: '/manual/#glossario' },
  { label: 'Entrar no Discord ↗', href: DISCORD_INVITE_URL, external: true },
];

export const HERO_METRICS: HeroMetric[] = [
  { value: '6 Etapas', label: 'Do pedido ao suporte' },
  { value: '2+ Revisores', label: 'Conferência independente' },
  { value: '5 dias úteis', label: 'Troca assistida se houver ausência' },
];

export const CONTINUITY_LENS_LABELS: Record<StageLensId, string> = {
  fluxo: 'Fluxo',
  rede: 'Rede',
  blindagem: 'Respaldo',
};

export const CONTINUITY_STAGES: ContinuityStageItem[] = [
  {
    index: 0,
    kicker: '01 · Combinado',
    stageLabel: 'Combinado sem caixa-preta',
    title: 'Escuta real e combinado direto',
    body: 'Ouvimos a rotina da empresa antes de criar qualquer tela e registramos de forma clara o que será entregue.',
    defaultLens: 'fluxo',
    lensNotes: {
      fluxo: 'Escuta inicial em campo ou contato direto',
      rede: 'Demanda acolhida e registrada para a comunidade',
      blindagem: 'Escopo enxuto com critérios claros de aceitação',
    },
  },
  {
    index: 1,
    kicker: '02 · Centralização',
    stageLabel: 'Código em espaço central',
    title: 'Nada preso no PC de uma pessoa',
    body: 'Código, acessos e mudanças ficam no espaço central do projeto, usando tecnologias conhecidas — sem prender a empresa.',
    defaultLens: 'rede',
    lensNotes: {
      fluxo: 'Infraestrutura padronizada e fácil de manter',
      rede: 'Discord (#projetos-ativos) e repositório compartilhado',
      blindagem: 'Dados sintéticos (fictícios) em testes · foco em LGPD',
    },
  },
  {
    index: 2,
    kicker: '03 · Conferência',
    stageLabel: 'Olhar de 2+ pares',
    title: 'Conferido por 2+ revisores',
    body: 'Nenhuma entrega vai ao ar sozinha: pelo menos dois desenvolvedores revisam segurança, clareza e funcionamento.',
    defaultLens: 'blindagem',
    lensNotes: {
      fluxo: 'Aprovação coletiva antes de publicar',
      rede: '2+ revisores independentes na mesma entrega',
      blindagem: 'Revisão de segurança por pares e práticas de LGPD',
    },
  },
  {
    index: 3,
    kicker: '04 · Continuidade',
    stageLabel: 'Suporte e troca segura',
    title: 'Suporte e troca em 5 dias úteis',
    body: 'Há suporte nomeado no período combinado. Após 5 dias úteis sem retorno, registra-se vacância e outro par assume.',
    defaultLens: 'blindagem',
    lensNotes: {
      fluxo: 'Guia de uso e suporte no período combinado',
      rede: 'Passagem assistida de contexto entre membros no Discord',
      blindagem: 'Regra dos 5 dias úteis, revogação de acessos e suporte nomeado',
    },
    ctaLabel: 'Ver papéis e continuidade →',
    ctaHref: '/ciclo/#papeis',
  },
];

export const HOME_PILLARS: HomePillar[] = [
  {
    variant: 'arch',
    href: '/extensoes/',
    title: 'Extensões & Frentes',
    description:
      'As 6 extensões (Field, Dev, Make, Place, Work, Inline) e 6 frentes internas organizam o trabalho, da escuta inicial à governança.',
    tag: 'Extensões e Discord →',
  },
  {
    variant: 'xl',
    href: '/ciclo/',
    title: 'Ciclo de Entrega Assistida',
    description:
      'Após triagem, o Ciclo segue 6 etapas: entendimento, combinado escrito, construção, revisão por 2+ pares, testes e suporte nomeado no período combinado.',
    tag: '6 etapas do Ciclo →',
  },
  {
    variant: 'soft',
    href: '/governanca/',
    title: 'Qualidade, Segurança & LGPD',
    description:
      'Revisão de segurança por 2+ pares, verificação de dependências, sigilo, dados sintéticos (fictícios) e LGPD (Lei Geral de Proteção de Dados; não substitui assessoria jurídica).',
    tag: 'Ver qualidade e LGPD →',
  },
];

export const AUDIENCE_CARDS: AudienceCard[] = [
  {
    id: 'cardMicroempresa',
    badge: 'Microempresas Parceiras',
    title: 'Continuidade & Respaldo',
    description:
      'Evita entregas sem explicação: há combinado claro, chancela coletiva sem vínculo nem responsabilidade solidária e responsabilidade individual de cada par.',
    bullets: [
      'Escuta e triagem: pedido pode ser recusado com orientação se desproporcional',
      'Combinado (escopo escrito e testes) até a homologação (aprovação final)',
      'Conferência por 2+ revisores independentes (chancela coletiva da comunidade)',
      'Responsável de suporte nomeado no período combinado e cuidado com dados (LGPD)',
    ],
    ctaLabel: 'Ver as 6 etapas da entrega',
    ctaHref: '/ciclo/',
    ctaVariant: 'outline',
    featured: false,
  },
  {
    id: 'cardDesenvolvedor',
    badge: 'Desenvolvedores Independentes',
    title: 'Autonomia com Pares',
    description:
      'Troque o trabalho isolado pela rede técnica no Discord — sem vínculo empregatício, com responsabilidade profissional individual e troca aberta de guias.',
    bullets: [
      'Linter (padrão automático) e commits semânticos (histórico)',
      'Revisão por 2+ pares e testes apenas com dados sintéticos (LGPD)',
      'Registro em ficha (issue), envio (push) e transferência de contexto',
      'Após 5 dias úteis sem resposta, há vacância e revogação dos acessos',
    ],
    ctaLabel: 'Ver padrões & ética',
    ctaHref: '/governanca/',
    ctaVariant: 'primary',
    featured: true,
    secondaryCtaLabel: 'Entrar no Discord ↗',
    secondaryCtaHref: DISCORD_INVITE_URL,
    secondaryExternal: true,
  },
];

/* ==========================================================================
   Extensões, Frentes & Comunidade (/extensoes/)
   ========================================================================== */

export const IDENTITY_PILLARS: IdentityItem[] = [
  {
    title: 'Yukon (Canadá)',
    description:
      'Inspiração do nome Yuko: resistência, exploração prática e soluções sólidas para situações reais.',
  },
  {
    title: 'Oslo (Noruega)',
    description:
      'Referência de simplicidade, nomes fáceis de entender e clareza em cada entrega.',
  },
  {
    title: 'Verona (Itália)',
    description:
      'Compromisso com trabalho bem-feito, continuidade e registro organizado dos projetos.',
  },
];

export const VISUAL_RULES: IdentityItem[] = [
  {
    title: 'Logotipo & Tipografia',
    description:
      'A palavra "Yuko" em letra moderna e legível, acompanhada do símbolo da comunidade.',
  },
  {
    title: 'Simplicidade Visual',
    description:
      'Visual limpo, sem enfeites excessivos que atrapalhem a leitura em qualquer tela ou material.',
  },
  {
    title: 'Alto Contraste & Clareza',
    description:
      'Uso de preto, branco e tons de alto contraste para leitura confortável em qualquer situação.',
  },
];

export const EXTENSIONS: ExtensionItem[] = [
  {
    name: 'Yuko Field',
    description:
      'Conversa direta com microempresas para entender problemas reais antes de propor qualquer sistema.',
    code: 'escuta & contato',
    tone: 'default',
  },
  {
    name: 'Yuko Dev',
    description:
      'Construção do sistema, organização técnica, revisão entre pares e integração entre ferramentas.',
    code: 'construção',
    tone: 'tonal-primary',
  },
  {
    name: 'Yuko Make',
    description:
      'Rascunhos visuais rápidos, desenho de telas fáceis de usar e identidade visual das soluções.',
    code: 'telas & visual',
    tone: 'default',
  },
  {
    name: 'Yuko Place',
    description:
      'Espaço da comunidade para acolhimento, troca técnica e materiais compartilhados, em evolução gradual.',
    code: 'comunidade',
    tone: 'tonal-secondary',
  },
  {
    name: 'Yuko Work',
    description:
      'Organização dos combinados, divisão clara de papéis e acompanhamento dos prazos de entrega.',
    code: 'organização',
    tone: 'default',
  },
  {
    name: 'Yuko Inline',
    description:
      'Automações internas e scripts de apoio, em evolução gradual, para os projetos da comunidade.',
    code: 'automações',
    tone: 'tonal-tertiary',
  },
];

export const FRONTS: FrontItem[] = [
  {
    title: 'Organização e Execução',
    description:
      'Enquadramento dos pedidos, prazos combinados com clareza e cumprimento do que foi acordado.',
  },
  {
    title: 'Tecnologia e Desenvolvimento',
    description:
      'Escrita do sistema, escolha cuidadosa de tecnologias conhecidas e confiáveis, automações e publicação revisada.',
  },
  {
    title: 'Inteligência e Avaliação',
    description:
      'Análise se a solução vale a pena, comparação de ferramentas e apoio às decisões da empresa.',
  },
  {
    title: 'Gestão e Colaboração Multidisciplinar',
    description:
      'Sintonia entre quem programa, quem cuida das telas, infraestrutura e suporte combinado.',
  },
  {
    title: 'Integridade Informacional',
    description:
      'Preservação do histórico do projeto, guias simples de uso e controle transparente das versões.',
  },
  {
    title: 'Governança e Segurança',
    description:
      'Regras éticas de conduta, segurança digital, cuidado com os dados e indicadores de qualidade.',
  },
];

export const DISCORD_CHANNELS: DiscordChannelItem[] = [
  {
    title: 'Institucionais e Gerais',
    description:
      'avisos da comunidade, alinhamentos gerais e boas-vindas a novos membros.',
    kind: 'channel',
  },
  {
    title: 'Conhecimento Técnico',
    description:
      'troca aberta sobre linguagens, ferramentas, segurança e ajuda mútua para resolver dúvidas.',
    kind: 'channel',
  },
  {
    title: 'Operacionais e de Projetos',
    description:
      'canais dedicados a projetos ativos para combinar o que precisa ser feito, revisões e prazos.',
    kind: 'channel',
  },
  {
    title: 'Comunicação Construtiva',
    description:
      'Conversas baseadas em respeito profissional, clareza e colaboração mútua — sem ambiente tóxico ou propaganda abusiva.',
    kind: 'guideline',
  },
];

/* ==========================================================================
   Ciclo de Entrega Assistida, Papéis & Rastreabilidade (/ciclo/)
   ========================================================================== */

export const CYCLE_STAGES: CycleStage[] = [
  {
    title: '1. Pedido & Prioridade',
    description:
      'O pedido entra via Yuko Field ou contato direto. Pedidos desproporcionais não são atendidos; podem ser recusados ou repriorizados, com orientação.',
    code: 'etapa 01 · viabilidade',
    tone: 'tonal-primary',
  },
  {
    title: '2. Combinado & Escopo',
    description:
      'O executor registra um combinado (escopo escrito) com critérios de aceitação (condições para considerar a entrega pronta).',
    code: 'etapa 02 · combinado',
    tone: 'default',
  },
  {
    title: '3. Construção Organizada',
    description:
      'Código em repositório central com ficha de acompanhamento (issue de registro), linter (padrão automático) e commits semânticos (mensagens padronizadas).',
    code: 'etapa 03 · construção',
    tone: 'default',
  },
  {
    title: '4. Conferência por 2+ Pares',
    description:
      'Pelo menos 2 outros desenvolvedores (revisão por pares) conferem segurança, clareza e se tudo cumpre o combinado.',
    code: 'etapa 04 · 2+ revisores',
    tone: 'tonal-secondary',
  },
  {
    title: '5. Testes antes do Ar',
    description:
      'Testamos funcionamento, celular e velocidade em ambiente de testes (staging), com dados sintéticos (fictícios), antes da liberação.',
    code: 'etapa 05 · testes',
    tone: 'default',
  },
  {
    title: '6. Entrega & Suporte',
    description:
      'Homologação (aprovação final pela microempresa) e início do suporte por responsável nomeado, pelo período combinado.',
    code: 'etapa 06 · liberação',
    tone: 'tonal-tertiary',
  },
];

export const TRIAGE_CRITERIA: IdentityItem[] = [
  {
    title: 'Aderência & Impacto',
    description:
      'problema concreto do dia a dia que pode ser resolvido de forma direta e traz ganho claro para a empresa.',
  },
  {
    title: 'Capacidade Real',
    description:
      'disponibilidade real de quem vai construir e de 2+ revisores que dominem a tecnologia necessária.',
  },
  {
    title: 'Criticidade & Clareza',
    description:
      'urgência do problema para a microempresa e regras fáceis de transformar em critérios objetivos de aprovação.',
  },
  {
    title: 'Baixo Risco Externo',
    description:
      'menor dependência de serviços de terceiros ou conexões instáveis que fujam do controle do projeto.',
  },
];

export const ROLES: RoleItem[] = [
  {
    title: 'Desenvolvedor Executor',
    description:
      'Lidera a entrega na prática: define o combinado inicial, constrói a solução e alinha ajustes com revisores e com a empresa.',
    tone: 'default',
  },
  {
    title: 'Desenvolvedores Revisores',
    description:
      'Pelo menos 2 colegas independentes avaliam código, segurança e o combinado inicial; nada vai ao ar com apenas uma revisão.',
    tone: 'tonal-primary',
  },
  {
    title: 'Responsável de Suporte',
    description:
      'Profissional nomeado na entrega para acompanhar a estabilização, fazer ajustes iniciais e apoiar no período combinado.',
    tone: 'tonal-secondary',
  },
];

export const CONTINUITY_RULES: ContinuityRule[] = [
  {
    title: 'Transição Obrigatória de Contexto',
    description:
      'Na transferência de contexto antes de se afastar, o participante faz o envio (push) do código ao repositório central e registra pendências. É proibido reter código ou senhas apenas no computador pessoal.',
    tone: 'default',
  },
  {
    title: 'Regra de Vacância (5 dias úteis)',
    description:
      'Após 5 dias úteis sem resposta nem justificativa, registra-se a vacância na ficha de acompanhamento, os acessos são revogados e outro par assume a continuidade.',
    tone: 'tonal-tertiary',
  },
];

export const REGISTRY_COL_A: string[] = [
  'Código do pedido na ficha de acompanhamento (issue de registro);',
  'O que foi combinado e critérios de aceitação validados;',
  'Nomes de quem vai executar e dos 2+ revisores;',
];

export const REGISTRY_COL_B: string[] = [
  'Responsável de suporte nomeado e período combinado;',
  'Aprovações registradas na revisão por 2+ pares;',
  'Datas, repositório central e guia de transição.',
];

/* ==========================================================================
   Qualidade, Segurança, LGPD & Ética (/governanca/)
   ========================================================================== */

export const DOD_ITEMS: string[] = [
  'Combinado testado com dados sintéticos (fictícios);',
  'Commits semânticos (histórico claro) no repositório;',
  'Revisão por 2+ pares na ficha (issue de registro);',
  'Guia básico de uso entregue para a microempresa;',
  'Sem falhas graves conhecidas de segurança em aberto.',
];

export const STACK_ITEMS: IdentityItem[] = [
  {
    title: 'Padronização de Código',
    description: 'uso de linter (padronização automática de código) salvo junto ao projeto.',
  },
  {
    title: 'Histórico Organizado',
    description: 'commits semânticos (mensagens padronizadas por tipo de mudança) ligados à ficha do projeto.',
  },
  {
    title: 'Tecnologias Conhecidas',
    description: 'ferramentas confiáveis e maduras (Node.js/TypeScript, Python, Go, PHP e web padrão).',
  },
  {
    title: 'Bancos de Dados Estáveis',
    description: 'PostgreSQL, MySQL/MariaDB ou SQLite para guardar dados com integridade.',
  },
];

export const SECURITY_CARDS: SecurityCard[] = [
  {
    title: 'Validação de Entradas',
    description:
      'Revisão de segurança contra falhas comuns de entrada em formulários e rotas.',
    code: 'revisão 2+ pares',
  },
  {
    title: 'Senhas & Chaves Seguras',
    description:
      'Segredos fora do código-fonte, tráfego sob HTTPS (conexão cifrada) e hash de senhas (Argon2 ou bcrypt) no banco de dados.',
    code: 'https & hash de senhas',
  },
  {
    title: 'Checagem & Sigilo',
    description:
      'Verificação de dependências (bibliotecas de terceiros), controle de acessos por papel e sigilo sobre dados da empresa.',
    code: 'checagem de pacotes',
  },
];

export const LGPD_ITEMS: IdentityItem[] = [
  {
    title: 'Quem responde pelo quê',
    description:
      'a microempresa é a Controladora (decide sobre os dados); o desenvolvedor atua como Operador (segue instruções dela). Não substitui assessoria jurídica.',
  },
  {
    title: 'Só o essencial',
    description: 'sistema estruturado pensando na LGPD, com coleta mínima — apenas dados necessários ao funcionamento.',
  },
  {
    title: 'Testes sem dados reais',
    description: 'na criação e nos testes usamos dados sintéticos (fictícios ou mascarados), sem expor dados reais de clientes.',
  },
  {
    title: 'Titular & Incidentes',
    description:
      'recursos para o titular (dono dos dados) pedir acesso ou exclusão, e comunicação à empresa em caso de incidente, com registro restrito.',
  },
];

export const CONFLICT_STEPS: IdentityItem[] = [
  {
    title: '1. Diálogo Direto',
    description: 'conversa objetiva olhando os fatos técnicos e o que foi combinado.',
  },
  {
    title: '2. Mediação por Pares',
    description: 'um membro neutro ajuda a construir um acordo focado no projeto.',
  },
  {
    title: '3. Decisão Coletiva',
    description: 'revisores priorizam a solução mais simples e fiel ao combinado.',
  },
];

export const CONFLICT_PRINCIPLE: IdentityItem = {
  title: 'Autonomia',
  description: 'cada participante responde pelos próprios atos profissionais, sem vínculo.',
};

/* ==========================================================================
   Manual Institucional da Yuko — v1.0 & Glossário (/manual/)
   ========================================================================== */

export const CONTROL_TABLE: ControlRow[] = [
  {
    label: 'Documento & Versão',
    value: 'Manual Institucional da Yuko — 1.0 (Formalização Inicial)',
  },
  {
    label: 'Natureza',
    value: 'Guia público de regras, método de trabalho e operação da comunidade',
  },
  {
    label: 'Abrangência & Acesso',
    value: 'Comunidade Yuko, frentes e projetos em andamento · Documento aberto de uso comunitário',
  },
  {
    label: 'Revisão',
    value: 'Periódica, conforme a governança amadurece (v1.1, v2.0)',
  },
];

export const MANUAL_ORIGINS: ManualOriginCard[] = [
  {
    title: '1. Ressalvas Jurídicas & Ausência de Vínculo',
    tone: 'default',
    paragraphs: [
      'Manual de caráter orientativo e comunitário; não substitui contratos formais, estatutos sociais ou pareceres jurídicos.',
      'A participação voluntária não gera vínculo empregatício, societário ou representação legal. Relações comerciais exigem contrato bilateral autônomo.',
    ],
  },
  {
    title: '2. Linhagem: NYX → Expliance → Yuko',
    tone: 'tonal-primary',
    lineage: [
      {
        label: 'NYX',
        text: 'experimentação inicial em desenvolvimento colaborativo e conexão de talentos.',
      },
      {
        label: 'Expliance',
        text: 'organização das regras, frentes de trabalho e padrões operacionais.',
      },
      {
        label: 'Yuko',
        text: 'modelo enxuto e rastreável, eliminando burocracia sem perder rigor técnico.',
      },
    ],
  },
  {
    title: '3. Implantação Gradual & Gestão Enxuta',
    tone: 'tonal-tertiary',
    paragraphs: [
      'Estruturas, papéis e áreas evoluem aos poucos, sem exigir carteira fixa de clientes nem equipe permanente.',
      'Qualquer etapa burocrática que atrase a entrega sem ganho real deve ser simplificada; qualquer membro ativo pode propor melhorias.',
    ],
  },
  {
    title: 'Guia Rápido de Navegação',
    tone: 'tonal-secondary',
    links: [
      {
        label: 'Início',
        href: '/',
        description: 'propósito, garantia de continuidade, resumo das etapas e quem atendemos.',
      },
      {
        label: 'Extensões',
        href: '/extensoes/',
        description: 'marca, 6 áreas de atuação, 6 frentes internas e Discord.',
      },
      {
        label: 'Ciclo',
        href: '/ciclo/',
        description: '6 etapas assistidas, papéis, proteção contra abandono e ficha do projeto.',
      },
      {
        label: 'Qualidade & LGPD',
        href: '/governanca/',
        description: 'conferência final, tecnologias, segurança, LGPD e mediação.',
      },
    ],
  },
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Ambiente de Testes (Staging)',
    definition:
      'Espaço separado do sistema oficial onde testamos funcionamento, uso no celular, velocidade e segurança com dados fictícios antes da liberação para a empresa.',
  },
  {
    term: 'Ciclo de Entrega Assistida',
    definition:
      'Fluxo em seis etapas em que todo projeto passa por combinado claro, construção organizada, revisão por 2+ pares, testes e suporte definido após a entrega.',
  },
  {
    term: 'Histórico Organizado (Commits Semânticos)',
    definition:
      'Padrão de registro das mudanças no código (novidade, correção, ajuste ou guia) ligadas à ficha do projeto para facilitar a leitura por qualquer desenvolvedor.',
  },
  {
    term: 'Conformidade LGPD (Controladora & Operadores)',
    definition:
      'Enquadramento na Lei nº 13.709/2018 em que a microempresa é a Controladora (decide sobre os dados) e os desenvolvedores são Operadores técnicos (executam com coleta mínima e sigilo).',
    tone: 'tertiary',
  },
  {
    term: 'Critério de Pronto (DoD · Definition of Done)',
    definition:
      'Lista de conferência obrigatória antes de entregar: combinado testado funcionando, histórico salvo no espaço central, revisão por 2+ pares, guia básico de uso e zero falhas graves.',
    tone: 'primary',
  },
  {
    term: 'Critérios de Aceitação',
    definition:
      'Condições claras combinadas antes do início do projeto para que a microempresa saiba exatamente quando a entrega está pronta e aprovada.',
  },
  {
    term: 'Dados Sintéticos',
    definition:
      'Dados fictícios ou mascarados usados exclusivamente durante a criação e os testes para proteger informações reais dos clientes da microempresa.',
  },
  {
    term: 'Desenvolvedor Executor',
    definition:
      'Participante que lidera a construção na prática: transforma o pedido em combinado enxuto, desenvolve a solução e alinha ajustes com revisores e parceiro.',
  },
  {
    term: 'Desenvolvedores Revisores',
    definition:
      'Pelo menos dois colegas independentes que conferem código, segurança e aderência ao combinado; nenhuma entrega vai ao ar com revisão de uma pessoa só.',
  },
  {
    term: 'Extensões da Marca',
    definition:
      'Áreas públicas sob o nome Yuko (Field, Dev, Make, Place, Work e Inline) que cobrem escuta com empresas, construção, telas, comunidade, organização e automações.',
  },
  {
    term: 'Frentes de Atuação',
    definition:
      'Seis disciplinas internas aplicadas em cada projeto: Organização e Execução, Tecnologia e Desenvolvimento, Inteligência e Avaliação, Gestão Multidisciplinar, Integridade Informacional e Governança e Segurança.',
  },
  {
    term: 'Ficha de Acompanhamento (Issue de Registro)',
    definition:
      'Registro oficial obrigatório que centraliza número do projeto, combinado aprovado, nomes de executor, revisores e suporte, aprovações e guia de transição.',
  },
  {
    term: 'Responsável de Suporte',
    definition:
      'Desenvolvedor indicado nominalmente na entrega para acompanhar os primeiros dias de uso e fazer ajustes rápidos no período combinado.',
    tone: 'secondary',
  },
  {
    term: 'Revisão por Pares (Peer Review)',
    definition:
      'Conferência obrigatória feita por pelo menos dois outros desenvolvedores independentes para checar clareza, segurança e cumprimento do combinado antes dos testes finais.',
  },
  {
    term: 'Transição de Contexto & Regra de Abandono',
    definition:
      'Envio obrigatório do código e anotações antes de qualquer afastamento; após 5 dias úteis sem resposta nem justificativa, a ficha registra vacância e outro colega assume na hora.',
  },
];


/* ==========================================================================
   Simulador de Perfil & Formulação Assistida (#simulador)
   ========================================================================== */

export type SimulatorPerspective = 'empresa' | 'cliente' | 'desenvolvedor';
export type SimulatorScopeSize = 'essencial' | 'completo';
export type SimulatorSituation = 'zero' | 'existente' | 'resgate';
export type SimulatorDevRole = 'executor' | 'revisor' | 'suporte';
export type SimulatorSolutionId =
  | 'site-presenca'
  | 'agenda-pedidos'
  | 'cadastro-rotina'
  | 'automacao-ferramentas'
  | 'casa-em-ordem'
  | 'resgate-sistema';

export interface SimulatorSolutionCard {
  id: SimulatorSolutionId;
  shortTitle: string;
  categoryDescription: string;
  profileTitle: string;
  profileBadge: string;
  shortSummary: string;
  clientShortSummary: string;
  humanSummary: string;
  clientProfileHook: string;
  extensions: string[];
  discordChannel: string;
  baseDaysMin: number;
  baseDaysMax: number;
  basePriceMin: number;
  basePriceMax: number;
}

export interface SimulatorDevProfileMeta {
  label: string;
  profileTitle: string;
  profileBadge: string;
  shortSummary: string;
  humanSummary: string;
}

export const SIMULATOR_PERSPECTIVE_OPTIONS: {
  id: SimulatorPerspective;
  label: string;
}[] = [
  { id: 'empresa', label: 'Empresa' },
  { id: 'cliente', label: 'Cliente' },
  { id: 'desenvolvedor', label: 'Dev' },
];

export const SIMULATOR_SOLUTIONS: SimulatorSolutionCard[] = [
  {
    id: 'site-presenca',
    shortTitle: 'Site & Presença',
    categoryDescription: 'Crie ou melhore seu site e fortaleça sua presença digital.',
    profileTitle: 'Presença com Respaldo',
    profileBadge: 'Acolhimento Digital',
    shortSummary: 'Negócio no ar, leve, rápido e acessível.',
    clientShortSummary: 'Horários, serviços e contato oficial em poucos toques.',
    humanSummary:
      'Seu negócio no ar com contato direto, leitura clara e acesso rápido no celular.',
    clientProfileHook:
      'Horários, serviços e WhatsApp oficial com acesso rápido e seguro no celular.',
    extensions: ['Yuko Field', 'Yuko Make', 'Yuko Dev', 'Yuko Work'],
    discordChannel: '#projetos-ativos',
    baseDaysMin: 5,
    baseDaysMax: 10,
    basePriceMin: 1200,
    basePriceMax: 2600,
  },
  {
    id: 'agenda-pedidos',
    shortTitle: 'Agenda & Pedidos',
    categoryDescription: 'Organize agendamentos, reservas e pedidos em um fluxo mais simples.',
    profileTitle: 'Atendimento sem Atrito',
    profileBadge: 'Ritmo de Balcão',
    shortSummary: 'Horários e pedidos organizados sem perder mensagens.',
    clientShortSummary: 'Agendamento ou pedido em poucos toques, sem cadastro.',
    humanSummary:
      'Horários e pedidos organizados sem perder mensagens ou pedir cadastros extras.',
    clientProfileHook:
      'Agendamento ou pedido direto em poucos toques, sem preencher formulários longos.',
    extensions: ['Yuko Field', 'Yuko Make', 'Yuko Dev', 'Yuko Work'],
    discordChannel: '#projetos-ativos',
    baseDaysMin: 10,
    baseDaysMax: 20,
    basePriceMin: 2800,
    basePriceMax: 5400,
  },
  {
    id: 'cadastro-rotina',
    shortTitle: 'Rotina Interna',
    categoryDescription: 'Simplifique tarefas, processos e controles do dia a dia.',
    profileTitle: 'Rotina Leve & Segura',
    profileBadge: 'Gestão Central',
    shortSummary: 'Clientes, ordens e estoque em um só lugar.',
    clientShortSummary: 'Atendimento ágil com histórico organizado à mão.',
    humanSummary:
      'Clientes, ordens ou estoque em um só lugar, substituindo planilhas soltas.',
    clientProfileHook:
      'Atendimento mais ágil porque a equipe encontra seu histórico sem demora.',
    extensions: ['Yuko Field', 'Yuko Make', 'Yuko Dev', 'Yuko Work', 'Yuko Place'],
    discordChannel: '#projetos-ativos',
    baseDaysMin: 15,
    baseDaysMax: 28,
    basePriceMin: 3800,
    basePriceMax: 7800,
  },
  {
    id: 'automacao-ferramentas',
    shortTitle: 'Automações',
    categoryDescription: 'Conecte ferramentas e automatize tarefas repetitivas.',
    profileTitle: 'Operação Conectada',
    profileBadge: 'Ponte Enxuta',
    shortSummary: 'Conecta formulários, planilhas e avisos sem retrabalho.',
    clientShortSummary: 'Confirmação rápida e respostas consistentes a cada pedido.',
    humanSummary:
      'Liga formulário, planilha e avisos da equipe para acabar com o retrabalho manual.',
    clientProfileHook:
      'Confirmação rápida e respostas consistentes após o envio do seu pedido.',
    extensions: ['Yuko Field', 'Yuko Inline', 'Yuko Dev', 'Yuko Work'],
    discordChannel: '#conhecimento-tecnico',
    baseDaysMin: 5,
    baseDaysMax: 14,
    basePriceMin: 1500,
    basePriceMax: 3600,
  },
  {
    id: 'casa-em-ordem',
    shortTitle: 'Segurança & LGPD',
    categoryDescription: 'Organize acessos pensando na LGPD; não substitui assessoria jurídica.',
    profileTitle: 'Base Organizada (LGPD)',
    profileBadge: 'Cuidado & Sigilo',
    shortSummary: 'Coleta mínima e dados sintéticos pensando na LGPD.',
    clientShortSummary: 'Coleta mínima, acesso restrito e direitos dos titulares.',
    humanSummary:
      'Projetado para LGPD (controladora e operador); não substitui assessoria jurídica.',
    clientProfileHook:
      'Acesso restrito, coleta mínima, dados sintéticos em testes e respeito aos titulares.',
    extensions: ['Yuko Field', 'Yuko Dev', 'Yuko Work', 'Yuko Place'],
    discordChannel: '#conhecimento-tecnico',
    baseDaysMin: 5,
    baseDaysMax: 10,
    basePriceMin: 1200,
    basePriceMax: 3000,
  },
  {
    id: 'resgate-sistema',
    shortTitle: 'Resgate',
    categoryDescription:
      'Recupere ou estabilize soluções digitais que apresentam problemas ou precisam de continuidade.',
    profileTitle: 'Retomada Assistida',
    profileBadge: 'Continuidade Ativa',
    shortSummary: 'Retoma o sistema com suporte no período combinado.',
    clientShortSummary: 'Serviço estável de volta com acompanhamento técnico.',
    humanSummary:
      'Retoma o sistema no repositório central, com responsável de suporte pelo período combinado.',
    clientProfileHook:
      'O serviço volta a funcionar de forma estável, com suporte no período combinado.',
    extensions: ['Yuko Field', 'Yuko Dev', 'Yuko Work', 'Yuko Inline'],
    discordChannel: '#projetos-ativos',
    baseDaysMin: 7,
    baseDaysMax: 18,
    basePriceMin: 1800,
    basePriceMax: 4800,
  },
];

export const SIMULATOR_DEV_PROFILES: Record<SimulatorDevRole, SimulatorDevProfileMeta> = {
  executor: {
    label: 'Executar',
    profileTitle: 'Par Executor em Rede',
    profileBadge: 'Autonomia & Ficha',
    shortSummary: 'Faz combinado escrito e constrói no espaço central.',
    humanSummary:
      'Registra o combinado por escrito e constrói no repositório central.',
  },
  revisor: {
    label: 'Revisar 2+',
    profileTitle: 'Guardião de Revisão (2+)',
    profileBadge: 'Olhar Independente',
    shortSummary: 'Valida segurança, LGPD e clareza antes de publicar.',
    humanSummary:
      'Valida segurança, LGPD e clareza junto a outro revisor (2+ pares).',
  },
  suporte: {
    label: 'Apoiar',
    profileTitle: 'Referência de Continuidade',
    profileBadge: 'Pós-Entrega Ativo',
    shortSummary: 'Acompanha em produção no período combinado e apoia transições.',
    humanSummary:
      'Acompanha o sistema no período combinado e apoia a transição em ausências.',
  },
};
