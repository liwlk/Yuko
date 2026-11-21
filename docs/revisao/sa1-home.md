# SA-1 Home — Revisão textual da página inicial (`/`)

Escopo executado conforme `docs/revisao/guia-de-termos.md`, `PENDENCIAS.md` e instruções de propriedade exclusiva de arquivos.

---

## 1. Arquivos editados diretamente vs. propostas para arquivos compartilhados

### 1.1 Editado diretamente
- `src/pages/index.astro` — editado **exclusivamente** no corpo (linhas 24–209), preservando integralmente tags, classes, ids, `href`, `aria-*`, `data-*`, estilos inline, ordem do DOM e contagem de elementos.
  - As props `<BaseLayout title=... description=...>` (linhas 18–23) **não foram alteradas** (reservadas para SA-4/Fase 2; notar que `description` na linha 20 contém `"suporte garantido após a entrega"`).
  - O `<h1>` (`Software com <span class="accent-word">exatidão</span> coletiva para projetos.`, 45 car.) foi mantido inalterado por já estar fiel ao Manual v1.0 e livre de absolutos.

### 1.2 Propostas exatas para arquivos compartilhados (para aplicação na Fase 2)

#### A. `src/data/yuko.ts` (linhas 157–259 + revisão complementar em `AUDIENCE_CARDS`, linhas 261–299)

- **`SPLIT_SHORTCUTS` (linhas 157–163):** sem alterações necessárias (rótulos fiéis ao guia).
- **`HERO_METRICS` (linhas 165–169):**
  - Linha 168:
    - **Antes:** `{ value: 'Zero abandono', label: 'Suporte garantido após a entrega' },`
    - **Depois:** `{ value: '5 dias úteis', label: 'Troca assistida se houver ausência' },`
- **`CONTINUITY_LENS_LABELS` (linhas 171–175):**
  - Linha 174 (mantendo a chave `blindagem` intacta):
    - **Antes:** `blindagem: 'Blindagem',`
    - **Depois:** `blindagem: 'Resguardo',` *(alternativa igualmente válida dentro do limite: `'Cuidados'`, 8 car., -11,1%)*
- **`CONTINUITY_STAGES` (linhas 177–232):**
  - Linha 194 (`stages[1].stageLabel`, evita `"sempre"` como promessa):
    - **Antes:** `stageLabel: 'Código sempre acessível',`
    - **Depois:** `stageLabel: 'Código em espaço central',`
  - Linha 201 (`stages[1].lensNotes.blindagem`):
    - **Antes:** `blindagem: 'Zero dados reais em testes · privacidade desde a base',`
    - **Depois:** `blindagem: 'Dados sintéticos (fictícios) em testes · foco em LGPD',`
  - Linha 214 (`stages[2].lensNotes.blindagem`):
    - **Antes:** `blindagem: 'Conferência contra falhas comuns e proteção LGPD',`
    - **Depois:** `blindagem: 'Revisão de segurança por pares e práticas de LGPD',`
  - Linha 221 (`stages[3].title`):
    - **Antes:** `title: 'Suporte garantido contra abandono',`
    - **Depois:** `title: 'Suporte nominal e troca em 5 dias',` *(nota: `YukoContinuityStage.tsx` linha 966 usa `stage.title` em `aria-label`, herdando automaticamente a correção)*
  - Linha 222 (`stages[3].body`):
    - **Antes:** `body: 'Cada entrega tem suporte nominal. Se houver ausência por 5 dias úteis, outro profissional assume sem perda.',`
    - **Depois:** `body: 'Há suporte nomeado no período combinado. Após 5 dias úteis sem retorno, registra-se vacância e outro par assume.',`
  - Linha 225 (`stages[3].lensNotes.fluxo`):
    - **Antes:** `fluxo: 'Guia direto de uso e suporte pós-entrega definido',`
    - **Depois:** `fluxo: 'Guia de uso e suporte no período combinado',`
  - Linha 227 (`stages[3].lensNotes.blindagem`):
    - **Antes:** `blindagem: 'Regra anti-abandono em 5 dias úteis e suporte registrado',`
    - **Depois:** `blindagem: 'Regra dos 5 dias úteis, troca de acessos e suporte nomeado',`
