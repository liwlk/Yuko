# SA-4 — Revisão de Metadados e Microcopy Global

**Responsável:** SA-4 (Metadados e microcopy global)  
**Escopo aplicado diretamente:** `src/components/Footer.astro` e `src/layouts/BaseLayout.astro` (somente strings de texto visíveis/alt).  
**Propostas registradas para a Fase 2 (sem edição direta):** `src/pages/index.astro`, `src/pages/extensoes.astro`, `src/pages/ciclo.astro`, `src/pages/governanca.astro` e `src/data/yuko.ts` (`NAV_ITEMS`, `SPLIT_SHORTCUTS`, `CONTINUITY_LENS_LABELS`).  
**Intocável:** `src/pages/manual.astro` (`/manual/`) e `CONTROL_TABLE` / `MANUAL_ORIGINS` / `GLOSSARY_TERMS`.

---

## 1. Edições aplicadas diretamente

### 1.1 `src/components/Footer.astro`

- **`PAGE_ANCHORS['/'][0].label`** (l. 25, mantendo `href: '#continuidade'`):
  - **Antes:** `'Proteção & Continuidade'` (23 car.)
  - **Depois:** `'Continuidade na Prática'` (23 car. · +0,0% · limite +15%)
  - **Motivo:** Alinha o rótulo ao kicker do palco (`Respaldo na Prática` em `YukoContinuityStage.tsx`) e remove o termo "Proteção" sem base literal de garantia. Demais âncoras de `/`, `/extensoes/`, `/ciclo/`, `/governanca/` e `/manual/` (intocável) já estavam aderentes ao `guia-de-termos.md`.
- **`defaultSummary` — variante `monument`** (l. 57):
  - **Antes:** `'Comunidade brasileira de desenvolvedores que cria software sob medida para microempresas, com revisão em equipe e acompanhamento após o lançamento.'` (147 car.)
  - **Depois:** `'Comunidade técnica brasileira em implantação gradual que cria sistemas sob medida para microempresas, com revisão por 2+ pares e suporte pelo período combinado.'` (160 car. · +8,8% · limite +25% / máx. 183)
  - **Motivo:** Inclui explicitamente o estágio institucional (§1.3: `em implantação gradual`), padroniza `Comunidade técnica`, `revisão por 2+ pares` (§8.4) e `suporte pelo período combinado` (P3).
- **`defaultSummary` — variante `compact`** (l. 58):
  - **Antes:** `'Comunidade brasileira que conecta desenvolvedores e microempresas para criar sistemas confiáveis e com suporte contínuo.'` (120 car.)
  - **Depois:** `'Comunidade técnica em implantação gradual que conecta desenvolvedores e microempresas, com revisão por 2+ pares e suporte pelo período combinado.'` (145 car. · +20,8% · limite +25% / máx. 150)
  - **Motivo:** Remove `"suporte contínuo"` (que sugeria suporte vitalício/permanente), inclui `em implantação gradual` (§1.3), `revisão por 2+ pares` e `suporte pelo período combinado` (P3).
- **`footer-ref-kicker`** (l. 119):
  - **Antes:** `Comunidade Técnica Brasileira · Respaldo Coletivo` (49 car.)
  - **Depois:** `Comunidade Técnica Brasileira · Chancela Coletiva` (49 car. · +0,0% · limite +15%)
  - **Motivo:** Adota o termo canônico `Chancela Coletiva` (§7.4, `guia-de-termos.md`), deixando claro que método e revisões são da comunidade.
- **`footer-monument-tagline`** (l. 130):
  - **Antes:** `Ciclo Colaborativo e Entrega Assistida por Pares` (48 car.)
  - **Depois:** `Ciclo de Entrega Assistida e Revisão por 2+ Pares` (49 car. · +2,1% · limite +15%)
  - **Motivo:** Preserva íntegro o nome canônico `Ciclo de Entrega Assistida` e explícita a regra `Revisão por 2+ Pares` (§8.4).

### 1.2 `src/layouts/BaseLayout.astro`

