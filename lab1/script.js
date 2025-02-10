// Initialize cart in localStorage if it doesn't exist
if (!localStorage.getItem('cart')) {
  localStorage.setItem('cart', JSON.stringify([]));
}

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('itemModal');
  const modalItemTitle = document.getElementById('modalItemTitle');
  const modalItemImage = document.getElementById('modalItemImage');
  const closeModalText = document.getElementById('closeModalText');
  const addToCartBtn = document.getElementById('addToCartBtn');
  
  // Add quantity control elements
  const addQuantityBtn = document.getElementById('addQuantityBtn');
  const removeQuantityBtn = document.getElementById('removeQuantityBtn');
  const quantityDisplay = document.getElementById('quantityDisplay');
  let currentQuantity = 0;
  let currentItem = null;

  /* --- Modal & Product Card Click Handling --- */
  document.querySelectorAll(".card")?.forEach((card) => {
    card.addEventListener("click", () => {
      // Get product information from the card
      const title = card.querySelector('h2').textContent;
      const price = card.querySelector('p').textContent;
      const image = card.querySelector('img').src;
      const itemId = card.dataset.itemId;
      
      // Store current item
      currentItem = {
        id: itemId,
        title: title,
        price: price,
        image: image
      };
      
      // Update modal content
      modalItemTitle.textContent = title;
      modalItemImage.src = image;
      modalItemImage.alt = title;
      
      // Reset quantity when opening modal
      currentQuantity = 0;
      quantityDisplay.textContent = currentQuantity;
      
      // Display the modal
      modal.style.display = 'block';
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.querySelector('.product-grid');
  
    // Prevent default scroll behaviors
    productGrid.addEventListener('wheel', (e) => {
      e.preventDefault();
      
      // Manual scrolling control
      const scrollAmount = e.deltaY;
      productGrid.scrollTop += scrollAmount;
    }, { passive: false });
  
    // Prevent touch scrolling
    productGrid.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, { passive: false });
  
    // Add keyboard arrow key support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') {
        productGrid.scrollTop -= 50;
        e.preventDefault();
      }
      if (e.key === 'ArrowDown') {
        productGrid.scrollTop += 50;
        e.preventDefault();
      }
    });
  });

  // Quantity Control Functions
  const updateQuantityDisplay = () => {
    quantityDisplay.textContent = currentQuantity;
  };

  // Add Quantity Button
  addQuantityBtn?.addEventListener('click', () => {
    currentQuantity++;
    updateQuantityDisplay();
  });

  // Remove Quantity Button
  removeQuantityBtn?.addEventListener('click', () => {
    if (currentQuantity > 0) {
      currentQuantity--;
      updateQuantityDisplay();
    }
  });

  // Add to Cart Button
  addToCartBtn?.addEventListener('click', () => {
    if (currentQuantity > 0 && currentItem) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Check if item already exists in cart
      const existingItemIndex = cart.findIndex(item => item.id === currentItem.id);
      
      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        cart[existingItemIndex].quantity += currentQuantity;
      } else {
        // Add new item if it doesn't exist
        cart.push({
          ...currentItem,
          quantity: currentQuantity
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      modal.style.display = 'none';
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