- **`HOME_PILLARS` (linhas 234–259):**
  - Linha 240 (`HOME_PILLARS[0].description`):
    - **Antes:** `'Field, Dev, Make, Place, Work e Inline organizam cada entrega do começo ao fim — da conversa inicial à segurança dos seus dados.',`
    - **Depois:** `'As 6 extensões (Field, Dev, Make, Place, Work, Inline) e 6 frentes internas organizam o trabalho, da escuta inicial à governança.',`
  - Linha 241 (`HOME_PILLARS[0].tag`, evita chamar extensões de "áreas"):
    - **Antes:** `tag: 'Ver áreas e Discord →',`
    - **Depois:** `tag: 'Extensões e Discord →',`
  - Linha 248 (`HOME_PILLARS[1].description`, evita "Todo pedido passa" e "suporte garantido"):
    - **Antes:** `'Todo pedido passa por 6 etapas claras: entendimento, combinado escrito, construção, conferência por 2+ desenvolvedores, testes e suporte garantido.',`
    - **Depois:** `'Após triagem, o Ciclo segue 6 etapas: entendimento, combinado escrito, construção, revisão por 2+ pares, testes e suporte nomeado no período combinado.',`
  - Linha 249 (`HOME_PILLARS[1].tag`):
    - **Antes:** `tag: 'Ver as 6 etapas →',`
    - **Depois:** `tag: '6 etapas do Ciclo →',`
  - Linha 256 (`HOME_PILLARS[2].description`):
    - **Antes:** `'Lista de conferência antes da entrega, proteção contra invasões, sigilo sobre o negócio, testes sem dados reais e respeito à LGPD (Lei Geral de Proteção de Dados).',`
    - **Depois:** `'Revisão de segurança por 2+ pares, verificação de dependências, sigilo, dados sintéticos (fictícios) e LGPD (Lei Geral de Proteção de Dados; não substitui assessoria jurídica).',`
- **`AUDIENCE_CARDS` (linhas 261–299, usados exclusivamente na Home):**
  - Linha 267 (`AUDIENCE_CARDS[0].description`):
    - **Antes:** `'Acaba com entregas sem explicação e o medo de ficar sem apoio: tudo tem combinado claro, conferência coletiva e suporte depois do lançamento.',`
    - **Depois:** `'Evita entregas sem explicação e falta de apoio: traz combinado escrito, revisão por 2+ pares e suporte nomeado pelo período combinado.',`
  - Linha 272 (`AUDIENCE_CARDS[0].bullets[3]`):
    - **Antes:** `'Responsável de suporte com nome definido e sigilo de dados conforme a LGPD',`
    - **Depois:** `'Responsável de suporte nomeado no período combinado e boas práticas LGPD',`
  - Linha 284 (`AUDIENCE_CARDS[1].description`, remove `"burocracia"` e incorpora P1):
    - **Antes:** `'Troque o trabalho isolado por uma rede colaborativa de revisão e apoio técnico no Discord — sem vínculo empregatício nem burocracia de empresa.',`
    - **Depois:** `'Troque o trabalho isolado por rede de revisão e apoio no Discord — sem vínculo empregatício; cada um responde pelos próprios atos.',`

#### B. `src/components/YukoContinuityStage.tsx` (linhas 858–870)

- Linha 861 (`span.stage-kicker`): `'Respaldo na Prática'` — **manter** (fiel e sem absolutos).
- Linha 863 (`h2.stage-title`, remove absoluto implícito `"nenhum projeto fica na mão"`):
  - **Antes:** `Por que nenhum projeto fica na mão`
  - **Depois:** `Como preservamos a continuidade`
- Linha 866 (`p.stage-lead`, substitui `"sem deixar a empresa parada"` pela regra realista dos 5 dias úteis):
  - **Antes:** `Código centralizado, revisão por 2+ profissionais e troca segura sem deixar a empresa parada.`
  - **Depois:** `Código centralizado, revisão por 2+ pares e transferência assistida após 5 dias úteis sem retorno.`

#### C. `src/components/HeroSculpture.tsx` (linhas 485–494)

- Linha 488 (`hero-art-caption span`): `'Desenvolvimento colaborativo · Revisão por 2+ profissionais'` já está **fiel e livre de absolutos**.
  - **Proposta opcional (alinhamento estrito de termo canônico `"2+ pares"`):**
    - **Antes:** `<span>Desenvolvimento colaborativo · Revisão por 2+ profissionais</span>`
    - **Depois:** `<span>Desenvolvimento colaborativo · Revisão por 2+ pares</span>`
- Linha 490 (`studio-badge`): `Yuko Dev &amp; Make` — **manter** (nomes oficiais de extensões da marca).

---

