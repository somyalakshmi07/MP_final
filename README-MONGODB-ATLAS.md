# MongoDB Atlas (Live Cluster)

We are using a real MongoDB Atlas M0 free cluster:

```
mongodb+srv://somyalakshmi17_db_user:9ft7qNZWLA5IqWUd@cluster0.v1rzlcu.mongodb.net/ecommerce
```

## Connection Details

- **Cluster**: cluster0.v1rzlcu.mongodb.net
- **Database**: ecommerce
- **Username**: somyalakshmi17_db_user
- **Connection String**: `mongodb+srv://somyalakshmi17_db_user:9ft7qNZWLA5IqWUd@cluster0.v1rzlcu.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=ecommerce-app`

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

