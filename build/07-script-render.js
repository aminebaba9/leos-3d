/* ============================================================
   LEO'S — Moteur applicatif (2/3) : rendus
   ============================================================ */

const FALLBACK_IMG = "assets/tee-black.jpg";

function stars(rating) {
  const rounded = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  let out = "";
  for (let i = 0; i < 5; i += 1) {
    out += `<svg class="star${i < rounded ? " is-on" : ""}" aria-hidden="true"><use href="#i-star"/></svg>`;
  }
  return `<span class="star-row" aria-hidden="true">${out}</span>`;
}

function discountPercent(product) {
  if (!product.oldPrice || product.oldPrice <= product.price) return 0;
  return Math.round((1 - product.price / product.oldPrice) * 100);
}

function sortedProducts() {
  let list = state.products.filter(product => {
    const query = state.search.trim().toLowerCase();
    const haystack = `${L(product.name)} ${product.name.fr} ${catName(product.cat)}`.toLowerCase();
    if (query && !haystack.includes(query)) return false;
    if (state.filter === "new") return Boolean(product.isNew);
    if (state.filter !== "all") return product.cat === state.filter;
    return true;
  });
  const byPrice = (a, b) => a.price - b.price;
  if (state.sort === "price-asc") list = list.slice().sort(byPrice);
  else if (state.sort === "price-desc") list = list.slice().sort((a, b) => b.price - a.price);
  else if (state.sort === "new") list = list.slice().sort((a, b) => Number(b.isNew) - Number(a.isNew));
  return list;
}

/* ---------- Filtres ---------- */
function renderFilters() {
  const wrap = $("#filters");
  if (!wrap) return;
  const cats = Object.keys(CATS).filter(cat => state.products.some(p => p.cat === cat));
  const chips = [
    { key: "all", label: t("shop.all"), count: state.products.length },
    { key: "new", label: t("shop.newOnly"), count: state.products.filter(p => p.isNew).length }
  ].concat(cats.map(cat => ({
    key: cat,
    label: catName(cat),
    count: state.products.filter(p => p.cat === cat).length
  })));

  wrap.innerHTML = chips.map(chip => `
    <button class="chip${state.filter === chip.key ? " is-active" : ""}" type="button" role="tab"
      aria-selected="${state.filter === chip.key}" data-filter="${esc(chip.key)}">
      ${esc(chip.label)}<span class="count">${chip.count}</span>
    </button>`).join("");
}

/* ---------- Grille produits ---------- */
function productCard(product) {
  const pid = esc(product.id);
  const href = `?product=${encodeURIComponent(product.id)}`;
  const off = discountPercent(product);
  const lowStock = Number(product.lowStock) > 0 && !product.soldOut;
  const badges = [];
  if (product.soldOut) {
    badges.push(`<span class="badge out">${esc(t("badge.out"))}</span>`);
  } else {
    if (off > 0) badges.push(`<span class="badge sale">−${off}%</span>`);
    if (product.isNew) badges.push(`<span class="badge gold">${esc(t("card.new"))}</span>`);
    const tag = L(product.tag);
    const tagIsDuplicate = !tag || tag === t("card.new") || /^[-−]?\d+\s*%$/.test(tag.trim());
    if (!product.isNew && !off && tag && !tagIsDuplicate) {
      badges.push(`<span class="badge">${esc(tag)}</span>`);
    }
  }
  const swatches = (product.colors || []).slice(0, 4)
    .map(key => `<span class="swatch-dot" style="background:${colorHex(key)}" title="${esc(colorName(key))}"></span>`).join("");
  const wished = state.wish.includes(product.id);

  return `
  <article class="product-card reveal" data-card="${pid}">
    <div class="product-media" data-open="${pid}" role="button" tabindex="0" aria-label="${esc(t("card.view"))} — ${esc(L(product.name))}">
      <div class="badges">${badges.join("")}</div>
      <img src="${esc(product.img || FALLBACK_IMG)}" alt="${esc(L(product.name))}" loading="lazy" decoding="async"
           onerror="this.onerror=null;this.src='${FALLBACK_IMG}'">
      <button class="wish-btn${wished ? " is-on" : ""}" type="button" data-wish="${pid}"
        aria-label="${esc(t("wish.added"))}" aria-pressed="${wished}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5s-7.5-4.7-7.5-10.3A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 3c0 5.6-7.5 10.3-7.5 10.3z"/></svg>
      </button>
      <button class="quick-add" type="button" data-quick="${pid}">${esc(t("card.quick"))} · ${money(product.price)}</button>
    </div>
    <div class="product-info">
      <span class="product-cat">${esc(catName(product.cat))}</span>
      <h3 class="product-title"><a href="${href}" data-open-link="${pid}">${esc(L(product.name))}</a></h3>
      <div class="product-row">
        <div class="price-now">${product.oldPrice ? `<span class="price-old">${money(product.oldPrice)}</span>` : ""}${money(product.price)}</div>
        <div class="swatches-row">${swatches}</div>
      </div>
      <div class="rating-row">
        ${stars(product.rating)}
        <span>${esc(t("card.reviews", { n: product.reviews }))}</span>
        ${lowStock ? `<span class="gold">· ${esc(t("card.low", { n: product.lowStock }))}</span>` : ""}
      </div>
    </div>
  </article>`;
}

