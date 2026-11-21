# Parecer REV-1 — Fidelidade Institucional, Terminologia e Linguagem (Fase 3)

- **Revisor:** REV-1 (Fidelidade e linguagem — revisão independente da Fase 3)
- **Repositório auditado:** `/home/antigravity/yuko-app`
- **Escopo inspecionado:** `src/` (4 páginas públicas `/`, `/extensoes/`, `/ciclo/`, `/governanca/`, dados compartilhados em `src/data/yuko.ts`, componentes em `src/components/` e layout em `src/layouts/BaseLayout.astro`) e artefatos compilados em `dist/` (`dist/index.html`, `dist/extensoes/index.html`, `dist/ciclo/index.html`, `dist/governanca/index.html` e bundles `dist/_astro/YukoOrderSimulator.*.js` e `dist/_astro/YukoContinuityStage.*.js`).
- **Fronteira preservada:** `/manual/` (`src/pages/manual.astro` e linhas 659–824 de `src/data/yuko.ts`) foi inspecionado apenas como referência e mantido intocável conforme regra da revisão. Nenhum arquivo em `src/` foi alterado.

---

## 1. Metodologia e comandos executados

1. Leitura integral das referências normativas:
   - `docs/revisao/guia-de-termos.md`
   - `PENDENCIAS.md`
   - `docs/revisao/FORA-DE-ESCOPO.md`
2. Inspeção do histórico e do diff completo de código-fonte não commitado:
   - `git status && git diff --stat`
   - `git diff -- src/` (incluindo `src/data/yuko.ts`, `src/components/YukoOrderSimulator.tsx`, `src/components/YukoContinuityStage.tsx`, `src/components/HeroSculpture.tsx`, `src/components/Footer.astro`, `src/layouts/BaseLayout.astro`, `src/pages/index.astro`, `src/pages/extensoes.astro`, `src/pages/ciclo.astro`, `src/pages/governanca.astro`).
3. Leitura integral dos arquivos-fonte das 4 páginas revisadas, `src/data/yuko.ts`, `src/components/YukoOrderSimulator.tsx` (incluindo `buildHiddenOrderRecord`) e `src/pages/manual.astro` (para checagem de fidelidade com o texto publicado do Manual v1.0).
4. Varredura automatizada por expressões regulares de termos proibidos/absolutos e menções fora do escopo em `src/` e `dist/`:
   - `grep -rniE "garantid|garantia|zero|100%|total|blindag|proteção contra|protecao contra|sem perda|anti-abandono|imediatamente|na hora|sem taxas ocultas|sem burocracia|4\+\s*(pessoas|membros)|sempre|nunca|exatament|exatidão|exatidao|nyx|expliance|contrato|vitalíci|vitalici|auditoria|ticket|protocolo|conformidade total" ...`
   - Extração e leitura do texto integral renderizado e metadados (`<title>`, `<meta name="description">`) de `dist/index.html`, `dist/extensoes/index.html`, `dist/ciclo/index.html` e `dist/governanca/index.html`, além de conferência de timestamps entre `src/` e `dist/`.

---

## 2. Parecer geral

**Status: Aprovado com ajustes pontuais (0 Bloqueantes, 7 Ajustes, 7 Sugestões).**

