# Avaliação Linguística (Eval-1) — Home, Palco de Continuidade, Públicos, Simulador e Rodapé

**Escopo avaliado (somente leitura):**
- `src/pages/index.astro`
- `src/data/yuko.ts` (linhas 140–300 e 825–1022)
- `src/components/YukoContinuityStage.tsx`
- `src/components/HeroSculpture.tsx`
- `src/components/YukoOrderSimulator.tsx`
- `src/components/Footer.astro`

**Objetivo da revisão:** Alinhar o texto atual à nova documentação de referência da Yuko, substituindo trechos secos, truncados ou excessivamente defensivos por uma linguagem **pública, lúdica, acessível, organizada, direta, objetiva e completa** — preservando rigor factual (zero valores inventados em `R$` no Piso/Teto, participação autônoma/sem vínculo e caráter orientativo) e respeitando os limites físicos dos cards e do CSS atual.

---

## 1. Diagnóstico Transversal (Padrões Encontrados)

Antes da análise bloco a bloco, cinco padrões estruturais explicam por que a cópia atual soa mais fria e incompleta do que a proposta real da Yuko:

1. **Excesso de blindagem jurídica no lugar da narrativa humana (efeito "bula de remédio"):**
   - A ressalva `"pelo período combinado"` aparece **7+ vezes** entre Hero, Palco, Pilares, Públicos, Simulador e Rodapé; `"(não substitui assessoria jurídica)"` aparece **6 vezes** só em `yuko.ts` e `YukoOrderSimulator.tsx`; e o card de `Microempresas Parceiras` abre com `"chancela coletiva sem vínculo nem responsabilidade solidária e responsabilidade individual de cada par"`.
   - **Impacto:** O visitante lê avisos jurídicos *antes* de entender o problema que a Yuko resolve. A ressalva de caráter orientativo e ausência de vínculo é essencial, mas deve aparecer de forma **limpa e bem posicionada** (ex.: subtítulo/nota de rodapé do Simulador, ficha gerada e banner do Manual), liberando os títulos e parágrafos principais para comunicar propósito com leveza.

2. **Falta da imagem central: a assimetria *"isolamento × caixa-preta"* e a *"parceria assistida"*:**
   - A Home entra direto no jargão de governança (`"exatidão coletiva"`, `"implantação gradual"`, `"responsável de suporte nomeado"`), sem contar a história real que torna a Yuko imediatamente compreensível: *quando um dev independente tem uma emergência, projetos tradicionais travam, o código fica preso na máquina local e o cliente fica sem suporte*.
   - Falta nomear os dois lados da moeda — **isolamento e sobrecarga do dev** vs. **vulnerabilidade e "caixa-preta" da microempresa** — e apresentar a Yuko como **parceria assistida**: *trabalho individual validado coletivamente*.

3. **Lacunas técnicas e operacionais críticas em relação à nova documentação:**
   - **Por que evitar *lock-in*:** O site menciona apenas `"sem prender a empresa"`, mas não explica o motivo prático — a Yuko **rejeita arquiteturas pesadas e custos excessivos em nuvem**, apostando em tecnologias maduras e acessíveis.
   - **Ciclo engrenado (6 etapas) e o retorno em *staging*:** `HOME_PILLARS` diz `"Após triagem, o Ciclo segue 6 etapas"`, dando a entender que a Triagem está *fora* das 6 etapas (quando **Demanda/Triagem** via Yuko Field ou direto é a **Etapa 1**). Além disso, não explica que nos **Testes e Homologação (*staging*)**, **se falhar, volta ao executor** — detalhe lúdico e tranquilizador para o cliente.
   - **Continuidade preventiva vs. reativa:** Só aparece a regra reativa dos **5 dias úteis** (vacância + revogação de acessos), que isolada soa punitiva. Falta mostrar o caminho preventivo e colaborativo: **afastamento programado** (aviso prévio na *issue*) + **sincronização compulsória** (*push* de *branches*, mapeamento e zero código/senhas locais).
   - **DoD de segurança e LGPD completa:** Faltam menções claras (sem virar textão) a **SQL Injection/XSS, HTTPS, Argon2/bcrypt e zero segredos no código (*hardcoded secrets*)**, bem como **Privacy by Design**, papéis **Controladora (microempresa) × Operador (dev)** e a **proibição de dados reais em dev/staging** (não é só "preferência por dados sintéticos", é regra estrita).
   - **Extensões e Discord:** A Home lista os nomes das 6 extensões sem dizer o que fazem e quase não retrata a **convivência diária no Discord** (voluntária e autônoma).

