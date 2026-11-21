# SA-2 — Públicos e Seletor (`AUDIENCE_CARDS`, `SIMULATOR_*` e `YukoOrderSimulator.tsx`)

Revisão textual executada conforme [guia-de-termos.md](./guia-de-termos.md) e [PENDENCIAS.md](../../PENDENCIAS.md), respeitando integralmente o limite de propriedade exclusiva de arquivos:
- **Editado diretamente:** `src/components/YukoOrderSimulator.tsx` (somente strings renderizadas, toasts e `buildHiddenOrderRecord`, preservando JSX, tags, classes, `aria-*`, `title`, SVG, lógica e cálculos).
- **Apenas proposto neste relatório (para aplicação na Fase 2):** `src/data/yuko.ts` (`AUDIENCE_CARDS`, `SIMULATOR_PERSPECTIVE_OPTIONS`, `SIMULATOR_SOLUTIONS` e `SIMULATOR_DEV_PROFILES`).

---

## 1. Edições feitas em `src/components/YukoOrderSimulator.tsx`

### 1.1 Resumo das alterações aplicadas
1. **`networkSignalValue` (linha 786):** substituído `'4+ pessoas'` por `'1 + 2 pares'` (P12 — alinha à regra de 2+ revisores e ao rótulo `'1 cria + 2 pares'` do modo Dev).
2. **Nota de rodapé (linha 1124):** removida a expressão `'Sem taxas ocultas · '` e substituída por `'Faixa indicativa · '` (P2 — o Manual v1.0 não define preços nem taxas; evita afirmação comercial sem lastro).
3. **Toasts (linhas 750–751):** ajustadas as mensagens ao gerar/copiar solicitação/ficha para explicitar o envio ao Discord para **triagem** (§8.1), sem sugerir início imediato.
4. **`SITUATION_OPTIONS` `'Do zero'` (linha 48):** **mantido** como `'Do zero'` (7 car.) porque descreve ponto de partida técnico (em contraste com `'Evoluir'` e `'Resgatar'`), não uma promessa absoluta (como "zero falhas" ou "zero abandono"). Caso se decida eliminar qualquer ocorrência lexical de `"zero"`, a alternativa curta é `'Novo'` (4 car., `-42,9%`), embora menos específica que `'Do zero'`.
5. **`buildHiddenOrderRecord` (linhas 280–335):**
   - Substituídas ocorrências de `"Frente"` / `"Frente solicitada"` / `"Solução indicada"` por `"Categoria do pedido:"` (distinção conceitual: 6 categorias de pedido) e `"Áreas Yuko:"` por `"Extensões Yuko:"`.
   - Substituídos `"Nível da entrega"` / `"Nível de custo"` e `"contrato direto"` por `"Estimativa indicativa"` com `"valores definidos no combinado"` e `"acordo bilateral autônomo"` (alinhado a `/manual/` e P2).
   - Substituído `"Rede de entrega: 4+ membros (...)"` (linha 331) pela redação exata `'Rede do ciclo: executor, 2+ revisores independentes e responsável de suporte'` (P12).
   - Removidas promessas absolutas (`"sem perda"`, `"suporte após a entrega"` genérico) e incorporadas as regras reais:
     - **LGPD (§1.2 / §13.3):** `"Projetada pensando na LGPD"`, empresa como **controladora**, dev como **operador**, coleta mínima, respeito aos **direitos dos titulares**, testes com **dados sintéticos** e ressalva explícita de que **não substitui assessoria jurídica**.
     - **Regra dos 5 dias úteis (§7.4):** envio (`push`) e transferência de contexto no repositório central; após 5 dias úteis sem resposta nem justificativa, registra-se vacância, os acessos são revogados e outro participante assume.
     - **Triagem, chancela coletiva e responsabilidade (§1.2, §8.1, §10.1, §13.4):** após o envio, o pedido passa por triagem e pode ser recusado ou repriorizado com orientação (demandas desproporcionais não são atendidas), sem prometer prazo de resposta (P5); chancela coletiva sem vínculo nem responsabilidade solidária (cada participante responde pelos próprios atos).
     - **Padrões de dev (§9, §10.3):** ficha (`issue`) obrigatória, `linter`, commits semânticos e revisão por 2+ pares independentes antes da liberação.

