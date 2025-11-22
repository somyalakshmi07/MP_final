# Azure Cosmos DB Setup Guide

## Quick Setup

### Step 1: Update Connection String with Your Password

Replace `<password>` in the connection string with your actual Cosmos DB password:

```
mongodb+srv://dbuser:YOUR_ACTUAL_PASSWORD@cosmos-ecommerce.global.mongocluster.cosmos.azure.com/ecommerce?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000
```

### Step 2: Update docker-compose.yml

Edit `docker-compose.yml` and replace `<password>` in all `MONGODB_URI` environment variables:

```yaml
environment:
  - MONGODB_URI=mongodb+srv://dbuser:YOUR_ACTUAL_PASSWORD@cosmos-ecommerce.global.mongocluster.cosmos.azure.com/ecommerce?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000
```

### Step 3: Seed Initial Data

Run the seed script to create admin user, categories, and products:

```bash
# Set your connection string with actual password
export MONGODB_URI="mongodb+srv://dbuser:YOUR_ACTUAL_PASSWORD@cosmos-ecommerce.global.mongocluster.cosmos.azure.com/ecommerce?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000"

# Run seed script
node scripts/seed-data.js
```

### Step 4: Start Services

```bash
docker-compose up --build
```

## User Authentication Verification

The application **already verifies user existence** in Cosmos DB during login:

1. **Registration**: New users are saved to Cosmos DB `users` collection
2. **Login**: System checks if user exists in Cosmos DB before allowing access
   - If user doesn't exist → `401 Invalid credentials`
   - If user exists but wrong password → `401 Invalid credentials`
   - If user exists and correct password → JWT token issued

### Code Location

The user existence check is in `auth-service/src/controllers/authController.ts`:

```typescript
const user = await User.findOne({ email });
if (!user) {
  res.status(401).json({ error: 'Invalid credentials' });
  return;
}
```

## Files Updated

All database connections have been updated to use Cosmos DB:

✅ `auth-service/src/config/database.ts`
✅ `catalog-service/src/config/database.ts`
✅ `order-service/src/config/database.ts`
✅ `docker-compose.yml` (all services)
✅ `scripts/seed-data.js`
✅ `helm/values.yaml`
✅ `k8s/auth-service.yaml`

## Connection String Format

**Template:**
```
mongodb+srv://dbuser:<password>@cosmos-ecommerce.global.mongocluster.cosmos.azure.com/ecommerce?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000
```

**Important Parameters:**
- `tls=true` - Required for Cosmos DB
- `authMechanism=SCRAM-SHA-256` - Required authentication
- `retrywrites=false` - Cosmos DB requirement
- `maxIdleTimeMS=120000` - Connection timeout

## Testing

1. **Register a new user**:
   - Go to `/register`
   - Create account with email ending in `@gmail.com`
   - User is saved to Cosmos DB

2. **Login with registered user**:
   - Go to `/login`
   - Enter registered email and password
   - System checks Cosmos DB for user existence
   - If found → Login successful
   - If not found → "Invalid credentials"

3. **Try unregistered user**:
   - Attempt login with email not in Cosmos DB
   - Should receive "Invalid credentials" error

## Troubleshooting

### Connection Failed
- Verify password is correct
- Check IP whitelist in Cosmos DB firewall
- Ensure `tls=true` is in connection string

### Authentication Failed
- Verify username `dbuser` is correct
- Check password is properly URL-encoded if it contains special characters
- Ensure `authMechanism=SCRAM-SHA-256` is present

### User Not Found
- Run seed script to create initial users
- Check Cosmos DB `users` collection exists
- Verify database name is `ecommerce`

## Security Notes

⚠️ **Never commit passwords to Git!**

- Use environment variables
- Use Kubernetes secrets for production
- Rotate passwords regularly
- Enable IP firewall rules in Cosmos DB

---

For detailed documentation, see [README-COSMOS-DB.md](./README-COSMOS-DB.md)