## 2. Tabela completa de alterações e contagem de caracteres

*(Contagem exata de caracteres sobre a string visível renderizada, sem espaços de indentação HTML/JSX.)*

| Local | Tipo / Origem | Antes | Depois | Car. orig | Car. novo | Delta % | Limite | Status |
|---|---|---|---|---:|---:|---:|---:|---|
| `src/pages/index.astro:32-34` (`hero-lead`) | Editado direto (parágrafo) | A Yuko conecta desenvolvedores independentes e microempresas para criar sistemas sob medida, conferidos por mais de um profissional e com suporte garantido após a entrega. | Comunidade técnica em implantação gradual que conecta desenvolvedores independentes e microempresas para criar sistemas sob medida, com 2+ revisores e responsável de suporte nomeado pelo período combinado. | 171 | 205 | +19,9% | ≤ +25% | OK |
| `src/pages/index.astro:78` (`#pilaresHeading`) | Editado direto (título) | Entrega profissional sem complicação | Entrega assistida com regras claras | 36 | 35 | -2,8% | ≤ +15% | OK |
| `src/pages/index.astro:80` (`#pilares section-desc`) | Editado direto (parágrafo) | Combinado claro, conferência por 2+ revisores e suporte definido em um processo único. | Combinado escrito, revisão por 2+ pares e responsável de suporte nomeado em um só ciclo. | 86 | 88 | +2,3% | ≤ +25% | OK |
| `src/pages/index.astro:124` (`#atuacaoHeading`) | Editado direto (título) | Segurança para microempresas, autonomia para desenvolvedores | Respaldo para microempresas, autonomia para desenvolvedores | 60 | 59 | -1,7% | ≤ +15% | OK |
| `src/pages/index.astro:177` (`#simulador section-desc`) | Editado direto (parágrafo) | Veja prazo, faixa e gere sua ficha sem burocracia. | Veja estimativa indicativa e gere sua ficha para triagem. | 50 | 57 | +14,0% | ≤ +25% | OK |
| `src/pages/index.astro:192` (`#manual p`) | Editado direto (parágrafo) | Veja todas as regras da comunidade, cuidados com seus dados (LGPD) e nosso glossário, ou converse diretamente com os membros no Discord. | Veja as regras da comunidade, práticas de LGPD e o glossário (guia orientativo; não substitui contrato), ou converse com os membros no Discord. | 136 | 143 | +5,1% | ≤ +25% | OK |
| `src/data/yuko.ts:168` (`HERO_METRICS[2].value`) | Proposta (métrica) | Zero abandono | 5 dias úteis | 13 | 12 | -7,7% | ≤ +15% | OK |
| `src/data/yuko.ts:168` (`HERO_METRICS[2].label`) | Proposta (rótulo métrica) | Suporte garantido após a entrega | Troca assistida se houver ausência | 32 | 34 | +6,2% | ≤ +15% | OK |
| `src/data/yuko.ts:174` (`CONTINUITY_LENS_LABELS.blindagem`) | Proposta (rótulo) | Blindagem | Resguardo | 9 | 9 | 0,0% | ≤ +15% | OK |
| `src/data/yuko.ts:194` (`CONTINUITY_STAGES[1].stageLabel`) | Proposta (título estágio) | Código sempre acessível | Código em espaço central | 23 | 24 | +4,3% | ≤ +15% | OK |
| `src/data/yuko.ts:201` (`CONTINUITY_STAGES[1].lensNotes.blindagem`) | Proposta (nota de lente) | Zero dados reais em testes · privacidade desde a base | Dados sintéticos (fictícios) em testes · foco em LGPD | 53 | 53 | 0,0% | ≤ +15% | OK |
| `src/data/yuko.ts:214` (`CONTINUITY_STAGES[2].lensNotes.blindagem`) | Proposta (nota de lente) | Conferência contra falhas comuns e proteção LGPD | Revisão de segurança por pares e práticas de LGPD | 48 | 49 | +2,1% | ≤ +15% | OK |
| `src/data/yuko.ts:221` (`CONTINUITY_STAGES[3].title`) | Proposta (título card) | Suporte garantido contra abandono | Suporte nominal e troca em 5 dias | 33 | 33 | 0,0% | ≤ +15% | OK |
| `src/data/yuko.ts:222` (`CONTINUITY_STAGES[3].body`) | Proposta (texto card) | Cada entrega tem suporte nominal. Se houver ausência por 5 dias úteis, outro profissional assume sem perda. | Há suporte nomeado no período combinado. Após 5 dias úteis sem retorno, registra-se vacância e outro par assume. | 107 | 112 | +4,7% | ≤ +15% | OK |
| `src/data/yuko.ts:225` (`CONTINUITY_STAGES[3].lensNotes.fluxo`) | Proposta (nota de lente) | Guia direto de uso e suporte pós-entrega definido | Guia de uso e suporte no período combinado | 49 | 42 | -14,3% | ≤ +15% | OK |
| `src/data/yuko.ts:227` (`CONTINUITY_STAGES[3].lensNotes.blindagem`) | Proposta (nota de lente) | Regra anti-abandono em 5 dias úteis e suporte registrado | Regra dos 5 dias úteis, troca de acessos e suporte nomeado | 56 | 58 | +3,6% | ≤ +15% | OK |
| `src/data/yuko.ts:240` (`HOME_PILLARS[0].description`) | Proposta (texto card) | Field, Dev, Make, Place, Work e Inline organizam cada entrega do começo ao fim — da conversa inicial à segurança dos seus dados. | As 6 extensões (Field, Dev, Make, Place, Work, Inline) e 6 frentes internas organizam o trabalho, da escuta inicial à governança. | 128 | 129 | +0,8% | ≤ +15% | OK |
| `src/data/yuko.ts:241` (`HOME_PILLARS[0].tag`) | Proposta (rótulo tag) | Ver áreas e Discord → | Extensões e Discord → | 21 | 21 | 0,0% | ≤ +15% | OK |
| `src/data/yuko.ts:248` (`HOME_PILLARS[1].description`) | Proposta (texto card) | Todo pedido passa por 6 etapas claras: entendimento, combinado escrito, construção, conferência por 2+ desenvolvedores, testes e suporte garantido. | Após triagem, o Ciclo segue 6 etapas: entendimento, combinado escrito, construção, revisão por 2+ pares, testes e suporte nomeado no período combinado. | 147 | 151 | +2,7% | ≤ +15% | OK |
| `src/data/yuko.ts:249` (`HOME_PILLARS[1].tag`) | Proposta (rótulo tag) | Ver as 6 etapas → | 6 etapas do Ciclo → | 17 | 19 | +11,8% | ≤ +15% | OK |
| `src/data/yuko.ts:256` (`HOME_PILLARS[2].description`) | Proposta (texto card) | Lista de conferência antes da entrega, proteção contra invasões, sigilo sobre o negócio, testes sem dados reais e respeito à LGPD (Lei Geral de Proteção de Dados). | Revisão de segurança por 2+ pares, verificação de dependências, sigilo, dados sintéticos (fictícios) e LGPD (Lei Geral de Proteção de Dados; não substitui assessoria jurídica). | 163 | 176 | +8,0% | ≤ +15% | OK |
| `src/data/yuko.ts:267` (`AUDIENCE_CARDS[0].description`) | Proposta compl. (texto card) | Acaba com entregas sem explicação e o medo de ficar sem apoio: tudo tem combinado claro, conferência coletiva e suporte depois do lançamento. | Evita entregas sem explicação e falta de apoio: traz combinado escrito, revisão por 2+ pares e suporte nomeado pelo período combinado. | 141 | 134 | -5,0% | ≤ +15% | OK |
| `src/data/yuko.ts:272` (`AUDIENCE_CARDS[0].bullets[3]`) | Proposta compl. (item lista) | Responsável de suporte com nome definido e sigilo de dados conforme a LGPD | Responsável de suporte nomeado no período combinado e boas práticas LGPD | 74 | 72 | -2,7% | ≤ +15% | OK |
| `src/data/yuko.ts:284` (`AUDIENCE_CARDS[1].description`) | Proposta compl. (texto card) | Troque o trabalho isolado por uma rede colaborativa de revisão e apoio técnico no Discord — sem vínculo empregatício nem burocracia de empresa. | Troque o trabalho isolado por rede de revisão e apoio no Discord — sem vínculo empregatício; cada um responde pelos próprios atos. | 143 | 130 | -9,1% | ≤ +15% | OK |
| `src/components/YukoContinuityStage.tsx:863` (`stage-title`) | Proposta (título) | Por que nenhum projeto fica na mão | Como preservamos a continuidade | 34 | 31 | -8,8% | ≤ +15% | OK |
| `src/components/YukoContinuityStage.tsx:866` (`stage-lead`) | Proposta (parágrafo) | Código centralizado, revisão por 2+ profissionais e troca segura sem deixar a empresa parada. | Código centralizado, revisão por 2+ pares e transferência assistida após 5 dias úteis sem retorno. | 93 | 98 | +5,4% | ≤ +25% | OK |
| `src/components/HeroSculpture.tsx:488` (`caption`, opcional) | Proposta opcional (rótulo) | Desenvolvimento colaborativo · Revisão por 2+ profissionais | Desenvolvimento colaborativo · Revisão por 2+ pares | 59 | 51 | -13,6% | ≤ +15% | OK |

