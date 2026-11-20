# Yuko Institucional — Material You 3 Expressive Design System (v2.0)

Sistema de design e arquitetura frontend da **Yuko** baseado integralmente no **Manual Institucional da Yuko — v1.0**, evoluído para **Node.js + Astro + React 19 + TypeScript + Tailwind CSS v4 + Motion + GSAP (`ScrollTrigger`) + Lenis + ESLint**, preservando alto contraste, acessibilidade por teclado e suporte completo a movimento reduzido.

## Arquitetura Multi-Rota (`trailingSlash: true`)

- **`/` (`src/pages/index.astro`)**: Visão geral institucional, Hero com ilustração vetorial responsiva ao tema e coreografia 60fps, **Experiência em Yukon (Canadá)** (`#yukon`) em scrollytelling sticky com 4 capítulos e 3 atmosferas, módulos assimétricos de entrada e seção comparativa Microempresas vs. Desenvolvedores.
- **`/extensoes/` (`src/pages/extensoes.astro`)**: Painel unificado de identidade conceitual (Yukon, Oslo, Verona) e diretrizes visuais, grade das 6 extensões (`Yuko Field`, `Yuko Dev`, `Yuko Make`, `Yuko Place`, `Yuko Work`, `Yuko Inline`), painel estruturado das 6 frentes de atuação, painel tonal do servidor Discord e rodapé compacto (`footerVariant="compact"`).
- **`/ciclo/` (`src/pages/ciclo.astro`)**: As 6 etapas do Ciclo de Entrega Assistida, critérios de triagem/priorização, papéis operacionais (Executor, 2+ Revisores, Responsável de Suporte), regras de continuidade (transição compulsória e abandono em 5 dias úteis), os 6 elementos mínimos do registro formal em issue e rodapé compacto.
- **`/governanca/` (`src/pages/governanca.astro`)**: Bloco 01 com Checklist de Entrega (DoD), Stack & Commits Semânticos e Blindagem/Segredos/Auditoria (SQLi, XSS, `.env.example`, HTTPS/TLS, Argon2/bcrypt); Bloco 02 com Privacidade LGPD (Lei nº 13.709/2018) e Mediação de Conflitos em 3 etapas; rodapé compacto.
- **`/manual/` (`src/pages/manual.astro`)**: Quadro de controle responsivo (`<table class="control-table">` com `<caption class="sr-only">` e `<th scope="row">`), ressalvas jurídicas, linhagem `NYX → Expliance → Yuko`, implantação gradual/gestão enxuta, guia rápido de navegação, ilhas React (`<GlossaryExplorer client:load />`) para filtragem acessível em tempo real e rodapé compacto.

## Stack Tecnológica & Camada de Dados

- **Fonte Única de Conteúdo (`src/data/yuko.ts`)**: Todos os textos normativos, listas, tabelas e termos do glossário são exportados com tipagem TypeScript estrita (`IDENTITY_PILLARS`, `VISUAL_RULES`, `EXTENSIONS`, `FRONTS`, `DISCORD_CHANNELS`, `CYCLE_STAGES`, `TRIAGE_CRITERIA`, `ROLES`, `CONTINUITY_RULES`, `REGISTRY_COL_A`, `REGISTRY_COL_B`, `DOD_ITEMS`, `STACK_ITEMS`, `SECURITY_CARDS`, `LGPD_ITEMS`, `CONFLICT_STEPS`, `CONTROL_TABLE`, `MANUAL_ORIGINS`, `GLOSSARY_TERMS`).
- **Layout Compartilhado (`src/layouts/BaseLayout.astro`)**: Encapsula `<head>`, script anti-FOUC para `data-seed`, `data-mode` e `data-motion`, `.skip-link`, Top App Bar em cápsula flutuante, navegação mobile horizontal, transições de visualização (`@view-transition { navigation: auto; }`) e variantes de rodapé (`full` e `compact`).
- **Tailwind CSS v4 + Tokens M3 Expressive**: `@tailwindcss/vite` coexiste com variáveis semânticas `--md-primary`, `--md-secondary`, `--md-tertiary`, `--md-surface-*`, `--md-on-*`, `--md-outline-*` e escalas de arredondamento (`--shape-sm` a `--shape-2xl`, `--shape-pill`).

## Motion, Scrollytelling & Smooth Scroll

- **Lenis + GSAP (`ScrollTrigger`)**: Rolagem suave gerenciada pelo Lenis e conectada ao `ScrollTrigger` para acionar progressão contínua da cena Yukon (`--yukon-progress` de `0` a `1`), anel circular `#yukonRingFill`, indicador `#yukonStepBadge` (`01 / 04`–`04 / 04`) e alternância automática de atmosferas (`alvorada`, `travessia`, `boreal`) com respeito a travamento manual (`[data-yukon-mood]`).
- **Motion (`motion/react`)**: Aplicado nas ilhas React (`GlossaryExplorer` e controles interativos) com curvas spring expressivas (`--ease-spring`) e fallback imediato quando `[data-motion="calm"]` ou `@media (prefers-reduced-motion: reduce)` estiver ativo.
- **MPA View Transitions**: Transições fluidas entre rotas mantendo a barra superior (`view-transition-name: yuko-topbar`) e o logotipo (`yuko-logo`) estáveis enquanto `main` (`yuko-stage`) transiciona.

## Temas Dinâmicos, Acessibilidade & Qualidade

- **4 Sementes × 2 Polaridades**: `terracota` (Terracota Solar), `botanico` (Botânico Vivo), `oceanico` (Índigo Oceânico) e `ameixa` (Ameixa Editorial) em modos `light` e `dark`, persistidos em `localStorage` (`yuko_seed`, `yuko_mode`, `yuko_motion`) com atualização imediata de `aria-pressed` e notificações via toast (`role="status"`, `aria-live="polite"`).
- **Acessibilidade**: `.skip-link`, `.sr-only`, `:focus-visible` global, `scroll-margin-top: 96px`, `<th scope="row">` e `<caption>` semânticos, listas `.clean-list` com `<span>` interno preservando o grid `auto 1fr`, e regiões `aria-live="polite"` para busca do glossário.
- **Qualidade & Deploy**: Validação contínua com `eslint .` (`eslint.config.mjs`), `tsc --noEmit` e `astro build` gerando artefatos estáticos compatíveis com GitHub + Vercel (`cleanUrls: true`, `trailingSlash: true`).
