const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelectorAll(".site-nav a");
const revealItems = document.querySelectorAll(".reveal");
const flow = document.querySelector("[data-flow]");
const sections = document.querySelectorAll("main section[id]");
const counters = document.querySelectorAll("[data-count]");

// Mobile Navigation zentral schließen, damit Klicks, Escape und Link-Auswahl gleich reagieren.
const closeNavigation = () => {
  nav.classList.remove("is-open");
  navToggle.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Navigation öffnen");
  document.body.classList.remove("nav-open");
};

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Navigation schließen" : "Navigation öffnen");
  document.body.classList.toggle("nav-open", isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeNavigation();
  });
});

window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");

      if (entry.target.matches("[data-flow]")) {
        entry.target.classList.add("is-visible");
      }

      if (entry.target.classList.contains("stats")) {
        animateCounters();
      }

      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -80px 0px"
  }
);

// Reveal-Animationen laufen einmalig und mit leicht versetztem Timing.
revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 5, 4) * 80}ms`;
  revealObserver.observe(item);
});

if (flow) {
  revealObserver.observe(flow);
}

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const activeLink = document.querySelector(`.site-nav a[href="#${entry.target.id}"]`);
      navLinks.forEach((link) => link.classList.remove("is-active"));

      if (activeLink) {
        activeLink.classList.add("is-active");
      }
    });
  },
  {
    threshold: 0.36,
    rootMargin: "-20% 0px -55% 0px"
  }
);

sections.forEach((section) => navObserver.observe(section));

let countersStarted = false;

// Dezente Zähleranimation für die Beispielwerte im Praxisbereich.
function animateCounters() {
  if (countersStarted) return;
  countersStarted = true;

  counters.forEach((counter) => {
    const target = Number(counter.dataset.count);
    const duration = 1100;
    const start = performance.now();

    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(target * eased);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("is-open")) {
    closeNavigation();
  }
});
