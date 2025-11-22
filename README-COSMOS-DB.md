# Azure Cosmos DB (MongoDB API) Connection

We are using Azure Cosmos DB with MongoDB API for data persistence.

## Connection String

```
mongodb+srv://dbuser:<password>@cosmos-ecommerce.global.mongocluster.cosmos.azure.com/ecommerce?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000
```

## Connection Details

- **Host**: `cosmos-ecommerce.global.mongocluster.cosmos.azure.com`
- **Database**: `ecommerce`
- **Username**: `dbuser`
- **Password**: `<password>` (replace with your actual password)
- **Authentication**: `SCRAM-SHA-256`
- **TLS**: Enabled (required)
- **Retry Writes**: Disabled (Cosmos DB requirement)
- **Max Idle Time**: 120000ms (2 minutes)

## Important Cosmos DB Configuration

### Required Connection Options

1. **retryWrites=false** - Cosmos DB does not support retryable writes
2. **authMechanism=SCRAM-SHA-256** - Required authentication mechanism
3. **tls=true** - TLS encryption is mandatory
4. **maxIdleTimeMS=120000** - Connection timeout setting

### Connection Pool Settings

- **Min Pool Size**: 5 connections
- **Max Pool Size**: 20 connections
- **Max Idle Time**: 120000ms

## Collections

Collections are auto-created on first insert:

- `users` - User accounts and authentication data
- `products` - Product catalog
- `categories` - Product categories
- `orders` - Customer orders

## User Authentication Flow

### Registration
1. User submits registration form
2. Backend validates input (Zod schema)
3. Checks if email already exists in Cosmos DB
4. Hashes password with bcrypt
5. Creates new user document in `users` collection
6. Returns JWT token

### Login
1. User submits login credentials
2. Backend validates input (Zod schema)
3. **Queries Cosmos DB to check if user exists** (`User.findOne({ email })`)
4. If user doesn't exist → Returns `401 Invalid credentials`
5. If user exists → Compares password with bcrypt
6. If password matches → Issues JWT token
7. If password doesn't match → Returns `401 Invalid credentials`

**Security**: Only registered users (existing in Cosmos DB) can login. The system cross-checks user existence before allowing access.

## Configuration

All services using MongoDB (auth-service, catalog-service, order-service) are configured with:

- **TLS**: Enabled for secure connections
- **Retry Writes**: Disabled (Cosmos DB requirement)
- **Auth Mechanism**: SCRAM-SHA-256
- **Connection Pooling**: Min 5, Max 20 connections
- **Max Idle Time**: 120000ms

## Environment Variables

Set `MONGODB_URI` in your `.env` files or `docker-compose.yml`:

```env
MONGODB_URI=mongodb+srv://dbuser:YOUR_PASSWORD@cosmos-ecommerce.global.mongocluster.cosmos.azure.com/ecommerce?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000
```

**Important**: Replace `<password>` with your actual Cosmos DB password.

## Local Development

No local MongoDB container needed → `docker-compose up` works instantly.

The services connect directly to Cosmos DB, so you can start developing immediately without setting up a local database.

## Kubernetes/Helm Deployment

For Kubernetes deployments, update the connection string in:

1. **Helm Values** (`helm/values.yaml`):
   ```yaml
   mongodb:
     uri: "mongodb+srv://dbuser:YOUR_PASSWORD@cosmos-ecommerce.global.mongocluster.cosmos.azure.com/ecommerce?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000"
   ```

2. **Kubernetes Secrets** (recommended):
   ```yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: cosmos-db-secret
   type: Opaque
   stringData:
     mongodb-uri: "mongodb+srv://dbuser:YOUR_PASSWORD@cosmos-ecommerce.global.mongocluster.cosmos.azure.com/ecommerce?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000"
   ```

## Seeding Data

To populate initial data (users, categories, products):

```bash
# Set your Cosmos DB connection string
export MONGODB_URI="mongodb+srv://dbuser:YOUR_PASSWORD@cosmos-ecommerce.global.mongocluster.cosmos.azure.com/ecommerce?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000"

# Run seed script
node scripts/seed-data.js
```

This will create:
- Admin user (admin@example.com / admin123)
- 8 product categories
- 14+ sample products across all categories

## Troubleshooting

### Connection Issues

1. **Check Password**: Ensure the password in the connection string is correct
2. **Check Network**: Verify your IP is whitelisted in Cosmos DB firewall rules
3. **Check TLS**: Cosmos DB requires TLS, ensure `tls=true` is in connection string
4. **Check Auth Mechanism**: Must use `SCRAM-SHA-256`

### Authentication Errors

- **401 Unauthorized**: User doesn't exist in Cosmos DB or password is incorrect
- **Connection Timeout**: Check network connectivity and firewall rules
- **Authentication Failed**: Verify username and password are correct

### Common Errors

- `retryWrites=true` → Change to `retryWrites=false` (Cosmos DB requirement)
- `w=majority` → Remove this parameter (not needed for Cosmos DB)
- Missing `authMechanism` → Add `authMechanism=SCRAM-SHA-256`

## Security Notes

- Never commit passwords to version control
- Use environment variables or Kubernetes secrets
- Enable IP firewall rules in Cosmos DB
- Use TLS for all connections
- Regularly rotate passwords
- Monitor connection logs for suspicious activity

## Migration from MongoDB Atlas

If migrating from MongoDB Atlas:

1. Update connection string format
2. Change `retryWrites=true` to `retryWrites=false`
3. Remove `w=majority` parameter
4. Add `authMechanism=SCRAM-SHA-256`
5. Add `maxIdleTimeMS=120000`
6. Update all service connection files
7. Test connection before deploying

---

**Last Updated**: Updated for Azure Cosmos DB with MongoDB API