O `git diff -- src/` eliminou com sucesso as promessas absolutas graves, os termos comerciais inventados e as inconsistências com o Manual Institucional v1.0 presentes na versão anterior:
- Foram removidos `garantido`, `zero abandono`, `zero dados reais`, `blindagem` (visível), `proteção contra invasões`, `sem perda`, `anti-abandono`, `imediatos/imediata`, `sem taxas ocultas`, `sem burocracia`, `4+ pessoas` / `4+ membros`, `sempre` (em texto visível), `nunca` (em promessa de segurança), `auditoria contínua` e `domínio no seu nome`.
- As ressalvas jurídicas e operacionais exigidas pelo Manual v1.0 estão presentes e coerentes nas páginas e na ficha gerada pelo simulador (`buildHiddenOrderRecord`): caráter orientativo / não substitui contrato nem assessoria jurídica (§1.2), implantação gradual sem carteira fixa nem equipe permanente (§1.3), regra dos 5 dias úteis com vacância, envio (`push`), transferência de contexto, revogação de acessos e chancela coletiva (§7.4), triagem com possibilidade de recusa ou repriorização com orientação para demandas desproporcionais (§8.1/§10.1), LGPD com papéis de Controladora/Operador e testes com dados sintéticos (§13.3), e responsabilidade profissional individual sem vínculo nem responsabilidade solidária (§13.4).
- Não há fatos de negócio inventados relativos a `P1–P12` e não há menção a `NYX` ou `Expliance` fora de `/manual/` (`P11`).
- Os arquivos em `dist/` correspondem exatamente à última versão de `src/`.

Restam, contudo, **7 ajustes** de rigor terminológico/concordância (incluindo `"exatidão"` no `<h1>` da Home, `"5 dias"` sem `"úteis"` no título da etapa 04 de `CONTINUITY_STAGES`, `"troca de acessos"` em vez de `"revogação de acessos"`, explicação entre parênteses ausente na 1ª ocorrência de `linter`/`commits semânticos`/`push` na Home, `"assessoria legal"` vs `"assessoria jurídica"` no simulador, concordância/repetição de `"LGPD: Projetada pensando na LGPD"` em `buildHiddenOrderRecord` e atributos `aria-label`/`title` legados no simulador) e **7 sugestões** de polimento.

---

## 3. Checklist por critério

| Critério | Situação | Observações |
|---|---|---|
| Sustentação no Manual v1.0 / `guia-de-termos.md` | **Conforme (com ajustes)** | Afirmações gerais sustentadas. Ponto de atenção em `<h1>` (`exatidão`) e omissão de `úteis` no título `Suporte nominal e troca em 5 dias` (`yuko.ts:221`). |
| Termos absolutos ou proibidos nas 4 páginas e simulador | **Conforme (com ajustes)** | Nenhum termo proibido grave restante no texto visível. `'Do zero'` em `SITUATION_OPTIONS` é aceitável (estado inicial); `'exatidão'` no `<h1>` merece ajuste; `'sempre'` persiste apenas em `title` de botão desabilitado (`YukoOrderSimulator.tsx:934`). |
| Fidelidade à §1.2 (orientativo / sem vínculo / sem assessoria jurídica) | **Conforme** | Ressalvas explícitas em Home (`#atuacao`, `#manual`), `/governanca/` (`LGPD_ITEMS`), simulador (`casa-em-ordem`) e `buildHiddenOrderRecord`. |
| Fidelidade à §1.3 (implantação gradual, sem carteira fixa/equipe permanente) | **Conforme** | Presente em Home (meta, hero), `/extensoes/` (hero, `#extensoes`) e `Footer`. |
| Fidelidade à §7.4 (5 dias úteis, vacância, push, revogação, chancela coletiva) | **Conforme (com ajustes)** | Refletido em Home, `/ciclo/` e `buildHiddenOrderRecord`; ajustar título `troca em 5 dias` → `5 dias úteis` (`yuko.ts:221`) e `troca de acessos` → `revogação de acessos` (`yuko.ts:227`). |
| Fidelidade à §8.1 / §10.1 (triagem, recusa com orientação, demandas desproporcionais) | **Conforme** | Presente em Home (`#atuacao`, `#simulador`), `/ciclo/` (`CYCLE_STAGES` etapa 1, `TRIAGE_CRITERIA`) e `buildHiddenOrderRecord` (perfil empresa). |
| Fidelidade à §13.3 (LGPD controladora/operador, dados sintéticos) | **Conforme** | Presente em Home, `/ciclo/`, `/governanca/` e `buildHiddenOrderRecord`. |
| Fidelidade à §13.4 (responsabilidade individual) | **Conforme** | Presente em Home (`AUDIENCE_CARDS`), `/governanca/` (`CONFLICT_PRINCIPLE`) e `buildHiddenOrderRecord` (perfis empresa e dev). |
| Ausência de fatos de negócio inventados (`P1–P12`) | **Conforme** | Sem preços em R$, sem duração fixa de suporte, sem definição de quem assina/remuneração/titularidade, apenas Discord como canal da Yuko, `1 + 2 pares` / `2+ revisores` no lugar de `4+ pessoas`. |
| Ausência de `NYX`/`Expliance` fora de `/manual/` (`P11`) | **Conforme** | `grep` em `src/` e `dist/` confirmou 0 ocorrências fora de `/manual/`. |
| Ortografia, gramática PT-BR, voz e consistência terminológica | **Conforme (com ajustes)** | Boa clareza e voz ativa; há pequenos ajustes de explicação de termos na 1ª ocorrência na Home, concordância em `buildHiddenOrderRecord` e atributos `aria-label`/`title` do simulador. |

