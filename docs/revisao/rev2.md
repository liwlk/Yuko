# REV-2 — Guarda de escopo (Fase 3)

**Auditor:** REV-2 Guarda de escopo (revisor independente, sem atuação na Fase 1)  
**Repositório:** `/home/antigravity/yuko-app` (branch `revisao-textual-yuko`, base `main` @ `0c99878`)  
**Escopo auditado:** Seções 2.2 (Proibições), 2.3 (Limites de tamanho) e 7 (Critérios de aceitação)

---

## Veredito geral

**APROVADO (0 Bloqueantes · 0 Ajustes · 2 Sugestões/Observações)**

Todas as alterações no repositório restringem-se exclusivamente a trocas de strings em arquivos de texto/dados/componentes permitidos, preservando integralmente HTML, CSS, scripts, configurações, imagens, navegação, `/manual/` e contagem de elementos. Nenhuma string visível extrapolou os limites de +15% (títulos, rótulos, métricas, itens e cards) ou +25% (parágrafos livres), e a inspeção visual nas larguras de 1440 px, 768 px e 390 px não detectou quebras de layout, truncamentos, sobreposições nem overflow horizontal.

---

## Evidências objetivas

### (a) Esqueleto HTML (`/tmp/baseline-skeleton` vs `/tmp/after-skeleton` e `<main>` de `/manual/`)

Execução de `diff -u` entre `/tmp/baseline-skeleton/*.txt` e `/tmp/after-skeleton/*.txt`:

- `extensoes.txt`: **0 diferenças**
- `ciclo.txt`: **0 diferenças**
- `governanca.txt`: **0 diferenças**
- `manual.txt`: **0 diferenças**
- `home.txt`: **1 única linha alterada**, no atributo `aria-label` da 4ª aba móvel do palco:

```diff
--- /tmp/baseline-skeleton/home.txt
+++ /tmp/after-skeleton/home.txt
@@ -540,7 +540,7 @@
 </button>
 <button type="button" aria-pressed="false" aria-label="Etapa 03: Conferido por 2+ profissionais" class="stage-mobile-tab">
 </button>
-<button type="button" aria-pressed="false" aria-label="Etapa 04: Suporte garantido contra abandono" class="stage-mobile-tab">
+<button type="button" aria-pressed="false" aria-label="Etapa 04: Suporte nominal e troca em 5 dias" class="stage-mobile-tab">
 </button>
```

- **Rastreamento no código (`src/components/YukoContinuityStage.tsx:966`):** o atributo é gerado dinamicamente por ``aria-label={`Etapa ${stepLabel}: ${stage.title}`}``. O código do componente não alterou nenhum atributo estático `aria-*` nem a expressão; a mudança no HTML decorre exclusivamente da atualização de `CONTINUITY_STAGES[3].title` em `src/data/yuko.ts:221` (33 → 33 car., 0,0%), mantendo o `aria-label` resultante com os mesmos 43 caracteres.
- **Comparação de `<main>` em `/tmp/baseline-dist/manual/index.html` vs `dist/manual/index.html`:**
  - Conteúdo semântico e estrutural **100% idêntico**.
  - A diferença bruta de 1 byte (`14.686` bytes vs `14.685` bytes) refere-se exclusivamente ao atributo efêmero de hidratação gerado pelo Astro em tempo de build (`<astro-island uid="1KcFwr"` → `<astro-island uid="3SElQ"`), mantendo idênticos `component-url="/_astro/GlossaryExplorer.CE67uqpT.js"`, `renderer-url="/_astro/client.XI9U0KhD.js"`, todo o JSON de `props` e todo o DOM interno.
  - Em `manual/index.html` completo, o único texto alterado entre baseline e pós-revisão é o parágrafo resumo do rodapé compartilhado (`Footer.astro`, fora de `<main>`).

### (b) `git diff --stat` e auditoria de escopo em `git diff main`

```text
 src/components/Footer.astro            |  10 +-
 src/components/HeroSculpture.tsx       |   2 +-
 src/components/YukoContinuityStage.tsx |   4 +-
 src/components/YukoOrderSimulator.tsx  |  46 ++++-----
 src/data/yuko.ts                       | 166 ++++++++++++++++-----------------
 src/layouts/BaseLayout.astro           |   2 +-
 src/pages/ciclo.astro                  |  12 +--
 src/pages/extensoes.astro              |  16 ++--
 src/pages/governanca.astro             |   8 +-
 src/pages/index.astro                  |  14 +--
 10 files changed, 140 insertions(+), 140 deletions(-)
```

