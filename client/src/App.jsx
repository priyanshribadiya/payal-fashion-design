import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppModal } from './components/WhatsAppModal';
import { CustomDesignModal } from './components/CustomDesignModal';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { AboutPage, ContactPage } from './pages/AboutPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OtpVerificationPage } from './pages/OtpVerificationPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { PaymentResultPage } from './pages/PaymentResultPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminProductsPage } from './pages/AdminProductsPage';
import { AdminOrdersPage } from './pages/AdminOrdersPage';
import { PrivacyPolicyPage, TermsConditionsPage, ShippingReturnsPage } from './pages/PolicyPages';

export default function App() {
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [whatsAppModalData, setWhatsAppModalData] = useState({ type: 'general', productName: '' });
  const [customModalOpen, setCustomModalOpen] = useState(false);

  const handleOpenWhatsApp = (type = 'general', productName = '') => {
    setWhatsAppModalData({ type, productName });
    setWhatsAppModalOpen(true);
  };

  const handleOpenCustomModal = () => {
    setCustomModalOpen(true);
  };

  return (
    <NotificationProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Navbar
              onOpenWhatsApp={handleOpenWhatsApp}
              onOpenCustomModal={handleOpenCustomModal}
            />

            <div style={{ flex: 1 }}>
              <Routes>
                {/* Public Storefront */}
                <Route
                  path="/"
                  element={
                    <HomePage
                      onOpenWhatsApp={handleOpenWhatsApp}
                      onOpenCustomModal={handleOpenCustomModal}
                    />
                  }
                />
                <Route
                  path="/shop"
                  element={<ProductsPage onOpenWhatsApp={handleOpenWhatsApp} />}
                />
                <Route
                  path="/products/:slug"
                  element={<ProductDetailPage onOpenWhatsApp={handleOpenWhatsApp} />}
                />
                <Route path="/collections" element={<CollectionsPage />} />
                <Route
                  path="/about"
                  element={<AboutPage onOpenWhatsApp={handleOpenWhatsApp} />}
                />
                <Route
                  path="/contact"
                  element={<ContactPage onOpenWhatsApp={handleOpenWhatsApp} />}
                />

                {/* Cart & Checkout */}
                <Route path="/cart" element={<CartPage />} />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payment-result"
                  element={<PaymentResultPage onOpenWhatsApp={handleOpenWhatsApp} />}
                />

                {/* Authentication & OTP */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-otp" element={<OtpVerificationPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                {/* Customer Account & Orders */}
                <Route
                  path="/my-orders"
                  element={
                    <ProtectedRoute>
                      <OrdersPage onOpenWhatsApp={handleOpenWhatsApp} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-orders/:id"
                  element={
                    <ProtectedRoute>
                      <OrderDetailPage onOpenWhatsApp={handleOpenWhatsApp} />
                    </ProtectedRoute>
                  }
                />

                {/* Administrator Console */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboardPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <AdminRoute>
                      <AdminProductsPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <AdminRoute>
                      <AdminOrdersPage />
                    </AdminRoute>
                  }
                />

                {/* Policies */}
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsConditionsPage />} />
                <Route path="/shipping-policy" element={<ShippingReturnsPage />} />
              </Routes>
            </div>

            <Footer onOpenWhatsApp={handleOpenWhatsApp} />

            {/* Modals */}
            <WhatsAppModal
              isOpen={whatsAppModalOpen}
              onClose={() => setWhatsAppModalOpen(false)}
              initialType={whatsAppModalData.type}
              productName={whatsAppModalData.productName}
            />

            <CustomDesignModal
              isOpen={customModalOpen}
              onClose={() => setCustomModalOpen(false)}
            />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}
