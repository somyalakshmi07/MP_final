# Quick Test Guide - Page URLs

Quick reference for testing each page. **Make sure your app is running first!**

## Start the Application

```bash
docker-compose up --build
```

Then open: **http://localhost:8080**

---

## All Page URLs

### 🌐 Public Pages (No Login)

| Page | URL | Description |
|------|-----|-------------|
| **Home** | `http://localhost:8080/` | Landing page |
| **Login** | `http://localhost:8080/login` | User login |
| **Register** | `http://localhost:8080/register` | User registration |

### 🔐 User Pages (Login Required)

| Page | URL | Prerequisites |
|------|-----|---------------|
| **Products** | `http://localhost:8080/products` | Must be logged in |
| **Product Detail** | `http://localhost:8080/products/:id` | Must be logged in + valid product ID |
| **Cart** | `http://localhost:8080/cart` | Must be logged in + items in cart |
| **Checkout** | `http://localhost:8080/checkout` | Must be logged in + items in cart |
| **Order Confirmation** | `http://localhost:8080/order-confirmation/:orderId` | After successful checkout |
| **Orders List** | `http://localhost:8080/orders` | Must be logged in |
| **Order Detail** | `http://localhost:8080/orders/:id` | Must be logged in + valid order ID |

### 👑 Admin Pages (Admin Login Required)

| Page | URL | Prerequisites |
|------|-----|---------------|
| **Admin Dashboard** | `http://localhost:8080/admin` | Must be admin |
| **Admin Products** | `http://localhost:8080/admin/products` | Must be admin |
| **Admin Orders** | `http://localhost:8080/admin/orders` | Must be admin |
| **Admin Categories** | `http://localhost:8080/admin/categories` | Must be admin |

---

## Quick Test Flow

### 1. Test Public Pages
```
1. Open http://localhost:8080/          → Home page
2. Click "Login" or go to /login        → Login page
3. Click "Register" or go to /register → Register page
```

### 2. Test User Flow
```
1. Register new account                 → /register
2. Login                                → /login
3. Browse products                      → /products
4. View product detail                  → /products/:id
5. Add to cart                          → (from product page)
6. View cart                            → /cart
7. Checkout                             → /checkout
8. Complete order                       → /order-confirmation/:orderId
9. View orders                          → /orders
10. View order detail                   → /orders/:id
```

### 3. Test Admin Flow
```
1. Login as admin (admin@example.com / admin123)
2. Go to admin dashboard                → /admin
3. Manage products                      → /admin/products
4. Manage orders                        → /admin/orders
5. Manage categories                   → /admin/categories
```

---

## Test Accounts

### Regular User
- **Email**: `user@example.com`
- **Password**: `password123`
- **Role**: `user`

### Admin User
- **Email**: `admin@example.com`
- **Password**: `admin123`
- **Role**: `admin`

**To create admin**: Run `node scripts/seed-data.js` or update MongoDB directly.

---

## Common Test Scenarios

### ✅ Test Authentication
- Try accessing `/products` without login → Should redirect to `/login`
- Login → Should redirect to `/products` or intended page
- Logout → Should clear session

### ✅ Test Cart
- Add items from products page
- Update quantities in cart
- Remove items from cart
- Proceed to checkout

### ✅ Test Checkout
- Fill all required fields
- Use card ending in `0` → Should fail
- Use card NOT ending in `0` → Should succeed
- Complete order → Should redirect to confirmation

### ✅ Test Admin
- Login as regular user → Try `/admin` → Should redirect
- Login as admin → Should access all admin pages
- Create/edit/delete products
- Update order status

---

## Browser DevTools Tips

**Open DevTools (F12) to see:**
- **Console**: JavaScript errors, API calls
- **Network**: API requests/responses
- **Application**: localStorage (JWT token stored here)
- **React DevTools**: Component state (if extension installed)

---

## Quick Commands

```bash
# Start everything
docker-compose up --build

# Check if services are running
docker ps

# View logs
docker-compose logs -f gateway-service
docker-compose logs -f frontend

# Stop everything
docker-compose down
```

---

## Need Help?

See `TESTING-GUIDE.md` for detailed testing instructions for each page.

