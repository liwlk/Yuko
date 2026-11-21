# Guia de termos — revisão textual Yuko

Fonte: Manual Institucional da Yuko v1.0 (seções citadas no briefing da revisão) e o conteúdo derivado do Manual já publicado em `/manual/` (glossário e controle do documento).

> Limitação: o PDF do Manual (Google Drive) não estava acessível no ambiente de execução, porque o plugin do Drive não está conectado. As referências de seção (§) seguem o briefing do responsável. O texto do Manual publicado em `/manual/` foi usado como fonte complementar.

## 1. Termos padronizados (usar sempre esta forma)

| Termo canônico | Explicação em linha na 1ª ocorrência da página | Evitar | Ref. |
|---|---|---|---|
| Comunidade técnica Yuko | — (a Yuko é uma comunidade, não uma empresa contratada) | "nossa empresa", "a Yuko garante" | §1.2 |
| Fase de implantação | "em implantação gradual" / "em fase de estruturação" | sugerir operação madura ou escala | §1.3 |
| Ciclo de Entrega Assistida | "6 etapas do Ciclo" (do pedido ao suporte) | "6 passos", "6 fases" soltos | — |
| Extensões da marca | "6 extensões" (Field, Dev, Make, Place, Work, Inline) | chamar extensões de "áreas de serviço" ou "categorias" | — |
| Frentes de atuação | "6 frentes internas" | confundir com extensões | — |
| Categorias de pedido | "6 categorias de pedido" (seletor "Direcione seu pedido") | "6 serviços", "6 etapas" | — |
| Revisão por pares | "revisão por 2+ pares (pelo menos dois desenvolvedores além de quem construiu)" | "4+ pessoas", "auditoria" | §8.4 |
| Combinado | "combinado (escopo escrito com critérios de aceitação)" | "contrato" (o Manual não é contrato) | — |
| Critérios de aceitação | "critérios de aceitação (condições para considerar a entrega pronta)" | "aceite garantido" | — |
| Homologação | "homologação (aprovação final pela microempresa)" | "aprovação automática" | — |
| Ambiente de testes | "ambiente de testes (staging), separado do sistema oficial" | "testado 100%" | — |
| Responsável de suporte | "responsável de suporte nomeado, pelo período combinado" | "suporte garantido", "suporte vitalício", "zero abandono" | P3 |
| Regra dos 5 dias úteis | "após 5 dias úteis sem resposta nem justificativa, registra-se a vacância, os acessos são revogados e outro participante assume" | "sem perda", "na hora", "imediatamente", "anti-abandono", "garantia contra abandono" | §7.4 |
| Transferência de contexto | "enviar (push) o código ao repositório central e registrar pendências antes de se afastar" | — | §7.4 |
| Ficha de acompanhamento | "ficha de acompanhamento (issue de registro, obrigatória)" | "ticket", "protocolo" | §9 |
| Histórico organizado | "commits semânticos (mensagens padronizadas de cada alteração)" | — | §10.3 |
| Padronização automática | "linter (verificação automática de padrão de código)" | — | §10.3 |
| Revisão de segurança | "revisão de segurança por 2+ pares e verificação de dependências (bibliotecas de terceiros)" | "proteção contra invasões", "blindagem", "à prova de ataques" | §8.4, §10.5 |
| Dados sintéticos | "dados sintéticos (fictícios ou mascarados) em testes" | — | §13.3 |
| LGPD | "projetado pensando na LGPD (Lei Geral de Proteção de Dados)" | "conformidade total", "100% LGPD", "garantia legal" | §13.3, §1.2 |
| Controladora / operador | "a microempresa é a controladora (decide sobre os dados); o desenvolvedor atua como operador (segue as instruções dela)" | — | §13.3 |
| Responsabilidade individual | "cada participante responde pelos próprios atos profissionais; não há vínculo empregatício nem societário" | "a Yuko responde por tudo" | §1.2, §13.4 |
| Chancela coletiva | "chancela coletiva (o método e as revisões são da comunidade; a responsabilidade é de cada participante)" | "garantia institucional" | §7.4 |
| Triagem de pedidos | "o pedido pode ser recusado ou repriorizado, com orientação" | "todo pedido é atendido" | §8.1 |
| Nível de custo (Piso · Teto) | "estimativa indicativa — valores definidos no combinado" | "sem taxas ocultas", preço fechado | P2 |

## 2. Palavras proibidas ou a reformular

"garantido/garantia" (como promessa), "zero", "100%", "total", "blindagem", "proteção contra", "sem perda", "anti-abandono", "imediatamente", "na hora", "sem taxas ocultas", "sem burocracia" (prefira "sem etapas desnecessárias" ou corte), "nunca/sempre" como promessa ao cliente (permitido só para descrever regra interna: "a regra proíbe...").

## 3. Estilo

- PT-BR, frases curtas, voz ativa, sujeito claro ("a comunidade", "o desenvolvedor executor", "a microempresa").
- Explicar o termo técnico na 1ª ocorrência **por página**, entre parênteses, sem criar elementos novos.
- Não inventar fatos de negócio (preço, duração do suporte, quem assina, remuneração, titularidade, canal de contato) — ver `PENDENCIAS.md`.
- Não citar a linhagem NYX/Expliance fora de `/manual/` (P11).
- Respeitar limites: títulos/rótulos/métricas/itens/cards ≤ +15% de caracteres; parágrafos ≤ +25%.
