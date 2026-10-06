/* ============================================================
   LEO'S — Moteur applicatif (3/3) : interactions
   ============================================================ */

/* ---------- Liens WhatsApp ---------- */
function waLink(text) {
  const number = String(state.settings.whatsapp || "").replace(/\D/g, "");
  const message = text || t("wa.hello");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function updateWhatsAppLinks() {
  const text = t("wa.hello");
  ["#whatsappFloat", "#footerWhatsApp", "#mobileWhats"].forEach(sel => {
    const el = $(sel);
    if (el) { el.href = waLink(text); el.target = "_blank"; el.rel = "noopener"; }
  });
  const track = $("#footerTrack");
  if (track) track.setAttribute("data-track", "1");
}

/* ---------- Verrou de défilement ---------- */
let scrollLocks = 0;
function lockScroll() {
  scrollLocks += 1;
  document.body.classList.add("no-scroll");
}
function unlockScroll() {
  scrollLocks = Math.max(0, scrollLocks - 1);
  if (scrollLocks === 0) document.body.classList.remove("no-scroll");
}

/* ---------- Modales ---------- */
const modalStack = [];
let lastFocused = null;

function openModal(selector) {
  const el = $(selector);
  if (!el || modalStack.indexOf(selector) !== -1) return;
  lastFocused = document.activeElement;
  el.hidden = false;
  void el.offsetWidth; /* force le calcul du style pour lancer la transition */
  el.classList.add("is-open");
  el.setAttribute("aria-hidden", "false");
  modalStack.push(selector);
  lockScroll();
  const focusable = el.querySelector("input, select, textarea, button, [href]");
  setTimeout(() => { if (focusable) focusable.focus({ preventScroll: true }); }, 120);
}

function closeModal(selector) {
  const el = $(selector);
  if (!el) return;
  el.classList.remove("is-open");
  el.setAttribute("aria-hidden", "true");
  const index = modalStack.indexOf(selector);
  if (index !== -1) modalStack.splice(index, 1);
  unlockScroll();
  if (selector === "#cartDrawer") setTimeout(() => { const overlay = $("#cartOverlay"); if (overlay) overlay.hidden = true; }, 480);
  if (lastFocused && lastFocused.focus) setTimeout(() => lastFocused.focus({ preventScroll: true }), 60);
}

function openCart() {
  const overlay = $("#cartOverlay");
  if (overlay) overlay.hidden = false;
  const drawer = $("#cartDrawer");
  if (drawer) drawer.setAttribute("aria-hidden", "false");
  void (drawer ? drawer.offsetWidth : 0);
  if (overlay) overlay.classList.add("is-open");
  if (drawer) drawer.classList.add("is-open");
  if (modalStack.indexOf("#cartDrawer") === -1) modalStack.push("#cartDrawer");
}

function closeCart() {
  const overlay = $("#cartOverlay");
  if (overlay) overlay.classList.remove("is-open");
  const drawer = $("#cartDrawer");
  if (drawer) { drawer.classList.remove("is-open"); drawer.setAttribute("aria-hidden", "true"); }
  const index = modalStack.indexOf("#cartDrawer");
  if (index !== -1) modalStack.splice(index, 1);
  setTimeout(() => { if (overlay) overlay.hidden = true; }, 480);
}

function closeTopLayer() {
  const top = modalStack[modalStack.length - 1];
  if (!top) return;
  if (top === "#cartDrawer") closeCart();
  else if (top === "#checkoutWrap") closeCheckout();
  else closeModal(top);
}

/* ---------- Panier : opérations ---------- */
function trackEvent(name, data) {
  try {
    if (window.fbq) window.fbq("track", name, data);
    if (window.ttq) window.ttq.track(name, data);
  } catch (err) { /* pixels indisponibles */ }
}

function addToCart(pid, size, color, qty, options) {
  const product = productById(pid);
  const opts = options || {};
  if (!product || product.soldOut) return false;
  if (!size) { showToast(t("bag.sizeNeeded")); return false; }
  const amount = Math.max(1, Number(qty) || 1);
  const existing = state.cart.find(item => item.pid === pid && item.size === size && (item.color || "") === (color || ""));
  if (existing) {
    if (existing.qty + amount > 10) { showToast(t("bag.max")); return false; }
    existing.qty += amount;
  } else {
    state.cart.push({ pid, size, color: color || null, qty: amount });
  }
  save(LS.cart, state.cart);
  renderCart();
  renderCombo();
  trackEvent("AddToCart", { content_ids: [pid], value: product.price * amount, currency: "DZD" });
  if (!opts.silent) showToast(t("bag.addedQty", { qty: amount, name: L(product.name) }));
  if (opts.openCart !== false) openCart();
  return true;
}

function changeQty(pid, size, color, delta) {
  const item = state.cart.find(i => i.pid === pid && i.size === size && (i.color || "") === (color || ""));
  if (!item) return;
  item.qty += Number(delta) || 0;
  if (item.qty <= 0) state.cart = state.cart.filter(i => i !== item);
  else if (item.qty > 10) item.qty = 10;
  save(LS.cart, state.cart);
  renderCart();
  renderCombo();
  if ($("#checkoutWrap") && $("#checkoutWrap").classList.contains("is-open")) renderCheckoutSummary();
}

function removeItem(pid, size, color) {
  state.cart = state.cart.filter(i => !(i.pid === pid && i.size === size && (i.color || "") === (color || "")));
  save(LS.cart, state.cart);
  renderCart();
  renderCombo();
  showToast(t("bag.removed"));
}

function clearCart() {
  state.cart = [];
  save(LS.cart, state.cart);
  renderCart();
  renderCombo();
}

/* ---------- Wilayas ---------- */
function populateWilayas() {
  const select = $("#customerWilaya");
  if (!select) return;
  const current = select.value || state.wilaya;
  select.innerHTML = `<option value="">${esc(t("form.wilayaPh"))}</option>` + WILAYAS.map(w => {
    const name = state.lang === "ar" ? w[2] : w[1];
    return `<option value="${w[0]}">${w[0]} · ${esc(name)}</option>`;
  }).join("");
  if (current && wilayaByCode(current)) select.value = current;
}

/* ---------- Commande ---------- */
function renderCheckoutSummary() {
  const wrap = $("#checkoutSummary");
  if (!wrap) return;
  const lines = cartLines();
  const count = cartCount();
  const rate = discountRate();
  const off = discountValue();
  const fee = shippingFee();
  const freeAt = Math.max(1, Number(state.settings.freeShipItems) || 2);
  const feeLabel = count >= freeAt
    ? t("form.feeFree")
    : `${money(fee)}`;

  wrap.innerHTML = `
    <div class="row" style="font-weight:700"><span>${esc(t("summary.title"))}</span><span>${esc(t("summary.items", { n: count }))}</span></div>
    <div class="order-lines">
      ${lines.map(line => `
        <div class="order-line">
          <img src="${esc(line.product.img || FALLBACK_IMG)}" alt="" loading="lazy">
          <span>${esc(L(line.product.name))}<br><span class="muted">${esc(t("cart.size"))} ${esc(line.size)} · ${line.qty}×</span></span>
          <span class="oline-end">${money(line.line)}</span>
        </div>`).join("")}
    </div>
    <div class="row"><span>${esc(t("summary.subtotal"))}</span><span>${money(subtotal())}</span></div>
    ${off ? `<div class="row discount"><span>${esc(t("summary.discount"))} (${rate} %)</span><span>− ${money(off)}</span></div>` : ""}
    <div class="row"><span>${esc(t("summary.ship", { mode: t(state.mode === "desk" ? "mode.desk" : "mode.home") }))}</span><span>${state.wilaya ? feeLabel : "—"}</span></div>
    <div class="row total"><span>${esc(t("summary.total"))}</span><span>${money(Math.max(0, subtotal() - off + (count >= freeAt ? 0 : fee)))}</span></div>`;

  $$("[data-mode-fee]").forEach(el => {
    const mode = el.getAttribute("data-mode-fee");
    const code = state.wilaya || "16";
    const value = count >= freeAt ? t("form.feeFree") : money(feeForMode(code, mode));
    el.textContent = value;
  });
}

function validateCheckout() {
  const checks = [
    { id: "customerName", key: "name", test: value => value.trim().length >= 3 },
    { id: "customerPhone", key: "phone", test: value => isValidPhone(value) },
    { id: "customerWilaya", key: "wilaya", test: value => Boolean(value) && Boolean(wilayaByCode(value)) },
    { id: "customerAddress", key: "address", test: value => value.trim().length >= 6 }
  ];
  let firstError = null;
  checks.forEach(check => {
    const input = document.getElementById(check.id);
    const field = input ? input.closest(".field") : null;
    const err = field ? field.querySelector(".err") : null;
    const valid = input ? check.test(input.value) : false;
    if (field) field.classList.toggle("has-error", !valid);
    if (err) err.textContent = valid ? "" : t(`err.${check.key}`);
    if (!valid && !firstError) firstError = input;
  });
  return firstError;
}

function buildOrder() {
  const name = $("#customerName").value.trim();
  const phoneRaw = $("#customerPhone").value.trim();
  const wilayaCode = $("#customerWilaya").value;
  const address = $("#customerAddress").value.trim();
  const note = $("#customerNote").value.trim();
  const now = new Date();
  const stamp = String(now.getFullYear()).slice(2) +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");
  const ref = `LEO-${stamp}-${Math.floor(100 + Math.random() * 900)}`;

  return {
    ref,
    date: now.toISOString(),
    name,
    phone: phoneRaw,
    phoneIntl: internationalPhone(phoneRaw),
    wilaya: wilayaCode,
    wilayaName: `${wilayaCode} · ${wilayaByCode(wilayaCode) ? (state.lang === "ar" ? wilayaByCode(wilayaCode)[2] : wilayaByCode(wilayaCode)[1]) : ""}`,
    mode: state.mode,
    address,
    note,
    lang: state.lang,
    items: cartLines().map(line => ({
      pid: line.pid,
      name: L(line.product.name),
      size: line.size,
      color: line.color ? colorName(line.color) : "",
      qty: line.qty,
      price: line.product.price
    })),
    subtotal: subtotal(),
    discount: discountValue(),
    shipping: shippingFee(),
    total: orderTotal()
  };
}

function orderMessage(order) {
  const lines = order.items.map(item =>
    `• ${item.qty} × ${item.name} — ${t("cart.size")} ${item.size}${item.color ? ` · ${item.color}` : ""} — ${money(item.price * item.qty)}`);
  return [
    t("wa.order"),
    `${t("confirm.refLabel")} : ${order.ref}`,
    "",
    ...lines,
    "",
    `${t("summary.subtotal")} : ${money(order.subtotal)}`,
    order.discount ? `${t("summary.discount")} : − ${money(order.discount)}` : "",
    `${t("summary.ship", { mode: t(order.mode === "desk" ? "mode.desk" : "mode.home") })} : ${order.shipping === 0 ? t("form.feeFree") : money(order.shipping)}`,
    `${t("summary.total")} : ${money(order.total)}`,
    "",
    `${t("form.name")} : ${order.name}`,
    `${t("form.phone")} : ${order.phoneIntl}`,
    `${t("form.wilaya")} : ${order.wilayaName}`,
    `${t("form.address")} : ${order.address}`,
    order.note ? `${t("form.note")} : ${order.note}` : ""
  ].filter(Boolean).join("\n");
}

let pendingClear = false;

function submitOrder(event) {
  event.preventDefault();
  if (!cartCount()) { showToast(t("checkout.empty")); return; }
  const firstError = validateCheckout();
  if (firstError) {
    firstError.focus();
    firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  const order = buildOrder();
  state.orders.unshift(order);
  state.orders = state.orders.slice(0, 60);
  save(LS.orders, state.orders);
  state.lastOrder = order;
  trackEvent("Purchase", { value: order.total, currency: "DZD" });

  const confirmSummary = $("#confirmSummary");
  if (confirmSummary) {
    confirmSummary.innerHTML = `
      <div class="order-summary">
        <div class="row"><span>${esc(t("summary.items", { n: order.items.length }))}</span><span>${money(order.subtotal)}</span></div>
        ${order.discount ? `<div class="row discount"><span>${esc(t("summary.discount"))}</span><span>− ${money(order.discount)}</span></div>` : ""}
        <div class="row"><span>${esc(t("summary.ship", { mode: t(order.mode === "desk" ? "mode.desk" : "mode.home") }))}</span><span>${order.shipping === 0 ? esc(t("form.feeFree")) : money(order.shipping)}</span></div>
        <div class="row total"><span>${esc(t("summary.total"))}</span><span>${money(order.total)}</span></div>
      </div>`;
  }

  const ref = $("#confirmRef");
  if (ref) ref.textContent = order.ref;
  const whats = $("#confirmWhats");
  if (whats) { whats.href = waLink(orderMessage(order)); whats.target = "_blank"; whats.rel = "noopener"; }

  const step1 = $("#checkoutStep1");
  const step2 = $("#checkoutStep2");
  if (step1) step1.hidden = true;
  if (step2) step2.hidden = false;
  pendingClear = true;
  showToast(t("confirm.thanks", { name: order.name.split(" ")[0], ref: order.ref }));
  renderAdmin();
}

function finishOrder() {
  if (!pendingClear) return;
  pendingClear = false;
  clearCart();
  const form = $("#checkoutForm");
  if (form) form.reset();
  $$(".field.has-error").forEach(field => field.classList.remove("has-error"));
  $$(".err").forEach(err => { err.textContent = ""; });
  const step1 = $("#checkoutStep1");
  const step2 = $("#checkoutStep2");
  if (step1) step1.hidden = false;
  if (step2) step2.hidden = true;
}

function openCheckout() {
  if (!cartCount()) { showToast(t("checkout.empty")); return; }
  closeCart();
  const select = $("#customerWilaya");
  if (select && !select.value) { select.value = ""; }
  renderCheckoutSummary();
  openModal("#checkoutWrap");
}

function closeCheckout() {
  finishOrder();
  closeModal("#checkoutWrap");
}

/* ---------- Espace gestion ---------- */
function renderAdmin() {
  const countEl = $("#adminProductCount");
  if (countEl) countEl.textContent = state.products.length;
  const ordersEl = $("#adminOrderCount");
  if (ordersEl) ordersEl.textContent = state.orders.length;
  const summary = $("#adminOfferSummary");
  if (summary) summary.textContent = state.lang === "ar"
    ? `‎-${state.settings.discount}٪ من ${state.settings.minimumItems} قطع`
    : `−${state.settings.discount} % dès ${state.settings.minimumItems} articles`;

  const list = $("#adminProductList");
  if (list) {
    list.innerHTML = state.products.map(product => `
      <div class="admin-product-row">
        <img src="${esc(product.img || FALLBACK_IMG)}" alt="" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_IMG}'">
        <div class="apr-main">
          <strong>${esc(L(product.name))}</strong>
          <span>${esc(catName(product.cat))} · ${money(product.price)}${product.lowStock ? ` · ${esc(t("cart.size")) === "المقاس" ? "المخزون" : t("admin.stockState")} : ${product.lowStock}` : ""}${product.soldOut ? ` · ${esc(t("admin.soldOut"))}` : ""}</span>
        </div>
        <button class="btn xs ghost" type="button" data-admin-toggle-sold="${esc(product.id)}">${esc(product.soldOut ? (state.lang === "ar" ? "متوفر" : "Remettre en vente") : t("admin.soldOut"))}</button>
        <button class="small-danger" type="button" data-admin-remove="${esc(product.id)}">${esc(t("cart.remove"))}</button>
      </div>`).join("");
  }

  const orders = $("#adminOrders");
  if (orders) {
    orders.innerHTML = state.orders.length
      ? state.orders.slice(0, 6).map(order => `
        <div class="admin-product-row">
          <div class="apr-main">
            <strong>${esc(order.ref)}</strong>
            <span>${esc(order.name)} · ${esc(order.wilayaName || "")} · ${esc(order.mode === "desk" ? t("mode.desk") : t("mode.home"))}</span>
          </div>
          <div style="text-align:end"><strong style="font-size:12.5px">${money(order.total)}</strong><br>
          <a class="text-link" href="${waLink(`${t("wa.order")} — ${order.ref}`)}" target="_blank" rel="noopener" style="font-size:10.5px">WhatsApp</a></div>
        </div>`).join("")
      : `<p class="admin-hint">${esc(t("admin.orders.empty"))}</p>`;
  }

  const fields = {
    "#discountInput": state.settings.discount,
    "#minimumItemsInput": state.settings.minimumItems,
    "#freeShipInput": state.settings.freeShipItems,
    "#feeNorth": state.settings.feeNorth,
    "#feeEastWest": state.settings.feeEastWest,
    "#feeSouth": state.settings.feeSouth,
    "#deskDiscount": state.settings.deskDiscount,
    "#deliveryDays": state.settings.deliveryDays,
    "#whatsappNumber": state.settings.whatsapp,
    "#facebookPixelId": state.settings.facebookPixel,
    "#tiktokPixelId": state.settings.tiktokPixel
  };
  Object.keys(fields).forEach(selector => {
    const input = $(selector);
    if (input && document.activeElement !== input) input.value = fields[selector];
  });
  const toggle = $("#announcementToggle");
  if (toggle) toggle.checked = Boolean(state.settings.showAnnouncement);
}

function applySettings() {
  save(LS.settings, state.settings);
  applyAnnouncement();
  renderDeliveryPanel();
  renderCombo();
  renderCart();
  renderProducts();
  renderCheckoutSummary();
  renderAdmin();
}

function injectAdminButton() {
  if ($("#adminOpen")) return;
  const actions = $(".nav-actions");
  if (!actions) return;
  const btn = document.createElement("button");
  btn.className = "btn xs ghost";
  btn.id = "adminOpen";
  btn.type = "button";
  btn.textContent = t("admin.tab");
  btn.addEventListener("click", () => { renderAdmin(); openModal("#adminWrap"); });
  actions.insertBefore(btn, actions.firstChild);
}

/* ---------- Pixels analytiques ---------- */
function loadPixels() {
  const fb = String(state.settings.facebookPixel || "").trim();
  if (fb && !window.fbq) {
    try {
      window.fbq = function () { window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments); };
      window.fbq.queue = [];
      window.fbq.loaded = true;
      window.fbq.version = "2.0";
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(script);
      window.fbq("init", fb);
      window.fbq("track", "PageView");
    } catch (err) { /* ignoré */ }
  }
  const tt = String(state.settings.tiktokPixel || "").trim();
  if (tt && !window.ttq) {
    try {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${encodeURIComponent(tt)}&lib=ttq`;
      document.head.appendChild(script);
      window.ttq = window.ttq || [];
    } catch (err) { /* ignoré */ }
  }
}

/* ---------- Bandeau d'annonce ---------- */
function applyAnnouncement() {
  const bar = $(".announcement");
  if (!bar) return;
  bar.hidden = !state.settings.showAnnouncement;
  $$("[data-i18n='topbar.main'], [data-i18n='topbar.alt']").forEach(el => {
    el.innerHTML = el.innerHTML.split("{n}").join(state.settings.freeShipItems);
  });
}

/* ---------- Langue ---------- */
function captureOriginals() {
  $$("[data-i18n], [data-i18n-html]").forEach(el => {
    if (el.dataset.frHtml === undefined) el.dataset.frHtml = el.innerHTML;
  });
  $$("[data-i18n-placeholder]").forEach(el => {
    if (el.dataset.frPh === undefined) el.dataset.frPh = el.getAttribute("placeholder") || "";
  });
  $$("[data-i18n-aria]").forEach(el => {
    if (el.dataset.frAria === undefined) el.dataset.frAria = el.getAttribute("aria-label") || "";
  });
}

function applyLang(lang) {
  state.lang = lang === "ar" ? "ar" : "fr";
  const root = document.documentElement;
  root.lang = state.lang;
  root.dir = state.lang === "ar" ? "rtl" : "ltr";
  save(LS.lang, state.lang);

  const dict = I18N[state.lang] || {};
  $$("[data-i18n], [data-i18n-html]").forEach(el => {
    const key = el.getAttribute("data-i18n") || el.getAttribute("data-i18n-html");
    const value = dict[key];
    if (value !== undefined) el.innerHTML = value;
    else if (el.dataset.frHtml !== undefined) el.innerHTML = el.dataset.frHtml;
  });
  $$("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    el.setAttribute("placeholder", dict[key] !== undefined ? dict[key] : (el.dataset.frPh || ""));
  });
  $$("[data-i18n-aria]").forEach(el => {
    const key = el.getAttribute("data-i18n-aria");
    el.setAttribute("aria-label", dict[key] !== undefined ? dict[key] : (el.dataset.frAria || ""));
  });
  $$("[data-lang]").forEach(el => el.classList.toggle("is-current", el.getAttribute("data-lang") === state.lang));

  document.title = state.lang === "ar"
    ? "Leo's — البسها على طريقتك | ستريت وير أوفرسايز الجزائر"
    : "Leo's — Porte-le à ta façon | Streetwear oversize Algérie";

  applyAnnouncement();
  updateWhatsAppLinks();
  populateWilayas();
  renderFilters();
  renderProducts();
  renderReviews();
  renderFaqs();
  renderDeliveryPanel();
  renderCombo();
  renderCart();
  renderAdmin();
  if (state.product) renderProductPage(state.product, { silent: true });
}

function switchLang(lang) {
  if (lang === state.lang) return;
  applyLang(lang);
  const url = new URL(window.location.href);
  url.searchParams.set("lang", lang);
  history.replaceState({}, "", url);
}

/* ---------- Héros 3D ---------- */
function setupHero3D() {
  const stage = $("#stage3d");
  if (!stage) return;
  const floor = $(".stage-floor");
  const base = { rx: -6, ry: 0 };
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let baseRy = 0;
  let baseRx = base.rx;

  const apply = (rx, ry) => {
    stage.style.setProperty("--rx", `${rx}deg`);
    stage.style.setProperty("--ry", `${ry}deg`);
    if (floor) floor.style.setProperty("--floor-scale", String(1 - Math.abs(ry) / 320));
  };

  apply(base.rx, base.ry);

  stage.addEventListener("pointerdown", event => {
    if (event.target.closest("button")) return;
    dragging = true;
    stage.classList.add("is-dragging", "is-grabbing");
    startX = event.clientX;
    startY = event.clientY;
    baseRy = Number(String(stage.style.getPropertyValue("--ry") || "0").replace("deg", "")) || 0;
    baseRx = Number(String(stage.style.getPropertyValue("--rx") || String(base.rx)).replace("deg", "")) || base.rx;
    if (stage.setPointerCapture) stage.setPointerCapture(event.pointerId);
  });

  stage.addEventListener("pointermove", event => {
    if (!dragging) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    const ry = Math.max(-42, Math.min(42, baseRy + dx * 0.45));
    const rx = Math.max(-24, Math.min(20, baseRx - dy * 0.32));
    apply(rx, ry);
  });

  const release = () => {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove("is-dragging", "is-grabbing");
    apply(base.rx, base.ry);
  };
  stage.addEventListener("pointerup", release);
  stage.addEventListener("pointercancel", release);
  stage.addEventListener("pointerleave", release);

  $$("[data-hoodie]").forEach(swatch => {
    swatch.addEventListener("click", () => {
      const color = swatch.getAttribute("data-hoodie");
      stage.style.color = color;
      $$("[data-hoodie]").forEach(other => other.classList.toggle("is-active", other === swatch));
    });
  });
  stage.style.color = "#1b3c2c";
}

/* ---------- Apparition au défilement ---------- */
let revealObserver = null;
function observeReveals() {
  if (!("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("reveal-ready");
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.05 });
    /* Filet de sécurité : rien ne reste invisible plus de 4 s */
    setTimeout(() => {
      $$(".reveal:not(.is-in)").forEach((el, index) => {
        setTimeout(() => el.classList.add("is-in"), index * 40);
      });
    }, 4000);
  }
  $$(".reveal:not(.is-in)").forEach(el => revealObserver.observe(el));
}

/* ---------- Accordéons ---------- */
function bindAccordions(root) {
  $$(".acc-head", root || document).forEach(head => {
    if (head.dataset.bound) return;
    head.dataset.bound = "1";
    head.addEventListener("click", () => {
      const item = head.closest(".acc-item");
      if (!item) return;
      const isOpen = item.classList.toggle("is-open");
      head.setAttribute("aria-expanded", String(isOpen));
    });
  });
}

/* ---------- Recherche produit dans l'URL ---------- */
function urlParam(name) {
  try { return new URLSearchParams(window.location.search).get(name); }
  catch (err) { return null; }
}

/* ============================================================
   ÉVÉNEMENTS
   ============================================================ */
function bindEvents() {
  /* --- Navigation & langue --- */
  $$("[data-lang]").forEach(el => {
    el.addEventListener("click", event => {
      event.preventDefault();
      switchLang(el.getAttribute("data-lang"));
    });
  });

  const menuToggle = $("#menuToggle");
  const mobileMenu = $("#mobileMenu");
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("is-open");
      mobileMenu.setAttribute("aria-hidden", String(!open));
      menuToggle.setAttribute("aria-expanded", String(open));
      if (open) lockScroll(); else unlockScroll();
    });
    const closeMenu = () => {
      if (!mobileMenu.classList.contains("is-open")) return;
      mobileMenu.classList.remove("is-open");
      mobileMenu.setAttribute("aria-hidden", "true");
      menuToggle.setAttribute("aria-expanded", "false");
      unlockScroll();
    };
    const menuClose = $("#menuClose");
    if (menuClose) menuClose.addEventListener("click", closeMenu);
    $$("a", mobileMenu).forEach(link => link.addEventListener("click", closeMenu));
  }

  const header = $("#siteHeader");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-stuck", window.scrollY > 8);
      const inProduct = Boolean(state.product) && $("#productView") && !$("#productView").hidden;
      document.body.classList.toggle("show-sticky", inProduct && window.scrollY > 420);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.__leosOnScroll = onScroll;
    onScroll();
  }

  /* --- Boutique : filtres, tri, recherche --- */
  const filters = $("#filters");
  if (filters) {
    filters.addEventListener("click", event => {
      const chip = event.target.closest("[data-filter]");
      if (!chip) return;
      state.filter = chip.getAttribute("data-filter");
      renderFilters();
      renderProducts();
    });
  }
  const sort = $("#sortSelect");
  if (sort) sort.addEventListener("change", () => { state.sort = sort.value; renderProducts(); });
  const search = $("#productSearch");
  if (search) {
    search.addEventListener("input", debounce(() => {
      state.search = search.value;
      renderProducts();
    }, 220));
  }
  $$("[data-nav-filter]").forEach(link => {
    link.addEventListener("click", () => {
      const cat = link.getAttribute("data-nav-filter");
      if (cat && (CATS[cat] || state.products.some(p => p.cat === cat))) {
        state.filter = cat;
        state.search = "";
        if (search) search.value = "";
        renderFilters();
        renderProducts();
      }
    });
  });

  /* --- Héros --- */
  const comboBtn = $("#heroComboBtn");
  if (comboBtn) comboBtn.addEventListener("click", () => openCart());
  const comboButton = $("#comboButton");
  if (comboButton) comboButton.addEventListener("click", () => {
    const shop = $("#shop");
    if (shop) shop.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  /* --- Panier --- */
  const cartOpen = $("#cartOpen");
  if (cartOpen) cartOpen.addEventListener("click", openCart);
  const cartClose = $("#cartClose");
  if (cartClose) cartClose.addEventListener("click", closeCart);
  const overlay = $("#cartOverlay");
  if (overlay) {
    overlay.hidden = true;
    overlay.addEventListener("click", closeCart);
  }

  /* --- Modales --- */
  const closers = {
    "#quickViewClose": "#quickViewWrap",
    "#checkoutClose": null,
    "#sizeGuideClose": "#sizeGuideWrap",
    "#adminClose": "#adminWrap"
  };
  Object.keys(closers).forEach(selector => {
    const btn = $(selector);
    if (!btn) return;
    btn.addEventListener("click", () => {
      if (selector === "#checkoutClose") closeCheckout();
      else closeModal(closers[selector]);
    });
  });
  ["#quickViewWrap", "#checkoutWrap", "#sizeGuideWrap", "#adminWrap"].forEach(selector => {
    const wrap = $(selector);
    if (!wrap) return;
    wrap.addEventListener("click", event => {
      if (event.target !== wrap) return;
      if (selector === "#checkoutWrap") closeCheckout();
      else closeModal(selector);
    });
  });
  document.addEventListener("keydown", event => {
    /* Piège à focus : la tabulation reste dans la couche ouverte */
    if (event.key === "Tab" && modalStack.length) {
      const layer = $(modalStack[modalStack.length - 1]);
      if (layer) {
        const focusables = $$("a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])", layer)
          .filter(el => el.offsetParent !== null || el === document.activeElement);
        if (focusables.length) {
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
      }
    }
    if (event.key !== "Escape") return;
    const mobileMenu = $("#mobileMenu");
    if (mobileMenu && mobileMenu.classList.contains("is-open")) { $("#menuClose").click(); return; }
    closeTopLayer();
  });

  /* --- Clics délégués sur les produits, le panier, la fiche produit --- */
  document.addEventListener("click", event => {
    const target = event.target;

    const openLink = target.closest("[data-open-link]");
    if (openLink) {
      event.preventDefault();
      renderProductPage(openLink.getAttribute("data-open-link"));
      return;
    }
    const quick = target.closest("[data-quick]");
    if (quick) { event.stopPropagation(); openQuickView(quick.getAttribute("data-quick")); return; }
    const openMedia = target.closest("[data-open]");
    if (openMedia) { renderProductPage(openMedia.getAttribute("data-open")); return; }

    const wish = target.closest("[data-wish]");
    if (wish) {
      const id = wish.getAttribute("data-wish");
      const index = state.wish.indexOf(id);
      if (index === -1) { state.wish.push(id); showToast(t("wish.added"), "heart"); }
      else { state.wish.splice(index, 1); showToast(t("wish.removed")); }
      save(LS.wish, state.wish);
      wish.classList.toggle("is-on", index === -1);
      wish.setAttribute("aria-pressed", String(index === -1));
      return;
    }

    const homeLink = target.closest("[data-home]");
    if (homeLink) { event.preventDefault(); showHome(true); return; }

    const cartShop = target.closest("[data-cart-shop]");
    if (cartShop) { closeCart(); showHome(true); return; }

    const sizeGuide = target.closest("[data-size-guide]");
    if (sizeGuide) {
      const product = productById(state.product);
      openSizeGuide(product ? product.cat : "Hoodies");
      return;
    }

    const thumb = target.closest("[data-thumb]");
    if (thumb) {
      state.gallery = Number(thumb.getAttribute("data-thumb")) || 0;
      const product = productById(state.product);
      const gallery = product ? productGallery(product) : [];
      const main = $("#pdpMainImg");
      if (main && gallery[state.gallery]) main.src = gallery[state.gallery];
      $$("#pdpThumbs .pdp-thumb").forEach(el => el.classList.toggle("is-active", el === thumb));
      return;
    }

    const stage = target.closest("#pdpStage");
    if (stage && !target.closest("button")) { stage.classList.toggle("is-zoom"); return; }

    const qty = target.closest("[data-qty]");
    if (qty) {
      changeQty(qty.getAttribute("data-qty"), qty.getAttribute("data-size"), qty.getAttribute("data-color"), qty.getAttribute("data-delta"));
      return;
    }
    const remove = target.closest("[data-remove]");
    if (remove) {
      removeItem(remove.getAttribute("data-remove"), remove.getAttribute("data-size"), remove.getAttribute("data-color"));
      return;
    }
    if (target.closest("#checkoutButton")) { openCheckout(); return; }

    /* Fiche produit */
    const colorBtn = target.closest("[data-qv-colors] [data-color]");
    if (colorBtn) {
      state.quick.color = colorBtn.getAttribute("data-color");
      const group = colorBtn.closest("[data-qv-colors]");
      if (group) $$("[data-color]", group).forEach(el => el.classList.toggle("is-active", el === colorBtn));
      return;
    }
    const pdpColor = target.closest("#pdpColors [data-color]");
    if (pdpColor) {
      state.color = pdpColor.getAttribute("data-color");
      const group = $("#pdpColors");
      if (group) $$("[data-color]", group).forEach(el => el.classList.toggle("is-active", el === pdpColor));
      const label = $("#pdpColorName");
      if (label) label.textContent = colorName(state.color);
      return;
    }

    const qvSize = target.closest("[data-qv-sizes] [data-size]");
    if (qvSize) {
      state.quick.size = qvSize.getAttribute("data-size");
      const group = qvSize.closest("[data-qv-sizes]");
      if (group) $$("[data-size]", group).forEach(el => el.classList.toggle("is-active", el === qvSize));
      return;
    }
    const pdpSize = target.closest("#pdpSizes [data-size]");
    if (pdpSize) {
      state.size = pdpSize.getAttribute("data-size");
      const group = $("#pdpSizes");
      if (group) $$("[data-size]", group).forEach(el => el.classList.toggle("is-active", el === pdpSize));
      return;
    }

    const qtyStep = target.closest("[data-qty-step]");
    if (qtyStep) {
      state.qty = Math.max(1, Math.min(10, state.qty + Number(qtyStep.getAttribute("data-qty-step"))));
      const label = $("#pdpQty");
      if (label) label.textContent = state.qty;
      const add = $("#pdpAdd");
      const product = productById(state.product);
      if (add && product) add.innerHTML = `${esc(t("pdp.add"))} — ${money(product.price * state.qty)}`;
      updateStickyPrice();
      return;
    }

    if (target.closest("[data-sticky-add]")) {
      const product = productById(state.product);
      if (!product) return;
      if (addToCart(product.id, state.size, state.color, state.qty, { openCart: true })) {
        showToast(t("bag.addedQty", { qty: state.qty, name: L(product.name) }));
      }
      return;
    }

    if (target.closest("#pdpAdd")) {
      const product = productById(state.product);
      if (!product) return;
      const ok = addToCart(product.id, state.size, state.color, state.qty, { openCart: false });
      if (ok) showToast(t("bag.addedQty", { qty: state.qty, name: L(product.name) }));
      return;
    }

    if (target.closest("#pdpBuyNow")) {
      const product = productById(state.product);
      if (!product) return;
      if (addToCart(product.id, state.size, state.color, state.qty, { silent: true, openCart: false })) openCheckout();
      return;
    }

    if (target.closest("#pdpWish")) {
      const button = target.closest("#pdpWish");
      if (!state.product) return;
      const index = state.wish.indexOf(state.product);
      if (index === -1) { state.wish.push(state.product); showToast(t("wish.added"), "heart"); }
      else { state.wish.splice(index, 1); showToast(t("wish.removed")); }
      save(LS.wish, state.wish);
      button.setAttribute("aria-pressed", String(index === -1));
      const svg = button.querySelector("svg");
      if (svg) svg.setAttribute("fill", index === -1 ? "currentColor" : "none");
      return;
    }

    const share = target.closest("[data-share]");
    if (share) {
      const kind = share.getAttribute("data-share");
      const url = window.location.href;
      const product = productById(state.product);
      if (kind === "copy") {
        if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => showToast(t("pdp.copied")));
        else showToast(url);
      } else if (product) {
        const text = `${L(product.name)} — ${money(product.price)} · ${url}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      }
      return;
    }

    /* Aperçu rapide */
    const qvAdd = target.closest("[data-qv-add]");
    if (qvAdd) {
      const product = productById(qvAdd.getAttribute("data-qv-add"));
      if (!product) return;
      if (!state.quick.size) {
        showToast(t("bag.sizeNeeded"));
        return;
      }
      if (addToCart(product.id, state.quick.size, state.quick.color, 1, { silent: true, openCart: true })) {
        showToast(t("bag.added", { name: L(product.name) }));
        closeModal("#quickViewWrap");
      }
      return;
    }
    const qvOpen = target.closest("[data-qv-open]");
    if (qvOpen) {
      closeModal("#quickViewWrap");
      renderProductPage(qvOpen.getAttribute("data-qv-open"));
      return;
    }

    /* Gestion */
    const adminRemove = target.closest("[data-admin-remove]");
    if (adminRemove) {
      if (state.products.length <= 1) { showToast(t("admin.needOne")); return; }
      const id = adminRemove.getAttribute("data-admin-remove");
      const product = productById(id);
      if (product && window.confirm(t("admin.confirmDelete", { name: L(product.name) }))) {
        state.products = state.products.filter(p => p.id !== id);
        state.cart = state.cart.filter(item => item.pid !== id);
        save(LS.products, state.products);
        save(LS.cart, state.cart);
        renderProducts();
        renderCart();
        renderAdmin();
        showToast(t("admin.removed"));
      }
      return;
    }
    const toggleSold = target.closest("[data-admin-toggle-sold]");
    if (toggleSold) {
      const product = productById(toggleSold.getAttribute("data-admin-toggle-sold"));
      if (product) {
        product.soldOut = !product.soldOut;
        save(LS.products, state.products);
        renderProducts();
        renderAdmin();
      }
      return;
    }

    const adminTab = target.closest(".admin-tab");
    if (adminTab) {
      const pane = adminTab.getAttribute("data-pane");
      $$(".admin-tab").forEach(tab => tab.classList.toggle("is-active", tab === adminTab));
      $$(".admin-pane").forEach(el => el.classList.toggle("is-active", el.id === `pane-${pane}`));
      return;
    }

    /* Suivi de commande */
    if (target.closest("#footerTrack")) {
      event.preventDefault();
      showToast(t("toast.track"));
      window.open(waLink(`${t("wa.order")} — ${t("footer.track")}`), "_blank", "noopener");
      return;
    }
    if (target.closest("#footerSizeGuide")) {
      event.preventDefault();
      openSizeGuide("Hoodies");
      return;
    }

    /* Accordéons FAQ (délégation globale) */
    const accHead = target.closest(".acc-head");
    if (accHead) {
      const item = accHead.closest(".acc-item");
      if (item) {
        const isOpen = item.classList.toggle("is-open");
        accHead.setAttribute("aria-expanded", String(isOpen));
      }
    }
  });

  /* --- Formulaire de commande --- */
  const form = $("#checkoutForm");
  if (form) {
    form.addEventListener("submit", submitOrder);
    const wilaya = $("#customerWilaya");
    if (wilaya) {
      wilaya.addEventListener("change", () => {
        state.wilaya = wilaya.value;
        renderCheckoutSummary();
        renderCart();
      });
    }
    const phone = $("#customerPhone");
    if (phone) {
      phone.addEventListener("input", () => {
        const field = phone.closest(".field");
        if (field && field.classList.contains("has-error") && isValidPhone(phone.value)) {
          field.classList.remove("has-error");
          const err = field.querySelector(".err");
          if (err) err.textContent = "";
        }
      });
    }
  }
  const modes = $("#deliveryModes");
  if (modes) {
    modes.addEventListener("click", event => {
      const card = event.target.closest("[data-mode]");
      if (!card) return;
      state.mode = card.getAttribute("data-mode");
      $$("[data-mode]", modes).forEach(el => {
        const active = el === card;
        el.classList.toggle("is-active", active);
        el.setAttribute("aria-checked", String(active));
      });
      renderCheckoutSummary();
      renderCart();
    });
  }
  const confirmContinue = $("#confirmContinue");
  if (confirmContinue) {
    confirmContinue.addEventListener("click", () => {
      closeCheckout();
      showHome(true);
    });
  }
  const confirmWhats = $("#confirmWhats");
  if (confirmWhats) confirmWhats.addEventListener("click", () => { pendingClear = true; finishOrder(); });

  /* --- Newsletter --- */
  const newsletter = $("#newsletterForm");
  if (newsletter) {
    newsletter.addEventListener("submit", event => {
      event.preventDefault();
      const email = $("#newsletterEmail");
      const value = email ? email.value.trim() : "";
      if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value)) { showToast(t("news.err")); return; }
      if (email) email.value = "";
      showToast(t("news.ok"));
    });
  }

  /* --- Gestion : formulaires --- */
  const productForm = $("#productAdminForm");
  if (productForm) {
    productForm.addEventListener("submit", event => {
      event.preventDefault();
      const name = $("#pName").value.trim();
      if (!name) { showToast(t("admin.nameNeeded")); return; }
      const cat = $("#pCategory").value;
      const price = Math.max(0, Number($("#pPrice").value) || 0);
      const oldPrice = Math.max(0, Number($("#pOldPrice").value) || 0);
      const image = $("#pImage").value.trim() || FALLBACK_IMG;
      const stockField = $("#pStock");
      const stock = Math.max(0, Number(stockField ? stockField.value : 0) || 0);
      const description = $("#pDesc").value.trim() || (state.lang === "ar" ? "قطعة أوفرسايز من قطن سميك." : "Pièce oversize en coton épais.");
      const sizes = cat === "Accessoires" ? ["Unique"] : ["S", "M", "L", "XL", "XXL"];
      const colors = cat === "Accessoires" ? ["onyx", "forest"] : ["onyx", "sand", "forest"];
      state.products.unshift({
        id: `custom-${Date.now()}`,
        name: { fr: name, ar: name },
        cat,
        price,
        oldPrice,
        tag: { fr: "Nouveau", ar: "جديد" },
        isNew: true,
        lowStock: stock,
        soldOut: false,
        img: image,
        colors,
        sizes,
        rating: 4.8,
        reviews: 0,
        desc: { fr: description, ar: description },
        features: { fr: ["Produit ajouté depuis l'espace gestion"], ar: ["منتج أُضيف من لوحة الإدارة"] }
      });
      save(LS.products, state.products);
      productForm.reset();
      renderProducts();
      renderAdmin();
      showToast(t("admin.added"));
    });
  }

  const saveOffer = $("#saveOffer");
  if (saveOffer) {
    saveOffer.addEventListener("click", () => {
      state.settings.discount = Math.max(0, Math.min(60, Number($("#discountInput").value) || 0));
      state.settings.minimumItems = Math.max(2, Math.min(10, Number($("#minimumItemsInput").value) || 2));
      state.settings.freeShipItems = Math.max(1, Math.min(20, Number($("#freeShipInput").value) || 2));
      applySettings();
      showToast(t("admin.saved"));
    });
  }

  const saveDelivery = $("#saveDelivery");
  if (saveDelivery) {
    saveDelivery.addEventListener("click", () => {
      state.settings.feeNorth = Math.max(0, Number($("#feeNorth").value) || 0);
      state.settings.feeEastWest = Math.max(0, Number($("#feeEastWest").value) || 0);
      state.settings.feeSouth = Math.max(0, Number($("#feeSouth").value) || 0);
      state.settings.deskDiscount = Math.max(0, Math.min(60, Number($("#deskDiscount").value) || 0));
      state.settings.deliveryDays = $("#deliveryDays").value.trim() || DEFAULT_SETTINGS.deliveryDays;
      applySettings();
      showToast(t("admin.saved"));
    });
  }

  const saveIntegrations = $("#saveIntegrations");
  if (saveIntegrations) {
    saveIntegrations.addEventListener("click", () => {
      const number = $("#whatsappNumber").value.replace(/\D/g, "");
      state.settings.whatsapp = number || DEFAULT_SETTINGS.whatsapp;
      state.settings.facebookPixel = $("#facebookPixelId").value.trim();
      state.settings.tiktokPixel = $("#tiktokPixelId").value.trim();
      save(LS.settings, state.settings);
      updateWhatsAppLinks();
      loadPixels();
      showToast(t("admin.saved"));
    });
  }
  const announcementToggle = $("#announcementToggle");
  if (announcementToggle) {
    announcementToggle.addEventListener("change", () => {
      state.settings.showAnnouncement = announcementToggle.checked;
      save(LS.settings, state.settings);
      applyAnnouncement();
    });
  }

  const exportData = $("#exportData");
  if (exportData) {
    exportData.addEventListener("click", () => {
      const payload = {
        exportedAt: new Date().toISOString(),
        settings: state.settings,
        products: state.products,
        orders: state.orders,
        cart: state.cart
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `leos-export-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      showToast(t("admin.exported"));
    });
  }

  const resetData = $("#resetData");
  if (resetData) {
    resetData.addEventListener("click", () => {
      [LS.cart, LS.products, LS.settings, LS.wish, LS.orders].forEach(key => localStorage.removeItem(key));
      state.products = load(LS.products, DEFAULT_PRODUCTS);
      state.cart = [];
      state.settings = { ...DEFAULT_SETTINGS, ...load(LS.settings, {}) };
      state.orders = [];
      state.wish = [];
      closeModal("#adminWrap");
      applyLang(state.lang);
      showToast(t("admin.resetDone"));
    });
  }
}

/* ============================================================
   INITIALISATION
   ============================================================ */
function init() {
  /* État persistant */
  const storedLang = load(LS.lang, null);
  const paramLang = urlParam("lang");
  const browserLang = (navigator.language || "fr").slice(0, 2).toLowerCase();
  state.lang = paramLang === "ar" || paramLang === "fr"
    ? paramLang
    : (storedLang === "ar" || storedLang === "fr" ? storedLang : (browserLang === "ar" ? "ar" : "fr"));

  state.products = load(LS.products, DEFAULT_PRODUCTS);
  state.cart = load(LS.cart, []);
  state.wish = load(LS.wish, []);
  state.orders = load(LS.orders, []);
  state.settings = { ...DEFAULT_SETTINGS, ...load(LS.settings, {}) };

  /* Nettoyage : panier pointant vers des produits disparus */
  state.cart = state.cart.filter(item => item && Array.isArray(state.products) && state.products.some(p => p.id === item.pid && !p.soldOut));
  if (!Array.isArray(state.products) || !state.products.length) state.products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  captureOriginals();
  bindEvents();
  bindAccordions();
  setupHero3D();
  populateWilayas();
  applyLang(state.lang);
  observeReveals();
  loadPixels();

  /* Accès gestion : ?admin=1 */
  if (urlParam("admin") === "1" || sessionStorage.getItem("leos_admin") === "1") {
    try { sessionStorage.setItem("leos_admin", "1"); } catch (err) { /* ignoré */ }
    state.adminUnlocked = true;
    injectAdminButton();
  }

  /* Fiche produit directe : ?product=id */
  const productParam = urlParam("product");
  if (productParam) renderProductPage(productParam);
  else setView("home");

  /* Boutons retour navigateur */
  window.addEventListener("popstate", () => {
    const id = urlParam("product");
    if (id) renderProductPage(id);
    else showHome(false);
  });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