4. **Inconsistência pontual no código de UI do Palco (`YukoContinuityStage.tsx`):**
   - `yuko.ts` define `CONTINUITY_LENS_LABELS` (`Fluxo`, `Rede`, `Respaldo`), mas `YukoContinuityStage.tsx` não renderiza esse seletor nem exibe qual lente está ativa — apenas mostra `activeStage.lensNotes[lens]` fixado em `defaultLens`. Na prática, na Etapa 02 (`Centralização`), a *lensNote* exibida ao usuário fala de LGPD/dados sintéticos em vez de reforçar "repositório central, zero código local e zero *lock-in*".

5. **Âncora ausente no Rodapé:**
   - `Footer.astro` (`PAGE_ANCHORS['/']`) lista `#continuidade`, `#pilares`, `#atuacao` e `#manual`, mas esquece `#simulador`.

---

## 2. Avaliação Detalhada e Sugestões por Bloco

### Bloco A — Hero & Escultura (`src/pages/index.astro`, `src/data/yuko.ts`, `src/components/HeroSculpture.tsx`)

#### Problemas identificados
- **`h1` (`index.astro` L27-29):** `"Software com exatidão coletiva para projetos."` é abstrato e frio. "Exatidão coletiva" não comunica parceria assistida nem o fim do código preso ou da "caixa-preta".
- **`.hero-lead` (`index.astro` L31-33):** `"Comunidade técnica em implantação gradual que conecta desenvolvedores independentes e microempresas para criar sistemas sob medida, com 2+ revisores e responsável de suporte nomeado pelo período combinado."` — Texto denso, burocrático e sem a cena do problema real.
- **`HERO_METRICS` (`yuko.ts` L165-169):**
  - `'6 Etapas'` / `'Do pedido ao suporte'` → Bom, pode deixar explícito "sem caixa-preta".
  - `'2+ Revisores'` / `'Conferência independente'` → Poderia reforçar *"nenhuma entrega vai com 1 parecer só"*.
  - `'5 dias úteis'` / `'Troca assistida se houver ausência'` → Bom resumo, mas deixa de fora o aviso prévio/afastamento programado; pode ser mais claro sobre continuidade.
- **`HeroSculpture.tsx` (L201, L214, L487-492):** Legenda `"Desenvolvimento colaborativo · Revisão por 2+ pares"` é correta, mas pode nomear o conceito-chave (**Parceria assistida**) e os 3 papéis que a própria escultura desenha (`Executor`, `2+ Revisores`, `Suporte`).

#### Sugestões concretas (mantendo porte equivalente)
- **Meta `title` e `description` (`index.astro` L18-19):**
  - `title`: `"Yuko — Parceria Assistida entre Devs Independentes e Microempresas"`
  - `description`: `"Comunidade técnica que tira devs do isolamento e livra microempresas da caixa-preta: trabalho individual validado por 2+ pares, repositório central, LGPD e continuidade assistida."`
- **`#heroHeading` (~46 caracteres):**
  > `Sistemas sob medida com <span class="accent-word">parceria</span> assistida.`
  *(Alternativa mais lúdica: `Código em rede para nenhum projeto <span class="accent-word">parar</span>.`)*
- **`.hero-lead` (~215 caracteres — limite atual 195):**
  > `Quando um dev atua sozinho, uma emergência trava o projeto e deixa a empresa sem suporte. A Yuko une trabalho individual e validação coletiva: repositório central, revisão por 2+ pares e continuidade sem caixa-preta.`
- **`SplitButton` `mainLabel` (`index.astro` L38):**
  > `Explorar as 6 Etapas` (ou manter `Conhecer o Ciclo Assistido`)
- **`HERO_METRICS` (`yuko.ts` L165-169):**
  1. `value: '6 Etapas'` · `label: 'Fluxo transparente, da triagem ao suporte'`
  2. `value: '2+ Revisores'` · `label: 'Nenhuma entrega passa com 1 parecer só'`
  3. `value: '5 dias úteis'` · `label: 'Aviso prévio ou troca assistida sem travar'`