---

## 4. Avaliação específica solicitada

### 4.1. `'Do zero'` em `SITUATION_OPTIONS` (`src/components/YukoOrderSimulator.tsx:48, 278`)
- **Avaliação: Aceitável.**
- No contexto do seletor de situação do projeto (`Do zero` · `Evoluir` · `Resgatar`), `'Do zero'` é expressão idiomática do português brasileiro que descreve o ponto de partida técnico ("iniciar um sistema novo"), e não uma promessa absoluta de resultado (ao contrário de "zero falhas" ou "zero abandono"). Mantê-lo não gera risco jurídico ou de fidelidade ao Manual. (Se houver desejo purista de evitar qualquer ocorrência literal da palavra `zero` em buscas automatizadas, pode-se usar `'Novo'` — registrado apenas como **Sugestão** opcional).

### 4.2. `'Exatidão'` no `<h1>` (`src/pages/index.astro:29`)
- **Avaliação: Merece Ajuste.**
- Trecho atual: `Software com <span class="accent-word">exatidão</span> coletiva para projetos.`
- Motivos: (1) `exatidão` compartilha o mesmo campo semântico absoluto de `exatamente` (ausência total de erro ou desvio), o que contradiz o tom prudente do Manual v1.0 e da fase de implantação gradual; (2) semanticamente, "exatidão coletiva para projetos" soa pouco natural em PT-BR para descrever uma comunidade de desenvolvimento assistido com revisão por pares. A substituição por termo alinhado ao método (ex.: `clareza` ou `método`) mantém a força retórica da `<h1>` e o tamanho visual do destaque.

### 4.3. Palavras de risco em `CYCLE_STAGES`, `TRIAGE_CRITERIA`, `ROLES`, `LGPD_ITEMS` e `CONTINUITY_RULES`
- **`CYCLE_STAGES` (`src/data/yuko.ts:450–493`):** limpo; sem termos absolutos. Etapa 1 trata recusa/repriorização com orientação; etapas 2–6 usam termos canônicos com explicações entre parênteses.
- **`TRIAGE_CRITERIA` (`src/data/yuko.ts:495–516`):** limpo; sem termos absolutos ou promessas de aceite.
- **`ROLES` (`src/data/yuko.ts:518–537`):** limpo; `"nada vai ao ar com apenas uma revisão"` descreve regra interna de bloqueio de publicação (§8.4), sem prometer infalibilidade. `"ajustes iniciais"` e `"no período combinado"` substituíram adequadamente `"ajustes imediatos"`.
- **`CONTINUITY_RULES` (`src/data/yuko.ts:539–552`):** limpo; fiel à §7.4 (`5 dias úteis`, `vacância`, `envio (push)`, `acessos são revogados`).
- **`LGPD_ITEMS` (`src/data/yuko.ts:618–637`):** limpo; explicita Controladora/Operador, `"Não substitui assessoria jurídica"`, `"pensando na LGPD"` e `"dados sintéticos (fictícios ou mascarados)"`. Apenas capitalização inicial inconsistente entre o item 1 e os itens 2–4.

