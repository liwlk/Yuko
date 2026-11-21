# Yuko — Site Institucional (v2.0 · Astro + React 19 + Motion)

Site institucional da **Yuko**, estruturado integralmente a partir do **Manual Institucional da Yuko — v1.0** e desenvolvido sobre uma arquitetura estática moderna inspirada no **Material You 3 Expressive**.

## Stack & Arquitetura

- **Runtime & Build**: Node.js + **Astro** (`output: 'static'`, `build.format: 'directory'`)
- **Ilhas Interativas**: **React 19** (`@astrojs/react`) + **TypeScript** (modo estrito com `@/*` mapeado para `src/*`)
- **Estilização**: **Tailwind CSS v4** (`@tailwindcss/vite`) integrado ao sistema de design tokens Material You 3 Expressive
- **Motion & Scroll**:
  - **Motion** (`motion/react`) para microinterações táteis e transições baseadas em física de mola
  - **GSAP (`ScrollTrigger`)** para coreografia do Hero SVG e progressão interativa (`--stage-progress`) do palco **Respaldo na Prática** (`#continuidade`)
  - **Lenis** para rolagem suave sincronizada com `ScrollTrigger` e respeitando `prefers-reduced-motion` e `[data-motion="calm"]`
- **Qualidade de Código**: **ESLint** (`eslint.config.mjs` com `typescript-eslint`) e verificação de tipos via `tsc --noEmit`
- **Deploy**: Configurado para **GitHub** e **Vercel** (`vercel.json` com `cleanUrls: true` e `trailingSlash: true`)

## Rotas e Estrutura do Projeto

```text
yuko-app/
├── public/
│   └── assets/
│       ├── favicon.svg              # Ícone vetorial em alto contraste
│       └── yuko-logo.jpg            # Logotipo oficial da Yuko
├── src/
│   ├── components/
│   │   ├── Footer.astro             # Rodapé nas variantes monument e compact
│   │   ├── GlossaryExplorer.tsx     # Ilha React (Motion) para busca no glossário
│   │   ├── HeroSculpture.tsx        # Ilha React/GSAP para coreografia do Hero SVG
│   │   ├── SplitButton.tsx          # Split button acessível para atalhos rápidos
│   │   ├── ThemeControls.tsx        # Seletor de 4 sementes, Claro/Escuro e Mola/Calmo
│   │   ├── TopBar.astro             # Barra superior flutuante e navegação mobile
│   │   └── YukoContinuityStage.tsx  # Palco interativo de continuidade (#continuidade) com lentes e ScrollTrigger
│   ├── data/
│   │   └── yuko.ts                  # Fonte única tipada com o conteúdo do Manual v1.0
│   ├── layouts/
│   │   └── BaseLayout.astro         # Shell compartilhado, ClientRouter, Lenis e Footer
│   ├── pages/
│   │   ├── index.astro              # / — Visão Geral, Hero SVG e Respaldo na Prática (#continuidade)
│   │   ├── extensoes.astro          # /extensoes/ — Identidade, 6 Extensões, 6 Frentes e Discord
│   │   ├── ciclo.astro              # /ciclo/ — Ciclo de Entrega Assistida, Papéis e Registro Formal
│   │   ├── governanca.astro         # /governanca/ — DoD, Stack, Segurança, LGPD e Mediação
│   │   └── manual.astro             # /manual/ — Quadro de Controle, Linhagem e Glossário Interativo
│   ├── scripts/
│   │   └── lenis-manager.ts         # Ciclo de vida do Lenis integrado ao GSAP ScrollTrigger
│   └── styles/
│       └── global.css               # Tokens M3 Expressive, temas dinâmicos e Tailwind CSS v4
├── astro.config.mjs
├── eslint.config.mjs
├── tsconfig.json
└── vercel.json
```

## Comandos Locais

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento local
npm run dev

# Verificação de tipos e lint
npm run typecheck
npm run lint

# Build estático de produção (gera ./dist/)
npm run build

# Pré-visualização do build de produção
npm run preview
```

## Deploy no GitHub & Vercel

1. **GitHub**: versionar o diretório do projeto (`astro.config.mjs`, `package.json`, `vercel.json`, `src/`, `public/`).
2. **Vercel**: importar o repositório com framework **Astro**, build command `npm run build` e output directory `dist`. O arquivo `vercel.json` assegura `cleanUrls: true` e `trailingSlash: true`, mantendo consistência com `build.format: 'directory'` do Astro (`/`, `/extensoes/`, `/ciclo/`, `/governanca/`, `/manual/`).
