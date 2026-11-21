# Relatório Final — Revisão Textual, Linguística e Explicativa (Yuko)

## 1. Resumo executivo

A revisão textual das páginas públicas do site da Yuko (`/`, `/extensoes/`, `/ciclo/`, `/governanca/`) e do simulador (`YukoOrderSimulator`) foi executada em quatro fases com subagentes paralelos (`SA-1` a `SA-4`) e dois revisores independentes (`REV-1` e `REV-2`), sem alterar estrutura HTML, CSS, JavaScript, rotas, rótulos de navegação ou a página `/manual/`. Foram removidas afirmações absolutas sem lastro no Manual Institucional v1.0 (como *"Zero abandono"*, *"Suporte garantido"*, *"Proteção contra invasões"*, *"sem perda"*, *"Blindagem"*, *"Sem taxas ocultas"* e *"4+ pessoas"*), incorporando o estágio de implantação gradual (§1.3), a regra dos 5 dias úteis com revogação de acessos (§7.4), a triagem e possibilidade de recusa com orientação (§8.1/§10.1), a responsabilidade profissional individual sem vínculo (§1.2/§13.4) e o enquadramento de LGPD com ressalva de não substituição de assessoria jurídica (§13.3). Itens dependentes de decisão institucional (`P1–P12`) receberam redação neutra e estão registrados em [`PENDENCIAS.md`](../../PENDENCIAS.md). Melhorias que exigiriam mudança de layout, atributos de acessibilidade ou novas seções foram apenas reportadas em [`FORA-DE-ESCOPO.md`](./FORA-DE-ESCOPO.md).

> **Nota de fonte:** O PDF original no Google Drive não estava acessível no ambiente por ausência do plugin de Drive conectado; utilizaram-se as referências normativas do briefing da revisão (§1.2, §1.3, §7.3, §7.4, §8.1, §8.4, §8.6, §9, §10.1, §10.3, §10.5, §13.3, §13.4) em conjunto com o conteúdo derivado do Manual v1.0 já publicado no repositório em `/manual/` (`CONTROL_TABLE`, `MANUAL_ORIGINS`, `GLOSSARY_TERMS`). Recomenda-se conferência final contra o PDF antes de revisões subsequentes.

---

## 2. Tabela de achados (Seção 5 × Status)

