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
  { value: 'Zero abandono', label: 'Suporte garantido após a entrega' },
];

export const CONTINUITY_LENS_LABELS: Record<StageLensId, string> = {
  fluxo: 'Fluxo',
  rede: 'Rede',
  blindagem: 'Blindagem',
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
      blindagem: 'Escopo enxuto com critérios claros de aceite',
    },
  },
  {
    index: 1,
    kicker: '02 · Centralização',
    stageLabel: 'Código sempre acessível',
    title: 'Nada preso no PC de uma pessoa',
    body: 'Código, acessos e mudanças ficam no espaço central do projeto, usando tecnologias conhecidas — sem prender a empresa.',
    defaultLens: 'rede',
    lensNotes: {
      fluxo: 'Infraestrutura padronizada e fácil de manter',
      rede: 'Discord (#projetos-ativos) e repositório compartilhado',
      blindagem: 'Zero dados reais em testes · privacidade desde a base',
    },
  },
  {
    index: 2,
    kicker: '03 · Conferência',
    stageLabel: 'Olhar de 2+ pares',
    title: 'Conferido por 2+ profissionais',
    body: 'Nenhuma entrega vai ao ar sozinha: pelo menos dois desenvolvedores revisam segurança, clareza e funcionamento.',
    defaultLens: 'blindagem',
    lensNotes: {
      fluxo: 'Aprovação coletiva antes de publicar',
      rede: '2+ revisores independentes na mesma entrega',
      blindagem: 'Conferência contra falhas comuns e proteção LGPD',
    },
  },
  {
    index: 3,
    kicker: '04 · Continuidade',
    stageLabel: 'Suporte e troca segura',
    title: 'Suporte garantido contra abandono',
    body: 'Cada entrega tem suporte nominal. Se houver ausência por 5 dias úteis, outro profissional assume sem perda.',
    defaultLens: 'blindagem',
    lensNotes: {
      fluxo: 'Guia direto de uso e suporte pós-entrega definido',
      rede: 'Passagem assistida de contexto entre membros no Discord',
      blindagem: 'Regra anti-abandono em 5 dias úteis e suporte registrado',
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
      'Field, Dev, Make, Place, Work e Inline organizam cada entrega do começo ao fim — da conversa inicial à segurança dos seus dados.',
    tag: 'Ver áreas e Discord →',
  },
  {
    variant: 'xl',
    href: '/ciclo/',
    title: 'Ciclo de Entrega Assistida',
    description:
      'Todo pedido passa por 6 etapas claras: entendimento, combinado escrito, construção, conferência por 2+ desenvolvedores, testes e suporte garantido.',
    tag: 'Ver as 6 etapas →',
  },
  {
    variant: 'soft',
    href: '/governanca/',
    title: 'Qualidade, Segurança & LGPD',
    description:
      'Lista de conferência antes da entrega, proteção contra invasões, sigilo sobre o negócio, testes sem dados reais e respeito à LGPD (Lei Geral de Proteção de Dados).',
    tag: 'Ver qualidade e LGPD →',
  },
];

