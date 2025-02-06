document.addEventListener('DOMContentLoaded', () => {
  /* --- Scroll Buttons Functionality --- */
  const scrollDownBtn = document.getElementById('scrollDownBtn');
  const scrollUpBtn = document.getElementById('scrollUpBtn');
  scrollDownBtn.addEventListener('click', () => {
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  });
  scrollUpBtn.addEventListener('click', () => {
    window.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
  });

  /* --- Modal & Card Functionality --- */
  const modal = document.getElementById('itemModal');
  const modalItemTitle = document.getElementById('modalItemTitle');
  const modalItemImage = document.getElementById('modalItemImage');
  const closeModalText = document.getElementById('closeModalText');
  const addQuantityBtn = document.getElementById('addQuantityBtn');
  const removeQuantityBtn = document.getElementById('removeQuantityBtn');
  const addToCartBtn = document.getElementById('addToCartBtn');
  const quantityDisplay = document.getElementById('quantityDisplay');
  let currentQuantity = 0;

  // Open modal when a product card is clicked
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const productTitle = card.querySelector('.card-info h2').textContent;
      const productImg = card.querySelector('.card-image img').src;
      modalItemTitle.textContent = productTitle;
      modalItemImage.src = productImg;
      currentQuantity = 0;
      quantityDisplay.textContent = currentQuantity;
      modal.style.display = 'block';
    });
  });

  // Increase quantity
  addQuantityBtn.addEventListener('click', () => {
    currentQuantity++;
    quantityDisplay.textContent = currentQuantity;
  });

  // Decrease quantity
  removeQuantityBtn.addEventListener('click', () => {
    if (currentQuantity > 0) currentQuantity--;
    quantityDisplay.textContent = currentQuantity;
  });

  // Simulate "Add to Cart" only if quantity is greater than 0
  addToCartBtn.addEventListener('click', () => {
    if (currentQuantity > 0) {
      alert(`Added ${currentQuantity} ${modalItemTitle.textContent} to cart!`);
      modal.style.display = 'none';
    } else {
      alert('Please select a quantity greater than 0');
    }
  });

  // Close modal when clicking the close text
  closeModalText.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Close modal if clicking outside the modal content
  window.addEventListener('click', event => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  /* --- Search Functionality --- */
  const searchBar = document.getElementById('searchBar');
  searchBar.addEventListener('input', () => {
    const filter = searchBar.value.toLowerCase();
    document.querySelectorAll('.card').forEach(card => {
      const title = card.querySelector('.card-info h2').textContent.toLowerCase();
      // Hide card if product title does not include the search term
      if (title.indexOf(filter) > -1) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
});
