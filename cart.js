// Cart Management System
const Cart = {
    STORAGE_KEY: 'flashwheels_cart',

    // Get cart from localStorage
    getCart: function() {
        const cart = localStorage.getItem(this.STORAGE_KEY);
        return cart ? JSON.parse(cart) : [];
    },

    // Save cart to localStorage
    saveCart: function(cart) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
        this.updateCartUI();
    },

    // Add item to cart
    addItem: function(product) {
        const cart = this.getCart();

        // Check if item already exists
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            // Increase quantity
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            // Add new item with quantity 1
            product.quantity = 1;
            cart.push(product);
        }

        this.saveCart(cart);
        return product;
    },

    // Remove item from cart
    removeItem: function(productId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.id !== productId);
        this.saveCart(cart);
    },

    // Update item quantity
    updateQuantity: function(productId, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);

        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart(cart);
            }
        }
    },

    // Get cart count
    getCartCount: function() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.quantity || 1), 0);
    },

    // Get total price
    getTotalPrice: function() {
        const cart = this.getCart();
        return cart.reduce((total, item) => {
            const price = parseFloat(item.price?.toString().replace(/[₹,]/g, '')) || 0;
            return total + (price * (item.quantity || 1));
        }, 0);
    },

    // Clear entire cart
    clearCart: function() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.updateCartUI();
    },

    // Process checkout and create an order
    checkout: function(customerDetails = {}) {
        const cart = this.getCart();
        if (cart.length === 0) {
            this.showToast('Your cart is empty!');
            return false;
        }

        // Fetch existing orders to maintain ID sequence matching the dashboard
        let orders = JSON.parse(localStorage.getItem('fw_orders') || '[]');
        let nextId = parseInt(localStorage.getItem('fw_nextId') || '1001');

        // Format the cart items into a readable string for the dashboard notes
        const itemsList = cart.map(item => `${item.name} (x${item.quantity || 1})`).join(', ');

        // Create a new order object matching the dashboard.html structure
        const newOrder = {
            id: nextId++,
            name: customerDetails.name || 'Guest User',
            phone: customerDetails.phone || 'Pending',
            email: customerDetails.email || '',
            city: customerDetails.city || '',
            model: 'Accessories & Parts', // Standardized model name for parts
            colour: '-',
            payment: customerDetails.payment || 'Online',
            amount: this.getTotalPrice(),
            address: customerDetails.address || '',
            notes: `Items: ${itemsList}\nNotes: ${customerDetails.notes || ''}`,
            status: 'New',
            date: Date.now()
        };

        // Save the order to local storage (so it shows up in dashboard.html)
        orders.push(newOrder);
        localStorage.setItem('fw_orders', JSON.stringify(orders));
        localStorage.setItem('fw_nextId', nextId);

        // Clear the cart and notify the user
        this.clearCart();
        this.showToast('Order placed successfully! Order #' + newOrder.id);
        
        return true;
    },

    // Update cart UI elements
    updateCartUI: function() {
        const count = this.getCartCount();
        const cartCountEl = document.getElementById('cartCount');
        const cartBtn = document.getElementById('cartBtn');

        if (cartCountEl) {
            cartCountEl.textContent = count;
            cartCountEl.style.display = count > 0 ? 'flex' : 'none';
        }

        if (cartBtn) {
            cartBtn.setAttribute('data-count', count);
        }
    },

    // Show toast notification
    showToast: function(message, duration = 3000) {
        // Remove existing toast
        const existingToast = document.getElementById('cart-toast');
        if (existingToast) {
            existingToast.remove();
        }

        // Create new toast
        const toast = document.createElement('div');
        toast.id = 'cart-toast';
        toast.className = 'cart-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: #141412;
            color: #FFFFFF;
            padding: 14px 20px;
            border-radius: 6px;
            font-size: 13px;
            z-index: 1000;
            animation: slideInUp 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;

        document.body.appendChild(toast);

        // Auto remove after duration
        setTimeout(() => {
            toast.style.animation = 'slideOutDown 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
};

// Add animation styles if not already present
if (!document.getElementById('cart-animations')) {
    const style = document.createElement('style');
    style.id = 'cart-animations';
    style.textContent = `
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideOutDown {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(20px);
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize cart UI on page load
document.addEventListener('DOMContentLoaded', function() {
    Cart.updateCartUI();
});