---

## 2. Propostas exatas para `src/data/yuko.ts` (Fase 2)

> **Não aplicado diretamente** conforme regra de propriedade exclusiva de arquivos.

### 2.1 `AUDIENCE_CARDS` (`src/data/yuko.ts`, linhas 261–299)

```ts
export const AUDIENCE_CARDS: AudienceCard[] = [
  {
    id: 'cardMicroempresa',
    badge: 'Microempresas Parceiras',
    title: 'Continuidade & Respaldo',
    description:
      'Acaba com entregas sem explicação: há combinado claro, chancela coletiva sem vínculo nem responsabilidade solidária e responsabilidade individual de cada par.',
    bullets: [
      'Escuta e triagem: pedido pode ser recusado com orientação se desproporcional',
      'Combinado (escopo escrito e testes) até a homologação (aprovação final)',
      'Conferência por 2+ revisores independentes (chancela coletiva da comunidade)',
      'Responsável de suporte nomeado no período combinado e cuidado com dados (LGPD)',
    ],
    ctaLabel: 'Ver as 6 etapas da entrega',
    ctaHref: '/ciclo/',
    ctaVariant: 'outline',
    featured: false,
  },
  {
    id: 'cardDesenvolvedor',
    badge: 'Desenvolvedores Independentes',
    title: 'Autonomia com Pares',
    description:
      'Troque o trabalho isolado pela rede técnica no Discord — sem vínculo empregatício, com responsabilidade profissional individual e troca aberta de guias.',
    bullets: [
      'Tecnologias conhecidas, linter automático e commits semânticos',
      'Revisão por 2+ pares e testes apenas com dados sintéticos (LGPD)',
      'Registro obrigatório em ficha (issue), push e transferência de contexto',
      'Após 5 dias úteis sem resposta, há vacância e revogação dos acessos',
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
```

**Cobertura dos pontos do diagnóstico em `AUDIENCE_CARDS`:**
- **Microempresas Parceiras:** chancela coletiva sem vínculo nem responsabilidade solidária e responsabilidade individual de cada participante (§1.2/§13.4); escuta e triagem com possibilidade de recusa orientada em demandas desproporcionais (§8.1/§10.1); explicação de `combinado` e `homologação`; responsável de suporte nomeado no período combinado (P3).
- **Desenvolvedores Independentes:** remoção de `"sem burocracia"`; responsabilidade profissional individual e ausência de vínculo (§1.2/§13.4); preservação de `"troca aberta de guias"` sem prometer licença (P8); `linter` e commits semânticos (§10.3); revisão por 2+ pares e testes com dados sintéticos (§13.3); registro formal obrigatório em ficha/`issue` (§9), `push` e transferência de contexto (§7.4); vacância e revogação de acessos após 5 dias úteis sem resposta (§7.4).

### 2.2 `SIMULATOR_PERSPECTIVE_OPTIONS` (`src/data/yuko.ts`, linhas 869–876)
Sem alterações necessárias (`'Empresa'`, `'Cliente'`, `'Dev'`).

### 2.3 `SIMULATOR_SOLUTIONS` (`src/data/yuko.ts`, linhas 878–994)

Proposta de substituição apenas dos campos alterados (demais campos numéricos, `id`, `extensions`, `discordChannel` e textos sem pendência permanecem idênticos):

1. **`site-presenca`**:
   - `shortSummary`: `'Negócio no ar, leve, rápido e acessível.'` (remove promessa de titularidade de domínio — P4).
   - `clientShortSummary`: `'Horários, serviços e contato oficial em poucos toques.'` (substitui `"em segundos"` por formulação realista).
   - `humanSummary`: `'Seu negócio no ar com contato direto, leitura clara e acesso rápido no celular.'` (remove `"domínio no seu nome"` — P4).
