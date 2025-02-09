// Initialize cart in localStorage if it doesn't exist
if (!localStorage.getItem('cart')) {
  localStorage.setItem('cart', JSON.stringify([]));
}

document.addEventListener('DOMContentLoaded', () => {
  /* --- Custom Scroll Functionality --- */
  const productGrid = document.querySelector('.product-grid');
  const scrollDownBtn = document.getElementById('scrollDownBtn');
  const scrollUpBtn = document.getElementById('scrollUpBtn');
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

  let currentScroll = 0;
  const scrollStep = 400;

  const getMaxScroll = () => productGrid.scrollHeight - productGrid.offsetHeight;

  const updateScrollButtons = () => {
    if (scrollUpBtn && scrollDownBtn) {
      scrollUpBtn.style.opacity = currentScroll <= 0 ? '0.5' : '1';
      scrollDownBtn.style.opacity = currentScroll >= getMaxScroll() ? '0.5' : '1';
      scrollUpBtn.disabled = currentScroll <= 0;
      scrollDownBtn.disabled = currentScroll >= getMaxScroll();
    }
  };

  if (scrollDownBtn) {
    scrollDownBtn.addEventListener('click', () => {
      if (currentScroll < getMaxScroll()) {
        currentScroll = Math.min(currentScroll + scrollStep, getMaxScroll());
        productGrid.style.transform = `translateY(-${currentScroll}px)`;
        updateScrollButtons();
      }
    });
  }

  if (scrollUpBtn) {
    scrollUpBtn.addEventListener('click', () => {
      if (currentScroll > 0) {
        currentScroll = Math.max(currentScroll - scrollStep, 0);
        productGrid.style.transform = `translateY(-${currentScroll}px)`;
        updateScrollButtons();
      }
    });
  }

  productGrid?.addEventListener('wheel', (e) => {
    e.preventDefault();
  }, { passive: false });

  updateScrollButtons();

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

  // Close Modal
  closeModalText?.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Close modal when clicking outside the modal content
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Cart Page Functionality
  if (window.location.pathname.includes('cart.html')) {
    const cartContainer = document.querySelector('.cart-container');
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    
    while (cartContainer.firstChild) {
      cartContainer.removeChild(cartContainer.firstChild);
    }
    
    cartItems.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <div class="price">${item.price}</div>
        <div class="item-info">${item.quantity} (x${item.title})</div>
        <button class="remove-btn" data-id="${item.id}">✕</button>
      `;
      cartContainer.appendChild(cartItem);
    });
    
    // Calculate and add total
    const total = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return sum + (price * item.quantity);
    }, 0);
    
    const cartTotal = document.createElement('div');
    cartTotal.className = 'cart-total';
    cartTotal.innerHTML = `
      <span class="total-text">Total</span>
      <span class="total-amount">$${total.toFixed(2)}</span>
    `;
    cartContainer.appendChild(cartTotal);
    
    // Add buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    buttonContainer.innerHTML = `
      <button class="btn btn-shop" onclick="window.location.href='index.html'">Shop</button>
      <button class="btn btn-buy">Buy</button>
    `;
    cartContainer.appendChild(buttonContainer);
    
    // Handle remove item
    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemId = e.target.dataset.id;
        const cart = cartItems.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(cart));
        location.reload();
      });
    });
  }
});