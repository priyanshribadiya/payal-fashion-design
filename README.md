# Payal Fashion Design — Full-Stack E-Commerce Boutique & Custom Stitching Atelier

Welcome to the full-stack online store for **Payal Fashion Design**! This application is built with **React (Vite)** on the frontend, **Node.js & Express** on the backend, **MongoDB Atlas** for data storage, and **Razorpay** for payment processing in India.

---

## 📁 Project Folder Structure

```text
payal-fashion-design/
├── client/                     # React + Vite Frontend
│   ├── public/
│   │   ├── assets/payal-logo.png  # Your uploaded boutique logo
│   │   └── favicon.png            # Browser tab favicon
│   ├── src/
│   │   ├── components/            # Navbar, Footer, ProductCard, Modals
│   │   ├── contexts/              # Auth, Cart, and Toast Notification state
│   │   ├── pages/                 # Home, Shop, Product Detail, Cart, Checkout, Auth, Admin
│   │   ├── services/api.js        # REST API client with Bearer token authentication
│   │   └── styles/index.css       # Ivory, Cream, Burgundy, and Gold design system
│   ├── .env.example               # Frontend environment template
│   └── package.json
│
├── server/                     # Node.js + Express REST API Backend
│   ├── config/                    # DB connection pooling & environment validation
│   ├── controllers/               # Auth, Products, Cart, Orders, Payments, Admin logic
│   ├── middleware/                # JWT guard, Admin role guard, Rate limiters, Error handler
│   ├── models/                    # Mongoose schemas (User, Product, Cart, Order, Payment, Otp)
│   ├── routes/                    # API endpoints (/api/auth, /api/products, /api/cart, etc.)
│   ├── services/                  # Razorpay gateway, OTP hashing, Concurrency stock engine
│   ├── scripts/                   # Database seed, Admin creation, 500-user load test
│   ├── tests/                     # Automated unit and integration tests
│   ├── .env.example               # Backend environment template
│   └── package.json
│
├── legacy-static/              # Safe backup of your original static website files
├── .gitignore                  # Security guard preventing secrets from being committed
├── package.json                # Root project task runner
└── README.md                   # This master documentation guide
```

---

## 🛠 Prerequisites

1. **Node.js** (v18 or higher recommended; v24 installed).
2. **MongoDB Database**: Either a local MongoDB instance or a free cloud database on **MongoDB Atlas**.

---

## 🚀 Step-by-Step Quick Start (For Beginners)

### 1. Configure Backend Environment
Navigate to the `server/` directory and create your `.env` file from the example:
```bash
cd server
copy .env.example .env
```
*(On Mac/Linux: `cp .env.example .env`)*

By default, the server is configured to run in **Development Sandbox Mode**:
- `OTP_SANDBOX_MODE=true`: 6-digit verification codes are printed directly to the server terminal and displayed in the UI test helper.
- `RAZORPAY_KEY_ID=rzp_test_placeholder`: Simulated payments can be tested without entering real credit cards.

### 2. Configure Frontend Environment
In the `client/` directory:
```bash
cd ../client
copy .env.example .env
```

### 3. Start the Development Servers
From the root folder `d:/payal-fashion-design`:

**Terminal 1 (Backend Server):**
```bash
npm run dev:server
```
*The backend starts at http://localhost:5000 with a health check at http://localhost:5000/api/health.*

**Terminal 2 (Frontend Client):**
```bash
npm run dev:client
```
*The React storefront opens at http://localhost:5173.*

---

## 🍃 Setting up a Free MongoDB Atlas Database

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Click **Create a Deployment** and select the **M0 Free Tier**.
3. Under **Security Quickstart**:
   - Create a database username (e.g. `payal_admin`) and a secure password.
   - Under **IP Access List**, click **Add My Current IP Address** (or `0.0.0.0/0` to allow all connections during development).
4. Click **Connect** → **Drivers** (Node.js).
5. Copy your connection string and paste it into `server/.env`:
   ```env
   MONGODB_URI=mongodb+srv://payal_admin:<PASSWORD>@cluster0.abcde.mongodb.net/payal_fashion_design?retryWrites=true&w=majority
   ```

---

