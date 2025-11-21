# Login Page - Test Cases

Complete test cases for the Login page with all validation rules.

## Validation Rules Implemented

### 1. Email/Username
- ✅ **Required**: Cannot be empty
- ✅ **Error Message**: "Username and Password are required"
- ✅ **Validation**: Shows error on blur (when user leaves field)

### 2. Password
- ✅ **Required**: Cannot be empty
- ✅ **Error Message**: "Username and Password are required"
- ✅ **Validation**: Shows error on blur (when user leaves field)

### 3. Authentication
- ✅ **Only Registered Users**: Only users registered in the system can login
- ✅ **Invalid Credentials**: Wrong email or password shows "Invalid credentials"
- ✅ **JWT Token**: Successful login issues JWT token
- ✅ **Redirect**: Successful login redirects to product catalog (`/products`)

---

## Test Cases

### ✅ Test Case 1: Empty Username/Email
**Steps:**
1. Open login page
2. Leave email field empty
3. Enter any password (or leave empty)
4. Click "Sign in" or try to submit

**Expected Result:**
- Error: "Username and Password are required"
- Form does not submit
- Login denied

---

### ✅ Test Case 2: Empty Password
**Steps:**
1. Open login page
2. Enter valid email
3. Leave password field empty
4. Click "Sign in" or try to submit

**Expected Result:**
- Error: "Username and Password are required"
- Form does not submit
- Login denied

---

### ✅ Test Case 3: Empty Both Fields
**Steps:**
1. Open login page
2. Leave both email and password fields empty
3. Click "Sign in" or try to submit

**Expected Result:**
- Both fields show error: "Username and Password are required"
- Form does not submit
- Login denied

---

### ✅ Test Case 4: Invalid Credentials - Wrong Email
**Steps:**
1. Open login page
2. Enter email: `nonexistent@gmail.com` (not registered)
3. Enter any password
4. Click "Sign in"

**Expected Result:**
- Error toast: "Invalid credentials"
- Login denied
- User stays on login page
- No JWT token issued
- No redirect

---

### ✅ Test Case 5: Invalid Credentials - Wrong Password
**Steps:**
1. Open login page
2. Enter email: `john@gmail.com` (registered user)
3. Enter password: `WrongPass@123` (incorrect password)
4. Click "Sign in"

**Expected Result:**
- Error toast: "Invalid credentials"
- Login denied
- User stays on login page
- No JWT token issued
- No redirect

---

### ✅ Test Case 6: Invalid Credentials - Wrong Email and Password
**Steps:**
1. Open login page
2. Enter email: `wrong@gmail.com` (not registered)
3. Enter password: `WrongPass@123` (any password)
4. Click "Sign in"

**Expected Result:**
- Error toast: "Invalid credentials"
- Login denied
- User stays on login page
- No JWT token issued
- No redirect

---

### ✅ Test Case 7: Valid Credentials - Successful Login
**Prerequisites:**
- User must be registered (from registration test case)
- Example: `john@gmail.com` / `Secure@123`

**Steps:**
1. Open login page
2. Enter email: `john@gmail.com` (registered user)
3. Enter password: `Secure@123` (correct password)
4. Click "Sign in"

**Expected Result:**
- ✅ Success toast: "Logged in successfully!"
- ✅ JWT token issued and stored in localStorage
- ✅ User data stored in auth store
- ✅ Redirects to product catalog (`/products`)
- ✅ User is authenticated
- ✅ Can access protected pages

---

### ✅ Test Case 8: Unregistered User Attempt
**Steps:**
1. Open login page
2. Enter email: `newuser@gmail.com` (not registered)
3. Enter password: `AnyPass@123`
4. Click "Sign in"

**Expected Result:**
- Error toast: "Invalid credentials"
- Login denied
- Message: "Only registered users should be able to login"
- User stays on login page

---

### ✅ Test Case 9: Service Unavailable
**Steps:**
1. Stop backend services (auth-service, gateway-service)
2. Open login page
3. Enter valid credentials
4. Click "Sign in"

**Expected Result:**
- Error toast: "Service unavailable. Please ensure all backend services are running."
- Login denied
- User stays on login page

---

## Authentication Flow

