const yearNodes = document.querySelectorAll(".js-year");
const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navPanel = document.getElementById("site-nav-panel");
const MOBILE_BREAKPOINT = 900;

yearNodes.forEach((node) => {
  node.textContent = new Date().getFullYear();
});

function setMenuState(isOpen) {
  if (!siteHeader || !menuToggle) return;

  siteHeader.classList.toggle("menu-open", isOpen);
  menuToggle.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
}

menuToggle?.addEventListener("click", () => {
  const nextState = !siteHeader?.classList.contains("menu-open");
  setMenuState(nextState);
});

navPanel?.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    setMenuState(false);
  }
});

document.addEventListener("click", (event) => {
  if (!siteHeader?.classList.contains("menu-open")) return;
  if (siteHeader.contains(event.target)) return;
  setMenuState(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenuState(false);
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > MOBILE_BREAKPOINT) {
    setMenuState(false);
  }
});
