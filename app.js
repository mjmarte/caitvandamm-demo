/* Dr. Cait Van Damm site — small interactions, no dependencies.
   1) Theme switcher (Calm / Bold / Warm) persisted in localStorage.
   2) Mobile nav toggle.
   3) Reveal-on-scroll.
   Works from file:// (no fetch/includes). */
(function () {
  var THEMES = ["calm", "bold", "warm"];
  var KEY = "cvd-theme";

  function applyTheme(t) {
    if (THEMES.indexOf(t) === -1) t = "calm";
    document.body.setAttribute("data-theme", t);
    try { localStorage.setItem(KEY, t); } catch (e) {}
    document.querySelectorAll(".theme-switch button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.theme === t));
    });
  }

  function buildSwitcher() {
    var saved = "calm";
    try { saved = localStorage.getItem(KEY) || "calm"; } catch (e) {}

    var wrap = document.createElement("div");
    wrap.className = "theme-switch";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", "Visual style");
    wrap.innerHTML = "<b>Style</b>";
    THEMES.forEach(function (t) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.theme = t;
      btn.textContent = t.charAt(0).toUpperCase() + t.slice(1);
      btn.addEventListener("click", function () { applyTheme(t); });
      wrap.appendChild(btn);
    });
    document.body.appendChild(wrap);
    applyTheme(saved);
  }

  function mobileNav() {
    var nav = document.querySelector(".nav");
    var toggle = document.querySelector(".nav-toggle");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      var open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", String(!open));
      toggle.setAttribute("aria-expanded", String(!open));
    });
  }

  function reveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach(function (e) { e.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildSwitcher();
    mobileNav();
    reveal();
  });
})();
