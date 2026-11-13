/* ============================================================
   Niv Matityahu — portfolio behavior
   theme · scroll reveals · count-up · intro boot ·
   custom cursor + magnetic · live grounding-guard demo
   ============================================================ */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const root = document.documentElement;

  /* ── Theme toggle ─────────────────────────────────────── */
  const toggle = document.getElementById("theme-toggle");
  const stored = (function () { try { return localStorage.getItem("theme"); } catch (e) { return null; } })();
  if (stored === "light" || stored === "dark") root.setAttribute("data-theme", stored);
  function currentTheme() {
    const a = root.getAttribute("data-theme");
    return a || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }
  if (toggle) toggle.addEventListener("click", function () {
    const next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  /* ── Reveal on scroll ─────────────────────────────────── */
  const revealables = document.querySelectorAll("[data-reveal]");
  if (reduce || !("IntersectionObserver" in window)) {
    revealables.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealables.forEach((el) => io.observe(el));
  }

  /* ── Count-up numbers ─────────────────────────────────── */
  function runCounter(el) {
    const target = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (reduce) { el.textContent = String(target); return; }
    const dur = 1100; let start = null;
    (function step(ts) {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  const counters = document.querySelectorAll(".counter");
  if ("IntersectionObserver" in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach((el) => cio.observe(el));
  } else counters.forEach((el) => (el.textContent = el.getAttribute("data-count")));

  /* ── Intro boot counter ───────────────────────────────── */
  const introCount = document.querySelector(".intro__count");
  if (introCount) {
    if (reduce) { introCount.textContent = "100"; }
    else {
      const dur = 1150; let start = null;
      (function step(ts) {
        if (start === null) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        introCount.textContent = String(Math.round(p * 100));
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    }
  }

  /* ── Custom cursor + magnetic buttons ─────────────────── */
  if (finePointer && !reduce) {
    const dot = document.createElement("div"); dot.className = "cursor-dot";
    const ring = document.createElement("div"); ring.className = "cursor-ring";
    document.body.append(dot, ring);
    document.body.classList.add("has-cursor");
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    }, { passive: true });
    (function loop() {
      rx += (mx - rx) * 0.2; ry += (my - ry) * 0.2;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll("a,button,.case,.client-tile,.mini,.theme-toggle").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
    });
    document.querySelectorAll(".magnetic").forEach((el) => {
      const s = 0.4;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * s}px,${(e.clientY - (r.top + r.height / 2)) * s}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  /* ── Live "grounding guard" demo ──────────────────────── */
  const log = document.getElementById("agent-log");
  if (log) {
    const scenes = [
      [
        { cls: "a-user",   text: 'you  "BILLY bookcase in white — in stock? price?"' },
        { cls: "a-tool",   text: "→ catalog.lookup(\"BILLY\", \"white\")" },
        { cls: "a-draft",  text: 'llm draft  "Yes — ₪299, ships today."' },
        { cls: "a-reject", text: "✕ guard: ₪299 not sourced from a tool — rejected", strikePrev: true },
        { cls: "a-ok",     text: 'answer  "In stock, white. ₪349."' },
        { cls: "a-badge",  text: "✓ grounded — price from catalog" },
      ],
      [
        { cls: "a-user",   text: 'you  "TLV → JFK next week, under $700?"' },
        { cls: "a-tool",   text: "→ fares.search(TLV, JFK, max=700)" },
        { cls: "a-draft",  text: 'llm draft  "Sure — $649 on Tuesday."' },
        { cls: "a-reject", text: "✕ guard: fare unverified — rejected", strikePrev: true },
        { cls: "a-ok",     text: 'answer  "Lowest is $712. Nothing under $700."' },
        { cls: "a-badge",  text: "✓ grounded — live fares API" },
      ],
      [
        { cls: "a-user",   text: 'modi\'in ezrahi  "any payroll anomalies this month?"' },
        { cls: "a-tool",   text: "→ checks.run(hilan_vs_prev_month)" },
        { cls: "a-draft",  text: 'llm draft  "Looks all clear."' },
        { cls: "a-reject", text: "✕ guard: claim not tied to a row — rejected", strikePrev: true },
        { cls: "a-ok",     text: 'answer  "3 flags — e.g. row 47: net pay < 0."' },
        { cls: "a-badge",  text: "✓ grounded — cites file + row" },
      ],
    ];
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    if (reduce) {
      scenes[0].forEach((s) => {
        const d = document.createElement("div");
        d.className = "a-line " + s.cls + (s.strikePrev ? "" : "");
        d.textContent = s.text; log.appendChild(d);
      });
    } else {
      async function type(el, text, cps) {
        el.classList.add("caret");
        for (let i = 0; i < text.length; i++) { el.textContent = text.slice(0, i + 1); await sleep(1000 / cps); }
        el.classList.remove("caret");
      }
      (async function run() {
        let i = 0;
        while (true) {
          log.innerHTML = "";
          let lastDraft = null;
          for (const step of scenes[i % scenes.length]) {
            if (step.strikePrev && lastDraft) lastDraft.classList.add("struck");
            const line = document.createElement("div");
            line.className = "a-line " + step.cls;
            log.appendChild(line);
            await type(line, step.text, step.cls === "a-tool" ? 45 : 38);
            if (step.cls === "a-draft") lastDraft = line;
            await sleep(step.cls === "a-badge" ? 150 : 420);
          }
          await sleep(2800);
          i++;
        }
      })();
    }
  }

  /* ── Catalog filter ───────────────────────────────────── */
  const chips = document.querySelectorAll(".filter-chip");
  chips.forEach((c) => c.addEventListener("click", () => {
    chips.forEach((x) => { x.classList.remove("active"); x.setAttribute("aria-selected", "false"); });
    c.classList.add("active"); c.setAttribute("aria-selected", "true");
    const f = c.getAttribute("data-filter");
    document.querySelectorAll(".catalog .case").forEach((card) => {
      card.style.display = (f === "all" || card.getAttribute("data-cat") === f) ? "" : "none";
    });
  }));

  /* ── Case modal ───────────────────────────────────────── */
  const modal = document.getElementById("case-modal");
  if (modal) {
    const body = modal.querySelector("#modal-body");
    const titleEl = modal.querySelector("#modal-title");
    const eyebrowEl = modal.querySelector("#modal-eyebrow");
    let lastFocus = null;
    function openCase(card) {
      const tpl = card.querySelector(".case__full");
      if (!tpl) return;
      lastFocus = document.activeElement;
      const t = card.querySelector(".case__title");
      const r = card.querySelector(".case__role");
      titleEl.textContent = t ? t.textContent : "";
      eyebrowEl.textContent = r ? r.textContent : "";
      body.innerHTML = "";
      body.appendChild(tpl.content.cloneNode(true));
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      const close = modal.querySelector(".modal__close");
      if (close) close.focus();
    }
    function closeCase() {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    document.querySelectorAll(".case__more").forEach((b) =>
      b.addEventListener("click", (e) => { e.preventDefault(); openCase(b.closest(".case")); }));
    modal.addEventListener("click", (e) => { if (e.target.hasAttribute("data-close")) closeCase(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("open")) closeCase(); });
  }
})();