Verificação explícita da Seção 2.2 (Proibições):
- `src/styles/*` (CSS): **0 alterações**
- Configurações (`astro.config.*`, `package.json`, `tsconfig.json`): **0 alterações**
- Scripts (`src/scripts/*`): **0 alterações**
- Imagens/ativos (`public/*`): **0 alterações**
- Dependências: **0 alterações**
- `NAV_ITEMS` em `src/data/yuko.ts`: **0 alterações**
- `/manual/` (`src/pages/manual.astro`, `CONTROL_TABLE`, `MANUAL_ORIGINS`, `GLOSSARY_TERMS`): **0 alterações**
- Todos os 10 arquivos modificados em `src/` contêm **exclusivamente** substituições 1-para-1 de strings/textos (`140 insertions(+), 140 deletions(-)`), sem alteração de tags, classes, ids, `href`, atributos estáticos `aria-*`/`data-*`, estilos inline ou lógica.

### (c) Contagem de elementos (`/tmp/baseline-dist` vs `dist/`)

Comparação automatizada dos nós HTML compilados nas 5 páginas:

| Página | `section` | `article` | `.m3-card` | `li` | `button` | `a` | `nav a` | `footer a` | `h1` | `h2` | `h3` | `p` | Diferenças |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `/` (`index.html`) | 7 | 6 | 0 | 8 | 35 | 38 | 20 | 13 | 1 | 5 | 10 | 17 | **0 (`identical=True`)** |
| `/extensoes/` | 5 | 6 | 7 | 9 | 7 | 35 | 20 | 18 | 1 | 4 | 14 | 18 | **0 (`identical=True`)** |
| `/ciclo/` | 4 | 11 | 12 | 10 | 7 | 34 | 19 | 17 | 1 | 3 | 13 | 15 | **0 (`identical=True`)** |
| `/governanca/` | 3 | 7 | 7 | 16 | 7 | 32 | 19 | 17 | 1 | 2 | 7 | 7 | **0 (`identical=True`)** |
| `/manual/` | 4 | 19 | 20 | 4 | 7 | 36 | 19 | 17 | 1 | 3 | 20 | 27 | **0 (`identical=True`)** |

### (d) Inspeção visual e logs de captura (1440 px, 768 px, 390 px)

Comparação entre `/tmp/shots1.log` (baseline) e `/tmp/shots2.log` (após revisão):

| Página | 1440 px (antes → depois · `hOverflow`) | 768 px (antes → depois · `hOverflow`) | 390 px (antes → depois · `hOverflow`) |
|---|---|---|---|
| `home` | `6340 → 6392 px` (+52 px) · `false` | `6976 → 7102 px` (+126 px) · `false` | `9095 → 9197 px` (+102 px) · `false` |
| `extensoes` | `3421 → 3372 px` (-49 px) · `false` | `4279 → 4279 px` (0 px) · `false` | `6653 → 6620 px` (-33 px) · `false` |
| `ciclo` | `3157 → 3185 px` (+28 px) · `false` | `4243 → 4238 px` (-5 px) · `false` | `6692 → 6762 px` (+70 px) · `false` |
| `governanca` | `2521 → 2472 px` (-49 px) · `false` | `3601 → 3601 px` (0 px) · `false` | `5263 → 5263 px` (0 px) · `false` |

Capturas inspecionadas visualmente em `/tmp/after-shots/` (e comparadas com `/tmp/baseline-shots/` quando pertinente):
- **Desktop 1440 px:** `home-1440-00.jpg`, `home-1440-01.jpg`, `home-1440-03.jpg`, `home-1440-04.jpg`, `home-1440-05.jpg`, `home-1440-07.jpg`, `extensoes-1440-00.jpg`, `ciclo-1440-00.jpg`, `governanca-1440-00.jpg`.
- **Tablet 768 px:** `home-768-00.jpg`, `home-768-05.jpg`.
- **Mobile 390 px:** `home-390-00.jpg` (comparada a `/tmp/baseline-shots/home-390-00.jpg`), `home-390-02.jpg`, `home-390-06.jpg`, `home-390-08.jpg`, `home-390-10.jpg`, `governanca-390-02.jpg`.

