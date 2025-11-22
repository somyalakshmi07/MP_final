# View All Pages - Quick Reference

Your frontend is running at: **http://localhost:8080**

## All Available Pages

### Public Pages (No Login Required)

1. **Home Page**
   - URL: `http://localhost:8080/`
   - Description: Hero section with featured products
   - Status: ✅ Viewable (may show loading/error if backend unavailable)

2. **Register Page**
   - URL: `http://localhost:8080/register`
   - Description: User registration form
   - Features: Name, email, password validation
   - Status: ✅ Viewable (form will show, but submission will fail without backend)

3. **Login Page**
   - URL: `http://localhost:8080/login`
   - Description: User login form
   - Status: ✅ Viewable (form will show, but login will fail without backend)

4. **Products Page**
   - URL: `http://localhost:8080/products`
   - Description: Product catalog with search and filters
   - Status: ⚠️ Viewable but will show "Service unavailable" (backend needed)

5. **Product Detail Page**
   - URL: `http://localhost:8080/products/:id`
   - Example: `http://localhost:8080/products/123`
   - Description: Individual product details
   - Status: ⚠️ Viewable but will show error (backend needed)

### Protected Pages (Require Login)

6. **Cart Page**
   - URL: `http://localhost:8080/cart`
   - Description: Shopping cart with items
   - Status: ⚠️ Requires login + backend

7. **Checkout Page**
   - URL: `http://localhost:8080/checkout`
   - Description: Order checkout form
   - Status: ⚠️ Requires login + backend

8. **Orders Page**
   - URL: `http://localhost:8080/orders`
   - Description: User's order history
   - Status: ⚠️ Requires login + backend

9. **Order Detail Page**
   - URL: `http://localhost:8080/orders/:id`
   - Example: `http://localhost:8080/orders/123`
   - Description: Individual order details
   - Status: ⚠️ Requires login + backend

10. **Order Confirmation Page**
    - URL: `http://localhost:8080/order-confirmation/:id`
    - Example: `http://localhost:8080/order-confirmation/123`
    - Description: Order confirmation after payment
    - Status: ⚠️ Requires login + backend

### Admin Pages (Require Admin Role)

11. **Admin Dashboard**
    - URL: `http://localhost:8080/admin`
    - Description: Admin overview dashboard
    - Status: ⚠️ Requires admin login + backend

12. **Admin Products**
    - URL: `http://localhost:8080/admin/products`
    - Description: Product management (CRUD)
    - Status: ⚠️ Requires admin login + backend

13. **Admin Orders**
    - URL: `http://localhost:8080/admin/orders`
    - Description: Order management
    - Status: ⚠️ Requires admin login + backend

14. **Admin Categories**
    - URL: `http://localhost:8080/admin/categories`
    - Description: Category management
    - Status: ⚠️ Requires admin login + backend

---

## Quick Navigation

### To View Pages Right Now:

1. **Open Browser**: Go to `http://localhost:8080`

2. **Public Pages You Can View**:
   - Home: `http://localhost:8080/`
   - Register: `http://localhost:8080/register`
   - Login: `http://localhost:8080/login`
   - Products: `http://localhost:8080/products` (will show error but page loads)

3. **Protected Pages** (will redirect to login):
   - Cart: `http://localhost:8080/cart`
   - Checkout: `http://localhost:8080/checkout`
   - Orders: `http://localhost:8080/orders`

4. **Admin Pages** (will redirect to login):
   - Admin: `http://localhost:8080/admin`
   - Admin Products: `http://localhost:8080/admin/products`
   - Admin Orders: `http://localhost:8080/admin/orders`
   - Admin Categories: `http://localhost:8080/admin/categories`

---

## What You'll See

### ✅ Pages That Load Fully (UI Only):
- **Home** - Hero section, layout, navigation
- **Register** - Complete registration form with validation UI
- **Login** - Complete login form with validation UI

### ⚠️ Pages That Load But Show Errors:
- **Products** - Page loads, but shows "Service unavailable" error
- **Product Detail** - Page loads, but shows error message
- **Cart** - Redirects to login (if not logged in)
- **Checkout** - Redirects to login (if not logged in)
- **Orders** - Redirects to login (if not logged in)
- **Admin Pages** - Redirects to login (if not logged in)

---

## Testing UI Without Backend

### Option 1: View Static Pages
All pages have beautiful UI that you can view:
- Navigation works
- Forms display correctly
- Layouts are responsive
- Styling is complete

### Option 2: Mock Login (For Testing Protected Pages)

1. Open browser console (F12)
2. Run this to simulate being logged in:
   ```javascript
   localStorage.setItem('token', 'mock-token-for-viewing');
   localStorage.setItem('user', JSON.stringify({
     id: '123',
     email: 'test@gmail.com',
     name: 'Test User',
     role: 'user'
   }));
   ```
3. Refresh the page
4. Now you can navigate to protected pages (they'll still show errors for API calls, but you can see the UI)

### Option 3: Mock Admin Login

1. Open browser console (F12)
2. Run this to simulate admin login:
   ```javascript
   localStorage.setItem('token', 'mock-admin-token');
   localStorage.setItem('user', JSON.stringify({
     id: '123',
     email: 'admin@example.com',
     name: 'Admin User',
     role: 'admin'
   }));
   ```
3. Refresh the page
4. Navigate to `/admin` pages to see admin UI

---

## Page Screenshots/Features

### Home Page (`/`)
- Hero banner with gradient
- Featured products section
- Responsive grid layout
- "Shop Now" call-to-action

### Register Page (`/register`)
- Clean registration form
- Real-time validation
- Password strength indicator
- Gmail email validation
- Name validation (alphabets only)

### Login Page (`/login`)
- Simple login form
- Email and password fields
- "Sign up" link
- Error message display

### Products Page (`/products`)
- Product grid layout
- Search bar
- Category filters
- Pagination
- Sort options

### Product Detail Page (`/products/:id`)
- Large product image
- Product details
- Price display
- "Add to Cart" button
- Quantity selector

### Cart Page (`/cart`)
- Cart items list
- Quantity controls
- Remove items
- Total price calculation
- Checkout button

### Checkout Page (`/checkout`)
- Shipping address form
- Payment method selection
- Order summary
- "Place Order" button

### Orders Page (`/orders`)
- Order history list
- Order status badges
- Order date and total
- View order details link

### Admin Dashboard (`/admin`)
- Overview statistics
- Quick actions
- Recent orders
- Product management links

### Admin Products (`/admin/products`)
- Product list table
- Add/Edit/Delete buttons
- Product search
- Category filter

### Admin Orders (`/admin/orders`)
- All orders table
- Status filter
- Order details view
- Status update controls

---

## Quick Access URLs

Copy-paste these in your browser:

```
http://localhost:8080/
http://localhost:8080/register
http://localhost:8080/login
http://localhost:8080/products
http://localhost:8080/cart
http://localhost:8080/checkout
http://localhost:8080/orders
http://localhost:8080/admin
http://localhost:8080/admin/products
http://localhost:8080/admin/orders
http://localhost:8080/admin/categories
```

---

## Notes

- **Frontend is fully functional** - All UI components, forms, and layouts work
- **Backend calls will fail** - You'll see error messages, but pages still load
- **Navigation works** - You can click through all pages
- **Forms display** - All form fields and validation UI are visible
- **Responsive design** - Works on mobile, tablet, and desktop

**Enjoy exploring all the pages!** 🎨

