# Parecer Eval-2 — Avaliação Linguística de Subpáginas, Metadados e Coesão Narrativa Global

**Escopo analisado (somente leitura):**
- `src/pages/extensoes.astro`
- `src/pages/ciclo.astro`
- `src/pages/governanca.astro`
- `src/pages/manual.astro`
- `src/layouts/BaseLayout.astro`
- `src/data/yuko.ts` (linhas 140–170 e 301–826; conferência cruzada com linhas 1–139, 171–300 e `Footer.astro` / `index.astro` para validar coesão global)

**Objetivo do parecer:** Avaliar a aderência das subpáginas e metadados globais à abordagem **pública, lúdica, acessível, explicativa, organizada, direta, objetiva e completa** descrita na documentação de referência da Yuko, preservando o rigor técnico/jurídico e respeitando os limites espaciais dos cards (`.m3-card`, `.lab-panel`, `.pipeline-grid`) definidos em `src/styles/global.css`.

---

## 1. Diagnóstico Executivo: Por que o site atual soa fragmentado

Uma revisão anterior (`docs/revisao/guia-de-termos.md`) comprimiu excessivamente os textos para evitar promessas absolutas e confinou a história **NYX → Expliance → Yuko** apenas ao `/manual/`. O resultado atual apresenta **quatro rupturas de coesão narrativa e tom**:

1. **Tom excessivamente defensivo e técnico-burocrático nas subpáginas:** Expressões como *"em implantação gradual"* repetem-se de forma mecânica (3 vezes em `/extensoes/`, além de `BaseLayout`/`Footer`/Home). Em vez de acolher o leitor com uma explicação lúdica e segura de *como a engrenagem funciona*, o texto frequentemente soa como nota de rodapé cautelar.
2. **História e "porquês" escondidos ou amputados:**
   - `/extensoes/` abre a seção `#fundamentos` com o título **"De onde vem a Yuko e como nos apresentamos"**, mas **não conta de onde a Yuko veio** (a ponte técnica em duas fases precursoras: **Fase NYX** e **Fase Expliance**). O leitor precisa adivinhar ou ir até `/manual/` para descobrir.
   - `/governanca/` lista tecnologias e bancos de dados, mas **omite o porquê lúdico e estratégico**: *simplicidade arquitetural para evitar custos excessivos e dependência de nuvem (`vendor lock-in`)*.
