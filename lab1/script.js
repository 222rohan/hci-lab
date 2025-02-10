// Ensure localStorage cart is initialized
if (!localStorage.getItem('cart')) {
  localStorage.setItem('cart', JSON.stringify([]));
}

document.addEventListener('DOMContentLoaded', () => {
  /* --- Modal & Cart Functionality --- */
  const modal = document.getElementById('itemModal');
  const modalItemTitle = document.getElementById('modalItemTitle');
  const modalItemImage = document.getElementById('modalItemImage');
  const closeModalText = document.getElementById('closeModalText');
  const addToCartBtn = document.getElementById('addToCartBtn');

  const addQuantityBtn = document.getElementById('addQuantityBtn');
  const removeQuantityBtn = document.getElementById('removeQuantityBtn');
  const quantityDisplay = document.getElementById('quantityDisplay');

  let currentQuantity = 1;
  let currentItem = null;

  // Open modal with product info
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('click', () => {
      const title = card.querySelector('h2').textContent;
      const price = card.querySelector('p').textContent.replace('₹', '').trim(); // Remove ₹ symbol
      const image = card.querySelector('img').src;
      const itemId = card.dataset.itemId;

      currentItem = { id: itemId, title, price: parseFloat(price), image };
      modalItemTitle.textContent = title;
      modalItemImage.src = image;
      modalItemImage.alt = title;

      currentQuantity = 1;
      quantityDisplay.textContent = currentQuantity;

      modal.style.display = 'block';
    });
  });

  // Increase quantity
  addQuantityBtn?.addEventListener('click', () => {
    currentQuantity++;
    quantityDisplay.textContent = currentQuantity;
  });

  // Decrease quantity
  removeQuantityBtn?.addEventListener('click', () => {
    if (currentQuantity > 1) {
      currentQuantity--;
      quantityDisplay.textContent = currentQuantity;
    }
  });

  // Add item to cart
  addToCartBtn?.addEventListener('click', () => {
    if (currentQuantity > 0 && currentItem) {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];

      // Check if item exists in cart
      const existingItem = cart.find(item => item.id === currentItem.id);

      if (existingItem) {
        existingItem.quantity += currentQuantity; // Update quantity
      } else {
        cart.push({ ...currentItem, quantity: currentQuantity });
      }

      localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart
      modal.style.display = 'none';
      updateCartDisplay(); // Refresh cart display
    }
  });

  // Close modal
  closeModalText?.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  /* --- Cart Display Functionality --- */
  function updateCartDisplay() {
    const cartContainer = document.querySelector('.cart-container');
    if (!cartContainer) return;

    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    let totalPrice = 0;

    // Create the basic structure
    cartContainer.innerHTML = `
      <div class="cart-items-container"></div>
      <div class="cart-total">
        <span class="total-text">Total</span>
        <span class="total-amount">₹0.00</span>
      </div>
      <div class="button-container">
        <button class="btn btn-buy">Buy</button>
        <button class="btn btn-shop" onclick="window.location.href='index.html'">Shop</button>
      </div>
    `;

    const cartItemsContainer = cartContainer.querySelector('.cart-items-container');

    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
      return;
    }

    cartItems.forEach((item, index) => {
      const itemTotalPrice = item.price * item.quantity;
      totalPrice += itemTotalPrice;

      const cartItemElement = document.createElement('div');
      cartItemElement.className = 'cart-item';
      cartItemElement.innerHTML = `
        <div class="item-info">${item.title} (x${item.quantity})</div>
        <div class="price">₹${itemTotalPrice.toFixed(2)}</div>
        <button class="remove-btn" data-index="${index}">
          <img src="./images/knotted-sack-icon.svg" alt="Remove" style="width: 20px; height: 20px;">
        </button>
      `;

      cartItemsContainer.appendChild(cartItemElement);
    });

    // Update total amount
    const totalAmountElement = cartContainer.querySelector('.total-amount');
    if (totalAmountElement) {
      totalAmountElement.textContent = `₹${totalPrice.toFixed(2)}`;
    }

    // Add event listeners for remove buttons
    cartContainer.querySelectorAll('.remove-btn').forEach(button => {
      button.addEventListener('click', (event) => {
        const index = parseInt(event.currentTarget.dataset.index);
        removeItemFromCart(index);
      });
    });

    // Add event listener for buy button
    const buyButton = cartContainer.querySelector('.btn-buy');
    if (buyButton) {
      buyButton.addEventListener('click', () => {
        alert('Thank you for your purchase!');
        localStorage.setItem('cart', JSON.stringify([]));
        updateCartDisplay();
      });
    }
  }

  function removeItemFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
  }

  /* --- Search Functionality --- */
  const searchBar = document.getElementById('searchBar');
  searchBar?.addEventListener('input', () => {
    const query = searchBar.value.trim().toLowerCase();
    
    document.querySelectorAll('.card').forEach((card) => {
      const title = card.querySelector('h2')?.textContent.trim().toLowerCase() || '';
      card.style.display = title.includes(query) ? '' : 'none';
    });
  });

  // Initialize cart on page load
  if (window.location.pathname.includes('cart.html')) {
    updateCartDisplay();
  }
});