- **`HeroSculpture.tsx` legenda (L488):**
  > `Parceria assistida · Executor, 2+ revisores e suporte`

---

### Bloco B — Palco de Continuidade (`src/components/YukoContinuityStage.tsx` + `CONTINUITY_STAGES` em `src/data/yuko.ts`)

#### Restrições de layout verificadas em `global.css`
- `.stage-chapter-tag` (L1706-1717) tem `white-space: nowrap; overflow: hidden; text-overflow: ellipsis;` → o sufixo de `kicker` (após `·`) precisa ser **curto (1–2 palavras, ≤ 18 caracteres)** para não cortar com `...`.
- Os 4 cards ficam em grid de 4 colunas no desktop (`.stage-chapters`, L1630): `title` deve ter ~25–36 caracteres e `body` entre **115 e 155 caracteres** (3–4 linhas confortáveis).

#### Problemas identificados
1. **Desconexão com os 6 passos e com as regras de ouro:** O palco tem 4 estações (o que funciona visualmente no SVG de 4 nós!), mas precisa condensar com clareza os **6 passos engrenados** e a lógica da continuidade completa:
   - Estação 01 hoje não menciona **Yuko Field** nem os 3 critérios de triagem (**viabilidade, proporcionalidade e impacto**).
   - Estação 02 fala de espaço central, mas a `lensNote` exibe LGPD/dados sintéticos (fora do tema da estação!) e **omite a rejeição a arquiteturas pesadas / *lock-in* em nuvem** e a **proibição de código ou senhas locais**.
   - Estação 03 não menciona o circuito de **testes em *staging* (se falhar, volta ao executor)** nem que **nenhuma entrega sai com 1 parecer só**.
   - Estação 04 foca só na punição dos `5 dias úteis`, omitindo o **afastamento programado (aviso prévio na *issue*)** + **sincronização compulsória** + **revogação de acessos e reatribuição transitória**.

#### Sugestões concretas por estação (`CONTINUITY_STAGES` em `yuko.ts`)

| Campo | Texto atual | Sugestão revisada |
|---|---|---|
| **01 · kicker** | `01 · Combinado` | `01 · Triagem & Escopo` |
| **01 · stageLabel** | `Combinado sem caixa-preta` | `Escuta clara, sem caixa-preta` |
| **01 · title** | `Escuta real e combinado direto` | `Da escuta ao combinado escrito` |
| **01 · body** | `Ouvimos a rotina da empresa antes de criar qualquer tela e registramos de forma clara o que será entregue.` | `Via Yuko Field ou contato direto, avaliamos viabilidade, proporcionalidade e impacto antes de fechar um escopo enxuto e legível.` |
| **01 · lensNote (`fluxo`)** | `Escuta inicial em campo ou contato direto` | `Etapas 1–2 · Triagem e critérios de aceitação no papel` |
| **02 · kicker** | `02 · Centralização` | `02 · Código Aberto na Rede` *(ou `02 · Casa Central`)* |
| **02 · stageLabel** | `Código em espaço central` | `Zero código preso no PC local` |
| **02 · title** | `Nada preso no PC de uma pessoa` | `Sem código local nem lock-in caro` |
| **02 · body** | `Código, acessos e mudanças ficam no espaço central do projeto, usando tecnologias conhecidas — sem prender a empresa.` | `Construímos no repositório central, com tecnologias maduras e modulares. Rejeitamos arquiteturas pesadas, nuvem cara e senhas locais.` |
| **02 · lensNote (`rede`)** | `Discord (#projetos-ativos) e repositório compartilhado` | `Etapa 3 · Repositório central, zero lock-in e histórico claro` |
| **03 · kicker** | `03 · Conferência` | `03 · Pares & Staging` |
| **03 · stageLabel** | `Olhar de 2+ pares` | `2+ revisores e teste antes de ir ao ar` |
| **03 · title** | `Conferido por 2+ revisores` | `2+ pareceres e staging obrigatório` |
| **03 · body** | `Nenhuma entrega vai ao ar sozinha: pelo menos dois desenvolvedores revisam segurança, clareza e funcionamento.` | `Ninguém aprova com 1 parecer só: 2+ pares revisam segurança e LGPD. Se falhar no ambiente de testes (staging), volta ao executor.` |
| **03 · lensNote (`blindagem`)** | `Revisão de segurança por pares e práticas de LGPD` | `Etapas 4–5 · Peer review (2+) + testes com dados sintéticos` |
| **04 · kicker** | `04 · Continuidade` | `04 · Troca Segura` |
| **04 · stageLabel** | `Suporte e troca em 5 dias úteis` | `Passagem de bastão organizada` |
| **04 · title** | `Suporte e troca em 5 dias úteis` | `Suporte nomeado e regra dos 5 dias` |
| **04 · body** | `Há suporte nomeado no período combinado. Após 5 dias úteis sem retorno, registra-se vacância e outro par assume.` | `Após homologação, há Responsável de Suporte. Com aviso na issue ou após 5 dias úteis sem retorno, acessos são revogados e outro par assume.` |
| **04 · lensNote (`blindagem`)** | `Regra dos 5 dias úteis, revogação de acessos e suporte nomeado` | `Etapa 6 · Afastamento programado, push obrigatório ou reatribuição` |

