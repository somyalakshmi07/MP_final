# Register Page - Test Cases

Complete test cases for the Registration page with all validation rules.

## Validation Rules Implemented

### 1. Full Name
- ✅ **Required**: Cannot be empty
- ✅ **Alphabets Only**: Only letters (A-Z, a-z) and spaces allowed
- ✅ **No Numbers**: Numbers are not allowed
- ✅ **No Special Characters**: Special characters are not allowed
- ✅ **Error Messages**:
  - Empty: "This field is required"
  - Contains numbers/special chars: "Name must contain only alphabets (letters)"
- ✅ **Validation**: Shows error on blur (when user leaves field)
- ✅ **Helper Text**: "Only alphabets (letters) and spaces are allowed"

### 2. Email Address
- ✅ **Required**: Cannot be empty
- ✅ **Format**: Must be a valid email format
- ✅ **Gmail Only**: Must end with `@gmail.com`
- ✅ **Error Messages**:
  - Empty: "This field is required"
  - Invalid format (e.g., "john@com"): "Please enter a valid email address"
  - Not Gmail (e.g., "john@yahoo.com"): "Email must be a Gmail address (@gmail.com)"
- ✅ **Placeholder**: "yourname@gmail.com"

### 3. Password
- ✅ **Required**: Cannot be empty
- ✅ **Minimum Length**: 8 characters
- ✅ **Capital Letter**: At least one uppercase letter (A-Z)
- ✅ **Small Letter**: At least one lowercase letter (a-z)
- ✅ **Number**: At least one digit (0-9)
- ✅ **Special Symbol**: At least one special character (!@#$%^&* etc.)
- ✅ **Error Messages**:
  - Empty: "This field is required"
  - Less than 8 chars: "Password must be at least 8 characters"
  - No capital: "Password must contain at least one capital letter"
  - No small: "Password must contain at least one small letter"
  - No number: "Password must contain at least one number"
  - No special: "Password must contain at least one special symbol"
- ✅ **Helper Text**: Shows password requirements below field

### 4. Confirm Password
- ✅ **Required**: Cannot be empty
- ✅ **Match**: Must match the password field
- ✅ **Error Messages**:
  - Empty: "This field is required"
  - Mismatch: "Passwords do not match"

---

## Test Cases

### ✅ Test Case 1: Empty Fields
**Steps:**
1. Open registration page
2. Leave all fields empty
3. Click "Sign up" or try to submit

**Expected Result:**
- All fields show "This field is required" error
- Form does not submit
- Registration blocked

---

### ✅ Test Case 1a: Name with Numbers
**Steps:**
1. Enter name: "John123" (contains numbers)
2. Enter valid email, password, and confirm password
3. Try to submit

**Expected Result:**
- Error: "Name must contain only alphabets (letters)"
- Form does not submit
- Registration blocked

---

### ✅ Test Case 1b: Name with Special Characters
**Steps:**
1. Enter name: "John@Doe" (contains special character)
2. Enter valid email, password, and confirm password
3. Try to submit

**Expected Result:**
- Error: "Name must contain only alphabets (letters)"
- Form does not submit
- Registration blocked

---

### ✅ Test Case 1c: Valid Name (Alphabets Only)
**Steps:**
1. Enter name: "John Doe" (only letters and space)
2. Enter valid email, password, and confirm password
3. Try to submit

**Expected Result:**
- ✅ No error on name field
- ✅ Validation passes
- ✅ Form can proceed to other validations

---

### ✅ Test Case 2: Invalid Email Format
**Steps:**
1. Enter name: "John Doe"
2. Enter email: "john@com" (invalid format)
3. Enter valid password and confirm password
4. Try to submit

**Expected Result:**
- Error: "Please enter a valid email address"
- Form does not submit
- Registration blocked

---

### ✅ Test Case 3: Non-Gmail Email
**Steps:**
1. Enter name: "John Doe"
2. Enter email: "john@yahoo.com" (valid email but not Gmail)
3. Enter valid password and confirm password
4. Try to submit

**Expected Result:**
- Error: "Email must be a Gmail address (@gmail.com)"
- Form does not submit
- Registration blocked

---

### ✅ Test Case 4: Password Mismatch
**Steps:**
1. Enter name: "John Doe"
2. Enter email: "john@gmail.com"
3. Enter password: "Secure@123"
4. Enter confirm password: "Different@123"
5. Try to submit

**Expected Result:**
- Error on confirm password: "Passwords do not match"
- Form does not submit
- Registration blocked

---

### ✅ Test Case 5: Weak Password (Less than 8 chars)
**Steps:**
1. Enter name: "John Doe"
2. Enter email: "john@gmail.com"
3. Enter password: "Pass1!" (only 6 characters)
4. Enter confirm password: "Pass1!"
5. Try to submit

**Expected Result:**
- Error: "Password must be at least 8 characters"
- Form does not submit
- Registration blocked

---

### ✅ Test Case 6: Password Missing Capital Letter
**Steps:**
1. Enter name: "John Doe"
2. Enter email: "john@gmail.com"
3. Enter password: "secure@123" (no capital letter)
4. Enter confirm password: "secure@123"
5. Try to submit

**Expected Result:**
- Error: "Password must contain at least one capital letter"
- Form does not submit
- Registration blocked

---

### ✅ Test Case 7: Password Missing Small Letter
**Steps:**
1. Enter name: "John Doe"
2. Enter email: "john@gmail.com"
3. Enter password: "SECURE@123" (no small letter)
4. Enter confirm password: "SECURE@123"
5. Try to submit

**Expected Result:**
- Error: "Password must contain at least one small letter"
- Form does not submit
- Registration blocked

---

### ✅ Test Case 8: Password Missing Number
**Steps:**
1. Enter name: "John Doe"
2. Enter email: "john@gmail.com"
3. Enter password: "Secure@Pass" (no number)
4. Enter confirm password: "Secure@Pass"
5. Try to submit

**Expected Result:**
- Error: "Password must contain at least one number"
- Form does not submit
- Registration blocked

---

### ✅ Test Case 9: Password Missing Special Symbol
**Steps:**
1. Enter name: "John Doe"
2. Enter email: "john@gmail.com"
3. Enter password: "Secure123" (no special symbol)
4. Enter confirm password: "Secure123"
5. Try to submit

**Expected Result:**
- Error: "Password must contain at least one special symbol"
- Form does not submit
- Registration blocked

---

### ✅ Test Case 10: Valid Registration
**Steps:**
1. Enter name: "John Doe"
2. Enter email: "john@gmail.com"
3. Enter password: "Secure@123" (meets all requirements)
4. Enter confirm password: "Secure@123"
5. Click "Sign up"

**Expected Result:**
- ✅ All validations pass
- ✅ Success toast: "Account created successfully! Please login to continue."
- ✅ User created in MongoDB Atlas
- ✅ Redirects to login page after 1.5 seconds
- ✅ No errors displayed

---

## Valid Name Examples

✅ **Valid Names:**
- `John Doe`
- `Jane Smith`
- `Mary`
- `Robert Johnson`
- `Alice`

❌ **Invalid Names:**
- `John123` (contains numbers)
- `John@Doe` (contains special character)
- `John-Doe` (contains hyphen)
- `John_Doe` (contains underscore)
- `John123Doe` (contains numbers)

---

## Valid Password Examples

✅ **Valid Passwords:**
- `Secure@123`
- `MyPass123!`
- `Test@2024`
- `Password1#`
- `Hello@World99`

❌ **Invalid Passwords:**
- `secure@123` (no capital)
- `SECURE@123` (no small)
- `Secure@Pass` (no number)
- `Secure123` (no special)
- `Sec@1` (less than 8 chars)
- `Secure@` (no number)

---

## Valid Email Examples

✅ **Valid Emails:**
- `john@gmail.com`
- `jane.doe@gmail.com`
- `user123@gmail.com`
- `test.user@gmail.com`

❌ **Invalid Emails:**
- `john@yahoo.com` (not Gmail)
- `john@outlook.com` (not Gmail)
- `john@com` (invalid format)
- `john@gmail` (incomplete)
- `@gmail.com` (no username)

---

## Error Handling

### Service Unavailable Error
If backend services are not running:
- ✅ Shows error: "Service unavailable. Please ensure all backend services are running."
- ✅ Toast notification appears
- ✅ Form does not submit
- ✅ User can retry after starting services

---

## Real-Time Validation

- ✅ **Validation Mode**: `onBlur` (validates when user leaves field)
- ✅ **Re-validation Mode**: `onChange` (re-validates as user types after first error)
- ✅ **Visual Feedback**: Error messages with ⚠️ icon
- ✅ **Helper Text**: Password requirements shown below password field

---

## User Experience Features

1. ✅ **Clear Error Messages**: Each field shows specific error
2. ✅ **Visual Indicators**: Error icons (⚠️) next to error messages
3. ✅ **Helper Text**: Password requirements displayed
4. ✅ **Loading State**: Button shows "Creating account..." during submission
5. ✅ **Success Feedback**: Toast notification on successful registration
6. ✅ **Auto-redirect**: Redirects to login page after success
7. ✅ **Disabled State**: Submit button disabled during submission

---

## Testing Checklist

- [ ] Empty name field shows error
- [ ] Name with numbers shows error
- [ ] Name with special characters shows error
- [ ] Valid name (alphabets only) passes validation
- [ ] Empty email field shows error
- [ ] Empty password field shows error
- [ ] Empty confirm password field shows error
- [ ] Invalid email format shows error
- [ ] Non-Gmail email shows error
- [ ] Short password shows error
- [ ] Password without capital shows error
- [ ] Password without small letter shows error
- [ ] Password without number shows error
- [ ] Password without special symbol shows error
- [ ] Mismatched passwords show error
- [ ] Valid registration succeeds
- [ ] Success message appears
- [ ] Redirects to login page
- [ ] User created in database
- [ ] Service unavailable error handled

---

## Backend Validation

The backend (`auth-service`) also validates:
- ✅ All frontend validation rules are enforced
- ✅ Duplicate email check (user already exists)
- ✅ MongoDB connection validation
- ✅ Password hashing with bcrypt

---

## Notes

- All validation happens on both **frontend** and **backend**
- Frontend validation provides immediate feedback
- Backend validation ensures security
- Email must be Gmail format (`@gmail.com`)
- Password must meet all complexity requirements
- Form uses React Hook Form with Zod validation
- Real-time validation provides better UX