2. **`agenda-pedidos`**: sem alterações obrigatórias.
3. **`cadastro-rotina`**:
   - `clientShortSummary`: `'Atendimento ágil com histórico organizado à mão.'` (remove `"sempre"` como promessa ao cliente).
4. **`automacao-ferramentas`**:
   - `clientShortSummary`: `'Confirmação rápida e respostas consistentes a cada pedido.'` (remove `"imediata"`).
   - `clientProfileHook`: `'Confirmação rápida e respostas consistentes após o envio do seu pedido.'` (remove `"imediata"`).
5. **`casa-em-ordem` (`Segurança & LGPD`)**:
   - `categoryDescription`: `'Organize acessos pensando na LGPD; não substitui assessoria jurídica.'` (§1.2 / §13.3).
   - `profileTitle`: `'Base Organizada (LGPD)'` (evita tom de garantia de `"Base Protegida"`).
   - `shortSummary`: `'Coleta mínima e dados sintéticos pensando na LGPD.'`
   - `clientShortSummary`: `'Coleta mínima, acesso restrito e direitos dos titulares.'`
   - `humanSummary`: `'Projetado para LGPD (controladora e operador); não substitui assessoria legal.'`
   - `clientProfileHook`: `'Acesso restrito, coleta mínima, dados sintéticos em testes e respeito aos titulares.'`
6. **`resgate-sistema` (`Resgate`)**:
   - `shortSummary`: `'Retoma o sistema com suporte no período combinado.'` (remove `"suporte contínuo"` — P3).
   - `clientShortSummary`: `'Serviço estável de volta com acompanhamento técnico.'` (remove `"sem novas interrupções"`).
   - `humanSummary`: `'Retoma o sistema no repositório central, com responsável de suporte pelo período combinado.'` (remove `"garante suporte contínuo"` — P3).
   - `clientProfileHook`: `'O serviço volta a funcionar de forma estável, com suporte no período combinado.'` (remove `"sem interrupções"` — P3).

### 2.4 `SIMULATOR_DEV_PROFILES` (`src/data/yuko.ts`, linhas 996–1021)

1. **`executor`**:
   - `shortSummary`: `'Faz combinado escrito e constrói no espaço central.'` (alinha ao termo canônico `combinado`).
   - `humanSummary`: `'Registra o combinado por escrito e constrói no repositório central.'`
2. **`revisor`**: sem alterações obrigatórias (`2+` e verificação de segurança/LGPD já alinhados).
3. **`suporte`**:
   - `shortSummary`: `'Acompanha em produção no período combinado e apoia transições.'` (remove `"garante continuidade"` — P3).
   - `humanSummary`: `'Acompanha o sistema no período combinado e apoia a transição em ausências.'` (remove `"garante transição segura"` — P3).

---

## 3. Tabela completa de alterações e limites (Antes × Depois)

### 3.1 Textos visíveis na interface (UI) — com limite estrito (+15% / +25%)

