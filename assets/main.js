/* Niv Matityahu — grid + pop-up behavior */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var byId = function (id) { return document.getElementById(id); };

  var load = document.querySelector(".load");
  if (load) {
    if (reduce) { load.remove(); }
    else { setTimeout(function () { load.classList.add("load--done"); }, 900); setTimeout(function () { load.remove(); }, 1650); }
  }

  var tiles = [].slice.call(document.querySelectorAll(".tile"));

  tiles.forEach(function (t) {
    var v = t.querySelector("video");
    if (v && !reduce) {
      t.addEventListener("mouseenter", function () { var p = v.play(); if (p && p.catch) p.catch(function () {}); });
      t.addEventListener("mouseleave", function () { v.pause(); try { v.currentTime = 0; } catch (e) {} });
    }
  });

  var modal = byId("modal");
  var lastFocus = null;

  function fill(id, str) {
    var ul = byId(id); ul.innerHTML = "";
    (str || "").split("||").filter(Boolean).forEach(function (x) {
      var li = document.createElement("li"); li.textContent = x.trim(); ul.appendChild(li);
    });
  }

  function openModal(t) {
    var d = t.dataset; lastFocus = document.activeElement;
    byId("m-eyebrow").textContent = d.i + " / 11  ·  " + (d.kind || "");
    byId("m-title").textContent = d.title || "";
    var media = byId("m-media"), html = "";
    if (d.video) { html = '<video src="' + d.video + '" controls playsinline preload="metadata"></video>'; }
    else if (d.logo) { html = '<div class="modal__logo' + (d.logodark === "1" ? " ink" : "") + '"><img src="' + d.logo + '" alt=""></div>'; }
    media.innerHTML = html;
    byId("m-ctx").textContent = d.ctx || "";
    fill("m-steps", d.steps); fill("m-out", d.out);
    byId("m-tags").textContent = d.tags || "";
    var o = byId("m-open");
    if (d.link) { o.textContent = d.linklabel || "Open"; o.href = d.link; o.classList.remove("is-muted"); }
    else { o.textContent = d.linklabel || ""; o.removeAttribute("href"); o.classList.add("is-muted"); }
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var x = modal.querySelector(".modal__x"); if (x) x.focus();
  }
  function closeModal() {
    modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; byId("m-media").innerHTML = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  tiles.forEach(function (t) { t.addEventListener("click", function () { openModal(t); }); });
  if (modal) {
    modal.addEventListener("click", function (e) { if (e.target.hasAttribute("data-close")) closeModal(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("open")) closeModal(); });
  }
})();
