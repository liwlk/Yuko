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
  // 3. Experiência em Yukon (Canadá) — Atmosfera & Pilares Interativos
  // ------------------------------------------------------------------------
  const yukonMoods = {
    alvorada: "Alvorada em Whitehorse · Prospecção Contextual via Yuko Field",
    travessia: "Travessia do Rio Yukon · Construção Modular & Peer Review",
    boreal: "Noite Boreal · Sustentação Assistida & Estabilidade Pós-Entrega",
  };

  const yukonPillars = {
    resiliencia: {
      tag: "Pilar 01 · Resiliência",
      title: "Construção sólida em ambientes exigentes",
      body: "Assim como a travessia do território de Yukon exige preparo e ausência de excessos, a Yuko rejeita pilhas complexas e lock-in. Cada solução nasce enxuta, testada em staging e sustentada por pares.",
      tokenA: "seção 4.1 · yukon",
      tokenB: "seção 10.1 · simplicidade",
    },
    vastidao: {
      tag: "Pilar 02 · Vastidão Exploratória",
      title: "Imersão real nas dores da microempresa",
      body: "Pela frente Yuko Field, os integrantes vão a campo com entrevistas e validação contextual antes de escrever código — transformando problemas operacionais reais em critérios objetivos de aceitação.",
      tokenA: "seção 4.3 · yuko field",
      tokenB: "seção 8.1 · demanda",
    },
    sobriedade: {
      tag: "Pilar 03 · Sobriedade Estrutural",
      title: "Minimalismo instrumental sem ruído",
      body: "A sobriedade de Yukon dialoga com a clareza de Oslo: documentação enxuta e útil, commits semânticos rastreáveis e zero burocracia impeditiva para equipes independentes.",
      tokenA: "seção 4.2 · minimalismo",
      tokenB: "seção 14.1 · gestão enxuta",
    },
    rede: {
      tag: "Pilar 04 · Construção em Rede",
      title: "Nenhuma entrega caminha isolada",
      body: "Todo projeto passa por revisão cruzada de no mínimo dois desenvolvedores independentes e conta com transição compulsória para proteger a microempresa parceira contra qualquer ruptura.",
      tokenA: "seção 7.4 · continuidade",
      tokenB: "seção 8.4 · peer review",
    },
  };

  const yukonArtFrame = document.getElementById("yukonArtFrame");
  const yukonHudText = document.getElementById("yukonHudText");
  const yukonSpotTag = document.getElementById("yukonSpotTag");
  const yukonSpotTitle = document.getElementById("yukonSpotTitle");
  const yukonSpotBody = document.getElementById("yukonSpotBody");
  const yukonTokenA = document.getElementById("yukonTokenA");
  const yukonTokenB = document.getElementById("yukonTokenB");

  document.querySelectorAll("[data-yukon-mood]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const mood = btn.dataset.yukonMood;
      document.querySelectorAll("[data-yukon-mood]").forEach((b) => {
        b.setAttribute("aria-pressed", b.dataset.yukonMood === mood ? "true" : "false");
      });
      if (yukonArtFrame) yukonArtFrame.setAttribute("data-yukon-mood", mood);
      if (yukonHudText && yukonMoods[mood]) yukonHudText.textContent = yukonMoods[mood];
    });
  });

  document.querySelectorAll("[data-yukon-pillar]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.yukonPillar;
      const data = yukonPillars[key];
      if (!data) return;
      document.querySelectorAll("[data-yukon-pillar]").forEach((b) => {
        b.setAttribute("aria-pressed", b.dataset.yukonPillar === key ? "true" : "false");
      });
      if (yukonSpotTag) yukonSpotTag.textContent = data.tag;
      if (yukonSpotTitle) yukonSpotTitle.textContent = data.title;
      if (yukonSpotBody) yukonSpotBody.textContent = data.body;
      if (yukonTokenA) yukonTokenA.textContent = data.tokenA;
      if (yukonTokenB) yukonTokenB.textContent = data.tokenB;
    });
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