| Arquivo / Campo | Antes | Depois | Car. orig | Car. novo | Delta % | Limite |
|---|---|---|---:|---:|---:|---|
| `yuko.ts` → `AUDIENCE_CARDS[0].description` | `Acaba com entregas sem explicação e o medo de ficar sem apoio: tudo tem combinado claro, conferência coletiva e suporte depois do lançamento.` | `Acaba com entregas sem explicação: há combinado claro, chancela coletiva sem vínculo nem responsabilidade solidária e responsabilidade individual de cada par.` | 141 | 158 | +12,06% | 25% |
| `yuko.ts` → `AUDIENCE_CARDS[0].bullets[0]` | `Conversa inicial sobre a rotina real via Yuko Field ou contato direto` | `Escuta e triagem: pedido pode ser recusado com orientação se desproporcional` | 69 | 76 | +10,14% | 15% |
| `yuko.ts` → `AUDIENCE_CARDS[0].bullets[1]` | `Combinado enxuto deixando claro o que será entregue e como testar` | `Combinado (escopo escrito e testes) até a homologação (aprovação final)` | 65 | 71 | +9,23% | 15% |
| `yuko.ts` → `AUDIENCE_CARDS[0].bullets[2]` | `Conferência por pelo menos 2 revisores independentes antes da entrega` | `Conferência por 2+ revisores independentes (chancela coletiva da comunidade)` | 69 | 76 | +10,14% | 15% |
| `yuko.ts` → `AUDIENCE_CARDS[0].bullets[3]` | `Responsável de suporte com nome definido e sigilo de dados conforme a LGPD` | `Responsável de suporte nomeado no período combinado e cuidado com dados (LGPD)` | 74 | 78 | +5,41% | 15% |
| `yuko.ts` → `AUDIENCE_CARDS[1].description` | `Troque o trabalho isolado por uma rede colaborativa de revisão e apoio técnico no Discord — sem vínculo empregatício nem burocracia de empresa.` | `Troque o trabalho isolado pela rede técnica no Discord — sem vínculo empregatício, com responsabilidade profissional individual e troca aberta de guias.` | 143 | 152 | +6,29% | 25% |
| `yuko.ts` → `AUDIENCE_CARDS[1].bullets[0]` | `Liberdade para escolher tecnologias conhecidas e confiáveis` | `Tecnologias conhecidas, linter automático e commits semânticos` | 59 | 62 | +5,08% | 15% |
| `yuko.ts` → `AUDIENCE_CARDS[1].bullets[1]` | `Revisão por 2+ pares antes de qualquer liberação ao cliente` | `Revisão por 2+ pares e testes apenas com dados sintéticos (LGPD)` | 59 | 64 | +8,47% | 15% |
| `yuko.ts` → `AUDIENCE_CARDS[1].bullets[2]` | `Operação coordenada no Discord com fichas claras de acompanhamento` | `Registro obrigatório em ficha (issue), push e transferência de contexto` | 66 | 71 | +7,58% | 15% |
| `yuko.ts` → `AUDIENCE_CARDS[1].bullets[3]` | `Reaproveitamento aberto de ferramentas, guias e boas práticas` | `Após 5 dias úteis sem resposta, há vacância e revogação dos acessos` | 61 | 67 | +9,84% | 15% |
| `yuko.ts` → `SIMULATOR_SOLUTIONS['site-presenca'].shortSummary` | `Negócio no ar, rápido e no seu domínio.` | `Negócio no ar, leve, rápido e acessível.` | 39 | 40 | +2,56% | 15% |
| `yuko.ts` → `SIMULATOR_SOLUTIONS['site-presenca'].clientShortSummary` | `Horários, serviços e WhatsApp oficial em segundos.` | `Horários, serviços e contato oficial em poucos toques.` | 50 | 54 | +8,00% | 15% |
| `yuko.ts` → `SIMULATOR_SOLUTIONS['site-presenca'].humanSummary` | `Seu negócio no ar com contato direto, rápido no celular e domínio no seu nome.` | `Seu negócio no ar com contato direto, leitura clara e acesso rápido no celular.` | 78 | 79 | +1,28% | 15% |
| `yuko.ts` → `SIMULATOR_SOLUTIONS['cadastro-rotina'].clientShortSummary` | `Atendimento ágil com histórico sempre à mão.` | `Atendimento ágil com histórico organizado à mão.` | 44 | 48 | +9,09% | 15% |
| `yuko.ts` → `SIMULATOR_SOLUTIONS['automacao-ferramentas'].clientShortSummary` | `Confirmação imediata e respostas consistentes a cada pedido.` | `Confirmação rápida e respostas consistentes a cada pedido.` | 60 | 58 | -3,33% | 15% |
| `yuko.ts` → `SIMULATOR_SOLUTIONS['automacao-ferramentas'].clientProfileHook` | `Confirmação imediata e respostas consistentes assim que você envia um pedido.` | `Confirmação rápida e respostas consistentes após o envio do seu pedido.` | 77 | 71 | -7,79% | 15% |
| `yuko.ts` → `SIMULATOR_SOLUTIONS['casa-em-ordem'].categoryDescription` | `Proteja informações, acessos e práticas de tratamento de dados.` | `Organize acessos pensando na LGPD; não substitui assessoria jurídica.` | 63 | 69 | +9,52% | 15% |
| `yuko.ts` → `SIMULATOR_SOLUTIONS['casa-em-ordem'].profileTitle` | `Base Protegida (LGPD)` | `Base Organizada (LGPD)` | 21 | 22 | +4,76% | 15% |
| `yuko.ts` → `SIMULATOR_SOLUTIONS['casa-em-ordem'].shortSummary` | `Senhas, cópias de segurança e coleta sob LGPD.` | `Coleta mínima e dados sintéticos pensando na LGPD.` | 46 | 50 | +8,70% | 15% |
| `yuko.ts` → `SIMULATOR_SOLUTIONS['casa-em-ordem'].clientShortSummary` | `Dados protegidos, acesso restrito e coleta mínima.` | `Coleta mínima, acesso restrito e direitos dos titulares.` | 50 | 56 | +12,00% | 15% |
| `yuko.ts` → `SIMULATOR_SOLUTIONS['casa-em-ordem'].humanSummary` | `Organiza senhas, cópias de segurança e coleta de dados conforme a LGPD.` | `Projetado para LGPD (controladora e operador); não substitui assessoria legal.` | 71 | 78 | +9,86% | 15% |
| `yuko.ts` → `SIMULATOR_SOLUTIONS['casa-em-ordem'].clientProfileHook` | `Seus dados ficam protegidos, com acesso restrito e sem coleta desnecessária.` | `Acesso restrito, coleta mínima, dados sintéticos em testes e respeito aos titulares.` | 78 | 84 | +7,69% | 15% |
| `yuko.ts` → `SIMULATOR_SOLUTIONS['resgate-sistema'].shortSummary` | `Retoma o sistema parado com suporte contínuo.` | `Retoma o sistema com suporte no período combinado.` | 45 | 50 | +11,11% | 15% |
| `yuko.ts` → `SIMULATOR_SOLUTIONS['resgate-sistema'].clientShortSummary` | `Serviço estável de volta, sem novas interrupções.` | `Serviço estável de volta com acompanhamento técnico.` | 49 | 52 | +6,12% | 15% |
| `yuko.ts` → `SIMULATOR_SOLUTIONS['resgate-sistema'].humanSummary` | `Retoma seu sistema parado, coloca tudo em espaço central e garante suporte contínuo.` | `Retoma o sistema no repositório central, com responsável de suporte pelo período combinado.` | 84 | 91 | +8,33% | 15% |
| `yuko.ts` → `SIMULATOR_SOLUTIONS['resgate-sistema'].clientProfileHook` | `O serviço volta a funcionar de forma estável, sem interrupções para você.` | `O serviço volta a funcionar de forma estável, com suporte no período combinado.` | 73 | 79 | +8,22% | 15% |
| `yuko.ts` → `SIMULATOR_DEV_PROFILES.executor.shortSummary` | `Acorda por escrito e constrói no espaço central.` | `Faz combinado escrito e constrói no espaço central.` | 48 | 51 | +6,25% | 15% |
| `yuko.ts` → `SIMULATOR_DEV_PROFILES.executor.humanSummary` | `Fecha o acordo por escrito e constrói tudo no espaço central compartilhado.` | `Registra o combinado por escrito e constrói no repositório central.` | 75 | 67 | -10,67% | 15% |
| `yuko.ts` → `SIMULATOR_DEV_PROFILES.suporte.shortSummary` | `Acompanha em produção e garante continuidade em ausências.` | `Acompanha em produção no período combinado e apoia transições.` | 58 | 62 | +6,90% | 15% |
| `yuko.ts` → `SIMULATOR_DEV_PROFILES.suporte.humanSummary` | `Acompanha o sistema no ar e garante transição segura se houver ausência.` | `Acompanha o sistema no período combinado e apoia a transição em ausências.` | 72 | 74 | +2,78% | 15% |
| `YukoOrderSimulator.tsx` (l. 786) → `networkSignalValue` | `4+ pessoas` | `1 + 2 pares` | 10 | 11 | +10,00% | 15% |
| `YukoOrderSimulator.tsx` (l. 1124) → `.sim-footer-note` | `Sem taxas ocultas · ` | `Faixa indicativa · ` | 20 | 19 | -5,00% | 15% |
| `YukoOrderSimulator.tsx` (l. 750) → toast copiado | `${recordNoun} ${orderCode} pronta e copiada para o Discord.` | `${recordNoun} ${orderCode} copiada para triagem no Discord.` | 59 | 59 | 0,00% | 15% |
| `YukoOrderSimulator.tsx` (l. 751) → toast fallback | `${recordNoun} ${orderCode} gerada. Abra o Discord para iniciar.` | `${recordNoun} ${orderCode} gerada. Envie no Discord para triagem.` | 63 | 65 | +3,17% | 15% |