- **`ogImageAlt` default** (l. 27):
  - **Antes:** `'Yuko — Comunidade Técnica & Entrega Assistida para Microempresas'` (64 car.)
  - **Depois:** `'Símbolo e marca Yuko — Comunidade Técnica e Entrega Assistida'` (61 car. · -4,7% · limite +15%)
  - **Motivo:** Descreve fielmente a imagem `/assets/og-yuko-v2.png` (símbolo + wordmark `YUKO`), mantendo os termos canônicos sem promessas.
- **Verificação estrutural (`<title>`, `<meta>`, OG/Twitter):** `<title>{title}</title>`, `<meta name="description" ...>`, `<link rel="canonical" ...>`, tags `og:*` e `twitter:*` estão corretamente ligadas às props; `theme-color` (`#a93714`) não foi alterado (regra de escopo + F3 em `FORA-DE-ESCOPO.md`).

---

## 2. Propostas exatas para a Fase 2 (arquivos não editados por SA-4)

### 2.1 `src/pages/index.astro` (linhas 18–23)

- **`title`** (manter):
  ```astro
  title="Yuko — Comunidade Técnica & Entrega Assistida para Microempresas"
  ```
  *(64 car. · já aderente ao `guia-de-termos.md`, sem palavras proibidas).*
- **`description`** (atualizar — l. 20):
  ```astro
  description="Comunidade técnica em implantação gradual que une desenvolvedores e microempresas, com revisão por 2+ pares e responsável de suporte pelo período combinado."
  ```
  *(156 car., antes 164 · -4,9% · SEO ≤ 160 car. · remove `"suporte garantido após a entrega"`, inclui §1.3 `em implantação gradual`, `revisão por 2+ pares` e P3 `responsável de suporte pelo período combinado`).*

### 2.2 `src/pages/extensoes.astro` (linhas 18–25)

- **`title`** (manter):
  ```astro
  title="Extensões, Frentes & Discord — Yuko"
  ```
  *(35 car. · conciso e fiel à página).*
- **`description`** (atualizar — l. 20):
  ```astro
  description="Identidade da Yuko (Yukon, Oslo, Verona), 6 extensões da marca (Field, Dev, Make, Place, Work, Inline), 6 frentes internas de atuação e o servidor Discord."
  ```
  *(155 car., antes 158 · -1,9% · SEO ≤ 160 car. · distingue claramente as `6 extensões da marca` das `6 frentes internas de atuação`, evitando chamar extensões de `"áreas de atuação"`).*
- **`nextLabel`** (manter):
  ```astro
  nextLabel="Avançar para Ciclo & Papéis →"
  ```
  *(29 car. · consistente com a próxima rota).*

### 2.3 `src/pages/ciclo.astro` (linhas 16–23)

- **`title`** (manter):
  ```astro
  title="Ciclo de Entrega Assistida, Papéis & Registro — Yuko"
  ```
  *(52 car. · usa o nome canônico `Ciclo de Entrega Assistida`).*
- **`description`** (atualizar — l. 18):
  ```astro
  description="As 6 etapas do Ciclo de Entrega Assistida, papéis do projeto, regra de vacância em 5 dias úteis e ficha de acompanhamento na comunidade Yuko."
  ```
  *(141 car., antes 138 · +2,2% · SEO ≤ 160 car. · substitui `"6 passos"` por `"6 etapas"` e `"regra de continuidade contra abandono"` por `"regra de vacância em 5 dias úteis"`, conforme `guia-de-termos.md` §7.4).*
- **`nextLabel`** (manter):
  ```astro
  nextLabel="Avançar para Qualidade & LGPD →"
  ```
  *(31 car. · consistente com `NAV_ITEMS`).*

### 2.4 `src/pages/governanca.astro` (linhas 13–20)

- **`title`** (manter):
  ```astro
  title="Qualidade, Segurança, LGPD & Ética — Yuko Institucional"
  ```
  *(55 car. · aderente).*
- **`description`** (atualizar — l. 15):
  ```astro
  description="Critério de pronto, revisão de segurança por 2+ pares, cuidados pensando na LGPD (não substitui assessoria jurídica) e mediação de conflitos na Yuko."
  ```
  *(149 car., antes 162 · -8,0% · SEO ≤ 160 car. · substitui `"proteção contra invasões"` por `"revisão de segurança por 2+ pares"` e explicita `"cuidados pensando na LGPD (não substitui assessoria jurídica)"`).*