export const AUDIENCE_CARDS: AudienceCard[] = [
  {
    id: 'cardMicroempresa',
    badge: 'Microempresas Parceiras',
    title: 'Continuidade & Respaldo',
    description:
      'Acaba com entregas sem explicação e o medo de ficar sem apoio: tudo tem combinado claro, conferência coletiva e suporte depois do lançamento.',
    bullets: [
      'Conversa inicial sobre a rotina real via Yuko Field ou contato direto',
      'Combinado enxuto deixando claro o que será entregue e como testar',
      'Conferência por pelo menos 2 revisores independentes antes da entrega',
      'Responsável de suporte com nome definido e sigilo de dados conforme a LGPD',
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
      'Troque o trabalho isolado por uma rede colaborativa de revisão e apoio técnico no Discord — sem vínculo empregatício nem burocracia de empresa.',
    bullets: [
      'Liberdade para escolher tecnologias conhecidas e confiáveis',
      'Revisão por 2+ pares antes de qualquer liberação ao cliente',
      'Operação coordenada no Discord com fichas claras de acompanhamento',
      'Reaproveitamento aberto de ferramentas, guias e boas práticas',
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
      'Construção do sistema, organização técnica, trabalho em dupla e integração entre ferramentas.',
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
      'Ponto de encontro da comunidade para eventos, acolhimento de novos membros e materiais compartilhados.',
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
      'Automações internas e ferramentas de apoio que facilitam o trabalho diário da comunidade.',
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
      'Escrita do sistema, escolha cuidadosa de tecnologias conhecidas e confiáveis, automações e publicação segura.',
  },
  {
    title: 'Inteligência e Avaliação',
    description:
      'Análise se a solução vale a pena, comparação de ferramentas e apoio às decisões da empresa.',
  },
  {
    title: 'Gestão e Colaboração Multidisciplinar',
    description:
      'Sintonia entre quem programa, quem cuida da facilidade de uso, servidores e suporte contínuo.',
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
      'O pedido chega pela conversa com a área Yuko Field ou contato direto. Avaliamos se atende bem ao negócio e se há equipe disponível.',
    code: 'etapa 01 · viabilidade',
    tone: 'tonal-primary',
  },
  {
    title: '2. Combinado & Escopo',
    description:
      'Quem vai executar transforma o pedido em um combinado enxuto, com regras claras para a empresa aprovar a entrega.',
    code: 'etapa 02 · combinado',
    tone: 'default',
  },
  {
    title: '3. Construção Organizada',
    description:
      'O sistema é construído em espaço central, com histórico organizado de alterações e anotações simples para outros membros acompanharem.',
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
      'Testamos funcionamento, uso no celular, velocidade e integridade em um ambiente de testes separado antes de liberar para a empresa.',
    code: 'etapa 05 · testes',
    tone: 'default',
  },
  {
    title: '6. Entrega & Suporte',
    description:
      'Aprovação final junto à microempresa e início do período de suporte com um responsável técnico registrado.',
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
      'Acompanha a estabilização após o lançamento, corrige ajustes imediatos e cuida do sistema no período combinado.',
    tone: 'tonal-secondary',
  },
];

export const CONTINUITY_RULES: ContinuityRule[] = [
  {
    title: 'Transição Obrigatória de Contexto',
    description:
      'Antes de se afastar, o participante envia todo o código para o espaço central e registra tarefas, decisões e pendências. É proibido reter código ou senhas apenas no computador pessoal.',
    tone: 'default',
  },
  {
    title: 'Abandono (5 dias úteis) & Proteção',
    description:
      'Após 5 dias úteis sem resposta nem justificativa, registra-se a vaga aberta na ficha de acompanhamento, os acessos são bloqueados e outro par assume imediatamente para proteger a microempresa.',
    tone: 'tonal-tertiary',
  },
];

export const REGISTRY_COL_A: string[] = [
  'Código único do pedido na ficha oficial de acompanhamento;',
  'O que foi combinado entregar e critérios de aprovação validados;',
  'Nomes de quem vai executar e dos 2+ revisores;',
];

export const REGISTRY_COL_B: string[] = [
  'Nome completo do responsável pelo suporte após a entrega;',
  'Aprovações registradas na conferência por 2+ pares;',
  'Datas, endereço do código e guia de transição.',
];

/* ==========================================================================
   Qualidade, Segurança, LGPD & Ética (/governanca/)
   ========================================================================== */

export const DOD_ITEMS: string[] = [
  'Combinado inicial testado e funcionando na prática;',
  'Histórico organizado de alterações salvo no espaço central;',
  'Conferência por 2+ pares devidamente registrada;',
  'Guia básico de uso entregue para a microempresa;',
  'Sem falhas graves ou riscos de segurança abertos.',
];

export const STACK_ITEMS: IdentityItem[] = [
  {
    title: 'Padronização de Código',
    description: 'regras automáticas de limpeza e organização salvas junto ao projeto.',
  },
  {
    title: 'Histórico Organizado',
    description: 'cada alteração (novidade, correção, ajuste ou guia) fica marcada e ligada à ficha do projeto.',
  },
  {
    title: 'Tecnologias Conhecidas',
    description: 'ferramentas confiáveis e maduras (Node.js/TypeScript, Python, Go, PHP e web padrão).',
  },
  {
    title: 'Bancos de Dados Estáveis',
    description: 'PostgreSQL, MySQL/MariaDB ou SQLite para guardar dados com segurança.',
  },
];

export const SECURITY_CARDS: SecurityCard[] = [
  {
    title: 'Prevenção de Invasões',
    description:
      'Protegemos formulários contra invasões, comandos e códigos maliciosos.',
    code: 'proteção ativa',
  },
  {
    title: 'Senhas & Chaves Seguras',
    description:
      'Senhas e chaves nunca ficam no código público; conexões sempre criptografadas (HTTPS) e senhas protegidas (Argon2 ou bcrypt).',
    code: 'https & senhas seguras',
  },
  {
    title: 'Checagem & Sigilo',
    description:
      'Verificação contínua das ferramentas usadas, controle responsável de acessos e sigilo sobre os dados da microempresa.',
    code: 'auditoria contínua',
  },
];

export const LGPD_ITEMS: IdentityItem[] = [
  {
    title: 'Quem responde pelo quê',
    description:
      'Sua microempresa atua como Controladora (dona das decisões sobre os dados) e os desenvolvedores atuam como Operadores técnicos (seguem suas instruções).',
  },
  {
    title: 'Só o essencial',
    description: 'coleta mínima de informações, apenas o estritamente necessário para o sistema funcionar.',
  },
  {
    title: 'Testes sem dados reais',
    description: 'durante a criação e os testes, usamos apenas dados fictícios ou mascarados — nunca dados reais de clientes.',
  },
  {
    title: 'Direitos & Avisos Rápidos',
    description:
      'facilidade para a pessoa dona dos dados (titular) pedir cópia ou exclusão, e aviso rápido à empresa em caso de problema, registrado de forma restrita.',
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
  description: 'cada participante responde pelos seus próprios atos profissionais.',
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
   Simulador Prático de Pedido & Atuação na Yuko (#simulador)
   ========================================================================== */

export type SimulatorPerspective = 'empresa' | 'desenvolvedor';
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

export interface SimulatorSolutionItem {
  id: SimulatorSolutionId;
  title: string;
  shortTag: string;
  popularSummary: string;
  clientDeliverable: string;
  devFocus: string;
  extensions: string[];
  discordFocus: string;
  baseDaysMin: number;
  baseDaysMax: number;
  basePriceMin: number;
  basePriceMax: number;
  clientNeeds: string[];
  runningNote: string;
  teamSummary: string;
}

export interface SimulatorStageBlueprint {
  step: number;
  title: string;
  extensionTag: string;
  discordChannel: string;
  empresaAction: string;
  devActionByRole: Record<SimulatorDevRole, string>;
  manualRule: string;
  manualHref: string;
  manualLinkLabel: string;
}

export interface SimulatorStressScenario {
  id: 'ausencia' | 'dados-reais';
  buttonLabel: string;
  alertTitle: string;
  responseText: string;
  guaranteeBadge: string;
  ruleHref: string;
  ruleLabel: string;
}

export const SIMULATOR_EXTENSION_LABELS: Record<string, string> = {
  'Yuko Field': 'Yuko Field (escuta)',
  'Yuko Make': 'Yuko Make (telas)',
  'Yuko Dev': 'Yuko Dev (construção)',
  'Yuko Work': 'Yuko Work (organização)',
  'Yuko Inline': 'Yuko Inline (automações)',
  'Yuko Place': 'Yuko Place (comunidade)',
  Governança: 'Qualidade & LGPD',
};

export const SIMULATOR_SOLUTIONS: SimulatorSolutionItem[] = [
  {
    id: 'site-presenca',
    title: 'Site da Empresa & Presença Segura',
    shortTag: 'Vitrine & Contato',
    popularSummary:
      'Página clara da microempresa para ser encontrada na internet, apresentar serviços e receber contatos no WhatsApp ou formulário protegido.',
    clientDeliverable:
      'Site rápido no celular e no computador, com cadeado de segurança (HTTPS), formulário protegido contra mensagens automáticas indesejadas, guia simples de edição e acessos no nome da empresa.',
    devFocus:
      'Montar telas leves e acessíveis com tecnologia conhecida e segura, registrar cada mudança na ficha de acompanhamento e validar tudo em ambiente separado de testes antes da entrega.',
    extensions: ['Yuko Field', 'Yuko Make', 'Yuko Dev', 'Yuko Work'],
    discordFocus: '#projetos-ativos (Operacionais e de Projetos) · #conhecimento-tecnico',
    baseDaysMin: 5,
    baseDaysMax: 10,
    basePriceMin: 1200,
    basePriceMax: 2600,
    clientNeeds: [
      'Logotipo, fotos reais do negócio ou autorização para usar imagens livres;',
      'Textos simples com endereço, horário de atendimento e principais serviços;',
      'Acesso ao nome do site (domínio) em conta da própria microempresa;',
      'Nenhuma lista real de clientes para testes — usamos apenas informações inventadas de exemplo.',
    ],
    runningNote:
      'Após ir ao ar, o endereço oficial segue com cadeado de segurança (HTTPS), cópias de segurança periódicas e pessoa definida para o suporte para ajustes iniciais.',
    teamSummary:
      '1 desenvolvedor executor organiza e constrói, pelo menos 2 revisores conferem clareza e segurança, e 1 responsável de suporte acompanha os primeiros dias.',
  },
  {
    id: 'agenda-pedidos',
    title: 'Agenda & Pedidos sem Confusão',
    shortTag: 'Horários & Pedidos',
    popularSummary:
      'Sistema direto para marcar horários, registrar pedidos do dia a dia e avisar cliente e equipe sem perder recados em conversas soltas.',
    clientDeliverable:
      'Painel simples de agenda e pedidos funcionando no celular, com senhas protegidas, registro apenas dos dados necessários e treinamento prático para a equipe usar no balcão.',
    devFocus:
      'Desenhar fluxo enxuto com rascunhos visuais aprovados antes, construir em espaço central com tecnologia conhecida e segura e testar cada regra com informações inventadas de exemplo.',
    extensions: ['Yuko Field', 'Yuko Make', 'Yuko Dev', 'Yuko Work'],
    discordFocus: '#projetos-ativos (Operacionais e de Projetos)',
    baseDaysMin: 10,
    baseDaysMax: 20,
    basePriceMin: 2800,
    basePriceMax: 5400,
    clientNeeds: [
      'Regras reais de horário, duração dos atendimentos e forma de confirmação;',
      'Lista dos campos estritamente necessários no pedido (sem pedir dados extras sem motivo);',
      'Definição de quem da empresa será a pessoa dona das decisões sobre os dados (Controladora);',
      'Exemplos inventados de serviços e horários para validar o ambiente separado de testes.',
    ],
    runningNote:
      'A empresa continua dona do cadastro e das regras, com rotina de cópia de segurança e responsável de suporte registrado para ajustes rápidos.',
    teamSummary:
      '1 executor conduz o combinado e a construção, 2+ revisores independentes checam proteção contra falhas e LGPD, e 1 responsável de suporte acompanha a estabilização.',
  },
  {
    id: 'cadastro-rotina',
    title: 'Cadastro & Controle da Rotina',
    shortTag: 'Gestão Interna',
    popularSummary:
      'Organiza clientes, serviços, estoque ou tarefas internas em um único lugar seguro, substituindo planilhas espalhadas e cadernos.',
    clientDeliverable:
      'Sistema interno com controle de quem pode ver ou editar cada área, busca rápida, histórico de alterações importantes, guia de uso e lista de conferência final validada.',
    devFocus:
      'Estruturar banco de informações estável com tecnologia conhecida e segura, separar acessos por perfil, manter registro organizado das mudanças e passar por conferência dupla de segurança.',
    extensions: ['Yuko Field', 'Yuko Make', 'Yuko Dev', 'Yuko Work', 'Yuko Place'],
    discordFocus: '#projetos-ativos (Operacionais e de Projetos) · #conhecimento-tecnico',
    baseDaysMin: 15,
    baseDaysMax: 28,
    basePriceMin: 3800,
    basePriceMax: 7800,
    clientNeeds: [
      'Modelo das planilhas ou fichas usadas hoje (em branco ou com informações inventadas de exemplo);',
      'Definição clara de quem pode cadastrar, alterar ou apagar registros na empresa;',
      'Regras para atender pedidos de cópia ou exclusão de dados quando uma pessoa solicitar (LGPD);',
      'Disponibilidade para aprovar cada etapa no ambiente separado de testes.',
    ],
    runningNote:
      'Inclui rotina combinada de cópias de segurança, cadeado de segurança (HTTPS), registro de acessos e guia de transição para que a empresa nunca fique refém de uma pessoa.',
    teamSummary:
      'Trabalho coordenado na ficha de acompanhamento: 1 executor, 2+ revisores obrigatórios focados em segurança e clareza, e 1 responsável de suporte pós-entrega.',
  },
  {
    id: 'automacao-ferramentas',
    title: 'Conexão entre Ferramentas & Automações',
    shortTag: 'Menos Retrabalho',
    popularSummary:
      'Liga formulários, planilhas, alertas e sistemas que a empresa já usa para evitar digitar a mesma informação duas vezes.',
    clientDeliverable:
      'Rotina automática testada com avisos de falha, senhas e códigos de ligação guardados em cofre seguro (fora do programa), painel ou registro simples de execução e manual direto de manutenção.',
    devFocus:
      'Usar tecnologia conhecida e segura para conectar ferramentas com menor dependência externa possível, proteger senhas e códigos de ligação guardados em cofre seguro (fora do programa) e validar cenários de erro no ambiente separado de testes.',
    extensions: ['Yuko Field', 'Yuko Inline', 'Yuko Dev', 'Yuko Work'],
    discordFocus: '#projetos-ativos (Operacionais e de Projetos) · #conhecimento-tecnico',
    baseDaysMin: 5,
    baseDaysMax: 14,
    basePriceMin: 1500,
    basePriceMax: 3600,
    clientNeeds: [
      'Lista das ferramentas atuais e de quais dados realmente precisam passar de uma para outra;',
      'Contas de teste separadas (sem usar dados reais de clientes durante a montagem);',
      'Indicação do que deve acontecer caso alguma ferramenta externa fique fora do ar;',
      'Contato da pessoa que receberá os alertas de acompanhamento.',
    ],
    runningNote:
      'As senhas e códigos de ligação guardados em cofre seguro (fora do programa) ficam sob guarda da empresa em local seguro, com monitoramento básico de falhas e pessoa definida para o suporte no período combinado.',
    teamSummary:
      '1 executor monta as ligações com apoio da frente de automações, 2+ revisores checam riscos externos e sigilo, e 1 responsável de suporte acompanha os primeiros ciclos.',
  },
  {
    id: 'casa-em-ordem',
    title: 'Casa em Ordem: Cópias, Senhas & LGPD',
    shortTag: 'Proteção & LGPD',
    popularSummary:
      'Revisão prática para organizar senhas, ativar cadeado de segurança (HTTPS), garantir cópias de reserva e adequar cadastros às regras da LGPD.',
    clientDeliverable:
      'Cofre de acessos no nome da empresa, cópias automáticas testadas na prática, redução de dados coletados sem necessidade e cartilha simples de sigilo e resposta rápida a incidentes.',
    devFocus:
      'Auditar permissões, retirar senhas soltas de arquivos ou conversas, reforçar proteção de login e conferir coleta mínima conforme o enquadramento Controladora e Operadores.',
    extensions: ['Yuko Field', 'Yuko Dev', 'Yuko Work', 'Yuko Place'],
    discordFocus: '#conhecimento-tecnico · #projetos-ativos (Operacionais e de Projetos)',
    baseDaysMin: 5,
    baseDaysMax: 10,
    basePriceMin: 1200,
    basePriceMax: 3000,
    clientNeeds: [
      'Lista completa dos sites, contas, e-mails e sistemas onde a empresa guarda dados hoje;',
      'Permissão temporária para o trabalho técnico com sigilo registrado;',
      'Definição do canal oficial para avisos rápidos caso ocorra algum incidente com dados;',
      'Tempo curto da gestão para trocar senhas mestras e guardar os acessos no cofre da empresa.',
    ],
    runningNote:
      'Ao final, todas as senhas definitivas pertencem apenas à microempresa, com teste comprovado de recuperação de cópia de segurança e guia objetivo de boas práticas.',
    teamSummary:
      '1 executor conduz a organização e os testes de recuperação, 2+ revisores auditam os pontos críticos e 1 responsável de suporte acompanha a adaptação da equipe.',
  },
  {
    id: 'resgate-sistema',
    title: 'Resgate de Sistema Parado ou sem Apoio',
    shortTag: 'Continuidade Real',
    popularSummary:
      'Retomada segura de um site ou sistema que ficou parado, sem manutenção ou preso com quem não responde mais.',
    clientDeliverable:
      'Levantamento honesto do que funciona e do que precisa de ajuste, código salvo em espaço central acessível à empresa, correções prioritárias e novo responsável de suporte definido.',
    devFocus:
      'Centralizar arquivos e acessos em espaço compartilhado, criar registro organizado das mudanças, estabilizar riscos urgentes em ambiente separado de testes e documentar tudo para não repetir o bloqueio.',
    extensions: ['Yuko Field', 'Yuko Dev', 'Yuko Work', 'Yuko Inline'],
    discordFocus: '#projetos-ativos (Operacionais e de Projetos) · #recepcao-e-avisos (Institucionais e Gerais)',
    baseDaysMin: 7,
    baseDaysMax: 18,
    basePriceMin: 1800,
    basePriceMax: 4800,
    clientNeeds: [
      'Acessos disponíveis para onde o site fica guardado (servidor), nome do site (domínio) ou arquivos antigos do sistema;',
      'Relato dos problemas que mais atrapalham o funcionamento hoje;',
      'Cópia de segurança ou ambiente separado de testes antes de mexer no sistema no ar;',
      'Compromisso de aprovar primeiro o resgate essencial antes de pedir novidades grandes.',
    ],
    runningNote:
      'Após estabilizar, o projeto passa a seguir o registro completo da Yuko, com guia de transição pronto e proteção da regra de 5 dias úteis contra novo abandono.',
    teamSummary:
      '1 executor realiza o diagnóstico e a recuperação, 2+ revisores validam estabilidade e segurança antes de publicar, e 1 responsável de suporte assume a continuidade.',
  },
];

export const SIMULATOR_STAGES: SimulatorStageBlueprint[] = [
  {
    step: 1,
    title: 'Pedido & Viabilidade',
    extensionTag: 'Yuko Field',
    discordChannel: '#projetos-ativos · Operacionais e de Projetos',
    empresaAction:
      'Conta o problema da rotina sem precisar usar termos técnicos e confere se a solução traz ganho real para o dia a dia.',
    devActionByRole: {
      executor:
        'Escuta a necessidade com clareza e checa os 4 critérios de viabilidade: impacto real, equipe disponível, urgência e baixo risco externo.',
      revisor:
        'Confirma no canal de projetos se há pelo menos 2 revisores disponíveis que dominem a tecnologia conhecida e segura escolhida.',
      suporte:
        'Avalia desde o início o que será simples ou trabalhoso de manter depois que o sistema estiver no ar.',
    },
    manualRule:
      'Todo pedido passa por triagem de impacto, capacidade real da equipe (executor + 2+ revisores) e menor dependência possível de serviços externos.',
    manualHref: '/extensoes/#extensoes',
    manualLinkLabel: 'Ver áreas Yuko Field e extensões →',
  },
  {
    step: 2,
    title: 'Combinado & Escopo Enxuto',
    extensionTag: 'Yuko Make · Yuko Work',
    discordChannel: '#projetos-ativos · Operacionais e de Projetos',
    empresaAction:
      'Aprova o combinado por escrito com o que entra, o que fica para depois, prazos, condições claras de aprovação e contrato direto entre as partes.',
    devActionByRole: {
      executor:
        'Transforma o pedido em um combinado enxuto, mostra rascunhos simples de tela e abre a ficha de acompanhamento com todos os nomes.',
      revisor:
        'Valida se as condições de aprovação estão objetivas e fáceis de testar, sem promessas vagas ou burocracia inútil.',
      suporte:
        'Confirma seu nome na ficha de acompanhamento e alinha desde já o período e a forma do suporte pós-entrega.',
    },
    manualRule:
      'A participação comunitária não gera vínculo empregatício; relações comerciais exigem contrato direto entre as partes e ficha de acompanhamento oficial.',
    manualHref: '/ciclo/#registro',
    manualLinkLabel: 'Ver ficha de acompanhamento →',
  },
  {
    step: 3,
    title: 'Construção Organizada',
    extensionTag: 'Yuko Dev · Yuko Inline',
    discordChannel: '#conhecimento-tecnico · Conhecimento Técnico',
    empresaAction:
      'Acompanha o progresso pelo combinado e fornece apenas informações inventadas de exemplo — nunca dados reais de clientes nesta fase.',
    devActionByRole: {
      executor:
        'Constrói no espaço central compartilhado com tecnologia conhecida e segura, mantendo registro organizado das mudanças e zero código preso no computador pessoal.',
      revisor:
        'Tira dúvidas pontuais no Discord e acompanha o histórico organizado para facilitar a conferência final.',
      suporte:
        'Lê as anotações de construção e já rascunha o guia simples de uso junto com o executor.',
    },
    manualRule:
      'É proibido reter código ou senhas apenas no computador pessoal, e é proibido usar dados reais de clientes durante a construção (LGPD).',
    manualHref: '/governanca/#engenharia',
    manualLinkLabel: 'Ver padrões de qualidade →',
  },
  {
    step: 4,
    title: 'Conferência por 2+ Revisores',
    extensionTag: 'Yuko Dev · Yuko Work',
    discordChannel: '#projetos-ativos · Operacionais e de Projetos',
    empresaAction:
      'Tem a tranquilidade de saber que o sistema não depende da opinião de uma pessoa só antes de chegar à empresa.',
    devActionByRole: {
      executor:
        'Envia a entrega para conferência, responde aos apontamentos dos colegas e registra os ajustes na ficha de acompanhamento.',
      revisor:
        'Pelo menos 2 profissionais independentes conferem segurança, proteção de senhas, coleta mínima de dados e fidelidade ao combinado.',
      suporte:
        'Confere se o guia de uso e as anotações de transição estão claros o bastante para atender a empresa sem depender do executor.',
    },
    manualRule:
      'Nenhuma entrega vai ao ar revisada por apenas uma pessoa: é obrigatória a aprovação registrada de pelo menos 2 revisores independentes.',
    manualHref: '/ciclo/#papeis',
    manualLinkLabel: 'Ver papéis e revisão por 2+ colegas →',
  },
  {
    step: 5,
    title: 'Testes no Ambiente Separado',
    extensionTag: 'Yuko Inline · Yuko Make',
    discordChannel: '#projetos-ativos · Operacionais e de Projetos',
    empresaAction:
      'Testa as telas no celular e no computador usando o ambiente separado de testes com informações inventadas de exemplo e confirma se atende à rotina.',
    devActionByRole: {
      executor:
        'Publica no ambiente separado de testes, verifica cadeado de segurança (HTTPS), protege contra invasões comuns e fecha a lista de conferência final.',
      revisor:
        'Confirma que todos os itens da lista de conferência final passaram sem falhas graves ou riscos de segurança em aberto.',
      suporte:
        'Simula o dia a dia do atendimento no ambiente separado de testes para garantir que o guia de uso bate com a prática.',
    },
    manualRule:
      'Antes de ir para a empresa, tudo passa por ambiente separado de testes com informações inventadas de exemplo e lista de conferência final completa.',
    manualHref: '/governanca/#seguranca',
    manualLinkLabel: 'Ver segurança e conferência final →',
  },
  {
    step: 6,
    title: 'Entrega, Guia & Suporte',
    extensionTag: 'Yuko Place · Yuko Work',
    discordChannel: '#recepcao-e-avisos · Institucionais e Gerais',
    empresaAction:
      'Recebe o sistema no ar, os acessos em seu nome e o guia simples de uso, mantendo o controle total dos dados como Controladora.',
    devActionByRole: {
      executor:
        'Libera a versão final aprovada, entrega as anotações completas de transição e encerra a etapa de construção na ficha.',
      revisor:
        'Registra a aprovação final na ficha de acompanhamento e verifica se não sobrou nenhuma pendência oculta.',
      suporte:
        'Assume o acompanhamento por pessoa definida na ficha pós-entrega como Operador técnico sob instruções da empresa, protegido pela regra anti-abandono de 5 dias úteis.',
    },
    manualRule:
      'A microempresa decide sobre os dados (Controladora), os desenvolvedores seguem instruções com sigilo (Operadores) e a regra de 5 dias úteis protege contra abandono.',
    manualHref: '/manual/#origem',
    manualLinkLabel: 'Ler regras no Manual v1.0 →',
  },
];

export const SIMULATOR_STRESS_SCENARIOS: SimulatorStressScenario[] = [
  {
    id: 'ausencia',
    buttonLabel: 'E se quem desenvolveu sumir ou precisar se afastar?',
    alertTitle: 'Proteção automática contra abandono (5 dias úteis)',
    responseText:
      'Em afastamento avisado, o participante envia todo o código, acessos e pendências para o espaço central antes de sair. Se houver ausência sem resposta nem justificativa por 5 dias úteis, a ficha de acompanhamento registra vaga aberta, os acessos da pessoa ausente são bloqueados imediatamente e outro profissional da rede assume com o histórico já organizado — sem deixar a microempresa na mão.',
    guaranteeBadge: 'Regra anti-abandono · 5 dias úteis',
    ruleHref: '/ciclo/#papeis',
    ruleLabel: 'Ver transição e proteção no Ciclo →',
  },
  {
    id: 'dados-reais',
    buttonLabel: 'Posso enviar minha planilha real de clientes para testar?',
    alertTitle: 'Bloqueio obrigatório de dados reais em testes (LGPD)',
    responseText:
      'Não. Durante a construção e no ambiente separado de testes, é proibido usar nomes, telefones, documentos ou valores reais de clientes. A equipe usa apenas informações inventadas de exemplo ou disfarçadas (sem nomes nem telefones reais). Sua microempresa é a dona das decisões sobre os dados reais (Controladora), e os desenvolvedores atuam como Operadores técnicos com sigilo e coleta mínima.',
    guaranteeBadge: 'LGPD · Apenas informações inventadas de exemplo',
    ruleHref: '/governanca/#privacidade',
    ruleLabel: 'Ver regras de privacidade e LGPD →',
  },
];

export const SIMULATOR_DEV_ROLE_META: Record<
  SimulatorDevRole,
  { label: string; summary: string; contractNote: string }
> = {
  executor: {
    label: 'Desenvolvedor Executor',
    summary:
      'Transforma o pedido em um combinado enxuto, constrói a solução em espaço central com tecnologia conhecida e segura e mantém a ficha de acompanhamento atualizada.',
    contractNote:
      'Participação autônoma na comunidade, sem vínculo empregatício ou societário. Contratações pagas exigem contrato direto entre as partes.',
  },
  revisor: {
    label: 'Desenvolvedor Revisor (conferência por 2+ revisores)',
    summary:
      'Faz a conferência independente junto com pelo menos mais um colega antes da entrega: verifica clareza, proteção contra invasões, LGPD e lista de conferência final.',
    contractNote:
      'Nenhuma entrega vai ao ar com uma revisão só. Cada profissional responde pelos seus próprios atos com autonomia e ética.',
  },
  suporte: {
    label: 'Responsável de Suporte',
    summary:
      'Tem nome registrado na ficha para acompanhar os primeiros dias de uso, fazer ajustes imediatos combinados e manter o guia de transição sempre em dia.',
    contractNote:
      'Atua como Operador técnico sob instruções da microempresa (Controladora), com sigilo e substituição garantida se houver ausência por 5 dias úteis.',
  },
};

