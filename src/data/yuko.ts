export type SeedId = 'terracota' | 'botanico' | 'oceanico' | 'ameixa';
export type ModeId = 'light' | 'dark';
export type MotionId = 'expressive' | 'calm';
export type YukonMood = 'alvorada' | 'travessia' | 'boreal';

export type CardTone = 'default' | 'tonal-primary' | 'tonal-secondary' | 'tonal-tertiary';

export interface NavItem {
  label: string;
  href: string;
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

export interface YukonChapter {
  index: number;
  kicker: string;
  title: string;
  body: string;
  mood: YukonMood;
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
];

export const HERO_METRICS: HeroMetric[] = [
  { value: '6 Etapas', label: 'Entrega Assistida' },
  { value: '2+ Revisores', label: 'Revisão cruzada de código' },
  { value: 'Suporte definido', label: 'Garantia pós-entrega' },
];

export const YUKON_MOOD_LABELS: Record<YukonMood, string> = {
  alvorada: 'Alvorada',
  travessia: 'Travessia',
  boreal: 'Noite Boreal',
};

export const YUKON_CHAPTERS: YukonChapter[] = [
  {
    index: 0,
    kicker: '01 · Território',
    title: 'Resiliência em ambientes exigentes',
    body: 'Assim como Yukon exige preparo sem excessos, a Yuko rejeita pilhas complexas e lock-in. Cada solução nasce enxuta, em ecossistemas maduros e testada antes da entrega.',
    mood: 'alvorada',
  },
  {
    index: 1,
    kicker: '02 · Campo',
    title: 'Vastidão exploratória com Yuko Field',
    body: 'Com o Yuko Field, a comunidade conduz visitas, entrevistas e validação contextual das dores da microempresa antes da primeira linha de código.',
    mood: 'alvorada',
  },
  {
    index: 2,
    kicker: '03 · Forma',
    title: 'Sobriedade e gestão enxuta',
    body: 'Minimalismo instrumental e foco: documentação útil, commits semânticos rastreáveis e fluxo produtivo ágil sem burocracia.',
    mood: 'travessia',
  },
  {
    index: 3,
    kicker: '04 · Chancela',
    title: 'Construção em rede',
    body: 'Nenhuma entrega atravessa o território sozinha. Todo projeto conta com revisão coletiva, transição segura e continuidade para a microempresa.',
    mood: 'boreal',
    ctaLabel: 'Explorar Extensões →',
    ctaHref: '/extensoes/',
  },
];

export const HOME_PILLARS: HomePillar[] = [
  {
    variant: 'arch',
    href: '/extensoes/',
    title: 'Extensões & Frentes',
    description:
      'Field, Dev, Make, Place, Work e Inline articulam cada entrega com as seis frentes de atuação — da prospecção à segurança.',
    tag: 'Explorar extensões →',
  },
  {
    variant: 'xl',
    href: '/ciclo/',
    title: 'Ciclo de Entrega Assistida',
    description:
      'Nenhuma solução é entregue sem passar por Demanda, Escopo, Construção, revisão por 2+ pares, Homologação e Suporte designado.',
    tag: 'Ver as 6 etapas →',
  },
  {
    variant: 'soft',
    href: '/governanca/',
    title: 'Qualidade, Segurança & LGPD',
    description:
      'Critérios de pronto, commits semânticos, defesa contra falhas comuns, sigilo técnico, dados sintéticos em testes e conformidade LGPD.',
    tag: 'Ver qualidade e LGPD →',
  },
];

export const AUDIENCE_CARDS: AudienceCard[] = [
  {
    id: 'cardMicroempresa',
    badge: 'Microempresas Parceiras',
    title: 'Continuidade & Respaldo',
    description:
      'Elimina volatilidade e entregas sem documentação com critérios claros, validação coletiva e sustentação pós-entrega.',
    bullets: [
      'Prospecção contextual via Yuko Field ou acolhimento direto',
      'Escopo sintético com critérios objetivos de aceitação',
      'Transição assistida e chancela coletiva contra abandono',
      'Suporte nominal designado e sigilo técnico conforme LGPD',
    ],
    ctaLabel: 'Ver fluxo completo do ciclo',
    ctaHref: '/ciclo/',
    ctaVariant: 'outline',
    featured: false,
  },
  {
    id: 'cardDesenvolvedor',
    badge: 'Desenvolvedores Independentes',
    title: 'Autonomia com Pares',
    description:
      'Supera o isolamento técnico e a sobrecarga em revisões críticas, sem vínculo empregatício nem burocracia corporativa.',
    bullets: [
      'Liberdade de stack em ecossistemas maduros',
      'Revisão por 2+ pares antes de qualquer liberação',
      'Operação coordenada no Discord e issues rastreáveis',
      'Reaproveitamento aberto de utilitários, bibliotecas e boas práticas',
    ],
    ctaLabel: 'Ver padrões técnicos & ética',
    ctaHref: '/governanca/',
    ctaVariant: 'primary',
    featured: true,
  },
];

/* ==========================================================================
   Extensões, Frentes & Comunidade (/extensoes/)
   ========================================================================== */

export const IDENTITY_PILLARS: IdentityItem[] = [
  {
    title: 'Yukon (Canadá)',
    description:
      'Inspiração do nome Yuko: resiliência, exploração prática e construção sólida para cenários reais.',
  },
  {
    title: 'Oslo (Noruega)',
    description:
      'Referência de minimalismo, clareza nominal e precisão objetiva em cada entrega.',
  },
  {
    title: 'Verona (Itália)',
    description:
      'Compromisso com solidez técnica, continuidade institucional e registro formal dos projetos.',
  },
];

export const VISUAL_RULES: IdentityItem[] = [
  {
    title: 'Logotipo & Tipografia',
    description:
      'Palavra "Yuko" em tipografia contemporânea e equilibrada, acompanhada do símbolo da comunidade.',
  },
  {
    title: 'Simplicidade Visual',
    description:
      'A marca dispensa ornamentos excessivos que limitem sua leitura ou aplicação em diferentes contextos.',
  },
  {
    title: 'Alto Contraste & Clareza',
    description:
      'Aplicação em preto, branco e neutros de alto contraste para legibilidade consistente.',
  },
];

export const EXTENSIONS: ExtensionItem[] = [
  {
    name: 'Yuko Field',
    description:
      'Prospecção, relacionamento institucional e validação de problemas reais com microempresas.',
    code: 'prospecção',
    tone: 'default',
  },
  {
    name: 'Yuko Dev',
    description:
      'Engenharia de software, arquitetura, desenvolvimento colaborativo e integração técnica.',
    code: 'engenharia',
    tone: 'tonal-primary',
  },
  {
    name: 'Yuko Make',
    description:
      'Prototipagem ágil, design de interfaces e construção visual de soluções digitais.',
    code: 'design & protótipos',
    tone: 'default',
  },
  {
    name: 'Yuko Place',
    description:
      'Espaço comunitário de encontro, eventos, integração de membros e repositórios compartilhados.',
    code: 'comunidade',
    tone: 'tonal-secondary',
  },
  {
    name: 'Yuko Work',
    description:
      'Gestão de projetos, organização operacional, alocação de papéis e acompanhamento de entregas.',
    code: 'operações',
    tone: 'default',
  },
  {
    name: 'Yuko Inline',
    description:
      'Fluxo contínuo, automações internas, pipelines e utilitários técnicos.',
    code: 'automações',
    tone: 'tonal-tertiary',
  },
];

export const FRONTS: FrontItem[] = [
  {
    title: 'Organização e Execução',
    description:
      'Enquadramento de demandas, cronogramas básicos e cumprimento dos prazos pactuados.',
  },
  {
    title: 'Tecnologia e Desenvolvimento',
    description:
      'Escrita de código, escolha criteriosa de stacks, automação e deploy contínuo.',
  },
  {
    title: 'Inteligência e Avaliação',
    description:
      'Análise de viabilidade, comparação de ferramentas, avaliação de impacto e apoio à decisão.',
  },
  {
    title: 'Gestão e Colaboração Multidisciplinar',
    description:
      'Sincronia entre desenvolvimento, usabilidade, infraestrutura e suporte contínuo.',
  },
  {
    title: 'Integridade Informacional',
    description:
      'Preservação do histórico das soluções, documentação objetiva e versionamento transparente.',
  },
  {
    title: 'Governança e Segurança',
    description:
      'Diretrizes éticas de conduta, segurança digital, integridade de dados e indicadores de qualidade.',
  },
];

export const DISCORD_CHANNELS: DiscordChannelItem[] = [
  {
    title: 'Institucionais e Gerais',
    description:
      'avisos da comunidade, alinhamentos globais e recepção de novos membros.',
    kind: 'channel',
  },
  {
    title: 'Conhecimento Técnico',
    description:
      'debates sobre linguagens, frameworks, segurança e resolução conjunta de dúvidas.',
    kind: 'channel',
  },
  {
    title: 'Operacionais e de Projetos',
    description:
      'espaços dedicados a iniciativas ativas para alinhamento de escopo e tarefas.',
    kind: 'channel',
  },
  {
    title: 'Comunicação Construtiva',
    description:
      'Interações pautadas por respeito profissional, objetividade técnica e colaboração mútua — vedados comportamentos tóxicos ou autopromoção abusiva.',
    kind: 'guideline',
  },
];

/* ==========================================================================
   Ciclo de Entrega Assistida, Papéis & Rastreabilidade (/ciclo/)
   ========================================================================== */

export const CYCLE_STAGES: CycleStage[] = [
  {
    title: 'Demanda & Priorização',
    description:
      'Entrada por prospecção ativa (Yuko Field) ou acolhimento direto, com triagem de aderência, capacidade e impacto.',
    code: 'etapa 01 · viabilidade',
    tone: 'tonal-primary',
  },
  {
    title: 'Escopo & Critérios',
    description:
      'O executor converte a necessidade em escopo enxuto com critérios objetivos de aceitação.',
    code: 'etapa 02 · contrato técnico',
    tone: 'default',
  },
  {
    title: 'Construção Modular',
    description:
      'Desenvolvimento com versionamento central, commits semânticos e documentação objetiva para leitura pelos pares.',
    code: 'etapa 03 · engenharia',
    tone: 'default',
  },
  {
    title: 'Peer Review Obrigatório',
    description:
      'Revisão independente por pelo menos 2 desenvolvedores avaliando legibilidade, segurança, escopo e débitos críticos.',
    code: 'etapa 04 · 2+ revisores',
    tone: 'tonal-secondary',
  },
  {
    title: 'Testes & Staging',
    description:
      'Validação funcional, responsividade, desempenho e integridade em staging antes da liberação ao parceiro.',
    code: 'etapa 05 · staging',
    tone: 'default',
  },
  {
    title: 'Entrega & Suporte',
    description:
      'Aceite final com a microempresa e abertura da janela de suporte com responsável técnico registrado.',
    code: 'etapa 06 · liberação',
    tone: 'tonal-tertiary',
  },
];

export const TRIAGE_CRITERIA: IdentityItem[] = [
  {
    title: 'Aderência & Impacto',
    description:
      'problema concreto solucionável com engenharia direta e ganho operacional mensurável.',
  },
  {
    title: 'Capacidade Real',
    description:
      'disponibilidade efetiva de executor e revisores com domínio na tecnologia envolvida.',
  },
  {
    title: 'Criticidade & Clareza',
    description:
      'urgência no gargalo da microempresa e regras traduzíveis em critérios de aceitação.',
  },
  {
    title: 'Baixo Risco Externo',
    description:
      'menor dependência de serviços de terceiros ou integrações instáveis.',
  },
];

export const ROLES: RoleItem[] = [
  {
    title: 'Desenvolvedor Executor',
    description:
      'Lidera a entrega na prática: define o escopo inicial, implementa a solução e alinha ajustes com revisores e parceiro.',
    tone: 'default',
  },
  {
    title: 'Desenvolvedores Revisores',
    description:
      'Pelo menos 2 pares avaliam código, segurança e escopo; nenhuma entrega é liberada com revisão única.',
    tone: 'tonal-primary',
  },
  {
    title: 'Responsável de Suporte',
    description:
      'Assume a estabilização pós-lançamento, corrige ajustes imediatos e zela pela operação na janela acordada.',
    tone: 'tonal-secondary',
  },
];

export const CONTINUITY_RULES: ContinuityRule[] = [
  {
    title: 'Transição Obrigatória de Contexto',
    description:
      'Antes de se afastar, o integrante sincroniza o código no repositório remoto e documenta tarefas, decisões e impedimentos. É vedado reter código ou credenciais localmente.',
    tone: 'default',
  },
  {
    title: 'Abandono (5 dias úteis) & Proteção',
    description:
      'Após 5 dias úteis de inércia sem justificativa, registra-se vacância na issue, revogação de acessos e reatribuição imediata pelos pares para proteger a microempresa.',
    tone: 'tonal-tertiary',
  },
];

export const REGISTRY_COL_A: string[] = [
  'Identificador único da demanda no sistema oficial de issues;',
  'Escopo acordado e critérios de aceitação validados;',
  'Nomes do desenvolvedor executor e dos revisores;',
];

export const REGISTRY_COL_B: string[] = [
  'Designação nominal do responsável pelo suporte;',
  'Aprovações técnicas da revisão por 2+ pares;',
  'Datas, links de repositórios e guia de transição.',
];

/* ==========================================================================
   Qualidade, Segurança, LGPD & Ética (/governanca/)
   ========================================================================== */

export const DOD_ITEMS: string[] = [
  'Escopo inicial validado em operação;',
  'Commits organizados no repositório central;',
  'Revisão por 2+ pares registrada;',
  'Guia básico de uso para a microempresa;',
  'Sem falhas críticas ou riscos abertos.',
];

export const STACK_ITEMS: IdentityItem[] = [
  {
    title: 'Linting',
    description: 'regras versionadas na raiz do projeto.',
  },
  {
    title: 'Commits Semânticos',
    description: 'feat, fix, refactor, chore e docs vinculados à issue.',
  },
  {
    title: 'Ecossistemas',
    description: 'Node.js/TS, Python, Go, PHP e web nativa.',
  },
  {
    title: 'Dados',
    description: 'PostgreSQL, MySQL/MariaDB ou SQLite.',
  },
];

export const SECURITY_CARDS: SecurityCard[] = [
  {
    title: 'Prevenção de Falhas',
    description:
      'Prepared statements/ORM obrigatórios contra SQL Injection e sanitização consistente contra XSS.',
    code: 'sqli & xss',
  },
  {
    title: 'Segredos & Criptografia',
    description:
      'Segredos fora do Git (apenas .env.example); tráfego em HTTPS/TLS e senhas em Argon2 ou bcrypt.',
    code: 'tls & argon2/bcrypt',
  },
  {
    title: 'Auditoria & Sigilo',
    description:
      'Checagem contínua de dependências, gestão responsável de acessos e sigilo técnico sobre dados da microempresa.',
    code: 'auditoria contínua',
  },
];

export const LGPD_ITEMS: IdentityItem[] = [
  {
    title: 'Papéis',
    description: 'Microempresa como Controladora; desenvolvedores como Operadores técnicos.',
  },
  {
    title: 'Privacy by Design',
    description: 'coleta mínima, restrita à finalidade da solução.',
  },
  {
    title: 'Dev/Staging',
    description: 'uso exclusivo de dados sintéticos ou anonimizados.',
  },
  {
    title: 'Titulares & Incidentes',
    description:
      'suporte à exportação e exclusão pelo titular; notificação imediata de incidentes à microempresa em registro restrito.',
  },
];

export const CONFLICT_STEPS: IdentityItem[] = [
  {
    title: '1. Diálogo Direto',
    description: 'alinhamento objetivo com base em evidências técnicas.',
  },
  {
    title: '2. Mediação por Pares',
    description: 'membro neutro facilita consenso focado no projeto.',
  },
  {
    title: '3. Deliberação Coletiva',
    description: 'revisores priorizam menor complexidade e escopo.',
  },
];

export const CONFLICT_PRINCIPLE: IdentityItem = {
  title: 'Autonomia',
  description: 'cada participante responde por seus atos profissionais.',
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
    value: 'Referencial normativo, metodológico e operacional',
  },
  {
    label: 'Abrangência & Acesso',
    value: 'Comunidade Yuko, frentes e projetos em implantação · Documento aberto de uso comunitário',
  },
  {
    label: 'Revisão',
    value: 'Periódica, conforme maturação da governança (v1.1, v2.0)',
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
        text: 'experimentação inicial em desenvolvimento colaborativo e articulação de talentos.',
      },
      {
        label: 'Expliance',
        text: 'sistematização de governança, frentes técnicas e padrões operacionais.',
      },
      {
        label: 'Yuko',
        text: 'síntese enxuta e rastreável, eliminando excessos regulatórios sem perder rigor.',
      },
    ],
  },
  {
    title: '3. Implantação Gradual & Gestão Enxuta',
    tone: 'tonal-tertiary',
    paragraphs: [
      'Estruturas, papéis e extensões evoluem de forma progressiva, sem pressupor carteira fixa de clientes ou equipe permanente.',
      'Qualquer etapa burocrática que atrase a entrega sem ganho real deve ser simplificada; qualquer membro ativo pode propor revisões.',
    ],
  },
  {
    title: 'Guia Rápido de Navegação',
    tone: 'tonal-secondary',
    links: [
      {
        label: 'Início',
        href: '/',
        description: 'propósito, experiência Yukon, ciclo em resumo e públicos atendidos.',
      },
      {
        label: 'Extensões',
        href: '/extensoes/',
        description: 'marca, 6 extensões, 6 frentes e Discord.',
      },
      {
        label: 'Ciclo',
        href: '/ciclo/',
        description: '6 etapas assistidas, papéis e registro em issue.',
      },
      {
        label: 'Qualidade & LGPD',
        href: '/governanca/',
        description: 'DoD, stack, segurança, conformidade LGPD e mediação.',
      },
    ],
  },
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Ambiente de Staging',
    definition:
      'Ambiente pré-produção destinado à validação funcional, responsividade, desempenho e integridade com dados sintéticos antes da liberação ao parceiro.',
  },
  {
    term: 'Ciclo de Entrega Assistida',
    definition:
      'Fluxo em seis etapas no qual toda solução passa por escopo, construção modular, revisão por 2+ pares, staging e suporte definido antes e após a entrega.',
  },
  {
    term: 'Commits Semânticos',
    definition:
      'Padrão de mensagens de versionamento (feat, fix, refactor, chore e docs) vinculadas à issue para manter o histórico técnico legível e rastreável.',
  },
  {
    term: 'Conformidade LGPD (Controlador & Operador)',
    definition:
      'Enquadramento sob a Lei nº 13.709/2018 em que a microempresa atua como Controladora dos dados e os desenvolvedores como Operadores técnicos, com coleta mínima e sigilo.',
    tone: 'tertiary',
  },
  {
    term: 'Critério de Pronto (DoD · Definition of Done)',
    definition:
      'Checklist técnico obrigatório que atesta escopo validado em operação, commits no repositório central, revisão por 2+ pares registrada, guia básico de uso e ausência de falhas críticas.',
    tone: 'primary',
  },
  {
    term: 'Critérios de Aceitação',
    definition:
      'Parâmetros técnicos e funcionais definidos previamente no escopo enxuto para validar objetivamente quando a entrega atende ao acordado.',
  },
  {
    term: 'Dados Sintéticos',
    definition:
      'Dados artificiais ou anonimizados utilizados exclusivamente em desenvolvimento e staging para proteger informações reais da microempresa.',
  },
  {
    term: 'Desenvolvedor Executor',
    definition:
      'Integrante que lidera a entrega na prática: converte a necessidade em escopo enxuto, implementa a solução no repositório e alinha ajustes com revisores e parceiro.',
  },
  {
    term: 'Desenvolvedores Revisores',
    definition:
      'Pelo menos dois pares independentes que avaliam código, segurança, escopo e débitos críticos; nenhuma entrega é liberada com revisão única.',
  },
  {
    term: 'Extensões da Marca',
    definition:
      'Campos públicos de atuação sob o prefixo Yuko (Field, Dev, Make, Place, Work e Inline) que articulam prospecção, engenharia, prototipagem, comunidade, operações e automações.',
  },
  {
    term: 'Frentes de Atuação',
    definition:
      'Seis disciplinas internas aplicadas em cada projeto: Organização e Execução, Tecnologia e Desenvolvimento, Inteligência e Avaliação, Gestão Multidisciplinar, Integridade Informacional e Governança e Segurança.',
  },
  {
    term: 'Issue de Registro',
    definition:
      'Registro formal obrigatório no sistema oficial de issues que centraliza identificador, escopo validado, responsáveis, aprovações de revisão por 2+ pares, links de repositório e guia de transição.',
  },
  {
    term: 'Responsável de Suporte',
    definition:
      'Desenvolvedor designado nominalmente na entrega para acompanhar a estabilização pós-lançamento e realizar ajustes imediatos na janela acordada.',
    tone: 'secondary',
  },
  {
    term: 'Revisão por Pares (Peer Review)',
    definition:
      'Etapa obrigatória em que pelo menos dois desenvolvedores independentes avaliam legibilidade, segurança e aderência ao escopo antes da etapa de staging.',
  },
  {
    term: 'Transição de Contexto & Regra de Abandono',
    definition:
      'Sincronização obrigatória de código e decisões antes de qualquer afastamento; após 5 dias úteis de inércia sem justificativa, registra-se vacância na issue com reatribuição imediata pelos pares.',
  },
];