- **Observação sobre `YukoContinuityStage.tsx`:**
  - O título L853 `"Por que nenhum projeto fica na mão"` é excelente — vale manter!
  - Se houver manutenção futura do componente, vale avaliar se `CONTINUITY_LENS_LABELS` deve ser removido (código morto) ou exibido como prefixo discreto na `stage-rising-lens-chip` (`{CONTINUITY_LENS_LABELS[lens]} · {activeStage.lensNotes[lens]}`).

---

### Bloco C — Os 3 Pilares (`#pilares` em `src/pages/index.astro` + `HOME_PILLARS` em `src/data/yuko.ts`)

#### Problemas identificados
- **Cabeçalho (`index.astro` L75-79):** `"Entrega assistida com regras claras"` / `"Combinado escrito, revisão por 2+ pares e responsável de suporte nomeado em um só ciclo."` — Repete o que já foi dito no Hero, sem explicar o conceito de **"fluxo engrenado sem caixa-preta"** nem a função das extensões e da simplicidade/LGPD.
- **Pilar 1 — `Extensões & Frentes` (`yuko.ts` L238-241):** Só lista os 6 nomes (`Field, Dev, Make, Place, Work, Inline`) sem dar pista do que fazem e **omite o Discord** no corpo do card (ele só aparece na tag `"Extensões e Discord →"`).
- **Pilar 2 — `Ciclo de Entrega Assistida` (`yuko.ts` L246-249):** Erro conceitual de contagem (`"Após triagem, o Ciclo segue 6 etapas: entendimento..."` coloca a triagem *antes* das 6 etapas e chama a primeira de "entendimento"). Além disso, não menciona o retorno ao executor quando *staging* falha.
- **Pilar 3 — `Qualidade, Segurança & LGPD` (`yuko.ts` L254-257):** Muito defensivo/genérico. Mistura jargão com ressalva jurídica no meio da frase e **não cita**: rejeição a *lock-in*/nuvem cara, *Privacy by Design*, **Controladora × Operador**, **proibição de dados reais em dev/staging**, nem as práticas objetivas do DoD (SQL Injection/XSS, HTTPS, Argon2/bcrypt, zero segredos no código).

#### Sugestões concretas (respeitando o visual `.feature-arch` com topo arredondado)
- **Cabeçalho `#pilares` (`index.astro` L75-79):**
  - Kicker: `Como a rede funciona`
  - Título: `Engrenagens claras, do pedido ao suporte`
  - Descrição: `Seis extensões integradas, um ciclo de seis etapas sem caixa-preta e simplicidade técnica com foco em LGPD.`
