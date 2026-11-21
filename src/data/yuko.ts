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
  { value: '6 Etapas', label: 'Fluxo sem caixa-preta, da triagem ao suporte' },
  { value: '2+ Revisores', label: 'Nenhuma entrega passa com 1 parecer só' },
  { value: '5 dias úteis', label: 'Aviso prévio ou troca assistida sem travar' },
];

export const CONTINUITY_LENS_LABELS: Record<StageLensId, string> = {
  fluxo: 'Fluxo',
  rede: 'Rede',
  blindagem: 'Respaldo',
};

export const CONTINUITY_STAGES: ContinuityStageItem[] = [
  {
    index: 0,
    kicker: '01 · Triagem & Escopo',
    stageLabel: 'Escuta clara, sem caixa-preta',
    title: 'Da escuta ao combinado escrito',
    body: 'Via Yuko Field ou contato direto, avaliamos viabilidade, proporcionalidade e impacto antes de fechar um escopo enxuto e legível.',
    defaultLens: 'fluxo',
    lensNotes: {
      fluxo: 'Etapas 1–2 · Triagem via Yuko Field e critérios no papel',
      rede: 'Pedido acolhido com os 3 critérios antes da construção',
      blindagem: 'Escopo enxuto e critérios de aceitação por escrito',
    },
  },
  {
    index: 1,
    kicker: '02 · Casa Central',
    stageLabel: 'Zero código preso no PC local',
    title: 'Sem código local nem lock-in caro',
    body: 'Construímos no repositório central, com tecnologias maduras. Rejeitamos arquiteturas pesadas, nuvem cara e senhas ou código locais.',
    defaultLens: 'rede',
    lensNotes: {
      fluxo: 'Tecnologias maduras e modulares, fáceis de manter',
      rede: 'Etapa 3 · Repositório central, zero lock-in e zero código local',
      blindagem: 'Proibido manter código, credenciais ou dados no PC local',
    },
  },
  {
    index: 2,
    kicker: '03 · Pares & Staging',
    stageLabel: '2+ revisores e teste antes do ar',
    title: '2+ pareceres e staging obrigatório',
    body: 'Ninguém aprova com 1 parecer só: 2+ pares revisam segurança e LGPD. Se falhar nos testes (staging), volta direto ao executor.',
    defaultLens: 'blindagem',
    lensNotes: {
      fluxo: 'Aprovação coletiva antes de liberar para a empresa',
      rede: '2+ revisores independentes na mesma entrega (Peer Review)',
      blindagem: 'Etapas 4–5 · 2+ pares e staging com retorno se falhar',
    },
  },
  {
    index: 3,
    kicker: '04 · Troca Segura',
    stageLabel: 'Passagem de bastão organizada',
    title: 'Suporte nomeado e regra dos 5 dias',
    body: 'Após homologação há Suporte nomeado. Com aviso na issue/push ou inércia >5 dias úteis, acessos são revogados e outro par assume.',
    defaultLens: 'blindagem',
    lensNotes: {
      fluxo: 'Suporte nomeado pós-homologação pelo período combinado',
      rede: 'Afastamento programado na issue com push obrigatório',
      blindagem: 'Etapa 6 · Aviso na issue ou inércia >5 dias úteis → troca',
    },
    ctaLabel: 'Ver papéis e continuidade →',
    ctaHref: '/ciclo/#papeis',
  },
];

export const HOME_PILLARS: HomePillar[] = [
  {
    variant: 'arch',
    href: '/extensoes/',
    title: 'Extensões & Discord',
    description:
      'Seis extensões — Field (escuta), Dev (código), Make (prototipagem), Place (espaço), Work (governança) e Inline (automações) — além de seis frentes internas e convivência diária voluntária no Discord.',
    tag: 'Ver 6 extensões e Discord →',
  },
  {
    variant: 'xl',
    href: '/ciclo/',
    title: 'Ciclo de Entrega Assistida',
    description:
      'Seis etapas engrenadas: 1) Demanda e Triagem, 2) Escopo e Critérios, 3) Construção centralizada, 4) Revisão por 2+ pares, 5) Testes em staging (se falhar, volta ao executor) e 6) Entrega com Responsável de Suporte.',
    tag: 'Explorar as 6 etapas →',
  },
  {
    variant: 'soft',
    href: '/governanca/',
    title: 'Simplicidade, Segurança & LGPD',
    description:
      'Tecnologias maduras contra lock-in e nuvem cara, revisão contra SQLi/XSS, HTTPS/TLS, Argon2/bcrypt e zero segredos no código. Na LGPD: empresa Controladora, dev Operador, Privacy by Design e proibição de dados reais em dev/staging.',
    tag: 'Ver padrões e LGPD →',
  },
];