3. **Omissões técnicas relevantes para o rigor prometido:**
   - `/governanca/` omite proteções explícitas contra **SQL Injection (`prepared statements`)**, **XSS (higienização de saídas/entradas)**, **salt dinâmico** no hash de senhas, proibição de **`hardcoded secrets`** com esse nome reconhecível, **formatadores/linters na raiz**, tipos de **commits semânticos (`feat`, `fix`, `refactor`, `docs`)**, **Privacy by Design** e a **Regra de Ouro** de zero dados reais em desenvolvimento local/*staging*.
   - `/ciclo/` não explicita a metáfora da **esteira engrenada e sem caixa-preta**, não explica o retorno ao executor quando um teste falha na Etapa 5, e não distingue com clareza o **afastamento programado** (aviso na issue oficial + sincronização compulsória de código, tarefas e decisões, vedada retenção de **código, credenciais ou dados** em máquina local) da **inércia sem justificativa (> 5 dias úteis)** com reatribuição transitória pelos **revisores/organização** para evitar cancelamento unilateral ou prejuízo à microempresa.
4. **Inconsistência de metadados, rótulos e termos órfãos entre páginas:**
   - Padrão de `<title>` varia entre `"— Yuko"`, `"— Yuko Institucional"` e sem sufixo (`/manual/`).
   - `ogImageAlt` usa o fallback genérico de `BaseLayout.astro` em todas as subpáginas.
   - `/extensoes/` afirma na seção visual que a marca usa *"preto, branco e tons de alto contraste"*, enquanto o site em `BaseLayout.astro` abre em **Terracota Solar** (`#a93714`) com 4 temas coloridos (Material You 3) — sem uma frase que esclareça a diferença entre a identidade institucional monocromática neutra e a paleta adaptativa da interface web.
   - Termos usados na Home e no Rodapé (ex.: **"Chancela Coletiva"**) não são explicados em `/ciclo/` ou `/governanca/` e não constam no Glossário de `/manual/`.

---

## 2. Análise Detalhada por Página e Metadados

### 2.1. `src/pages/extensoes.astro` & `src/data/yuko.ts` (L305–444)

| Bloco / Arquivo | Situação Atual | Lacunas & Problemas de Tom | Recomendação Objetiva |
|---|---|---|---|
| **SEO / `<BaseLayout>`** (`extensoes.astro` L18–25) | `title="Extensões, Frentes & Discord — Yuko"`<br>`description` cita pilares, 6 extensões, 6 frentes e Discord em formato de lista seca. | Não menciona a origem/trajetória (**NYX → Expliance → Yuko**) nem explica a finalidade prática das extensões; `ogImageAlt` omitido. | Padronizar `<title>` e tornar `description` narrativa e convidativa; passar `ogImageAlt` específico. |
| **Hero** (`extensoes.astro` L26–42) | Título `"Identidade, Extensões & Frentes"` e lead com `"em implantação gradual"`. Botões: `6 Extensões`, `Valores`, `6 Frentes`, `Discord`. | O botão `Valores` aponta para `#fundamentos`, cujo título é `"De onde vem a Yuko..."` — o rótulo do botão não bate com o conteúdo de origem + identidade visual. | Renomear botão para `Origem & Pilares` (ou `Origem & Identidade`) e suavizar o lead para explicar como a Yuko nasceu e se organiza. |
| **#fundamentos** (`extensoes.astro` L45–72; `IDENTITY_PILLARS` L305–321; `VISUAL_RULES` L323–339) | Promete `"De onde vem a Yuko"`, mas traz apenas os 3 pilares geográficos (Yukon, Oslo, Verona) e 3 regras visuais genéricas. | **Falha crítica de coesão:** esconde a linhagem **Fase NYX → Fase Expliance → Yuko**. Nos pilares, falta o tom lúdico/filosófico da documentação (Yukon = resiliência e vastidão exploratória; Oslo = minimalismo radical, ausência de ruídos e clareza objetiva; Verona = solidez histórica, caráter perene e respeito ao registro formal). Em `VISUAL_RULES`, *"preto, branco e tons de alto contraste"* entra em atrito visual com o site Terracota/Botânico/Oceânico/Ameixa. | Inserir faixa/sub-bloco sintético no topo do `.lab-panel` explicando a ponte **NYX → Expliance → Yuko** (3 passos em `.grid-3` antes ou acima dos pilares, ou card introdutório limpo dentro de `#fundamentos`). Atualizar `IDENTITY_PILLARS` e `VISUAL_RULES` explicitando visual monocromático da marca oficial (foco em legibilidade absoluta e neutralidade) e distinguindo-o do tema adaptativo do portal. |
| **#extensoes** (`EXTENSIONS` L341–384) | Cards limpos em `.grid-3` com `code` no rodapé. | `Yuko Place` e `Yuko Inline` repetem *"em evolução gradual"*. Faltam termos-chave da referência: **prospecção e imersão na rotina** (Field), **engenharia e arquitetura** (Dev), **prototipagem ágil** (Make), **integração e repositórios coletivos** (Place), **governança operacional e gestão** (Work), **fluxo contínuo e produtividade** (Inline). | Enriquecer cada descrição mantendo ~110–145 caracteres para não desequilibrar a altura dos cards em `.grid-3`. |
| **#frentes** (`extensoes.astro` L100–134; `FRONTS` L386–417) | Lista em 2 colunas dentro de `.lab-panel`. | Tom administrativo duro (`"Enquadramento dos pedidos..."`, `"Integridade Informacional"`). A diferença entre Extensões (vitrine/portas de entrada) e Frentes (disciplinas aplicadas nos bastidores) não fica visualmente intuitiva para leigos. | Usar uma analogia simples em `section-desc` (portas de entrada × disciplinas aplicadas nos bastidores) e manter os nomes oficiais das 6 frentes com explicação direta do que fazem na prática. |
| **#discord** (`extensoes.astro` L137–182; `DISCORD_CHANNELS` L419–444) | Cita canais institucionais, conhecimento técnico, operacionais e comunicação construtiva. | **Omissões:** (1) não informa que os canais de projeto são **temporários enquanto o projeto está ativo**; (2) não informa nesta seção que a participação é **voluntária e autônoma, sem vínculo empregatício ou societário**. | Explicitar "canais temporários para projetos ativos" em `Operacionais e de Projetos` e incluir no bloco de diretriz (`kind: 'guideline'`) a regra de **participação voluntária e autônoma, sem vínculo empregatício ou societário**. |

---

### 2.2. `src/pages/ciclo.astro` & `src/data/yuko.ts` (L450–564)

| Bloco / Arquivo | Situação Atual | Lacunas & Problemas de Tom | Recomendação Objetiva |
|---|---|---|---|
| **SEO / `<BaseLayout>`** (`ciclo.astro` L16–23) | `title="Ciclo de Entrega Assistida, Papéis & Registro — Yuko"` | Bom, mas `description` foca na regra de vacância antes de explicar o benefício central da esteira transparente ("sem caixa-preta"). Falta `ogImageAlt`. | Ajustar `description` para destacar fluxo em 6 etapas transparentes ("sem caixa-preta"), revisão por 2+ pares e proteção contra abandono. |
| **Hero & Intro de `#etapas`** (`ciclo.astro` L24–47) | `"Combinado claro, revisão por 2+ pares, testes antes da entrega..."` | Falta a imagem pública e lúdica da referência: uma **esteira engrenada e transparente ("sem caixa-preta")**, onde cada etapa só avança com evidência registrada. | Incorporar o conceito de esteira engrenada e sem caixa-preta no `hero-lead` ou em `section-desc` de `#etapas`. |
| **6 Etapas (`CYCLE_STAGES` L450–493)** | Cards em `.pipeline-grid` (`.grid-3`). | **Lacunas por etapa:**<br>• **Etapa 1:** falta citar explicitamente os três filtros (*viabilidade, proporcionalidade e impacto*).<br>• **Etapa 2:** pode ser explicada de modo mais palpável como *"documento sintético do pronto"* (mapa simples do que será entregue e aprovado).<br>• **Etapa 3:** cita repositório, issue, linter e commits, mas omite **modularidade** e **tecnologias maduras**.<br>• **Etapa 4:** bem estruturada; pode citar o termo *Peer Review* entre parênteses.<br>• **Etapa 5:** cita celular e velocidade, mas **omite o fluxo de retorno em caso de falha** (*"se falhar, volta direto ao executor antes da liberação"*).<br>• **Etapa 6:** sólida (homologação com a microempresa + Responsável de Suporte nomeado). | Atualizar as 6 descrições mantendo ~125–165 caracteres por card para preservar o alinhamento da grade 3×2. |
| **Critérios de Triagem (`TRIAGE_CRITERIA` L495–516)** | 4 itens dentro de `.lab-panel`. | Tom bom e objetivo, bem alinhado à Etapa 1. Apenas ajustar fluidez ("Baixo Risco Externo" pode ficar mais próximo da linguagem do microempresário). | Pequeno polimento de fluidez (opcional), mantendo os 4 critérios. |
| **Papéis (`ROLES` L518–537)** | 3 cards: Executor, Revisores (2+), Suporte. | "Desenvolvedor Executor" pode trazer "(Executor / Lead)" na descrição para manter ponte com vocabulário técnico de projetos sem assustar o leigo. | Manter os 3 cards com leve ajuste de clareza. |
| **Continuidade & Prevenção ao Abandono (`CONTINUITY_RULES` L539–552)** | 2 cards: `Transição Obrigatória de Contexto` e `Regra de Vacância (5 dias úteis)`. | **Falhas de completude face à referência:**<br>1. Não explicita o **Afastamento Programado** (aviso prévio na issue oficial + sincronização compulsória de *branches*/atualizações, mapa de tarefas e decisões).<br>2. Diz *"código ou senhas"*, omitindo **dados** (vedado reter **código, credenciais ou dados** em máquina local).<br>3. Na regra de 5 dias úteis, não diz **quem** assume a reatribuição transitória (*revisores ou organização*) nem **por quê** (*evitar cancelamento unilateral ou prejuízo à microempresa*). | Reescrever os 2 cards com títulos paralelos claros: **1. Afastamento Programado & Sincronização** e **2. Inércia (> 5 dias úteis) & Reatribuição**, cobrindo integralmente as regras sem ultrapassar ~230 caracteres por card em `.grid-2`. |
| **Registro Formal (`#registro` L131–161; `REGISTRY_COL_A/B` L554–564)** | `"Nada fica só no combinado de boca"` | Ótimo título lúdico! Bem claro. Apenas garantir que `REGISTRY_COL_B` cite explicitamente decisões registradas e histórico de aprovações. | Manter o tom; pequeno ajuste de paralelismo nos bullets. |

