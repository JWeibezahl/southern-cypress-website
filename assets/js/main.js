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

document.querySelectorAll(".faq-toggle").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const item = toggle.closest(".faq-item");
    if (!item) {
      return;
    }
    item.classList.toggle("open");
  });
});
