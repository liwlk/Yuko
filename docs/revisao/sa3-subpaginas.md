# SA-3 — Revisão Textual das Subpáginas (`/extensoes/`, `/ciclo/`, `/governanca/`)

**Responsável:** SA-3 Subpáginas  
**Referências:** Manual Institucional da Yuko v1.0, [`guia-de-termos.md`](file:///home/antigravity/yuko-app/docs/revisao/guia-de-termos.md) e [`PENDENCIAS.md`](file:///home/antigravity/yuko-app/PENDENCIAS.md).

## 1. Escopo e propriedade de arquivos

- **Editados diretamente (apenas corpo abaixo de `<BaseLayout ...>`):**
  - [`src/pages/extensoes.astro`](file:///home/antigravity/yuko-app/src/pages/extensoes.astro)
  - [`src/pages/ciclo.astro`](file:///home/antigravity/yuko-app/src/pages/ciclo.astro)
  - [`src/pages/governanca.astro`](file:///home/antigravity/yuko-app/src/pages/governanca.astro)
- **Preservados intactos (sem edição nesta etapa):**
  - Props `<BaseLayout title=... description=... nextLabel=...>` das três páginas (escopo de SA-4 / Fase 2 — ver seção 4).
  - [`src/data/yuko.ts`](file:///home/antigravity/yuko-app/src/data/yuko.ts) (alterações propostas abaixo para aplicação na Fase 2).
  - [`src/pages/manual.astro`](file:///home/antigravity/yuko-app/src/pages/manual.astro) e constantes `CONTROL_TABLE`, `MANUAL_ORIGINS`, `GLOSSARY_TERMS`.

---

## 2. Tabela completa de alterações (`Antes | Depois | Car. orig | Car. novo | Delta % | Limite`)

### 2.1 Alterações aplicadas diretamente nas páginas `.astro`

| Arquivo / Elemento | Antes | Depois | Car. orig | Car. novo | Delta % | Limite |
|---|---|---|---:|---:|---:|---:|
| `extensoes.astro:33` (`p.hero-lead`) | Nossos valores visuais, seis áreas práticas de atuação, seis frentes de trabalho e o ponto de encontro da comunidade no Discord. | Identidade da marca, 6 extensões da Yuko, 6 frentes internas e nosso ponto de encontro no Discord, em implantação gradual. | 128 | 122 | -4,7% | +25% |
| `extensoes.astro:78` (`.section-kicker`) | Áreas da Marca | Extensões Yuko | 14 | 14 | 0,0% | +15% |
| `extensoes.astro:79` (`h2.section-title`) | Seis extensões sob o nome Yuko | 6 extensões sob a marca Yuko | 30 | 28 | -6,7% | +15% |
| `extensoes.astro:81` (`p.section-desc`) | Cada extensão identifica uma parte prática do nosso trabalho — da conversa com a empresa às automações. | As 6 extensões identificam áreas sob a marca Yuko — em implantação gradual, sem exigir equipe permanente. | 103 | 105 | +1,9% | +25% |
| `extensoes.astro:103` (`.section-kicker`) | Frentes de Atuação | 6 Frentes Internas | 18 | 18 | 0,0% | +15% |
| `extensoes.astro:104` (`h2.section-title`) | Seis frentes integradas de trabalho | Seis frentes internas de atuação | 35 | 32 | -8,6% | +15% |
| `extensoes.astro:106` (`p.section-desc`) | Enquanto as extensões dão nome às áreas visíveis ao público, as frentes organizam as disciplinas internas aplicadas em cada projeto. | Diferente das 6 extensões sob a marca Yuko, as 6 frentes internas organizam as disciplinas aplicadas conforme cada projeto. | 132 | 123 | -6,8% | +25% |
| `ciclo.astro:31` (`p.hero-lead`) | Combinado claro, conferência por 2+ desenvolvedores, testes antes de ir ao ar e suporte garantido em seis etapas contínuas. | Combinado claro, revisão por 2+ pares, testes antes da entrega e responsável de suporte nomeado pelo período combinado nas 6 etapas do Ciclo. | 123 | 141 | +14,6% | +25% |
| `ciclo.astro:45` (`.section-kicker`) | Passo a Passo | Fluxo do Ciclo | 13 | 14 | +7,7% | +15% |
| `ciclo.astro:46` (`h2.section-title`) | Seis etapas do primeiro contato à entrega | 6 etapas do Ciclo, do pedido ao suporte | 41 | 39 | -4,9% | +15% |
| `ciclo.astro:92` (`h2#papeis`) | Papéis funcionais e garantia contra abandono | Papéis funcionais e regra de continuidade | 44 | 41 | -6,8% | +15% |
| `ciclo.astro:137` (`p.section-desc`) | É proibido assumir projetos com o nome da Yuko apenas por conversa informal; toda iniciativa precisa de uma ficha oficial de acompanhamento. | É proibido assumir projetos com o nome da Yuko apenas por conversa informal; toda iniciativa precisa de uma ficha oficial de acompanhamento (issue de registro). | 140 | 160 | +14,3% | +25% |
| `governanca.astro:28` (`p.hero-lead`) | Lista rigorosa de conferência antes da entrega, tecnologias confiáveis, proteção contra invasões, respeito à LGPD e diálogo para resolver impasses. | Conferência antes da entrega, tecnologias conhecidas, revisão de segurança por 2+ pares e verificação de dependências, respeito à LGPD e mediação de impasses. | 147 | 158 | +7,5% | +25% |
| `governanca.astro:45` (`p.section-desc`) | Sistemas do tamanho certo para a microempresa, com código limpo, tecnologias conhecidas e proteção desde o início. | Sistemas do tamanho certo para a microempresa, com código limpo, tecnologias conhecidas e boas práticas de segurança desde o início. | 114 | 132 | +15,8% | +25% |
| `governanca.astro:106` (`h3`) | Respeito à Lei de Dados (LGPD) | Estrutura pensada para a LGPD | 30 | 29 | -3,3% | +15% |

> **Verificados sem alteração em `.astro`:**
> - `extensoes.astro`: demais títulos, botões (`6 Extensões`, `Valores`, `6 Frentes`, `Discord`) e seção `#discord` estão alinhados ao Manual e sem absolutos.
> - `ciclo.astro`: demais títulos, botões e links estão alinhados.
> - `governanca.astro`: `h1` (`Qualidade, Segurança & Proteção de Dados`, onde "Proteção de Dados" refere-se ao nome da LGPD), subtítulos (`Critério de Pronto`, `Tecnologias & Histórico Organizado`, `Privacidade (LGPD) & Mediação`, `Mediação de Conflitos em 3 Passos`) e `card-code` estão conformes.

---

### 2.2 Alterações propostas para `src/data/yuko.ts` (linhas 301–658 — Fase 2)

#### A) `/extensoes/` (`IDENTITY_PILLARS`, `VISUAL_RULES`, `EXTENSIONS`, `FRONTS`, `DISCORD_CHANNELS`)

| Constante / Chave | Antes | Depois | Car. orig | Car. novo | Delta % | Limite |
|---|---|---|---:|---:|---:|---:|
| `EXTENSIONS[1].description` (`Yuko Dev`) | Construção do sistema, organização técnica, trabalho em dupla e integração entre ferramentas. | Construção do sistema, organização técnica, revisão entre pares e integração entre ferramentas. | 93 | 95 | +2,2% | +15% |
| `EXTENSIONS[3].description` (`Yuko Place`) | Ponto de encontro da comunidade para eventos, acolhimento de novos membros e materiais compartilhados. | Espaço da comunidade para acolhimento, troca técnica e materiais compartilhados, em evolução gradual. | 102 | 101 | -1,0% | +15% |
| `EXTENSIONS[5].description` (`Yuko Inline`) | Automações internas e ferramentas de apoio que facilitam o trabalho diário da comunidade. | Automações internas e scripts de apoio, em evolução gradual, para os projetos da comunidade. | 89 | 92 | +3,4% | +15% |
| `FRONTS[1].description` (`Tecnologia e Desenvolvimento`) | Escrita do sistema, escolha cuidadosa de tecnologias conhecidas e confiáveis, automações e publicação segura. | Escrita do sistema, escolha cuidadosa de tecnologias conhecidas e confiáveis, automações e publicação revisada. | 109 | 111 | +1,8% | +15% |
| `FRONTS[3].description` (`Gestão e Colaboração Multidisciplinar`) | Sintonia entre quem programa, quem cuida da facilidade de uso, servidores e suporte contínuo. | Sintonia entre quem programa, quem cuida das telas, infraestrutura e suporte combinado. | 93 | 87 | -6,5% | +15% |

> **Verificados sem alteração em `/extensoes/` (`yuko.ts`):**
> - `IDENTITY_PILLARS` (l. 305–321): sem menção a NYX/Expliance (conforme P11) e sem contradições.
> - `VISUAL_RULES` (l. 323–339): `Alto Contraste & Clareza` mantida conforme diretriz do Manual (§4.2).
> - `EXTENSIONS[0]` (`Yuko Field`), `EXTENSIONS[2]` (`Yuko Make`), `EXTENSIONS[4]` (`Yuko Work`), `FRONTS[0, 2, 4, 5]` e `DISCORD_CHANNELS`: fiéis ao Manual e sem absolutos.

#### B) `/ciclo/` (`CYCLE_STAGES`, `TRIAGE_CRITERIA`, `ROLES`, `CONTINUITY_RULES`, `REGISTRY_COL_A/B`)

| Constante / Chave | Antes | Depois | Car. orig | Car. novo | Delta % | Limite |
|---|---|---|---:|---:|---:|---:|
| `CYCLE_STAGES[0].description` (`1. Pedido & Prioridade`) | O pedido chega pela conversa com a área Yuko Field ou contato direto. Avaliamos se atende bem ao negócio e se há equipe disponível. | O pedido entra via Yuko Field ou contato direto. Pedidos desproporcionais não são atendidos; podem ser recusados ou repriorizados, com orientação. | 131 | 146 | +11,5% | +15% |
| `CYCLE_STAGES[1].description` (`2. Combinado & Escopo`) | Quem vai executar transforma o pedido em um combinado enxuto, com regras claras para a empresa aprovar a entrega. | O executor registra um combinado (escopo escrito) com critérios de aceitação (condições para considerar a entrega pronta). | 113 | 122 | +8,0% | +15% |
| `CYCLE_STAGES[2].description` (`3. Construção Organizada`) | O sistema é construído em espaço central, com histórico organizado de alterações e anotações simples para outros membros acompanharem. | Código em repositório central com ficha de acompanhamento (issue de registro), linter (padrão automático) e commits semânticos (mensagens padronizadas). | 134 | 152 | +13,4% | +15% |
| `CYCLE_STAGES[4].description` (`5. Testes antes do Ar`) | Testamos funcionamento, uso no celular, velocidade e integridade em um ambiente de testes separado antes de liberar para a empresa. | Testamos funcionamento, celular e velocidade em ambiente de testes (staging), com dados sintéticos (fictícios), antes da liberação. | 131 | 131 | 0,0% | +15% |
| `CYCLE_STAGES[5].description` (`6. Entrega & Suporte`) | Aprovação final junto à microempresa e início do período de suporte com um responsável técnico registrado. | Homologação (aprovação final pela microempresa) e início do suporte por responsável nomeado, pelo período combinado. | 106 | 116 | +9,4% | +15% |
| `ROLES[2].description` (`Responsável de Suporte`) | Acompanha a estabilização após o lançamento, corrige ajustes imediatos e cuida do sistema no período combinado. | Profissional nomeado na entrega para acompanhar a estabilização, fazer ajustes iniciais e apoiar no período combinado. | 111 | 118 | +6,3% | +15% |
| `CONTINUITY_RULES[0].description` (`Transição Obrigatória de Contexto`) | Antes de se afastar, o participante envia todo o código para o espaço central e registra tarefas, decisões e pendências. É proibido reter código ou senhas apenas no computador pessoal. | Na transferência de contexto antes de se afastar, o participante faz o envio (push) do código ao repositório central e registra pendências. É proibido reter código ou senhas apenas no computador pessoal. | 184 | 203 | +10,3% | +15% |
| `CONTINUITY_RULES[1].title` | Abandono (5 dias úteis) & Proteção | Regra de Vacância (5 dias úteis) | 34 | 32 | -5,9% | +15% |
| `CONTINUITY_RULES[1].description` | Após 5 dias úteis sem resposta nem justificativa, registra-se a vaga aberta na ficha de acompanhamento, os acessos são bloqueados e outro par assume imediatamente para proteger a microempresa. | Após 5 dias úteis sem resposta nem justificativa, registra-se a vacância na ficha de acompanhamento, os acessos são revogados e outro par assume a continuidade. | 192 | 160 | -16,7% | +15% |
| `REGISTRY_COL_A[0]` | Código único do pedido na ficha oficial de acompanhamento; | Código do pedido na ficha de acompanhamento (issue de registro); | 58 | 64 | +10,3% | +15% |
| `REGISTRY_COL_A[1]` | O que foi combinado entregar e critérios de aprovação validados; | O que foi combinado e critérios de aceitação validados; | 64 | 55 | -14,1% | +15% |
| `REGISTRY_COL_B[0]` | Nome completo do responsável pelo suporte após a entrega; | Responsável de suporte nomeado e período combinado; | 57 | 51 | -10,5% | +15% |
| `REGISTRY_COL_B[1]` | Aprovações registradas na conferência por 2+ pares; | Aprovações registradas na revisão por 2+ pares; | 51 | 47 | -7,8% | +15% |
| `REGISTRY_COL_B[2]` | Datas, endereço do código e guia de transição. | Datas, repositório central e guia de transição. | 46 | 47 | +2,2% | +15% |

> **Verificados sem alteração em `/ciclo/` (`yuko.ts`):**
> - `CYCLE_STAGES[3]` (`4. Conferência por 2+ Pares`), `TRIAGE_CRITERIA`, `ROLES[0, 1]` e `REGISTRY_COL_A[2]` estão fiéis ao Manual.

#### C) `/governanca/` (`DOD_ITEMS`, `STACK_ITEMS`, `SECURITY_CARDS`, `LGPD_ITEMS`, `CONFLICT_STEPS`, `CONFLICT_PRINCIPLE`)

| Constante / Chave | Antes | Depois | Car. orig | Car. novo | Delta % | Limite |
|---|---|---|---:|---:|---:|---:|
| `DOD_ITEMS[0]` | Combinado inicial testado e funcionando na prática; | Combinado testado com dados sintéticos (fictícios); | 51 | 51 | 0,0% | +15% |
| `DOD_ITEMS[1]` | Histórico organizado de alterações salvo no espaço central; | Commits semânticos (histórico claro) no repositório; | 59 | 52 | -11,9% | +15% |
| `DOD_ITEMS[2]` | Conferência por 2+ pares devidamente registrada; | Revisão por 2+ pares na ficha (issue de registro); | 48 | 50 | +4,2% | +15% |
| `DOD_ITEMS[4]` | Sem falhas graves ou riscos de segurança abertos. | Sem falhas graves conhecidas de segurança em aberto. | 49 | 52 | +6,1% | +15% |
| `STACK_ITEMS[0].description` (`Padronização de Código`) | regras automáticas de limpeza e organização salvas junto ao projeto. | uso de linter (padronização automática de código) salvo junto ao projeto. | 68 | 73 | +7,4% | +15% |
| `STACK_ITEMS[1].description` (`Histórico Organizado`) | cada alteração (novidade, correção, ajuste ou guia) fica marcada e ligada à ficha do projeto. | commits semânticos (mensagens padronizadas por tipo de mudança) ligados à ficha do projeto. | 93 | 91 | -2,2% | +15% |
| `STACK_ITEMS[3].description` (`Bancos de Dados Estáveis`) | PostgreSQL, MySQL/MariaDB ou SQLite para guardar dados com segurança. | PostgreSQL, MySQL/MariaDB ou SQLite para guardar dados com integridade. | 69 | 71 | +2,9% | +15% |
| `SECURITY_CARDS[0].title` | Prevenção de Invasões | Validação de Entradas | 21 | 21 | 0,0% | +15% |
| `SECURITY_CARDS[0].description` | Protegemos formulários contra invasões, comandos e códigos maliciosos. | Revisão de segurança contra falhas comuns de entrada em formulários e rotas. | 70 | 76 | +8,6% | +15% |
| `SECURITY_CARDS[0].code` | proteção ativa | revisão 2+ pares | 14 | 16 | +14,3% | +15% |
| `SECURITY_CARDS[1].description` | Senhas e chaves nunca ficam no código público; conexões sempre criptografadas (HTTPS) e senhas protegidas (Argon2 ou bcrypt). | Segredos fora do código-fonte, tráfego sob HTTPS (conexão cifrada) e hash de senhas (Argon2 ou bcrypt) no banco de dados. | 125 | 121 | -3,2% | +15% |
| `SECURITY_CARDS[1].code` | https & senhas seguras | https & hash de senhas | 22 | 22 | 0,0% | +15% |
| `SECURITY_CARDS[2].description` | Verificação contínua das ferramentas usadas, controle responsável de acessos e sigilo sobre os dados da microempresa. | Verificação de dependências (bibliotecas de terceiros), controle de acessos por papel e sigilo sobre dados da empresa. | 117 | 118 | +0,9% | +15% |
| `SECURITY_CARDS[2].code` | auditoria contínua | checagem de pacotes | 18 | 19 | +5,6% | +15% |
| `LGPD_ITEMS[0].description` (`Quem responde pelo quê`) | Sua microempresa atua como Controladora (dona das decisões sobre os dados) e os desenvolvedores atuam como Operadores técnicos (seguem suas instruções). | A microempresa é a Controladora (decide sobre os dados); o desenvolvedor atua como Operador (segue instruções dela). Não substitui assessoria jurídica. | 152 | 151 | -0,7% | +15% |
| `LGPD_ITEMS[1].description` (`Só o essencial`) | coleta mínima de informações, apenas o estritamente necessário para o sistema funcionar. | sistema estruturado pensando na LGPD, com coleta mínima — apenas dados necessários ao funcionamento. | 88 | 100 | +13,6% | +15% |
| `LGPD_ITEMS[2].description` (`Testes sem dados reais`) | durante a criação e os testes, usamos apenas dados fictícios ou mascarados — nunca dados reais de clientes. | na criação e nos testes usamos dados sintéticos (fictícios ou mascarados), sem expor dados reais de clientes. | 107 | 109 | +1,9% | +15% |
| `LGPD_ITEMS[3].title` | Direitos & Avisos Rápidos | Titular & Incidentes | 25 | 20 | -20,0% | +15% |
| `LGPD_ITEMS[3].description` | facilidade para a pessoa dona dos dados (titular) pedir cópia ou exclusão, e aviso rápido à empresa em caso de problema, registrado de forma restrita. | recursos para o titular (dono dos dados) pedir acesso ou exclusão, e comunicação à empresa em caso de incidente, com registro restrito. | 150 | 135 | -10,0% | +15% |
| `CONFLICT_PRINCIPLE.description` (`Autonomia`) | cada participante responde pelos seus próprios atos profissionais. | cada participante responde pelos próprios atos profissionais, sem vínculo. | 66 | 74 | +12,1% | +15% |

> **Verificados sem alteração em `/governanca/` (`yuko.ts`):**
> - `DOD_ITEMS[3]`, `STACK_ITEMS[2]` (`Tecnologias Conhecidas`), `SECURITY_CARDS[1].title`, `SECURITY_CARDS[2].title`, `CONFLICT_STEPS[0..2]` e `CONFLICT_PRINCIPLE.title`.

---

## 3. Notas para `FORA-DE-ESCOPO.md`

Itens identificados nas subpáginas fora da propriedade direta de SA-3 (para registro em [`FORA-DE-ESCOPO.md`](file:///home/antigravity/yuko-app/docs/revisao/FORA-DE-ESCOPO.md) / atuação de SA-4 na Fase 2):

1. **Props `<BaseLayout description=...>` das três subpáginas (SA-4 / Fase 2):**
   - `src/pages/extensoes.astro:20`: `description` usa `"as 6 áreas de atuação (Field, Dev, Make, Place, Work, Inline), 6 frentes de trabalho"` — ajustar para `"6 extensões da marca (Field, Dev, Make, Place, Work, Inline), 6 frentes internas"`.
   - `src/pages/ciclo.astro:18`: `description` usa `"Os 6 passos do Ciclo de Entrega Assistida"` e `"regra de continuidade contra abandono"` — ajustar para `"As 6 etapas do Ciclo de Entrega Assistida, papéis, regra de vacância em 5 dias úteis e ficha de acompanhamento (issue de registro) na Yuko."`
   - `src/pages/governanca.astro:15`: `description` contém `"proteção contra invasões"` — ajustar para `"Critério de pronto antes da entrega, tecnologias conhecidas, revisão de segurança por 2+ pares, cuidados para a LGPD (Lei nº 13.709/2018) e mediação de conflitos na Yuko."`
2. **Footer compartilhado (`BaseLayout` / `Footer.astro`):** o `defaultSummary` nas subpáginas exibe `"Comunidade brasileira que conecta desenvolvedores e microempresas para criar sistemas confiáveis e com suporte contínuo."` — remover `"suporte contínuo"` para alinhar com P3 (`"responsável de suporte nomeado pelo período combinado"`).
3. **Links internos em `ciclo.astro` (`nextLabel`) e `extensoes.astro`:** `nextLabel` (`"Avançar para Ciclo & Papéis →"`, `"Avançar para Qualidade & LGPD →"`, `"Ler Manual Completo v1.0 →"`) está coerente, sem absolutos.

---

## 4. Notas para `PENDENCIAS.md`

As redações aplicadas e propostas respeitam todas as pendências vigentes em [`PENDENCIAS.md`](file:///home/antigravity/yuko-app/PENDENCIAS.md), sem necessidade de abrir novos IDs:

- **P1 (Quem assina / vínculo):** `CONFLICT_PRINCIPLE` explicita responsabilidade individual pelos próprios atos profissionais, sem vínculo.
- **P3 (Duração/escopo do suporte):** removido `"suporte garantido"`, `"suporte contínuo"` (`FRONTS[3]`) e `"ajustes imediatos"` (`ROLES[2]`), substituídos por `"responsável de suporte nomeado, pelo período combinado"`.
- **P5 (Triagem e recusa):** `CYCLE_STAGES[0]` explicita que pedidos desproporcionais não são atendidos e podem ser recusados ou repriorizados, com orientação (§8.1, §10.1), sem prometer prazo fixo de resposta.
- **P11 (NYX/Expliance):** nenhuma menção fora de `/manual/`; `IDENTITY_PILLARS` preservado apenas com Yukon, Oslo e Verona.
- **P12 (`2+ revisores`):** todas as referências mantêm `2+ pares` / `2+ revisores`.
- **§1.2 / LGPD:** adicionado em `LGPD_ITEMS[0]` aviso expresso de que **não substitui assessoria jurídica**, e reforçado em `LGPD_ITEMS[1]` que o sistema é **estruturado pensando na LGPD**.