---

### 2.3. `src/pages/governanca.astro` & `src/data/yuko.ts` (L570–657)

| Bloco / Arquivo | Situação Atual | Lacunas & Problemas de Tom | Recomendação Objetiva |
|---|---|---|---|
| **SEO / `<BaseLayout>`** (`governanca.astro` L13–20) | `title="Qualidade, Segurança, LGPD & Ética — Yuko Institucional"` | **Inconsistência de título:** único que usa `"— Yuko Institucional"` em vez de `"— Yuko"`. | Padronizar para `"Qualidade, Segurança & LGPD — Yuko"` (ou `"Qualidade, Segurança, LGPD & Ética — Yuko"`). |
| **Bloco `#engenharia`: Critério de Pronto (`DOD_ITEMS` L570–576)** | Lista de 5 itens no card `tonal-primary`. | **Incompleto frente à referência:** omite **formatadores/linters na raiz do projeto** (que ficaram isolados no card vizinho) e não explicita os tipos de commits semânticos (`feat`, `fix`, `refactor`, `docs`) vinculados à issue. Usa linguagem um pouco vaga em *"Sem falhas graves conhecidas de segurança em aberto"*. | Reunir os requisitos reais da `Definition of Done (DoD)` dentro de `DOD_ITEMS` (formatador/linter na raiz, commits `feat/fix/refactor/docs` ligados à issue, revisão 2+ pares, testes com dados sintéticos, guia básico e checagem de segurança). |
| **Bloco `#engenharia`: Tecnologias & Arquitetura (`STACK_ITEMS` L578–595)** | Lista de 4 itens (`Padronização de Código`, `Histórico Organizado`, `Tecnologias Conhecidas`, `Bancos de Dados Estáveis`). | **Falta o argumento principal de simplicidade arquitetural:** não explica *por que* a Yuko escolhe Node.js/TypeScript, Python, Go, **PHP moderno** e PostgreSQL/MySQL/MariaDB/SQLite — ou seja, **evitar custos excessivos e dependência de nuvem (`vendor lock-in`)**. Além disso, omite "PHP moderno". | Renomear o card para **"Simplicidade Arquitetural & Sem Lock-in"** (ou **"Tecnologias Maduras & Sem Lock-in"**), incluir **PHP moderno** e explicitar que a escolha evita custos altos e dependência de fornecedor de nuvem (`lock-in`). |
| **#seguranca (`SECURITY_CARDS` L597–616)** | 3 cards em `.grid-3`:<br>1. `Validação de Entradas`<br>2. `Senhas & Chaves Seguras`<br>3. `Checagem & Sigilo` | **Omissões técnicas críticas:**<br>• Card 1 é vago demais (*"falhas comuns de entrada"*); **não cita SQL Injection (`prepared statements`) nem higienização contra XSS**.<br>• Card 2 cita HTTPS e Argon2/bcrypt, mas **omite TLS (`HTTPS/TLS`), `salt` dinâmico** e o termo **`hardcoded secrets`** (para clareza técnica ao lado da tradução "segredos no código").<br>• Card 3 está bom, mas pode reforçar proteção de rotas e acesso mínimo. | Atualizar Card 1 (`Blindagem de Entradas: SQLi & XSS` ou `Proteção contra Invasões Comuns`) citando **`prepared statements` contra SQL Injection** e **higienização contra XSS** em linguagem acessível; atualizar Card 2 citando **`HTTPS/TLS`**, **hash com *salt* dinâmico (`Argon2`/`bcrypt`)** e **proibição de `hardcoded secrets`**. |
| **#privacidade: LGPD (`LGPD_ITEMS` L618–637)** | 4 itens em card `tonal-tertiary`. | **Falta vocabulário central:** usa *"sistema estruturado pensando na LGPD"* sem nomear ***Privacy by Design* (privacidade desde o desenho do sistema)**; não destaca o item de testes como a **Regra de Ouro** (*zero dados reais de pessoas físicas em ambiente local ou staging — apenas dados sintéticos/anonimizados*). | Integrar ***Privacy by Design***, **coleta mínima**, **Controladora × Operadores técnicos** e a **Regra de Ouro (zero dados reais em dev/staging)** de forma direta e memorável, mantendo a ressalva jurídica clara. |
| **Mediação de Conflitos (`CONFLICT_STEPS` & `CONFLICT_PRINCIPLE` L639–657)** | 3 passos + Autonomia. | Bem estruturado, claro e conciso. Apenas verificar que "Autonomia" faça eco à ausência de vínculo empregatício/societário explicada em `/extensoes/` e `/manual/`. | Manter estrutura; pequeno refinamento para conectar "sem vínculo empregatício ou societário" em `CONFLICT_PRINCIPLE`. |

