/* Preferências locais; armazenamento opcional. */
(() => {
  "use strict";
  const root = document.documentElement;
  const $ = (selector) => document.querySelector(selector);
  const storageKey = "pinheiro-acessibilidade-v1";
  const systemDark = matchMedia("(prefers-color-scheme: dark)");
  const systemMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const defaults = {
    font: 100,
    theme: "claro",
    contrast: "padrao",
    motion: false,
    underline: false,
    ruler: false,
    shortcuts: true,
  };
  let settings = { ...defaults };
  let rulerPosition = 45;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && typeof saved === "object") {
      settings.font = Number.isFinite(saved.font)
        ? Math.max(100, Math.min(200, Math.round(saved.font / 10) * 10))
        : 100;
      settings.theme = ["claro", "escuro", "sistema"].includes(saved.theme)
        ? saved.theme
        : "claro";
      settings.contrast =
        saved.contrast === true
          ? "escuro"
          : ["padrao", "escuro", "claro"].includes(saved.contrast)
            ? saved.contrast
            : "padrao";
      ["motion", "underline", "ruler"].forEach(
        (key) => (settings[key] = saved[key] === true),
      );
      settings.shortcuts = saved.shortcuts !== false;
    }
  } catch {
    /* Armazenamento bloqueado não impede o uso. */
  }
  function positionRuler(value) {
    rulerPosition = Math.max(5, Math.min(95, value));
    root.style.setProperty("--ruler-position", `${rulerPosition}vh`);
    $("#ruler-position").value = String(Math.round(rulerPosition));
  }
  function applySettings(save = false) {
    root.style.setProperty("--font-scale", String(settings.font / 100));
    root.dataset.theme =
      settings.theme === "sistema"
        ? systemDark.matches
          ? "escuro"
          : "claro"
        : settings.theme;
    root.dataset.contrast = settings.contrast;
    root.dataset.motion =
      settings.motion || systemMotion.matches ? "reduce" : "full";
    root.dataset.underline = String(settings.underline);
    root.dataset.largeText = String(settings.font >= 130);
    $("#font-value").value = `${settings.font}%`;
    $("#font-decrease").disabled = settings.font <= 100;
    $("#font-increase").disabled = settings.font >= 200;
    document
      .querySelectorAll('input[name="theme"]')
      .forEach((input) => (input.checked = input.value === settings.theme));
    $("#contrast-mode").value = settings.contrast;
    $("#reduce-motion").checked = settings.motion || systemMotion.matches;
    $("#reduce-motion").disabled = systemMotion.matches;
    $("#reduce-motion").title = systemMotion.matches
      ? "A redução de movimentos está ativada no seu dispositivo."
      : "";
    $("#underline-links").checked = settings.underline;
    $("#reading-ruler-toggle").checked = settings.ruler;
    $("#keyboard-shortcuts").checked = settings.shortcuts;
    $("#reading-ruler").hidden = !settings.ruler;
    $("#ruler-settings").hidden = !settings.ruler;
    positionRuler(rulerPosition);
    if (save) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(settings));
        $("#settings-note").textContent =
          "Suas preferências ficam salvas neste navegador.";
      } catch {
        $("#settings-note").textContent =
          "Preferências aplicadas nesta visita. O navegador não permitiu salvá-las.";
      }
    }
    document.dispatchEvent(
      new CustomEvent("pinheiro:accessibility", { detail: { ...settings } }),
    );
  }
  function changeFont(amount) {
    settings.font = Math.max(100, Math.min(200, settings.font + amount));
    applySettings(true);
    $("#announcements").textContent = `Tamanho das letras: ${settings.font}%.`;
  }
  $("#font-increase").addEventListener("click", () => changeFont(10));
  $("#font-decrease").addEventListener("click", () => changeFont(-10));
  document.querySelectorAll('input[name="theme"]').forEach((input) =>
    input.addEventListener("change", () => {
      settings.theme = input.value;
      applySettings(true);
    }),
  );
  $("#contrast-mode").addEventListener("change", (event) => {
    settings.contrast = event.target.value;
    applySettings(true);
  });
  [
    ["#reduce-motion", "motion"],
    ["#underline-links", "underline"],
    ["#reading-ruler-toggle", "ruler"],
    ["#keyboard-shortcuts", "shortcuts"],
  ].forEach(([selector, key]) =>
    $(selector).addEventListener("change", (event) => {
      settings[key] = event.target.checked;
      applySettings(true);
    }),
  );
  $("#reset-access").addEventListener("click", () => {
    settings = { ...defaults };
    applySettings(true);
    $("#announcements").textContent =
      "Configurações de acessibilidade restauradas.";
  });
  function openAccess() {
    if (!document.querySelector("dialog[open]"))
      $("#access-dialog").showModal();
  }
  document
    .querySelectorAll("[data-open-access]")
    .forEach((button) => button.addEventListener("click", openAccess));
  $("#ruler-position").addEventListener("input", (event) =>
    positionRuler(Number(event.target.value)),
  );
  document.addEventListener(
    "pointermove",
    (event) => {
      if (
        settings.ruler &&
        event.pointerType !== "touch" &&
        !document.querySelector("dialog[open]")
      )
        positionRuler((event.clientY / innerHeight) * 100);
    },
    { passive: true },
  );
  document.addEventListener("focusin", (event) => {
    if (settings.ruler && !event.target.closest("dialog")) {
      const bounds = event.target.getBoundingClientRect();
      positionRuler(((bounds.top + bounds.height / 2) / innerHeight) * 100);
    }
  });
  document.addEventListener("keydown", (event) => {
    // Preserva AltGr, edição e zoom nativo Ctrl +/−.
    if (
      !settings.shortcuts ||
      !event.ctrlKey ||
      !event.altKey ||
      event.metaKey ||
      event.getModifierState("AltGraph") ||
      event.target.closest('input,textarea,select,[contenteditable="true"]')
    )
      return;
    const key = event.key.toLowerCase();
    if (["=", "+"].includes(key)) {
      event.preventDefault();
      changeFont(10);
    } else if (key === "-") {
      event.preventDefault();
      changeFont(-10);
    } else if (key === "0") {
      event.preventDefault();
      changeFont(100 - settings.font);
    } else if (key === "a") {
      event.preventDefault();
      openAccess();
    } else if (key === "r") {
      event.preventDefault();
      settings.ruler = !settings.ruler;
      applySettings(true);
      $("#announcements").textContent =
        `Régua de leitura ${settings.ruler ? "ativada" : "desativada"}.`;
    } else if (settings.ruler && ["arrowup", "arrowdown"].includes(key)) {
      event.preventDefault();
      positionRuler(rulerPosition + (key === "arrowup" ? -5 : 5));
    }
  });
  systemDark.addEventListener("change", () => applySettings());
  systemMotion.addEventListener("change", () => applySettings());
  applySettings();
  /* Widget oficial v7: pronto somente após a criação do botão real. */
  const status = $("#libras-status"),
    retry = $("#retry-libras");
  let script,
    loading = false,
    timer,
    checks = 0;
  function ready() {
    return !!window.VLibrasWidget?.initBtn?.isConnected;
  }
  function reportReady() {
    clearInterval(timer);
    loading = false;
    retry.hidden = true;
    status.textContent =
      "Use o botão de Libras na lateral da página para iniciar a tradução. O serviço precisa de internet.";
  }
  function failure() {
    clearInterval(timer);
    loading = false;
    retry.hidden = false;
    status.textContent =
      "O VLibras não ficou disponível. Verifique sua conexão e tente novamente.";
  }
  function loadVLibras() {
    if (ready()) {
      reportReady();
      return;
    }
    if (loading) return;
    loading = true;
    checks = 0;
    retry.hidden = true;
    status.textContent =
      "Carregando o VLibras, ferramenta gratuita do governo.";
    // Evita reinjetar um script que já executou ou ainda está pendente.
    if (!script) {
      script = document.createElement("script");
      script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
      script.async = true;
      script.addEventListener(
        "error",
        () => {
          script.remove();
          script = null;
          failure();
        },
        { once: true },
      );
      document.body.append(script);
    }
    clearInterval(timer);
    timer = setInterval(() => {
      if (ready()) reportReady();
      else if (++checks >= 60) failure();
    }, 500);
  }
  retry.addEventListener("click", loadVLibras);
  loadVLibras();
})();