function renderProducts() {
  const grid = $("#productGrid");
  if (!grid) return;
  const list = sortedProducts();
  if (!list.length) {
    grid.innerHTML = `<div class="empty-results">${esc(t("shop.empty"))}</div>`;
  } else {
    grid.innerHTML = list.map(productCard).join("");
    requestAnimationFrame(observeReveals);
  }
}

/* ---------- Avis ---------- */
function renderReviews() {
  const grid = $("#reviewGrid");
  if (!grid) return;
  const initials = name => L(name).split(" ")[0].slice(0, 1).toUpperCase();
  grid.innerHTML = REVIEWS.map(review => `
    <article class="review-card reveal">
      ${stars(review.stars)}
      <blockquote>“${esc(L(review.text))}”</blockquote>
      <div class="review-who">
        <span class="avatar" aria-hidden="true">${esc(initials(review.name))}</span>
        <div>
          <strong>${esc(L(review.name))}</strong>
          <span>${esc(L(review.city))}</span>
          <span class="verified">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
            ${esc(t("rev.verified"))}
          </span>
        </div>
      </div>
    </article>`).join("");
}

/* ---------- FAQ ---------- */
function renderFaqs() {
  const list = $("#faqList");
  if (!list) return;
  list.innerHTML = FAQS.map((faq, index) => `
    <div class="acc-item${index === 0 ? " is-open" : ""}">
      <button class="acc-head" type="button" aria-expanded="${index === 0}">
        <span>${esc(L(faq.q))}</span>
        <svg class="chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      <div class="acc-body"><div class="acc-inner">${esc(L(faq.a))}</div></div>
    </div>`).join("");
}

/* ---------- Panneau livraison ---------- */
function renderDeliveryPanel() {
  const panel = $("#deliveryPanel");
  if (!panel) return;
  const deskOff = Math.max(0, Math.min(60, Number(state.settings.deskDiscount) || 0));
  const zones = [
    ["zone.nord", Number(state.settings.feeNorth) || 0],
    ["zone.ew", Number(state.settings.feeEastWest) || 0],
    ["zone.sud", Number(state.settings.feeSouth) || 0]
  ];
  const rows = zones.map(([zone, fee]) => {
    const desk = Math.max(0, Math.round((fee * (1 - deskOff / 100)) / 50) * 50);
    return `
    <div class="delivery-row">
      <span class="fee-zone">${esc(t(zone))}<small>${esc(t("del.rowDesk"))} : ${money(desk)} (−${deskOff} %)</small></span>
      <strong>${money(fee)}<br><small style="font-weight:500;color:var(--muted)">${esc(t("del.rowHome"))}</small></strong>
    </div>`;
  }).join("");

  panel.innerHTML = `
    <div class="panel-head">${esc(t("del.eyebrow"))}</div>
    ${rows}
    <div class="delivery-row"><span>${esc(t("del.rowDays"))}</span><strong>${esc(state.settings.deliveryDays)} ${state.lang === "ar" ? "أيام" : "jours"}</strong></div>
    <div class="delivery-row"><span>${esc(t("del.rowFree"))}</span><strong>${esc(t("del.freeText", { n: state.settings.freeShipItems }))}</strong></div>
    <div class="delivery-row"><span>${esc(t("checkout.title"))}</span><strong>${esc(state.lang === "ar" ? "الدفع عند الاستلام" : "Paiement à la livraison")}</strong></div>
    <p class="delivery-caption" style="padding:14px 20px;margin:0">${esc(t("del.zoneNote"))}</p>`;
}

