/* Árvore de texto: cards em 1/2/3 níveis. Movimento restrito ao comentário.
   Dados públicos em conteudo.js; comentários do formulário apenas locais. */
(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const storageKey = "pinheiro-comentarios-v1";
  const colors = ["dourado", "verde", "azul"];
  const pageSize = 6;
  const tree = $("#review-tree");
  const cards = $("#reviews-list");
  const form = $("#review-form");
  const formDialog = $("#review-form-dialog");
  const detailDialog = $("#review-detail-dialog");
  const invitations = [
    [
      "leaf",
      "Sua história começa aqui",
      "Nosso pinheiro tem um lugar para a sua experiência.",
    ],
    [
      "heart",
      "Um atendimento que marcou",
      "Como foi sua conversa com a dona Amália?",
    ],
    [
      "gift",
      "Um presente especial",
      "Conte sobre um carinho que você levou daqui.",
    ],
    [
      "bed",
      "Um cantinho mais seu",
      "Qual achado deixou sua casa mais aconchegante?",
    ],
    [
      "shirt",
      "Uma escolha para você",
      "Tem um produto que acompanha seu dia a dia?",
    ],
    [
      "leaf",
      "Uma lembrança boa",
      "Pendure aqui uma história que merece ser lembrada.",
    ],
  ];
  let localReviews = [],
    persistent = true,
    page = 0,
    preferredList = false;
  let selectedReview = null,
    selectedPlace = null,
    returnTarget = null;
  const activeAnimations = new Set();
  const validReview = (item) =>
    item &&
    typeof item === "object" &&
    typeof item.nome === "string" &&
    item.nome.trim().length > 0 &&
    item.nome.length <= 50 &&
    typeof item.texto === "string" &&
    item.texto.trim().length > 0 &&
    item.texto.length <= 600;
  function parseLocals(value) {
    return Array.isArray(value)
      ? value
          .filter(
            (item) =>
              validReview(item) && /^local-[a-zA-Z0-9-]+$/.test(item.id),
          )
          .slice(0, 30)
          .map((item) => ({
            id: item.id,
            nome: item.nome.trim(),
            texto: item.texto.trim(),
            cor: colors.includes(item.cor) ? item.cor : "dourado",
            lugar:
              Number.isInteger(item.lugar) &&
              item.lugar >= 0 &&
              item.lugar < 600
                ? item.lugar
                : null,
            local: true,
          }))
      : [];
  }
  try {
    localReviews = parseLocals(JSON.parse(localStorage.getItem(storageKey)));
  } catch {
    persistent = false;
  }
  const publicReviews = (
    Array.isArray(window.LOJA.avaliacoes) ? window.LOJA.avaliacoes : []
  )
    .filter(validReview)
    .map((item, index) => ({
      id: `public-${index}`,
      nome: item.nome.trim(),
      texto: item.texto.trim(),
      cor: colors.includes(item.cor) ? item.cor : colors[index % 3],
      local: false,
    }));
  const announce = (text) => ($("#announcements").textContent = text);
  const reduced = () =>
    document.documentElement.dataset.motion === "reduce" ||
    matchMedia("(prefers-reduced-motion: reduce)").matches;
  function storageNotice() {
    $("#tree-storage-status").textContent = persistent
      ? ""
      : "Não foi possível acessar os comentários salvos. Seus comentários desta visita podem ficar disponíveis somente até fechar esta página.";
  }
  function persist() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(localReviews));
      persistent = true;
    } catch {
      persistent = false;
    }
    storageNotice();
  }
  // Posições explícitas mantêm o comentário no card escolhido, mesmo após recarregar.
  function layout() {
    const result = [];
    for (const review of localReviews)
      if (Number.isInteger(review.lugar) && !result[review.lugar])
        result[review.lugar] = review;
    for (const review of [...localReviews, ...publicReviews]) {
      if (result.includes(review)) continue;
      let place = 0;
      while (result[place]) place++;
      result[place] = review;
      if (review.local) review.lugar = place;
    }
    return result;
  }
  function firstEmpty(items) {
    let place = 0;
    while (items[place]) place++;
    return place;
  }
  function isList() {
    return (
      preferredList ||
      Number(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--font-scale",
        ),
      ) >= 1.3
    );
  }
  function animate(element, keyframes, options) {
    if (reduced() || !element?.animate) return;
    const animation = element.animate(keyframes, options);
    activeAnimations.add(animation);
    const done = () => activeAnimations.delete(animation);
    animation.addEventListener("finish", done, { once: true });
    animation.addEventListener("cancel", done, { once: true });
  }
  function hangCard(card) {
    animate(
      card,
      [
        {
          transform:
            "perspective(900px) translateY(-28px) rotateX(16deg) rotateZ(-5deg)",
          opacity: 0.3,
        },
        {
          transform:
            "perspective(900px) translateY(0) rotateX(-3deg) rotateZ(3deg)",
          opacity: 1,
          offset: 0.55,
        },
        {
          transform: "perspective(900px) rotateX(1deg) rotateZ(-1deg)",
          offset: 0.8,
        },
        { transform: "perspective(900px) rotateX(0) rotateZ(0)", opacity: 1 },
      ],
      { duration: 640, easing: "cubic-bezier(.22,.7,.3,1)" },
    );
  }
  function restoreFocus() {
    const target = returnTarget?.isConnected ? returnTarget : $("#add-review");
    target.focus({ preventScroll: true });
    returnTarget = null;
  }
  formDialog.addEventListener("close", restoreFocus);
  detailDialog.addEventListener("close", () => {
    restoreFocus();
    selectedReview = null;
  });
  function openForm(trigger, place = null) {
    if (localReviews.length >= 30) {
      $("#tree-storage-status").textContent =
        "Limite de 30 comentários neste navegador. Abra um comentário seu para retirá-lo antes de pendurar outro.";
      announce("Você já tem 30 comentários neste navegador.");
      return;
    }
    selectedPlace = place;
    returnTarget = trigger;
    $("#review-error").hidden = true;
    formDialog.showModal();
  }
  function openReview(review, trigger) {
    selectedReview = review;
    returnTarget = trigger;
    const source = trigger.closest(".review-card").getBoundingClientRect();
    $("#review-author").textContent = review.nome;
    $("#review-quote").textContent = review.texto;
    $("#review-source").textContent = review.local
      ? "Seu comentário · somente neste navegador"
      : "Avaliação publicada com autorização";
    detailDialog.dataset.color = review.cor;
    $("#delete-review").hidden = !review.local;
    $("#delete-confirm").hidden = true;
    detailDialog.showModal();
    const destination = detailDialog.getBoundingClientRect();
    animate(
      detailDialog,
      [
        {
          transform: `translate(${source.left - destination.left}px,${source.top - destination.top}px) scale(${source.width / destination.width},${source.height / destination.height})`,
          opacity: 0.45,
        },
        { transform: "translate(0,0) scale(1,1)", opacity: 1 },
      ],
      { duration: 320, easing: "cubic-bezier(.2,.7,.25,1)" },
    );
  }
  function createCard(review, place) {
    const card = document.createElement("article");
    card.className = `review-card ${review ? "comment-card" : "invitation-card"}`;
    card.dataset.place = String(place);
    const [symbol, title, description] = invitations[place % 6];
    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("class", "icon");
    icon.setAttribute("aria-hidden", "true");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", `#i-${review ? "heart" : symbol}`);
    icon.append(use);
    card.append(icon);
    const heading = document.createElement("h3");
    heading.textContent = review ? review.nome : title;
    card.append(heading);
    if (review) {
      card.dataset.review = review.id;
      card.dataset.color = review.cor;
      const quote = document.createElement("blockquote");
      quote.className = "card-quote";
      quote.textContent = review.texto;
      card.append(quote);
      const note = document.createElement("p");
      note.className = "card-source";
      note.textContent = review.local
        ? "Somente neste navegador"
        : "Publicada com autorização";
      card.append(note);
    } else {
      const copy = document.createElement("p");
      copy.textContent = description;
      card.append(copy);
    }
    const button = document.createElement("button");
    button.className = "card-action";
    button.setAttribute("aria-haspopup", "dialog");
    button.textContent = review ? "Ler comentário" : "Pendurar aqui";
    button.setAttribute(
      "aria-label",
      review
        ? `Ler comentário de ${review.nome}`
        : `Pendurar comentário: ${title}`,
    );
    button.addEventListener("click", () =>
      review ? openReview(review, button) : openForm(button, place),
    );
    card.append(button);
    return card;
  }
  function render() {
    const previousFocus =
      document.activeElement.closest?.(".review-card")?.dataset.place;
    const items = layout(),
      pages = Math.max(1, Math.ceil(items.length / pageSize));
    page = Math.min(page, pages - 1);
    const list = isList();
    tree.classList.toggle("is-list", list);
    const entries =
      list && items.some(Boolean)
        ? items
            .map((review, place) => ({ review, place }))
            .filter((item) => item.review)
        : Array.from({ length: 6 }, (_, index) => ({
            review: items[page * 6 + index],
            place: page * 6 + index,
          }));
    cards.replaceChildren(
      ...entries.map(({ review, place }) => createCard(review, place)),
    );
    if (previousFocus !== undefined)
      cards
        .querySelector(`[data-place="${previousFocus}"] button`)
        ?.focus({ preventScroll: true });
    $("#tree-status").textContent =
      `${publicReviews.length} ${publicReviews.length === 1 ? "avaliação pública" : "avaliações públicas"}${localReviews.length ? ` · ${localReviews.length} ${localReviews.length === 1 ? "comentário seu" : "comentários seus"}` : ""}`;
    const toggle = $("#tree-view-toggle");
    toggle.setAttribute("aria-pressed", String(list));
    toggle.textContent = list ? "Ver em árvore" : "Ler em lista";
    toggle.disabled =
      Number(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--font-scale",
        ),
      ) >= 1.3;
    $("#tree-pagination").hidden = list || pages <= 1;
    $("#tree-prev").disabled = page <= 0;
    $("#tree-next").disabled = page >= pages - 1;
    $("#tree-page").textContent = `Página ${page + 1} de ${pages}`;
  }
  $("#tree-view-toggle").addEventListener("click", () => {
    preferredList = !preferredList;
    render();
  });
  document.addEventListener("pinheiro:accessibility", () => {
    if (reduced()) activeAnimations.forEach((animation) => animation.cancel());
    render();
  });
  $("#add-review").addEventListener("click", (event) =>
    openForm(event.currentTarget),
  );
  $("#tree-guide").addEventListener("click", () => {
    const card = cards.firstElementChild;
    card.scrollIntoView({ block: "center", behavior: "instant" });
    card.querySelector("button").focus({ preventScroll: true });
    hangCard(card);
    announce(
      reduced()
        ? "A animação está desativada pela preferência de reduzir movimentos. Ao salvar, seu comentário ocupa o card escolhido."
        : "Demonstração de pendurar o card. Nenhum comentário foi criado.",
    );
  });
  $("#tree-prev").addEventListener("click", () => {
    page--;
    render();
    if ($("#tree-prev").disabled) $("#tree-next").focus();
  });
  $("#tree-next").addEventListener("click", () => {
    page++;
    render();
    if ($("#tree-next").disabled) $("#tree-prev").focus();
  });
  $("#review-text").addEventListener(
    "input",
    () =>
      ($("#review-count").textContent =
        `${$("#review-text").value.length} de 600 caracteres · mínimo de 10`),
  );
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const nome = $("#review-name").value.trim(),
      texto = $("#review-text").value.trim();
    if (
      nome.length < 2 ||
      texto.length < 10 ||
      nome.length > 50 ||
      texto.length > 600
    ) {
      $("#review-error").textContent =
        "Digite um nome entre 2 e 50 caracteres e um comentário entre 10 e 600, sem contar espaços nas pontas.";
      $("#review-error").hidden = false;
      (nome.length < 2 ? $("#review-name") : $("#review-text")).focus();
      return;
    }
    if (localReviews.length >= 30) {
      $("#review-error").textContent =
        "Limite de 30 comentários. Retire um comentário seu antes de adicionar outro.";
      $("#review-error").hidden = false;
      return;
    }
    const items = layout(),
      lugar =
        selectedPlace !== null && !items[selectedPlace]
          ? selectedPlace
          : firstEmpty(items);
    const cor = form.elements["ornament-color"].value;
    const review = {
      id: `local-${globalThis.crypto?.randomUUID?.() || Date.now().toString(36)}`,
      nome,
      texto,
      cor: colors.includes(cor) ? cor : "dourado",
      lugar,
      local: true,
    };
    localReviews.push(review);
    persist();
    page = Math.floor(lugar / 6);
    render();
    form.reset();
    $("#review-count").textContent = "0 de 600 caracteres · mínimo de 10";
    const card = cards.querySelector(`[data-review="${review.id}"]`);
    returnTarget = card.querySelector("button");
    formDialog.close();
    card.scrollIntoView({ block: "center", behavior: "instant" });
    requestAnimationFrame(() => {
      if (card.isConnected) hangCard(card);
    });
    announce(
      persistent
        ? "Comentário pendurado no card escolhido e salvo somente neste navegador."
        : "Comentário pendurado nesta visita. O navegador não permitiu salvá-lo.",
    );
  });
  $("#delete-review").addEventListener("click", () => {
    $("#delete-confirm").hidden = false;
    $("#cancel-delete").focus();
  });
  $("#cancel-delete").addEventListener("click", () => {
    $("#delete-confirm").hidden = true;
    $("#delete-review").focus();
  });
  $("#confirm-delete").addEventListener("click", () => {
    if (!selectedReview?.local) return;
    const place = localReviews.find(
      (review) => review.id === selectedReview.id,
    )?.lugar;
    localReviews = localReviews.filter(
      (review) => review.id !== selectedReview.id,
    );
    persist();
    render();
    returnTarget =
      cards.querySelector(`[data-place="${place}"] button`) || $("#add-review");
    detailDialog.close();
    announce("Comentário retirado deste navegador.");
  });
  window.addEventListener("storage", (event) => {
    if (event.key !== storageKey) return;
    try {
      localReviews = parseLocals(JSON.parse(event.newValue));
      render();
    } catch {
      /* Não substitui a lista por dados inválidos. */
    }
  });
  render();
  storageNotice();
})();
