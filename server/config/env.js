import dotenv from 'dotenv';
dotenv.config();

/**
 * Validates and exposes environment variables with safe defaults.
 */
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/payal_fashion_design',

  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_fallback_do_not_use_in_prod',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_fallback',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  INITIAL_ADMIN_EMAIL: process.env.INITIAL_ADMIN_EMAIL || 'admin@payalfashiondesign.com',
  INITIAL_ADMIN_PHONE: process.env.INITIAL_ADMIN_PHONE || '+919723814909',
  INITIAL_ADMIN_NAME: process.env.INITIAL_ADMIN_NAME || 'Payal Fashion Admin',
  INITIAL_ADMIN_PASSWORD: process.env.INITIAL_ADMIN_PASSWORD || 'AdminPass123!',

  STORE_WHATSAPP_NUMBER: process.env.STORE_WHATSAPP_NUMBER || '919723814909',
  STORE_BRAND_NAME: process.env.STORE_BRAND_NAME || 'Payal Fashion Design',

  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || 'placeholder_webhook_secret',

  OTP_SANDBOX_MODE: process.env.OTP_SANDBOX_MODE !== 'false',
  OTP_EXPIRY_MINUTES: parseInt(process.env.OTP_EXPIRY_MINUTES, 10) || 10,
};

// Validate critical secrets in production
if (ENV.NODE_ENV === 'production') {
  if (ENV.JWT_SECRET.includes('fallback') || ENV.JWT_SECRET.length < 32) {
    throw new Error('FATAL: JWT_SECRET must be at least 32 characters long in production');
  }
}