### 3.2 Registro gerado para área de transferência (`buildHiddenOrderRecord` em `YukoOrderSimulator.tsx`)

> Nota: trata-se de texto plano copiado para a área de transferência (não renderizado no layout da página). Os acréscimos decorrem das ressalvas obrigatórias do diagnóstico (§1.2, §7.4, §8.1, §9, §10.1, §10.3, §13.3, §13.4).

| Linha / Contexto | Antes | Depois | Car. orig | Car. novo | Delta % | Limite |
|---|---|---|---:|---:|---:|---|
| l. 281 (`lgpdSummary`, `true`) | `Ativa (empresa como Controladora, coleta mínima e testes exclusivos com dados fictícios)` | `Projetada pensando na LGPD: empresa como controladora, dev como operador, coleta mínima, direitos dos titulares e testes com dados sintéticos (não substitui assessoria jurídica)` | 88 | 177 | +101,14% | n/a (clipboard) |
| l. 282 (`lgpdSummary`, `false`) | `Informações públicas (sem coleta sensível e testes exclusivos com dados fictícios)` | `Informações públicas, sem coleta sensível prevista e testes com dados sintéticos (não substitui assessoria jurídica)` | 82 | 116 | +41,46% | n/a (clipboard) |
| l. 286 (`clientLgpdSummary`, `true`) | `Seus dados ficam protegidos com coleta mínima, sigilo LGPD e testes apenas com exemplos fictícios.` | `Projetado pensando na LGPD: coleta mínima, respeito aos direitos dos titulares e testes apenas com dados sintéticos.` | 98 | 116 | +18,37% | n/a (clipboard) |
| l. 295 (cliente, categoria) | `Solução indicada: ${solution.shortTitle} · Alcance ${scopeLabel}${rescueTag}` | `Categoria do pedido: ${solution.shortTitle} · Alcance ${scopeLabel}${rescueTag}` | 76 | 79 | +3,95% | n/a (clipboard) |
| l. 298 (cliente, conferência) | `Conferência de qualidade: validada por 2+ profissionais independentes antes de ir ao ar, com suporte após a entrega.` | `Conferência de qualidade: revisada por 2+ pares independentes antes da entrega, com responsável de suporte pelo período combinado.` | 116 | 130 | +12,07% | n/a (clipboard) |
| l. 309 (dev, categoria) | `Frente: ${solution.shortTitle} · ${scopeLabel} · ${situationLabel}` | `Categoria do pedido: ${solution.shortTitle} · ${scopeLabel} · ${situationLabel}` | 66 | 79 | +19,70% | n/a (clipboard) |
| l. 310 (dev, estimativa) | `Nível da entrega: ${estimate.costLevelTitle} (Piso: ${estimate.costFloorLabel} → Teto: ${estimate.costCeilingLabel})` | `Estimativa indicativa: ${estimate.costLevelTitle} (Piso: ${estimate.costFloorLabel} → Teto: ${estimate.costCeilingLabel}; valores definidos no combinado)` | 116 | 153 | +31,90% | n/a (clipboard) |
| l. 312 (dev, extensões) | `Áreas Yuko: ${solution.extensions.join(' · ')}` | `Extensões Yuko: ${solution.extensions.join(' · ')}` | 46 | 50 | +8,70% | n/a (clipboard) |
| l. 314 (dev, padrões/revisão) | `Revisão por pares: obrigatória por 2+ desenvolvedores independentes antes da publicação.` | `Padrões e revisão: ficha (issue) obrigatória, linter, commits semânticos e revisão por 2+ pares independentes antes da liberação.` | 88 | 129 | +46,59% | n/a (clipboard) |
| l. 316 (dev, 5 dias úteis) | `Regra de 5 dias úteis: código e histórico ficam no espaço central; após 5 dias úteis sem resposta nem aviso, a vaga abre na ficha para continuidade sem perda.` | `Regra dos 5 dias úteis: envio (push) e transferência de contexto no repositório central; após 5 dias úteis sem resposta nem justificativa, registra-se vacância, os acessos são revogados e outro participante assume.` | 158 | 214 | +35,44% | n/a (clipboard) |
| l. 317 (dev, ressalva Manual) | `Manual v1.0: participação comunitária sem vínculo empregatício; condições comerciais e valores finais são combinados em contrato direto entre as partes.` | `Manual v1.0: participação sem vínculo empregatício nem responsabilidade solidária (cada participante responde por seus atos); condições e valores são definidos em acordo bilateral autônomo.` | 152 | 189 | +24,34% | n/a (clipboard) |
| l. 326 (empresa, categoria) | `Frente solicitada: ${solution.shortTitle} · ${scopeLabel} · ${situationLabel}` | `Categoria do pedido: ${solution.shortTitle} · ${scopeLabel} · ${situationLabel}` | 77 | 79 | +2,60% | n/a (clipboard) |
| l. 327 (empresa, estimativa) | `Nível de custo: ${estimate.costLevelTitle} (Piso: ${estimate.costFloorLabel} → Teto: ${estimate.costCeilingLabel}, sem valor fechado prévio)` | `Estimativa indicativa: ${estimate.costLevelTitle} (Piso: ${estimate.costFloorLabel} → Teto: ${estimate.costCeilingLabel}; valores definidos no combinado)` | 140 | 153 | +9,29% | n/a (clipboard) |
| l. 329 (empresa, extensões) | `Áreas Yuko: ${solution.extensions.join(' · ')}` | `Extensões Yuko: ${solution.extensions.join(' · ')}` | 46 | 50 | +8,70% | n/a (clipboard) |
| l. 331 (empresa, rede) | `Rede de entrega: 4+ membros (1 executor, 2+ revisores independentes e 1 responsável de suporte)` | `Rede do ciclo: executor, 2+ revisores independentes e responsável de suporte` | 95 | 76 | -20,00% | n/a (clipboard) |
| l. 333 (empresa, 5 dias úteis) | `Continuidade (regra de 5 dias úteis): código e histórico ficam no espaço central; após 5 dias úteis sem resposta nem aviso, outro profissional assume sem perda.` | `Continuidade (regra dos 5 dias úteis): envio (push) e transferência de contexto ficam no repositório central; após 5 dias úteis sem resposta nem justificativa, registra-se vacância, os acessos são revogados e outro participante assume.` | 160 | 235 | +46,88% | n/a (clipboard) |
| l. 334 (empresa, triagem/Manual) | `Ressalva Manual v1.0: participação comunitária sem vínculo empregatício; condições comerciais e valores finais são combinados apenas em contrato direto entre as partes após a escuta.` | `Triagem e Manual v1.0: após o envio, o pedido passa por triagem e pode ser recusado ou repriorizado com orientação (demandas desproporcionais não são atendidas). Chancela coletiva sem vínculo nem responsabilidade solidária (cada participante responde por seus atos); condições e valores são definidos em combinado direto e acordo bilateral autônomo.` | 182 | 349 | +91,76% | n/a (clipboard) |

