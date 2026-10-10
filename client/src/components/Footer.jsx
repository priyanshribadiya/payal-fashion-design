import React from 'react';
import { Link } from 'react-router-dom';

export function Footer({ onOpenWhatsApp }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Brand Info & Uploaded Logo */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
              <img
                src="/assets/payal-logo.png"
                alt="Payal Fashion Design Logo"
                style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1.5px solid var(--gold)' }}
              />
              <div>
                <h4 style={{ color: '#FFFFFF', fontSize: '1.25rem', fontFamily: 'var(--font-serif)' }}>
                  Payal Fashion Design
                </h4>
                <span style={{ color: 'var(--gold)', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  Boutique & Atelier
                </span>
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.7', color: '#B3A49C', marginBottom: '1.25rem' }}>
              Handcrafted Indian ethnic couture, regal bridal lehengas, authentic Banarasi sarees, bespoke designer blouses, and precision custom stitching made for your most celebrated occasions.
            </p>
            <button
              type="button"
              className="btn btn-whatsapp btn-sm"
              onClick={() => onOpenWhatsApp('general')}
            >
              <span>Chat with Atelier on WhatsApp</span>
            </button>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '1.2rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem', fontSize: '0.9rem' }}>
              <li><Link to="/" style={{ color: '#D6CBC4' }}>Home</Link></li>
              <li><Link to="/shop" style={{ color: '#D6CBC4' }}>Shop All Ready-to-Wear</Link></li>
              <li><Link to="/collections" style={{ color: '#D6CBC4' }}>Signature Collections</Link></li>
              <li><Link to="/about" style={{ color: '#D6CBC4' }}>About Our Atelier</Link></li>
              <li><Link to="/contact" style={{ color: '#D6CBC4' }}>Contact & Location</Link></li>
              <li><Link to="/my-orders" style={{ color: '#D6CBC4' }}>Track My Order</Link></li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '1.2rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Customer Support
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem', fontSize: '0.9rem' }}>
              <li><Link to="/shipping-policy" style={{ color: '#D6CBC4' }}>Shipping & Delivery Policy</Link></li>
              <li><Link to="/privacy-policy" style={{ color: '#D6CBC4' }}>Privacy Policy</Link></li>
              <li><Link to="/terms" style={{ color: '#D6CBC4' }}>Terms & Conditions</Link></li>
              <li><span style={{ color: '#B3A49C' }}>Phone: +91 97238 14909</span></li>
              <li><span style={{ color: '#B3A49C' }}>Email: care@payalfashiondesign.com</span></li>
            </ul>
          </div>

          {/* Col 4: Boutique Operating Hours */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '1.2rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Atelier Hours
            </h4>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <p style={{ fontSize: '0.88rem', color: '#D6CBC4', marginBottom: '0.4rem' }}>
                <strong>Mon – Sat:</strong> 10:30 AM – 8:00 PM IST
              </p>
              <p style={{ fontSize: '0.88rem', color: '#D6CBC4', marginBottom: '0.6rem' }}>
                <strong>Sunday:</strong> By Prior Appointment
              </p>
              <span style={{ fontSize: '0.8rem', color: 'var(--gold)' }}>
                Personal trial fittings available by appointment.
              </span>
            </div>
          </div>
        </div>

        {/* Footer Bottom Notice */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Payal Fashion Design. All Rights Reserved.</p>
          <p>Handcrafted Indian Ethnic Fashion & Bespoke Tailoring</p>
        </div>
      </div>
    </footer>
  );
}
