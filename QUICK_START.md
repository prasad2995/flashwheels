# Firebase Orders Integration - Quick Start Guide

## 🎯 How It Works - The Complete Flow

### ⚙️ Prerequisites & Setup
- Local Web Server (e.g., Live Server extension or WebStorm default server).
- Firebase Project with **Firestore** and **Authentication** enabled.
- Ensure your `firebaseConfig` object is correctly populated in your HTML/JS files.
- An admin user created in Firebase Authentication (e.g., `admin@flashwheels.com`).

### Step 1️⃣: Customer Adds Parts to Cart
**Location:** `bike-parts.html`
- Browse bike parts and accessories
- Click "Add to Cart" button on any item
- Toast notification confirms: "Item added to cart!"
- Cart count badge updates in navigation (🛒 Cart)

### Step 2️⃣: Customer Reviews Cart
**Location:** `cart.html`
- Click "🛒 Cart" button in navigation
- View all items with quantities
- See price calculations:
  - Item prices
  - Subtotal
  - Tax (18%)
  - Total Amount
- Use +/- buttons to adjust quantities
- Click "Remove" to delete items

### Step 3️⃣: Customer Places Order
**Location:** `cart.html` → Checkout
1. Must be logged in (redirects if not)
2. Click "Proceed to Checkout"
3. Order is created with:
   - ✓ Customer email
   - ✓ All items ordered
   - ✓ Quantities and prices
   - ✓ Subtotal, tax, total
   - ✓ Status: "New"
   - ✓ Timestamp
4. Order saved to Firebase Firestore
5. Success notification: "✓ Order placed successfully!"
6. Auto-redirect to dashboard in 1 second

### Step 4️⃣: Admin Manages Orders in Dashboard
**Location:** `dashboard.html`
- Login with `admin@flashwheels.com`
- Dashboard shows:
  - **Statistics:** Total orders, new orders, delivered count, revenue
  - **Recent Orders:** Latest 6 orders in a table
  - **All Orders:** Full searchable/filterable order list
  - **Categorized Views:** By status (New, Dispatched, Delivered, Cancelled)

### Step 5️⃣: View & Manage Order Details
**Location:** `dashboard.html` → Order Details
- Click any order row to open detail modal
- View complete order information:
  - Customer email address
  - List of all items with quantities and prices
  - Total pricing breakdown
  - Current status with visual badge
  - Order creation date
- Change status using dropdown
- Delete order if needed
- Changes saved immediately to Firebase

## 📊 Firebase Data Structure

### Orders Collection
```javascript
orders/ {
  [document_id]: {
    userId: "firebase_uid",
    userEmail: "admin@flashwheels.com",
    items: [
      {
        id: 1,
        name: "Smart Commuter Helmet",
        price: 2499,                    // In rupees
        quantity: 2,
        subtotal: 4998
      }
    ],
    subtotal: 4998,
    tax: 900,
    total: 5898,
    status: "New",                      // New | Dispatched | Delivered | Cancelled
    createdAt: Timestamp,
    updatedAt: Timestamp
  }
}
```

## 🧪 Testing Checklist

### Before Testing - Setup
- [ ] Ensure you're logged in as admin@flashwheels.com to Firebase
- [ ] Check Firestore database is accessible
- [ ] Verify orders collection exists in Firestore

### Test 1: Add Items to Cart
- [ ] Go to bike-parts.html
- [ ] Click "Add to Cart" on several items
- [ ] Verify cart count badge updates
- [ ] Toast notification appears
- [ ] Refresh page and items still in cart (localStorage)

### Test 2: View & Manage Cart
- [ ] Click "🛒 Cart" button
- [ ] Verify all items display correctly
- [ ] Check price calculations are accurate
- [ ] Test +/- buttons for quantities
- [ ] Test "Remove" button
- [ ] Verify totals recalculate

### Test 3: Checkout Process
- [ ] Logout if not admin
- [ ] Try checkout without login → redirects to login
- [ ] Login as admin@flashwheels.com
- [ ] Go back to cart
- [ ] Click "Proceed to Checkout"
- [ ] Order notification: "✓ Order placed successfully!"
- [ ] Alert shows Order ID
- [ ] Redirected to dashboard

### Test 4: Dashboard - View Order
- [ ] New order appears in "Recent Orders" section
- [ ] Order appears in "All Orders" table
- [ ] Order appears in "New Orders" view
- [ ] Click order to open details
- [ ] All items display correctly
- [ ] Prices and totals match cart

### Test 5: Update Order Status
- [ ] In order details, change status to "Dispatched"
- [ ] Click "Update Status"
- [ ] Toast shows: "Order updated to 'Dispatched'"
- [ ] Order moves to "Dispatched" view
- [ ] Refresh page and status persists
- [ ] Firebase shows updated `status` field

### Test 6: Delete Order
- [ ] Click any order
- [ ] Click "Delete" button
- [ ] Confirm deletion
- [ ] Order removed from all views
- [ ] Check Firestore - document deleted

### Test 7: Mobile Responsiveness
- [ ] Test on devices 320px, 480px, 768px, 1024px wide
- [ ] Cart button visible on all sizes
- [ ] Tables convert to card layout on mobile
- [ ] All buttons and inputs are easily tappable (min 44px)

## 🔧 Troubleshooting

### Issue: "Please login to place an order"
**Solution:** Not authenticated as admin@flashwheels.com
- Go to index.html
- Click "Login" button
- Enter admin@flashwheels.com and password

### Issue: Orders not appearing in dashboard
**Solution:** Check Firestore rules and database
- Verify `orders` collection exists in Firestore
- Check security rules allow read/write
- Check browser console for Firebase errors

### Issue: Cart persists after checkout
**Solution:** Cart clears automatically
- Refresh page after redirect to dashboard
- Cart should show "Your cart is empty"

### Issue: Status changes not saving
**Solution:** Firebase rules or connection issue
- Verify user is admin@flashwheels.com
- Check Firestore rules allow `admin@flashwheels.com` to update
- Check browser console for errors

## 📱 Mobile Testing Tips

Test on these breakpoints:
- **Mobile:** 480px and below
- **Tablet:** 768px
- **Desktop:** 1024px+

Key responsive features:
- Hamburger menu for navigation
- Cart button always visible
- Tables convert to card layout
- Touch-friendly buttons (44px minimum)

## 🎓 Key Technologies Used

| Technology | Purpose | Location |
|-----------|---------|----------|
| Firebase Firestore | Order database | cart.html, dashboard.html |
| Firebase Auth | User authentication | index.html, cart.html, dashboard.html |
| localStorage | Client-side cart | cart.js |
| CSS Grid/Flexbox | Responsive layout | All HTML files |
| Vanilla JavaScript | Cart logic & interactions | cart.js, cart.html |

## 💡 Tips

1. **Order ID Format:** Uses Firebase document IDs (long alphanumeric strings)
2. **Real-time Updates:** Orders appear instantly in dashboard when placed
3. **Timestamps:** Automatically recorded when order created/updated
4. **Price Format:** Stored as numbers, displayed with rupee symbol and commas
5. **Status Tracking:** Visual badges color-code order status

---

**Last Updated:** May 4, 2026
**Framework:** Vanilla JavaScript + Firebase
**Browser Support:** Chrome, Firefox, Safari, Edge (latest versions)
