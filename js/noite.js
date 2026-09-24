/* Neve contínua na logo e brilhos breves, só no tema escuro. Sem canvas ou timers. */
(() => {
  "use strict";
  const root = document.documentElement;
  const brand = document.querySelector(".brand");
  const tree = document.querySelector("#review-tree");
  const effects = new Set();
  const snowEffects = new Set();
  const snow = document.createElement("span");
  snow.className = "logo-snow";
  snow.setAttribute("aria-hidden", "true");
  const lights = document.createElement("span");
  lights.className = "night-lights";
  lights.setAttribute("aria-hidden", "true");
  const positions = [
    [50, 3],
    [32, 31],
    [68, 32],
    [9, 64],
    [90, 65],
    [25, 92],
    [75, 92],
  ];
  for (let index = 0; index < 7; index++) {
    const grain = document.createElement("span");
    grain.className = "snow-grain";
    grain.style.left = `${12 + index * 12}%`;
    snow.append(grain);
    const light = document.createElement("span");
    light.className = "night-light";
    light.textContent = "✦";
    light.style.left = `${positions[index][0]}%`;
    light.style.top = `${positions[index][1]}%`;
    lights.append(light);
  }
  brand.append(snow);
  tree.append(lights);
  let lastLights = -Infinity,
    wasEnabled = false,
    treeSeen = false;
  function enabled() {
    return (
      root.dataset.theme === "escuro" &&
      root.dataset.contrast === "padrao" &&
      root.dataset.motion !== "reduce" &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }
  function canPlay() {
    return (
      enabled() && !document.hidden && !document.querySelector("dialog[open]")
    );
  }
  function animate(element, frames, options, group = effects) {
    if (!element.animate) return;
    const effect = element.animate(frames, options);
    group.add(effect);
    const cleanup = () => group.delete(effect);
    effect.addEventListener("finish", cleanup, { once: true });
    effect.addEventListener("cancel", cleanup, { once: true });
  }
  function snowfall() {
    if (!canPlay() || snowEffects.size) return;
    const height = snow.clientHeight;
    [...snow.children].forEach((grain, index) =>
      animate(
        grain,
        [
          { transform: "translate(0,-5px)", opacity: 0 },
          { opacity: 0.8, offset: 0.2 },
          {
            transform: `translate(${index % 2 ? 7 : -7}px,${height * 0.75}px)`,
            opacity: 0.65,
            offset: 0.8,
          },
          {
            transform: `translate(${index % 2 ? 10 : -10}px,${height}px)`,
            opacity: 0,
          },
        ],
        {
          duration: 2600 + index * 110,
          delay: -index * 470,
          iterations: Infinity,
          easing: "ease-in-out",
        },
        snowEffects,
      ),
    );
  }
  function starlight() {
    if (!canPlay() || performance.now() - lastLights < 4500) return;
    lastLights = performance.now();
    [...lights.children].forEach((light, index) =>
      animate(
        light,
        [
          { opacity: 0, transform: "scale(.8)" },
          { opacity: 0.65, transform: "scale(1)", offset: 0.45 },
          { opacity: 0, transform: "scale(.8)" },
        ],
        { duration: 1600, delay: index * 100, easing: "ease-in-out" },
      ),
    );
  }
  function revealTree() {
    const bounds = tree.getBoundingClientRect();
    if (
      !treeSeen &&
      bounds.top < innerHeight &&
      bounds.bottom > 0 &&
      canPlay()
    ) {
      starlight();
      treeSeen = true;
    }
  }
  function sync() {
    const active = enabled();
    if (active && !wasEnabled) {
      treeSeen = false;
    }
    if (!canPlay()) {
      effects.forEach((effect) => effect.cancel());
      effects.clear();
      snowEffects.forEach((effect) => effect.cancel());
      snowEffects.clear();
    }
    if (!active) {
      treeSeen = false;
    }
    wasEnabled = active;
    snowfall();
    revealTree();
  }
  tree.addEventListener("pointerenter", starlight);
  tree.addEventListener("focusin", starlight);
  document.addEventListener("pinheiro:accessibility", sync);
  const dialogObserver = new MutationObserver(sync);
  document.querySelectorAll("dialog").forEach((dialog) => {
    dialogObserver.observe(dialog, { attributes: true, attributeFilter: ["open"] });
  });
  document.addEventListener("visibilitychange", sync);
  if ("IntersectionObserver" in window)
    new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) revealTree();
      },
      { threshold: 0.12 },
    ).observe(tree);
  sync();
})();
