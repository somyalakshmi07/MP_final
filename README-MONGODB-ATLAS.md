# ⚠️ DEPRECATED: MongoDB Atlas

**This file is deprecated. We now use Azure Cosmos DB.**

See [README-COSMOS-DB.md](./README-COSMOS-DB.md) for current database configuration.

---

# MongoDB Atlas (Legacy - No Longer Used)

~~We were using a real MongoDB Atlas M0 free cluster:~~

```
mongodb+srv://somyalakshmi17_db_user:9ft7qNZWLA5IqWUd@cluster0.v1rzlcu.mongodb.net/ecommerce
```

## Migration Notice

**We have migrated to Azure Cosmos DB (MongoDB API).**

Please refer to [README-COSMOS-DB.md](./README-COSMOS-DB.md) for the current database setup and connection details.

## Collections

Collections will be auto-created on first insert:

- `users` - User accounts and authentication data
- `products` - Product catalog
- `categories` - Product categories
- `orders` - Customer orders

## Configuration

All services using MongoDB (auth-service, catalog-service, order-service) are configured with:

- **TLS**: Enabled for secure connections
- **Retry Writes**: Enabled for reliability
- **Write Concern**: Majority for data consistency
- **Connection Pooling**: Min 5, Max 20 connections
- **App Name**: ecommerce-app (for monitoring in Atlas)

## Local Development

No local MongoDB container needed → `docker-compose up` works instantly.

The services connect directly to Atlas, so you can start developing immediately without setting up a local database.

## Environment Variables

Set `MONGODB_URI` in your `.env` files or `docker-compose.yml`:

```env
MONGODB_URI=mongodb+srv://somyalakshmi17_db_user:9ft7qNZWLA5IqWUd@cluster0.v1rzlcu.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=ecommerce-app
```

## Notes

- The connection string includes all necessary parameters for Atlas
- TLS is required for Atlas connections
- Collections are created automatically when first document is inserted
- No manual database setup required

