# Testing Guide - Individual Page Testing

Complete guide to test each page of the e-commerce application individually.

## Prerequisites

### 1. Start the Application

```bash
# Start all services with Docker Compose
docker-compose up --build

# Or start services individually for development
cd frontend && npm run dev
cd ../gateway-service && npm run dev
# ... etc
```

### 2. Access the Application

- **Frontend**: http://localhost:8080 (or http://localhost:5173 in dev mode)
- **API Gateway**: http://localhost:3000

### 3. Create Test Accounts

#### Regular User Account
1. Go to Register page
2. Create account: `user@example.com` / `password123`

#### Admin Account
After creating a user, update MongoDB to make them admin:
```javascript
// In MongoDB Atlas or local MongoDB
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)
```

Or use the seed script:
```bash
node scripts/seed-data.js
# Admin: admin@example.com / admin123
```

---

## Public Pages (No Login Required)

### 1. Home Page
**URL**: `http://localhost:8080/`

**What to Test:**
- ✅ Page loads without errors
- ✅ Navigation menu displays
- ✅ Hero section/content displays
- ✅ Links to login/register work
- ✅ Responsive design (mobile/tablet/desktop)

**Direct Access**: Just open the root URL

---

### 2. Login Page
**URL**: `http://localhost:8080/login`

**What to Test:**
- ✅ Form validation (empty fields show errors)
- ✅ Invalid credentials show error message
- ✅ Valid credentials redirect to products page
- ✅ "Register" link works
- ✅ Password field is masked
- ✅ Loading state during login

**Test Credentials:**
- Valid: `user@example.com` / `password123`
- Invalid: `wrong@email.com` / `wrongpass`

**Direct Access**: Navigate to `/login` or click "Login" in navigation

---

### 3. Register Page
**URL**: `http://localhost:8080/register`

**What to Test:**
- ✅ Form validation:
  - Name required
  - Valid email format
  - Password minimum 6 characters
  - Password confirmation must match
- ✅ Duplicate email shows error
- ✅ Successful registration redirects to login
- ✅ "Login" link works
- ✅ All fields are required

**Test Cases:**
- Valid: `newuser@example.com`, `password123`, matching passwords
- Invalid: Short password, mismatched passwords, invalid email

**Direct Access**: Navigate to `/register` or click "Register" in navigation

---

## Protected Pages (Login Required)

**Note**: These pages require authentication. You'll be redirected to `/login` if not logged in.

### 4. Products Page
**URL**: `http://localhost:8080/products`

**What to Test:**
- ✅ Product list displays
- ✅ Product images load
- ✅ Product names and prices show
- ✅ Search functionality (if implemented)
- ✅ Category filters work
- ✅ Pagination (if implemented)
- ✅ Clicking product navigates to detail page
- ✅ "Add to Cart" button works
- ✅ Empty state if no products

**Direct Access**: 
1. Login first at `/login`
2. Then navigate to `/products`
3. Or click "Products" in navigation after login

---

### 5. Product Detail Page
**URL**: `http://localhost:8080/products/:id`

**Example**: `http://localhost:8080/products/507f1f77bcf86cd799439011`

**What to Test:**
- ✅ Product image displays
- ✅ Product name, price, description show
- ✅ Quantity selector works
- ✅ "Add to Cart" button works
- ✅ Stock availability shows
- ✅ Category link works (if product has category)
- ✅ 404 error for invalid product ID
- ✅ Loading state while fetching

**How to Get Product ID:**
1. Go to Products page
2. Inspect a product card or URL
3. Or check MongoDB for product `_id`

**Direct Access**: 
1. Login first
2. Go to Products page
3. Click on any product
4. Or manually enter URL with valid product ID

---

### 6. Cart Page
**URL**: `http://localhost:8080/cart`

**What to Test:**
- ✅ Empty cart message shows when cart is empty
- ✅ Cart items display with images, names, prices
- ✅ Quantity input updates cart
- ✅ Remove button removes items
- ✅ Subtotal and total calculate correctly
- ✅ "Proceed to Checkout" button works
- ✅ "Continue Shopping" link works
- ✅ Loading state

**Prerequisites**: 
- Must be logged in
- Add items to cart first (from Products page)

**Direct Access**: 
1. Login
2. Add items to cart from Products page
3. Navigate to `/cart` or click "Cart" icon in navigation

---

### 7. Checkout Page
**URL**: `http://localhost:8080/checkout`