### Successful Login Flow
```
1. User enters valid credentials
2. Frontend validates (not empty)
3. Request sent to /api/auth/login
4. Backend checks if user exists
5. Backend verifies password with bcrypt
6. Backend generates JWT token
7. Backend returns token + user data
8. Frontend stores token in localStorage
9. Frontend stores user in auth store
10. Success toast shown
11. Redirect to /products
```

### Failed Login Flow
```
1. User enters invalid credentials
2. Frontend validates (not empty)
3. Request sent to /api/auth/login
4. Backend checks if user exists → NOT FOUND
   OR
   Backend verifies password → MISMATCH
5. Backend returns 401 "Invalid credentials"
6. Frontend shows error toast
7. User stays on login page
```

---

## Security Features

### ✅ Only Registered Users Can Login
- Backend checks if user exists in MongoDB
- If user doesn't exist → "Invalid credentials"
- If user exists but wrong password → "Invalid credentials"
- Only correct email + password combination works

### ✅ JWT Token Issuance
- Token issued only on successful authentication
- Token contains: userId, email, role
- Token expires in 7 days (configurable)
- Token stored in localStorage

### ✅ Password Security
- Passwords are hashed with bcrypt
- Original password never stored
- Password comparison done server-side
- No password sent in response

---

## Error Handling

### Empty Fields
- ✅ Shows "Username and Password are required"
- ✅ Both fields validated
- ✅ Visual error indicators (⚠️ icon)
- ✅ Form does not submit

### Invalid Credentials
- ✅ Shows "Invalid credentials" toast
- ✅ Generic message (doesn't reveal if email exists)
- ✅ 401 status code
- ✅ Login denied

### Service Unavailable
- ✅ Shows service unavailable message
- ✅ Network error detection
- ✅ Clear error message
- ✅ User can retry after starting services

---

## User Experience Features

1. ✅ **Clear Error Messages**: Specific error for each scenario
2. ✅ **Visual Indicators**: Error icons (⚠️) next to error messages
3. ✅ **Loading State**: Button shows "Signing in..." during submission
4. ✅ **Success Feedback**: Toast notification on successful login
5. ✅ **Auto-redirect**: Redirects to products page after success
6. ✅ **Disabled State**: Submit button disabled during submission
7. ✅ **Real-time Validation**: Validates on blur, re-validates on change

---

## Backend Validation

The backend (`auth-service`) validates:
- ✅ Email and password are not empty
- ✅ User exists in MongoDB
- ✅ Password matches (bcrypt comparison)
- ✅ Returns appropriate error messages
- ✅ Issues JWT token on success

---

## Testing Checklist

- [ ] Empty email field shows error
- [ ] Empty password field shows error
- [ ] Empty both fields show errors
- [ ] Wrong email shows "Invalid credentials"
- [ ] Wrong password shows "Invalid credentials"
- [ ] Wrong email and password shows "Invalid credentials"
- [ ] Unregistered user cannot login
- [ ] Valid credentials succeed
- [ ] Success message appears
- [ ] JWT token issued and stored
- [ ] Redirects to products page
- [ ] User can access protected pages
- [ ] Service unavailable error handled

---

## Valid Test Credentials

### Registered User (from registration)
- **Email**: `john@gmail.com`
- **Password**: `Secure@123`
- **Status**: ✅ Should login successfully

### Unregistered User
- **Email**: `newuser@gmail.com`
- **Password**: `AnyPass@123`
- **Status**: ❌ Should show "Invalid credentials"

### Wrong Password
- **Email**: `john@gmail.com` (registered)
- **Password**: `WrongPass@123` (incorrect)
- **Status**: ❌ Should show "Invalid credentials"

---

## Notes

- All validation happens on both **frontend** and **backend**
- Frontend validation provides immediate feedback
- Backend validation ensures security
- Only registered users can login
- Invalid credentials return generic message (security best practice)
- JWT token stored in localStorage
- Successful login redirects to `/products`
- Form uses React Hook Form with Zod validation
- Real-time validation provides better UX

---

## API Endpoint

**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "john@gmail.com",
  "password": "Secure@123"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@gmail.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid credentials"
}
```

**Error Response (400):**
```json
{
  "errors": {
    "email": "Username and Password are required",
    "password": "Username and Password are required"
  }
}
```

