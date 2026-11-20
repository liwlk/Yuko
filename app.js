(() => {
  const root = document.documentElement;
  const toastEl = document.getElementById("toast");
  const modeToggleBtn = document.getElementById("modeToggleBtn");
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
  const ALLOWED_SEEDS = new Set(["terracota", "botanico", "oceanico", "ameixa"]);
  const ALLOWED_MODES = new Set(["light", "dark"]);
  const ALLOWED_MOTIONS = new Set(["expressive", "calm"]);

  const seedNames = {
    terracota: "Terracota Solar",
    botanico: "Botânico Vivo",
    oceanico: "Índigo Oceânico",
    ameixa: "Ameixa Editorial",
  };

  function syncSeedUI(seed) {
    root.setAttribute("data-seed", seed);
    document.querySelectorAll("button[data-seed]").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.dataset.seed === seed ? "true" : "false");
    });
  }

  function syncModeUI(mode) {
    root.setAttribute("data-mode", mode);
    document.querySelectorAll("[data-set-mode]").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.dataset.setMode === mode ? "true" : "false");
    });
    if (modeToggleBtn) {
      modeToggleBtn.setAttribute("aria-pressed", mode === "dark" ? "true" : "false");
    }
  }

  function syncMotionUI(motion) {
    root.setAttribute("data-motion", motion);
    document.querySelectorAll("[data-set-motion]").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.dataset.setMotion === motion ? "true" : "false");
    });
  }

  function setSeed(seed, silent = false) {
    if (!ALLOWED_SEEDS.has(seed)) return;
    const prev = root.getAttribute("data-seed");
    syncSeedUI(seed);
    try { localStorage.setItem("yuko_seed", seed); } catch {}
    if (!silent && prev !== seed) showToast(`Tema: ${seedNames[seed] || seed}`);
  }

  function setMode(mode, silent = false) {
    if (!ALLOWED_MODES.has(mode)) return;
    const prev = root.getAttribute("data-mode");
    syncModeUI(mode);
    try { localStorage.setItem("yuko_mode", mode); } catch {}
    if (!silent && prev !== mode) {
      showToast(mode === "dark" ? "Modo Escuro ativado" : "Modo Claro ativado");
    }
  }

  function setMotion(motion, silent = false) {
    if (!ALLOWED_MOTIONS.has(motion)) return;
    const prev = root.getAttribute("data-motion");
    syncMotionUI(motion);
    try { localStorage.setItem("yuko_motion", motion); } catch {}
    if (!silent && prev !== motion) {
      showToast(motion === "expressive" ? "Física: Mola Expressiva" : "Física: Linear Calmo");
    }
  }

  function applyPreferences() {
    let savedSeed = null;
    let savedMode = null;
    let savedMotion = null;
    try {
      savedSeed = localStorage.getItem("yuko_seed");
      savedMode = localStorage.getItem("yuko_mode");
      savedMotion = localStorage.getItem("yuko_motion");
    } catch {
      // Ignore storage errors
    }

    const currentSeed = root.getAttribute("data-seed");
    const currentMode = root.getAttribute("data-mode");
    const currentMotion = root.getAttribute("data-motion");

    syncSeedUI(ALLOWED_SEEDS.has(savedSeed) ? savedSeed : (ALLOWED_SEEDS.has(currentSeed) ? currentSeed : "terracota"));
    syncModeUI(ALLOWED_MODES.has(savedMode) ? savedMode : (ALLOWED_MODES.has(currentMode) ? currentMode : "light"));
    syncMotionUI(ALLOWED_MOTIONS.has(savedMotion) ? savedMotion : (ALLOWED_MOTIONS.has(currentMotion) ? currentMotion : "expressive"));
  }

  document.querySelectorAll("button[data-seed]").forEach((btn) => {
    btn.addEventListener("click", () => setSeed(btn.dataset.seed));
  });

  document.querySelectorAll("[data-set-mode]").forEach((btn) => {
    btn.addEventListener("click", () => setMode(btn.dataset.setMode));
  });

  document.querySelectorAll("[data-set-motion]").forEach((btn) => {
    btn.addEventListener("click", () => setMotion(btn.dataset.setMotion));
  });

  modeToggleBtn?.addEventListener("click", () => {
    const next = root.getAttribute("data-mode") === "dark" ? "light" : "dark";
    setMode(next);
  });

  applyPreferences();

  // ------------------------------------------------------------------------
  // 2. Split Button Dropdown (Keyboard + Focus Management)
  // ------------------------------------------------------------------------
  const splitMenuBtn = document.getElementById("splitMenuBtn");
  const splitMenu = document.getElementById("splitMenu");

  if (splitMenuBtn && splitMenu) {
    const splitContainer = splitMenuBtn.closest(".split-btn") || splitMenu;

    const getMenuItems = () => {
      const items = Array.from(splitMenu.querySelectorAll('[role="menuitem"]'));
      return items.length ? items : Array.from(splitMenu.querySelectorAll("a, button"));
    };

    const openSplitMenu = (focusTarget = null) => {
      splitMenu.classList.add("open");
      splitMenuBtn.setAttribute("aria-expanded", "true");
      if (focusTarget) focusTarget.focus();
    };

    const closeSplitMenu = (returnFocus = false) => {
      splitMenu.classList.remove("open");
      splitMenuBtn.setAttribute("aria-expanded", "false");
      if (returnFocus) splitMenuBtn.focus();
    };

    splitMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = splitMenu.classList.contains("open");
      if (isOpen) {
        closeSplitMenu();
      } else {
        openSplitMenu();
      }
    });

    splitMenuBtn.addEventListener("keydown", (e) => {
      const items = getMenuItems();
      if (!items.length) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        openSplitMenu(items[0]);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        openSplitMenu(items[items.length - 1]);
      } else if (e.key === "Escape" && splitMenu.classList.contains("open")) {
        e.preventDefault();
        closeSplitMenu(true);
      }
    });

    splitMenu.addEventListener("keydown", (e) => {
      const items = getMenuItems();
      if (!items.length) return;
      const currentIdx = items.indexOf(document.activeElement);

      if (e.key === "Escape") {
        e.preventDefault();
        closeSplitMenu(true);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIdx = currentIdx >= 0 ? (currentIdx + 1) % items.length : 0;
        items[nextIdx].focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevIdx = currentIdx >= 0 ? (currentIdx - 1 + items.length) % items.length : items.length - 1;
        items[prevIdx].focus();
      }
    });

    splitContainer.addEventListener("focusout", (e) => {
      if (!splitMenu.classList.contains("open")) return;
      const next = e.relatedTarget;
      if (!next || !splitContainer.contains(next)) {
        closeSplitMenu();
      }
    });

    document.addEventListener("click", (e) => {
      if (!splitContainer.contains(e.target)) {
        closeSplitMenu();
      }
    });
  }

  // ------------------------------------------------------------------------
  // 3. Experiência em Yukon (Canadá) — Narrativa Linear & Atmosfera
  // ------------------------------------------------------------------------
  const yukonChapters = [
    {
      step: 1,
      mood: "alvorada",
      tag: "Marco 01 · Resiliência",
      title: "Construção sólida em ambientes exigentes",
      body: "A Yuko rejeita pilhas complexas e lock-in: cada solução nasce enxuta, em ecossistemas maduros e validada antes da entrega.",
    },
    {
      step: 2,
      mood: "alvorada",
      tag: "Marco 02 · Vastidão Exploratória",
      title: "Imersão contextual nas dores reais da microempresa",
      body: "Pela frente Yuko Field, a comunidade realiza leitura operacional no campo antes de codificar, convertendo gargalos em critérios objetivos.",
    },
    {
      step: 3,
      mood: "travessia",
      tag: "Marco 03 · Sobriedade",
      title: "Minimalismo instrumental e zero ruído",
      body: "Documentação objetiva, commits semânticos rastreáveis e rejeição à burocracia excessiva para manter o ciclo produtivo ágil.",
    },
    {
      step: 4,
      mood: "boreal",
      tag: "Marco 04 · Construção em Rede",
      title: "Nenhuma entrega atravessa o território sozinha",
      body: "Todo projeto passa por Peer Review de 2+ desenvolvedores, designação de suporte e transição compulsória para proteger a microempresa.",
    },
  ];

  let currentYukonIdx = 0;
  const yukonPanorama = document.getElementById("yukonPanorama");
  const yukonRailFill = document.getElementById("yukonRailFill");
  const yukonChapterTag = document.getElementById("yukonChapterTag");
  const yukonChapterTitle = document.getElementById("yukonChapterTitle");
  const yukonChapterBody = document.getElementById("yukonChapterBody");
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
    if (!Number.isFinite(index)) return;
    currentYukonIdx = Math.max(0, Math.min(yukonChapters.length - 1, Math.trunc(index)));
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
  // 4. Glossary Filter on manual.html
  // ------------------------------------------------------------------------
  const glossarySearch = document.getElementById("glossarySearch");
  if (glossarySearch) {
    const items = Array.from(document.querySelectorAll("[data-glossary-item]"));
    const glossaryStatus = document.getElementById("glossaryStatus");
    const glossaryEmpty = document.getElementById("glossaryEmpty");

    function filterGlossary() {
      const raw = glossarySearch.value.trim();
      const q = raw.toLowerCase();
      let visibleCount = 0;

      items.forEach((item) => {
        const text = item.textContent.toLowerCase();
        const match = text.includes(q);
        item.style.display = match ? "" : "none";
        if (match) visibleCount += 1;
      });

      if (glossaryStatus) {
        if (!q) {
          glossaryStatus.textContent = `${visibleCount} ${visibleCount === 1 ? "termo exibido" : "termos exibidos"}.`;
        } else {
          glossaryStatus.textContent = `${visibleCount} ${visibleCount === 1 ? "termo encontrado" : "termos encontrados"} para "${raw}".`;
        }
      }

      if (glossaryEmpty) {
        glossaryEmpty.hidden = visibleCount > 0;
      }
    }

    glossarySearch.addEventListener("input", filterGlossary);
    window.addEventListener("pageshow", filterGlossary);
    filterGlossary();
  }
})();
