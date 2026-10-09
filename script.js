/* ==========================================
   BIZORA — HOME PAGE INTERACTIONS
   Smooth animations • Responsive • Accessible
   ========================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================
     1. CURRENT FOOTER YEAR
     ========================================== */

  const currentYear = document.getElementById("current-year");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }


  /* ==========================================
     2. NAVBAR SCROLL EFFECT
     ========================================== */

  const header = document.querySelector("header");

  const updateHeader = () => {
    if (!header) return;

    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });


  /* ==========================================
     3. SMOOTH INTERNAL NAVIGATION
     ========================================== */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href === "#") {
        event.preventDefault();
        return;
      }

      const target = document.querySelector(href);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "auto" : "smooth",
        block: "start"
      });

      // Update URL without triggering a page jump.
      if (history.pushState) {
        history.pushState(null, "", href);
      }
    });
  });


  /* ==========================================
     4. REVEAL ELEMENTS ON SCROLL
     ========================================== */

  const revealSelectors = [
    ".section-heading",
    ".feature-card",
    ".step-card",
    ".about-content",
    ".about-visual",
    ".cta-box",
    ".dashboard-preview",
    ".readiness-card",
    ".recommendation-card",
    ".quick-action",
    ".quick-action-card"
  ];

  const revealElements = document.querySelectorAll(
    revealSelectors.join(",")
  );

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("reveal-on-scroll");
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }


  /* ==========================================
     5. STAGGERED FEATURE CARD ANIMATIONS
     ========================================== */

  document.querySelectorAll(
    ".features-grid, .feature-grid, .features-container, .steps-grid, .how-grid"
  ).forEach((grid) => {
    const cards = grid.querySelectorAll(
      ".feature-card, .step-card"
    );

    cards.forEach((card, index) => {
      card.style.setProperty(
        "--reveal-delay",
        `${Math.min(index * 90, 360)}ms`
      );
    });
  });


  /* ==========================================
     6. BUTTON PRESS FEEDBACK
     ========================================== */

  document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("pointerdown", () => {
      button.classList.add("is-pressed");
    });

    ["pointerup", "pointerleave", "pointercancel"].forEach(
      (eventName) => {
        button.addEventListener(eventName, () => {
          button.classList.remove("is-pressed");
        });
      }
    );
  });


  /* ==========================================
     7. INTERACTIVE HOVER EFFECTS
     ========================================== */

  const hoverCards = document.querySelectorAll(
    ".feature-card, .step-card, .quick-action, .quick-action-card"
  );

  hoverCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.classList.add("is-hovered");
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("is-hovered");
    });
  });


  /* ==========================================
     8. ANIMATE READINESS PROGRESS
     ========================================== */

  const progressBars = document.querySelectorAll(
    ".progress-fill, .progress-bar-fill"
  );

  const animateProgress = (bar) => {
    const targetWidth = bar.dataset.progress;

    // Only animate a percentage explicitly provided in HTML.
    if (
      targetWidth === undefined ||
      targetWidth.trim() === "" ||
      !Number.isFinite(Number(targetWidth))
    ) {
      return;
    }

    const percentage = Math.max(
      0,
      Math.min(100, Number(targetWidth))
    );

    bar.style.width = "0%";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bar.style.width = `${percentage}%`;
      });
    });
  };

  if ("IntersectionObserver" in window && !reduceMotion) {
    const progressObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          animateProgress(entry.target);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.3
      }
    );

    progressBars.forEach((bar) => {
      progressObserver.observe(bar);
    });
  } else {
    progressBars.forEach(animateProgress);
  }


  /* ==========================================
     9. COUNTER ANIMATION
     ========================================== */

  const counters = document.querySelectorAll("[data-counter]");

  const animateCounter = (element) => {
    const target = Number(element.dataset.counter);

    if (!Number.isFinite(target)) return;

    const duration = reduceMotion ? 0 : 900;

    if (duration === 0) {
      element.textContent = String(target);
      return;
    }

    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      // Ease-out animation.
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      const currentValue = Math.round(
        target * easedProgress
      );

      element.textContent = currentValue.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  };

  if ("IntersectionObserver" in window && !reduceMotion) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.5
      }
    );

    counters.forEach((counter) => {
      counterObserver.observe(counter);
    });
  } else {
    counters.forEach(animateCounter);
  }


  /* ==========================================
     10. ESCAPE KEY SUPPORT
     ========================================== */

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    // Close any future dismissible UI that uses this class.
    document.querySelectorAll(".is-open").forEach((element) => {
      element.classList.remove("is-open");
    });
  });


  /* ==========================================
     11. PREVENT EMPTY PLACEHOLDER LINKS
     ========================================== */

  document.querySelectorAll('a[href="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
    });
  });


  /* ==========================================
     12. REDUCED MOTION CLASS
     ========================================== */

  document.documentElement.classList.toggle(
    "reduce-motion",
    reduceMotion
  );

});
