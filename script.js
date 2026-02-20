(function () {
  const root = document.documentElement;

  // --- Mobile menu ---
  const toggleBtn = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector("#nav-links");

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener("click", () => {
      const open = navLinks.classList.toggle("is-open");
      toggleBtn.setAttribute("aria-expanded", String(open));
    });

    // Close menu after clicking a link (mobile)
    navLinks.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      navLinks.classList.remove("is-open");
      toggleBtn.setAttribute("aria-expanded", "false");
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      navLinks.classList.remove("is-open");
      toggleBtn.setAttribute("aria-expanded", "false");
    });
  }

  // --- Theme toggle (persisted) ---
  const themeBtn = document.querySelector(".theme-toggle");
  const THEME_KEY = "smn_theme";

  function setTheme(theme) {
    if (theme === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");

    localStorage.setItem(THEME_KEY, theme);
    if (themeBtn) {
      themeBtn.querySelector(".theme-icon").textContent = theme === "light" ? "☀" : "☾";
    }
  }

  // Initialize theme: saved > system preference
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    setTheme(prefersLight ? "light" : "dark");
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
      setTheme(current === "light" ? "dark" : "light");
    });
  }

  // --- Active nav link highlighting ---
  const sectionIds = ["about", "activities", "resources", "join", "contact"];
  const navAnchors = Array.from(document.querySelectorAll(".nav-link"));

  const sectionEls = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const observerNav = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navAnchors.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
      });
    },
    { root: null, threshold: 0.35 }
  );

  sectionEls.forEach((el) => observerNav.observe(el));

  // --- Reveal-on-scroll ---
  const revealEls = document.querySelectorAll(".reveal");
  const observerReveal = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observerReveal.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => observerReveal.observe(el));

  // --- Footer year ---
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // --- Demo form (no backend): friendly message only ---
  const form = document.getElementById("interestForm");
  const note = document.getElementById("formNote");

  if (form && note) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const email = (data.get("email") || "").toString().trim();
      const interest = (data.get("interest") || "").toString();

      if (!email) {
        note.textContent = "Please add an email address so we can follow up.";
        return;
      }

      const msg = `Thanks! We’ll follow up at ${email}${interest ? ` about “${interest}”.` : "."} (Demo: no data is sent anywhere.)`;
      note.textContent = msg;
      form.reset();
    });
  }

  // --- “Copy example card” button ---
  const copyBtn = document.getElementById("copyExampleBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const snippet =
`<!-- Example resource card -->
<article class="resource reveal">
  <div>
    <h3>Protocol repository</h3>
    <p>Link to SOPs, sample handling notes, lab controls, and reporting templates.</p>
  </div>
  <div class="resource-actions">
    <a class="btn btn-primary" href="https://example.org" target="_blank" rel="noopener">Open</a>
    <a class="btn btn-ghost" href="https://github.com/example" target="_blank" rel="noopener">GitHub</a>
  </div>
</article>`;

      try {
        await navigator.clipboard.writeText(snippet);
        copyBtn.textContent = "Copied!";
        setTimeout(() => (copyBtn.textContent = "Copy example card"), 1200);
      } catch {
        // Clipboard may fail on some contexts; fall back to prompt
        window.prompt("Copy this snippet:", snippet);
      }
    });
  }
})();