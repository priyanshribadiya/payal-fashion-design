import React from 'react';
import { Link } from 'react-router-dom';

export function AboutPage({ onOpenWhatsApp }) {
  return (
    <main className="section-padding">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="text-center" style={{ marginBottom: '3rem' }}>
          <span className="section-subtitle">OUR STORY & HERITAGE</span>
          <h1 className="section-title">Artisanal Craft & Individual Style</h1>
          <div className="section-ornament">
            <span className="line"></span>
            <span className="diamond">◆</span>
            <span className="line"></span>
          </div>
        </div>

        <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"
            alt="Payal Fashion Design Craftsmanship"
            style={{ width: '100%', height: '420px', objectFit: 'cover' }}
          />
        </div>

        <div style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p>
            At <strong>Payal Fashion Design</strong>, we believe every piece of clothing should tell a story of grace, individuality, and confidence.
          </p>
          <p>
            Born from a genuine passion for Indian ethnic textiles, flattering silhouettes, and meticulous stitching, our boutique atelier serves women who appreciate timeless craftsmanship. Whether creating a customized wedding lehenga, designing a blouse that elevates a family heirloom saree, or tailoring everyday kurtis with immaculate finishes, our approach is centered around you.
          </p>
          <p>
            Every seam, dart, and embroidery embellishment is thoughtfully placed to honor your posture, personal comfort, and celebration aesthetic.
          </p>
        </div>

        <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/shop" className="btn btn-primary">
            Explore Collections
          </Link>
          <button type="button" className="btn btn-whatsapp" onClick={() => onOpenWhatsApp('general')}>
            Chat with Atelier
          </button>
        </div>
      </div>
    </main>
  );
}

export function ContactPage({ onOpenWhatsApp }) {
  return (
    <main className="section-padding">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="text-center" style={{ marginBottom: '3rem' }}>
          <span className="section-subtitle">GET IN TOUCH</span>
          <h1 className="section-title">Contact Our Boutique Atelier</h1>
          <div className="section-ornament">
            <span className="line"></span>
            <span className="diamond">◆</span>
            <span className="line"></span>
          </div>
          <p className="section-description">
            Have questions about a design, custom stitching, or fabric options? Message us on WhatsApp or visit our boutique.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-gold)', textAlign: 'center' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>💬</span>
            <h3 className="font-serif">WhatsApp Consultation</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0.5rem 0 1.25rem' }}>
              Direct line for price quotes, measurements, and personalized recommendations.
            </p>
            <button type="button" className="btn btn-whatsapp w-full" onClick={() => onOpenWhatsApp('general')}>
              Start WhatsApp Chat
            </button>
            <div style={{ marginTop: '0.75rem', fontWeight: 700, color: 'var(--burgundy)', fontSize: '0.85rem' }}>
              Phone: +91 97238 14909
            </div>
          </div>

          <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>📍</span>
            <h3 className="font-serif">Boutique Location & Hours</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0.5rem 0 0.8rem' }}>
              Main Market Area, City & State, India
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <strong>Mon – Sat:</strong> 10:30 AM – 8:00 PM IST<br />
              <strong>Sunday:</strong> By Prior Appointment
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
