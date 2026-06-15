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

  /* ---------- Pointer interactions: background + glass ---------- */
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (finePointer && !reduceMotion) {
    var blobs = document.querySelector(".blobs");
    var glow = document.getElementById("cursorGlow");
    var dot  = document.getElementById("cursorDot");
    var ring = document.getElementById("cursorRing");
    var interactiveSel = "a, button, .card, .icon-btn, .chip, .tag, .card__link, .card__badge, .profile";

    // raw + smoothed (lerp) pointer in pixels; start centered
    var px = window.innerWidth / 2, py = window.innerHeight / 2;
    var gx = px, gy = py;           // glow (slow trail)
    var rx = px, ry = py;           // ring (medium trail)
    var bx = 0, by = 0, bxT = 0, byT = 0;  // blob parallax offset
    var ticking = false;

    var loop = function () {
      // ease toward targets for buttery motion
      gx += (px - gx) * 0.12;  gy += (py - gy) * 0.12;
      rx += (px - rx) * 0.22;  ry += (py - ry) * 0.22;
      bx += (bxT - bx) * 0.08; by += (byT - by) * 0.08;

      if (dot)   dot.style.transform  = "translate(" + px + "px," + py + "px) translate(-50%,-50%)";
      if (ring)  ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
      if (glow)  glow.style.transform = "translate(" + gx + "px," + gy + "px)";
      if (blobs) blobs.style.transform = "translate(" + bx + "px," + by + "px)";

      // keep animating only while there's meaningful movement
      if (Math.abs(px - gx) > 0.3 || Math.abs(py - gy) > 0.3 ||
          Math.abs(px - rx) > 0.3 || Math.abs(py - ry) > 0.3 ||
          Math.abs(bxT - bx) > 0.3 || Math.abs(byT - by) > 0.3) {
        requestAnimationFrame(loop);
      } else { ticking = false; }
    };
    var kick = function () { if (!ticking) { ticking = true; requestAnimationFrame(loop); } };

    window.addEventListener("mousemove", function (e) {
      px = e.clientX; py = e.clientY;
      // blob parallax: subtle drift from screen center
      bxT = (px / window.innerWidth - 0.5) * 28;
      byT = (py / window.innerHeight - 0.5) * 28;

      document.body.classList.add("custom-cursor");
      if (glow) glow.classList.add("on");

      // ring expands over interactive elements
      if (ring) {
        var inter = e.target.closest && e.target.closest(interactiveSel);
        ring.classList.toggle("grow", !!inter);
      }

      // glass spotlight: light up the panel under the cursor
      var el = e.target.closest && e.target.closest(".glass");
      if (el) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 100).toFixed(1) + "%");
        el.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 100).toFixed(1) + "%");
      }
      kick();
    }, { passive: true });

    // restore normal cursor when the pointer leaves the window
    document.addEventListener("mouseleave", function () {
      if (glow) glow.classList.remove("on");
      document.body.classList.remove("custom-cursor");
    });

    /* gentle 3D tilt toward the cursor on showcase cards */
    var tiltEls = document.querySelectorAll(".card, .profile");
    tiltEls.forEach(function (el) {
      el.addEventListener("mouseenter", function () { el.style.transition = "transform 0.1s ease-out"; });
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var rx = (0.5 - (e.clientY - r.top) / r.height) * 6;
        var ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
        el.style.transform = "perspective(900px) rotateX(" + rx.toFixed(2) +
                             "deg) rotateY(" + ry.toFixed(2) + "deg) translateY(-6px)";
      }, { passive: true });
      el.addEventListener("mouseleave", function () {
        el.style.transition = "";   // let the CSS transition ease it back
        el.style.transform = "";
      });
    });
  }
})();
