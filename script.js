/* Swedish Metabarcoding Network landing page JS
  - mobile nav toggle
  - theme toggle (persists in localStorage)
  - partner logo auto-loader from link domains
  - reveal-on-scroll animations
  - animated counters
  - contact form direct-send handler
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
    themeToggle.setAttribute("data-icon", isLight ? "moon" : "sun");
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

  // ---------- Partner logos from partner links ----------
  function addPartnerLogosFromLinks() {
    const partnerLinks = Array.from(document.querySelectorAll(".partner-link"));

    partnerLinks.forEach((link) => {
      if (link.querySelector(".partner-logo")) return;

      let domain = "";
      try {
        domain = new URL(link.href).hostname.replace(/^www\./i, "");
      } catch {
        return;
      }

      const linkText = link.textContent ? link.textContent.trim() : "";
      const logo = document.createElement("img");
      const text = document.createElement("span");

      logo.className = "partner-logo";
      logo.alt = "";
      logo.setAttribute("aria-hidden", "true");
      logo.loading = "lazy";

      const manualLogoUrl = link.getAttribute("data-logo-url") || "";
      const clearbitLogoUrl = `https://logo.clearbit.com/${domain}`;
      const directFaviconUrl = `https://${domain}/favicon.ico`;
      const faviconFallbackUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;

      const logoCandidates = [];
      if (manualLogoUrl) logoCandidates.push(manualLogoUrl);
      logoCandidates.push(clearbitLogoUrl, directFaviconUrl, faviconFallbackUrl);

      let currentCandidateIndex = 0;
      logo.src = logoCandidates[currentCandidateIndex];
      logo.addEventListener("error", () => {
        currentCandidateIndex += 1;
        if (currentCandidateIndex >= logoCandidates.length) return;
        logo.src = logoCandidates[currentCandidateIndex];
      });

      text.className = "partner-link-text";
      text.textContent = linkText;

      link.textContent = "";
      link.append(logo, text);
    });
  }

  function addResourceLogosFromLinks() {
    const resourceLinks = Array.from(document.querySelectorAll(".resource-logo-link"));

    resourceLinks.forEach((link) => {
      const top = link.querySelector(".resource-top");
      if (!top || top.querySelector(".resource-logo")) return;

      let domain = "";
      try {
        domain = new URL(link.href).hostname.replace(/^www\./i, "");
      } catch {
        return;
      }

      const logo = document.createElement("img");
      logo.className = "resource-logo";
      logo.alt = "";
      logo.setAttribute("aria-hidden", "true");
      logo.loading = "lazy";

      const clearbitLogoUrl = `https://logo.clearbit.com/${domain}`;
      const faviconFallbackUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;

      logo.src = clearbitLogoUrl;
      logo.addEventListener("error", () => {
        if (logo.dataset.fallbackApplied === "1") return;
        logo.dataset.fallbackApplied = "1";
        logo.src = faviconFallbackUrl;
      });

      const title = top.querySelector("h3");
      if (title) {
        top.insertBefore(logo, title);
      } else {
        top.textContent = "";
        top.append(logo);
      }
    });
  }

  addPartnerLogosFromLinks();
  addResourceLogosFromLinks();

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

})();