/* ---------- Combo ---------- */
function renderCombo() {
  const card = $("#comboCard");
  if (!card) return;
  const need = Math.max(2, Number(state.settings.minimumItems) || 2);
  const freeAt = Math.max(1, Number(state.settings.freeShipItems) || 2);
  const count = cartCount();
  const tier2Text = $("#comboTier2Text");
  const tier3Text = $("#comboTier3Text");
  if (tier2Text) tier2Text.textContent = t("combo.tier2", { d: state.settings.discount });
  if (tier3Text) tier3Text.textContent = t("combo.tier3off", { n: freeAt });

  $$(".bundle-tier", card).forEach(tier => {
    const key = tier.getAttribute("data-tier");
    const reached = key === "1" ? count >= 1 : key === "2" ? count >= need : count >= freeAt;
    tier.classList.toggle("is-reached", reached);
  });

  const bar = $("#comboProgressBar");
  const text = $("#comboProgressText");
  if (bar) bar.style.width = `${Math.min(100, Math.round((count / freeAt) * 100))}%`;
  if (text) {
    if (count >= freeAt) text.textContent = t("combo.progressDone", { d: state.settings.discount });
    else if (count === 0) text.textContent = t("combo.progressEmpty");
    else text.textContent = t("combo.progress", { have: count, need: freeAt, d: state.settings.discount });
  }
}

