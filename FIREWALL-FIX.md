# Fix Cosmos DB Connection Refused Error

## Problem
You're seeing `ECONNREFUSED` error because Cosmos DB firewall is blocking the connection.

## Solution: Configure Cosmos DB Firewall

### Step 1: Enable Firewall Access in Azure Portal

1. Go to **Azure Portal** → Your **Cosmos DB Account** (`cosmos-ecommerce`)
2. Click **"Networking"** in the left menu
3. Under **"Firewall and virtual networks"**:

### Option A: Allow All Azure Services (Easiest for Development)

1. Select **"Selected networks"** or **"Public network access"**
2. Check **"Allow access from Azure services"** ✅
3. Click **"Save"**

### Option B: Whitelist Your IP Address (More Secure)

1. Select **"Selected networks"**
2. Click **"Add my current IP"** button
3. This will add your current public IP address
4. Click **"Save"**

### Option C: Allow All IPs (NOT RECOMMENDED for Production)

1. Select **"Public network access"**
2. Enable **"Allow access from Azure datacenters"**
3. Click **"Save"**

⚠️ **Warning**: Option C allows access from anywhere - only use for testing!

---

## Step 2: Restart Docker Services

After updating firewall rules:

```bash
# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build
```

---

## Step 3: Verify Connection

Check if services can connect:

```bash
# Check auth-service logs
docker logs ecommerce-auth --tail 20

# Should see:
# ✅ Connected to Azure Cosmos DB (ecommerce database)
```

If you still see connection errors, check:
- Firewall rules are saved in Azure Portal
- Your IP address is correct (if using Option B)
- Cosmos DB account status is "Online"

---

## Alternative: Use Private Endpoint (For Production)

For production deployments, consider using **Private Endpoints**:

1. Azure Portal → Cosmos DB → **Networking**
2. Click **"Private endpoint"** tab
3. Click **"Add"**
4. Configure private endpoint for your VNet/subnet
5. This allows secure access without public internet

---

## Quick Test

After configuring firewall:

1. **Wait 1-2 minutes** for firewall rules to propagate
2. **Restart services**: `docker-compose restart`
3. **Check logs**: `docker logs ecommerce-auth`
4. **Test registration**: Go to http://localhost:8080/register

---

## Still Having Issues?

If connection still fails after firewall configuration:

1. **Verify connection string**:
   ```bash
   docker exec ecommerce-auth sh -c 'echo $MONGODB_URI'
   ```
   Should show connection string with password (not `<password>`)

2. **Check Cosmos DB status**:
   - Azure Portal → Cosmos DB → Overview
   - Status should be "Online"

3. **Test from Azure Portal**:
   - Azure Portal → Cosmos DB → Data Explorer
   - Try to browse collections
   - If this works, firewall is configured correctly

4. **Check network connectivity**:
   ```bash
   # From your machine, test DNS resolution
   nslookup cosmos-ecommerce.global.mongocluster.cosmos.azure.com
   ```

---

**Most Common Fix**: Enable "Allow access from Azure services" in Cosmos DB firewall settings!

