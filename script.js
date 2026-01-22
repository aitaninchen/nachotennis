document.addEventListener("DOMContentLoaded", () => {
  // Year in footer
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Hamburger Menu
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    // Toggle menu open/closed
    function toggleMenu() {
      const isOpen = navLinks.classList.toggle("open");
      hamburger.classList.toggle("active");
      hamburger.setAttribute("aria-expanded", isOpen);

      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? "hidden" : "";
    }

    // Close menu
    function closeMenu() {
      navLinks.classList.remove("open");
      hamburger.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });

    // Close menu on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("open")) {
        closeMenu();
      }
    });
  }

  // Modal functionality
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  const modalClose = document.querySelector(".modal-close");
  const modalBackdrop = document.querySelector(".modal-backdrop");

  // Open modal and load content
  document.querySelectorAll("[data-modal]").forEach((link) => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();
      const file = link.getAttribute("data-modal");
      try {
        const response = await fetch(file);
        if (!response.ok) throw new Error("Datei nicht gefunden");
        const html = await response.text();
        modalBody.innerHTML = html;
        modal.hidden = false;
        document.body.style.overflow = "hidden";
      } catch (err) {
        modalBody.innerHTML = "<p>Inhalt konnte nicht geladen werden.</p>";
        modal.hidden = false;
      }
    });
  });

  // Close modal
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    modalBody.innerHTML = "";
  }

  modalClose?.addEventListener("click", closeModal);
  modalBackdrop?.addEventListener("click", closeModal);

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });

  // ========================================
  // SCROLL ANIMATIONS
  // Uses IntersectionObserver for performance
  // ========================================

  /**
   * Initialize scroll-based animations
   * Elements with .animate-on-scroll class will fade in when visible
   */
  function initScrollAnimations() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      // Show all elements immediately if user prefers reduced motion
      document
        .querySelectorAll(".animate-on-scroll, .hero-content, .hero-image")
        .forEach((el) => el.classList.add("is-visible"));
      return;
    }

    // Configuration for the observer
    const observerOptions = {
      root: null, // viewport
      rootMargin: "0px 0px -50px 0px", // trigger slightly before element is fully visible
      threshold: 0.1, // trigger when 10% visible
    };

    // Create the observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          // Stop observing once animated (performance optimization)
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    // Hero elements - animate immediately on page load with slight delay
    const heroContent = document.querySelector(".hero-content");
    const heroImage = document.querySelector(".hero-image");

    if (heroContent || heroImage) {
      setTimeout(() => {
        heroContent?.classList.add("is-visible");
        heroImage?.classList.add("is-visible");
      }, 100);
    }
  }

  // Initialize scroll animations
  initScrollAnimations();

  // ========================================
  // FAQ ACCORDION ANIMATIONS
  // Smooth height animation for details/summary
  // ========================================

  function initFaqAnimations() {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((details) => {
      const summary = details.querySelector(".faq-question");
      const answer = details.querySelector(".faq-answer");

      if (!summary || !answer) return;

      summary.addEventListener("click", (e) => {
        e.preventDefault();

        // If already animating, don't interrupt
        if (details.classList.contains("animating")) return;

        const isOpen = details.hasAttribute("open");

        if (isOpen) {
          // Closing animation
          details.classList.add("animating");
          const startHeight = answer.scrollHeight;
          answer.style.height = startHeight + "px";

          // Force reflow
          answer.offsetHeight;

          answer.style.height = "0px";

          answer.addEventListener(
            "transitionend",
            () => {
              details.removeAttribute("open");
              details.classList.remove("animating");
              answer.style.height = "";
            },
            { once: true },
          );
        } else {
          // Opening animation
          details.setAttribute("open", "");
          details.classList.add("animating");

          const endHeight = answer.scrollHeight;
          answer.style.height = "0px";

          // Force reflow
          answer.offsetHeight;

          answer.style.height = endHeight + "px";

          answer.addEventListener(
            "transitionend",
            () => {
              details.classList.remove("animating");
              answer.style.height = "";
            },
            { once: true },
          );
        }
      });
    });
  }

  // Initialize FAQ animations
  initFaqAnimations();
});
