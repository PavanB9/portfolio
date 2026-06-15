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
    var bx = 0, by = 0, bxT = 0, byT = 0;       // smoothed pointer parallax
    var sc = window.scrollY, scT = sc;           // smoothed scroll position
    var t0 = performance.now();
    var running = false;

    // Take blob motion over from CSS so JS can combine drift + pointer + scroll.
    // The .blobs CONTAINER stays locked to the viewport (never translated), so it
    // always fills the screen and the background can never hard-cut on scroll —
    // only the blobs inside it move.
    var blobData = [];
    if (blobs) {
      Array.prototype.forEach.call(blobs.querySelectorAll(".blob"), function (el, i) {
        el.style.animation = "none";
        blobData.push({
          el: el,
          ax: 34 + i * 10, ay: 28 + i * 7,                        // drift amplitude (px)
          fx: 0.00006 + i * 0.000018, fy: 0.00008 + i * 0.000013, // drift speed
          ph: i * 1.7,                                            // phase
          pd: 0.45 + i * 0.18,                                    // pointer depth
          sd: [-0.18, 0.26, -0.24, 0.16][i] || 0.2               // scroll depth (mixed dirs)
        });
      });
    }

    var loop = function () {
      var t = performance.now() - t0;
      // ease toward targets for buttery motion
      gx += (px - gx) * 0.12;  gy += (py - gy) * 0.12;
      rx += (px - rx) * 0.22;  ry += (py - ry) * 0.22;
      bx += (bxT - bx) * 0.08; by += (byT - by) * 0.08;
      sc += (scT - sc) * 0.12;

      if (dot)  dot.style.transform  = "translate(" + px + "px," + py + "px) translate(-50%,-50%)";
      if (ring) ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
      if (glow) glow.style.transform = "translate(" + gx + "px," + gy + "px)";

      // each blob = slow drift + pointer parallax + scroll parallax (mixed
      // directions so color stays present throughout the page)
      for (var i = 0; i < blobData.length; i++) {
        var b = blobData[i];
        var tx = Math.sin(t * b.fx + b.ph) * b.ax + bx * b.pd;
        var ty = Math.cos(t * b.fy + b.ph) * b.ay + by * b.pd - sc * b.sd;
        b.el.style.transform = "translate(" + tx.toFixed(1) + "px," + ty.toFixed(1) + "px)";
      }
      requestAnimationFrame(loop);
    };
    var kick = function () { if (!running) { running = true; requestAnimationFrame(loop); } };

    window.addEventListener("scroll", function () { scT = window.scrollY; }, { passive: true });
    kick();  // background motion is always on (drift + scroll + pointer)

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