## 📦 Seeding the Demonstration Product Catalogue

To populate the 6 signature collections (Kurtis, Sarees, Lehengas, Salwar Suits, Designer Blouses, Festive Wear) and the 8 ready-to-wear showcase items:
```bash
npm run seed
```
All seeded items include prices in exact integer paise and are flagged with `isDemonstrationData: true`.

---

## 👑 Creating Your First Administrator Account

To securely create your administrator login using the credentials in `server/.env`:
```bash
npm run create-admin
```
Default administrator login:
- **Email:** `admin@payalfashiondesign.com`
- **Password:** `AdminPass123!` (or the value set in `INITIAL_ADMIN_PASSWORD`)

Once logged in, navigate to **Admin Portal** in the navigation bar to view sales metrics, change order fulfillment statuses, and manage products.

---

## 🧪 Running Automated Tests

To run the backend test suite verifying OTP generation, SHA-256 hashing, bcrypt password security, integer paise calculations, and cryptographic Razorpay signature checks:
```bash
npm test
```
Expected output:
```text
✔ Auth: 6-digit numeric OTP generation format
✔ Auth: SHA-256 OTP hashing and verification
✔ Auth: Password hashing with bcryptjs
✔ Cart: Exact integer paise monetary calculations
✔ Cart: Shipping charge applied when below free shipping threshold
✔ Razorpay: Cryptographic HMAC SHA256 payment signature verification
✔ Razorpay: Raw body webhook signature verification
ℹ pass 7, fail 0
```

---

## ⚡ 500 Concurrent Users Load Test

To verify that the application handles high concurrency and that simultaneous purchase attempts on the last available stock item do not result in overselling:
```bash
npm run load-test
```
This script tests:
1. High-throughput concurrent HTTP requests across catalog browsing, categories, and health endpoints.
2. Race condition test simulating 10 simultaneous orders attempting to reserve the last remaining item (`inventoryQuantity: 1`), verifying that exactly 1 order succeeds and 0 overselling occurs.

---

## 💳 Razorpay Payment Gateway Setup

### Test Mode Setup:
1. Log in to your [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Switch to **Test Mode** from the top header toggle.
3. Navigate to **Settings** → **API Keys** → **Generate Key**.
4. Copy your `Key ID` (starts with `rzp_test_...`) and `Key Secret`.
5. Update `server/.env`:
   ```env
   RAZORPAY_KEY_ID=rzp_test_your_real_key_id
   RAZORPAY_KEY_SECRET=your_real_test_secret
   ```

### Webhook Configuration:
1. In Razorpay Dashboard, go to **Settings** → **Webhooks** → **Add New Webhook**.
2. Webhook URL: `https://your-backend-domain.com/api/payments/webhook`
3. Secret: Enter a secure webhook secret and save it in `server/.env` as `RAZORPAY_WEBHOOK_SECRET`.
4. Active Events: Select `payment.captured` and `payment.failed`.

### Moving from Test to Live Payments:
1. Complete Razorpay KYC business verification.
2. Toggle the dashboard to **Live Mode**.
3. Generate Live API Keys (`rzp_live_...`).
4. Replace the test keys in your production environment settings (never in frontend code).

---

## 🌐 Production Deployment Guide

### Frontend Deployment (Vercel / Netlify):
1. Push your repository to GitHub.
2. In Vercel or Netlify, select your repository and choose the `client/` root directory.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Environment variable: `VITE_API_URL=https://your-backend-api-domain.com/api`

### Backend Deployment (Render / Railway / AWS):
1. In Render or Railway, choose the `server/` root directory.
2. Build command: `npm install`
3. Start command: `npm start`
4. Add your production environment variables (`MONGODB_URI`, `JWT_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `CLIENT_URL`).

---

## 📋 Owner Setup Checklist

- [ ] Confirm the official boutique WhatsApp number (`+91 97238 14909`).
- [ ] Create a MongoDB Atlas cluster and set `MONGODB_URI`.
- [ ] Run `npm run seed` to populate initial categories and styles.
- [ ] Run `npm run create-admin` to generate your initial administrator login.
- [ ] Test the checkout flow in Razorpay Test Mode.
- [ ] Complete business verification on Razorpay for live payments.
