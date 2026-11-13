/* ============================================================
   Niv Matityahu — portfolio behavior
   - theme toggle (persisted)
   - reveal-on-scroll
   - count-up telemetry numbers
   - ambient "orchestration graph" hero canvas
   ============================================================ */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Theme toggle ─────────────────────────────────────── */
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");

  const stored = (function () {
    try { return localStorage.getItem("theme"); } catch (e) { return null; }
  })();
  if (stored === "light" || stored === "dark") root.setAttribute("data-theme", stored);

  function currentTheme() {
    const attr = root.getAttribute("data-theme");
    if (attr) return attr;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      const next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* ── Reveal on scroll ─────────────────────────────────── */
  const revealables = document.querySelectorAll("[data-reveal]");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealables.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealables.forEach((el) => io.observe(el));
  }

  /* ── Count-up numbers ─────────────────────────────────── */
  const counters = document.querySelectorAll(".counter");
  function runCounter(el) {
    const target = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (prefersReduced) { el.textContent = String(target); return; }
    const duration = 1100;
    let start = null;
    function step(ts) {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { runCounter(entry.target); cio.unobserve(entry.target); }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => cio.observe(el));
  } else {
    counters.forEach((el) => (el.textContent = el.getAttribute("data-count")));
  }

  /* ── Hero: ambient orchestration graph ────────────────── */
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const ACCENT = "#f0b429";
  let w = 0, h = 0, dpr = 1;
  let nodes = [];
  let pulses = [];
  let rafId = null;
  let tick = 0;

  function themeStroke() {
    return currentTheme() === "dark" ? "rgba(237,234,227,0.14)" : "rgba(26,25,22,0.12)";
  }
  function themeNode() {
    return currentTheme() === "dark" ? "rgba(237,234,227,0.5)" : "rgba(26,25,22,0.42)";
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width; h = rect.height;
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildGraph();
  }

  function buildGraph() {
    const density = Math.max(14, Math.min(34, Math.round((w * h) / 42000)));
    nodes = [];
    for (let i = 0; i < density; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: 1.3 + Math.random() * 1.6,
      });
    }
    pulses = [];
  }

  const LINK_DIST = 170;

  function neighbors(i) {
    const out = [];
    const a = nodes[i];
    for (let j = 0; j < nodes.length; j++) {
      if (j === i) continue;
      const b = nodes[j];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < LINK_DIST) out.push(j);
    }
    return out;
  }

  function spawnPulse() {
    if (nodes.length < 2) return;
    const i = Math.floor(Math.random() * nodes.length);
    const n = neighbors(i);
    if (!n.length) return;
    const j = n[Math.floor(Math.random() * n.length)];
    pulses.push({ from: i, to: j, t: 0, speed: 0.012 + Math.random() * 0.012 });
  }

  function drawFrame() {
    ctx.clearRect(0, 0, w, h);
    const strokeC = themeStroke();
    const nodeC = themeNode();

    // move nodes
    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    }

    // edges
    ctx.lineWidth = 1;
    ctx.strokeStyle = strokeC;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK_DIST) {
          ctx.globalAlpha = 1 - d / LINK_DIST;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    // nodes
    ctx.fillStyle = nodeC;
    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // pulses travelling along edges
    for (let k = pulses.length - 1; k >= 0; k--) {
      const p = pulses[k];
      p.t += p.speed;
      if (p.t >= 1 || !nodes[p.from] || !nodes[p.to]) { pulses.splice(k, 1); continue; }
      const a = nodes[p.from], b = nodes[p.to];
      const x = a.x + (b.x - a.x) * p.t;
      const y = a.y + (b.y - a.y) * p.t;
      const fade = Math.sin(p.t * Math.PI);
      ctx.globalAlpha = fade;
      ctx.fillStyle = ACCENT;
      ctx.beginPath();
      ctx.arc(x, y, 2.6, 0, Math.PI * 2);
      ctx.fill();
      // glow
      ctx.globalAlpha = fade * 0.25;
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    tick++;
    if (tick % 26 === 0 && pulses.length < 6) spawnPulse();

    rafId = requestAnimationFrame(drawFrame);
  }

  function drawStatic() {
    // reduced-motion: one still frame of the graph, no pulses
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = themeStroke();
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK_DIST) {
          ctx.globalAlpha = 1 - d / LINK_DIST;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = themeNode();
    for (const n of nodes) { ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill(); }
  }

  let resizeTimer = null;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resize();
      if (prefersReduced) drawStatic();
    }, 150);
  });

  // pause when the hero scrolls out of view (saves battery)
  if ("IntersectionObserver" in window && !prefersReduced) {
    const heroIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!rafId) rafId = requestAnimationFrame(drawFrame);
        } else if (rafId) {
          cancelAnimationFrame(rafId); rafId = null;
        }
      });
    }, { threshold: 0 });
    heroIO.observe(canvas);
  }

  resize();
  if (prefersReduced) drawStatic();
  else rafId = requestAnimationFrame(drawFrame);
})();