---

### 2.4. `src/pages/manual.astro` & `src/data/yuko.ts` (L663–824)

| Bloco / Arquivo | Situação Atual | Lacunas & Problemas de Tom | Recomendação Objetiva |
|---|---|---|---|
| **SEO / `<BaseLayout>`** (`manual.astro` L17–24) | `title="Manual Institucional da Yuko — v1.0 & Glossário"` | Falta consistência de sufixo (`— Yuko`) e a descrição mistura temas sem fluidez. | Padronizar para `"Manual Institucional v1.0 & Glossário — Yuko"`. |
| **Quadro de Controle (`CONTROL_TABLE` L663–680)** | 4 linhas em tabela semântica. | Claro e bem estruturado. | Manter. |
| **Ressalvas & Linhagem (`MANUAL_ORIGINS` L682–743)** | 4 cards em `.grid-2`. | O card `2. Linhagem: NYX → Expliance → Yuko` está muito seco (frases telegráficas) e não traduz o conceito da **ponte técnica em duas fases precursoras** nem a ideia de *articulação de talentos* (NYX) e *sistematização de processos e frentes técnicas* (Expliance). No card `Guia Rápido de Navegação`, as descrições dos links devem refletir os novos conteúdos (ex.: origem em `/extensoes/`, anti-lock-in e segurança em `/governanca/`). | Enriquecer a descrição das fases NYX, Expliance e Yuko em linguagem pública fluida, espelhando `/extensoes/` (com `/manual/` servindo como síntese formal + glossário). |
| **Glossário (`GLOSSARY_TERMS` L745–824)** | 15 termos pesquisáveis via `GlossaryExplorer`. | **Lacuna de cobertura:** Faltam verbetes para termos que o usuário espera entender no site ou que aparecem em outras páginas:<br>1. **Chancela Coletiva** (usado na Home e no rodapé monumental, mas ausente do glossário!).<br>2. **Linhagem NYX → Expliance → Yuko**.<br>3. **Pilares (Yukon, Oslo, Verona)**.<br>4. **Privacy by Design & Regra de Ouro (LGPD)**.<br>5. **Dependência de Nuvem (`Vendor Lock-in`)**.<br>6. **Proteções de Código (`Prepared Statements`, XSS, `Hardcoded Secrets`, `Salt`)**.<br>Além disso, *Histórico Organizado (Commits Semânticos)* deve citar `feat`, `fix`, `refactor`, `docs`; e *Transição de Contexto & Regra de Abandono* deve diferenciar **Afastamento Programado** de **Inércia (> 5 dias úteis)**. | Expandir o glossário de 15 para ~20–21 termos, mantendo definições curtas (1–2 frases cada) para preservar a escaneabilidade do grid de 2 colunas. |

---

### 2.5. Metadados Globais e Navegação (`BaseLayout.astro`, `TopBar.astro`, `Footer.astro`, `yuko.ts` L142–170)

1. **Títulos `<title>` despadronizados entre rotas:**
   - `/` usa `"Yuko — Comunidade Técnica & Entrega Assistida para Microempresas"`
   - `/extensoes/` usa `"Extensões, Frentes & Discord — Yuko"`
   - `/ciclo/` usa `"Ciclo de Entrega Assistida, Papéis & Registro — Yuko"`
   - `/governanca/` usa `"Qualidade, Segurança, LGPD & Ética — Yuko Institucional"` (único com `"Institucional"`)
   - `/manual/` usa `"Manual Institucional da Yuko — v1.0 & Glossário"` (sem `"— Yuko"`)
2. **`ogImageAlt` único para todas as subpáginas:** `BaseLayout.astro` (L27) define um valor padrão, mas nenhuma subpágina passa a prop `ogImageAlt`. Recomenda-se passar `ogImageAlt` contextualizado em cada página para acessibilidade e compartilhamento.
3. **Âncoras no `Footer.astro` (`PAGE_ANCHORS` L23–51):**
   - Em `/extensoes/`, `{ href: '#fundamentos', label: 'Fundamentos' }` fica mais claro como `'Origem & Pilares'`.
   - `defaultSummary` (L55–58) tem duas variantes quase idênticas que repetem *"em implantação gradual"*; unificar para uma frase direta e acolhedora sobre a comunidade técnica.
