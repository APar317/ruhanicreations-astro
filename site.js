const yearNodes = document.querySelectorAll(".js-year");

yearNodes.forEach((node) => {
  node.textContent = new Date().getFullYear();
});
