# Yuko Institucional — Material You 3 Expressive Design System

Estrutura institucional da **Yuko** baseada integralmente no **Manual Institucional da Yuko — v1.0**, preservando a linguagem visual, layout e interatividade **Material You 3 Expressive** com alto contraste, acessibilidade por teclado e movimento reduzido.

## Arquitetura Multi-Página
- `index.html`: Visão geral institucional, Hero com ilustração SVG dinâmica responsiva ao tema, seção interativa **Experiência em Yukon (Canadá)** (`#yukon`) com 4 marcos lineares e 3 atmosferas, módulos assimétricos de entrada e seção comparativa para Microempresas vs. Desenvolvedores.
- `extensoes.html`: Pilares conceituais (Yukon, Oslo, Verona), diretrizes visuais, as 6 extensões (`Yuko Field`, `Yuko Dev`, `Yuko Make`, `Yuko Place`, `Yuko Work`, `Yuko Inline`), as 6 frentes de atuação, regras do servidor Discord e rodapé compacto (`.site-footer-compact`).
- `ciclo.html`: As 6 etapas do Ciclo de Entrega Assistida, triagem/priorização, papéis operacionais (Executor, 2+ Revisores, Suporte), transição compulsória, registro formal em issues e rodapé compacto.
- `governanca.html`: Simplicidade arquitetural, Definition of Done, linting, commits semânticos, diretrizes de stack e segurança (SQLi, XSS, `.env.example`, HTTPS/TLS, Argon2/bcrypt), LGPD (Lei nº 13.709/2018), resolução de conflitos em 3 etapas e rodapé compacto.
- `manual.html`: Quadro de controle do documento responsivo, instruções de consulta, ressalvas jurídicas, linhagem NYX → Expliance, gestão enxuta, glossário institucional pesquisável (com contagem de resultados e estado vazio) e rodapé compacto.

## Tokens, Acessibilidade & Assets
- **Identidade & Ícone**: `assets/favicon.svg` minimalista em alto contraste (`#231916` com 8 pétalas radiais em `#fef8ec`).
- **Temas Dinâmicos**: 4 sementes (`terracota`, `botanico`, `oceanico`, `ameixa`) × 2 polaridades (`light`, `dark`) validadas em `localStorage` e persistidas entre subpáginas.
- **Acessibilidade & Motion**: `.skip-link`, `.sr-only`, `:focus-visible` global, `scroll-margin-top: 96px`, navegação por teclado (`Escape`, `ArrowUp`/`ArrowDown`) e fechamento por `focusout` em `#splitMenu`, além de suporte a `[data-motion="calm"]` e `@media (prefers-reduced-motion: reduce)`.
