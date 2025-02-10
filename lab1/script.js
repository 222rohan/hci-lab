// Ensure localStorage cart is initialized
if (!localStorage.getItem('cart')) {
  localStorage.setItem('cart', JSON.stringify([]));
}

window.addEventListener('wheel', function(e) {
  e.preventDefault();
}, { passive: false });

document.addEventListener('DOMContentLoaded', () => {
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

  /* --- Modal & Product Card Click Handling --- */
  document.querySelectorAll(".card")?.forEach((card) => {
    card.addEventListener("click", () => {
      // Get product information from the card
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

  // Close Modal only with X button
  closeModalText?.addEventListener('click', () => {
    modal.style.display = 'none';
  });
});

// search functionality
const searchBar = document.getElementById('searchBar');
if (searchBar) {
  searchBar.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const query = searchBar.value.trim().toLowerCase();
      const allCards = document.querySelectorAll('.card');
      allCards.forEach(card => {
        const title = card.querySelector('h2')?.textContent.toLowerCase() || '';
        const description = card.querySelector('p')?.textContent.toLowerCase() || '';
        if (title.includes(query) || description.includes(query)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    }
  });
}