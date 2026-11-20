(() => {
  const root = document.documentElement;
  const toastEl = document.getElementById("toast");
  let toastTimer = null;

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2500);
  }

  // ------------------------------------------------------------------------
  // 1. Dynamic Color Seed, Mode & Motion Persistence across Subpages
  // ------------------------------------------------------------------------
  const seedNames = {
    terracota: "Terracota Solar",
    botanico: "Botânico Vivo",
    oceanico: "Índigo Oceânico",
    ameixa: "Ameixa Editorial",
  };

  function applyPreferences() {
    try {
      const savedSeed = localStorage.getItem("yuko_seed");
      const savedMode = localStorage.getItem("yuko_mode");
      const savedMotion = localStorage.getItem("yuko_motion");
      if (savedSeed) setSeed(savedSeed, true);
      if (savedMode) setMode(savedMode, true);
      if (savedMotion) setMotion(savedMotion, true);
    } catch {
      // Ignore storage errors
    }
  }

  function setSeed(seed, silent = false) {
    root.setAttribute("data-seed", seed);
    document.querySelectorAll("[data-seed]").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.dataset.seed === seed ? "true" : "false");
    });
    try { localStorage.setItem("yuko_seed", seed); } catch {}
    if (!silent) showToast(`Tema: ${seedNames[seed] || seed}`);
  }

  function setMode(mode, silent = false) {
    root.setAttribute("data-mode", mode);
    document.querySelectorAll("[data-set-mode]").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.dataset.setMode === mode ? "true" : "false");
    });
    try { localStorage.setItem("yuko_mode", mode); } catch {}
    if (!silent) showToast(mode === "dark" ? "Modo Escuro ativado" : "Modo Claro ativado");
  }

  function setMotion(motion, silent = false) {
    root.setAttribute("data-motion", motion);
    document.querySelectorAll("[data-set-motion]").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.dataset.setMotion === motion ? "true" : "false");
    });
    try { localStorage.setItem("yuko_motion", motion); } catch {}
    if (!silent) showToast(motion === "expressive" ? "Física: Mola Expressiva" : "Física: Linear Calmo");
  }

  document.querySelectorAll("[data-seed]").forEach((btn) => {
    btn.addEventListener("click", () => setSeed(btn.dataset.seed));
  });

  document.querySelectorAll("[data-set-mode]").forEach((btn) => {
    btn.addEventListener("click", () => setMode(btn.dataset.setMode));
  });

  document.querySelectorAll("[data-set-motion]").forEach((btn) => {
    btn.addEventListener("click", () => setMotion(btn.dataset.setMotion));
  });

  document.getElementById("modeToggleBtn")?.addEventListener("click", () => {
    const next = root.getAttribute("data-mode") === "dark" ? "light" : "dark";
    setMode(next);
  });

  applyPreferences();

  // ------------------------------------------------------------------------
  // 2. Split Button Dropdown
  // ------------------------------------------------------------------------
  const splitMenuBtn = document.getElementById("splitMenuBtn");
  const splitMenu = document.getElementById("splitMenu");

  if (splitMenuBtn && splitMenu) {
    splitMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = splitMenu.classList.toggle("open");
      splitMenuBtn.setAttribute("aria-expanded", String(open));
    });

    document.addEventListener("click", () => {
      splitMenu.classList.remove("open");
      splitMenuBtn.setAttribute("aria-expanded", "false");
    });
  }

  // ------------------------------------------------------------------------
  // 3. Home Hero Interactive Explorer (Ciclo 6 Etapas + Pilares do Manual)
  // ------------------------------------------------------------------------
  const cycleStages = [
    {
      badge: "Etapa 1 · Demanda",
      title: "1. Demanda & Triagem",
      subtitle: "Prospecção ativa via Yuko Field ou acolhimento passivo com análise de viabilidade e criticidade.",
    },
    {
      badge: "Etapa 2 · Escopo",
      title: "2. Escopo & Critérios",
      subtitle: "Documento sintético com critérios objetivos de aceitação e abertura de registro formal rastreável.",
    },
    {
      badge: "Etapa 3 · Construção",
      title: "3. Construção Modular",
      subtitle: "Codificação em stacks consolidadas com linting automatizado, commits semânticos e dados sintéticos.",
    },
    {
      badge: "Etapa 4 · Peer Review",
      title: "4. Revisão por Pares",
      subtitle: "Validação cruzada obrigatória por 2+ desenvolvedores independentes antes da homologação.",
    },
    {
      badge: "Etapa 5 · Homologação",
      title: "5. Testes & Homologação",
      subtitle: "Verificação funcional, responsividade, segurança contra SQLi/XSS e auditoria de dependências em staging.",
    },
    {
      badge: "Etapa 6 · Sustentação",
      title: "6. Entrega & Suporte",
      subtitle: "Homologação com a microempresa e designação obrigatória do Responsável de Suporte pós-entrega.",
    },
  ];

  const pillarPresets = {
    ciclo: {
      stage: 1,
      badge: "Ciclo de Entrega Assistida",
      title: "1. Demanda & Triagem",
      subtitle: "Prospecção ativa via Yuko Field ou acolhimento passivo com análise de viabilidade e criticidade.",
    },
    linhagem: {
      stage: 2,
      badge: "Linhagem · NYX → Expliance → Yuko",
      title: "Herança & Desburocratização",
      subtitle: "Absorve a experimentação da fase NYX e a governança da Expliance em um ciclo produtivo enxuto.",
    },
    pilares: {
      stage: 3,
      badge: "Identidade · Yukon · Oslo · Verona",
      title: "Minimalismo Instrumental",
      subtitle: "Resiliência (Yukon), limpeza comunicacional (Oslo) e solidez institucional formal (Verona).",
    },
    discord: {
      stage: 4,
      badge: "Comunidade · Ambiente Discord",
      title: "Operação Síncrona & Assíncrona",
      subtitle: "Canais institucionais, técnicos e operacionais pautados por comunicação construtiva e respeito.",
    },
  };

  const studioCard = document.getElementById("studioCard");
  const badgeEl = document.getElementById("studioStateBadge");
  const counterEl = document.getElementById("studioTimer");
  const titleEl = document.getElementById("trackTitle");
  const subtitleEl = document.getElementById("trackSubtitle");
  const stageSlider = document.getElementById("densitySlider");
  const stageVal = document.getElementById("densityVal");
  const stageDots = Array.from(document.querySelectorAll("#stageDots .stage-dot"));

  function renderCycleStage(stepNumber) {
    const idx = Math.max(1, Math.min(6, Number(stepNumber))) - 1;
    const data = cycleStages[idx];
    if (!data) return;
    if (badgeEl) badgeEl.textContent = data.badge;
    if (counterEl) counterEl.textContent = `Etapa 0${idx + 1} / 06`;
    if (titleEl) titleEl.textContent = data.title;
    if (subtitleEl) subtitleEl.textContent = data.subtitle;
    if (stageVal) stageVal.textContent = `Etapa ${idx + 1}/6`;
    if (stageSlider) stageSlider.value = String(idx + 1);
    stageDots.forEach((dot, i) => dot.classList.toggle("active", i <= idx));
  }

  if (stageSlider) {
    stageSlider.addEventListener("input", () => {
      renderCycleStage(stageSlider.value);
      document.querySelectorAll("[data-pillar]").forEach((c) => {
        c.setAttribute("aria-pressed", c.dataset.pillar === "ciclo" ? "true" : "false");
      });
    });
  }

  document.querySelectorAll("[data-pillar]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const key = chip.dataset.pillar;
      document.querySelectorAll("[data-pillar]").forEach((c) => {
        c.setAttribute("aria-pressed", c.dataset.pillar === key ? "true" : "false");
      });
      const preset = pillarPresets[key];
      if (!preset) return;
      if (key === "ciclo") {
        renderCycleStage(1);
      } else {
        if (badgeEl) badgeEl.textContent = preset.badge;
        if (counterEl) counterEl.textContent = "Manual v1.0";
        if (titleEl) titleEl.textContent = preset.title;
        if (subtitleEl) subtitleEl.textContent = preset.subtitle;
        if (stageVal) stageVal.textContent = `Seção ativa`;
        stageDots.forEach((dot, i) => dot.classList.toggle("active", i < preset.stage));
      }
      studioCard?.classList.add("playing");
      setTimeout(() => studioCard?.classList.remove("playing"), 1200);
    });
  });

  document.getElementById("scallopToggle")?.addEventListener("click", () => {
    const next = stageSlider ? (Number(stageSlider.value) % 6) + 1 : 1;
    renderCycleStage(next);
    studioCard?.classList.toggle("playing");
    showToast(`Ciclo Assistido: Etapa ${next} de 6`);
  });

  // ------------------------------------------------------------------------
  // 4. Connected Button Group Audience Focus & Morph Pills & Glossary Filter
  // ------------------------------------------------------------------------
  document.querySelectorAll(".morph-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      if (pill.tagName === "BUTTON") pill.classList.toggle("morphed");
    });
  });

  const cardMicro = document.getElementById("cardMicroempresa");
  const cardDev = document.getElementById("cardDesenvolvedor");
  document.querySelectorAll("[data-audience]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.audience;
      document.querySelectorAll("[data-audience]").forEach((b) => {
        b.setAttribute("aria-pressed", b.dataset.audience === target ? "true" : "false");
      });
      if (cardMicro && cardDev) {
        cardMicro.classList.toggle("featured", target === "microempresa");
        cardDev.classList.toggle("featured", target === "desenvolvedor");
      }
    });
  });

  // Glossary filter on manual.html
  const glossarySearch = document.getElementById("glossarySearch");
  if (glossarySearch) {
    const items = Array.from(document.querySelectorAll("[data-glossary-item]"));
    glossarySearch.addEventListener("input", () => {
      const q = glossarySearch.value.trim().toLowerCase();
      items.forEach((item) => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(q) ? "" : "none";
      });
    });
  }
})();