- **`HOME_PILLARS` (`yuko.ts` L234-259):**
  1. **`Extensões & Discord`** (`tag: 'Ver 6 extensões e Discord →'`)
     > `Seis extensões — Field (escuta), Make (experiência), Dev (código), Work (fluxo), Place (espaço) e Inline (integração) — além de seis frentes internas e convivência diária voluntária no Discord.`
  2. **`Ciclo de Entrega Assistida`** (`tag: 'Explorar as 6 etapas →'`)
     > `Seis etapas engrenadas: 1) Demanda e Triagem, 2) Escopo e Critérios, 3) Construção centralizada, 4) Revisão por 2+ pares, 5) Testes em staging (se falhar, volta ao executor) e 6) Entrega com Responsável de Suporte.`
  3. **`Simplicidade, Segurança & LGPD`** (`tag: 'Ver padrões e LGPD →'`)
     > `Tecnologias maduras contra lock-in e nuvem cara, revisão contra SQLi/XSS, HTTPS, Argon2/bcrypt e zero segredos no código. Na LGPD: empresa Controladora, dev Operador, Privacy by Design e proibição de dados reais em dev/staging.`

---

### Bloco D — Públicos (`#atuacao` em `src/pages/index.astro` + `AUDIENCE_CARDS` em `src/data/yuko.ts`)

#### Problemas identificados
- **Cabeçalho (`index.astro` L120-123):** `"Respaldo para microempresas, autonomia para desenvolvedores"` — Bom paralelo! Pode ser um pouco mais caloroso e lúdico para refletir o combate à assimetria.
- **Card 1 — `Microempresas Parceiras` (`yuko.ts` L262-278):**
  - **Tom excessivamente defensivo:** Abre com `"Evita entregas sem explicação: há combinado claro, chancela coletiva sem vínculo nem responsabilidade solidária e responsabilidade individual de cada par."` Isso afasta o dono de pequena empresa logo na primeira frase!
  - **Primeiro bullet começa negativo:** `"Escuta e triagem: pedido pode ser recusado com orientação se desproporcional"`. Em vez de apresentar os critérios positivos (viabilidade, proporcionalidade e impacto), parece que a porta está fechada.
  - **Ausências:** Não explica o alívio da **"caixa-preta" e do risco de abandono**, nem que a empresa **não fica presa a nuvem cara (*lock-in*)**, nem que é **Controladora dos dados** na LGPD (com testes proibidos com dados reais).
- **Card 2 — `Desenvolvedores Independentes` (`yuko.ts` L280-298):**
  - **Descrição:** Boa intenção (`"Troque o trabalho isolado pela rede técnica no Discord"`), mas pode enfatizar a **parceria assistida** (autonomia sem solidão nem sobrecarga) e a convivência diária voluntária.
  - **Bullets truncados:**
    - `"Linter (padrão automático) e commits semânticos (histórico)"` é seco — falta dizer *ligados à issue* e os cuidados práticos de DoD/segurança.
    - `"Registro em ficha (issue), envio (push) e transferência de contexto"` não cita o **afastamento programado** (aviso prévio na *issue* + sincronização compulsória, zero código/senhas locais).
    - `"Após 5 dias úteis sem resposta, há vacância e revogação dos acessos"` precisa explicar que é para proteger o cliente via **reatribuição transitória pelos revisores/organização**, não apenas uma punição seca.

#### Sugestões concretas (`AUDIENCE_CARDS` + cabeçalho `#atuacao`)
- **Cabeçalho `#atuacao` (`index.astro` L120-123):**
  - Kicker: `Parceria assistida`
  - Título: `Fim do isolamento para quem cria, fim da caixa-preta para quem contrata`
- **Card 1 — `Microempresas Parceiras`:**
  - `title`: `Continuidade sem Caixa-Preta`
  - `description`: `Acabe com o risco de código preso e abandono: você recebe tecnologia simples, sem lock-in caro em nuvem, com trabalho individual validado coletivamente pela rede.`
  - `bullets`:
    1. `Triagem honesta (Yuko Field ou direto): avaliamos viabilidade, proporcionalidade e impacto — com orientação clara se não couber`
    2. `Escopo enxuto e staging: testamos antes da homologação (se falhar, volta ao executor) com tecnologias maduras`
    3. `Chancela de 2+ revisores: nenhuma entrega vai ao ar com 1 parecer só e há Responsável de Suporte após o aceite`
    4. `LGPD na prática: sua empresa é a Controladora dos dados; dados reais são proibidos em dev e staging`
