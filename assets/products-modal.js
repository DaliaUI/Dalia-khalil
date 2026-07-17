function initProductModals() {
  const sections = document.querySelectorAll('.products');
  console.debug('[products-modal] initialize sections', sections.length);
  if (!sections.length) {
    console.warn('[products-modal] no .products sections found on the page');
  }

  sections.forEach(function (section) {
    const modal = section.querySelector('.products__modal');
    const modalImage = section.querySelector('.products__modal-image');
    const modalTitle = section.querySelector('.products__modal-title');
    const modalPrice = section.querySelector('.products__modal-price');
    const modalDescription = section.querySelector('.products__modal-description');
    const colorButtonsContainer = section.querySelector('.products__modal-color-buttons');
    const sizeSelect = section.querySelector('.products__modal-select');
    const closeButton = section.querySelector('.products__modal-close');
    const addToCartButton = section.querySelector('.products__add-to-cart');

    const buttons = section.querySelectorAll('.products__button');

    const sectionId = section.id || 'unknown';
    const missingElements = [];
    if (!modal) missingElements.push('products__modal');
    if (!modalImage) missingElements.push('products__modal-image');
    if (!modalTitle) missingElements.push('products__modal-title');
    if (!modalPrice) missingElements.push('products__modal-price');
    if (!modalDescription) missingElements.push('products__modal-description');
    if (!colorButtonsContainer) missingElements.push('products__modal-color-buttons');
    if (!sizeSelect) missingElements.push('products__modal-select');
    if (!closeButton) missingElements.push('products__modal-close');
    if (!addToCartButton) missingElements.push('products__add-to-cart');

    console.debug('[products-modal] section init', sectionId, 'buttons?', buttons.length, 'missing?', missingElements.join(', ') || 'none');

    if (missingElements.length) {
      console.warn('[products-modal] skipping section because required modal elements are missing:', sectionId, missingElements.join(', '));
      return;
    }

    if (!buttons.length) {
      console.warn('[products-modal] no product buttons found in section', sectionId);
    }

    let selectedColor = '';
    let selectedSize = '';
    let selectedVariantId = '';

    function resetSelections() {
      selectedColor = '';
      selectedSize = '';
      colorButtonsContainer.querySelectorAll('.products__modal-color-button').forEach(function (button) {
        button.classList.remove('products__modal-color-button--selected');
      });
      sizeSelect.value = '';
      addToCartButton.disabled = true;
    }

    function updateAddToCartState() {
      addToCartButton.disabled = !(selectedColor && selectedSize && selectedVariantId);
    }

    function createColorButton(value) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'products__modal-color-button';
      button.textContent = value;
      button.dataset.value = value;
      button.addEventListener('click', function () {
        selectedColor = this.dataset.value;
        colorButtonsContainer.querySelectorAll('.products__modal-color-button').forEach(function (btn) {
          btn.classList.toggle('products__modal-color-button--selected', btn === button);
        });
        updateAddToCartState();
      });
      return button;
    }

    function fillSizeOptions(sizes) {
      sizeSelect.innerHTML = '<option value="">Choose your size</option>' + sizes.map(function (size) {
        return '<option value="' + size + '">' + size + '</option>';
      }).join('');
    }

    function openModal(data) {
      selectedVariantId = data.productVariantId || '';
      modalImage.src = data.productImage || '';
      modalImage.alt = data.productTitle || '';
      modalTitle.textContent = data.productTitle || '';
      modalPrice.textContent = data.productPrice || '';
      modalDescription.textContent = data.productDescription || '';

      const colors = data.productColors ? data.productColors.split(',').map(function (item) { return item.trim(); }).filter(Boolean) : [];
      const sizes = data.productSizes ? data.productSizes.split(',').map(function (item) { return item.trim(); }).filter(Boolean) : [];

      colorButtonsContainer.innerHTML = '';
      colors.forEach(function (color) {
        colorButtonsContainer.appendChild(createColorButton(color));
      });

      fillSizeOptions(sizes);
      resetSelections();
      addToCartButton.disabled = true;
      modal.classList.add('products__modal--open');
      modal.setAttribute('aria-hidden', 'false');
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        selectedVariantId = button.dataset.productVariantId || '';
        console.debug('[products-modal] open modal for', button.dataset.productTitle, 'variant', selectedVariantId);
        openModal(button.dataset);
      });
    });

    sizeSelect.addEventListener('change', function () {
      selectedSize = this.value;
      updateAddToCartState();
    });

    closeButton.addEventListener('click', function () {
      modal.classList.remove('products__modal--open');
      modal.setAttribute('aria-hidden', 'true');
    });

    modal.addEventListener('click', function (event) {
      if (event.target === modal) {
        modal.classList.remove('products__modal--open');
        modal.setAttribute('aria-hidden', 'true');
      }
    });

    addToCartButton.addEventListener('click', function () {
      if (!selectedColor || !selectedSize || !selectedVariantId) {
        return;
      }

      fetch(Theme.routes.cart_add_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          id: selectedVariantId,
          quantity: 1
        })
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Cart add failed');
          }
          return response.json();
        })
        .then(function () {
          modal.classList.remove('products__modal--open');
          modal.setAttribute('aria-hidden', 'true');
        })
        .catch(function () {
          alert('Unable to add this product to cart. Please try again.');
        });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && modal.classList.contains('products__modal--open')) {
        modal.classList.remove('products__modal--open');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProductModals);
} else {
  initProductModals();
}

window.initProductModals = initProductModals;