4. **Coerência Visual × Texto (`BaseLayout.astro` L36 e L70–90 × `extensoes.astro`):**
   - `BaseLayout.astro` aplica `data-seed="terracota"` por padrão e oferece 4 paletas coloridas (`Terracota Solar`, `Botânico Vivo`, `Índigo Oceânico`, `Ameixa Editorial`), enquanto `VISUAL_RULES` em `/extensoes/` declara *"Uso de preto, branco e tons de alto contraste"*.
   - **Solução narrativa recomendada (sem alterar código de tema):** Explicar em `VISUAL_RULES` que a **marca institucional Yuko** adota identidade monocromática focada em legibilidade absoluta e neutralidade (preto, branco e contraste alto), enquanto o **portal web** oferece paletas acessíveis opcionais sem perder o contraste.

---

## 3. Guia Unificado de Tom, Estilo & Vocabulário

### 3.1. Princípios de Voz (Pública, Lúdica e Rigorosa)
1. **Explicar o "porquê" antes da regra:** Em vez de *"É proibido reter código local"*, usar *"Nada fica preso no computador de alguém: antes de qualquer pausa, todo código e decisão vão para o espaço central"*.
2. **Tradução simultânea (Lúdico + Técnico):** Apresentar primeiro o conceito em linguagem cotidiana e viva, mantendo o termo técnico oficial entre parênteses quando relevante para desenvolvedores e auditoria (ex.: *consultas parametrizadas (`prepared statements`) contra SQL Injection*).
3. **Cortar muletas defensivas:** Substituir repetições excessivas de *"em implantação gradual"* por afirmações positivas de como o modelo opera hoje (mantendo a transparência sobre a evolução gradual apenas onde realmente é uma informação de status, como em `Yuko Place`, `Yuko Inline` e no cabeçalho de contexto da marca).
4. **Manter a trava jurídica correta (sem promessas absolutas):** Continuar evitando *"garantia irrestrita"*, *"100% à prova de falhas"*, *"suporte vitalício"* ou *"substitui assessoria jurídica"*. Usar *"mecanismos de continuidade"*, *"esteira assistida"*, *"projetado com Privacy by Design"* e *"não substitui assessoria jurídica"*.

### 3.2. Dicionário Canônico Unificado (Todas as Páginas)

| Conceito | Forma Canônica no Texto Público | Termo Técnico Associado (entre parênteses na 1ª ocorrência) | Evitar |
|---|---|---|---|
| **Trajetória de Origem** | Ponte técnica em duas fases precursoras: **Fase NYX** → **Fase Expliance** → **Yuko** | — | Esconder a origem fora de `/manual/` |
| **Yukon / Oslo / Verona** | **Yukon** (resiliência e exploração), **Oslo** (minimalismo e clareza sem ruído), **Verona** (solidez, continuidade e registro formal) | — | Descrições genéricas sem o traço filosófico de cada lugar |
| **Ciclo em 6 Etapas** | Esteira engrenada e transparente ("sem caixa-preta") em 6 etapas | Ciclo de Entrega Assistida | "6 passos" soltos / linguagem burocrática |
| **Escopo (Etapa 2)** | Combinado escrito: um mapa sintético do que significa estar pronto | Critérios de aceitação | "Contrato" / jargão vago |
| **Revisão (Etapa 4)** | Conferência obrigatória por pelo menos 2 colegas independentes | Revisão por pares (*Peer Review*) por 2+ devs | "Auditoria formal" / "4+ pessoas" |
| **Testes (Etapa 5)** | Testes de funcionamento, celular (responsividade) e velocidade (desempenho) antes do ar; se falhar, volta ao executor | Ambiente de testes (*staging*) com dados sintéticos | "Testado 100%" / omitir retorno ao executor |
| **Afastamento Programado** | Pausa avisada na ficha oficial com sincronização obrigatória de código, tarefas e decisões | Transferência de contexto + *push* de *branches* | Dizer apenas "código e senhas" (incluir **dados** e **credenciais**) |
| **Inércia (> 5 dias úteis)** | Mais de 5 dias úteis sem resposta nem justificativa gera vacância, revogação de acessos e reatribuição transitória pelos revisores/organização | Vacância funcional | "Troca instantânea" / omitir quem reatribui |
| **Escolha Tecnológica** | Simplicidade arquitetural com tecnologias maduras para evitar custos altos e dependência de nuvem | Sem *vendor lock-in* (Node.js/TS, Python, Go, PHP moderno; PostgreSQL, MySQL/MariaDB, SQLite) | "Stack moderna" genérica / omitir PHP moderno e *lock-in* |
| **Definition of Done (DoD)** | Lista obrigatória do pronto: linter na raiz, commits semânticos (`feat`, `fix`, `refactor`, `docs`) na issue, revisão 2+ pares, testes sintéticos e guia de uso | *Definition of Done* (DoD) | Fragmentar linter/commits fora da lista de pronto |
| **Segurança de Código** | Consultas seguras contra SQL Injection, higienização contra XSS, conexão `HTTPS/TLS`, senhas com *hash* e *salt* dinâmico (`Argon2`/`bcrypt`) e zero segredos no código | *Prepared statements*, sanitização XSS, *hardcoded secrets* proibidos | "Falhas comuns de entrada" (vago demais) |
| **LGPD & Regra de Ouro** | Privacidade desde o desenho (*Privacy by Design*), coleta mínima e Regra de Ouro: zero dados reais de pessoas em desenvolvimento local ou *staging* | Controladora (microempresa) × Operadores técnicos (devs); dados sintéticos/anonimizados | "100% conforme à LGPD" / omitir *Privacy by Design* |
| **Chancela Coletiva** | Método, revisão por 2+ pares e rastreabilidade da comunidade, sem vínculo empregatício nem responsabilidade solidária | Responsabilidade profissional individual | Usar o termo sem defini-lo nas subpáginas e no Glossário |

