import React from 'react';

export function PrivacyPolicyPage() {
  return (
    <main className="section-padding">
      <div className="container" style={{ maxWidth: '800px', background: '#FFFFFF', padding: '3rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
        <h1 className="font-serif" style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--burgundy)' }}>Privacy Policy</h1>
        <div style={{ lineHeight: '1.8', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' }}>
          <p>At Payal Fashion Design, your privacy is paramount. This policy describes how we collect, use, and protect your information when you register, browse, or purchase through our online boutique.</p>
          <h3 style={{ color: 'var(--text-main)', marginTop: '0.5rem' }}>1. Information We Collect</h3>
          <p>We collect your name, email address, mobile phone number, delivery addresses, and order history strictly to fulfill your purchases and communicate regarding custom fittings.</p>
          <h3 style={{ color: 'var(--text-main)', marginTop: '0.5rem' }}>2. Payment Security</h3>
          <p>We do not store or process debit/credit card details, UPI PINs, or net banking passwords on our servers. All transactions are securely handled by Razorpay through encrypted server-side verification.</p>
          <h3 style={{ color: 'var(--text-main)', marginTop: '0.5rem' }}>3. Contact & Inquiries</h3>
          <p>If you have any questions regarding your data or wish to delete your customer profile, please reach out to us at <strong>care@payalfashiondesign.com</strong>.</p>
        </div>
      </div>
    </main>
  );
}

export function TermsConditionsPage() {
  return (
    <main className="section-padding">
      <div className="container" style={{ maxWidth: '800px', background: '#FFFFFF', padding: '3rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
        <h1 className="font-serif" style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--burgundy)' }}>Terms & Conditions</h1>
        <div style={{ lineHeight: '1.8', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' }}>
          <p>Welcome to Payal Fashion Design. By accessing this store and placing orders, you agree to comply with and be bound by the following terms.</p>
          <h3 style={{ color: 'var(--text-main)', marginTop: '0.5rem' }}>1. Custom Fitting & Bespoke Orders</h3>
          <p>Custom-stitched garments, tailored blouses, and custom bridal lehengas are individually crafted based on the specific measurements and fabric choices agreed upon. Please ensure accurate measurements are provided during consultation.</p>
          <h3 style={{ color: 'var(--text-main)', marginTop: '0.5rem' }}>2. Pricing & Demonstration Items</h3>
          <p>All prices listed on this website are authoritative in Indian Rupees (INR). Sample demonstration items are marked accordingly until final catalogue verification.</p>
        </div>
      </div>
    </main>
  );
}

export function ShippingReturnsPage() {
  return (
    <main className="section-padding">
      <div className="container" style={{ maxWidth: '800px', background: '#FFFFFF', padding: '3rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
        <h1 className="font-serif" style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--burgundy)' }}>Shipping & Returns Policy</h1>
        <div style={{ lineHeight: '1.8', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' }}>
          <h3 style={{ color: 'var(--text-main)' }}>1. Shipping & Delivery</h3>
          <p>We provide pan-India delivery across all serviceable PIN codes. Orders are typically processed and dispatched within 3–5 business days for ready-to-wear garments, and 10–14 business days for custom stitching.</p>
          <p><strong>Free Shipping:</strong> Applicable on all prepaid orders exceeding ₹1,999. For orders below this threshold, a flat delivery fee of ₹150 applies.</p>
          <h3 style={{ color: 'var(--text-main)', marginTop: '0.5rem' }}>2. Returns & Alterations</h3>
          <p>For ready-made items, returns or size exchanges are accepted within 7 days of delivery in their original unworn condition with tags intact. For bespoke custom-stitched orders, we offer complimentary fitting adjustments and alterations at our atelier.</p>
        </div>
      </div>
    </main>
  );
}
