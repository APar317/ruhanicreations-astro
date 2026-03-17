const productGrid = document.getElementById("product-grid");
const emptyState = document.getElementById("empty-state");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const statusSelect = document.getElementById("status");

const modal = document.getElementById("product-modal");
const closeModalBtn = document.getElementById("close-modal");
const modalImageFrame = document.getElementById("modal-image-frame");
const modalMainImage = document.getElementById("modal-main-image");
const prevImageBtn = document.getElementById("modal-prev-image");
const nextImageBtn = document.getElementById("modal-next-image");
const zoomOutBtn = document.getElementById("zoom-out");
const zoomResetBtn = document.getElementById("zoom-reset");
const zoomInBtn = document.getElementById("zoom-in");
const modalThumbs = document.getElementById("modal-thumbnails");
const modalCategory = document.getElementById("modal-category");
const modalTitle = document.getElementById("modal-title");
const modalPrice = document.getElementById("modal-price");
const modalStatus = document.getElementById("modal-status");
const modalDescription = document.getElementById("modal-description");
const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.25;

let activeModalProduct = null;
let activeImageIndex = 0;
let zoomLevel = ZOOM_MIN;

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

function getActualPrice(product) {
  return typeof product.actualPriceInr === "number" ? product.actualPriceInr : 0;
}

function getDiscountPercent(product) {
  return typeof product.discountPercent === "number" ? product.discountPercent : 0;
}

function getNetPrice(product) {
  if (typeof product.netPriceInr === "number") return product.netPriceInr;

  const actualPrice = getActualPrice(product);
  const discountPercent = getDiscountPercent(product);
  return Math.round(actualPrice * (1 - discountPercent / 100));
}

function getSavings(product) {
  const actualPrice = getActualPrice(product);
  const netPrice = getNetPrice(product);
  return Math.max(0, actualPrice - netPrice);
}

function renderPriceMarkup(product) {
  const actualPrice = getActualPrice(product);
  const discountPercent = getDiscountPercent(product);
  const netPrice = getNetPrice(product);
  const savings = getSavings(product);

  if (!actualPrice) {
    return `
      <div class="price-stack">
        <div class="price-current-card">
          <div class="price-current-copy">
            <span class="price-label">Price</span>
            <span class="price-current">${currency.format(netPrice)}</span>
          </div>
        </div>
      </div>
    `;
  }

  if (!discountPercent) {
    return `
      <div class="price-stack">
        <div class="price-current-card">
          <div class="price-current-copy">
            <span class="price-label">Price</span>
            <span class="price-current">${currency.format(actualPrice)}</span>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="price-stack">
      <div class="price-current-card">
        <div class="price-current-copy">
          <span class="price-label">Current Price</span>
          <span class="price-current">${currency.format(netPrice)}</span>
        </div>
        <span class="discount-pill">${discountPercent}% off</span>
      </div>
      <div class="price-support-row">
        <span class="price-original-group">
          <span class="price-mini-label">Was</span>
          <span class="price-original">${currency.format(actualPrice)}</span>
        </span>
        <span class="price-save-pill">You save ${currency.format(savings)}</span>
      </div>
    </div>
  `;
}

function renderModalPriceMarkup(product) {
  const actualPrice = getActualPrice(product);
  const discountPercent = getDiscountPercent(product);
  const netPrice = getNetPrice(product);
  const savings = getSavings(product);

  if (!discountPercent) {
    return `
      <div class="modal-price-board">
        <div class="modal-price-highlight">
          <span class="price-label">Price</span>
          <div class="modal-price-main">${currency.format(actualPrice || netPrice)}</div>
        </div>
      </div>
    `;
  }

  return `
    <div class="modal-price-board">
      <div class="modal-price-highlight">
        <span class="price-label">Current Price</span>
        <span class="modal-price-main">${currency.format(netPrice)}</span>
      </div>
      <span class="discount-pill">${discountPercent}% off</span>
    </div>
    <div class="modal-price-meta">
      <span class="modal-price-meta-item">
        <span class="price-mini-label">Original Price</span>
        <strong>${currency.format(actualPrice)}</strong>
      </span>
      <span class="modal-price-meta-item">
        <span class="price-mini-label">You Save</span>
        <strong>${currency.format(savings)}</strong>
      </span>
    </div>
  `;
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
            </div>
            ${renderPriceMarkup(item)}
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

function updateImageNavigationState() {
  if (!activeModalProduct) return;
  const hasMultipleImages = activeModalProduct.images.length > 1;
  prevImageBtn.disabled = !hasMultipleImages;
  nextImageBtn.disabled = !hasMultipleImages;
}

function applyZoom() {
  modalMainImage.style.transform = `scale(${zoomLevel})`;
  modalImageFrame.classList.toggle("zoomed", zoomLevel > ZOOM_MIN);
  zoomResetBtn.textContent = `${Math.round(zoomLevel * 100)}%`;
  zoomOutBtn.disabled = zoomLevel <= ZOOM_MIN;
  zoomInBtn.disabled = zoomLevel >= ZOOM_MAX;
}

function resetZoom() {
  zoomLevel = ZOOM_MIN;
  modalMainImage.style.transformOrigin = "center center";
  applyZoom();
}

function adjustZoom(delta) {
  zoomLevel = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoomLevel + delta));
  applyZoom();
}