- **Card 2 — `Desenvolvedores Independentes`:**
  - `title`: `Autonomia sem Isolamento`
  - `description`: `Troque a sustentação solitária pela convivência diária, voluntária e autônoma no Discord — mantendo sua autonomia profissional sem vínculo empregatício ou societário.`
  - `bullets`:
    1. `DoD objetivo: linter, commits semânticos ligados à issue, HTTPS, Argon2/bcrypt e checagem contra SQLi/XSS e segredos no código`
    2. `Peer Review e LGPD: atue como Executor, Revisor (2+ pares) ou Suporte; você opera sob instrução da Controladora, só com dados sintéticos`
    3. `Zero código local: repositório central e sincronização compulsória (push de branches e mapeamento — sem senhas no PC)`
    4. `Afastamento programado ou 5 dias úteis: avise na issue ao sair; sem retorno por 5 dias úteis, há revogação e troca assistida`

*(Nota de transparência:* Se quiser manter a ressalva de responsabilidade individual / sem responsabilidade solidária visível nessa seção, ela pode entrar em uma linha discreta abaixo dos dois cards ou no rodapé da seção, em vez de travar a frase de abertura do card da microempresa.)

---

### Bloco E — Simulador (`#simulador` em `src/pages/index.astro`, `SIMULATOR_*` em `src/data/yuko.ts` e `src/components/YukoOrderSimulator.tsx`)

#### Restrições verificadas
- **Não inventar preços em `R$`** no medidor Piso/Teto.
- Preservar o caráter **indicativo/orientativo** e a autonomia bilateral sem vínculo.
- Cards de solução em grid 2 colunas (`.sim-solution-card`) comportam `categoryDescription` de ~65–110 caracteres (2–3 linhas).

#### Problemas identificados
1. **Introdução da seção (`index.astro` L171-176):** `"Direcione seu pedido"` / `"Veja estimativa indicativa e gere sua ficha para triagem."` é genérica e não convida o usuário a testar as **3 perspectivas (Empresa, Cliente, Dev)**.
2. **Descrições das 6 categorias (`SIMULATOR_SOLUTIONS`, `yuko.ts` L878-994):**
   - `casa-em-ordem` (`Segurança & LGPD`): `"Organize acessos pensando na LGPD; não substitui assessoria jurídica."` — Desperdiça o card com um aviso legal em vez de explicar **Privacy by Design, coleta mínima, Controladora × Operador e dados sintéticos/anonimizados**.
   - `resgate-sistema` (`Resgate`): Pode trazer a cena concreta da documentação (*código preso no PC local, sem documentação ou dev ausente → retomada no repositório central*).
   - `automacao-ferramentas` (`Automações`): Pode destacar que evita soluções pesadas/caras (simplicidade técnica).
3. **Perfis de Dev (`SIMULATOR_DEV_PROFILES`, `yuko.ts` L996-1021):**
   - Muito breves: `executor` não menciona modularidade/tecnologia madura/zero código local; `revisor` não menciona o retorno ao executor se falhar no staging; `suporte` não menciona a transição programada ou nomeação pós-homologação.
4. **Rótulos curtos da interface (`YukoOrderSimulator.tsx`):**
   - L980-985 (`Cuidado`): `"Sigilo LGPD"` vs `"Acesso seguro"` — pouco claro. Melhor: `"LGPD · Dados sintéticos"` (quando ativo) e `"Sem dados pessoais"` ou `"Coleta mínima · HTTPS"` (quando inativo).
   - L785 (`Rede` para `suporte`): `"Apoio · 5d"` é enigmático para quem não conhece a regra. Melhor: `"Suporte · regra 5d"` ou `"Suporte + troca 5d"`.
   - L993-1002 & L1123-1125 (**Medidor Piso/Teto e nota de rodapé**): O usuário vê `Piso`, `Nível 1 · Base`, `Teto` e `"Faixa indicativa · Manual v1.0 ↗"`. Sem ler a ficha copiada, não fica claro na tela *por que* não há `R$` nem o que diferencia Piso e Teto (`Enxuto` → `Essencial`, mostrados apenas em `aria-label`!). Exibir `{estimate.costFloorLabel}` e `{estimate.costCeilingLabel}` junto a Piso/Teto (ex.: `Piso · Enxuto` / `Teto · Essencial`) e enriquecer `sim-footer-note` para `"Faixa indicativa (sem valores em R$; combinado direto e autônomo · sem vínculo) · Manual v1.0 ↗"` torna o card **100% autoexplicativo sem inventar preços**.
