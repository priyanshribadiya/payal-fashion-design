import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export function Navbar({ onOpenWhatsApp, onOpenCustomModal }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="site-header">
      {/* Top Announcement Bar */}
      <div className="announcement-bar">
        <span>✦ Bespoke Tailoring & Designer Ethnic Wear • Free shipping across India on orders above ₹1,999 ✦</span>
      </div>

      <div className="container header-container">
        {/* Brand Logo with Uploaded Logo Asset */}
        <Link to="/" className="brand-logo-wrap" aria-label="Payal Fashion Design Home">
          <img
            src="/assets/payal-logo.png"
            alt="Payal Fashion Design Logo"
            className="brand-logo-img"
          />
          <div className="brand-logo-text">
            <span className="brand-title">Payal</span>
            <span className="brand-tagline">Fashion Design</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
            Home
          </NavLink>
          <NavLink to="/shop" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Shop All
          </NavLink>
          <NavLink to="/collections" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Collections
          </NavLink>
          <button
            type="button"
            className="nav-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={onOpenCustomModal}
          >
            Custom Stitching
          </button>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            About
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Contact
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ color: 'var(--burgundy)', fontWeight: 700 }}>
              Admin Portal
            </NavLink>
          )}
        </nav>

        {/* Action Buttons: Cart, User Account, WhatsApp */}
        <div className="header-actions">
          {/* Cart Icon */}
          <Link to="/cart" className="cart-icon-btn" aria-label="Shopping Cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>

          {/* User Account / Login */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/my-orders" className="btn btn-secondary btn-sm" style={{ padding: '0.4rem 0.8rem' }}>
                My Orders
              </Link>
              <button
                type="button"
                onClick={logout}
                className="btn btn-outline btn-sm"
                style={{ padding: '0.4rem 0.8rem' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
          )}

          {/* WhatsApp CTA */}
          <button
            type="button"
            className="btn btn-whatsapp btn-sm"
            onClick={() => onOpenWhatsApp('general')}
            title="Chat directly on WhatsApp"
          >
            <span>WhatsApp</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="mobile-toggle-btn"
            style={{ display: 'none', padding: '6px' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