/* ---------- Panier ---------- */
function renderCart() {
  const count = cartCount();
  const countEl = $("#cartCount");
  if (countEl) {
    countEl.textContent = count;
    countEl.classList.toggle("is-on", count > 0);
  }
  const bagTitle = $("#bagTitleCount");
  if (bagTitle) bagTitle.textContent = count;

  const items = $("#cartItems");
  const footer = $("#cartFooter");
  if (!items || !footer) return;

  const lines = cartLines();

  if (!lines.length) {
    items.innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        <strong>${esc(t("cart.empty"))}</strong>
        <p>${esc(t("cart.emptyText", { n: state.settings.minimumItems }))}</p>
        <button class="text-link" type="button" data-cart-shop>${esc(t("cart.emptyCta"))}</button>
      </div>`;
    footer.innerHTML = "";
    return;
  }

  items.innerHTML = lines.map(line => `
    <div class="cart-row">
      <img src="${esc(line.product.img || FALLBACK_IMG)}" alt="${esc(L(line.product.name))}" loading="lazy">
      <div>
        <h4>${esc(L(line.product.name))}</h4>
        <div class="variant">${esc(t("cart.size"))} ${esc(line.size)}${line.color ? ` · ${esc(colorName(line.color))}` : ""}</div>
        <div class="qty-controls">
          <button type="button" data-qty="${esc(line.pid)}" data-size="${esc(line.size)}" data-color="${esc(line.color || "")}" data-delta="-1" aria-label="−">−</button>
          <span>${line.qty}</span>
          <button type="button" data-qty="${esc(line.pid)}" data-size="${esc(line.size)}" data-color="${esc(line.color || "")}" data-delta="1" aria-label="+">+</button>
        </div>
      </div>
      <div class="row-end">
        <span class="line-total">${money(line.line)}</span>
        <button class="remove-item" type="button" data-remove="${esc(line.pid)}" data-size="${esc(line.size)}" data-color="${esc(line.color || "")}">${esc(t("cart.remove"))}</button>
      </div>
    </div>`).join("");

  const freeAt = Math.max(1, Number(state.settings.freeShipItems) || 2);
  const need = Math.max(2, Number(state.settings.minimumItems) || 2);
  const rate = discountRate();
  const off = discountValue();
  const fee = shippingFee();

  let nudge = "";
  if (count < freeAt) {
    nudge = `<div class="free-ship-bar">
      <p>${esc(t("cart.freeShip", { n: freeAt, left: freeAt - count }))}</p>
      <span class="track"><i class="fill" style="width:${Math.min(100, Math.round((count / freeAt) * 100))}%"></i></span>
    </div>`;
  } else if (count < need) {
    nudge = `<div class="bundle-nudge">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2.4 5.4 5.6.6-4.2 3.8 1.2 5.6L12 15.8 6.999 18.4 8.2 12.8 4 9l5.6-.6z"/></svg>
      <span>${esc(t("cart.nudge", { n: need - count, off: t("cart.nudgeOff", { d: state.settings.discount }) }))}</span>
    </div>`;
  } else if (count >= freeAt && rate > 0) {
    nudge = `<div class="bundle-nudge" style="border-style:solid;border-color:var(--ok);background:#eef6f0">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
      <span>${esc(t("cart.freeShipOk"))}</span>
    </div>`;
  }

  footer.innerHTML = `
    ${nudge}
    <div class="cart-summary"><span>${esc(t("cart.subtotal"))} · ${esc(t("summary.items", { n: count }))}</span><strong>${money(subtotal())}</strong></div>
    ${off ? `<div class="cart-summary discount"><span>${esc(t("cart.discount", { n: rate }))}</span><strong>− ${money(off)}</strong></div>` : ""}
    <div class="cart-summary"><span>${esc(t("cart.delivery"))}</span><strong>${count >= freeAt ? esc(t("cart.deliveryFree")) : (state.wilaya ? money(fee) : esc(t("cart.deliveryLater")))}</strong></div>
    <div class="cart-summary total">
      <span>${esc(state.wilaya ? t("cart.total") : t("cart.totalEstimate"))}</span>
      <strong>${money(subtotal() - off + (state.wilaya ? fee : 0))}</strong>
    </div>
    <button class="btn full" type="button" id="checkoutButton" style="margin-top:14px">${esc(t("cart.checkout"))} <span class="arrow" aria-hidden="true"></span></button>
    <p class="checkout-note">${esc(t("cart.note"))}</p>`;
}

/* ---------- Page produit ---------- */
function renderProductPage(id, opts) {
  const options = opts || {};
  const product = productById(id);
  const view = $("#productView");
  const home = $("#homeView");
  if (!view) return;

  if (!product) {
    showHome(true);
    showToast(state.lang === "ar" ? "المنتج غير موجود" : "Ce produit n'existe pas (ou plus).");
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("product");
      history.replaceState({}, "", url);
    } catch (err) { /* ignoré */ }
    return;
  }

  state.product = product.id;
  state.gallery = 0;
  if (!state.size || !(product.sizes || []).includes(state.size)) state.size = null;
  if (!state.color || !(product.colors || []).includes(state.color)) state.color = (product.colors || [])[0] || null;
  state.qty = 1;

  const gallery = productGallery(product);
  const off = discountPercent(product);
  const inWish = state.wish.includes(product.id);
  const table = SIZE_TABLE[product.cat] || SIZE_TABLE.Hoodies;
  const features = product.features ? L(product.features) : [];
  const stockLine = product.soldOut
    ? `<span class="pdp-alert"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v4m0 4h.01"/></svg>${esc(t("badge.out"))}</span>`
    : Number(product.lowStock) > 0
      ? `<span class="pdp-alert"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 3 2 20h20z"/><path d="M12 9v5m0 3h.01"/></svg>${esc(t("pdp.low", { n: product.lowStock }))}</span>`
      : `<span class="pdp-alert ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>${esc(t("pdp.inStock"))}</span>`;

  view.innerHTML = `
    <nav class="crumbs" aria-label="fil d'Ariane">
      <a href="#top" data-home>${esc(t("pdp.home"))}</a><span class="sep">/</span>
      <a href="#shop" data-home>${esc(t("pdp.shop"))}</a><span class="sep">/</span>
      <span>${esc(catName(product.cat))}</span><span class="sep">/</span>
      <span class="muted">${esc(L(product.name))}</span>
    </nav>

    <div class="pdp-grid">
      <div class="pdp-gallery">
        <div class="pdp-stage" id="pdpStage">
          <div class="badges">
            ${product.isNew ? `<span class="badge gold">${esc(t("card.new"))}</span>` : ""}
            ${off > 0 ? `<span class="badge sale">−${off}%</span>` : ""}
          </div>
          <img id="pdpMainImg" src="${esc(gallery[state.gallery])}" alt="${esc(L(product.name))}" decoding="async"
               onerror="this.onerror=null;this.src='${FALLBACK_IMG}'">
        </div>
        <div class="pdp-thumbs" id="pdpThumbs">
          ${gallery.map((src, index) => `
            <button class="pdp-thumb${index === state.gallery ? " is-active" : ""}" type="button" data-thumb="${index}" aria-label="${esc(L(product.name))} ${index + 1}">
              <img src="${esc(src)}" alt="" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_IMG}'">
            </button>`).join("")}
          <button class="pdp-thumb text-thumb" type="button" data-size-guide title="${esc(t("pdp.sizeGuide"))}" aria-label="${esc(t("pdp.sizeGuide"))}">
            <svg width="22" height="22" aria-hidden="true" style="stroke:var(--ink)"><use href="#i-ruler"/></svg>
          </button>
        </div>
      </div>

      <div class="pdp-info">
        <span class="pdp-eyebrow">${esc(catName(product.cat))}</span>
        <h1 class="pdp-title">${esc(L(product.name))}</h1>
        <div class="pdp-rating">
          ${stars(product.rating)}
          <span>${Number(product.rating).toFixed(1)} · ${esc(t("card.reviews", { n: product.reviews }))}</span>
          ${product.soldOut ? "" : `<span class="text-link" data-size-guide style="font-size:11px">${esc(t("pdp.sizeGuide"))}</span>`}
        </div>
        <div class="pdp-price">
          <span class="now">${money(product.price)}</span>
          ${product.oldPrice ? `<span class="old">${money(product.oldPrice)}</span>` : ""}
          ${off > 0 ? `<span class="save">${esc(t("pdp.save", { n: money(product.oldPrice - product.price) }))}</span>` : ""}
        </div>
        <p class="pdp-desc">${esc(L(product.desc))}</p>

        <div class="pdp-block">
          <span class="pdp-label">${esc(t("pdp.color"))} · <span id="pdpColorName">${esc(colorName(state.color) || "—")}</span></span>
          <div class="opt-row" id="pdpColors">
            ${(product.colors || []).map(key => `
              <button class="color-btn${key === state.color ? " is-active" : ""}" type="button" data-color="${esc(key)}" aria-pressed="${key === state.color}">
                <span class="dot" style="background:${colorHex(key)}"></span>${esc(colorName(key))}
              </button>`).join("")}
          </div>
        </div>

        <div class="pdp-block">
          <span class="pdp-label">
            <span>${esc(t("pdp.size"))}</span>
            <button class="linkish" type="button" data-size-guide>${esc(t("pdp.sizeGuide"))}</button>
          </span>
          <div class="opt-row" id="pdpSizes">
            ${(product.sizes || []).map(size => `
              <button class="size-btn${size === state.size ? " is-active" : ""}${product.soldOut ? " is-out" : ""}" type="button" data-size="${esc(size)}">${esc(size)}</button>`).join("")}
          </div>
        </div>

        <div class="pdp-block">
          <span class="pdp-label">${esc(t("pdp.qty"))}</span>
          <div class="buy-row">
            <div class="qty-stepper">
              <button type="button" data-qty-step="-1" aria-label="−">−</button>
              <span id="pdpQty">1</span>
              <button type="button" data-qty-step="1" aria-label="+">+</button>
            </div>
            <div id="pdpStock">${stockLine}</div>
          </div>
        </div>

        ${product.soldOut ? "" : `<p class="pdp-alert ok" style="margin-top:0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 3h13v13H1z"/><path d="M14 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="17.5" cy="18.5" r="2"/></svg>
          ${esc(t("pdp.freeShip", { n: state.settings.freeShipItems }))}
        </p>`}

        <div class="pdp-buy">
          <button class="btn full main" type="button" id="pdpAdd" ${product.soldOut ? "disabled" : ""}>
            ${esc(product.soldOut ? t("pdp.out") : t("pdp.add"))} — ${money(product.price)}
          </button>
          <div class="buy-row" style="width:100%">
            <button class="btn ghost" type="button" id="pdpBuyNow" style="flex:1" ${product.soldOut ? "disabled" : ""}>${esc(t("pdp.buy"))}</button>
            <button class="btn ghost" type="button" id="pdpWish" style="width:52px;padding:0" aria-pressed="${inWish}" aria-label="${esc(t("wish.added"))}">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="${inWish ? "currentColor" : "none"}" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20.5s-7.5-4.7-7.5-10.3A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 3c0 5.6-7.5 10.3-7.5 10.3z"/></svg>
            </button>
          </div>
          <a class="btn light ghost" href="#" id="pdpWhats" style="border-color:var(--line-2);color:var(--ink)">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.03c-.24.68-1.4 1.3-1.93 1.35-.53.05-1.02.24-3.47-.72-2.95-1.16-4.8-4.2-4.95-4.4-.14-.2-1.17-1.55-1.17-2.96 0-1.4.73-2.09 1-2.38.26-.29.57-.36.76-.36.19 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2 .89 2.14.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.75 1.24 1.61 2.01 1.11.99 2.04 1.3 2.33 1.45.29.15.46.12.63-.07.17-.19.73-.85.93-1.14.19-.29.39-.24.65-.15.27.1 1.7.8 1.99.95.29.15.48.22.55.34.07.13.07.75-.17 1.43z"/></svg>
            ${esc(t("pdp.waAsk"))}
          </a>
        </div>

        <div class="pdp-facts">
          <div class="pdp-fact"><strong>${esc(t("pdp.factCat"))}</strong><span>${esc(catName(product.cat))}</span></div>
          <div class="pdp-fact"><strong>${esc(t("pdp.factFit"))}</strong><span>${esc(t("pdp.fitVal"))}</span></div>
          <div class="pdp-fact"><strong>${esc(t("pdp.factCare"))}</strong><span>${esc(t("pdp.careVal"))}</span></div>
          <div class="pdp-fact"><strong>${esc(t("pdp.factOrig"))}</strong><span>${esc(t("pdp.origVal"))}</span></div>
        </div>

        <div class="pdp-accordion">
          <div class="acc-item is-open">
            <button class="acc-head" type="button" aria-expanded="true"><span>${esc(t("acc.details"))}</span>
              <svg class="chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>
            <div class="acc-body"><div class="acc-inner">${esc(L(product.desc))}</div></div>
          </div>
          <div class="acc-item">
            <button class="acc-head" type="button" aria-expanded="false"><span>${esc(t("acc.features"))}</span>
              <svg class="chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>
            <div class="acc-body"><div class="acc-inner"><ul>${features.map(f => `<li>${esc(f)}</li>`).join("")}</ul></div></div>
          </div>
          <div class="acc-item">
            <button class="acc-head" type="button" aria-expanded="false"><span>${esc(t("acc.ship"))}</span>
              <svg class="chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>
            <div class="acc-body"><div class="acc-inner">${esc(t("acc.shipText"))}</div></div>
          </div>
          <div class="acc-item">
            <button class="acc-head" type="button" aria-expanded="false"><span>${esc(t("acc.care"))}</span>
              <svg class="chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>
            <div class="acc-body"><div class="acc-inner">${esc(t("acc.careText"))}</div></div>
          </div>
        </div>

        <div class="pdp-share">
          <span>${esc(t("pdp.share"))}</span>
          <button type="button" data-share="copy" aria-label="Copier le lien">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/></svg>
          </button>
          <button type="button" data-share="wa" aria-label="WhatsApp">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.03c-.24.68-1.4 1.3-1.93 1.35-.53.05-1.02.24-3.47-.72-2.95-1.16-4.8-4.2-4.95-4.4-.14-.2-1.17-1.55-1.17-2.96 0-1.4.73-2.09 1-2.38.26-.29.57-.36.76-.36.19 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2 .89 2.14.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.75 1.24 1.61 2.01 1.11.99 2.04 1.3 2.33 1.45.29.15.46.12.63-.07.17-.19.73-.85.93-1.14.19-.29.39-.24.65-.15.27.1 1.7.8 1.99.95.29.15.48.22.55.34.07.13.07.75-.17 1.43z"/></svg>
          </button>
        </div>
      </div>
    </div>

    <p class="muted" style="font-size:11px;margin-top:12px">${esc(table.fit[state.lang] || table.fit.fr)}</p>
    <button class="btn ghost sm" type="button" data-home style="margin-top:18px"><span class="arrow left" aria-hidden="true"></span> ${esc(t("pdp.back"))}</button>

    <section class="pdp-reviews">
      <div class="section-head" style="margin-bottom:18px">
        <div>
          <span class="eyebrow">${esc(t("rev.eyebrow"))}</span>
          <h2 style="font-size:clamp(20px,2.4vw,28px)">${esc(t("rev.title"))}</h2>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          ${stars(product.rating)}
          <strong style="font-family:var(--font-display);font-size:16px">${Number(product.rating).toFixed(1)}/5</strong>
        </div>
      </div>
      <div class="review-grid" id="pdpReviews"></div>
    </section>

    <section class="related">
      <div class="section-head"><div><span class="eyebrow">${esc(t("pdp.related"))}</span><h2 style="font-size:clamp(22px,2.6vw,30px)">${esc(t("pdp.related"))}</h2></div></div>
      <div class="product-grid cols-3" id="relatedGrid"></div>
    </section>

    <div class="pdp-stickybar" id="pdpSticky">
      <img src="${esc(product.img || FALLBACK_IMG)}" alt="" aria-hidden="true" onerror="this.onerror=null;this.src='${FALLBACK_IMG}'">
      <div class="psb-info">
        <strong>${esc(L(product.name))}</strong>
        <span>${money(product.price * state.qty)}</span>
      </div>
      <button class="btn" type="button" data-sticky-add>${esc(product.soldOut ? t("badge.out") : t("pdp.addShort"))}</button>
    </div>`;

  const pdpReviews = $("#pdpReviews");
  if (pdpReviews) {
    const initials = name => L(name).split(" ")[0].slice(0, 1).toUpperCase();
    pdpReviews.innerHTML = REVIEWS.slice(0, 3).map(review => `
      <article class="review-card">
        ${stars(review.stars)}
        <blockquote>“${esc(L(review.text))}”</blockquote>
        <div class="review-who">
          <span class="avatar" aria-hidden="true">${esc(initials(review.name))}</span>
          <div>
            <strong>${esc(L(review.name))}</strong>
            <span>${esc(L(review.city))}</span>
            <span class="verified">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
              ${esc(t("rev.verified"))}
            </span>
          </div>
        </div>
      </article>`).join("");
  }

  const related = state.products
    .filter(p => p.id !== product.id && p.cat === product.cat)
    .concat(state.products.filter(p => p.id !== product.id && p.cat !== product.cat))
    .slice(0, 3);
  const relatedGrid = $("#relatedGrid");
  if (relatedGrid) relatedGrid.innerHTML = related.map(productCard).join("");

  const pdpWhats = $("#pdpWhats");
  if (pdpWhats) {
    pdpWhats.href = waLink(t("wa.ask", { name: L(product.name) }));
    pdpWhats.target = "_blank";
    pdpWhats.rel = "noopener";
  }

  bindAccordions(view);
  observeReveals();

  setView("product");
  if (!options.silent) {
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (err) { /* ignoré */ }
  }
}