---

## 3. Lacunas que não couberam pelo limite (para `FORA-DE-ESCOPO.md`)

1. **Explicações entre parênteses na 1ª ocorrência de todos os termos técnicos da Home:** pelo limite de +15%/+25% e sem criar blocos novos, não coube na Home expandir na 1ª ocorrência definições completas de `combinado (escopo escrito com critérios de aceitação)`, `homologação (aprovação final pela microempresa)`, `transferência de contexto (push ao repositório central)` e `chancela coletiva` (reforça o item **F7** já listado em `FORA-DE-ESCOPO.md`).
2. **Papéis de Controladora / Operador na Home:** o detalhamento completo de quem decide sobre os dados (`microempresa = controladora`, `desenvolvedor = operador`) não cabe no card 3 de `HOME_PILLARS` nem no bullet da Home sem estourar +15%; permanece concentrado em `/governanca/` e `/manual/`.
3. **Detalhamento dos critérios de triagem e recusa (§8.1) na Home:** em `#simulador` foi incluída menção a `"estimativa indicativa"` e `"triagem"`, mas não cabe explicar que pedidos podem ser recusados ou repriorizados com orientação nem listar critérios de capacidade.
4. **Prop de `<BaseLayout description=...>` em `src/pages/index.astro` (linha 20):** fora do escopo de SA-1 por propriedade exclusiva de arquivos; contém `"suporte garantido após a entrega"` e deve ser atualizada por SA-4/Fase 2 junto com metadados OG/Twitter.
5. **Atributos `aria-label` estáticos em `HeroSculpture.tsx` (l. 201, 214) e `YukoContinuityStage.tsx` (l. 341, 874, 956, 981):** preservados por regra de escopo (não editar `aria-*`), mas vale revisar em auditoria de acessibilidade se `"sustentação coletiva"` / `"respaldo coletivo"` precisa de alinhamento na Fase 2.