| Item do diagnóstico | Localização confirmada | Status | Tratamento aplicado |
|---|---|---|---|
| `"Zero abandono"` / `"sem perda"` | `yuko.ts` (`HERO_METRICS[2]`, `CONTINUITY_STAGES[3]`) e `YukoOrderSimulator.tsx` | **Corrigido** | Substituído por `"5 dias úteis · Troca assistida se houver ausência"` e regra dos 5 dias úteis com registro de vacância e revogação de acessos (§7.4). |
| `"Suporte garantido"` / `"garantia contra abandono"` | `index.astro`, `ciclo.astro`, `yuko.ts` (`HERO_METRICS`, `CONTINUITY_STAGES`, `HOME_PILLARS`), `Footer.astro` | **Corrigido (neutro P3)** | Substituído por `"responsável de suporte nomeado pelo período combinado"`. |
| `"Blindagem"` (aba do palco) | `yuko.ts` (`CONTINUITY_LENS_LABELS.blindagem`) | **Corrigido** | Rótulo visível alterado para `"Respaldo"` (mantendo chave interna `blindagem` para não alterar DOM/CSS). |
| `"Proteção contra invasões"` | `yuko.ts` (`HOME_PILLARS[2]`, `SECURITY_CARDS[0]`), `governanca.astro` | **Corrigido** | Substituído por revisão de segurança por 2+ pares, validação de entradas em formulários/rotas e verificação de dependências (§8.4, §10.5). |
| `"Segurança & LGPD"` (promessa excessiva / assessoria) | `yuko.ts` (`HOME_PILLARS[2]`, `LGPD_ITEMS`, `SIMULATOR_SOLUTIONS['casa-em-ordem']`), `governanca.astro` | **Corrigido** | Explicita projeto pensado para a LGPD (coleta mínima, dados sintéticos em testes, direitos dos titulares, microempresa controladora e dev operador) e ressalva expressa de que **não substitui assessoria jurídica** (§1.2). |
| `"Rede 4+ pessoas"` / `"4+ membros"` × `"2+ revisores"` | `YukoOrderSimulator.tsx` (l. 331, 786) | **Corrigido (P12)** | Substituído por `"1 + 2 pares"` na interface e `"Rede do ciclo: executor, 2+ revisores independentes e responsável de suporte"` na ficha copiada. |
| `"Sem taxas ocultas"` / `"Piso · Nível N · Teto"` | `YukoOrderSimulator.tsx` (l. 1124, 998–1002) | **Neutralizado por pendência (P2 máx.)** | Removido `"Sem taxas ocultas · "` (trocado por `"Faixa indicativa · "`); mantido medidor `Piso · Nível N · Teto` com indicação de estimativa indicativa e valores definidos no combinado. |
| Maturidade implícita no hero e rodapé | `index.astro` (`hero-lead`, meta), `extensoes.astro`, `Footer.astro` (`defaultSummary`) | **Corrigido** | Inserida menção expressa à **implantação gradual** sem exigir equipe permanente (§1.3). |
| Distinção `6 etapas` × `6 extensões` × `6 frentes` × `6 categorias` | `index.astro`, `extensoes.astro`, `ciclo.astro`, `yuko.ts`, `YukoOrderSimulator.tsx` | **Corrigido** | Termos unificados conforme `guia-de-termos.md` (`6 extensões da marca`, `6 frentes internas`, `6 etapas do Ciclo`, `6 categorias de pedido`). |
| Lacunas para microempresas e desenvolvedores (triagem/recusa, push, issue, linter, commits semânticos, responsabilidade individual) | `yuko.ts` (`AUDIENCE_CARDS`, `CYCLE_STAGES`, `CONTINUITY_RULES`, `DOD_ITEMS`, `STACK_ITEMS`), `YukoOrderSimulator.tsx` | **Corrigido** | Encaixado nos bullets, cards e registro de ficha dentro dos limites de caracteres. |
| Lacunas estruturais (FAQ, glossário resumido na Home, bloco para devs, `aria-label` do simulador, `"Mola"`, `#topo` vs `#topo-pagina`, `theme-color`, `NAV_ITEMS[1]`) | `BaseLayout.astro`, `ThemeControls.tsx`, `YukoOrderSimulator.tsx`, `yuko.ts`, `manual.astro` | **Fora de escopo** | Apenas relatado em [`FORA-DE-ESCOPO.md`](./FORA-DE-ESCOPO.md), sem alteração no código. |

---

## 3. Antes e depois dos textos mais relevantes (por página)

### Home (`/`) — `src/pages/index.astro`, `src/data/yuko.ts`, `YukoContinuityStage.tsx`, `YukoOrderSimulator.tsx`
- **Meta `description`:** `"A Yuko conecta... com suporte garantido após a entrega."` → `"Comunidade técnica em implantação gradual que une desenvolvedores e microempresas, com revisão por 2+ pares e responsável de suporte pelo período combinado."`
- **`hero-lead`:** `"A Yuko conecta desenvolvedores independentes e microempresas para criar sistemas sob medida, conferidos por mais de um profissional e com suporte garantido após a entrega."` → `"Comunidade técnica em implantação gradual que conecta desenvolvedores independentes e microempresas para criar sistemas sob medida, com 2+ revisores e responsável de suporte nomeado pelo período combinado."`
- **`HERO_METRICS[2]`:** `"Zero abandono / Suporte garantido após a entrega"` → `"5 dias úteis / Troca assistida se houver ausência"`
- **Palco (`CONTINUITY_STAGES` / `YukoContinuityStage`):**
  - Título da seção: `"Por que nenhum projeto fica na mão"` → `"Como preservamos a continuidade"`
  - Aba: `"Blindagem"` → `"Respaldo"`
  - Etapa 04: `"Suporte garantido contra abandono"` / `"assume sem perda"` → `"Suporte e troca em 5 dias úteis"` / `"Há suporte nomeado no período combinado. Após 5 dias úteis sem retorno, registra-se vacância e outro par assume."`