function updateStickyPrice() {
  const bar = $("#pdpSticky");
  const product = productById(state.product);
  if (!bar || !product) return;
  const label = bar.querySelector(".psb-info span");
  if (label) label.textContent = money(product.price * state.qty);
}

function productGallery(product) {
  const list = [product.img || FALLBACK_IMG];
  const lifestyle = "assets/story.jpg";
  if (!list.includes(lifestyle)) list.push(lifestyle);
  return list;
}

function setView(mode) {
  const home = $("#homeView");
  const view = $("#productView");
  if (home) home.hidden = mode !== "home";
  if (view) view.hidden = mode !== "product";
  document.body.classList.toggle("has-sticky", mode === "product");
  if (mode !== "product") document.body.classList.remove("show-sticky");
  if (typeof window.__leosOnScroll === "function") window.__leosOnScroll();
}

function showHome(scroll) {
  state.product = null;
  setView("home");
  if (scroll) {
    const shop = $("#shop");
    if (shop && shop.scrollIntoView) shop.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/* ---------- Aperçu rapide ---------- */
function openQuickView(id) {
  const product = productById(id);
  const body = $("#quickViewBody");
  if (!product || !body) return;
  const sizes = product.sizes || [];
  state.quick.pid = product.id;
  state.quick.size = sizes.length === 1 ? sizes[0] : null;
  state.quick.color = (product.colors || [])[0] || null;
  const preselect = state.quick.size;
  body.innerHTML = `
    <div class="quick-view">
      <div class="qv-media">
        <img src="${esc(product.img || FALLBACK_IMG)}" alt="${esc(L(product.name))}" onerror="this.onerror=null;this.src='${FALLBACK_IMG}'">
      </div>
      <div class="qv-body">
        <span class="pdp-eyebrow">${esc(catName(product.cat))}</span>
        <h3 style="font-size:22px">${esc(L(product.name))}</h3>
        <div class="rating-row">${stars(product.rating)}<span>${esc(t("card.reviews", { n: product.reviews }))}</span></div>
        <div class="pdp-price">
          <span class="now">${money(product.price)}</span>
          ${product.oldPrice ? `<span class="old">${money(product.oldPrice)}</span>` : ""}
        </div>
        <p class="muted" style="font-size:12.5px;line-height:1.7">${esc(L(product.desc)).slice(0, 170)}…</p>
        <div class="pdp-block">
          <span class="pdp-label">${esc(t("pdp.color"))}</span>
          <div class="opt-row" data-qv-colors>
            ${(product.colors || []).map((key, index) => `
              <button class="color-btn${key === state.quick.color ? " is-active" : ""}" type="button" data-color="${esc(key)}">
                <span class="dot" style="background:${colorHex(key)}"></span>${esc(colorName(key))}
              </button>`).join("")}
          </div>
        </div>
        <div class="pdp-block">
          <span class="pdp-label"><span>${esc(t("pdp.size"))}</span>
            <button class="linkish" type="button" data-size-guide>${esc(t("pdp.sizeGuide"))}</button>
          </span>
          <div class="opt-row" data-qv-sizes>
            ${sizes.map(size => `
              <button class="size-btn${size === preselect ? " is-active" : ""}" type="button" data-size="${esc(size)}">${esc(size)}</button>`).join("")}
          </div>
        </div>
        <button class="btn full" type="button" data-qv-add="${esc(product.id)}" ${product.soldOut ? "disabled" : ""}>
          ${esc(product.soldOut ? t("badge.out") : t("pdp.add"))} — ${money(product.price)}
        </button>
        <button class="btn ghost full" type="button" data-qv-open="${esc(product.id)}">${esc(t("card.view"))}</button>
      </div>
    </div>`;
  openModal("#quickViewWrap");
}

/* ---------- Guide des tailles ---------- */
function openSizeGuide(cat) {
  const body = $("#sizeGuideBody");
  if (!body) return;
  const key = SIZE_TABLE[cat] ? cat : "Hoodies";
  const table = SIZE_TABLE[key];
  const localized = state.lang === "ar" && table.ar ? table.ar : table;
  body.innerHTML = `
    <p class="muted" style="font-size:12.5px;margin-bottom:14px">${esc(catName(key))}</p>
    <table class="size-guide-table">
      <thead><tr><th>${esc(t("size.col1"))}</th>${localized.head.map(h => `<th>${esc(h)}</th>`).join("")}</tr></thead>
      <tbody>
        ${localized.rows.map(row => `<tr><th style="text-align:start;background:var(--cream-2)">${esc(row[0])}</th>${row.slice(1).map(cell => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}
      </tbody>
    </table>
    <p class="size-guide-note">${esc(table.fit[state.lang] || table.fit.fr)}<br>${esc(t("size.note"))}</p>
    <a class="btn whats full" href="${waLink(t("size.cta"))}" target="_blank" rel="noopener" style="margin-top:14px">${esc(t("size.cta"))}</a>`;
  openModal("#sizeGuideWrap");
}