---

## 4. Propostas Exatas de Texto & Metadados por Seção

> Todos os textos sugeridos abaixo foram calibrados para caber nos containers existentes (`.m3-card`, `.lab-panel`, `.pipeline-grid`, `.clean-list`) sem gerar saltos bruscos de altura nem exigir mudanças de CSS.

### 4.1. Metadados Padronizados (`<BaseLayout>` em cada página)

- **`/extensoes/` (`src/pages/extensoes.astro`)**
  - `title`: `"Origem, Pilares, 6 Extensões & Discord — Yuko"`
  - `description`: `"Da trajetória NYX e Expliance aos pilares Yukon, Oslo e Verona: conheça as 6 extensões da Yuko, as 6 frentes internas e nosso ponto de encontro voluntário no Discord."`
  - `ogImageAlt`: `"Origem, pilares Yukon, Oslo e Verona, 6 extensões e comunidade Discord da Yuko"`
- **`/ciclo/` (`src/pages/ciclo.astro`)**
  - `title`: `"Ciclo de Entrega Assistida em 6 Etapas & Papéis — Yuko"`
  - `description`: `"Esteira engrenada e sem caixa-preta em 6 etapas: do pedido à entrega com revisão por 2+ pares, afastamento programado e regra de vacância em 5 dias úteis."`
  - `ogImageAlt`: `"As 6 etapas do Ciclo de Entrega Assistida, papéis e continuidade na Yuko"`
- **`/governanca/` (`src/pages/governanca.astro`)**
  - `title`: `"Qualidade, Segurança, Arquitetura & LGPD — Yuko"`
  - `description`: `"Critério de pronto (DoD), tecnologias maduras sem dependência de nuvem (lock-in), proteção contra SQL Injection e XSS, Privacy by Design na LGPD e mediação."`
  - `ogImageAlt`: `"Padrões de qualidade, segurança, arquitetura simples e LGPD da Yuko"`
- **`/manual/` (`src/pages/manual.astro`)**
  - `title`: `"Manual Institucional v1.0 & Glossário — Yuko"`
  - `description`: `"Regras públicas do Manual Institucional v1.0, ressalvas jurídicas, linhagem NYX → Expliance → Yuko, gestão enxuta e glossário pesquisável."`
  - `ogImageAlt`: `"Manual Institucional v1.0 da Yuko e glossário pesquisável"`

---

### 4.2. Recomendações por Seção — `/extensoes/`

1. **Hero (`extensoes.astro` L26–42)**
   - **Kicker:** `De onde viemos e como nos organizamos`
   - **H1:** `Origem, Pilares & ` `<span class="accent-word">Extensões</span>`
   - **Lead:** `Conheça a caminhada da Yuko, os valores por trás do nome, as 6 extensões de atuação, as 6 frentes internas e nosso Discord de participação voluntária.`
   - **Botões:** `6 Extensões` (`#extensoes`) · `Origem & Pilares` (`#fundamentos`) · `6 Frentes` (`#frentes`) · `Discord` (`#discord`)

2. **Seção `#fundamentos` — Origem (NYX → Expliance → Yuko) + Pilares + Visual (`extensoes.astro` L45–72 e `yuko.ts` L305–339)**
   - **Título da seção:** `De onde vem a Yuko e como nos apresentamos`
   - **Subtítulo (`section-desc`, adicionar abaixo do H2):** `A Yuko nasceu como síntese de uma ponte técnica em duas fases precursoras — simplificando o caminho sem abrir mão do rigor e do registro.`
   - **Novo sub-bloco de Linhagem no topo do `.lab-panel` (`.grid-3` de 3 colunas, simétrico aos pilares):**
     - **Fase NYX (Experimentação):** `Ponto de partida focado em testar métodos colaborativos e conectar talentos técnicos em torno de problemas reais.`
     - **Fase Expliance (Sistematização):** `Etapa em que regras, processos e frentes técnicas ganharam forma organizada e padrões replicáveis.`
     - **Yuko (Síntese Enxuta):** `O ponto de chegada que corta burocracia excessiva mantendo rigor técnico, clareza pública e rastreabilidade.`
   - **`IDENTITY_PILLARS` (Yukon, Oslo, Verona):**
     - **Yukon (Resiliência):** `Inspira o nome Yuko com vastidão exploratória e firmeza prática para encarar desafios reais sem atalhos frágeis.`
     - **Oslo (Minimalismo):** `Traz clareza objetiva, ausência de ruídos visuais e nomes diretos que qualquer pessoa entende de primeira.`
     - **Verona (Solidez Histórica):** `Representa o caráter perene, o capricho no acabamento e o respeito ao registro formal de cada entrega.`
   - **`VISUAL_RULES` (alinhando marca monocromática × portal):**
     - **Marca Monocromática:** `A identidade oficial da Yuko usa preto, branco e alto contraste para garantir legibilidade absoluta e neutralidade.`
     - **Tipografia & Símbolo:** `Logotipo legível em qualquer tamanho, acompanhado do símbolo da comunidade sem enfeites que atrapalhem a leitura.`
     - **Interface Adaptativa:** `No site público, oferecemos paletas de alto contraste e leitura confortável preservando a clareza da marca oficial.`