---

## 4. Lacunas para `FORA-DE-ESCOPO.md` e relação com pendências `P1–P12`

### 4.1 Achados fora do escopo desta revisão
1. **Atributos `aria-label` e `title` em `src/components/YukoOrderSimulator.tsx`** (preservados sem edição conforme regra de escopo):
   - Linha 846: `aria-label="Escolha a categoria de serviço"` → recomenda-se ajustar em revisão de acessibilidade para `"Escolha a categoria de pedido"` (alinhamento a "6 categorias de pedido").
   - Linhas 948–949: `aria-label="Envolve dados de pessoas (LGPD)"` e `title="Ativar proteção LGPD para dados de pessoas"` → recomenda-se ajustar `title` para `"Ativar cuidados LGPD para dados de pessoas"` (evita sugerir proteção/blindagem automática).
   - Linhas 996 e 1007: `aria-label` do medidor (`Nível de custo: ...` / `Faixa do nível de custo ...`) → recomenda-se alinhar para `"Faixa indicativa: ..."` (P2).
2. **Subtítulo da seção `#simulador` em `src/pages/index.astro` (linha 177)** (fora da propriedade de arquivo de SA-2):
   - `"Veja prazo, faixa e gere sua ficha sem burocracia."` contém `"sem burocracia"` (termo a evitar) e não menciona as `"6 categorias de pedido"` nem a triagem após o envio.
