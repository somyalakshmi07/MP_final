# Provide Your Cosmos DB Credentials

Please provide the following information. I'll update all configuration files automatically.

## Option 1: Full Connection String (Easiest)

**Copy the complete connection string from Azure Portal:**

1. Go to: **Azure Portal** → Your **Cosmos DB Account** → **Connection Strings**
2. Copy the **"Primary MongoDB connection string"** or **"MongoDB connection string"**
3. Paste it here:

```
[PASTE YOUR FULL CONNECTION STRING HERE]
```

Example format:
```
mongodb+srv://username:password@host/database?parameters
```

---

## Option 2: Individual Components

If you prefer to provide components separately:

### A. Connection String Components

**Username:**
```
[Enter username, e.g., dbuser or cosmos-ecommerce]
```

**Password:**
```
[Enter your password]
```

**Host/Endpoint:**
```
[Enter host, e.g., cosmos-ecommerce.global.mongocluster.cosmos.azure.com]
```

**Database Name:**
```
[Enter database name, e.g., ecommerce]
```

**Additional Parameters (if any):**
```
[Any additional parameters beyond: tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000]
```

---

## Option 3: Quick Checklist

Just answer these questions:

1. **What is your Cosmos DB username?**
   - [ ] `dbuser`
   - [ ] `cosmos-ecommerce`
   - [ ] Other: `_______________`

2. **What is your Cosmos DB password?**
   - Password: `_______________`
   - Does it contain special characters? (Yes/No)
   - If yes, which ones? `_______________`

3. **What is your Cosmos DB host/endpoint?**
   - [ ] `cosmos-ecommerce.global.mongocluster.cosmos.azure.com`
   - [ ] Other: `_______________`

4. **What is your database name?**
   - [ ] `ecommerce`
   - [ ] Other: `_______________`

5. **Can you access the connection string in Azure Portal?**
   - [ ] Yes, I can see it
   - [ ] No, I need help finding it

---

## Important Notes

### Password with Special Characters

If your password contains special characters like `@`, `#`, `%`, `&`, etc., they need to be **URL-encoded** in the connection string:

- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`
- `/` → `%2F`
- `?` → `%3F`
- `=` → `%3D`

**Example:**
- Password: `My@Pass#123`
- URL-encoded: `My%40Pass%23123`

**OR** just provide the password as-is, and I'll handle the encoding.

---

## Current Error Information

To help diagnose, please also provide:

**1. Exact error message:**
```
[Copy-paste the exact error you see]
```

**2. Docker logs (run this command):**
```bash
docker logs ecommerce-auth --tail 30
```
```
[Paste the output here]
```

**3. Browser console errors (F12 → Console):**
```
[Paste any red errors here]
```

---

## Files I'll Update

Once you provide the credentials, I'll automatically update:

1. ✅ `docker-compose.yml` (3 services: auth, catalog, order)
2. ✅ `helm/values.yaml`
3. ✅ `k8s/auth-service.yaml`
4. ✅ `scripts/seed-data.js`
5. ✅ `auth-service/src/config/database.ts`
6. ✅ `catalog-service/src/config/database.ts`
7. ✅ `order-service/src/config/database.ts`

---

## Quick Test After Update

After I update the files, you'll need to:

1. **Restart services:**
   ```bash
   docker-compose down
   docker-compose up --build
   ```

2. **Verify connection:**
   ```bash
   docker logs ecommerce-auth | grep "Connected"
   ```
   Should show: `✅ Connected to Azure Cosmos DB (ecommerce database)`

3. **Test registration:**
   - Go to http://localhost:8080/register
   - Create an account
   - Should redirect to login page (no errors)

---

**Please provide the information above, and I'll update everything for you!** 🚀