- **Pilares (`HOME_PILLARS`):** removidos `"suporte garantido"` e `"proteção contra invasões"`; adicionados `"Após triagem"`, `"verificação de dependências"`, `"dados sintéticos (fictícios)"` e `"não substitui assessoria jurídica"`.
- **Públicos (`AUDIENCE_CARDS`):** Microempresas agora explícita `"triagem: pedido pode ser recusado com orientação se desproporcional"`, `"chancela coletiva sem vínculo nem responsabilidade solidária e responsabilidade individual"`, `"homologação (aprovação final)"`; Desenvolvedores agora explícita `"Linter (padrão automático) e commits semânticos (histórico)"`, `"dados sintéticos (LGPD)"`, `"Registro em ficha (issue), envio (push) e transferência de contexto"` e `"vacância e revogação dos acessos"` em 5 dias úteis.
- **Simulador (`YukoOrderSimulator`):** `"4+ pessoas"` → `"1 + 2 pares"`; `"Sem taxas ocultas · "` → `"Faixa indicativa · "`; `"veja prazo, faixa e gere sua ficha sem burocracia"` → `"Veja estimativa indicativa e gere sua ficha para triagem"`.

### Extensões (`/extensoes/`) — `src/pages/extensoes.astro` & `src/data/yuko.ts`
- **`hero-lead` e cabeçalhos:** contraste nítido entre **`6 extensões sob a marca Yuko`** (`Yuko Field`, `Dev`, `Make`, `Place`, `Work`, `Inline`, em implantação gradual sem exigir equipe permanente) e **`6 frentes internas`** (disciplinas aplicadas nos projetos); correção adverbial `"Diferentemente das 6 extensões..."`.

### Ciclo (`/ciclo/`) — `src/pages/ciclo.astro` & `src/data/yuko.ts`
- **`hero-lead` e `#papeis`:** `"suporte garantido"` e `"garantia contra abandono"` → `"responsável de suporte nomeado pelo período combinado"` e `"regra de continuidade"`.
- **6 etapas (`CYCLE_STAGES`):** inclusão de recusa/repriorização com orientação na etapa 1, explicação em linha de `combinado (escopo escrito)`, `critérios de aceitação`, `ficha de acompanhamento (issue de registro)`, `linter`, `commits semânticos`, `ambiente de testes (staging)`, `dados sintéticos (fictícios)` e `homologação (aprovação final pela microempresa)`.
- **Continuidade (`CONTINUITY_RULES`):** `"Abandono (5 dias úteis) & Proteção"` → `"Regra de Vacância (5 dias úteis)"` com `envio (push)` e `"os acessos são revogados e outro par assume a continuidade"`.

### Qualidade & LGPD (`/governanca/`) — `src/pages/governanca.astro` & `src/data/yuko.ts`
- **`hero-lead` e `SECURITY_CARDS`:** `"proteção contra invasões"` / `"proteção ativa"` / `"auditoria contínua"` → `"Validação de Entradas"` (`revisão 2+ pares`), `"verificação de dependências (bibliotecas de terceiros)"`, `"Segredos fora do código-fonte"` e `"https & hash de senhas"`.
- **LGPD (`LGPD_ITEMS`):** `"sistema estruturado pensando na LGPD"`, explicação de Controladora e Operador e ressalva explícita: `"Não substitui assessoria jurídica."`

### Rodapé e Metadados Globais — `src/components/Footer.astro` & `src/layouts/BaseLayout.astro`
- **`Footer.astro`:** `defaultSummary` (monument e compact) passou a registrar `"em implantação gradual"` e `"suporte pelo período combinado"` (removendo `"suporte contínuo"`); `"Respaldo Coletivo"` → `"Chancela Coletiva"`; âncora `"Proteção & Continuidade"` → `"Continuidade na Prática"`.
- **`BaseLayout.astro`:** `ogImageAlt` padrão ajustado para `"Símbolo e marca Yuko — Comunidade Técnica e Entrega Assistida"`.

---

## 4. Arquivos alterados por subagente e evidência da guarda de escopo

