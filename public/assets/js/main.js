const menuButton = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");

if (menuButton && primaryNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      primaryNav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    if (!primaryNav.contains(target) && !menuButton.contains(target)) {
      primaryNav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
}

function ensureIconWrap(target, iconName, extraClass, beforeElement) {
  if (!target || !iconName || !(target instanceof Element)) {
    return;
  }

  const directChildren = Array.from(target.children);
  let existingWrap = directChildren.find((el) => el.classList.contains("icon-wrap") || el.classList.contains("service-icon"));

  if (!existingWrap) {
    existingWrap = document.createElement("span");
    target.insertBefore(existingWrap, beforeElement || target.firstElementChild || null);
  } else if (beforeElement && existingWrap !== beforeElement.previousElementSibling) {
    target.insertBefore(existingWrap, beforeElement);
  }

  existingWrap.className = `icon-wrap ${extraClass}`;
  existingWrap.innerHTML = `<i data-lucide="${iconName}" aria-hidden="true"></i>`;
}

function setupServiceIcons() {
  const iconByTitle = {
    "Kitchen Remodeling": "chef-hat",
    "Bathroom Remodeling": "bath",
    "Outdoor Living": "trees",
    "Decks & Pergolas": "warehouse",
    "Exterior Painting": "paint-roller",
    "Flooring & Trim": "ruler",
    "Whole Home Updates": "house"
  };

  document.querySelectorAll(".service-strip .card, .service-grid .card").forEach((card) => {
    const heading = card.querySelector("h3");
    if (!heading) {
      return;
    }
    const normalized = heading.textContent.replace(/\s+/g, " ").trim();
    const iconName = iconByTitle[normalized];
    if (iconName) {
      ensureIconWrap(card, iconName, "icon-service", heading);
    }
  });
}

function setupWhyIcons() {
  const iconByTitle = {
    "Quality Craftsmanship": "shield-check",
    "Trusted Trade Partners": "handshake",
    "Clear Communication": "messages-square",
    "On Time & On Budget": "clock-3"
  };

  document.querySelectorAll(".why-grid .card").forEach((card) => {
    const heading = card.querySelector("h3");
    if (!heading) {
      return;
    }
    const title = heading.textContent.replace(/\s+/g, " ").trim();
    const iconName = iconByTitle[title];
    if (iconName) {
      ensureIconWrap(card, iconName, "icon-why", heading);
    }
  });
}

function setupProcessIcons() {
  const iconByStep = {
    Consultation: "clipboard-list",
    Estimate: "file-text",
    Planning: "calendar-days",
    "Project Work": "hammer",
    "Final Walkthrough": "badge-check"
  };

  document.querySelectorAll(".timeline li").forEach((item) => {
    const text = item.textContent.replace(/\s+/g, " ");
    const step = Object.keys(iconByStep).find((name) => text.includes(name));
    if (step) {
      ensureIconWrap(item, iconByStep[step], "icon-process", item.firstElementChild || null);
    }
  });
}

function setupContactIcons() {
  const map = {
    phone: "phone",
    email: "mail",
    address: "map-pin",
    hours: "clock"
  };

  const aside = document.querySelector(".contact-grid aside, .contact-grid .form-wrap:last-child");
  if (!aside) {
    return;
  }

  let hasAddress = false;
  let hasHours = false;

  aside.querySelectorAll("p").forEach((p) => {
    const raw = p.textContent.toLowerCase();
    let key = null;
    if (raw.includes("phone")) key = "phone";
    if (raw.includes("email")) key = "email";
    if (raw.includes("address") || raw.includes("service area")) {
      key = "address";
      hasAddress = true;
    }
    if (raw.includes("hours")) {
      key = "hours";
      hasHours = true;
    }

    if (key) {
      p.classList.add("contact-meta-item");
      let icon = p.querySelector(".icon-contact");
      if (!icon) {
        icon = document.createElement("span");
        icon.className = "icon-wrap icon-contact";
        icon.innerHTML = `<i data-lucide="${map[key]}" aria-hidden="true"></i>`;
        p.insertBefore(icon, p.firstChild);
      } else {
        icon.innerHTML = `<i data-lucide="${map[key]}" aria-hidden="true"></i>`;
      }
    }
  });

  if (!hasHours) {
    const hours = document.createElement("p");
    hours.className = "contact-meta-item";
    hours.innerHTML = '<span class="icon-wrap icon-contact"><i data-lucide="clock" aria-hidden="true"></i></span><strong>Hours:</strong> Mon-Fri 8am-5pm';
    aside.appendChild(hours);
  }
}

function setupFooterIcons() {
  document.querySelectorAll("footer .container").forEach((container) => {
    let social = container.querySelector(".social-links");
    if (!social) {
      social = document.createElement("div");
      social.className = "social-links";
      const copyright = container.querySelector(".small");
      container.insertBefore(social, copyright || null);
    }

    const links = [
      {
        label: "Facebook",
        href: "#",
        svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>'
      },
      {
        label: "Instagram",
        href: "#",
        svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37a4 4 0 1 1-3.73-3.73A4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>'
      },
      { label: "Houzz", icon: "home", href: "#" },
      { label: "Google Reviews", icon: "star", href: "#" }
    ];

    social.innerHTML = links
      .map((item) => {
        const iconMarkup = item.svg
          ? item.svg
          : `<i data-lucide="${item.icon}" aria-hidden="true"></i>`;
        return `<a href="${item.href}" aria-label="${item.label}"><span class="icon-wrap icon-footer">${iconMarkup}</span></a>`;
      })
      .join("");
  });
}

function initLucideIcons() {
  setupServiceIcons();
  setupWhyIcons();
  setupProcessIcons();
  setupContactIcons();
  setupFooterIcons();

  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons({
      attrs: {
        "stroke-width": "1.75"
      }
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLucideIcons);
} else {
  initLucideIcons();
}