---

## 5. Achados classificados

### 5.1. Bloqueantes
Nenhum achado bloqueante identificado.

---

### 5.2. Ajustes

#### A1 — Termo de tom absoluto e pouco idiomático na `<h1>` da Home
- **Arquivo:** `src/pages/index.astro` (linha 29) — refletido em `dist/index.html`
- **Trecho atual:**
  ```html
  Software com <span class="accent-word">exatidão</span> coletiva para projetos.
  ```
- **Problema:** `"exatidão"` conota precisão absoluta/isenta de erro (mesma família de `"exatamente"`) e soa artificial aplicada a `"projetos"`.
- **Correção recomendada:**
  ```html
  Software com <span class="accent-word">clareza</span> coletiva para projetos.
  ```
  *(Alternativa equivalente em extensão: `<span class="accent-word">método</span> coletivo`.)*

#### A2 — Omissão de `"úteis"` no prazo de 5 dias úteis em título de etapa da Home
- **Arquivo:** `src/data/yuko.ts` → `CONTINUITY_STAGES[3]` (linha 221) — refletido em `dist/index.html`
- **Trecho atual:**
  ```ts
  title: 'Suporte nominal e troca em 5 dias',
  ```
- **Problema:** O Manual (§7.4) e o `guia-de-termos.md` determinam **5 dias úteis** (não 5 dias corridos), como consta corretamente no corpo do próprio card (l. 222) e na métrica da hero (l. 168). Omitir `"úteis"` no `<h3>` cria discrepância de prazo dentro da mesma seção.
- **Correção recomendada** (preservando o limite de caracteres do título, atualmente 33 caracteres):
  ```ts
  title: 'Suporte e troca em 5 dias úteis',
  ```
  *(31 caracteres; ou `'Suporte nominal · 5 dias úteis'`, 30 caracteres.)*

#### A3 — Uso de `"troca de acessos"` em vez de `"revogação de acessos"` (§7.4)
- **Arquivo:** `src/data/yuko.ts` → `CONTINUITY_STAGES[3].lensNotes.blindagem` (linha 227)
- **Trecho atual:**
  ```ts
  blindagem: 'Regra dos 5 dias úteis, troca de acessos e suporte nomeado',
  ```
- **Problema:** Pela §7.4 e pelo `guia-de-termos.md`, os acessos do participante ausente são **revogados** (não "trocados"), conforme já escrito corretamente em `AUDIENCE_CARDS` (l. 289) e `CONTINUITY_RULES` (l. 549).
- **Correção recomendada:**
  ```ts
  blindagem: 'Regra dos 5 dias úteis, revogação de acessos e suporte nomeado',
  ```

#### A4 — Termos técnicos sem explicação entre parênteses na 1ª ocorrência na Home
- **Arquivo:** `src/data/yuko.ts` → `AUDIENCE_CARDS[1].bullets` (linhas 286 e 288) — refletido em `dist/index.html`
- **Trecho atual:**
  ```ts
  'Tecnologias conhecidas, linter automático e commits semânticos',
  ...
  'Registro obrigatório em ficha (issue), push e transferência de contexto',
  ```
- **Problema:** O `guia-de-termos.md` (§1 e §3) orienta explicar o termo técnico na 1ª ocorrência **por página**, entre parênteses (`linter`, `commits semânticos`, `push`). Em `/ciclo/` e `/governanca/` essas explicações constam, mas na Home esses três termos aparecem pela primeira vez sem parêntese explicativo.
- **Correção recomendada** (enxuta, para manter equilíbrio visual nos bullets):
  ```ts
  'Tecnologias conhecidas, linter (padrão automático) e commits semânticos (histórico)',
  ...
  'Registro em ficha (issue), envio (push) e transferência de contexto',
  ```

