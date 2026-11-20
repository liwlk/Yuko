# Cadência — Material You 3 Expressive Design System

Este documento estrutura os tokens, papéis de cor, formas expressivas, tipografia e física de movimento da landing page **Cadência**, inspirada no **Material 3 Expressive** (Google).

## 1. Filosofia Visual (Material 3 Expressive)
- **Tonalidade em vez de sombras pesadas**: hierarquia construída por níveis de superfície (`surface-container-lowest` até `surface-container-highest`), mantendo o contraste WCAG AA/AAA em modos claro e escuro.
- **Contraste de formas**: alternância intencional entre pílulas (`9999px`), arcos (`border-radius: 999px 999px 28px 28px`), cartões `extra-large` (`32px`) e silhuetas orgânicas recortadas (flor de 12 pétalas, trevo de 4 folhas, explosão suave).
- **Morfismo tátil**: botões e controles mudam de raio ao serem pressionados ou selecionados (`pill` → `squircle 16px`), comunicando resposta física imediata.
- **Movimento com mola (Spring Physics)**: transições rápidas e expressivas com leve overshoot (`cubic-bezier(0.34, 1.56, 0.64, 1)`).

## 2. Sementes de Cor Dinâmica (4 Temas × Claro/Escuro)
1. **Terracota Solar** (`#B33B15`) — Padrão editorial quente, orgânico e humano.
2. **Botânico Vivo** (`#2E6A44`) — Verde musgo profundo com acentos em ocre solar.
3. **Índigo Oceânico** (`#1F5696`) — Azul mineral de alta legibilidade com coral suave.
4. **Ameixa Editorial** (`#7E3C66`) — Tom vinho/ameixa combinado com âmbar acolhedor.

### Papéis de Cor por Tema
- `primary`, `on-primary`, `primary-container`, `on-primary-container`
- `secondary`, `on-secondary`, `secondary-container`, `on-secondary-container`
- `tertiary`, `on-tertiary`, `tertiary-container`, `on-tertiary-container`
- `surface`, `surface-container-lowest`, `surface-container-low`, `surface-container`, `surface-container-high`, `surface-container-highest`
- `on-surface`, `on-surface-variant`, `outline`, `outline-variant`

## 3. Escala Tipográfica Expressiva
- **Display Large**: `clamp(2.5rem, 5vw, 4.25rem)`, peso `800`, `letter-spacing: -0.035em`, `line-height: 1.04`
- **Headline Medium**: `clamp(1.75rem, 3vw, 2.5rem)`, peso `750`, `letter-spacing: -0.025em`, `line-height: 1.15`
- **Title Large**: `1.25rem`, peso `700`, `letter-spacing: -0.015em`
- **Body Large**: `1.0625rem`, peso `450`, `line-height: 1.6`
- **Label Large**: `0.875rem`, peso `650`, `letter-spacing: 0.01em`

## 4. Arquitetura da Landing Page (Frames para Figma)
1. **Top App Bar Flutuante (Capsule Header)**: marca, navegação em pílula, seletor rápido de semente de cor, alternador Claro/Escuro e Split CTA.
2. **Hero Assimétrico**: proposta de valor à esquerda com Split Button e CTA tonal; player interativo "Estúdio Vivo" à direita com emblema floral rotativo, seletor de humor em chips e slider tátil.
3. **Seção de Recursos (Formas que Comunicam Estado)**: 3 módulos com silhuetas distintas (Arco, Cartão Extra-Large, Container Tonal Aninhado).
4. **Playground Interativo M3 Expressive**: laboratório ao vivo de Sementes de Cor, Escala Tonal de Superfícies, Física de Movimento e Morfismo de Botões.
5. **Planos (Connected Button Group)**: alternância Mensal/Anual conectada + 2 cartões contrastantes.
6. **CTA Final & Rodapé Expandido Temático**: fechamento em `tertiary-container` seguido de rodapé em folha arredondada (`surface-container-high`, `48px` topo) com duas colunas de navegação e bloco monumental exibindo o nome de referência **CADÊNCIA** em tipografia expandida e tokens temáticos.
