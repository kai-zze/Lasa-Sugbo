(function () {
  "use strict";

  if (document.getElementById("year")) {
    document.getElementById("year").textContent = new Date().getFullYear();
  }

  if (window.location.hash) {
    window.location.replace(window.location.pathname + window.location.search);
    setTimeout(function () {
      window.location.reload();
    }, 50);
    return;
  }

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  var savedTheme = localStorage.getItem("theme");
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  var initialTheme = savedTheme || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", initialTheme);

  var navActions = document.querySelector(".nav-actions");
  if (navActions) {
    var themeToggle = document.createElement("button");
    themeToggle.className = "theme-toggle";
    themeToggle.setAttribute("aria-label", "Toggle dark/light theme");
    themeToggle.innerHTML = `
      <svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      <svg class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
    var navToggleBtn = navActions.querySelector(".nav-toggle");
    navActions.insertBefore(themeToggle, navToggleBtn || null);

    themeToggle.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme");
      var next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }

  var navToggle = document.querySelector(".nav-toggle");
  var mobilePanel = document.querySelector(".mobile-panel");
  if (mobilePanel && navToggle) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      mobilePanel.classList.toggle('is-open');
    });
  }
  
  if (mobilePanel) {
    mobilePanel.querySelectorAll(".accordion-trigger").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var panel = document.getElementById(trigger.getAttribute("aria-controls"));
        var isOpen = panel.classList.toggle("is-open");
        trigger.setAttribute("aria-expanded", String(isOpen));
      });
    });
  }

  var navLinks = document.querySelectorAll(".nav-list a");
  if (navLinks.length) {
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.forEach(function (l) { l.classList.remove("is-active"); });
        link.classList.add("is-active");
      });
    });

    navLinks.forEach(function (l) { l.classList.remove("is-active"); });
    var homeLink = document.querySelector(".nav-list a[href='#hero']");
    if (homeLink) {
      homeLink.classList.add("is-active");
    }
  }

  document.querySelectorAll("[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var successEl = form.parentElement.querySelector(".form-success") || form.querySelector(".form-success");
      if (successEl) {
        successEl.classList.add("is-visible");
        successEl.setAttribute("role", "status");
      }
      form.reset();
    });
  });

  var header = document.querySelector(".site-header");
  if (header) {
    window.addEventListener("scroll", function () {
      header.style.boxShadow = window.scrollY > 4 ? "0 8px 24px -16px rgba(0,0,0,0.5)" : "none";
    }, { passive: true });
  }

  var reveals = document.querySelectorAll(".reveal-up");
  if ("IntersectionObserver" in window && reveals.length) {
    var revealObserver = new IntersectionObserver(
      function(entries, observer) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    reveals.forEach(function(reveal) {
      revealObserver.observe(reveal);
    });
  } else {
    reveals.forEach(function(reveal) {
      reveal.classList.add("is-revealed");
    });
  }
})();