### 4.1 Propriedade e execução
- **Fase 0 (Orquestrador):** inventário inicial ([`00-inventario-textual.md`](./00-inventario-textual.md)), guia de termos ([`guia-de-termos.md`](./guia-de-termos.md)), [`PENDENCIAS.md`](../../PENDENCIAS.md), [`FORA-DE-ESCOPO.md`](./FORA-DE-ESCOPO.md), linha de base (`main`).
- **Fase 1 (paralelo):**
  - `SA-1` ([`sa1-home.md`](./sa1-home.md)): `src/pages/index.astro` (corpo) + propostas para `yuko.ts`, `YukoContinuityStage.tsx`, `HeroSculpture.tsx`.
  - `SA-2` ([`sa2-publicos-seletor.md`](./sa2-publicos-seletor.md)): `src/components/YukoOrderSimulator.tsx` + propostas para `AUDIENCE_CARDS` e `SIMULATOR_*`.
  - `SA-3` ([`sa3-subpaginas.md`](./sa3-subpaginas.md)): `src/pages/extensoes.astro`, `src/pages/ciclo.astro`, `src/pages/governanca.astro` (corpo) + propostas para `yuko.ts`.
  - `SA-4` ([`sa4-global.md`](./sa4-global.md)): `src/components/Footer.astro`, `src/layouts/BaseLayout.astro` (`ogImageAlt`) + propostas de `description` e rótulos globais.
- **Fase 2 & 4 (Integração e correções — Orquestrador):** consolidação em `src/data/yuko.ts`, metadados das páginas, `HeroSculpture.tsx`, `YukoContinuityStage.tsx` e ajustes pós-`REV-1`.

### 4.2 Evidência da guarda de escopo (pós-Fase 4)
- **`git diff --stat -- src/`:** exatamente 10 arquivos alterados (`145 insertions(+), 145 deletions(-)`), 100% substituições 1-para-1 de strings. Zero alterações em `src/styles/*`, `src/scripts/*`, `public/*`, configurações, `NAV_ITEMS` ou `src/pages/manual.astro` / constantes do Manual.
- **Esqueleto HTML (3.003 nós nas 5 páginas):** `extensoes`, `ciclo`, `governanca` e `manual` com **0 diferenças estruturais**; `home` com alteração apenas no atributo `aria-label` gerado dinamicamente em `.stage-mobile-tab` pelo título atualizado de `CONTINUITY_STAGES[2..3]`. Contagem de elementos (`section`, `article`, `.m3-card`, `li`, `button`, `a`, `nav a`, `footer a`, `h1`, `h2`, `h3`, `p`) **100% idêntica** ao baseline.
- **Limites de caracteres:** todas as strings visíveis e metadados respeitaram `≤ +15%` (máximo pós-Fase 4: `+14,3%`) para títulos/rótulos/itens/cards e `≤ +25%` (máximo: `+20,8%`) para parágrafos livres.
- **Varredura de termos proibidos no HTML visível compilado (`dist/{index,extensoes,ciclo,governanca}`):** `0` ocorrências restantes (`matches: []`).
- **Capturas de tela nas 3 larguras (`1440`, `768`, `390` px):** `hOverflow false` em todas as 12 combinações página × largura; zero quebras de layout ou truncamentos observados.

---

## 5. Pareceres independentes (`REV-1` e `REV-2`) e correções posteriores

- **`REV-1` ([`rev1.md`](./rev1.md)):** **Aprovado com ajustes (0 Bloqueantes, 7 Ajustes, 7 Sugestões)**.
  - **Aplicados na Fase 4:** `A2` (`"5 dias"` → `"5 dias úteis"`), `A3` (`"troca de acessos"` → `"revogação de acessos"`), `A4` (explicações inline em `AUDIENCE_CARDS[1].bullets` dentro do limite de +15%: `'Linter (padrão automático) e commits semânticos (histórico)'` e `'Registro em ficha (issue), envio (push) e transferência de contexto'`), `A5` (`"assessoria legal"` → `"assessoria jurídica"`), `A6` (correção gramatical e eliminação de dois-pontos encadeados/repetição de `LGPD:` em `buildHiddenOrderRecord`, com inclusão da ressalva no ramo cliente), `S1` (remoção de `"sempre"` no `title` desabilitado do modo Resgate), `S2`, `S3`, `S4`, `S5`, `S6` (`"Diferentemente"`), `S7` (capitalização uniforme em `LGPD_ITEMS`).
  - **Não aplicados intencionalmente:**
    - `A1` (`<h1>` `"Software com exatidão coletiva para projetos."`): preservada a palavra `"exatidão"` por decisão explícita anterior do responsável pelo projeto nesta conversa; registra-se aqui a recomendação de `REV-1` para eventual troca por `"clareza"` ou `"método"` caso se opte por evitar conotação de precisão absoluta.
    - `A7` (`aria-label` em `YukoOrderSimulator.tsx:846` e `title` na linha 949): mantidos intocados na revisão atual para cumprir a proibição da Seção 2.2 (`aria-*`); já registrados em `FORA-DE-ESCOPO.md` (`F11`).
    - `S6` (`Valores` → `Fundamentos` no botão de `extensoes.astro:37`): mantido `"Valores"` porque `"Fundamentos"` (+57%) excederia o teto de +15%.
