# Troubleshooting: "Service unavailable" After Sign Up

## Common Cause: Cosmos DB Connection String

The most common reason for "Service unavailable" error after sign up is that the **Cosmos DB connection string still has the `<password>` placeholder** instead of your actual password.

## Quick Fix

### Step 1: Update Connection String in docker-compose.yml

Open `docker-compose.yml` and replace `<password>` with your actual Cosmos DB password in all `MONGODB_URI` entries:

**Find:**
```yaml
- MONGODB_URI=mongodb+srv://dbuser:<password>@cosmos-ecommerce.global.mongocluster.cosmos.azure.com/ecommerce?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000
```

**Replace with:**
```yaml
- MONGODB_URI=mongodb+srv://dbuser:YOUR_ACTUAL_PASSWORD@cosmos-ecommerce.global.mongocluster.cosmos.azure.com/ecommerce?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000
```

**Locations to update:**
- `auth-service` environment section (line ~24)
- `catalog-service` environment section (line ~67)
- `order-service` environment section (line ~98)

### Step 2: Restart Services

```bash
# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build
```

### Step 3: Check Service Logs

Check if auth-service is connecting to Cosmos DB:

```bash
# Check auth-service logs
docker logs ecommerce-auth

# Look for:
# ✅ Connected to Azure Cosmos DB (ecommerce database)
# OR
# ❌ Cosmos DB connection error: ...
```

## Other Possible Issues

### Issue 1: Services Not Running

**Check:**
```bash
docker ps
```

**Should see:**
- ecommerce-redis
- ecommerce-auth
- ecommerce-gateway
- ecommerce-catalog
- ecommerce-order
- ecommerce-cart
- ecommerce-payment
- ecommerce-admin
- ecommerce-frontend

**Fix:** Start services:
```bash
docker-compose up
```

### Issue 2: Network Connection Error

**Symptoms:**
- Error: "Cannot connect to server"
- Error: "Request timeout"

**Check:**
1. Gateway service is running: `docker logs ecommerce-gateway`
2. Auth service is running: `docker logs ecommerce-auth`
3. Services can communicate: Check Docker network

**Fix:**
```bash
# Restart all services
docker-compose restart
```

### Issue 3: Cosmos DB Firewall Rules

**Symptoms:**
- Connection timeout
- Authentication failed

**Check:**
1. Go to Azure Portal → Cosmos DB account
2. Check "Networking" → "Firewall and virtual networks"
3. Ensure your IP is whitelisted OR "Allow access from Azure services" is enabled

**Fix:**
- Add your current IP address to the firewall rules
- Or enable "Allow access from Azure services" for AKS deployments

### Issue 4: Invalid Password

**Symptoms:**
- Authentication failed
- Connection refused

**Check:**
1. Verify password in Azure Portal → Cosmos DB → Connection Strings
2. Ensure password is URL-encoded if it contains special characters
3. Check for typos in connection string

**Fix:**
- Copy connection string directly from Azure Portal
- Replace only the password part, keep rest of the string intact

### Issue 5: Database Name Mismatch

**Symptoms:**
- Connection succeeds but operations fail
- Collections not found

**Check:**
- Connection string includes `/ecommerce` (database name)
- Database exists in Cosmos DB account

**Fix:**
- Ensure database name in connection string matches actual database name
- Default database name: `ecommerce`

## Debugging Steps

### 1. Check Gateway Service

```bash
docker logs ecommerce-gateway
```

**Look for:**
- Gateway started successfully
- Routes registered
- No connection errors to auth-service

### 2. Check Auth Service

```bash
docker logs ecommerce-auth
```

**Look for:**
- ✅ Connected to Azure Cosmos DB (ecommerce database)
- Server listening on port 3001
- No connection errors

**If you see connection errors:**
- Check MONGODB_URI environment variable
- Verify password is correct (not `<password>`)
- Check Cosmos DB firewall rules

### 3. Test Connection Manually

```bash
# Enter auth-service container
docker exec -it ecommerce-auth sh

# Check environment variable
echo $MONGODB_URI

# Should show connection string with actual password (not <password>)
```

### 4. Test API Endpoint

```bash
# Test registration endpoint (should return 400 for missing fields, not 503)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com","password":"Test@123","name":"Test User","confirmPassword":"Test@123"}'
```

**Expected:**
- If connection works: `201 Created` with user data
- If connection fails: `503 Service Unavailable` with error message

## Error Messages Explained

### "Service unavailable"
- **Cause**: Backend service (auth-service) cannot be reached
- **Fix**: Check if auth-service is running and can connect to Cosmos DB

### "Database connection failed"
- **Cause**: Cannot connect to Cosmos DB
- **Fix**: Check connection string password, firewall rules, network

### "Auth service unavailable"
- **Cause**: Gateway cannot reach auth-service
- **Fix**: Check if auth-service container is running

### "Cannot connect to server"
- **Cause**: Network error or services not running
- **Fix**: Check Docker containers, network connectivity

## Verification

After fixing the connection string:

1. **Check logs:**
   ```bash
   docker logs ecommerce-auth | grep "Connected"
   ```
   Should show: `✅ Connected to Azure Cosmos DB (ecommerce database)`

2. **Test registration:**
   - Go to http://localhost:8080/register
   - Fill in form with valid data
   - Submit
   - Should see: "Account created successfully! Please login to continue."
   - Should redirect to login page

3. **Check database:**
   - User should be created in Cosmos DB `users` collection
   - Can verify in Azure Portal → Cosmos DB → Data Explorer

## Still Having Issues?

1. **Check all service logs:**
   ```bash
   docker-compose logs
   ```

2. **Restart all services:**
   ```bash
   docker-compose down
   docker-compose up --build
   ```

3. **Verify connection string format:**
   - Should start with `mongodb+srv://`
   - Should include `tls=true`
   - Should include `authMechanism=SCRAM-SHA-256`
   - Should include `retrywrites=false`
   - Should NOT contain `<password>` placeholder

4. **Check Cosmos DB status:**
   - Azure Portal → Cosmos DB account → Overview
   - Verify account is running and accessible

---

**Most Common Fix**: Replace `<password>` in `docker-compose.yml` with your actual Cosmos DB password!