export const AUDIENCE_CARDS: AudienceCard[] = [
  {
    id: 'cardMicroempresa',
    badge: 'Microempresas Parceiras',
    title: 'Continuidade sem Caixa-Preta',
    description:
      'Acabe com o risco de código preso e abandono: você recebe tecnologia simples, sem lock-in caro em nuvem, com trabalho individual validado coletivamente pela rede.',
    bullets: [
      'Triagem honesta (Yuko Field ou direto): avaliamos viabilidade, proporcionalidade e impacto — com orientação clara se não couber',
      'Escopo enxuto e staging: testamos antes da homologação (se falhar, volta ao executor) com tecnologias maduras',
      'Chancela de 2+ revisores: nenhuma entrega vai ao ar com 1 parecer só e há Responsável de Suporte após o aceite',
      'LGPD na prática: sua empresa é a Controladora dos dados; dados reais são proibidos em dev e staging',
    ],
    ctaLabel: 'Ver as 6 etapas da entrega',
    ctaHref: '/ciclo/',
    ctaVariant: 'outline',
    featured: false,
  },
  {
    id: 'cardDesenvolvedor',
    badge: 'Desenvolvedores Independentes',
    title: 'Autonomia sem Isolamento',
    description:
      'Troque a sustentação solitária pela convivência diária, voluntária e autônoma no Discord — mantendo sua autonomia profissional sem vínculo empregatício ou societário.',
    bullets: [
      'DoD objetivo: linter na raiz, commits semânticos ligados à issue, HTTPS/TLS, Argon2/bcrypt e checagem contra SQLi/XSS e segredos no código',
      'Peer Review e LGPD: atue como Executor, Revisor (2+ pares) ou Suporte; opere sob instrução da Controladora, só com dados sintéticos',
      'Zero código local: repositório central e sincronização compulsória (push de branches, tarefas e decisões — sem senhas ou dados no PC)',
      'Afastamento programado ou 5 dias úteis: avise na issue ao sair; inércia >5 dias úteis gera revogação e reatribuição transitória',
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

export const LINEAGE_STAGES: IdentityItem[] = [
  {
    title: 'Fase NYX (Experimentação)',
    description:
      'Ponto de partida focado em testar métodos colaborativos e conectar talentos técnicos em torno de problemas reais.',
  },
  {
    title: 'Fase Expliance (Sistematização)',
    description:
      'Etapa em que regras, processos e frentes técnicas ganharam forma organizada e padrões replicáveis.',
  },
  {
    title: 'Yuko (Síntese Enxuta)',
    description:
      'O ponto de chegada que corta burocracia excessiva mantendo rigor técnico, clareza pública e rastreabilidade.',
  },
];

export const IDENTITY_PILLARS: IdentityItem[] = [
  {
    title: 'Yukon (Canadá)',
    description:
      'Inspira o nome Yuko com resiliência, vastidão exploratória e firmeza prática para encarar desafios reais sem atalhos frágeis.',
  },
  {
    title: 'Oslo (Noruega)',
    description:
      'Traz minimalismo radical, clareza objetiva, ausência de ruídos visuais e nomes diretos que qualquer pessoa entende de primeira.',
  },
  {
    title: 'Verona (Itália)',
    description:
      'Representa solidez histórica, caráter perene, capricho no acabamento e respeito ao registro formal de cada entrega.',
  },
];

export const VISUAL_RULES: IdentityItem[] = [
  {
    title: 'Marca Monocromática',
    description:
      'A identidade oficial da Yuko adota preto, branco e alto contraste para garantir legibilidade absoluta e neutralidade institucional.',
  },
  {
    title: 'Tipografia & Símbolo',
    description:
      'Logotipo legível em qualquer tamanho, acompanhado do símbolo da comunidade sem enfeites que atrapalhem a leitura.',
  },
  {
    title: 'Interface Adaptativa',
    description:
      'No portal web, oferecemos paletas acessíveis (Terracota, Botânico, Oceânico e Ameixa) preservando o contraste e a clareza da marca.',
  },
];

export const EXTENSIONS: ExtensionItem[] = [
  {
    name: 'Yuko Field',
    description:
      'Prospecção e imersão na rotina da microempresa para validar o contexto real antes de propor qualquer tecnologia.',
    code: 'prospecção & escuta',
    tone: 'default',
  },
  {
    name: 'Yuko Dev',
    description:
      'Engenharia, arquitetura simples, escrita de código limpo, revisão entre pares e integração entre ferramentas.',
    code: 'engenharia & código',
    tone: 'tonal-primary',
  },
  {
    name: 'Yuko Make',
    description:
      'Prototipagem ágil, desenho de interfaces fáceis de usar e cuidado visual de cada solução.',
    code: 'prototipagem & visual',
    tone: 'default',
  },
  {
    name: 'Yuko Place',
    description:
      'Espaço comunitário de acolhimento para integração de membros, troca técnica e repositórios coletivos.',
    code: 'espaço comunitário',
    tone: 'tonal-secondary',
  },
  {
    name: 'Yuko Work',
    description:
      'Governança operacional, combinados escritos, divisão clara de papéis e acompanhamento dos prazos.',
    code: 'governança & entregas',
    tone: 'default',
  },
  {
    name: 'Yuko Inline',
    description:
      'Automações internas e rotinas de apoio para manter o fluxo contínuo e dar produtividade aos projetos.',
    code: 'automações internas',
    tone: 'tonal-tertiary',
  },
];

export const FRONTS: FrontItem[] = [
  {
    title: 'Organização e Execução',
    description:
      'Enquadramento justo dos pedidos, prazos combinados com transparência e cumprimento do que foi acordado.',
  },
  {
    title: 'Tecnologia e Desenvolvimento',
    description:
      'Construção do sistema com tecnologias maduras e sem lock-in em nuvem, automações úteis e publicação revisada.',
  },
  {
    title: 'Inteligência e Avaliação',
    description:
      'Análise de viabilidade e impacto da solução, comparação de ferramentas e apoio direto às decisões da empresa.',
  },
  {
    title: 'Gestão e Colaboração Multidisciplinar',
    description:
      'Sintonia entre quem programa, quem prototipa interfaces, infraestrutura simples e suporte nomeado.',
  },
  {
    title: 'Integridade Informacional',
    description:
      'Preservação do histórico na ficha do projeto, guias simples de uso e controle rastreável das versões.',
  },
  {
    title: 'Governança e Segurança',
    description:
      'Conduta ética, proteção contra falhas comuns de código, cuidado com dados na LGPD e critérios de qualidade.',
  },
];

export const DISCORD_CHANNELS: DiscordChannelItem[] = [
  {
    title: 'Institucionais e Gerais',
    description:
      'avisos da comunidade, orientações do manual e boas-vindas a novos membros.',
    kind: 'channel',
  },
  {
    title: 'Conhecimento Técnico',
    description:
      'troca aberta sobre linguagens, arquitetura enxuta, segurança e ajuda mútua no dia a dia.',
    kind: 'channel',
  },
  {
    title: 'Temporários de Projetos Ativos',
    description:
      'canais criados sob demanda enquanto cada projeto está ativo para alinhar tarefas, revisões e prazos.',
    kind: 'channel',
  },
  {
    title: 'Participação Voluntária & Respeitosa',
    description:
      'Atuação voluntária, autônoma e sem vínculo empregatício ou societário — guiada por convivência diária construtiva, respeito e zero ambiente tóxico.',
    kind: 'guideline',
  },
];

/* ==========================================================================
   Ciclo de Entrega Assistida, Papéis & Rastreabilidade (/ciclo/)
   ========================================================================== */

export const CYCLE_STAGES: CycleStage[] = [
  {
    title: '1. Demanda — Entrada & Triagem',
    description:
      'Entra pela Yuko Field ou contato direto. Avaliamos viabilidade, proporcionalidade e impacto; se não couber, orientamos.',
    code: 'etapa 01 · triagem',
    tone: 'tonal-primary',
  },
  {
    title: '2. Escopo & Critérios do Pronto',
    description:
      'O executor registra um documento sintético do pronto (escopo escrito + critérios de aceitação) antes de escrever código.',
    code: 'etapa 02 · combinado',
    tone: 'default',
  },
  {
    title: '3. Construção Modular',
    description:
      'Código modular com tecnologias maduras no repositório central, ligado à ficha (issue), com linter e commits semânticos.',
    code: 'etapa 03 · construção',
    tone: 'default',
  },
  {
    title: '4. Revisão por 2+ Pares',
    description:
      'Pelo menos 2 devs independentes (Peer Review) conferem segurança, legibilidade e o cumprimento fiel do combinado.',
    code: 'etapa 04 · peer review',
    tone: 'tonal-secondary',
  },
  {
    title: '5. Testes & Homologação',
    description:
      'Testamos funções, celular e velocidade em staging (dados sintéticos). Se falhar, volta direto ao executor antes do ar.',
    code: 'etapa 05 · staging',
    tone: 'default',
  },
  {
    title: '6. Entrega & Suporte',
    description:
      'Homologação final com a microempresa e nomeação oficial do Responsável de Suporte pelo período combinado.',
    code: 'etapa 06 · liberação',
    tone: 'tonal-tertiary',
  },
];

export const TRIAGE_CRITERIA: IdentityItem[] = [
  {
    title: 'Aderência & Impacto',
    description:
      'problema concreto do dia a dia que pode ser resolvido de forma direta e traz ganho real para a microempresa.',
  },
  {
    title: 'Viabilidade & Capacidade',
    description:
      'disponibilidade real de quem vai construir e de 2+ revisores que dominem a tecnologia necessária.',
  },
  {
    title: 'Proporcionalidade & Clareza',
    description:
      'escopo compatível com uma entrega enxuta e regras fáceis de transformar em critérios objetivos do pronto.',
  },
  {
    title: 'Baixo Risco Externo',
    description:
      'menor dependência de serviços de terceiros, nuvens caras ou integrações instáveis fora do controle do projeto.',
  },
];

export const ROLES: RoleItem[] = [
  {
    title: 'Desenvolvedor Executor (Executor / Lead)',
    description:
      'Lidera a entrega na prática: fecha o documento sintético do pronto, constrói no repositório central e alinha ajustes com revisores e empresa.',
    tone: 'default',
  },
  {
    title: 'Desenvolvedores Revisores (2+ Pares)',
    description:
      'Pelo menos 2 colegas independentes conferem segurança, LGPD e aderência ao combinado; nenhuma entrega sai com 1 parecer só.',
    tone: 'tonal-primary',
  },
  {
    title: 'Responsável de Suporte',
    description:
      'Profissional nomeado na homologação para acompanhar a estabilização pós-entrega, orientar o uso e coordenar transições no período combinado.',
    tone: 'tonal-secondary',
  },
];

export const CONTINUITY_RULES: ContinuityRule[] = [
  {
    title: '1. Afastamento Programado & Sincronização',
    description:
      'Quem precisa pausar avisa na issue oficial e realiza sincronização compulsória (push de branches, mapa de tarefas e decisões). É vedado reter código, credenciais ou dados em máquina local.',
    tone: 'default',
  },
  {
    title: '2. Inércia (> 5 dias úteis) & Reatribuição',
    description:
      'Passados 5 dias úteis sem resposta nem justificativa, declara-se vacância: acessos são revogados e revisores ou organização fazem reatribuição transitória, evitando cancelamento ou prejuízo à empresa.',
    tone: 'tonal-tertiary',
  },
];

export const REGISTRY_COL_A: string[] = [
  'Código do pedido na ficha de acompanhamento (issue oficial);',
  'Documento sintético do pronto e critérios de aceitação validados;',
  'Nomes do Executor, dos 2+ Revisores e do Responsável de Suporte;',
];

export const REGISTRY_COL_B: string[] = [
  'Decisões técnicas registradas e histórico de aprovações por 2+ pares;',
  'Repositório central, branches sincronizadas e guia básico de uso;',
  'Datas combinadas, avisos de afastamento e registro de transição.',
];

/* ==========================================================================
   Qualidade, Segurança, LGPD & Ética (/governanca/)
   ========================================================================== */

export const DOD_ITEMS: string[] = [
  'Formatadores e linters configurados na raiz do projeto;',
  'Commits semânticos (feat, fix, refactor, docs) ligados à ficha (issue);',
  'Revisão por 2+ pares aprovada e testes em staging com dados sintéticos;',
  'Checagem de segurança limpa (sem SQLi, XSS ou segredos fixos no código);',
  'Guia básico de uso entregue para a microempresa.',
];

export const STACK_ITEMS: IdentityItem[] = [
  {
    title: 'Tecnologias Maduras',
    description:
      'Node.js/TypeScript, Python, Go, PHP moderno e web padrão — ferramentas conhecidas e fáceis de manter por qualquer equipe.',
  },
  {
    title: 'Bancos de Dados Estáveis',
    description:
      'PostgreSQL, MySQL/MariaDB ou SQLite para guardar informações com integridade, leveza e baixo custo operacional.',
  },
  {
    title: 'Sem Lock-in em Nuvem',
    description:
      'arquitetura simples que rejeita estruturas pesadas, custos excessivos e dependência de um único provedor de nuvem (vendor lock-in).',
  },
  {
    title: 'Chancela Coletiva Transparente',
    description:
      'método padronizado e histórico aberto na ficha do projeto, mantendo responsabilidade profissional individual de cada par.',
  },
];

export const SECURITY_CARDS: SecurityCard[] = [
  {
    title: 'Defesa contra SQLi & XSS',
    description:
      'Uso de consultas parametrizadas (prepared statements) contra SQL Injection e higienização de entradas e saídas contra XSS.',
    code: 'sql injection & xss',
  },
  {
    title: 'Senhas, Chaves & Tráfego',
    description:
      'Tráfego cifrado em HTTPS/TLS, hash robusto com salt dinâmico (Argon2 ou bcrypt) e proibição estrita de segredos no código (hardcoded secrets).',
    code: 'https/tls & argon2',
  },
  {
    title: 'Dependências & Acesso Mínimo',
    description:
      'Verificação contínua de bibliotecas de terceiros, controle de acessos por papel, proteção de rotas e sigilo sobre dados da empresa.',
    code: 'checagem & sigilo',
  },
];

export const LGPD_ITEMS: IdentityItem[] = [
  {
    title: 'Controladora × Operadores',
    description:
      'a microempresa é a Controladora (decide sobre os dados); os devs atuam como Operadores técnicos seguindo instruções dela. Não substitui assessoria jurídica.',
  },
  {
    title: 'Privacy by Design & Coleta Mínima',
    description:
      'privacidade pensada desde o desenho do sistema, coletando e armazenando apenas os dados estritamente necessários.',
  },
  {
    title: 'Regra de Ouro (Zero Dados Reais)',
    description:
      'é proibido usar dados reais de pessoas físicas em desenvolvimento local ou staging — apenas dados sintéticos ou anonimizados.',
  },
  {
    title: 'Titular & Incidentes',
    description:
      'meios claros para o titular consultar ou excluir seus dados e comunicação rápida à empresa em incidentes, com registro restrito.',
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
  title: 'Autonomia sem Vínculo',
  description:
    'cada participante atua de forma voluntária e autônoma, sem vínculo empregatício ou societário, respondendo pelos próprios atos.',
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
        label: 'Fase NYX (Experimentação)',
        text: 'ponto de partida focado em testar métodos colaborativos e conectar talentos técnicos em torno de problemas reais.',
      },
      {
        label: 'Fase Expliance (Sistematização)',
        text: 'etapa intermediária que estruturou regras de convivência, processos e frentes técnicas replicáveis.',
      },
      {
        label: 'Yuko (Síntese Enxuta)',
        text: 'ponte técnica amadurecida que corta burocracia excessiva mantendo rigor, transparência pública e rastreabilidade.',
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
        description: 'parceria assistida, palco de continuidade, pilares, simulador e Discord.',
      },
      {
        label: 'Extensões',
        href: '/extensoes/',
        description: 'origem NYX → Expliance → Yuko, pilares, 6 extensões, 6 frentes e Discord.',
      },
      {
        label: 'Ciclo',
        href: '/ciclo/',
        description: 'esteira de 6 etapas, papéis, afastamento programado, regra de 5 dias e ficha.',
      },
      {
        label: 'Qualidade & LGPD',
        href: '/governanca/',
        description: 'DoD completo, arquitetura sem lock-in, segurança (SQLi/XSS/Argon2), LGPD e mediação.',
      },
    ],
  },
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Afastamento Programado & Inércia (> 5 dias úteis)',
    definition:
      'No afastamento programado, o dev avisa na issue e sincroniza branches, tarefas e decisões (sem reter código, credenciais ou dados locais). Passados 5 dias úteis de inércia sem justificativa, declara-se vacância, acessos são revogados e revisores ou organização reatribuem a tarefa.',
  },
  {
    term: 'Ambiente de Testes (Staging)',
    definition:
      'Espaço separado da produção onde testamos funções, celular e velocidade apenas com dados sintéticos. Se qualquer critério falhar em staging, a entrega volta direto ao executor antes da liberação.',
  },
  {
    term: 'Chancela Coletiva',
    definition:
      'Validação pública garantida pelo método, revisão por 2+ pares e rastreabilidade da comunidade — sem vínculo empregatício, societário ou responsabilidade solidária, preservando a responsabilidade individual de cada profissional.',
    tone: 'primary',
  },
  {
    term: 'Ciclo de Entrega Assistida',
    definition:
      'Esteira engrenada em seis etapas sem caixa-preta: triagem, escopo escrito, construção centralizada, revisão por 2+ pares, testes em staging e entrega com Responsável de Suporte nomeado.',
  },
  {
    term: 'Conformidade LGPD (Controladora & Operadores)',
    definition:
      'Enquadramento na Lei nº 13.709/2018 em que a microempresa é a Controladora (decide sobre os dados) e os desenvolvedores atuam como Operadores técnicos. Não substitui assessoria jurídica.',
    tone: 'tertiary',
  },
  {
    term: 'Critério de Pronto (DoD · Definition of Done)',
    definition:
      'Lista obrigatória antes de liberar: formatadores/linters na raiz, commits semânticos (feat, fix, refactor, docs) ligados à issue, revisão por 2+ pares, staging com dados sintéticos, segurança limpa e guia básico de uso.',
    tone: 'primary',
  },
  {
    term: 'Critérios de Aceitação',
    definition:
      'Condições objetivas registradas no documento sintético do pronto antes da construção para que a microempresa saiba exatamente quando a entrega está aprovada.',
  },
  {
    term: 'Dados Sintéticos',
    definition:
      'Dados fictícios ou anonimizados usados exclusivamente em desenvolvimento local e staging, cumprindo a Regra de Ouro de jamais expor dados reais de pessoas físicas.',
  },
  {
    term: 'Dependência de Nuvem (Vendor Lock-in)',
    definition:
      'Risco de prender a microempresa a um único provedor ou arquitetura cara e complexa. A Yuko evita lock-in priorizando tecnologias maduras, modulares e portáveis.',
  },
  {
    term: 'Desenvolvedor Executor (Executor / Lead)',
    definition:
      'Participante que lidera a construção na prática: fecha o documento sintético do pronto, desenvolve no repositório central e alinha ajustes com revisores e microempresa.',
  },
  {
    term: 'Desenvolvedores Revisores (2+ Pares)',
    definition:
      'Pelo menos dois colegas independentes que conferem segurança, LGPD e aderência ao combinado; nenhuma entrega vai ao ar com apenas um parecer.',
  },
  {
    term: 'Extensões da Marca',
    definition:
      'Portas públicas sob o nome Yuko (Field, Dev, Make, Place, Work e Inline) que cobrem prospecção e escuta, engenharia, prototipagem, espaço comunitário, governança operacional e automações.',
  },
  {
    term: 'Ficha de Acompanhamento (Issue de Registro)',
    definition:
      'Registro oficial obrigatório que centraliza número do projeto, escopo aprovado, nomes de executor, revisores e suporte, decisões técnicas e histórico de transições.',
  },
  {
    term: 'Frentes de Atuação',
    definition:
      'Seis disciplinas internas aplicadas nos bastidores de cada projeto: Organização e Execução, Tecnologia e Desenvolvimento, Inteligência e Avaliação, Gestão Multidisciplinar, Integridade Informacional e Governança e Segurança.',
  },
  {
    term: 'Histórico Organizado (Commits Semânticos)',
    definition:
      'Padrão de mensagens de mudança no código usando prefixos claros (feat, fix, refactor, docs) vinculados à issue do projeto para manter rastreabilidade entre pares.',
  },
  {
    term: 'Linhagem NYX → Expliance → Yuko',
    definition:
      'Ponte técnica em duas fases precursoras: da experimentação colaborativa inicial (NYX) à sistematização de processos e frentes (Expliance), culminando na síntese enxuta e rastreável da Yuko.',
  },
  {
    term: 'Pilares da Marca (Yukon, Oslo e Verona)',
    definition:
      'Referências filosóficas da identidade Yuko: Yukon (resiliência e exploração prática), Oslo (minimalismo e clareza sem ruídos) e Verona (solidez histórica e respeito ao registro formal).',
  },
  {
    term: 'Privacy by Design & Regra de Ouro (LGPD)',
    definition:
      'Princípio de embutir privacidade e coleta mínima desde o desenho do sistema, somado à Regra de Ouro: zero dados reais de clientes em desenvolvimento local ou ambiente de testes (staging).',
    tone: 'tertiary',
  },
  {
    term: 'Responsável de Suporte',
    definition:
      'Desenvolvedor nomeado oficialmente na homologação para acompanhar a estabilização em produção e coordenar transições durante o período combinado.',
    tone: 'secondary',
  },
  {
    term: 'Revisão por Pares (Peer Review)',
    definition:
      'Conferência obrigatória por pelo menos dois desenvolvedores independentes para validar legibilidade, segurança, LGPD e cumprimento do escopo antes da homologação.',
  },
  {
    term: 'Segurança de Código (SQLi, XSS, Salt & Secrets)',
    definition:
      'Conjunto mínimo exigido na revisão: consultas parametrizadas (prepared statements) contra SQL Injection, higienização contra XSS, HTTPS/TLS, hash com salt dinâmico (Argon2/bcrypt) e proibição de hardcoded secrets.',
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
    categoryDescription:
      'Conecte formulários e rotinas com arquitetura leve, sem nuvem cara nem lock-in.',
    profileTitle: 'Operação Conectada',
    profileBadge: 'Ponte Enxuta',
    shortSummary: 'Liga ferramentas com arquitetura leve, sem nuvem cara nem retrabalho.',
    clientShortSummary: 'Confirmação rápida e respostas consistentes a cada pedido.',
    humanSummary:
      'Conecta formulários, planilhas e avisos da equipe com tecnologia simples, sem lock-in nem retrabalho manual.',
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
    categoryDescription:
      'Privacy by Design, coleta mínima, HTTPS/Argon2 e papéis claros na LGPD (Controladora e Operador).',
    profileTitle: 'Base Organizada (LGPD)',
    profileBadge: 'Cuidado & Sigilo',
    shortSummary: 'Coleta mínima, proteção contra falhas e dados reais proibidos em testes.',
    clientShortSummary: 'Coleta mínima, acesso restrito e direitos dos titulares.',
    humanSummary:
      'Privacy by Design com empresa Controladora, dev Operador e Regra de Ouro (zero dados reais em dev/staging).',
    clientProfileHook:
      'Acesso restrito, coleta mínima, dados sintéticos em testes e respeito aos seus direitos.',
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
      'Retome sistemas com código preso, sem documentação ou sem suporte para o repositório central.',
    profileTitle: 'Retomada Assistida',
    profileBadge: 'Continuidade Ativa',
    shortSummary: 'Resgata o código para o repositório central com suporte nomeado.',
    clientShortSummary: 'Serviço estável de volta com acompanhamento técnico.',
    humanSummary:
      'Traz o código para o repositório central, documenta, revisa por 2+ pares e nomeia suporte.',
    clientProfileHook:
      'O serviço volta a funcionar de forma estável, com suporte nomeado e troca segura.',
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
    shortSummary: 'Fecha escopo enxuto e constrói no repositório central, sem código local.',
    humanSummary:
      'Constrói com tecnologias maduras, commits semânticos ligados à issue e zero código ou senhas locais.',
  },
  revisor: {
    label: 'Revisar 2+',
    profileTitle: 'Guardião de Revisão (2+)',
    profileBadge: 'Olhar Independente',
    shortSummary: 'Confere segurança, LGPD e staging com outro par (2+ pareceres).',
    humanSummary:
      'Audita SQLi/XSS, Argon2/bcrypt e LGPD em 2+ pares; se falhar em staging, devolve ao executor.',
  },
  suporte: {
    label: 'Apoiar',
    profileTitle: 'Referência de Continuidade',
    profileBadge: 'Pós-Entrega Ativo',
    shortSummary: 'Assume o pós-entrega após homologação e garante passagem de bastão.',
    humanSummary:
      'Acompanha em produção após homologação e coordena transições via aviso na issue ou regra dos 5 dias.',
  },
};