- **`REV-2` ([`rev2.md`](./rev2.md)):** **Aprovado (0 Bloqueantes, 0 Ajustes, 2 Sugestões)**. As duas sugestões (`buildHiddenOrderRecord` extenso na área de transferência e `F11` `aria-label` fora de escopo) ficam registradas para ciclos futuros. Após as correções da Fase 4, os limites de caracteres, o esqueleto HTML e o build foram revalidados sem regressões.

---

## 6. Pendências abertas (`P1–P12`) e impacto no texto do site

Detalhamento completo em [`PENDENCIAS.md`](../../PENDENCIAS.md). Principais impactos atuais no site:
- **`P2` (Prioridade Máxima — Cobrança / Piso · Nível · Teto):** o medidor visual e rótulos `Piso · Nível N · Teto` permanecem como estimativa indicativa sem valores em reais, e `"Sem taxas ocultas"` foi removido.
- **`P1`, `P3`, `P4`, `P5`, `P6`, `P7`, `P8`:** o site explicita ausência de vínculo, responsabilidade individual e chancela coletiva (`P1`); refere suporte apenas pelo `"período combinado"` (`P3`); evita prometer titularidade de domínio/hospedagem (`P4`); informa triagem com possibilidade de recusa sem fixar prazo (`P5`); omite remuneração (`P6`), critérios de habilitação (`P7`) e licença formal (`P8`).
- **`P9`, `P10`, `P11`, `P12`:** apenas Discord exibido (`P9`, fora de escopo); `theme-color` `#a93714` mantido (`P10`, fora de escopo); zero menções a NYX/Expliance fora de `/manual/` (`P11`); `"4+ pessoas"` removido em favor de `"1 + 2 pares"` / `"2+ revisores"` (`P12`).

---

## 7. Recomendações estruturais não implementadas (fora de escopo)

Registradas integralmente em [`FORA-DE-ESCOPO.md`](./FORA-DE-ESCOPO.md):
1. **Novos blocos na Home (`F7`, `F8`):** seção de FAQ, glossário resumido na Home, bloco dedicado *"Para desenvolvedores: como entrar e obrigações"* e banner visível de fase de implantação, reduzindo redundância de `"2+ revisores"` distribuída em 7 blocos.
2. **Canal de contato alternativo (`F9` / `P9`):** e-mail ou formulário de envio direto de solicitação para microempresas que não usam Discord.
3. **Acessibilidade e atributos internos (`F10`, `F11`, `F13`):** alinhar `aria-label` do simulador (`"categoria de serviço"` → `"categoria de pedido"`), revisar foco visível no `SplitButton` e tabs do palco, conferir contraste WCAG 2.2 AA nas 4 sementes × 2 modos e oferecer fallback estático sem JS para o palco.
4. **Rótulo `"Mola"` (`F1`):** substituir ou contextualizar o rótulo do botão de física de movimento na `TopBar` (`ThemeControls.tsx:193`).
5. **Âncoras `#topo` vs `#topo-pagina` (`F2`):** renomear para `#conteudo` e `#inicio-pagina`.
6. **Menu `"Extensões"` (`F4`):** renomear item de navegação para `"Extensões & Frentes"` ou `"Como nos organizamos"`.
7. **Cor-tema `#a93714` × Manual §4.2 (`F3` / `P10`)** e **atualização futura da página `/manual/` (`F5`, `F6`)** para alinhar `"garantia de continuidade"`, `"proteção contra abandono"` e `"zero falhas graves"` na v1.1.

---

## 8. Recomendação de revisão jurídica

Recomenda-se que todos os textos que tratam de **LGPD** (enquadramento como Controladora e Operadores, coleta mínima, incidentes e direitos dos titulares), **ausência de vínculo empregatício ou societário e responsabilidade profissional individual** (`§1.2`, `§13.4`) e **modelo de contratação, cobrança e faixas indicativas** (`P1`, `P2`, `P3`, `P4`) passem por **revisão jurídica especializada** antes da adoção comercial definitiva ou da abertura de novos canais de atendimento.
