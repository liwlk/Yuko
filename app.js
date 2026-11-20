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
  // 3. Experiência em Yukon (Canadá) — Narrativa Linear & Atmosfera
  // ------------------------------------------------------------------------
  const yukonChapters = [
    {
      step: 1,
      mood: "alvorada",
      tag: "Marco 01 · Resiliência (Seção 4.1 & 10.1)",
      title: "Construção sólida em ambientes exigentes",
      body: "Assim como o território de Yukon impõe preparo e ausência de excessos, a Yuko rejeita pilhas complexas e lock-in. Cada solução nasce enxuta, em ecossistemas maduros e testada antes da entrega.",
      tokenA: "seção 4.1 · yukon",
      tokenB: "seção 10.1 · simplicidade",
    },
    {
      step: 2,
      mood: "alvorada",
      tag: "Marco 02 · Vastidão Exploratória (Yuko Field)",
      title: "Imersão contextual nas dores reais da microempresa",
      body: "Pela frente Yuko Field, a comunidade realiza visitas, entrevistas e leitura operacional no campo antes de codificar — convertendo gargalos reais em critérios objetivos de aceitação.",
      tokenA: "seção 4.3 · yuko field",
      tokenB: "seção 8.1 · demanda",
    },
    {
      step: 3,
      mood: "travessia",
      tag: "Marco 03 · Sobriedade (Oslo & Gestão Enxuta)",
      title: "Minimalismo instrumental e zero ruído",
      body: "A sobriedade de Yukon dialoga com Oslo: documentação objetiva, commits semânticos rastreáveis e rejeição à hipertrofia burocrática para manter o ciclo produtivo ágil.",
      tokenA: "seção 4.2 · minimalismo",
      tokenB: "seção 14.1 · gestão enxuta",
    },
    {
      step: 4,
      mood: "boreal",
      tag: "Marco 04 · Construção em Rede (Chancela Coletiva)",
      title: "Nenhuma entrega atravessa o território sozinha",
      body: "Todo projeto passa por Peer Review obrigatório de 2+ desenvolvedores, designação nominal de suporte e transição compulsória para proteger a microempresa parceira contra qualquer ruptura.",
      tokenA: "seção 7.4 · continuidade",
      tokenB: "seção 8.4 · peer review",
    },
  ];

  let currentYukonIdx = 0;
  const yukonPanorama = document.getElementById("yukonPanorama");
  const yukonRailFill = document.getElementById("yukonRailFill");
  const yukonChapterTag = document.getElementById("yukonChapterTag");
  const yukonChapterTitle = document.getElementById("yukonChapterTitle");
  const yukonChapterBody = document.getElementById("yukonChapterBody");
  const yukonTokenA = document.getElementById("yukonTokenA");
  const yukonTokenB = document.getElementById("yukonTokenB");
  const yukonPrevBtn = document.getElementById("yukonPrevBtn");
  const yukonNextBtn = document.getElementById("yukonNextBtn");
  const yukonStepBtns = Array.from(document.querySelectorAll("[data-yukon-step]"));

  function setYukonMood(mood) {
    if (yukonPanorama) yukonPanorama.setAttribute("data-yukon-mood", mood);
    document.querySelectorAll("[data-yukon-mood]").forEach((b) => {
      b.setAttribute("aria-pressed", b.dataset.yukonMood === mood ? "true" : "false");
    });
  }

  function renderYukonStep(index, syncMood = true) {
    currentYukonIdx = Math.max(0, Math.min(yukonChapters.length - 1, index));
    const data = yukonChapters[currentYukonIdx];
    if (!data) return;

    yukonStepBtns.forEach((b, i) => {
      b.setAttribute("aria-pressed", i === currentYukonIdx ? "true" : "false");
    });
    if (yukonRailFill) {
      yukonRailFill.style.width = `${((currentYukonIdx + 1) / yukonChapters.length) * 100}%`;
    }
    if (yukonChapterTag) yukonChapterTag.textContent = data.tag;
    if (yukonChapterTitle) yukonChapterTitle.textContent = data.title;
    if (yukonChapterBody) yukonChapterBody.textContent = data.body;
    if (yukonTokenA) yukonTokenA.textContent = data.tokenA;
    if (yukonTokenB) yukonTokenB.textContent = data.tokenB;
    if (yukonPrevBtn) yukonPrevBtn.disabled = currentYukonIdx === 0;
    if (yukonNextBtn) {
      yukonNextBtn.textContent = currentYukonIdx === yukonChapters.length - 1 ? "Reiniciar jornada ↺" : "Próximo marco →";
    }
    if (syncMood) setYukonMood(data.mood);
  }

  document.querySelectorAll("[data-yukon-mood]").forEach((btn) => {
    btn.addEventListener("click", () => setYukonMood(btn.dataset.yukonMood));
  });

  yukonStepBtns.forEach((btn) => {
    btn.addEventListener("click", () => renderYukonStep(Number(btn.dataset.yukonStep)));
  });

  yukonPrevBtn?.addEventListener("click", () => renderYukonStep(currentYukonIdx - 1));
  yukonNextBtn?.addEventListener("click", () => {
    const next = currentYukonIdx === yukonChapters.length - 1 ? 0 : currentYukonIdx + 1;
    renderYukonStep(next);
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