3. **Seção `#extensoes` (`EXTENSIONS` L341–384)**
   - **`section-desc`:** `As 6 extensões são as portas públicas sob a marca Yuko — evoluem de forma gradual, sem exigir equipe fixa.`
   - **Cards (`.grid-3`):**
     - **Yuko Field (`prospecção & escuta`):** `Imersão na rotina da empresa, prospecção e validação de contexto antes de propor qualquer tecnologia.`
     - **Yuko Dev (`engenharia & código`):** `Engenharia, arquitetura, escrita de código limpo, revisão entre pares e integração entre ferramentas.`
     - **Yuko Make (`prototipagem & visual`):** `Prototipagem ágil, desenho de interfaces fáceis de usar e cuidado visual de cada solução.`
     - **Yuko Place (`espaço comunitário`):** `Espaço da comunidade para integração de membros, troca técnica e repositórios coletivos.`
     - **Yuko Work (`governança & entregas`):** `Governança operacional, combinados claros, divisão de papéis e acompanhamento dos prazos.`
     - **Yuko Inline (`automações internas`):** `Automações internas e rotinas de apoio para manter o fluxo contínuo e dar produtividade aos projetos.`

4. **Seção `#frentes` (`extensoes.astro` L100–134)**
   - **`section-desc`:** `Se as extensões organizam a fachada da Yuko, as 6 frentes internas são as engrenagens disciplinares combinadas em cada projeto.`
   - *(Manter as 6 frentes existentes em `FRONTS`, que já cobrem bem as disciplinas.)*

5. **Seção `#discord` (`DISCORD_CHANNELS` L419–444)**
   - **`section-desc`:** `Nosso ponto de encontro no Discord reúne desenvolvedores voluntários e autônomos para trocar ideias, tirar dúvidas e tocar projetos ativos.`
   - **Canais:**
     - **Institucionais e Gerais:** `avisos da comunidade, orientações do manual e boas-vindas a novos membros.`
     - **Conhecimento Técnico:** `troca aberta sobre linguagens, arquitetura, segurança e ajuda mútua no dia a dia.`
     - **Temporários de Projetos Ativos:** `canais criados sob demanda para cada entrega ativa alinhar tarefas, revisões e prazos.`
   - **Diretriz (`guideline`):**
     - **Participação Voluntária & Respeitosa:** `Atuação voluntária, autônoma e sem vínculo empregatício ou societário — guiada por clareza técnica, respeito e zero ambiente tóxico.`

---

### 4.3. Recomendações por Seção — `/ciclo/`

1. **Hero (`ciclo.astro` L24–39)**
   - **Lead:** `Uma esteira engrenada e transparente ("sem caixa-preta"): combinado claro, revisão por 2+ pares, testes antes do ar e suporte nomeado pelo período acordado.`

2. **6 Etapas (`CYCLE_STAGES` L450–493)**
   - **1. Demanda — Entrada & Prioridade (`etapa 01 · triagem`):** `Entra pela Yuko Field ou contato direto. Avaliamos viabilidade, proporcionalidade e impacto; se não couber, orientamos.`
   - **2. Escopo & Critérios do Pronto (`etapa 02 · combinado`):** `O executor registra um documento sintético do pronto (escopo + critérios de aceitação) antes de escrever código.`
   - **3. Construção Modular (`etapa 03 · construção`):** `Código modular em tecnologias maduras e repositório central, ligado à ficha (issue), com linter e commits semânticos.`
   - **4. Revisão por 2+ Pares (`etapa 04 · peer review`):** `Pelo menos 2 devs independentes (Peer Review) conferem segurança, legibilidade e o cumprimento do escopo.`
   - **5. Testes & Homologação (`etapa 05 · staging`):** `Testamos funções, responsividade no celular e desempenho em staging (dados sintéticos). Se falhar, volta ao executor.`
   - **6. Entrega & Suporte (`etapa 06 · liberação`):** `Homologação final com a microempresa e nomeação oficial do Responsável de Suporte pelo período combinado.`

3. **Papéis & Prevenção ao Abandono (`CONTINUITY_RULES` L539–552)**
   - **Card 1 — Afastamento Programado & Sincronização:** `Quem precisa pausar avisa na issue oficial e faz sincronização obrigatória (push de branches, mapa de tarefas e decisões). É proibido reter código, credenciais ou dados em máquina local.`
   - **Card 2 — Inércia (> 5 dias úteis) & Reatribuição:** `Passados 5 dias úteis sem resposta nem justificativa, declara-se vacância funcional: os acessos são revogados e revisores ou organização reatribuem a tarefa, evitando cancelamento ou prejuízo à empresa.`

---

### 4.4. Recomendações por Seção — `/governanca/`

1. **Hero (`governanca.astro` L21–36)**
   - **Lead:** `Sistemas enxutos sem dependência de nuvem (lock-in), conferência rigorosa de pronto (DoD), proteção de código contra falhas comuns e LGPD com Privacy by Design.`

2. **Card 1 — Critério de Pronto (`DOD_ITEMS` L570–576)**
   - Título do card: `Lista de Conferência Final (Definition of Done)`
   - Bullets recomendados:
     - `Formatadores e linters configurados na raiz do projeto;`
     - `Commits semânticos (feat, fix, refactor, docs) ligados à ficha (issue);`
     - `Revisão por 2+ pares aprovada e critérios testados com dados sintéticos;`
     - `Sem falhas de segurança abertas nem segredos fixos no código;`
     - `Guia básico de uso entregue para a microempresa.`

