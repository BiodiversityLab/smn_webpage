/* Swedish Metabarcoding Network landing page JS
   - mobile nav toggle
   - theme toggle (persists in localStorage)
   - reveal-on-scroll animations
   - animated counters
   - demo contact form handler
*/

(function () {
  const root = document.documentElement;
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Theme ----------
  const THEME_KEY = "smn_theme";
  const themeToggle = document.querySelector(".theme-toggle");

  function setTheme(theme) {
    if (theme === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
    localStorage.setItem(THEME_KEY, theme);
  }

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    return prefersLight ? "light" : "dark";
  }

  setTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isLight = root.getAttribute("data-theme") === "light";
      setTheme(isLight ? "dark" : "light");
    });
  }

  // ---------- Mobile nav ----------
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  function closeMenu() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    // Close menu when clicking a link
    navLinks.forEach((link) => link.addEventListener("click", closeMenu));

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!target) return;
      const clickedInside = navMenu.contains(target) || navToggle.contains(target);
      if (!clickedInside) closeMenu();
    });

    // Close on escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  // ---------- Reveal on scroll ----------
  const reveals = Array.from(document.querySelectorAll(".reveal"));
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  reveals.forEach((el) => revealObserver.observe(el));

  // ---------- Animated counters ----------
  const counters = Array.from(document.querySelectorAll("[data-count-to]"));
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.getAttribute("data-count-to") || "0");
        animateCount(el, target, 900);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.35 }
  );

  counters.forEach((el) => counterObserver.observe(el));

  function animateCount(el, target, durationMs) {
    const start = 0;
    const startTime = performance.now();

    function tick(now) {
      const t = Math.min(1, (now - startTime) / durationMs);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(start + (target - start) * eased);
      el.textContent = String(value);
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  // ---------- Demo contact form ----------
  window.SMN = window.SMN || {};
  window.SMN.handleFakeSubmit = function (event) {
    event.preventDefault();
    const note = document.getElementById("formNote");
    if (note) {
      note.textContent = "Thanks! This demo form doesn’t send email yet — connect it to your backend or form provider.";
    }
    return false;
  };
})();