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
  { label: 'Papéis & Rastreabilidade', href: '/ciclo/#papeis' },
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
    body: 'Assim como o território de Yukon impõe preparo e ausência de excessos, a Yuko rejeita pilhas complexas e lock-in. Cada solução nasce enxuta, em ecossistemas maduros e testada antes da entrega.',
    mood: 'alvorada',
  },
  {
    index: 1,
    kicker: '02 · Campo',
    title: 'Vastidão exploratória com Yuko Field',
    body: 'Pela frente Yuko Field, a comunidade realiza visitas, entrevistas e validação contextual das dores reais da microempresa antes de escrever qualquer linha de código.',
    mood: 'alvorada',
  },
  {
    index: 2,
    kicker: '03 · Forma',
    title: 'Sobriedade e gestão enxuta',
    body: 'Minimalismo instrumental e zero ruído: documentação útil, commits semânticos rastreáveis e zero burocracia para manter o ciclo produtivo ágil.',
    mood: 'travessia',
  },
  {
    index: 3,
    kicker: '04 · Chancela',
    title: 'Construção em rede',
    body: 'Nenhuma entrega atravessa o território sozinha. Todo projeto passa por revisão cruzada por 2+ pares, suporte definido e transição segura para proteger a microempresa.',
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
      'Field, Dev, Make, Place, Work e Inline organizam cada entrega em conjunto com as seis frentes de atuação — da prospecção à segurança.',
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
      'Critérios de pronto, commits semânticos, proteção contra falhas comuns, sigilo técnico, dados sintéticos em testes e conformidade com a LGPD.',
    tag: 'Ver qualidade e LGPD →',
  },
];

