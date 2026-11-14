/* ============================================================
   Niv Matityahu — "The Index" behavior
   preloader · theme · hover-preview (+ghost, counter, parallax) · case sheet
   ============================================================ */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(pointer: fine)").matches;
  const root = document.documentElement;
  const byId = (id) => document.getElementById(id);

  /* theme */
  const stored = (function () { try { return localStorage.getItem("theme"); } catch (e) { return null; } })();
  if (stored === "light" || stored === "dark") root.setAttribute("data-theme", stored);
  const current = () => root.getAttribute("data-theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const toggle = byId("toggle");
  if (toggle) toggle.addEventListener("click", function () {
    const next = current() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  /* preloader */
  const load = document.querySelector(".load");
  if (load) {
    if (reduce) { load.remove(); }
    else { setTimeout(() => load.classList.add("load--done"), 950); setTimeout(() => load.remove(), 1750); }
  }

  const rows = Array.prototype.slice.call(document.querySelectorAll(".row"));
  const card = byId("pv-card");
  const open = byId("pv-open");
  const logoWrap = byId("pv-logo");
  let activeRow = null;

  /* ── hover preview ─────────────────────────────── */
  function apply(d) {
    byId("pv-count").textContent = d.i + " / 11";
    byId("pv-title").innerHTML = d.title || "";
    byId("pv-kind").textContent = d.kind || "";
    byId("pv-desc").innerHTML = d.desc || "";
    byId("pv-tags").textContent = d.tags || "";
    if (logoWrap) {
      logoWrap.innerHTML = d.logo ? '<img src="' + d.logo + '" alt="">' : "";
      logoWrap.style.display = d.logo ? "" : "none";
    }
    if (open) {
      open.textContent = d.linklabel || "Open ↗";
      if (d.link) { open.href = d.link; open.classList.remove("is-muted"); open.setAttribute("target", "_blank"); open.setAttribute("rel", "noopener"); }
      else { open.removeAttribute("href"); open.classList.add("is-muted"); }
    }
    const demo = byId("pv-demo");
    if (demo) demo.hidden = !d.video;
  }
  function show(row) {
    rows.forEach((r) => r.classList.toggle("active", r === row));
    activeRow = row;
    const d = row.dataset;
    if (reduce || !card) { apply(d); return; }
    card.classList.add("fade");
    setTimeout(() => { apply(d); card.classList.remove("fade"); }, 150);
  }
  rows.forEach((r) => {
    r.addEventListener("mouseenter", () => show(r));
    r.addEventListener("focusin", () => show(r));
  });
  if (rows[0]) { rows[0].classList.add("active"); activeRow = rows[0]; }
  const demoBtn = byId("pv-demo");
  if (demoBtn) demoBtn.addEventListener("click", () => { if (activeRow) openSheet(activeRow); });

  /* subtle parallax on the preview card */
  const preview = byId("preview");
  if (fine && !reduce && preview && card) {
    preview.addEventListener("mousemove", (e) => {
      const r = preview.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      card.style.transform = "translate(" + (dx * 10).toFixed(1) + "px," + (dy * 8).toFixed(1) + "px)";
    });
    preview.addEventListener("mouseleave", () => { card.style.transform = ""; });
  }

  /* ── case sheet ────────────────────────────────── */
  const sheet = byId("sheet");
  function fillList(id, str) {
    const ul = byId(id); if (!ul) return;
    ul.innerHTML = "";
    (str || "").split("||").filter(Boolean).forEach((t) => {
      const li = document.createElement("li"); li.textContent = t.trim(); ul.appendChild(li);
    });
  }
  let lastFocus = null;
  function openSheet(row) {
    if (!sheet) return;
    const d = row.dataset;
    lastFocus = document.activeElement;
    byId("sheet-i").textContent = d.i + " / 11";
    byId("sheet-title").innerHTML = d.title || "";
    byId("sheet-kind").textContent = d.kind || "";
    const media = byId("sheet-media");
    if (media) media.innerHTML = d.video ? '<video src="' + d.video + '" controls playsinline preload="metadata"></video>' : "";
    byId("sheet-ctx").textContent = d.ctx || d.desc || "";
    fillList("sheet-steps", d.steps);
    fillList("sheet-out", d.out);
    byId("sheet-tags").textContent = d.tags || "";
    const so = byId("sheet-open");
    if (so) {
      so.textContent = d.linklabel || "Open ↗";
      if (d.link) { so.href = d.link; so.classList.remove("is-muted"); }
      else { so.removeAttribute("href"); so.classList.add("is-muted"); }
    }
    sheet.classList.add("open"); sheet.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const x = sheet.querySelector(".sheet__x"); if (x) x.focus();
  }
  function closeSheet() {
    if (!sheet) return;
    sheet.classList.remove("open"); sheet.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    const media = byId("sheet-media"); if (media) media.innerHTML = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  rows.forEach((r) => {
    const btn = r.querySelector(".row__link");
    if (btn) btn.addEventListener("click", () => openSheet(r));
  });
  if (sheet) {
    sheet.addEventListener("click", (e) => { if (e.target.hasAttribute("data-close")) closeSheet(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && sheet.classList.contains("open")) closeSheet(); });
  }
})();
