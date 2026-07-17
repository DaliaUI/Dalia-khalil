function initProductModals() {
  document.querySelectorAll('.products').forEach(function (section) {
    const modal = section.querySelector('.products__modal');
    const modalImage = section.querySelector('.products__modal-image');
    const modalTitle = section.querySelector('.products__modal-title');
    const modalPrice = section.querySelector('.products__modal-price');
    const modalDescription = section.querySelector('.products__modal-description');
    const colorButtonsContainer = section.querySelector('.products__modal-color-buttons');
    const sizeSelect = section.querySelector('.products__modal-select');
    const closeButton = section.querySelector('.products__modal-close');
    const addToCartButton = section.querySelector('.products__add-to-cart');

    if (!modal || !modalImage || !modalTitle || !modalPrice || !modalDescription || !colorButtonsContainer || !sizeSelect || !addToCartButton) {
      return;
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

    section.querySelectorAll('.products__button').forEach(function (button) {
      button.addEventListener('click', function () {
        selectedVariantId = button.dataset.productVariantId || '';
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