5. **Texto gerado para cópia (`buildHiddenOrderRecord`, L253-336):**
   - Tem espaço livre (vai para a área de transferência para colar no Discord), mas está burocrático e repetitivo. Pode incluir:
     - O fluxo das **6 etapas** (inclusive: *se falhar em staging, volta ao executor*);
     - **Simplicidade técnica** (tecnologias maduras, sem *lock-in* nem nuvem cara) e DoD (*linter*, commits semânticos ligados à *issue*, SQLi/XSS, HTTPS, Argon2/bcrypt, zero segredos no código);
     - **LGPD** clara (Controladora × Operador, *Privacy by Design*, coleta mínima, **proibição de dados reais em dev/staging**);
     - **Continuidade dupla**: afastamento programado (aviso na *issue* + *push* obrigatório) **e** regra dos 5 dias úteis sem justificativa (vacância, revogação e reatribuição transitória);
     - Caráter **orientativo** e participação **voluntária/autônoma, sem vínculo empregatício ou societário**.

#### Sugestões concretas para o Simulador
- **Cabeçalho `#simulador` (`index.astro` L171-176):**
  - Kicker (se desejar adicionar ou manter limpo): `Simulador de Parceria`
  - Título: `Veja como seu projeto ou atuação entra na rede`
  - Descrição: `Alterne entre Empresa, Cliente ou Dev para explorar prazos indicativos, faixa de complexidade (sem R$ fechado), cuidados de LGPD e gerar a ficha pronta para triagem no Discord.`
- **Ajustes em `SIMULATOR_SOLUTIONS` (`yuko.ts`):**
  - `casa-em-ordem` (`Segurança & LGPD`):
    - `categoryDescription`: `"Privacy by Design, coleta mínima, HTTPS/Argon2 e papéis claros na LGPD (Controladora e Operador)."`
    - `shortSummary`: `"Coleta mínima, proteção contra falhas e dados reais proibidos em testes."`
    - `humanSummary`: `"Privacy by Design com empresa Controladora, dev Operador e dados reais proibidos em dev/staging."`
  - `resgate-sistema` (`Resgate`):
    - `categoryDescription`: `"Retome sistemas com código preso, sem documentação ou sem suporte para o repositório central."`
    - `humanSummary`: `"Traz o código para o repositório central, documenta, revisa por 2+ pares e nomeia suporte."`
  - `automacao-ferramentas` (`Automações`):
    - `categoryDescription`: `"Conecte formulários e rotinas com arquitetura leve, sem nuvem cara nem lock-in."`
- **Ajustes em `SIMULATOR_DEV_PROFILES` (`yuko.ts`):**
  - `executor`:
    - `shortSummary`: `"Fecha escopo enxuto e constrói no repositório central, sem código local."`
    - `humanSummary`: `"Constrói com tecnologias maduras, commits semânticos ligados à issue e zero código ou senhas locais."`
  - `revisor`:
    - `shortSummary`: `"Confere segurança, LGPD e staging com outro par (2+ pareceres)."`
    - `humanSummary`: `"Audita SQLi/XSS, Argon2/bcrypt e LGPD em 2+ pares; se falhar em staging, devolve ao executor."`
  - `suporte`:
    - `shortSummary`: `"Assume o pós-entrega após homologação e garante passagem de bastão."`
    - `humanSummary`: `"Acompanha em produção após homologação e coordena transições via aviso na issue ou regra dos 5 dias."`
- **Rótulos visíveis em `YukoOrderSimulator.tsx`:**
  - `Cuidado`: `involvesClientData ? 'LGPD · Dados sintéticos' : 'Coleta mínima · HTTPS'`
  - `Rede` (`suporte`): `'Suporte · regra 5d'`
  - Medidor Piso/Teto: `Piso ({estimate.costFloorLabel})` | `{estimate.costLevelTitle}` | `Teto ({estimate.costCeilingLabel})`
  - `sim-footer-note`: `Faixa indicativa de complexidade (valores combinados diretamente, sem vínculo) · Caráter orientativo · Manual v1.0 ↗`

