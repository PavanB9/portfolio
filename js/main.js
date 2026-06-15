/* ============================================================
   Pavan Bandla — Portfolio interactions
   Vanilla JS · no dependencies
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Theme toggle (persisted) ---------- */
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  if (saved) root.setAttribute("data-theme", saved);

  var themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* ---------- Shrink nav on scroll ---------- */
  var nav = document.getElementById("nav");
  var onScroll = function () {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById("navBurger");
  var navLinks = document.getElementById("navLinks");
  if (burger && navLinks) {
    var closeMenu = function () {
      navLinks.classList.remove("open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    };
    burger.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", String(open));
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  /* ---------- Scroll-reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          // gentle stagger for siblings entering together
          var delay = Math.min(i * 70, 280);
          setTimeout(function () { entry.target.classList.add("in"); }, delay);
          revObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { revObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Active nav link via section observer ---------- */
  var sections = document.querySelectorAll("main section[id]");
  var linkMap = {};
  document.querySelectorAll(".nav__links a").forEach(function (a) {
    linkMap[a.getAttribute("href").slice(1)] = a;
  });
  if ("IntersectionObserver" in window) {
    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          Object.keys(linkMap).forEach(function (id) {
            linkMap[id].classList.toggle("active", id === entry.target.id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spyObserver.observe(s); });
  }

  /* ---------- Hero typing effect ---------- */
  var typed = document.getElementById("typed");
  if (typed && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var phrases = [
      "Computer Science student",
      "Software Engineer",
      "I build practical tools.",
      "Data & automation."
    ];
    var pi = 0, ci = 0, deleting = false;
    var tick = function () {
      var word = phrases[pi];
      typed.textContent = word.slice(0, ci);
      if (!deleting) {
        if (ci < word.length) { ci++; setTimeout(tick, 70 + Math.random() * 50); }
        else { deleting = true; setTimeout(tick, 1500); }
      } else {
        if (ci > 0) { ci--; setTimeout(tick, 35); }
        else { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 350); }
      }
    };
    tick();
  } else if (typed) {
    typed.textContent = "Computer Science student";
  }

  /* ---------- Pointer parallax on the liquid blobs ---------- */
  var blobs = document.querySelector(".blobs");
  if (blobs && window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener("mousemove", function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 26;
      var y = (e.clientY / window.innerHeight - 0.5) * 26;
      blobs.style.transform = "translate(" + x + "px," + y + "px)";
    }, { passive: true });
  }
})();
