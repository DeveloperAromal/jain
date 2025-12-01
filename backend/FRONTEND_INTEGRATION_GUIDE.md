# Frontend Integration Guide - Jain Education Platform

## 📋 Complete API Overview

This guide explains all available backend features and how your frontend can integrate with them.

---

## 1. **Authentication Features**

### What You Can Do:

- Admin users can login securely
- JWT tokens for protected endpoints
- Token validation and verification
- Persistent user sessions

### How It Works:

1. Admin submits email and password
2. Backend validates credentials (bcrypt hashing)
3. Backend returns JWT token (valid for 24 hours)
4. Frontend stores token in localStorage/sessionStorage
5. Token is sent with every protected request in `Authorization: Bearer <token>` header

### Protected Endpoints:

- Admin course management
- Admin validation endpoints
- Any endpoint requiring admin access

### Token Usage:

- Include in header: `Authorization: Bearer eyJhbGc...`
- Token contains: User ID, Email, Issue time
- Expires after 24 hours (need to refresh/re-login)

---

## 2. **Course Management Features**

### For Admin Users:

- **View all courses** (both free and paid)
- **Toggle course free/paid status** (mark courses as free to make accessible to unpaid students)
- **Create courses** with subject, class, description, tags
- **Get course by ID** to view details

### For Student Users:

- **View only free courses** (unpaid students see only courses marked as free)
- **Access free course content** without payment
- **Browse course topics** and materials

### How Free/Paid Works:

```
Free Courses (is_free = true)
├─ Visible to: All users (paid & unpaid)
├─ Access: Immediate
└─ No payment required

Paid Courses (is_free = false)
├─ Visible to: Admins only (in admin panel)
├─ Access: After successful payment
└─ Students see after purchase
```

### Course Data Structure:

- Course ID (UUID)
- Subject name
- Subject class (grade/level)
- Description
- Tags (for categorization)
- Free/Paid status
- Creation date

---

## 3. **Payment & Razorpay Integration**

### What Students Can Do:

- **Initiate payments** for paid courses
- **Apply promo codes** for discounts
- **Receive discounted price** if code is valid
- **Track payment status** (success/failure)

### What Admin Can Do:

- **Create promo codes** in database with discount percentage
- **Set expiration dates** for promo codes
- **Activate/Deactivate** promo codes anytime
- **View payment attempts** via webhooks

### Payment Flow:

```
1. Student selects paid course
2. System calculates price
3. Student enters promo code (optional)
4. Backend validates promo code from database
5. If valid: Apply discount percentage, recalculate total
6. Initiate Razorpay payment with final amount
7. Student pays via Razorpay
8. Razorpay sends webhook confirmation
9. Backend marks order as paid
10. Student gets course access
```

### Promo Code Features:

- **Percentage-based discounts** (e.g., 10%, 25%, 50%)
- **Expiration dates** (only valid until date passes)
- **Active/Inactive toggle** (enable/disable code)
- **Database stored** (managed by admin in Supabase)

### What Frontend Receives:

After payment request:

- Order ID from Razorpay
- Amount (in paise - divide by 100 for display)
- Applied discount amount
- Promo code details
- Final payable amount

---

## 4. **Topics/Content Management**

### What You Can Access:

- **List all topics** for a specific course
- **View topic details**: title, description, video URL, thumbnail
- **Filter by course ID** to get course-specific content
- **Video content** - hosted externally, linked via URL

### Use Cases:

- Display course curriculum
- Show video lessons
- Organize content by chapters/topics
- Display topic thumbnails in course preview

---

## 5. **Referral System**

### What Users Can Do:

- **Generate unique referral code** (automatic per user)
- **Share referral code** with others
- **Track referral usage** - see who used their code
- **Count referrals** - how many people signed up via their code
- **Get referral details** - names, classes of referred users

### How Referral Works:

```
User A generates code: ABCD1234
    ↓
User A shares with User B
    ↓
User B signs up with code ABCD1234
    ↓
System records: User B referred by User A
    ↓
User A can view: "I have 1 successful referral"
```

### Referral Benefits (To Be Configured):

- Reward points
- Discounts
- Free courses
- Other incentives (your decision)

---

## 6. **Free vs Paid Access Control**

### How It Works:

```
User Type: Unpaid Student
├─ Can see: Only courses where is_free = true
├─ Can access: Free course content, topics, videos
├─ Cannot see: Paid courses in listing
└─ To unlock paid: Make payment

User Type: Paid Student (After Purchase)
├─ Can see: Purchased course content
├─ Can access: All course materials
└─ Billing: Handled via payment receipts

User Type: Admin
├─ Can see: All courses (free & paid)
├─ Can manage: Mark courses free/paid
├─ Can view: Payment records via webhooks
└─ Can create: Promo codes and manage discounts
```

---

## 7. **Data Flow Between Frontend & Backend**

### Request Structure (All POST/PUT requests):

```
Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN> (for protected routes)

Body: JSON data
```

### Response Structure (All endpoints):

```
{
  "success": true/false,
  "message": "Descriptive message",
  "data": { /* specific data */ }
}
```

---

## 8. **Complete Feature Checklist**

### ✅ Authentication

- [ ] Admin login
- [ ] JWT token storage
- [ ] Token refresh mechanism
- [ ] Logout functionality
- [ ] Protected route access

### ✅ Courses

- [ ] View free courses (student)
- [ ] View all courses (admin)
- [ ] Mark course as free/paid (admin)
- [ ] Get course details
- [ ] Create new course (admin)

### ✅ Payments

- [ ] Display course price
- [ ] Apply promo code
- [ ] Show discount calculation
- [ ] Initiate Razorpay payment
- [ ] Handle payment success/failure
- [ ] Update course access after payment

