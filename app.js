(() => {
  const root = document.documentElement;
  const toastEl = document.getElementById("toast");
  let toastTimer = null;

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
  }

  // ------------------------------------------------------------------------
  // 1. Dynamic Color Seed, Light/Dark Mode & Motion Physics
  // ------------------------------------------------------------------------
  const seedNames = {
    terracota: "Terracota Solar",
    botanico: "Botânico Vivo",
    oceanico: "Índigo Oceânico",
    ameixa: "Ameixa Editorial",
  };

  function setSeed(seed) {
    root.setAttribute("data-seed", seed);
    document.querySelectorAll("[data-seed]").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.dataset.seed === seed ? "true" : "false");
    });
    showToast(`Tema alterado para ${seedNames[seed] || seed}`);
  }

  function setMode(mode) {
    root.setAttribute("data-mode", mode);
    document.querySelectorAll("[data-set-mode]").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.dataset.setMode === mode ? "true" : "false");
    });
  }

  function setMotion(motion) {
    root.setAttribute("data-motion", motion);
    document.querySelectorAll("[data-set-motion]").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.dataset.setMotion === motion ? "true" : "false");
    });
    showToast(motion === "expressive" ? "Física: Mola Expressiva ativa" : "Física: Transição Linear Calma");
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

  const modeToggleBtn = document.getElementById("modeToggleBtn");
  if (modeToggleBtn) {
    modeToggleBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-mode") === "dark" ? "light" : "dark";
      setMode(next);
      showToast(next === "dark" ? "Modo Escuro ativado" : "Modo Claro ativado");
    });
  }

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

    splitMenu.querySelectorAll("[data-quick-mood]").forEach((item) => {
      item.addEventListener("click", () => {
        selectMood(item.dataset.quickMood);
        if (!isPlaying) togglePlayback();
      });
    });
  }

  const heroStartBtn = document.getElementById("heroStartBtn");
  if (heroStartBtn) {
    heroStartBtn.addEventListener("click", () => {
      if (!isPlaying) togglePlayback();
      document.getElementById("studioCard")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  // ------------------------------------------------------------------------
  // 3. Interactive Soundscape Studio + Gentle Web Audio Synthesizer
  // ------------------------------------------------------------------------
  const moods = {
    foco: {
      title: "Chuva de Argila",
      subtitle: "Harmônicos quentes em 174 Hz · Foco Profundo",
      minutes: 25,
      freq: 174,
    },
    leitura: {
      title: "Pátio de Linho",
      subtitle: "Brisa acústica suave em 220 Hz · Leitura Calma",
      minutes: 40,
      freq: 220,
    },
    criativa: {
      title: "Atelier Solar",
      subtitle: "Textura analógica em 261 Hz · Pausa Criativa",
      minutes: 15,
      freq: 261.6,
    },
    sono: {
      title: "Horizonte Profundo",
      subtitle: "Onda lenta em 136 Hz · Sono Sereno",
      minutes: 60,
      freq: 136.1,
    },
  };

  let currentMood = "foco";
  let isPlaying = false;
  let remainingSeconds = moods.foco.minutes * 60;
  let eqTimer = null;
  let clockTimer = null;
  let audioCtx = null;
  let masterGain = null;
  let osc1 = null;
  let osc2 = null;

  const studioCard = document.getElementById("studioCard");
  const studioStateBadge = document.getElementById("studioStateBadge");
  const studioTimer = document.getElementById("studioTimer");
  const trackTitle = document.getElementById("trackTitle");
  const trackSubtitle = document.getElementById("trackSubtitle");
  const playIcon = document.getElementById("playIcon");
  const eqBars = Array.from(document.querySelectorAll("#eqBars .eq-bar"));
  const densitySlider = document.getElementById("densitySlider");
  const densityVal = document.getElementById("densityVal");

  function formatTime(totalSec) {
    const m = Math.floor(totalSec / 60).toString().padStart(2, "0");
    const s = (totalSec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function startAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!audioCtx) audioCtx = new AudioContext();
      if (audioCtx.state === "suspended") audioCtx.resume();

      const density = Number(densitySlider?.value || 64) / 100;
      const baseFreq = moods[currentMood].freq;

      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.045 * density + 0.01, audioCtx.currentTime + 0.6);

      osc1 = audioCtx.createOscillator();
      osc2 = audioCtx.createOscillator();
      osc1.type = "sine";
      osc2.type = "triangle";
      osc1.frequency.setValueAtTime(baseFreq, audioCtx.currentTime);
      osc2.frequency.setValueAtTime(baseFreq * 1.5, audioCtx.currentTime);

      const filter = audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(420, audioCtx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(audioCtx.destination);

      osc1.start();
      osc2.start();
    } catch {
      // Visual-only fallback if Web Audio is unavailable
    }
  }

  function stopAudio() {
    if (osc1) {
      try { osc1.stop(); osc1.disconnect(); } catch {}
      osc1 = null;
    }
    if (osc2) {
      try { osc2.stop(); osc2.disconnect(); } catch {}
      osc2 = null;
    }
    if (masterGain) {
      try { masterGain.disconnect(); } catch {}
      masterGain = null;
    }
  }

  function updateEq() {
    const density = Number(densitySlider?.value || 64) / 100;
    eqBars.forEach((bar, idx) => {
      if (!isPlaying) {
        bar.style.height = "8px";
        return;
      }
      const wave = Math.sin(Date.now() / 220 + idx * 0.7) * 0.5 + 0.5;
      const height = Math.round(8 + wave * 20 * density);
      bar.style.height = `${height}px`;
    });
  }

  function togglePlayback() {
    isPlaying = !isPlaying;
    studioCard?.classList.toggle("playing", isPlaying);

    if (studioStateBadge) {
      studioStateBadge.textContent = isPlaying ? "Reproduzindo Agora" : "Pausado";
    }
    if (playIcon) {
      playIcon.innerHTML = isPlaying
        ? '<rect x="6" y="5" width="4" height="14" rx="1.5"/><rect x="14" y="5" width="4" height="14" rx="1.5"/>'
        : '<polygon points="7 4 20 12 7 20 7 4"/>';
    }

    if (isPlaying) {
      startAudio();
      eqTimer = setInterval(updateEq, 140);
      clockTimer = setInterval(() => {
        if (remainingSeconds > 0) {
          remainingSeconds -= 1;
          if (studioTimer) studioTimer.textContent = formatTime(remainingSeconds);
        }
      }, 1000);
      showToast(`Reproduzindo: ${moods[currentMood].title}`);
    } else {
      stopAudio();
      clearInterval(eqTimer);
      clearInterval(clockTimer);
      updateEq();
    }
  }

  function selectMood(moodKey) {
    if (!moods[moodKey]) return;
    currentMood = moodKey;
    const data = moods[moodKey];
    if (trackTitle) trackTitle.textContent = data.title;
    if (trackSubtitle) trackSubtitle.textContent = data.subtitle;
    remainingSeconds = data.minutes * 60;
    if (studioTimer) studioTimer.textContent = formatTime(remainingSeconds);

    document.querySelectorAll("[data-mood]").forEach((chip) => {
      chip.setAttribute("aria-pressed", chip.dataset.mood === moodKey ? "true" : "false");
    });

    if (isPlaying) {
      stopAudio();
      startAudio();
    }
  }

  document.getElementById("scallopToggle")?.addEventListener("click", togglePlayback);
  document.getElementById("scallopToggle")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      togglePlayback();
    }
  });

  document.querySelectorAll("[data-mood]").forEach((chip) => {
    chip.addEventListener("click", () => selectMood(chip.dataset.mood));
  });

  if (densitySlider && densityVal) {
    densitySlider.addEventListener("input", () => {
      densityVal.textContent = `${densitySlider.value}%`;
      if (masterGain && audioCtx) {
        const density = Number(densitySlider.value) / 100;
        masterGain.gain.setTargetAtTime(0.045 * density + 0.01, audioCtx.currentTime, 0.08);
      }
    });
  }

  // ------------------------------------------------------------------------
  // 4. Morphing Shape Pills & Plans Toggle
  // ------------------------------------------------------------------------
  document.querySelectorAll(".morph-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      pill.classList.toggle("morphed");
    });
  });

  const studioPriceVal = document.getElementById("studioPriceVal");
  const studioPricePeriod = document.getElementById("studioPricePeriod");
  document.querySelectorAll("[data-billing]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const billing = btn.dataset.billing;
      document.querySelectorAll("[data-billing]").forEach((b) => {
        b.setAttribute("aria-pressed", b.dataset.billing === billing ? "true" : "false");
      });
      if (studioPriceVal && studioPricePeriod) {
        studioPriceVal.textContent = billing === "anual" ? "R$ 18" : "R$ 24";
        studioPricePeriod.textContent = billing === "anual" ? "/ mês (cobrado anualmente)" : "/ mês";
      }
    });
  });

  document.querySelectorAll(".plan-cta").forEach((btn) => {
    btn.addEventListener("click", () => {
      showToast(`Plano ${btn.dataset.plan} selecionado para teste local`);
    });
  });
})();