#### A5 — Inconsistência terminológica `"assessoria legal"` × `"assessoria jurídica"`
- **Arquivo:** `src/data/yuko.ts` → `SIMULATOR_SOLUTIONS[4].humanSummary` (linha 964)
- **Trecho atual:**
  ```ts
  humanSummary:
    'Projetado para LGPD (controladora e operador); não substitui assessoria legal.',
  ```
- **Problema:** Em `categoryDescription` (l. 958), `governanca.astro` (description) e `LGPD_ITEMS` (l. 622), o termo padronizado é `"assessoria jurídica"` (em linha com §1.2).
- **Correção recomendada:**
  ```ts
  humanSummary:
    'Projetado para LGPD (controladora e operador); não substitui assessoria jurídica.',
  ```

#### A6 — Concordância gramatical, repetição de `"LGPD:"` e dois-pontos duplos em `buildHiddenOrderRecord`
- **Arquivo:** `src/components/YukoOrderSimulator.tsx` (linhas 280–287 e 297) — refletido em `dist/_astro/YukoOrderSimulator.CJJew3m6.js`
- **Trecho atual:**
  ```ts
  const lgpdSummary = involvesClientData
    ? 'Projetada pensando na LGPD: empresa como controladora, dev como operador, coleta mínima, direitos dos titulares e testes com dados sintéticos (não substitui assessoria jurídica)'
    : 'Informações públicas, sem coleta sensível prevista e testes com dados sintéticos (não substitui assessoria jurídica)';

  if (perspective === 'cliente') {
    const clientLgpdSummary = involvesClientData
      ? 'Projetado pensando na LGPD: coleta mínima, respeito aos direitos dos titulares e testes apenas com dados sintéticos.'
      : 'Sem exigir cadastro extra nem expor seu contato.';
  ```
  e linhas 315 / 332: `` `LGPD: ${lgpdSummary}` ``; linha 297: `` `Cuidado com os dados: ${clientLgpdSummary}` ``.
- **Problema:**
  1. Em `LGPD: Projetada pensando na LGPD: ...`, há repetição da sigla `"LGPD:"` e uso do particípio feminino `"Projetada"` sem antecedente feminino explícito.
  2. Em `Cuidado com os dados: Projetado pensando na LGPD: coleta mínima...`, há dois-pontos encadeados na mesma linha (`: ... : ...`) e ausência da ressalva `(não substitui assessoria jurídica)` no ramo `cliente` com dados pessoais.
- **Correção recomendada:**
  ```ts
  const lgpdSummary = involvesClientData
    ? 'estrutura pensada para a LGPD (empresa como controladora, dev como operador), coleta mínima, direitos dos titulares e testes com dados sintéticos (não substitui assessoria jurídica)'
    : 'informações públicas, sem coleta sensível prevista e testes com dados sintéticos (não substitui assessoria jurídica)';

  if (perspective === 'cliente') {
    const clientLgpdSummary = involvesClientData
      ? 'estrutura pensada para a LGPD, com coleta mínima, respeito aos direitos dos titulares e testes apenas com dados sintéticos (não substitui assessoria jurídica).'
      : 'sem exigir cadastro extra nem expor seu contato.';
  ```

#### A7 — Atributos de acessibilidade (`aria-label` e `title`) com termos a evitar no simulador
- **Arquivo:** `src/components/YukoOrderSimulator.tsx` (linhas 846 e 949)
- **Trecho atual:**
  - Linha 846: `aria-label="Escolha a categoria de serviço"`
  - Linha 949: `title="Ativar proteção LGPD para dados de pessoas"`