---

## 4. Dúvidas ou pendências P1–P12 tocadas

- **P1 (Quem assina / responsabilidade individual):** tratado com texto neutro em `AUDIENCE_CARDS[1].description` (`"cada um responde pelos próprios atos"`), em `#manual` (`"guia orientativo; não substitui contrato"`) e em `HOME_PILLARS[2]` (`"não substitui assessoria jurídica"`), sem atribuir responsabilidade jurídica institucional à Yuko.
- **P2 (Cobrança / Piso · Teto / "sem taxas ocultas"):** tratado no subtítulo de `#simulador` em `index.astro` (`"estimativa indicativa"`), removendo `"sem burocracia"` e evitando qualquer promessa de preço fechado ou ausência de taxas.
- **P3 (Duração e escopo do suporte pós-entrega):** substituído `"suporte garantido"` / `"Zero abandono"` pelo texto neutro canônico `"responsável de suporte nomeado pelo período combinado"` (`hero-lead`, `HOME_PILLARS[1]`, `CONTINUITY_STAGES[3]`, `AUDIENCE_CARDS[0]`) e pela `"Regra dos 5 dias úteis"` (`HERO_METRICS[2]`, `CONTINUITY_STAGES[3]`, `YukoContinuityStage.tsx`).
- **P5 (Prazo de resposta e critérios de recusa na triagem):** inserida menção explícita a `"triagem"` em `#simulador` e em `HOME_PILLARS[1]` (`"Após triagem, o Ciclo segue 6 etapas..."`), evitando prometer atendimento a todo pedido (`"Todo pedido passa..."`).
- **P9 (Canal de contato além do Discord):** mantido apenas o Discord nos CTAs da Home (sem criar novos elementos de contato).
- **P11 (Linhagem NYX/Expliance):** respeitada a restrição — nenhuma menção fora de `/manual/`.
- **P12 ("Rede 4+ pessoas" × "2+ revisores"):** todas as referências na Home estão alinhadas a `2+ revisores` / `2+ pares`.