**What to Test:**
- ✅ Form validation for all fields:
  - Name (required, min 2 chars)
  - Street address (required, min 5 chars)
  - City (required)
  - State (required)
  - ZIP code (required, min 5 chars)
  - Country (required)
  - Card number (required, min 16 chars)
  - Expiry date (MM/YY format)
  - CVV (required, min 3 chars)
  - Cardholder name (required)
- ✅ Order summary shows correct items and total
- ✅ Payment processing works
- ✅ Successful payment redirects to order confirmation
- ✅ Failed payment shows error
- ✅ Empty cart redirects or shows message

**Test Payment Cards:**
- Success: Any card NOT ending in `0` (e.g., `4111111111111111`)
- Failure: Card ending in `0` (e.g., `4111111111111110`)

**Prerequisites**: 
- Must be logged in
- Must have items in cart

**Direct Access**: 
1. Login
2. Add items to cart
3. Go to Cart page
4. Click "Proceed to Checkout"
5. Or navigate directly to `/checkout` (will show empty if cart is empty)

---

### 8. Order Confirmation Page
**URL**: `http://localhost:8080/order-confirmation/:orderId`

**Example**: `http://localhost:8080/order-confirmation/507f1f77bcf86cd799439011`

**What to Test:**
- ✅ Success message displays
- ✅ Order ID shows correctly
- ✅ "View Order Details" link works
- ✅ "Continue Shopping" link works
- ✅ Page is accessible after successful checkout

**Prerequisites**: 
- Must complete a successful checkout

**Direct Access**: 
1. Complete checkout successfully
2. You'll be redirected automatically
3. Or manually enter URL with valid order ID

---

### 9. Orders List Page
**URL**: `http://localhost:8080/orders`

**What to Test:**
- ✅ List of user's orders displays
- ✅ Order ID, date, total, status show
- ✅ Payment status shows correctly
- ✅ Status badges have correct colors:
  - Completed = green
  - Cancelled = red
  - Pending/Processing = yellow
- ✅ "View" link navigates to order detail
- ✅ Empty state if no orders
- ✅ Loading state

**Prerequisites**: 
- Must be logged in
- Should have at least one order (complete a checkout)

**Direct Access**: 
1. Login
2. Navigate to `/orders`
3. Or click "Orders" in navigation (if available)

---

### 10. Order Detail Page
**URL**: `http://localhost:8080/orders/:id`

**Example**: `http://localhost:8080/orders/507f1f77bcf86cd799439011`

**What to Test:**
- ✅ Order items display with images
- ✅ Item names, quantities, prices show
- ✅ Shipping address displays correctly
- ✅ Order status shows with correct badge color
- ✅ Payment status shows with correct badge color
- ✅ Total amount is correct
- ✅ Order date/time shows
- ✅ 404 error for invalid order ID
- ✅ Loading state

**How to Get Order ID:**
1. Go to Orders list page
2. Click "View" on any order
3. Or check URL from order confirmation page

**Direct Access**: 
1. Login
2. Go to Orders page
3. Click "View" on any order
4. Or manually enter URL with valid order ID

---

## Admin Pages (Admin Login Required)

**Note**: These pages require admin role. Regular users will be redirected to home.

### 11. Admin Dashboard
**URL**: `http://localhost:8080/admin`

**What to Test:**
- ✅ Dashboard loads (admin only)
- ✅ Statistics/metrics display (if implemented)
- ✅ Navigation to admin sections works
- ✅ Redirects non-admin users
- ✅ Loading state

**Prerequisites**: 
- Must be logged in as admin

**Direct Access**: 
1. Login as admin (`admin@example.com` / `admin123`)
2. Navigate to `/admin`
3. Or click "Admin" in navigation (if visible for admins)

---

### 12. Admin Products Page
**URL**: `http://localhost:8080/admin/products`

**What to Test:**
- ✅ List of all products displays
- ✅ Create product form works
- ✅ Edit product works
- ✅ Delete product works
- ✅ Form validation
- ✅ Image upload (if implemented)
- ✅ Category selection works
- ✅ Search/filter (if implemented)
- ✅ Pagination (if implemented)

**Prerequisites**: 
- Must be logged in as admin

**Direct Access**: 
1. Login as admin
2. Navigate to `/admin/products`
3. Or click "Products" in admin menu

---

### 13. Admin Orders Page
**URL**: `http://localhost:8080/admin/orders`

**What to Test:**
- ✅ List of all orders displays
- ✅ Order status can be updated
- ✅ Filter by status (if implemented)
- ✅ Search orders (if implemented)
- ✅ View order details works
- ✅ Status badges display correctly
- ✅ Payment status shows

