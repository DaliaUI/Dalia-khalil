document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.products').forEach(function (section) {
    const modal = section.querySelector('.products__modal');
    const modalImage = section.querySelector('.products__modal-image');
    const modalTitle = section.querySelector('.products__modal-title');
    const modalPrice = section.querySelector('.products__modal-price');
    const modalDescription = section.querySelector('.products__modal-description');
    const modalColors = section.querySelector('.products__color-list');
    const modalSizes = section.querySelector('.products__sizes');
    const closeButton = section.querySelector('.products__modal-close');
    const addToCartButton = section.querySelector('.products__add-to-cart');

    if (!modal || !modalImage || !modalTitle || !modalPrice || !modalDescription) {
      return;
    }

    function renderChoices(container, values, className) {
      container.innerHTML = '';
      values.forEach(function (value) {
        if (!value) return;
        const pill = document.createElement('span');
        pill.className = className;
        pill.textContent = value.trim();
        container.appendChild(pill);
      });
    }

    function closeModal() {
      modal.classList.remove('products__modal--open');
      modal.setAttribute('aria-hidden', 'true');
    }

    function openModal(data) {
      modalImage.src = data.productImage || '';
      modalImage.alt = data.productTitle || '';
      modalTitle.textContent = data.productTitle || '';
      modalPrice.textContent = data.productPrice || '';
      modalDescription.textContent = data.productDescription || '';

      const colors = data.productColors ? data.productColors.split(',').map(function (item) { return item.trim(); }) : [];
      const sizes = data.productSizes ? data.productSizes.split(',').map(function (item) { return item.trim(); }) : [];

      renderChoices(modalColors, colors, 'products__color-pill');
      renderChoices(modalSizes, sizes, 'products__size-pill');

      modal.classList.add('products__modal--open');
      modal.setAttribute('aria-hidden', 'false');
    }

    section.querySelectorAll('.products__button').forEach(function (button) {
      button.addEventListener('click', function () {
        openModal(button.dataset);
      });
    });

    if (closeButton) {
      closeButton.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', function (event) {
      if (event.target === modal) {
        closeModal();
      }
    });

    if (addToCartButton) {
      addToCartButton.addEventListener('click', closeModal);
    }

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && modal.classList.contains('products__modal--open')) {
        closeModal();
      }
    });
  });
});