3. **Card 2 — Simplicidade Arquitetural (`STACK_ITEMS` L578–595)**
   - Título do card: `Arquitetura Simples & Sem Lock-in`
   - Bullets recomendados:
     - **Tecnologias Maduras:** `Node.js/TypeScript, Python, Go, PHP moderno e web padrão — fáceis de manter por qualquer equipe.`
     - **Bancos Estáveis:** `PostgreSQL, MySQL/MariaDB ou SQLite para guardar informações com integridade e baixo custo.`
     - **Independência de Nuvem (Sem Lock-in):** `Arquitetura enxuta que evita custos excessivos e não prende a microempresa a um único provedor.`
     - **Chancela Coletiva Transparente:** `Método e histórico abertos na ficha do projeto, com responsabilidade profissional individual de cada par.`

4. **#seguranca — 3 Cards (`SECURITY_CARDS` L597–616)**
   - **Card 1 — Blindagem contra Invasões (`sql injection & xss`):** `Uso de consultas parametrizadas (prepared statements) contra SQL Injection e higienização de entradas/saídas contra XSS.`
   - **Card 2 — Senhas, Chaves & Tráfego (`https/tls & hash`):** `Tráfego cifrado em HTTPS/TLS, hash robusto com salt dinâmico (Argon2 ou bcrypt) e proibição de hardcoded secrets.`
   - **Card 3 — Dependências & Acesso Mínimo (`checagem & sigilo`):** `Verificação contínua de bibliotecas de terceiros, controle de acessos por papel e sigilo sobre dados da empresa.`

5. **#privacidade — LGPD (`LGPD_ITEMS` L618–637)**
   - **Papéis na LGPD:** `a microempresa é a Controladora (decide sobre os dados); os devs atuam como Operadores técnicos. Não substitui assessoria jurídica.`
   - **Privacy by Design & Coleta Mínima:** `privacidade pensada desde o desenho do sistema, pedindo apenas os dados estritamente necessários.`
   - **Regra de Ouro (Zero Dados Reais):** `zero dados reais de pessoas físicas em desenvolvimento local ou staging — usamos apenas dados sintéticos ou anonimizados.`
   - **Titular & Incidentes:** `meios claros para o titular acessar ou excluir seus dados e comunicação rápida à empresa em incidentes, com registro restrito.`

---

### 4.5. Recomendações por Seção — `/manual/`

1. **Card `2. Linhagem: NYX → Expliance → Yuko` (`MANUAL_ORIGINS` L692–708)**
   - **Fase NYX:** `laboratório inicial de experimentação em métodos colaborativos e articulação de talentos técnicos.`
   - **Fase Expliance:** `sistematização dos processos, regras de convivência e frentes técnicas de atuação.`
   - **Yuko (Síntese):** `ponte amadurecida que corta burocracia excessiva mantendo rigor técnico, clareza pública e rastreabilidade.`
2. **Novos verbetes sugeridos para `GLOSSARY_TERMS` (L745–824):**
   - `Chancela Coletiva` (alinha com Home e Rodapé Monumental)
   - `Dependência de Nuvem (Vendor Lock-in)`
   - `Linhagem NYX → Expliance → Yuko`
   - `Pilares da Marca (Yukon, Oslo e Verona)`
   - `Privacy by Design & Regra de Ouro (LGPD)`
   - `Segurança de Código (SQLi, XSS, Salt e Hardcoded Secrets)`
   - *(Atualizar)* `Histórico Organizado (Commits Semânticos)`: citar expressamente os prefixos `feat`, `fix`, `refactor`, `docs`.
   - *(Atualizar)* `Afastamento Programado, Inércia & Vacância`: explicitar a diferença entre pausa avisada com sincronização compulsória e inércia > 5 dias úteis com reatribuição transitória.

---

## 5. Checklist de Coesão Global pós-ajustes

- [ ] A história **NYX → Expliance → Yuko** está acessível tanto no contexto narrativo de `/extensoes/` quanto formalizada em `/manual/`.
- [ ] **Yukon, Oslo e Verona** e a **marca monocromática** aparecem com seus significados completos e sem contradição com o seletor de temas de `BaseLayout.astro`.
- [ ] As **6 extensões** cobrem prospecção/imersão (Field), engenharia/arquitetura (Dev), prototipagem ágil (Make), integração/repositórios coletivos (Place), governança operacional/entregas (Work) e automações/fluxo contínuo (Inline).
- [ ] O **Discord** em `/extensoes/` explicita canais **temporários de projetos ativos** e participação **voluntária e autônoma, sem vínculo empregatício ou societário**.
- [ ] O **Ciclo em 6 Etapas** explica a esteira "sem caixa-preta", critérios da Etapa 1 (viabilidade, proporcionalidade, impacto), documento sintético do pronto (Etapa 2), modularidade/tecnologias maduras (Etapa 3), Peer Review 2+ (Etapa 4), retorno ao executor se falhar em staging (Etapa 5) e Suporte nomeado (Etapa 6).
- [ ] A regra de continuidade distingue **afastamento programado** (issue + push/tarefas/decisões; vedado reter código, credenciais ou dados) de **inércia > 5 dias úteis** (vacância, revogação e reatribuição por revisores/organização).
- [ ] `/governanca/` cobre **PHP moderno**, prevenção de **lock-in em nuvem**, **DoD com linters na raiz e `feat/fix/refactor/docs`**, **SQL Injection (`prepared statements`)**, **XSS**, **HTTPS/TLS**, **salt dinâmico (`Argon2`/`bcrypt`)**, **`hardcoded secrets`**, **Privacy by Design** e a **Regra de Ouro** de dados sintéticos.
- [ ] Todos os `<title>`, `<meta name="description">`, `ogImageAlt` e `PAGE_ANCHORS` (`Footer.astro`) seguem o mesmo padrão editorial.
