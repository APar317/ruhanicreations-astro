const productGrid = document.getElementById("product-grid");
const emptyState = document.getElementById("empty-state");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const statusSelect = document.getElementById("status");

const modal = document.getElementById("product-modal");
const closeModalBtn = document.getElementById("close-modal");
const modalMainImage = document.getElementById("modal-main-image");
const modalThumbs = document.getElementById("modal-thumbnails");
const modalCategory = document.getElementById("modal-category");
const modalTitle = document.getElementById("modal-title");
const modalPrice = document.getElementById("modal-price");
const modalStatus = document.getElementById("modal-status");
const modalDescription = document.getElementById("modal-description");

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

function statusLabel(status) {
  return status === "sold" ? "Sold" : "In Stock";
}

function statusClass(status) {
  return status === "sold" ? "status-sold" : "status-in-stock";
}

function buildCategoryOptions() {
  const categories = ["all", ...new Set(PRODUCTS.map((p) => p.category))];
  categorySelect.innerHTML = categories
    .map((category) => {
      const label = category === "all" ? "All Categories" : category;
      return `<option value="${category}">${label}</option>`;
    })
    .join("");
}

function getFilteredProducts() {
  const search = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;
  const status = statusSelect.value;

  return PRODUCTS.filter((item) => {
    const matchesSearch =
      !search ||
      item.title.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search);

    const matchesCategory = category === "all" || item.category === category;
    const matchesStatus = status === "all" || item.status === status;

    return matchesSearch && matchesCategory && matchesStatus;
  });
}

function renderProducts() {
  const items = getFilteredProducts();

  if (!items.length) {
    productGrid.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  productGrid.innerHTML = items
    .map((item) => {
      const firstImage = item.images[0] || "";
      return `
        <article class="card">
          <img src="${firstImage}" alt="${item.title}">
          <div class="card-body">
            <p class="eyebrow">${item.category}</p>
            <div class="card-head">
              <h3>${item.title}</h3>
              <span class="price">${currency.format(item.priceInr)}</span>
            </div>
            <span class="status-badge ${statusClass(item.status)}">${statusLabel(item.status)}</span>
            <p class="card-copy">${item.description}</p>
            <div class="card-actions">
              <button class="button ghost view-details" type="button" data-id="${item.id}">
                View details
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderModalThumbnails(product, selectedImage) {
  modalThumbs.innerHTML = product.images
    .map((img) => {
      const activeClass = img === selectedImage ? "active" : "";
      return `
        <button type="button" class="thumb ${activeClass}" data-image="${img}" aria-label="View product image">
          <img src="${img}" alt="${product.title}">
        </button>
      `;
    })
    .join("");
}

function openModal(productId) {
  const product = PRODUCTS.find((item) => item.id === productId);
  if (!product) return;

  const firstImage = product.images[0] || "";
  modalMainImage.src = firstImage;
  modalMainImage.alt = product.title;
  modalCategory.textContent = product.category;
  modalTitle.textContent = product.title;
  modalPrice.textContent = currency.format(product.priceInr);
  modalStatus.textContent = statusLabel(product.status);
  modalStatus.className = `status-badge ${statusClass(product.status)}`;
  modalDescription.textContent = product.description;
  renderModalThumbnails(product, firstImage);
  modal.showModal();
}

function closeModal() {
  if (modal.open) modal.close();
}

function setupEvents() {
  searchInput.addEventListener("input", renderProducts);
  categorySelect.addEventListener("change", renderProducts);
  statusSelect.addEventListener("change", renderProducts);

  productGrid.addEventListener("click", (event) => {
    const button = event.target.closest(".view-details");
    if (!button) return;
    openModal(button.dataset.id);
  });

  closeModalBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    const rect = modal.getBoundingClientRect();
    const inDialog =
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width;
    if (!inDialog) closeModal();
  });

  modalThumbs.addEventListener("click", (event) => {
    const thumb = event.target.closest(".thumb");
    if (!thumb) return;

    const image = thumb.dataset.image;
    modalMainImage.src = image;
    modalMainImage.alt = modalTitle.textContent;
    [...modalThumbs.querySelectorAll(".thumb")].forEach((node) =>
      node.classList.toggle("active", node === thumb)
    );
  });
}

function init() {
  buildCategoryOptions();
  renderProducts();
  setupEvents();
}

init();