**Prerequisites**: 
- Must be logged in as admin
- Should have some orders in system

**Direct Access**: 
1. Login as admin
2. Navigate to `/admin/orders`
3. Or click "Orders" in admin menu

---

### 14. Admin Categories Page
**URL**: `http://localhost:8080/admin/categories`

**What to Test:**
- ✅ List of categories displays
- ✅ Create category form works
- ✅ Edit category works
- ✅ Delete category works
- ✅ Form validation
- ✅ Slug auto-generation (if implemented)

**Prerequisites**: 
- Must be logged in as admin

**Direct Access**: 
1. Login as admin
2. Navigate to `/admin/categories`
3. Or click "Categories" in admin menu

---

## Quick Testing Checklist

### Public Pages
- [ ] Home (`/`)
- [ ] Login (`/login`)
- [ ] Register (`/register`)

### User Pages (Login Required)
- [ ] Products (`/products`)
- [ ] Product Detail (`/products/:id`)
- [ ] Cart (`/cart`)
- [ ] Checkout (`/checkout`)
- [ ] Order Confirmation (`/order-confirmation/:orderId`)
- [ ] Orders List (`/orders`)
- [ ] Order Detail (`/orders/:id`)

### Admin Pages (Admin Required)
- [ ] Admin Dashboard (`/admin`)
- [ ] Admin Products (`/admin/products`)
- [ ] Admin Orders (`/admin/orders`)
- [ ] Admin Categories (`/admin/categories`)

---

## Testing Tips

### 1. Browser Developer Tools
- Open DevTools (F12) to see:
  - Console errors
  - Network requests
  - React component state
  - Redux/Zustand store state

### 2. Test Authentication Flow
1. Try accessing protected pages without login → should redirect to `/login`
2. Login → should redirect to intended page or `/products`
3. Logout → should clear session and redirect to home

### 3. Test Admin Access
1. Login as regular user → try accessing `/admin` → should redirect to home
2. Login as admin → should access all admin pages

### 4. Test Form Validation
- Submit empty forms → should show validation errors
- Enter invalid data → should show specific error messages
- Enter valid data → should submit successfully

### 5. Test Error States
- Invalid product ID → should show 404 or error message
- Network errors → should show error toast/message
- Empty states → should show appropriate messages

### 6. Test Responsive Design
- Resize browser window
- Test on mobile viewport (DevTools device mode)
- Check navigation menu on mobile

---

## Common Issues & Solutions

### Issue: Redirected to Login on Every Page
**Solution**: Check if JWT token is stored in localStorage. Clear browser storage and login again.

### Issue: Admin Pages Not Accessible
**Solution**: Verify user role in MongoDB is set to `"admin"`, not just checking the field exists.

### Issue: Cart is Empty After Adding Items
**Solution**: Check Redis connection. Ensure cart-service is running and connected to Redis.

### Issue: Products Not Loading
**Solution**: 
- Check catalog-service is running
- Verify MongoDB connection
- Check browser console for API errors
- Verify gateway-service is routing correctly

### Issue: Payment Always Fails
**Solution**: Remember that cards ending in `0` are designed to fail. Use a card number NOT ending in `0`.

---

## API Testing

You can also test the API directly:

```bash
# Get products (requires auth token)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/catalog/products

# Get cart (requires auth token)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/cart
```

Get JWT token from browser localStorage after login, or from login API response.

### Product Catalog API (Gateway → Catalog Service)

**TC_PC_01 – Unauthorized Access**
```bash
curl -i http://localhost:3000/api/products
```
- Expected: `401 Unauthorized`
- Body: `{ "error": "Unauthorized" }`
- Confirms gateway requires JWT before proxying to catalog-service.

**TC_PC_02 – Authorized Access**
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/products
```
- Expected: `200 OK`
- Body: `{ "products": [ ...seededProducts ], "pagination": { ... } }`
- Response should include every seeded category (Electronics, Fashion & Apparel, Home & Kitchen, Beauty & Personal Care, Sports & Outdoors, Books, Toys & Games, Grocery & Gourmet).

If the authorized call fails, check:
- JWT token validity (not expired, correct secret)
- `gateway-service` `.env` → `CATALOG_SERVICE_URL`
- `catalog-service` MongoDB connection and logs

---

## Automated Testing (Future)

Consider adding:
- Unit tests for components
- Integration tests for API endpoints
- E2E tests with Playwright/Cypress
- Visual regression tests

---

Happy Testing! 🚀

