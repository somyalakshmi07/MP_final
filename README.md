# E-Commerce Microservices Platform

A complete, production-ready e-commerce platform built with microservices architecture, designed for deployment on Azure AKS.

## Architecture

This project consists of 7 microservices:

1. **gateway-service** - API Gateway (Port 3000)
2. **auth-service** - Authentication & Authorization (Port 3001)
3. **catalog-service** - Product & Category Management (Port 3002)
4. **cart-service** - Shopping Cart Management (Port 3003)
5. **order-service** - Order Processing (Port 3004)
6. **payment-service** - Payment Processing (Port 3005)
7. **admin-service** - Admin Operations (Port 3006)

Plus a **frontend** React application.

## Tech Stack

### Backend
- Node.js + Express + TypeScript
- MongoDB (Cosmos DB compatible)
- Redis
- JWT Authentication
- Axios for inter-service communication

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- React Query (TanStack Query)
- React Hook Form + Zod
- Zustand
- React Router

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)

### Running with Docker Compose

1. Clone the repository:
```bash
git clone <repository-url>
cd website-ecom
```

2. Start all services:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost
- API Gateway: http://localhost:3000
- Individual services: http://localhost:3001-3006

### Local Development

1. Install dependencies for each service:
```bash
cd auth-service && npm install
cd ../gateway-service && npm install
# ... repeat for all services
cd ../frontend && npm install
```

2. Start MongoDB and Redis:
```bash
docker-compose up mongo redis
```

3. Start services individually:
```bash
# In separate terminals
cd auth-service && npm run dev
cd gateway-service && npm run dev
# ... etc
cd frontend && npm run dev
```

## Environment Variables

Each service has a `.env.example` file. Copy and configure:

```bash
cp auth-service/.env.example auth-service/.env
# Update with your values
```

Key environment variables:
- `MONGODB_URI` - MongoDB connection string
- `REDIS_HOST` - Redis host
- `REDIS_PORT` - Redis port
- `JWT_SECRET` - Secret for JWT tokens
- Service URLs for inter-service communication

## Features

### User Features
- User registration and authentication
- Product browsing with search and filters
- Shopping cart management
- Order placement and tracking
- Payment processing (simulated)

### Admin Features
- Product CRUD operations
- Category management
- Order management
- Status updates

## API Endpoints

All endpoints are accessed through the gateway at `http://localhost:3000/api`:

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/catalog/products` - List products (with pagination, filters)
- `GET /api/catalog/products/:id` - Get product details
- `GET /api/catalog/categories` - List categories

### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:productId` - Update cart item
- `DELETE /api/cart/:productId` - Remove from cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - List user orders
- `GET /api/orders/:id` - Get order details

### Payment
- `POST /api/payments/process` - Process payment

### Admin
- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - List all orders
- `PUT /api/admin/orders/:id` - Update order status

## Creating an Admin User

To create an admin user, you can either:
1. Manually update the user document in MongoDB to set `role: 'admin'`
2. Use MongoDB shell:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Kubernetes Deployment

See `k8s/README.md` for Kubernetes deployment instructions.

## Project Structure

```
.
├── auth-service/
├── gateway-service/
├── catalog-service/
├── cart-service/
├── order-service/
├── payment-service/
├── admin-service/
├── frontend/
├── k8s/
└── docker-compose.yml
```

Each service follows a clean structure:
```
service-name/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middlewares/
│   └── config/
├── Dockerfile
└── package.json
```

## Testing

The application includes simulated payment processing. Cards ending in '0' will fail for demonstration purposes.

## Production Considerations

- Use Azure Key Vault for secrets
- Configure proper CORS settings
- Set up monitoring and logging
- Use Azure Application Insights
- Configure auto-scaling
- Set up CI/CD pipelines
- Use managed databases (Cosmos DB, Azure Cache for Redis)
- Implement rate limiting
- Add request validation
- Set up health checks

## License

MIT

