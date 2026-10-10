// In development, Vite proxies /api → http://localhost:5000 (see vite.config.js).
// In production, set VITE_API_URL=https://your-backend-domain.com/api in client/.env
const API_BASE = import.meta.env.VITE_API_URL || '/api';


/**
 * Get or create unique guest session ID stored in browser
 */
export function getGuestSessionId() {
  let guestId = localStorage.getItem('guest_session_id');
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
    localStorage.setItem('guest_session_id', guestId);
  }
  return guestId;
}

/**
 * Standard fetch wrapper with auth token and error normalization
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'x-guest-session-id': getGuestSessionId(),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'Network request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  verifyOtp: (body) => request('/auth/verify-otp', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  resendOtp: (body) => request('/auth/resend-otp', { method: 'POST', body: JSON.stringify(body) }),
  forgotPassword: (body) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify(body) }),
  resetPassword: (body) => request('/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/auth/me'),

  // Products & Categories
  getProducts: (params = '') => request(`/products${params}`),
  getProductBySlug: (slug) => request(`/products/${slug}`),
  getCategories: () => request('/categories'),

  // Cart
  getCart: () => request('/cart'),
  addToCart: (body) => request('/cart/add', { method: 'POST', body: JSON.stringify(body) }),
  updateCartItem: (itemId, quantity) => request(`/cart/item/${itemId}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
  removeCartItem: (itemId) => request(`/cart/item/${itemId}`, { method: 'DELETE' }),
  mergeGuestCart: (guestSessionId) => request('/cart/merge', { method: 'POST', body: JSON.stringify({ guestSessionId }) }),

  // Orders & Checkout
  createOrder: (body) => request('/orders', { method: 'POST', body: JSON.stringify(body) }),
  getMyOrders: () => request('/orders'),
  getOrderById: (id) => request(`/orders/${id}`),
  cancelOrder: (id, reason) => request(`/orders/${id}/cancel`, { method: 'POST', body: JSON.stringify({ reason }) }),

  // Payments
  verifyPayment: (body) => request('/payments/verify', { method: 'POST', body: JSON.stringify(body) }),

  // Admin
  getAdminStats: () => request('/admin/stats'),
  getAdminOrders: (params = '') => request(`/admin/orders${params}`),
  updateOrderStatus: (id, body) => request(`/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify(body) }),
  getAuditLogs: () => request('/admin/audit-logs'),
  createProduct: (body) => request('/products', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id, body) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  createCategory: (body) => request('/categories', { method: 'POST', body: JSON.stringify(body) }),
};
