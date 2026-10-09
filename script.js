"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = $("header");
  const menuToggle = $("[data-menu-toggle]");
  const menu = $("[data-menu]");
  const navLinks = $$("a[href^='#']");
  const sections = $$("main section[id]");
  const year = $("#current-year");

  if (year) year.textContent = new Date().getFullYear();

  // Mobile navigation
  const closeMenu = () => {
    if (!menu || !menuToggle) return;
    menu.classList.remove("is-open");
    menuToggle.classList.remove("is-active");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  if (menu && menuToggle) {
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open");
      menuToggle.classList.toggle("is-active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("menu-open", isOpen);
    });

    menu.addEventListener("click", event => {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeMenu();
        menuToggle.focus();
      }
    });

    document.addEventListener("click", event => {
      if (!menu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });
  }

  // Sticky header state
  const updateHeader = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  // Smooth in-page navigation
  $$("a[href^='#']").forEach(link => {
    link.addEventListener("click", event => {
      const target = $(link.getAttribute("href"));
      if (!target) return;

      event.preventDefault();
      closeMenu();

      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });

      if (history.replaceState) history.replaceState(null, "", link.getAttribute("href"));
    });
  });

  // Reveal content as it enters the viewport
  const revealElements = $$(
    ".hero-content, .hero-visual, .section-heading, .feature, .feature-item, .step, .about-content, .cta-content"
  );

  if ("IntersectionObserver" in window && !reduceMotion) {
    revealElements.forEach(element => element.classList.add("reveal"));

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

    revealElements.forEach(element => revealObserver.observe(element));
  }

  // Highlight the current section in the navigation
  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        navLinks.forEach(link => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-25% 0px -60% 0px" });

    sections.forEach(section => sectionObserver.observe(section));
  }

  // Gentle pointer movement for the hero visual on desktop
  const heroVisual = $(".hero-visual");

  if (heroVisual && window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion) {
    heroVisual.addEventListener("pointermove", event => {
      const bounds = heroVisual.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;

      heroVisual.style.setProperty("--pointer-x", `${x * 8}px`);
      heroVisual.style.setProperty("--pointer-y", `${y * 8}px`);
    });

    heroVisual.addEventListener("pointerleave", () => {
      heroVisual.style.setProperty("--pointer-x", "0px");
      heroVisual.style.setProperty("--pointer-y", "0px");
    });
  }

  // Avoid accidental duplicate form submissions where forms exist
  $$("form").forEach(form => {
    form.addEventListener("submit", () => {
      const submitButton = form.querySelector("[type='submit']");
      if (!submitButton || !form.checkValidity()) return;

      submitButton.disabled = true;
      submitButton.setAttribute("aria-busy", "true");

      window.setTimeout(() => {
        if (submitButton.isConnected) {
          submitButton.disabled = false;
          submitButton.removeAttribute("aria-busy");
        }
      }, 8000);
    });
  });
});