- **Problema:** O `guia-de-termos.md` (§1 e §2) evita chamar as 6 categorias de pedido de `"serviços"` e evita `"proteção"` como promessa de LGPD. Embora estejam em atributos de acessibilidade/tooltip (já mapeados em `FORA-DE-ESCOPO.md` F11 para o ciclo de acessibilidade), devem ser alinhados para consistência integral.
- **Correção recomendada:**
  - Linha 846: `aria-label="Escolha a categoria de pedido"`
  - Linha 949: `title="Ativar cuidados LGPD para dados de pessoas"`

---

### 5.3. Sugestões

#### S1 — Uso de `"sempre"` em `title` de regra interna de interface
- **Arquivo:** `src/components/YukoOrderSimulator.tsx` (linha 934)
- **Trecho atual:** `title={isDisabled ? 'Resgate atua sempre no modo Resgatar' : undefined}`
- **Motivo:** Embora descreva comportamento fixo do controle (permitido por §2 do guia para regra interna), remover `"sempre"` evita falsos positivos e melhora a clareza para quem lê o motivo da desativação.
- **Correção sugerida:** `title={isDisabled ? 'A categoria Resgate usa o modo Resgatar' : undefined}`

#### S2 — Clareza de `"Conferência de qualidade: revisada..."` no registro de cliente
- **Arquivo:** `src/components/YukoOrderSimulator.tsx` (linha 298)
- **Trecho atual:** `'Conferência de qualidade: revisada por 2+ pares independentes antes da entrega, com responsável de suporte pelo período combinado.'`
- **Motivo:** Quem é revisada é a solução/entrega, não a conferência em si.
- **Correção sugerida:** `'Conferência de qualidade: entrega revisada por 2+ pares independentes, com responsável de suporte pelo período combinado.'`

#### S3 — Uso de `"profissionais"` em vez de `"pares"`/`"revisores"` na etapa 03 do palco
- **Arquivo:** `src/data/yuko.ts` → `CONTINUITY_STAGES[2].title` (linha 208)
- **Trecho atual:** `title: 'Conferido por 2+ profissionais',`
- **Motivo:** No `guia-de-termos.md`, o padrão adotado no restante do site é `"2+ pares"` ou `"2+ revisores"`.
- **Correção sugerida:** `title: 'Conferido por 2+ revisores',`

#### S4 — Uso de `"critérios claros de aceite"` vs `"critérios de aceitação"`
- **Arquivo:** `src/data/yuko.ts` → `CONTINUITY_STAGES[0].lensNotes.blindagem` (linha 188)
- **Trecho atual:** `blindagem: 'Escopo enxuto com critérios claros de aceite',`
- **Motivo:** O termo canônico do `guia-de-termos.md` é `"critérios de aceitação"`.
- **Correção sugerida:** `blindagem: 'Escopo enxuto com critérios claros de aceitação',`

#### S5 — Ambiguidade potencial em `SIMULATOR_DEV_PROFILES.revisor.humanSummary`
- **Arquivo:** `src/data/yuko.ts` (linha 1011)
- **Trecho atual:** `'Valida segurança, LGPD e clareza com outro colega antes de liberar.'`
- **Motivo:** Se lido fora de contexto, `"com outro colega"` pode parecer "revisor + executor" em vez de "2+ revisores independentes além do executor".
- **Correção sugerida:** `'Valida segurança, LGPD e clareza junto a outro revisor (2+ pares) antes de liberar.'`

#### S6 — Consistência do botão âncora `"Valores"` e regência adverbial em `/extensoes/`
- **Arquivo:** `src/pages/extensoes.astro` (linhas 37 e 106)
- **Trechos atuais:**
  - Linha 37: `<a href="#fundamentos" class="btn btn-tonal">Valores</a>`
  - Linha 106: `Diferente das 6 extensões sob a marca Yuko, as 6 frentes internas organizam as disciplinas aplicadas conforme cada projeto.`
