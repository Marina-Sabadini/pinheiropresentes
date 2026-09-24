/* Interações da vitrine. Dados editáveis em conteudo.js. */
(() => {
  "use strict";
  const loja = window.LOJA;
  const root = document.documentElement;
  root.classList.add("js");
  const $ = (selector) => document.querySelector(selector);
  const icon = (name) =>
    `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const escapeHTML = (text) =>
    String(text).replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );
  const normalize = (text) =>
    String(text)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  function whatsappLink(message) {
    const hour = Number(
      new Intl.DateTimeFormat("pt-BR", {
        hour: "numeric",
        hourCycle: "h23",
        timeZone: "America/Sao_Paulo",
      }).format(new Date()),
    );
    const greeting =
      hour >= 5 && hour < 12
        ? "Bom dia"
        : hour < 18 && hour >= 12
          ? "Boa tarde"
          : "Boa noite";
    const text =
      message ||
      `${greeting}, dona Amália! Vim pelo site e gostaria de mais informações.`;
    return `https://wa.me/${loja.whatsapp}?text=${encodeURIComponent(text)}`;
  }
  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    link.href = whatsappLink(link.dataset.message);
  });
  $("#current-year").textContent = new Date().getFullYear();

  /* Catálogo: busca combinada com filtros e resultados anunciados. */
  let selectedCategory = "todos";
  const grid = $("#product-grid");
  const search = $("#product-search");
  const filters = [...document.querySelectorAll("[data-filter]")];

  function renderProducts() {
    const query = normalize(search.value);
    const products = loja.produtos.filter(
      (product) =>
        (selectedCategory === "todos" ||
          product.categoria === selectedCategory) &&
        normalize(
          `${product.nome} ${product.resumo} ${product.descricao} ${loja.categorias[product.categoria]}`,
        ).includes(query),
    );
    filters.forEach((button) => {
      const active = button.dataset.filter === selectedCategory;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    grid.innerHTML = products
      .map(
        (product) => `<article class="product-card">
      <button class="product-photo" data-product="${escapeHTML(product.id)}" aria-label="Ver detalhes de ${escapeHTML(product.nome)}" aria-haspopup="dialog">
        <img src="${escapeHTML(product.imagem)}" alt="${escapeHTML(product.alt)}" width="600" height="450" loading="lazy">
        ${product.imagemTeste ? '<span class="image-badge">Imagem de teste</span>' : ""}
        <span class="photo-action" aria-hidden="true">${icon("arrow")}</span>
      </button>
      <div class="product-copy"><p class="product-category">${escapeHTML(loja.categorias[product.categoria] || product.categoria)}</p>
        <h3>${escapeHTML(product.nome)}</h3><p>${escapeHTML(product.resumo)}</p>
        <button class="product-inquiry" data-product="${escapeHTML(product.id)}" aria-haspopup="dialog">Ver detalhes ${icon("arrow")}</button>
      </div></article>`,
      )
      .join("");
    $("#empty-state").hidden = products.length > 0;
    $("#result-count").textContent =
      `${products.length} ${products.length === 1 ? "opção encontrada" : "opções encontradas"}${selectedCategory !== "todos" ? ` em ${loja.categorias[selectedCategory]}` : ""}`;
    grid.querySelectorAll("img").forEach((image) =>
      image.addEventListener(
        "error",
        () => {
          image.hidden = true;
          const fallback = document.createElement("span");
          fallback.className = "image-fallback";
          fallback.textContent =
            "Foto indisponível. Veja os detalhes do produto.";
          image.parentElement.append(fallback);
        },
        { once: true },
      ),
    );
  }
  filters.forEach((button) =>
    button.addEventListener("click", () => {
      selectedCategory = button.dataset.filter;
      renderProducts();
    }),
  );
  let searchTimer;
  search.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(renderProducts, 160);
  });
  $(".search-form").addEventListener("submit", (event) => {
    event.preventDefault();
    clearTimeout(searchTimer);
    renderProducts();
  });
  $("#clear-search").addEventListener("click", () => {
    search.value = "";
    selectedCategory = "todos";
    renderProducts();
    search.focus();
  });
  document.querySelectorAll("[data-category-link]").forEach((link) =>
    link.addEventListener("click", () => {
      selectedCategory = link.dataset.categoryLink;
      search.value = "";
      renderProducts();
    }),
  );
  renderProducts();

  /* Diálogo nativo: Escape, foco contido e devolvido ao botão de origem. */
  const productDialog = $("#product-dialog");
  grid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-product]");
    if (!button) return;
    const product = loja.produtos.find(
      (item) => item.id === button.dataset.product,
    );
    if (!product) return;
    $("#detail-title").textContent = product.nome;
    $("#detail-category").textContent = loja.categorias[product.categoria];
    $("#detail-description").textContent = product.descricao;
    $("#detail-image").src = product.imagem;
    $("#detail-image").alt = product.alt;
    $("#detail-image-note").hidden = !product.imagemTeste;

    productDialog.showModal();
  });
  document.querySelectorAll("dialog").forEach((dialog) => {
    // Mantém Tab/Shift+Tab nos controles, inclusive ao chegar à última ação.
    dialog.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;
      const controls = [
        ...dialog.querySelectorAll(
          'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), summary, [tabindex="0"]',
        ),
      ].filter(
        (element) =>
          element.getClientRects().length && !element.closest("[hidden]"),
      );
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!first) return;
      if (
        event.shiftKey &&
        (document.activeElement === first || document.activeElement === dialog)
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last || document.activeElement === dialog)
      ) {
        event.preventDefault();
        first.focus();
      }
    });
    dialog
      .querySelectorAll("[data-close-dialog]")
      .forEach((button) =>
        button.addEventListener("click", () => dialog.close()),
      );
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom
      )
        dialog.close();
    });
    new MutationObserver(() => {
      document.body.classList.toggle(
        "modal-open",
        !!document.querySelector("dialog[open]"),
      );
    }).observe(dialog, { attributes: true, attributeFilter: ["open"] });
  });

  /* Navegação responsiva e âncoras com foco previsível. */
  const menuButton = $(".menu-toggle");
  const menu = $("#menu-principal");
  function closeMenu(returnFocus = false) {
    menu.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menu de navegação");
    if (returnFocus) menuButton.focus();
  }
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menu.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute(
      "aria-label",
      `${open ? "Fechar" : "Abrir"} menu de navegação`,
    );
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("is-open"))
      closeMenu(true);
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) closeMenu();
  });
  document.querySelectorAll('a[href^="#"]').forEach((link) =>
    link.addEventListener("click", (event) => {
      const target = document.getElementById(
        link.getAttribute("href").slice(1),
      );
      if (!target) return;
      event.preventDefault();
      document
        .querySelectorAll("dialog[open]")
        .forEach((dialog) => dialog.close());
      closeMenu();
      if (!target.matches("a[href],button,input,select,textarea,[tabindex]")) {
        target.setAttribute("tabindex", "-1");
      }
      target.focus({ preventScroll: true });
      target.scrollIntoView({
        behavior:
          root.dataset.motion === "reduce" ||
          matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
      });
      try {
        history.replaceState(null, "", link.getAttribute("href"));
      } catch {
        /* file:// continua navegável. */
      }
    }),
  );
  const header = $(".site-header");
  if ("ResizeObserver" in window)
    new ResizeObserver(() => {
      root.style.setProperty("--header-height", `${header.offsetHeight}px`);
    }).observe(header);

  /* A cor ambiente acompanha as seções; os contrastes dos textos são fixos. */
  const scenes = [...document.querySelectorAll("[data-scene]")];
  function updateScrollScene() {
    const documentHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    root.style.setProperty(
      "--reading-progress",
      documentHeight > 0 ? String(window.scrollY / documentHeight) : "0",
    );
    const active = scenes.find((section) => {
      const box = section.getBoundingClientRect();
      return box.top <= innerHeight * 0.45 && box.bottom > innerHeight * 0.45;
    });
    if (!active) return;
    root.dataset.scene = active.dataset.scene;
    const colors = {
      verde: "var(--soft-green)",
      azul: "var(--soft-blue)",
      laranja: "var(--soft-orange)",
      pinheiro: "var(--soft-green)",
    };
    root.style.setProperty("--scene-color", colors[active.dataset.scene]);
    menu.querySelectorAll("a").forEach((link) => {
      if (link.getAttribute("href") === `#${active.id}`)
        link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }
  let scrollQueued = false;
  window.addEventListener(
    "scroll",
    () => {
      if (scrollQueued) return;
      scrollQueued = true;
      requestAnimationFrame(() => {
        updateScrollScene();
        scrollQueued = false;
      });
    },
    { passive: true },
  );
  updateScrollScene();
})();