- **`nextLabel`** (manter):
  ```astro
  nextLabel="Ler Manual Completo v1.0 →"
  ```
  *(26 car. · aderente).*

### 2.5 `src/data/yuko.ts` (constantes compartilhadas — linhas 142–164 e 171–175)

- **`CONTINUITY_LENS_LABELS.blindagem`** (l. 174 — atualizar apenas o rótulo visível, preservando a chave `blindagem` para CSS/`data-stage-lens`):
  ```ts
  export const CONTINUITY_LENS_LABELS: Record<StageLensId, string> = {
    fluxo: 'Fluxo',
    rede: 'Rede',
    blindagem: 'Respaldo',
  };
  ```
  *(8 car., antes 9 · -11,1% · remove a palavra proibida `"Blindagem"` do `guia-de-termos.md` §2 e alinha com o título do palco `Respaldo na Prática`).*
- **`SPLIT_SHORTCUTS`** (l. 157–163 — manter):
  - `'Extensões & Frentes'` (19 car.) — consistente com `#pilares` e `/extensoes/`.
  - `'Papéis & Continuidade'` (21 car.) — consistente com `/ciclo/#papeis` e `PAGE_ANCHORS`.
  - `'Qualidade & LGPD'` (16 car.) — consistente com `NAV_ITEMS`.
  - `'Glossário Institucional'` (23 car.) — consistente com `/manual/#glossario`.
  - `'Entrar no Discord ↗'` (19 car.) — consistente com os demais CTAs de Discord.
- **`NAV_ITEMS`** (l. 142–148 — **NÃO editável nesta revisão**):
  - Os rótulos `Início`, `Ciclo`, `Qualidade & LGPD` e `Manual v1.0` estão adequados.
  - O rótulo `'Extensões'` (l. 144) continua ambíguo para visitantes novos (a página cobre identidade, 6 extensões, 6 frentes e Discord). Mantém-se apenas como **proposta não aplicada** em `FORA-DE-ESCOPO.md` (F4: `'Extensões & Frentes'` ou `'Como nos organizamos'`).

---

## 3. Tabela consolidada (Antes | Depois | Car. orig | Car. novo | Delta % | Limite)