3. **Lógica numérica interna de custo em `calculateEstimate` (`YukoOrderSimulator.tsx`) e `basePriceMin`/`basePriceMax` (`src/data/yuko.ts`)**:
   - Os valores em reais não são expostos ao usuário, mas os multiplicadores e níveis `Nível 1`–`Nível 4` seguem sem definição oficial no Manual v1.0 (P2).

### 4.2 Tratamento das pendências `P1–P12` no escopo de SA-2
- **P1 (Quem assina / responsabilidade):** explicitado `"chancela coletiva sem vínculo nem responsabilidade solidária"` e `"responsabilidade individual de cada par"` em `AUDIENCE_CARDS` e `buildHiddenOrderRecord`.
- **P2 (Preços / medidor Piso · Teto — prioridade máxima):** removida `"Sem taxas ocultas · "` na linha 1124 (trocada por `"Faixa indicativa · "`); mantido `"Piso · Nível N · Teto"` apenas como estimativa indicativa, com valores definidos no combinado / acordo bilateral autônomo.
- **P3 (Duração do suporte):** removidos `"suporte contínuo"` e `"garante continuidade/transição"` em `resgate-sistema` e `SIMULATOR_DEV_PROFILES.suporte`, substituídos por `"responsável de suporte pelo período combinado"`.
- **P4 (Titularidade de domínio/código):** removidas referências `"no seu domínio"` e `"domínio no seu nome"` em `site-presenca`.
- **P5 (Prazo de resposta e recusa):** adicionada menção à triagem com possibilidade de recusa ou repriorização com orientação (§8.1) em `AUDIENCE_CARDS[0]`, toasts e `buildHiddenOrderRecord`, sem prometer prazo de retorno.
- **P8 (Autoria e licença):** mantida `"troca aberta de guias"` na descrição de `AUDIENCE_CARDS[1]` sem prometer licença específica.
- **P9 (Canal Discord):** mantido Discord como canal único nos botões e na ficha.
- **P12 (`Rede 4+ pessoas` / `4+ membros`):** substituído por `'1 + 2 pares'` na linha 786 e `'Rede do ciclo: executor, 2+ revisores independentes e responsável de suporte'` na linha 331.
