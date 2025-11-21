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

## Azure DevOps CI/CD Pipeline

This project includes a complete Azure DevOps CI/CD pipeline for automated deployment to Azure AKS with Application Gateway integration.

### Prerequisites

Before setting up the CI/CD pipeline, ensure you have:

- **Azure Resources** (from previous setup):
  - Private AKS cluster: `aks-private-ecommerce`
  - Private ACR: `acrecomsecure`
  - Application Gateway: `agw-ecommerce`
  - Resource Group: `rg-ecommerce-secure`
- **GitHub Repository** with your code pushed
- **Azure DevOps Account** (free tier available)

### Step 1: Create Azure DevOps Organization & Project

1. Go to [https://dev.azure.com](https://dev.azure.com)
2. Sign in with your Microsoft account (same as Azure)
3. Click **New organization** → Name: `my-ecommerce-org` → Create
4. Create new project → Name: `ECommerce-Secure` → Visibility: Private → Create

### Step 2: Connect Your GitHub Repo to Azure DevOps

1. In your project → Left menu → **Repos** → **Import repository**
2. Paste your GitHub URL: `https://github.com/yourname/ecommerce-microservices`
3. Import → Done!

Your code is now mirrored in Azure DevOps.

### Step 3: Create Service Connections

You need 2 service connections for the pipeline to work:

#### A. Azure Resource Manager (for AKS access)

1. In Azure DevOps → Project Settings (bottom left) → **Service connections**
2. **New service connection** → **Azure Resource Manager** → Next
3. Authentication method: **Service principal (automatic)**
4. Subscription: Select your Azure subscription
5. Resource group: `rg-ecommerce-secure`
6. Service connection name: `azure-rm-secure`
7. Grant access permission to all pipelines → Check
8. Save

#### B. Docker Registry (for ACR push)

1. Again → New service connection → **Docker Registry**
2. Registry type: **Azure Container Registry**
3. Azure subscription: Same as above
4. Azure container registry: `acrecomsecure`
5. Service connection name: `acr-secure-connection`
6. Save

### Step 4: Create Environment for AKS

1. Left menu → **Pipelines** → **Environments**
2. **New environment** → Name: `production-secure`
3. Resources → None → Create
4. (Optional) Add approval: Click 3 dots → Approvals and checks → Add yourself as approver

### Step 5: Create the Azure DevOps Pipeline

1. Left menu → **Pipelines** → **New pipeline**
2. Where is your code? → **Azure Repos Git** → Select your repo
3. Configure → **Existing Azure Pipelines YAML file**
4. Path: `/azure-pipelines.yml` → Continue
5. Review the pipeline YAML → Run

The pipeline will:
- Build 8 Docker images (frontend + 7 microservices)
- Push them to your private ACR (`acrecomsecure`)
- Deploy them to your private AKS cluster using Helm
- Update the Application Gateway routing automatically via AGIC

### Step 6: Configure Helm Chart Values

Before running the pipeline, ensure your `helm/values.yaml` matches your Azure resources:

```yaml
image:
  repository: acrecomsecure.azurecr.io  # Your ACR name
  tag: latest

namespace: backend  # Your AKS namespace

mongodb:
  uri: "mongodb+srv://..."  # Your MongoDB Atlas connection string
```

### Step 7: Create JWT Secret in AKS

Before the first deployment, create the JWT secret in your AKS cluster:

```bash
# Connect to your AKS cluster
az aks get-credentials --resource-group rg-ecommerce-secure --name aks-private-ecommerce

# Create namespace
kubectl create namespace backend

# Create JWT secret
kubectl create secret generic jwt-secret \
  --from-literal=secret=your-super-secret-jwt-key-change-in-production \
  -n backend
```

### Step 8: Run Your First Pipeline

1. Save and run the pipeline
2. It will:
   - Build 8 images (frontend + 7 microservices)
   - Push to your **private** ACR
   - Connect to your **private** AKS
   - Deploy via Helm
   - AGIC automatically updates Application Gateway
3. Wait 5–8 minutes for the first deployment

### Step 9: Access Your Application

1. Go to Azure Portal → Application Gateway `agw-ecommerce` → Overview
2. Copy the **Public IP**
3. Open in browser → Your e-commerce site is LIVE!

### Automated Deployments

From now on, every time you push to the `main` branch:

- New code → New images → New deployment → Updated site in < 5 mins
- Fully secure, private, WAF-protected
- Zero manual work

### Pipeline Variables

The pipeline uses these variables (defined in `azure-pipelines.yml`):

- `acrName`: `acrecomsecure` (your ACR name)
- `acrConnection`: `acr-secure-connection` (service connection name)
- `aksCluster`: `aks-private-ecommerce` (your AKS cluster name)
- `resourceGroup`: `rg-ecommerce-secure` (your resource group)
- `helmChartPath`: `helm` (path to Helm chart)

### Manual Approval (Optional)

To add manual approval gates:

1. Go to **Pipelines** → **Environments** → `production-secure`
2. Click **Approvals and checks**
3. Add yourself as approver
4. Now you must approve every deployment

### Troubleshooting

**Pipeline fails at Docker build:**
- Check Dockerfile paths in `azure-pipelines.yml` match your folder structure
- Verify service connection has access to ACR

**Helm deployment fails:**
- Ensure JWT secret exists in AKS: `kubectl get secret jwt-secret -n backend`
- Check AKS cluster connection: `az aks get-credentials --resource-group rg-ecommerce-secure --name aks-private-ecommerce`
- Verify namespace exists: `kubectl get namespace backend`

**Application Gateway not routing:**
- Ensure AGIC (Application Gateway Ingress Controller) is installed in AKS
- Check ingress resource: `kubectl get ingress -n backend`
- Verify Application Gateway backend pools in Azure Portal

### CI/CD Architecture

```
GitHub Push → Azure DevOps Pipeline
    ↓
Build Docker Images (8 services)
    ↓
Push to Private ACR
    ↓
Deploy via Helm to Private AKS
    ↓
AGIC Updates Application Gateway
    ↓
Application Live on Public IP
```

This setup provides:
- ✅ **Zero-trust security** (Private AKS + Private ACR)
- ✅ **WAF protection** (Application Gateway)
- ✅ **Automated deployments** (CI/CD pipeline)
- ✅ **Production-grade** (Health checks, resource limits, replicas)
- ✅ **Cost-effective** (Azure for Students compatible)

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

