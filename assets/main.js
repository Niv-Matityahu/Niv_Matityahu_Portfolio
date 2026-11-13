/* ============================================================
   Niv Matityahu — "The Index" behavior
   preloader · theme · hover-preview gallery · custom cursor
   ============================================================ */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(pointer: fine)").matches;
  const root = document.documentElement;

  /* theme */
  const stored = (function () { try { return localStorage.getItem("theme"); } catch (e) { return null; } })();
  if (stored === "light" || stored === "dark") root.setAttribute("data-theme", stored);
  const current = () => root.getAttribute("data-theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const toggle = document.getElementById("toggle");
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

  /* hover-preview gallery */
  const rows = Array.prototype.slice.call(document.querySelectorAll(".row"));
  const card = document.getElementById("pv-card");
  const open = document.getElementById("pv-open");
  const logoWrap = document.getElementById("pv-logo");
  const byId = (id) => document.getElementById(id);

  function apply(d) {
    byId("pv-i").textContent = d.i || "";
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
  }

  function show(row) {
    rows.forEach((r) => r.classList.toggle("active", r === row));
    const d = row.dataset;
    if (reduce || !card) { apply(d); return; }
    card.classList.add("fade");
    setTimeout(() => { apply(d); card.classList.remove("fade"); }, 150);
  }

  rows.forEach((r) => {
    r.addEventListener("mouseenter", () => show(r));
    r.addEventListener("focusin", () => show(r));
  });
  if (rows[0]) rows[0].classList.add("active");

  /* disabled rows don't navigate */
  document.querySelectorAll('.row__link[aria-disabled="true"]').forEach((a) =>
    a.addEventListener("click", (e) => e.preventDefault()));

  /* custom cursor (desktop) */
  if (fine && !reduce) {
    const dot = document.createElement("div");
    dot.className = "cur";
    document.body.appendChild(dot);
    document.body.classList.add("has-cur");
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; }, { passive: true });
    (function loop() {
      cx += (x - cx) * 0.2; cy += (y - cy) * 0.2;
      dot.style.transform = "translate(" + cx + "px," + cy + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll("a, button, .row").forEach((n) => {
      n.addEventListener("mouseenter", () => dot.classList.add("cur--big"));
      n.addEventListener("mouseleave", () => dot.classList.remove("cur--big"));
    });
  }
})();