Resultado visual: ausência total de quebra de layout, sobreposição de textos, truncamento indesejado ou overflow horizontal. Em 390 px, o badge do rodapé monumental (`COMUNIDADE TÉCNICA BRASILEIRA · CHANCELA COLETIVA`) e os cards do seletor (`#simulador`) e das etapas (`YukoContinuityStage`) mantêm proporção e legibilidade equivalentes ao baseline.

### (e) Validação matemática dos limites de tamanho (+15% e +25%)

Auditoria por script sobre todas as **140** linhas alteradas entre `git show main:src/...` e `src/...` (e confirmação cruzada no HTML compilado em `dist/`):

- **Strings visíveis e metadados (121 itens):**
  - **Títulos, rótulos, métricas, itens de lista, tags e cards (limite ≤ +15%):** **100% conformes**.
    - Maior variação observada em rótulo/tag/item: **+14,3%** (`'revisão 2+ pares'`, 14 → 16 car., `yuko.ts:601`; e `140 → 160` car. em `ciclo.astro:137`).
    - Demais itens relevantes dentro da faixa: `index.astro:177` (`50 → 57`, +14,0%), `yuko.ts:626` (`88 → 100`, +13,6%), `yuko.ts:468` (`134 → 152`, +13,4%), `yuko.ts:656` (`66 → 74`, +12,1%), `yuko.ts:961` (`50 → 56`, +12,0%), `yuko.ts:248` (`17 → 19`, +11,8%), `yuko.ts:454` (`131 → 146`, +11,5%).
    - Métrica do hero (`HERO_METRICS[2]`): `Zero abandono` → `5 dias úteis` (`13 → 12`, -7,7%) e `Suporte garantido após a entrega` → `Troca assistida se houver ausência` (`32 → 34`, +6,2%).
  - **Parágrafos livres (limite ≤ +25%):** **100% conformes**. Apenas 3 parágrafos visíveis cresceram entre +15% e +25% (e nenhum ultrapassou +25%):
    1. `src/components/Footer.astro` (l. 58, `defaultSummary` variante compacta): `120 → 145` car. (**+20,8%**)
    2. `src/pages/index.astro` (l. 33, `p.hero-lead`): `171 → 205` car. (**+19,9%**)
    3. `src/pages/governanca.astro` (l. 45, `p.section-desc`): `114 → 132` car. (**+15,8%**)
    *(Nota: `src/pages/ciclo.astro` l. 31, `p.hero-lead`, ficou em `123 → 141` car., **+14,6%**.)*
- **Strings não visíveis (template de área de transferência em `YukoOrderSimulator.tsx:281-334`, 19 linhas):**
  - A função `buildHiddenOrderRecord` gera apenas o texto plano copiado via `navigator.clipboard.writeText(hiddenOrderRecord)` ao acionar o botão de ficha para o Discord; **não é renderizada no DOM nem exibida visualmente**. Algumas linhas cresceram acima de +25% (máximo +96,7% em `lgpdSummary` `92 → 181` e +91,8% em `Triagem e Manual v1.0` `182 → 349`) para incluir ressalvas obrigatórias de triagem, LGPD e responsabilidade individual.

---

## Achados classificados

### Bloqueante
- *Nenhum.*

### Ajuste
- *Nenhum.*

### Sugestão
1. **Compactação futura do texto copiado em `buildHiddenOrderRecord` (`src/components/YukoOrderSimulator.tsx:281-334`):** Embora o texto da área de transferência não seja visível na interface e não viole o limite de strings visíveis nem afete o layout, as linhas de ressalva (`Triagem e Manual v1.0`, 349 car., +91,8%; `lgpdSummary`, 181 car., +96,7%) ficaram mais extensas para colagem no Discord. Em um ciclo futuro, pode-se enxugar a redação mantendo o conteúdo jurídico/informativo.
2. **Acompanhamento de itens já registrados em `docs/revisao/FORA-DE-ESCOPO.md`:** Os atributos `aria-label` e `title` estáticos do seletor em `YukoOrderSimulator.tsx` (ex.: `"categoria de serviço"`, `"Ativar proteção LGPD"`, `"Nível de custo"`, item `F11`) permaneceram intocados conforme a proibição da Seção 2.2; recomenda-se priorizá-los em tarefa dedicada de acessibilidade após o fechamento desta revisão textual.