- **Motivo:** A seção `#fundamentos` chama-se `Fundamentos & Identidade` (e no rodapé o link é `Fundamentos`), não `Valores`. Na linha 106, o uso formal pede o advérbio `"Diferentemente"` em lugar do adjetivo `"Diferente"`.
- **Correções sugeridas:**
  - Linha 37: `<a href="#fundamentos" class="btn btn-tonal">Fundamentos</a>`
  - Linha 106: `Diferentemente das 6 extensões sob a marca Yuko, as 6 frentes internas organizam as disciplinas aplicadas conforme cada projeto.`

#### S7 — Padronização de capitalização após `:` em `LGPD_ITEMS` (e rótulo opcional `'Do zero'`)
- **Arquivo:** `src/data/yuko.ts` (linhas 621–636) e `src/components/YukoOrderSimulator.tsx` (linha 48)
- **Motivo:** Em `LGPD_ITEMS`, o item 1 inicia com maiúscula (`A microempresa...`), enquanto os itens 2, 3 e 4 iniciam com minúscula (`sistema...`, `na criação...`, `recursos...`). Padronizar todos com inicial minúscula (ou todos com maiúscula) melhora a uniformidade tipográfica. Adicionalmente, caso se queira eliminar `'Do zero'` de `SITUATION_OPTIONS`, `'Novo'` é alternativa válida, embora `'Do zero'` seja aceitável.

---

## 6. Verificação de ortografia, gramática e consistência

- **Ortografia PT-BR:** Nenhuma falha ortográfica encontrada nas 4 páginas, dados de `yuko.ts` ou componentes. Espaçamento limpo (sem espaços duplos acidentais nos textos).
- **Pontuação:** Listas em `DOD_ITEMS` e `REGISTRY_COL_A`/`B` seguem padrão consistente (itens terminados em `;` e último item em `.`). Listas com `<strong>Título:</strong> descrição.` seguem padrão uniforme, exceto pela capitalização inicial no item 1 de `LGPD_ITEMS` (citado em S7).
- **Voz e pessoa do discurso:** Voz ativa, objetiva e institucional em 1ª pessoa do plural (`"Ouvimos"`, `"Testamos"`, `"preservamos"`) ou impessoal/descritiva da comunidade (`"A comunidade"`, `"A microempresa"`, `"O executor"`), sem promessas comerciais irreais.
- **Distinção estrutural das taxonomias:**
  - `6 extensões` (`Field, Dev, Make, Place, Work, Inline`) × `6 frentes internas` (`Organização e Execução` ... `Governança e Segurança`): explicitamente diferenciadas em `/extensoes/` e Home.
  - `6 etapas do Ciclo` (`CYCLE_STAGES`): consistentes entre Home, `/ciclo/` e `Footer` (sem resquícios de `"6 passos"` ou `"6 fases"`).
  - `6 categorias de pedido` (seletor): coerente no texto visível e em `buildHiddenOrderRecord`; pendente apenas `aria-label` da grade no simulador (A7).
  - `"2+ pares"` / `"2+ revisores"`: substituiu integralmente `"4+ pessoas"` / `"4+ membros"` em todas as telas e fichas (Apenas S3 aponta o uso residual de `"profissionais"` em um `<h3>`).
- **Observação sobre `/manual/` (intocável nesta fase):** Em `src/data/yuko.ts:724, 734, 770, 776, 822` (conteúdo exclusivo de `/manual/`), permanecem `"garantia de continuidade"`, `"proteção contra abandono"`, `"zero falhas graves"`, `"exatamente"` e `"assume na hora"`. Corretamente preservados sem edição conforme regra de escopo (já registrados em `docs/revisao/FORA-DE-ESCOPO.md`, itens F5 e F6, para atualização futura do Manual).
- **Observação técnica interna:** O identificador de tipo/estado `StageLensId = 'blindagem'` permanece em código interno (`src/data/yuko.ts:6` e `data-stage-lens="blindagem"` em `YukoContinuityStage.tsx:14`), mas o rótulo exibido ao usuário já foi atualizado para `'Respaldo'` (`yuko.ts:174`). Sem impacto textual visível.
