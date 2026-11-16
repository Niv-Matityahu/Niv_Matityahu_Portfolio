/* Niv Matityahu — intro -> pinned horizontal gallery -> about, with rich case modal */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;
  var byId = function (id) { return document.getElementById(id); };

  var load = document.querySelector(".load");
  if (load) { if (reduce) { load.remove(); } else { setTimeout(function(){ load.classList.add("load--done"); }, 900); setTimeout(function(){ load.remove(); }, 1650); } }

  var tiles = [].slice.call(document.querySelectorAll(".tile"));
  tiles.forEach(function (t) {
    var vid = t.querySelector("video");
    if (vid && !reduce) {
      t.addEventListener("mouseenter", function () { var pr = vid.play(); if (pr && pr.catch) pr.catch(function(){}); });
      t.addEventListener("mouseleave", function () { vid.pause(); try { vid.currentTime = 0; } catch (e) {} });
    }
  });

  /* pinned horizontal gallery */
  var track = byId("track"), row = byId("row"), prog = byId("gprog");
  var canPin = window.matchMedia("(min-width: 821px)").matches && !reduce;
  root.classList.toggle("pin", canPin);
  var dist = 0, ticking = false;
  function layout() { if (!canPin || !track || !row) return; dist = Math.max(row.scrollWidth - window.innerWidth, 0); track.style.height = (dist + window.innerHeight) + "px"; }
  function onScroll() { ticking = false; if (!canPin || !track || !row) return; var top = track.getBoundingClientRect().top; var sc = Math.min(Math.max(-top, 0), dist); row.style.transform = "translateX(" + (-sc) + "px)"; if (prog) prog.style.transform = "scaleX(" + (dist ? (sc / dist) : 0) + ")"; }
  if (canPin) {
    layout(); onScroll();
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    window.addEventListener("resize", function () { layout(); onScroll(); });
    window.addEventListener("load", function () { layout(); onScroll(); });
  }

  /* data */
  var DATA = [];
  try { DATA = JSON.parse(byId("pdata").textContent); } catch (e) {}

  /* case modal */
  var modal = byId("modal");
  var lastFocus = null;
  function list(id, arr) { var ul = byId(id); ul.innerHTML = ""; (arr || []).forEach(function (x) { var li = document.createElement("li"); li.textContent = x; ul.appendChild(li); }); }
  function openModal(idx) {
    var p = DATA[idx]; if (!p) return;
    lastFocus = document.activeElement;
    byId("m-eyebrow").textContent = ("0" + (idx + 1)).slice(-2) + " / 11  ·  " + (p.kind || "");
    byId("m-title").textContent = p.title || "";
    var media = byId("m-media");
    media.innerHTML = p.video ? '<video src="' + p.video + '" controls playsinline preload="metadata"></video>' : "";
    byId("m-overview").textContent = p.overview || "";
    var st = byId("m-stats"); st.innerHTML = "";
    (p.stats || []).forEach(function (s) {
      var d = document.createElement("div"); d.className = "stat";
      var v = document.createElement("span"); v.className = "stat__v"; v.textContent = s[0];
      var l = document.createElement("span"); l.className = "stat__l"; l.textContent = s[1];
      d.appendChild(v); d.appendChild(l); st.appendChild(d);
    });
    var flow = byId("m-flow"); flow.innerHTML = "";
    (p.flow || []).forEach(function (n, i) {
      if (i) { var a = document.createElement("span"); a.className = "flow__arrow"; a.setAttribute("aria-hidden", "true"); a.textContent = "→"; flow.appendChild(a); }
      var s = document.createElement("span"); s.className = "flow__node"; s.textContent = n; flow.appendChild(s);
    });
    list("m-how", p.how); list("m-does", p.does); list("m-out", p.outcome);
    var stack = byId("m-stack"); stack.innerHTML = "";
    (p.stack || []).forEach(function (s) { var c = document.createElement("span"); c.className = "chip"; c.textContent = s; stack.appendChild(c); });
    var o = byId("m-open");
    if (p.link) { o.textContent = p.linklabel || "Open"; o.href = p.link; o.classList.remove("is-muted"); }
    else { o.textContent = p.linklabel || ""; o.removeAttribute("href"); o.classList.add("is-muted"); }
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modal.querySelector(".modal__panel").scrollTop = 0;
    var x = modal.querySelector(".modal__x"); if (x) x.focus();
  }
  function closeModal() { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; byId("m-media").innerHTML = ""; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  tiles.forEach(function (t) { t.addEventListener("click", function () { openModal(parseInt(t.dataset.i, 10)); }); });
  if (modal) { modal.addEventListener("click", function (e) { if (e.target.hasAttribute("data-close")) closeModal(); }); document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("open")) closeModal(); }); }
})();
