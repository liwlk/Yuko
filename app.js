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
  // 3. Shared Motion Helpers
  // ------------------------------------------------------------------------
  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
  const lerp = (a, b, t) => a + (b - a) * t;
  const reducedMotionMQ = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : { matches: false };
  const isReducedMotion = () => Boolean(reducedMotionMQ.matches);
  const isCalmMotion = () => root.getAttribute("data-motion") === "calm";

  // ------------------------------------------------------------------------
  // 4. Hero SVG Scroll & Cursor Choreography (60fps rAF + lerp)
  // ------------------------------------------------------------------------
  const heroEl = document.querySelector(".hero");
  const heroArtCard = document.querySelector(".hero-art-card");
  let refreshHeroTargets = () => {};

  if (heroEl || heroArtCard) {
    let heroTargetScroll = 0;
    let heroTargetMx = 0;
    let heroTargetMy = 0;
    let heroCurScroll = 0;
    let heroCurMx = 0;
    let heroCurMy = 0;
    let rawPointerMx = 0;
    let rawPointerMy = 0;
    let heroRafId = null;

    function applyHeroVars(scrollVal, mxVal, myVal) {
      const sStr = scrollVal.toFixed(4);
      const mxStr = mxVal.toFixed(4);
      const myStr = myVal.toFixed(4);
      if (heroEl) {
        heroEl.style.setProperty("--hero-scroll", sStr);
        heroEl.style.setProperty("--hero-mx", mxStr);
        heroEl.style.setProperty("--hero-my", myStr);
      }
      if (heroArtCard) {
        heroArtCard.style.setProperty("--hero-scroll", sStr);
        heroArtCard.style.setProperty("--hero-mx", mxStr);
        heroArtCard.style.setProperty("--hero-my", myStr);
      }
    }

    function computeHeroScroll() {
      if (!heroEl) return 0;
      const rect = heroEl.getBoundingClientRect();
      return clamp(window.scrollY / Math.max(1, rect.height), 0, 1);
    }

    function tickHero() {
      const factor = isCalmMotion() ? 0.1 : 0.15;
      heroCurScroll = lerp(heroCurScroll, heroTargetScroll, factor);
      heroCurMx = lerp(heroCurMx, heroTargetMx, factor);
      heroCurMy = lerp(heroCurMy, heroTargetMy, factor);

      const done =
        Math.abs(heroTargetScroll - heroCurScroll) < 0.0005 &&
        Math.abs(heroTargetMx - heroCurMx) < 0.0005 &&
        Math.abs(heroTargetMy - heroCurMy) < 0.0005;

      if (done) {
        heroCurScroll = heroTargetScroll;
        heroCurMx = heroTargetMx;
        heroCurMy = heroTargetMy;
        applyHeroVars(heroCurScroll, heroCurMx, heroCurMy);
        heroRafId = null;
        return;
      }

      applyHeroVars(heroCurScroll, heroCurMx, heroCurMy);
      heroRafId = requestAnimationFrame(tickHero);
    }

    function startHeroLoop() {
      if (heroRafId === null) {
        heroRafId = requestAnimationFrame(tickHero);
      }
    }

    refreshHeroTargets = () => {
      if (isReducedMotion()) {
        heroTargetScroll = 0;
        heroTargetMx = 0;
        heroTargetMy = 0;
        heroCurScroll = 0;
        heroCurMx = 0;
        heroCurMy = 0;
        if (heroRafId !== null) {
          cancelAnimationFrame(heroRafId);
          heroRafId = null;
        }
        applyHeroVars(0, 0, 0);
        return;
      }
      const amp = isCalmMotion() ? 0.35 : 1;
      heroTargetScroll = computeHeroScroll() * amp;
      heroTargetMx = rawPointerMx * amp;
      heroTargetMy = rawPointerMy * amp;
      startHeroLoop();
    };

    if (heroArtCard) {
      heroArtCard.addEventListener("pointermove", (e) => {
        if (isReducedMotion() || e.pointerType === "touch") return;
        const rect = heroArtCard.getBoundingClientRect();
        rawPointerMx = clamp(((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1, -1, 1);
        rawPointerMy = clamp(((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1, -1, 1);
        refreshHeroTargets();
      });

      const resetPointer = () => {
        rawPointerMx = 0;
        rawPointerMy = 0;
        refreshHeroTargets();
      };

      heroArtCard.addEventListener("pointerleave", resetPointer);
      heroArtCard.addEventListener("pointercancel", resetPointer);
      window.addEventListener("blur", resetPointer);
    }

    window.addEventListener("scroll", refreshHeroTargets, { passive: true });
    window.addEventListener("resize", refreshHeroTargets, { passive: true });
    reducedMotionMQ.addEventListener?.("change", refreshHeroTargets);
    refreshHeroTargets();
  }

  // Re-sync Hero amplitude whenever data-motion changes
  document.querySelectorAll("[data-set-motion]").forEach((btn) => {
    btn.addEventListener("click", refreshHeroTargets);
  });

  // ------------------------------------------------------------------------
  // 5. Experiência em Yukon (Canadá) — Scrollytelling Engine (Firewatch + INVERSA)
  // ------------------------------------------------------------------------
  const yukonChaptersData = [
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

  const YUKON_MOOD_LABELS = {
    alvorada: "Alvorada",
    travessia: "Travessia",
    boreal: "Noite Boreal",
  };
  const YUKON_CHAPTER_MOODS = ["alvorada", "alvorada", "travessia", "boreal"];

  let currentYukonIdx = 0;
  let moodManuallyLocked = false;
  let yukonClickLockUntil = 0;

  const yukonScrolly = document.querySelector(".yukon-scrolly");
  const yukonPanorama = document.getElementById("yukonPanorama");
  const yukonRingFill = document.getElementById("yukonRingFill");
  const yukonStepBadge = document.getElementById("yukonStepBadge");
  const yukonMoodLabel = document.getElementById("yukonMoodLabel");
  const yukonChaptersEls = Array.from(document.querySelectorAll(".yukon-chapter[data-yukon-chapter]"));
  const yukonMoodBtns = Array.from(document.querySelectorAll("[data-yukon-mood]"));

  // Optional legacy/fallback controls
  const yukonRailFill = document.getElementById("yukonRailFill");
  const yukonChapterTag = document.getElementById("yukonChapterTag");
  const yukonChapterTitle = document.getElementById("yukonChapterTitle");
  const yukonChapterBody = document.getElementById("yukonChapterBody");
  const yukonPrevBtn = document.getElementById("yukonPrevBtn");
  const yukonNextBtn = document.getElementById("yukonNextBtn");
  const yukonStepBtns = Array.from(document.querySelectorAll("[data-yukon-step]"));

  function setYukonMood(mood, manual = false) {
    if (!mood) return;
    if (manual) moodManuallyLocked = true;
    if (yukonPanorama) yukonPanorama.setAttribute("data-yukon-mood", mood);
    yukonMoodBtns.forEach((b) => {
      b.setAttribute("aria-pressed", b.dataset.yukonMood === mood ? "true" : "false");
    });
    if (yukonMoodLabel) {
      const matchedBtn = yukonMoodBtns.find((b) => b.dataset.yukonMood === mood);
      yukonMoodLabel.textContent =
        YUKON_MOOD_LABELS[mood] || matchedBtn?.textContent.trim() || mood;
    }
  }

  function getRingCircumference() {
    if (!yukonRingFill) return 0;
    const pathLenAttr = parseFloat(yukonRingFill.getAttribute("pathLength") || "");
    if (Number.isFinite(pathLenAttr) && pathLenAttr > 0) return pathLenAttr;
    if (typeof yukonRingFill.getTotalLength === "function") {
      try {
        const len = yukonRingFill.getTotalLength();
        if (Number.isFinite(len) && len > 0) return len;
      } catch {
        // Fallback below
      }
    }
    const r = yukonRingFill.r?.baseVal?.value || parseFloat(yukonRingFill.getAttribute("r") || "");
    if (Number.isFinite(r) && r > 0) return 2 * Math.PI * r;
    const dash = parseFloat(getComputedStyle(yukonRingFill).strokeDasharray || "");
    return Number.isFinite(dash) && dash > 0 ? dash : 0;
  }

  function applyYukonProgress(progress) {
    const p = clamp(progress, 0, 1);
    const pStr = p.toFixed(4);
    if (yukonScrolly) yukonScrolly.style.setProperty("--yukon-progress", pStr);
    if (yukonPanorama) yukonPanorama.style.setProperty("--yukon-progress", pStr);

    if (yukonRingFill) {
      yukonRingFill.style.setProperty("--yukon-progress", pStr);
      const circ = getRingCircumference();
      if (circ > 0) {
        if (!yukonRingFill.style.strokeDasharray && !yukonRingFill.getAttribute("stroke-dasharray")) {
          yukonRingFill.style.strokeDasharray = `${circ}`;
        }
        yukonRingFill.style.strokeDashoffset = `${circ * (1 - p)}`;
      }
    }
  }

  function getChapterIndex(el, fallbackIdx) {
    const raw = Number(el?.dataset?.yukonChapter);
    if (Number.isInteger(raw) && raw >= 0 && raw < Math.max(yukonChaptersEls.length, 4)) {
      return raw;
    }
    return fallbackIdx;
  }

  function renderYukonStep(index, syncMood = true) {
    if (!Number.isFinite(index)) return;
    const total = Math.max(yukonChaptersEls.length, yukonChaptersData.length, 1);
    currentYukonIdx = clamp(Math.trunc(index), 0, total - 1);

    if (yukonChaptersEls.length) {
      yukonChaptersEls.forEach((el, i) => {
        const chIdx = getChapterIndex(el, i);
        const active = chIdx === currentYukonIdx;
        el.classList.toggle("is-active", active);
        if (active) {
          el.setAttribute("aria-current", "step");
        } else {
          el.removeAttribute("aria-current");
        }
      });
    }

    if (yukonStepBadge) {
      const stepStr = String(currentYukonIdx + 1).padStart(2, "0");
      const totalStr = String(total).padStart(2, "0");
      yukonStepBadge.textContent = `${stepStr} / ${totalStr}`;
    }

    const data = yukonChaptersData[currentYukonIdx];
    if (data) {
      yukonStepBtns.forEach((b, i) => {
        b.setAttribute("aria-pressed", i === currentYukonIdx ? "true" : "false");
      });
      if (yukonRailFill) {
        yukonRailFill.style.width = `${((currentYukonIdx + 1) / total) * 100}%`;
      }
      if (yukonChapterTag) yukonChapterTag.textContent = data.tag;
      if (yukonChapterTitle) yukonChapterTitle.textContent = data.title;
      if (yukonChapterBody) yukonChapterBody.textContent = data.body;
      if (yukonPrevBtn) yukonPrevBtn.disabled = currentYukonIdx === 0;
      if (yukonNextBtn) {
        yukonNextBtn.textContent =
          currentYukonIdx === total - 1 ? "Reiniciar jornada ↺" : "Próximo marco →";
      }
    }

    if (syncMood && !moodManuallyLocked) {
      const autoMood = YUKON_CHAPTER_MOODS[currentYukonIdx] || data?.mood || "alvorada";
      setYukonMood(autoMood, false);
    }
  }

  yukonMoodBtns.forEach((btn) => {
    btn.addEventListener("click", () => setYukonMood(btn.dataset.yukonMood, true));
  });

  yukonStepBtns.forEach((btn) => {
    btn.addEventListener("click", () => renderYukonStep(Number(btn.dataset.yukonStep), true));
  });

  yukonPrevBtn?.addEventListener("click", () => renderYukonStep(currentYukonIdx - 1, true));
  yukonNextBtn?.addEventListener("click", () => {
    const next = currentYukonIdx === yukonChaptersData.length - 1 ? 0 : currentYukonIdx + 1;
    renderYukonStep(next, true);
  });

  if (yukonScrolly || yukonPanorama) {
    let targetYukonProgress = 0;
    let curYukonProgress = 0;
    let yukonRafId = null;
    const intersectingChapters = new Map();

    function computeYukonProgress() {
      if (!yukonScrolly) return 0;
      const rect = yukonScrolly.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const stickyTop = 88;
      const travel = rect.height - vh * 0.72;
      const raw =
        travel > 80
          ? (stickyTop - rect.top) / travel
          : (vh - rect.top) / Math.max(1, vh + rect.height);
      return clamp(raw, 0, 1);
    }

    function updateActiveChapterFromViewport(progressFallback) {
      if (!yukonChaptersEls.length) return;
      if (performance.now() < yukonClickLockUntil) return;

      const vh = window.innerHeight || 800;
      const focusY = vh * 0.42;
      let bestIdx = null;
      let bestDist = Infinity;

      intersectingChapters.forEach((entry, idx) => {
        if (!entry.isIntersecting) return;
        const rect = entry.target.getBoundingClientRect();
        const center = rect.top + rect.height * 0.5;
        const dist = Math.abs(center - focusY);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = idx;
        }
      });

      if (bestIdx !== null) {
        renderYukonStep(bestIdx, true);
        return;
      }

      // Fallback by scroll progress through .yukon-scrolly
      const p = typeof progressFallback === "number" ? progressFallback : computeYukonProgress();
      const fallbackIdx = clamp(
        Math.floor(p * yukonChaptersEls.length),
        0,
        yukonChaptersEls.length - 1
      );
      renderYukonStep(fallbackIdx, true);
    }

    function tickYukon() {
      const factor = isCalmMotion() ? 0.14 : 0.22;
      curYukonProgress = lerp(curYukonProgress, targetYukonProgress, factor);
      if (Math.abs(targetYukonProgress - curYukonProgress) < 0.0005) {
        curYukonProgress = targetYukonProgress;
        applyYukonProgress(curYukonProgress);
        yukonRafId = null;
        return;
      }
      applyYukonProgress(curYukonProgress);
      yukonRafId = requestAnimationFrame(tickYukon);
    }

    function syncYukonScroll() {
      targetYukonProgress = computeYukonProgress();
      updateActiveChapterFromViewport(targetYukonProgress);

      if (isReducedMotion()) {
        if (yukonRafId !== null) {
          cancelAnimationFrame(yukonRafId);
          yukonRafId = null;
        }
        curYukonProgress = targetYukonProgress;
        applyYukonProgress(curYukonProgress);
        return;
      }

      if (yukonRafId === null) {
        yukonRafId = requestAnimationFrame(tickYukon);
      }
    }

    if ("IntersectionObserver" in window && yukonChaptersEls.length) {
      const chapterObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const fallbackI = yukonChaptersEls.indexOf(entry.target);
            const idx = getChapterIndex(entry.target, fallbackI);
            intersectingChapters.set(idx, entry);
          });
          updateActiveChapterFromViewport();
        },
        {
          root: null,
          rootMargin: "-22% 0px -35% 0px",
          threshold: [0, 0.2, 0.5, 0.8, 1],
        }
      );
      yukonChaptersEls.forEach((el) => chapterObserver.observe(el));
    }

    yukonChaptersEls.forEach((el, i) => {
      el.addEventListener("click", (e) => {
        if (e.target.closest("a")) return;
        const idx = getChapterIndex(el, i);
        yukonClickLockUntil = performance.now() + 600;
        renderYukonStep(idx, true);
        el.scrollIntoView({
          behavior: isReducedMotion() ? "auto" : "smooth",
          block: "center",
        });
      });
    });

    window.addEventListener("scroll", syncYukonScroll, { passive: true });
    window.addEventListener("resize", syncYukonScroll, { passive: true });
    reducedMotionMQ.addEventListener?.("change", syncYukonScroll);
    syncYukonScroll();
    if (!yukonChaptersEls.length) renderYukonStep(0, true);
  }

  // ------------------------------------------------------------------------
  // 6. Glossary Filter on manual.html
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
