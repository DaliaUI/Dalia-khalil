function initProductModals() {
  const sections = document.querySelectorAll('.products');
  console.debug('[products-modal] initialize sections', sections.length);
  if (!sections.length) {
    console.warn('[products-modal] no .products sections found on the page');
  }

  function createFallbackModal(section) {
    const modal = section.querySelector('.products__modal') || document.createElement('div');
    modal.className = 'products__modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="products__modal-dialog">
        <button type="button" class="products__modal-close" aria-label="Close product details">×</button>
        <div class="products__modal-header">
          <img src="" alt="Product preview" class="products__modal-image" />
          <div class="products__modal-info">
            <h3 class="products__modal-title"></h3>
            <p class="products__modal-price"></p>
            <p class="products__modal-description"></p>
          </div>
        </div>

        <p class="products__modal-label">Color</p>
        <div class="products__modal-color-buttons"></div>

        <div class="mt-5">
          <label class="products__modal-label" for="products-size-select">Size</label>
          <div class="products__modal-select-wrapper">
            <select id="products-size-select" class="products__modal-select" aria-label="Size">
              <option value="">Choose your size</option>
            </select>
            <span class="products__modal-select-icon">
              ▼
            </span>
          </div>
        </div>

        <button type="button" class="products__add-to-cart" disabled>
          ADD TO CART
        </button>
      </div>
    `;
    if (!section.contains(modal)) {
      section.appendChild(modal);
    }
    return modal;
  }

  sections.forEach(function (section) {
    let modal = section.querySelector('.products__modal');
    if (!modal) {
      console.warn('[products-modal] no modal wrapper found, creating fallback for', section.id || 'unknown');
      modal = createFallbackModal(section);
    }

    let modalImage = section.querySelector('.products__modal-image');
    let modalTitle = section.querySelector('.products__modal-title');
    let modalPrice = section.querySelector('.products__modal-price');
    let modalDescription = section.querySelector('.products__modal-description');
    let colorButtonsContainer = section.querySelector('.products__modal-color-buttons');
    let sizeSelect = section.querySelector('.products__modal-select');
    let closeButton = section.querySelector('.products__modal-close');
    let addToCartButton = section.querySelector('.products__add-to-cart');

    const buttons = section.querySelectorAll('.products__button');

    const sectionId = section.id || 'unknown';
    const missingElements = [];
    if (!modalImage) missingElements.push('products__modal-image');
    if (!modalTitle) missingElements.push('products__modal-title');
    if (!modalPrice) missingElements.push('products__modal-price');
    if (!modalDescription) missingElements.push('products__modal-description');
    if (!colorButtonsContainer) missingElements.push('products__modal-color-buttons');
    if (!sizeSelect) missingElements.push('products__modal-select');
    if (!closeButton) missingElements.push('products__modal-close');
    if (!addToCartButton) missingElements.push('products__add-to-cart');

    if (missingElements.length) {
      console.warn('[products-modal] patching missing modal elements:', sectionId, missingElements.join(', '));
      modal = createFallbackModal(section);
      modalImage = section.querySelector('.products__modal-image');
      modalTitle = section.querySelector('.products__modal-title');
      modalPrice = section.querySelector('.products__modal-price');
      modalDescription = section.querySelector('.products__modal-description');
      colorButtonsContainer = section.querySelector('.products__modal-color-buttons');
      sizeSelect = section.querySelector('.products__modal-select');
      closeButton = section.querySelector('.products__modal-close');
      addToCartButton = section.querySelector('.products__add-to-cart');
    }

    console.debug('[products-modal] section init', sectionId, 'buttons?', buttons.length, 'missing?', missingElements.join(', ') || 'none');

    if (!buttons.length) {
      console.warn('[products-modal] no product buttons found in section', sectionId);
    }

let selectedColor = '';
let selectedSize = '';
let selectedVariantId = '';
let variants = [];
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
    function updateSelectedVariant() {

  const variant = variants.find(function (item) {

    return item.options.includes(selectedColor)
      && item.options.includes(selectedSize);

  });

  if (variant) {

    selectedVariantId = variant.id;

  } else {

    selectedVariantId = '';

  }

  updateAddToCartState();

}

function createColorButton(value) {

  const color = value.trim().toLowerCase();

  let colorCode = '#000000';

  if (color === 'blue') {
    colorCode = '#1D4ED8';
  } else if (color === 'red') {
    colorCode = '#BE123C';
  } else if (color === 'grey' || color === 'gray') {
    colorCode = '#6B7280';
  } else if (color === 'white') {
    colorCode = '#E5E7EB';
  } else if (color === 'black') {
    colorCode = '#000000';
  }

  const button = document.createElement('button');

  button.type = 'button';
  button.className = 'products__modal-color-button';
  button.dataset.value = value;

  button.innerHTML = `
    <span
      class="products__modal-color-indicator"
      style="background:${colorCode}">
    </span>

    ${value}
  `;

button.addEventListener('click', function () {

  colorButtonsContainer
    .querySelectorAll('.products__modal-color-button')
    .forEach(function(btn){
      btn.classList.remove('active');
    });

  button.classList.add('active');

  selectedColor = value;

  updateSelectedVariant();

});

  return button;
}

    function fillSizeOptions(sizes) {
      sizeSelect.innerHTML = '<option value="">Choose your size</option>' + sizes.map(function (size) {
        return '<option value="' + size + '">' + size + '</option>';
      }).join('');
    }

    function openModal(data) {
      const variants =
JSON.parse(data.productVariants || "[]");
selectedVariantId = '';
selectedColor = '';
selectedSize = '';
      modalImage.src = data.productImage || '';
      modalImage.alt = data.productTitle || '';
      modalTitle.textContent = data.productTitle || '';
      modalPrice.textContent = data.productPrice || '';
      modalDescription.textContent = data.productDescription || '';

     const options = JSON.parse(data.productOptions || "[]");

const colorOption = options.find(option =>
    option.name.toLowerCase() === "color"
);

const sizeOption = options.find(option =>
    option.name.toLowerCase() === "size"
);

const colors = colorOption ? colorOption.values : [];
const sizes = sizeOption ? sizeOption.values : [];

     colorButtonsContainer.innerHTML = '';

colors.forEach(function (color) {
  colorButtonsContainer.appendChild(
    createColorButton(color)
  );
});

/* أول لون يبقى Selected تلقائي */
const firstColorButton =
  colorButtonsContainer.querySelector(
    '.products__modal-color-button'
  );

if (firstColorButton) {

  firstColorButton.classList.add(
    'products__modal-color-button--selected'
  );

  selectedColor =
    firstColorButton.dataset.value;

}

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

updateSelectedVariant();
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