| Arquivo & Campo | Antes | Depois | Car. orig | Car. novo | Delta % | Limite | Status |
|---|---|---|---|---|---|---|---|
| `Footer.astro` · `PAGE_ANCHORS['/'][0].label` | Proteção & Continuidade | Continuidade na Prática | 23 | 23 | +0,0% | +15% (26) | Aplicado |
| `Footer.astro` · `defaultSummary` (monument) | Comunidade brasileira de desenvolvedores que cria software sob medida para microempresas, com revisão em equipe e acompanhamento após o lançamento. | Comunidade técnica brasileira em implantação gradual que cria sistemas sob medida para microempresas, com revisão por 2+ pares e suporte pelo período combinado. | 147 | 160 | +8,8% | +25% (183) | Aplicado |
| `Footer.astro` · `defaultSummary` (compact) | Comunidade brasileira que conecta desenvolvedores e microempresas para criar sistemas confiáveis e com suporte contínuo. | Comunidade técnica em implantação gradual que conecta desenvolvedores e microempresas, com revisão por 2+ pares e suporte pelo período combinado. | 120 | 145 | +20,8% | +25% (150) | Aplicado |
| `Footer.astro` · `footer-ref-kicker` | Comunidade Técnica Brasileira · Respaldo Coletivo | Comunidade Técnica Brasileira · Chancela Coletiva | 49 | 49 | +0,0% | +15% (56) | Aplicado |
| `Footer.astro` · `footer-monument-tagline` | Ciclo Colaborativo e Entrega Assistida por Pares | Ciclo de Entrega Assistida e Revisão por 2+ Pares | 48 | 49 | +2,1% | +15% (55) | Aplicado |
| `BaseLayout.astro` · `ogImageAlt` | Yuko — Comunidade Técnica & Entrega Assistida para Microempresas | Símbolo e marca Yuko — Comunidade Técnica e Entrega Assistida | 64 | 61 | -4,7% | +15% (73) | Aplicado |
| `index.astro` · `title` | Yuko — Comunidade Técnica & Entrega Assistida para Microempresas | *(manter)* Yuko — Comunidade Técnica & Entrega Assistida para Microempresas | 64 | 64 | +0,0% | +15% (73) | Proposto (manter) |
| `index.astro` · `description` | A Yuko conecta desenvolvedores independentes e microempresas para criar sistemas sob medida, conferidos por 2+ profissionais e com suporte garantido após a entrega. | Comunidade técnica em implantação gradual que une desenvolvedores e microempresas, com revisão por 2+ pares e responsável de suporte pelo período combinado. | 164 | 156 | -4,9% | +25% / SEO ≤ 160 | Proposto (Fase 2) |
| `extensoes.astro` · `title` | Extensões, Frentes & Discord — Yuko | *(manter)* Extensões, Frentes & Discord — Yuko | 35 | 35 | +0,0% | +15% (40) | Proposto (manter) |
| `extensoes.astro` · `description` | Valores da marca Yuko (Yukon, Oslo, Verona), as 6 áreas de atuação (Field, Dev, Make, Place, Work, Inline), 6 frentes de trabalho e nosso servidor no Discord. | Identidade da Yuko (Yukon, Oslo, Verona), 6 extensões da marca (Field, Dev, Make, Place, Work, Inline), 6 frentes internas de atuação e o servidor Discord. | 158 | 155 | -1,9% | +25% / SEO ≤ 160 | Proposto (Fase 2) |
| `extensoes.astro` · `nextLabel` | Avançar para Ciclo & Papéis → | *(manter)* Avançar para Ciclo & Papéis → | 29 | 29 | +0,0% | +15% (33) | Proposto (manter) |
| `ciclo.astro` · `title` | Ciclo de Entrega Assistida, Papéis & Registro — Yuko | *(manter)* Ciclo de Entrega Assistida, Papéis & Registro — Yuko | 52 | 52 | +0,0% | +15% (59) | Proposto (manter) |
| `ciclo.astro` · `description` | Os 6 passos do Ciclo de Entrega Assistida, quem faz o quê, regra de continuidade contra abandono e ficha formal de acompanhamento na Yuko. | As 6 etapas do Ciclo de Entrega Assistida, papéis do projeto, regra de vacância em 5 dias úteis e ficha de acompanhamento na comunidade Yuko. | 138 | 141 | +2,2% | +25% / SEO ≤ 160 | Proposto (Fase 2) |
| `ciclo.astro` · `nextLabel` | Avançar para Qualidade & LGPD → | *(manter)* Avançar para Qualidade & LGPD → | 31 | 31 | +0,0% | +15% (35) | Proposto (manter) |
| `governanca.astro` · `title` | Qualidade, Segurança, LGPD & Ética — Yuko Institucional | *(manter)* Qualidade, Segurança, LGPD & Ética — Yuko Institucional | 55 | 55 | +0,0% | +15% (63) | Proposto (manter) |
| `governanca.astro` · `description` | Lista de conferência antes da entrega, tecnologias confiáveis, proteção contra invasões, cuidados com a LGPD (Lei nº 13.709/2018) e mediação de conflitos na Yuko. | Critério de pronto, revisão de segurança por 2+ pares, cuidados pensando na LGPD (não substitui assessoria jurídica) e mediação de conflitos na Yuko. | 162 | 149 | -8,0% | +25% / SEO ≤ 160 | Proposto (Fase 2) |
| `governanca.astro` · `nextLabel` | Ler Manual Completo v1.0 → | *(manter)* Ler Manual Completo v1.0 → | 26 | 26 | +0,0% | +15% (29) | Proposto (manter) |
| `yuko.ts` · `SPLIT_SHORTCUTS[0..4]` | Extensões & Frentes / Papéis & Continuidade / Qualidade & LGPD / Glossário Institucional / Entrar no Discord ↗ | *(manter todos)* | 19 / 21 / 16 / 23 / 19 | 19 / 21 / 16 / 23 / 19 | +0,0% | +15% | Proposto (manter) |
| `yuko.ts` · `CONTINUITY_LENS_LABELS.fluxo` | Fluxo | *(manter)* Fluxo | 5 | 5 | +0,0% | +15% (5) | Proposto (manter) |
| `yuko.ts` · `CONTINUITY_LENS_LABELS.rede` | Rede | *(manter)* Rede | 4 | 4 | +0,0% | +15% (4) | Proposto (manter) |
| `yuko.ts` · `CONTINUITY_LENS_LABELS.blindagem` | Blindagem | Respaldo | 9 | 8 | -11,1% | +15% (10) | Proposto (Fase 2) |
| `yuko.ts` · `NAV_ITEMS[1].label` | Extensões | *(não aplicado)* Sugestão em `FORA-DE-ESCOPO.md`: "Extensões & Frentes" | 9 | — | — | Fora de escopo | Apenas relato |