export const AUDIENCE_CARDS: AudienceCard[] = [
  {
    id: 'cardMicroempresa',
    badge: 'Microempresas Parceiras',
    title: 'Continuidade & Respaldo',
    description:
      'Elimina a volatilidade e entregas sem documentação por meio de critérios claros, validação coletiva e sustentação pós-entrega.',
    bullets: [
      'Prospecção contextual via Yuko Field ou acolhimento direto',
      'Escopo sintético com critérios objetivos de aceitação',
      'Proteção contra abandono: transição assistida e chancela coletiva',
      'Responsável de suporte designado e sigilo técnico conforme LGPD',
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
      'Supera o isolamento na sustentação e a sobrecarga em revisões críticas sem vínculo empregatício ou burocracia corporativa.',
    bullets: [
      'Liberdade de stack em ecossistemas maduros e consolidados',
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
      'Referência de minimalismo, clareza nominal, ausência de ruído e precisão objetiva em cada entrega.',
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
      'Composto pela palavra "Yuko" em tipografia contemporânea e equilibrada, acompanhada do símbolo da comunidade.',
  },
  {
    title: 'Simplicidade Visual',
    description:
      'A marca dispensa ornamentos excessivos ou ilustrações que limitem sua leitura ou aplicação em diferentes contextos.',
  },
  {
    title: 'Alto Contraste & Clareza',
    description:
      'Aplicação em preto, branco e tons neutros de alto contraste para garantir legibilidade consistente.',
  },
];

export const EXTENSIONS: ExtensionItem[] = [
  {
    name: 'Yuko Field',
    description:
      'Prospecção, relacionamento institucional e validação de problemas reais junto às microempresas.',
    code: 'prospecção',
    tone: 'default',
  },
  {
    name: 'Yuko Dev',
    description:
      'Engenharia de software, arquitetura de código, desenvolvimento colaborativo e integração técnica.',
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
      'Ferramentas de fluxo contínuo, automações internas, pipelines e utilitários técnicos.',
    code: 'automações',
    tone: 'tonal-tertiary',
  },
];

export const FRONTS: FrontItem[] = [
  {
    title: 'Organização e Execução',
    description:
      'Enquadramento de demandas, definição de cronogramas básicos e cumprimento dos prazos pactuados.',
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
      'Toda interação é pautada por respeito profissional, objetividade técnica e colaboração mútua — sendo vedados comportamentos tóxicos ou autopromoção abusiva.',
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
      'A demanda entra por prospecção ativa (Yuko Field) ou acolhimento direto e passa por triagem de aderência, capacidade e impacto.',
    code: 'etapa 01 · viabilidade',
    tone: 'tonal-primary',
  },
  {
    title: 'Escopo & Critérios',
    description:
      'O executor converte a necessidade em um escopo enxuto com critérios objetivos que definem quando a entrega está pronta.',
    code: 'etapa 02 · contrato técnico',
    tone: 'default',
  },
  {
    title: 'Construção Modular',
    description:
      'Desenvolvimento com versionamento central, commits semânticos e documentação objetiva para leitura rápida por outros pares.',
    code: 'etapa 03 · engenharia',
    tone: 'default',
  },
  {
    title: 'Peer Review Obrigatório',
    description:
      'Revisão independente por pelo menos 2 desenvolvedores avaliando legibilidade, segurança, aderência ao escopo e débitos críticos.',
    code: 'etapa 04 · 2+ revisores',
    tone: 'tonal-secondary',
  },
  {
    title: 'Testes & Homologação',
    description:
      'Validação funcional, responsividade, desempenho e integridade em ambiente de staging antes de liberar para o parceiro.',
    code: 'etapa 05 · staging',
    tone: 'default',
  },
  {
    title: 'Entrega & Suporte',
    description:
      'Homologação com a microempresa e abertura da janela de acompanhamento com responsável técnico definido em registro.',
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
      'preferência por menor dependência de serviços de terceiros ou integrações instáveis.',
  },
];

export const ROLES: RoleItem[] = [
  {
    title: 'Desenvolvedor Executor',
    description:
      'Lidera a entrega na prática: levanta o escopo inicial, implementa a solução e alinha ajustes com revisores e parceiro.',
    tone: 'default',
  },
  {
    title: 'Desenvolvedores Revisores',
    description:
      'Múltiplos pares avaliam criticamente os artefatos. Nenhuma entrega é chancelada com apenas um parecer técnico.',
    tone: 'tonal-primary',
  },
  {
    title: 'Responsável de Suporte',
    description:
      'Assume a estabilização pós-lançamento, corrige ajustes imediatos e zela pela operação contínua na janela acordada.',
    tone: 'tonal-secondary',
  },
];

export const CONTINUITY_RULES: ContinuityRule[] = [
  {
    title: 'Transição de Contexto Compulsória',
    description:
      'Antes de qualquer afastamento, o integrante sincroniza o código no repositório remoto e documenta tarefas, decisões e impedimentos. É vedado reter código ou credenciais localmente.',
    tone: 'default',
  },
  {
    title: 'Abandono (5 dias úteis) & Proteção',
    description:
      'Após 5 dias úteis de inércia sem justificativa, registra-se vacância na issue com revogação de acessos e reatribuição imediata pelos pares para proteger a microempresa.',
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
  'Pareceres de aprovação técnica da revisão por pares;',
  'Datas, links de repositórios e guia de transição.',
];

/* ==========================================================================
   Qualidade, Segurança, LGPD & Ética (/governanca/)
   ========================================================================== */

export const DOD_ITEMS: string[] = [
  'Escopo inicial validado em operação;',
  'Commits organizados no repositório central;',
  'Revisão por múltiplos pares registrada;',
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
      'Uso obrigatório de prepared statements/ORM contra SQL Injection e sanitização consistente contra XSS.',
    code: 'sqli & xss',
  },
  {
    title: 'Segredos & Criptografia',
    description:
      'Segredos nunca no Git (apenas .env.example); tráfego protegido por HTTPS/TLS e senhas em Argon2 ou bcrypt.',
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
    description: 'microempresa Controladora; devs como operadores técnicos.',
  },
  {
    title: 'Privacy by Design',
    description: 'coleta mínima estrita à finalidade.',
  },
  {
    title: 'Dev/Staging',
    description: 'uso exclusivo de dados sintéticos ou anonimizados.',
  },
  {
    title: 'Titulares & Incidentes',
    description: 'exportação, exclusão e reporte imediato na issue.',
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
  {
    title: 'Autonomia',
    description: 'cada participante responde por seus atos profissionais.',
  },
];

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
      'Este manual tem caráter orientativo e comunitário, sem substituir contratos formais, estatutos sociais ou pareceres jurídicos.',
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
      'Estruturas, papéis e extensões estão em consolidação progressiva, sem pressupor carteira fixa de clientes ou equipe corporativa permanente.',
      'Todo fluxo que se mostrar lento frente ao benefício real deve ser simplificado; qualquer membro ativo pode propor revisões.',
    ],
  },
  {
    title: 'Guia Rápido de Navegação',
    tone: 'tonal-secondary',
    links: [
      {
        label: 'Início',
        href: '/',
        description: 'propósito, experiência Yukon e temas dinâmicos.',
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
        description: 'DoD, stack, segurança e mediação.',
      },
    ],
  },
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Ciclo de Entrega Assistida',
    definition:
      'Fluxo em seis etapas no qual toda solução passa por escopo, revisão cruzada por pares e testes antes da entrega.',
  },
  {
    term: 'Critérios de Aceitação',
    definition:
      'Parâmetros técnicos e funcionais definidos previamente para validar quando a solução atende ao acordado.',
  },
  {
    term: 'Definition of Done (DoD)',
    definition:
      'Checklist técnico obrigatório que atesta funcionalidade, versionamento, revisão aprovada, guia básico e segurança.',
  },
  {
    term: 'Desenvolvedor Executor',
    definition:
      'Integrante responsável pela liderança prática do escopo, implementação técnica e alinhamento da entrega.',
  },
  {
    term: 'Extensões da Marca',
    definition:
      'Ramificações funcionais sob o prefixo Yuko (Field, Dev, Make, Place, Work e Inline) para frentes específicas.',
  },
  {
    term: 'Issue de Registro',
    definition:
      'Registro oficial rastreável que centraliza escopo, responsáveis, pareceres de revisão, links e decisões do projeto.',
  },
  {
    term: 'Peer Review Obrigatório',
    definition:
      'Etapa em que pelo menos dois desenvolvedores independentes revisam código e segurança antes da homologação.',
  },
  {
    term: 'Responsável de Suporte',
    definition:
      'Desenvolvedor designado para acompanhar a estabilização pós-entrega e correções iniciais junto à microempresa.',
    tone: 'secondary',
  },
];
