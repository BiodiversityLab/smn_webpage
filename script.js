/* Swedish Metabarcoding Network landing page JS
  - mobile nav toggle
  - theme toggle (persists in localStorage)
  - reveal-on-scroll animations
  - animated counters
  - contact form mailto handler
*/

(function () {
  const root = document.documentElement;
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Theme ----------
  const THEME_KEY = "smn_theme";
  const themeToggle = document.querySelector(".theme-toggle");
  const themeIcon = document.querySelector(".theme-icon");

  function setTheme(theme) {
    if (theme === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
    localStorage.setItem(THEME_KEY, theme);
    updateThemeToggleIcon(theme);
  }

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    return prefersLight ? "light" : "dark";
  }

  function updateThemeToggleIcon(theme) {
    if (!themeIcon || !themeToggle) return;
    const isLight = theme === "light";
    themeIcon.textContent = isLight ? "🌙" : "☀";
    themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
    themeToggle.setAttribute("title", isLight ? "Switch to dark mode" : "Switch to light mode");
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

  // ---------- Contact form ----------
  window.SMN = window.SMN || {};
  const contactRecipient = "linus-finn.lassen.6588@student.uu.se";
  const contactEndpoint = "https://formsubmit.co/ajax/linus-finn.lassen.6588@student.uu.se";
  window.SMN.handleFakeSubmit = function (event) {
    event.preventDefault();

    const form = event.target;
    const note = document.getElementById("formNote");
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (note) {
      note.textContent = "Sending message...";
    }

    fetch(contactEndpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name || "(not provided)",
        email: email || "(not provided)",
        message: message || "(no message)",
        _subject: `SMN Quick Message${name ? ` from ${name}` : ""}`,
        _replyto: email || contactRecipient,
        _captcha: "false",
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Request failed");
        }
        return response.json();
      })
      .then(() => {
        if (note) {
          note.textContent = "Message sent successfully.";
        }
        form.reset();
      })
      .catch(() => {
        if (note) {
          note.textContent = `Could not send automatically. Please email ${contactRecipient}.`;
        }
      });

    return false;
  };

  // ---------- Subtle biodiversity motion ----------
  const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const orbEls = Array.from(document.querySelectorAll(".bg-orbs .orb"));
  if (!prefersReducedMotion && orbEls.length > 0) {
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;

    document.addEventListener("pointermove", (event) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      targetX = (event.clientX - halfW) / halfW;
      targetY = (event.clientY - halfH) / halfH;
    });

    function animateOrbs() {
      pointerX += (targetX - pointerX) * 0.035;
      pointerY += (targetY - pointerY) * 0.035;

      orbEls.forEach((orb, index) => {
        const depth = (index + 1) * 6;
        const x = pointerX * depth;
        const y = pointerY * depth;
        orb.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });

      requestAnimationFrame(animateOrbs);
    }

    requestAnimationFrame(animateOrbs);
  }
})();
