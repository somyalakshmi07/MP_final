# Complete Credentials & Configuration Checklist

Please provide the following information so I can update all configuration files correctly:

## 1. Azure Cosmos DB Connection Details

### Required Information:

**A. Connection String Components:**
- [ ] **Username**: `dbuser` (or is it different?)
- [ ] **Password**: `????????` (your actual password)
- [ ] **Host/Endpoint**: `cosmos-ecommerce.global.mongocluster.cosmos.azure.com` (or is it different?)
- [ ] **Database Name**: `ecommerce` (or is it different?)

**B. Full Connection String from Azure Portal:**
- [ ] Copy the **complete connection string** from Azure Portal:
  - Go to: Azure Portal → Your Cosmos DB Account → Connection Strings
  - Copy the **Primary Connection String** or **MongoDB connection string**
  - Paste it here: `_________________________________________________`

**C. Connection String Format:**
- Should look like: `mongodb+srv://USERNAME:PASSWORD@HOST/DATABASE?PARAMETERS`
- Please provide the **exact format** you see in Azure Portal

## 2. Cosmos DB Account Details

- [ ] **Account Name**: `cosmos-ecommerce` (or different?)
- [ ] **Resource Group**: `????????`
- [ ] **Region/Location**: `????????`
- [ ] **API Type**: MongoDB API (confirm this)

## 3. Network & Firewall Settings

- [ ] **Firewall Rules**: 
  - Is "Allow access from Azure services" enabled? (Yes/No)
  - Are specific IP addresses whitelisted? (List them if yes)
  - Is your current IP whitelisted? (Yes/No)

- [ ] **Private Endpoint**: 
  - Are you using private endpoints? (Yes/No)
  - If yes, provide endpoint details

## 4. Authentication Details

- [ ] **Authentication Method**: SCRAM-SHA-256 (confirm this is correct)
- [ ] **Username Format**: Is `dbuser` the correct username, or should it be something like:
  - `cosmos-ecommerce` (account name)
  - `admin`
  - Something else?

## 5. Database & Collection Names

- [ ] **Database Name**: `ecommerce` (confirm or provide actual name)
- [ ] **Collections to be created**:
  - `users`
  - `products`
  - `categories`
  - `orders`
  
  (Are these correct, or do you have different collection names?)

## 6. Additional Connection Parameters

From your original connection string, I see these parameters:
- `tls=true`
- `authMechanism=SCRAM-SHA-256`
- `retrywrites=false`
- `maxIdleTimeMS=120000`

**Questions:**
- [ ] Are these all correct?
- [ ] Are there any **additional parameters** needed?
- [ ] Should `retrywrites` be `false` or `true`?
- [ ] Any other Cosmos DB specific settings?

## 7. Current Error Details

To help diagnose, please provide:

- [ ] **Exact error message** you see (copy-paste the full error)
- [ ] **Where it appears**: Browser console? Docker logs? Both?
- [ ] **Docker logs output**:
  ```bash
  docker logs ecommerce-auth
  ```
  (Copy the last 20-30 lines)

- [ ] **Browser console errors** (F12 → Console tab)
  (Copy any red error messages)

## 8. Service Status Check

Please run these commands and share the output:

```bash
# Check if services are running
docker ps

# Check auth-service logs
docker logs ecommerce-auth --tail 50

# Check gateway-service logs  
docker logs ecommerce-gateway --tail 50

# Test connection from inside container
docker exec ecommerce-auth sh -c 'echo $MONGODB_URI'
```

## 9. Alternative: Use Connection String from Azure Portal

**Easiest Option**: 
1. Go to Azure Portal → Your Cosmos DB Account
2. Click **"Connection Strings"** in the left menu
3. Copy the **"Primary MongoDB connection string"** or **"MongoDB connection string"**
4. It should look like:
   ```
   mongodb+srv://<username>:<password>@<host>/<database>?<parameters>
   ```
5. **Paste the complete string here** (I'll update all files with it)

## 10. Quick Verification Steps

After you provide the connection string, I'll need to verify:

- [ ] Can you access Azure Portal and see your Cosmos DB account?
- [ ] Can you see the "Connection Strings" section?
- [ ] Is the Cosmos DB account status "Online"?
- [ ] Have you tested the connection string in Azure Portal's "Data Explorer"?

---

## What I'll Update Once You Provide This Info:

1. ✅ `docker-compose.yml` (3 locations: auth, catalog, order services)
2. ✅ `helm/values.yaml` (for Kubernetes deployment)
3. ✅ `k8s/auth-service.yaml` (Kubernetes manifest)
4. ✅ `scripts/seed-data.js` (seed script)
5. ✅ All service database config files (auth, catalog, order)
6. ✅ All documentation files

---

## Template to Fill Out:

```
=== COSMOS DB CONNECTION STRING ===
Full Connection String: 
mongodb+srv://[USERNAME]:[PASSWORD]@[HOST]/[DATABASE]?[PARAMETERS]

Username: _______________
Password: _______________
Host: _______________
Database: _______________

=== VERIFICATION ===
Can access Azure Portal: Yes/No
Cosmos DB Status: Online/Offline
Firewall Rules: Enabled/Disabled
IP Whitelisted: Yes/No

=== ERROR DETAILS ===
Exact Error Message: 
_________________________________________________

Docker Logs (last 20 lines):
_________________________________________________
_________________________________________________
```

---

**Please fill out the template above and I'll update everything for you!** 🚀

