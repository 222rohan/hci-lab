// Initialize cart in localStorage if it doesn't exist
if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
}

// Helper function to format price
function formatPrice(price) {
    return parseFloat(price.toString().replace('₹', '').replace(',', ''));
}

function initializeCartPage() {
    // Check if we're on the cart page
    if (!document.querySelector('.cart-container')) return;

    // Get cart container
    const cartContainer = document.querySelector('.cart-container');
    
    // Get cart items
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Create content wrapper
    const contentWrapper = document.createElement('div');
    
    if (cartItems.length === 0) {
        // Show empty cart message
        contentWrapper.innerHTML = `
            <div class="cart-empty">
                <p style="text-align: center; padding: 20px;">Your cart is empty</p>
                <div class="button-container">
                    <button class="btn btn-shop" onclick="window.location.href='index.html'">Shop Now</button>
                </div>
            </div>
        `;
    } else {
        // Add cart items
        cartItems.forEach(item => {
            const itemPrice = formatPrice(item.price);
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="price">₹${(itemPrice * item.quantity).toFixed(2)}</div>
                <div class="item-info">${item.title} (x${item.quantity})</div>
                <button class="remove-btn" data-id="${item.id}">
                    <img src="./images/knotted-sack-icon.svg" alt="Remove" style="width: 20px; height: 20px;">
                </button>
            `;
            contentWrapper.appendChild(cartItem);
        });

        // Calculate and add total
        const total = cartItems.reduce((sum, item) => {
            return sum + (formatPrice(item.price) * item.quantity);
        }, 0);

        const cartTotal = document.createElement('div');
        cartTotal.className = 'cart-total';
        cartTotal.innerHTML = `
            <span class="total-text">Total</span>
            <span class="total-amount">₹${total.toFixed(2)}</span>
        `;
        contentWrapper.appendChild(cartTotal);

        // Add action buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        buttonContainer.innerHTML = `
            <button class="btn btn-buy" onclick="handleCheckout()">Buy</button>
            <button class="btn btn-shop" onclick="window.location.href='index.html'">Shop</button>
        `;
        contentWrapper.appendChild(buttonContainer);
    }

    // Clear and update cart container
    cartContainer.innerHTML = '';
    cartContainer.appendChild(contentWrapper);

    // Add event listeners for remove buttons
    addRemoveButtonListeners();
}

function addRemoveButtonListeners() {
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const itemId = this.dataset.id;
            removeFromCart(itemId);
        });
    });
}

function removeFromCart(itemId) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    initializeCartPage(); // Re-render the cart
}

function handleCheckout() {
    alert('Proceeding to checkout...');
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCartPage);

// Add a window storage event listener to update cart when storage changes
window.addEventListener('storage', function(e) {
    if (e.key === 'cart') {
        initializeCartPage();
    }
});