---

### Bloco F — Banner CTA Final & Rodapé (`src/pages/index.astro` L183-206 + `src/components/Footer.astro`)

#### Problemas identificados
- **Banner `#manual` (`index.astro` L188-191):** `"Veja as regras da comunidade, práticas de LGPD e o glossário (guia orientativo; não substitui contrato), ou converse com os membros no Discord."` — Frio e burocrático. Não transmite que o Discord é o coração da **convivência diária voluntária e autônoma**, onde devs trocam experiências, revisam código juntos e acolhem novas demandas.
- **`Footer.astro` `defaultSummary` (L55-58):** Repete exatamente a frase seca do Hero (`"Comunidade técnica brasileira em implantação gradual que cria sistemas sob medida para microempresas, com revisão por 2+ pares e suporte pelo período combinado."`).
- **`Footer.astro` `PAGE_ANCHORS['/']` (L24-29):** Falta a âncora `{ href: '#simulador', label: 'Simulador' }` entre `Para quem é` e `Manual v1.0`.
- **`Footer.astro` Monumento (L118-132):** `"Comunidade Técnica Brasileira · Chancela Coletiva"` / `"Ciclo de Entrega Assistida e Revisão por 2+ Pares"` — Correto, mas `footer-monument-tagline` pode soar ainda mais claro e memorável.

#### Sugestões concretas
- **Banner `#manual` (`index.astro` L188-191):**
  - `h2`: `Leia o Manual v1.0 ou chegue junto no Discord`
  - `p`: `Consulte as regras do Ciclo de 6 etapas, o DoD de segurança e a LGPD no Manual (guia orientativo, sem caráter contratual), ou participe da convivência diária no Discord — espaço voluntário e autônomo, sem vínculo empregatício ou societário.`
- **`Footer.astro` `PAGE_ANCHORS['/']`:**
  ```ts
  '/': [
    { href: '#continuidade', label: 'Continuidade na Prática' },
    { href: '#pilares', label: 'Como funciona' },
    { href: '#atuacao', label: 'Parceria Assistida' },
    { href: '#simulador', label: 'Simulador' },
    { href: '#manual', label: 'Manual & Discord' },
  ],
  ```
- **`Footer.astro` `defaultSummary` (`variant === 'monument'`):**
  > `Comunidade técnica brasileira que une desenvolvedores independentes e microempresas em parceria assistida: trabalho autônomo validado por 2+ pares, repositório central sem lock-in e continuidade organizada.`
- **`Footer.astro` `footer-monument-tagline`:**
  > `Trabalho individual validado coletivamente · Sem caixa-preta, sem isolamento`

---

## 3. Checklist de Conformidade Factual e de Escopo

- [x] **Nenhum valor em `R$` sugerido ou inventado** no Simulador (mantidos apenas níveis relativos `Nível 1–4` e rótulos `Piso` / `Teto` com combinação direta bilateral).
- [x] **Ressalvas preservadas sem poluir a leitura:** caráter orientativo do Manual/Simulador, atuação voluntária/autônoma sem vínculo empregatício ou societário, e responsabilidade individual sem responsabilidade solidária seguem presentes nos pontos certos.
- [x] **Todos os novos eixos da documentação cobertos na Home/Palco/Simulador:**
  - Assimetria (*isolamento do dev × caixa-preta da microempresa*) e **parceria assistida**;
  - Ciclo de **6 etapas engrenadas** (incluindo Yuko Field, critérios de triagem e retorno ao executor quando *staging* falha);
  - **Simplicidade técnica** (rejeição a arquiteturas pesadas, nuvem cara e *lock-in*; tecnologias maduras);
  - **DoD objetivo** (*linter*, commits semânticos ligados à *issue*, SQLi/XSS, HTTPS, Argon2/bcrypt, zero *hardcoded secrets*);
  - **LGPD clara** (Controladora × Operador, *Privacy by Design*, coleta mínima, proibição de dados reais em dev/staging);
  - **Continuidade dupla** (afastamento programado + sincronização compulsória vs. inércia > 5 dias úteis → vacância, revogação e reatribuição transitória);
  - **6 extensões** e **convivência diária voluntária no Discord**.
- [x] **Nenhum arquivo em `src/` foi alterado.**