---

## 4. Achados fora do escopo nos arquivos globais (confirmação para `FORA-DE-ESCOPO.md`)

Todos os itens abaixo foram verificados nos arquivos globais (`BaseLayout.astro`, `Footer.astro`, `TopBar.astro`, `ThemeControls.tsx`, `SplitButton.tsx`, `yuko.ts`) e já constam (ou complementam) `docs/revisao/FORA-DE-ESCOPO.md`:

1. **`#topo` vs `#topo-pagina` (`BaseLayout.astro` l. 217–223, `Footer.astro` l. 75, 140, 151, `global.css` l. 3670–3675):**  
   Confirmado (F2). `<div id="topo-pagina">` marca o topo absoluto (alvo de `"Voltar ao topo"` / `"Topo"` no rodapé), enquanto `<main id="topo">` é o alvo do skip link `"Pular para o conteúdo"` (e também usado como seletor em `global.css`). A inversão semântica confunde quem lê o código; renomear exige alterar `id`, `href` e seletores CSS (`#conteudo` e `#inicio-pagina`), fora do escopo textual.
2. **`"Mola"` em `ThemeControls.tsx` (l. 193, 256–270):**  
   Confirmado (F1). O rótulo curto `"Mola"` / `"Calmo"` no botão `motionToggleBtn` da barra superior alterna a física de animação (`expressive` / `calm`), com contexto completo apenas em `title` e `aria-label`. Torná-lo autoexplicativo visualmente alteraria largura e layout da `TopBar`.
3. **`NAV_ITEMS[1].label` (`"Extensões"`) em `yuko.ts` (l. 144):**  
   Confirmado (F4). O item de menu `"Extensões"` não comunica que a página `/extensoes/` também apresenta identidade da marca, 6 frentes internas e Discord. Sugestão mantida apenas como proposta (`"Extensões & Frentes"`), pois alterar rótulos de menu foge do escopo.
4. **`theme-color` (`#a93714`) em `BaseLayout.astro` (l. 43):**  
   Confirmado (F3 / P10). Mantido sem alteração por ser meta técnica ligada ao sistema de 4 sementes de cor.
5. **Contraste e acessibilidade (`ThemeControls.tsx`, `SplitButton.tsx`, `Footer.astro`):**  
   Confirmado (F10). Os estados de foco e contraste em `feature-tag`, links secundários do rodapé e itens de menu do `SplitButton.tsx` nas 4 sementes × 2 modos (claro/escuro) dependem de revisão de CSS/WCAG fora do escopo textual.
6. **Observação complementar para Fase 2 (`yuko.ts` l. 168 e 221–227):**  
   Embora pertencentes ao conteúdo da Home (SA-1 / Fase 2) e fora da faixa `142–164` / `171–175`, vale confirmar na integração que `HERO_METRICS[2]` (`'Zero abandono'` / `'Suporte garantido após a entrega'`) e `CONTINUITY_STAGES[3]` (`'Suporte garantido contra abandono'`, `'sem perda'`, `'Regra anti-abandono em 5 dias úteis...'`) sejam substituídos junto com `CONTINUITY_LENS_LABELS.blindagem`.