function renderModalThumbnails(product, selectedIndex) {
  modalThumbs.innerHTML = product.images
    .map((img, index) => {
      const activeClass = index === selectedIndex ? "active" : "";
      return `
        <button type="button" class="thumb ${activeClass}" data-index="${index}" aria-label="View product image ${index + 1}">
          <img src="${img}" alt="${product.title}">
        </button>
      `;
    })
    .join("");
}

function setActiveModalImage(index) {
  if (!activeModalProduct || !activeModalProduct.images.length) return;
  const imageCount = activeModalProduct.images.length;
  activeImageIndex = ((index % imageCount) + imageCount) % imageCount;
  modalMainImage.src = activeModalProduct.images[activeImageIndex];
  modalMainImage.alt = activeModalProduct.title;
  renderModalThumbnails(activeModalProduct, activeImageIndex);
  resetZoom();
}

function moveModalImage(offset) {
  if (!activeModalProduct) return;
  setActiveModalImage(activeImageIndex + offset);
}

function openModal(productId) {
  const product = PRODUCTS.find((item) => item.id === productId);
  if (!product) return;

  activeModalProduct = product;
  activeImageIndex = 0;
  modalCategory.textContent = product.category;
  modalTitle.textContent = product.title;
  modalPrice.innerHTML = renderModalPriceMarkup(product);
  modalStatus.textContent = statusLabel(product.status);
  modalStatus.className = `status-badge ${statusClass(product.status)}`;
  modalDescription.textContent = product.description;
  updateImageNavigationState();
  setActiveModalImage(0);
  modal.showModal();
}

function closeModal() {
  if (modal.open) {
    modal.close();
  }
  activeModalProduct = null;
  activeImageIndex = 0;
  resetZoom();
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

  prevImageBtn.addEventListener("click", () => moveModalImage(-1));
  nextImageBtn.addEventListener("click", () => moveModalImage(1));

  zoomInBtn.addEventListener("click", () => adjustZoom(ZOOM_STEP));
  zoomOutBtn.addEventListener("click", () => adjustZoom(-ZOOM_STEP));
  zoomResetBtn.addEventListener("click", resetZoom);

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
    setActiveModalImage(Number(thumb.dataset.index));
  });

  modalImageFrame.addEventListener(
    "wheel",
    (event) => {
      if (!modal.open) return;
      event.preventDefault();
      adjustZoom(event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP);
    },
    { passive: false }
  );

  modalImageFrame.addEventListener("mousemove", (event) => {
    if (zoomLevel <= ZOOM_MIN) return;
    const rect = modalMainImage.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const xClamped = Math.min(100, Math.max(0, x));
    const yClamped = Math.min(100, Math.max(0, y));
    modalMainImage.style.transformOrigin = `${xClamped}% ${yClamped}%`;
  });

  modalImageFrame.addEventListener("mouseleave", () => {
    if (zoomLevel > ZOOM_MIN) {
      modalMainImage.style.transformOrigin = "center center";
    }
  });

  modal.addEventListener("keydown", (event) => {
    if (!modal.open) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveModalImage(-1);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveModalImage(1);
      return;
    }

    if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      adjustZoom(ZOOM_STEP);
      return;
    }

    if (event.key === "-" || event.key === "_") {
      event.preventDefault();
      adjustZoom(-ZOOM_STEP);
      return;
    }

    if (event.key === "0") {
      event.preventDefault();
      resetZoom();
    }
  });
}

function init() {
  if (!productGrid || !searchInput || !categorySelect || !statusSelect || !modal) {
    return;
  }

  buildCategoryOptions();
  renderProducts();
  setupEvents();
  resetZoom();
}

init();