### ✅ Topics/Content

- [ ] Display course topics list
- [ ] Show video player with topic video
- [ ] Display thumbnail images
- [ ] Show description and tags

### ✅ Referrals

- [ ] Display user's referral code
- [ ] Show referral count
- [ ] Display referred users list
- [ ] Copy referral link feature

### ✅ Admin Dashboard

- [ ] View all courses
- [ ] Toggle free/paid status
- [ ] Manage promo codes
- [ ] View payment records
- [ ] User management

---

## 9. **Security Features Built-In**

### For Students:

- JWT token validation on every request
- Unpaid students cannot access paid course routes (backend enforced)
- Promo codes validated server-side (can't be manipulated)
- Payment signature verification (Razorpay)

### For Admin:

- Login credentials hashed with bcrypt
- JWT token expires after 24 hours
- Protected admin endpoints require valid token
- Cannot toggle course status without authentication

### For Payments:

- HMAC signature verification for webhooks
- Amount validation (no negative amounts)
- Promo code expiration checked
- Razorpay webhook authentication

---

## 10. **Error Handling & Edge Cases**

### What Frontend Should Handle:

#### Invalid Token:

- Response: 401 Unauthorized
- Action: Clear token, redirect to login

#### Course Not Found:

- Response: 404 Not Found
- Action: Show "Course not available" message

#### Invalid Promo Code:

- Response: Discount = 0 (code ignored)
- Action: Show "Invalid promo code" message

#### Payment Failed:

- Response: Razorpay error
- Action: Show error, allow retry

#### Insufficient Permissions:

- Response: 403 Forbidden
- Action: Redirect to appropriate user dashboard

---

## 11. **State Management Recommendation**

### Store in Frontend:

```
1. JWT Token
   - localStorage or secure cookie
   - Include in all API headers
   - Clear on logout

2. User Info
   - Store user ID, email, name
   - Use for UI personalization
   - Clear on logout

3. Active Course Selection
   - Track which course user is viewing
   - Use for context in topic selection

4. Referral Code
   - Display prominently
   - Allow copy-to-clipboard

5. Payment Status
   - Track pending payments
   - Show success/failure messages
```

---

## 12. **Frontend Features Implementation Order**

### Phase 1 (Critical):

1. Auth - Login system
2. Course listing (free courses for students, all for admin)
3. Payment integration with Razorpay

### Phase 2 (Core):

4. Topic display and video player
5. Course details page
6. Admin course management

### Phase 3 (Enhanced):

7. Referral system
8. Promo code display/input
9. User dashboard

### Phase 4 (Polish):

10. Analytics dashboard
11. User profile management
12. Notifications/Alerts

---

## 13. **API Endpoint Summary**

| Feature          | Method | Endpoint                        | Auth | Purpose               |
| ---------------- | ------ | ------------------------------- | ---- | --------------------- |
| Login            | POST   | `/v1/auth/admin/login`          | No   | Admin authentication  |
| Validate         | GET    | `/v1/auth/admin/validate`       | Yes  | Verify token validity |
| Get Free Courses | GET    | `/v1/courses/free`              | No   | List free courses     |
| Get All Courses  | GET    | `/v1/courses/admin/all-courses` | Yes  | Admin view all        |
| Toggle Course    | PUT    | `/v1/courses/admin/toggle-free` | Yes  | Mark free/paid        |
| Create Order     | POST   | `/v1/payment/create-order`      | No   | Initiate payment      |
| Verify Payment   | POST   | `/v1/payment/verify`            | No   | Verify signature      |
| Get Topics       | GET    | `/v1/topics?course_id=X`        | No   | List course topics    |
| Get Referral     | GET    | `/v1/refferal/user/:id`         | No   | User's referral code  |

---

## 14. **Common Implementation Patterns**

### Pattern 1: Fetch Free Courses on Page Load

1. User visits home page
2. Frontend calls `/v1/courses/free`
3. Display all free courses in grid/list
4. User can click to view details

### Pattern 2: Admin Marks Course as Free

1. Admin views all courses in dashboard
2. Admin clicks "Make Free" button on a course
3. Frontend sends PUT request to toggle
4. Course becomes visible to all students

### Pattern 3: Student Purchases Paid Course

1. Student views paid course details
2. Student clicks "Enroll Now"
3. Frontend shows payment modal/redirect to Razorpay
4. Student can enter promo code
5. After successful payment, course access enabled

### Pattern 4: Referral Sharing

1. New user signs up
2. Backend generates unique referral code
3. User copies code and shares
4. Others sign up with that code
5. Referrer can see successful referrals

---

## 15. **Database Tables Reference** (For Understanding)

```
courses
├── id (UUID)
├── subject
├── subject_class
├── description
├── tags
└── is_free (boolean)

topics
├── id (UUID)
├── course_id (FK)
├── title
├── description
├── video_url
└── thumbnail_img

promocodes
├── id (UUID)
├── code (text, unique)
├── discount_percent (integer)
├── active (boolean)
└── expires (date)

refferals
├── id (UUID)
├── user_id
├── refferal_code (unique)
└── created_at

clients (admins)
├── id (UUID)
├── email
├── password (hashed)
├── name
└── company_name
```

---

## Summary

Your frontend can build a **complete educational platform** with:

- ✅ Authentication & Authorization
- ✅ Course discovery (free & paid)
- ✅ Payment processing with discounts
- ✅ Content delivery (videos & topics)
- ✅ Referral rewards system
- ✅ Admin dashboard for course management
- ✅ Secure & validated operations

All features are **production-ready** with security best practices built-in!
