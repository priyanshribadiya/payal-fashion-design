import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';

export function HomePage({ onOpenWhatsApp, onOpenCustomModal }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.getCategories(),
          api.getProducts('?limit=8'),
        ]);
        if (catRes.success) setCategories(catRes.categories);
        if (prodRes.success) setProducts(prodRes.products);
      } catch (err) {
        console.warn('Data load error:', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleFilterClick = async (categorySlug) => {
    setActiveFilter(categorySlug);
    try {
      setLoading(true);
      const query = categorySlug === 'all' ? '?limit=8' : `?category=${categorySlug}&limit=8`;
      const res = await api.getProducts(query);
      if (res.success) setProducts(res.products);
    } catch (err) {
      console.warn('Filter error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div>
            <div className="hero-eyebrow">
              <span>✦</span>
              <span>DESIGNED WITH ELEGANCE</span>
              <span>✦</span>
            </div>
            <h1 className="hero-title font-serif">
              Your Style, <span className="highlight">Your Story</span>
            </h1>
            <p className="hero-desc">
              Discover beautiful ready-made styles and personalised designs crafted around you. From royal wedding lehengas and hand-finished sarees to bespoke designer blouses and everyday chic kurtis.
            </p>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-primary btn-lg">
                <span>Explore Collection</span>
                <span>→</span>
              </Link>
              <button
                type="button"
                className="btn btn-secondary btn-lg"
                onClick={onOpenCustomModal}
              >
                <span>Design Your Outfit</span>
                <span>✨</span>
              </button>
            </div>
            <div className="hero-features">
              <div className="hero-feature-item">
                <span className="hero-feature-bullet">◆</span>
                <span>Custom Tailored Fit</span>
              </div>
              <div className="hero-feature-item">
                <span className="hero-feature-bullet">◆</span>
                <span>Finest Ethnic Fabrics</span>
              </div>
              <div className="hero-feature-item">
                <span className="hero-feature-bullet">◆</span>
                <span>Intricate Hand Embroidery</span>
              </div>
            </div>
          </div>

          <div className="hero-image-card">
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"
              alt="Payal Fashion Design Ethnic Model"
              className="hero-image"
            />
            <div className="hero-badge-float">
              <strong style={{ display: 'block', color: 'var(--burgundy)', fontSize: '0.95rem' }}>
                ✂ Custom Stitching
              </strong>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Made to your measurements
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Signature Collections Section */}
      <section className="section-padding" id="collections">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <span className="section-subtitle">CURATED ETHNIC WARDROBE</span>
            <h2 className="section-title">Our Signature Collections</h2>
            <div className="section-ornament">
              <span className="line"></span>
              <span className="diamond">◆</span>
              <span className="line"></span>
            </div>
            <p className="section-description">
              Explore our handcrafted categories created with timeless silhouettes, rich textures, and contemporary detailing.
            </p>
          </div>

          <div className="products-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
            {categories.map((cat) => (
              <article key={cat._id} className="product-card">
                <div className="product-img-box" style={{ height: '300px' }}>
                  {cat.tag && <span className="product-category-tag">{cat.tag}</span>}
                  <img src={cat.image} alt={cat.name} className="product-img" loading="lazy" />
                </div>
                <div className="product-details">
                  <h3 className="product-title font-serif">{cat.name}</h3>
                  <p className="product-blurb">{cat.description}</p>
                  <Link
                    to={`/shop?category=${cat.slug}`}
                    className="btn btn-secondary btn-sm"
                    style={{ alignSelf: 'flex-start', marginTop: 'auto' }}
                  >
                    <span>Explore Designs</span>
                    <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Ready to Wear Showcase */}
      <section className="section-padding bg-ivory" id="ready-to-wear">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '2.5rem' }}>
            <span className="section-subtitle">READY TO WEAR STYLES</span>
            <h2 className="section-title">Featured Showcase</h2>
            <div className="section-ornament">
              <span className="line"></span>
              <span className="diamond">◆</span>
              <span className="line"></span>
            </div>
            <p className="section-description">
              Order directly online with fast pan-India delivery, or chat with our styling team on WhatsApp.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="filter-bar">
            <button
              type="button"
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterClick('all')}
            >
              All Designs
            </button>
            {categories.map((c) => (
              <button
                key={c._id}
                type="button"
                className={`filter-btn ${activeFilter === c.slug ? 'active' : ''}`}
                onClick={() => handleFilterClick(c.slug)}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onOpenWhatsApp={onOpenWhatsApp}
              />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/shop" className="btn btn-primary btn-lg">
              <span>View Full Catalogue ({products.length > 0 ? '8+' : '0'} Products)</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Bespoke Custom Stitching Atelier */}
      <section className="section-padding" id="custom-design">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '3.5rem', alignItems: 'center' }}>
            <div>
              <span className="section-subtitle">BESPOKE ATELIER</span>
              <h2 className="section-title">Custom Design & Precision Stitching</h2>
              <div className="section-ornament" style={{ justifyContent: 'flex-start' }}>
                <span className="line"></span>
                <span className="diamond">◆</span>
                <span className="line"></span>
              </div>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.7' }}>
                Have a dream design saved on Pinterest or Instagram? Or looking for an impeccable custom fit for your festive occasion? We provide personalized pattern making, tailoring, and embroidery services crafted around your unique measurements.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.25rem', color: 'var(--gold)' }}>✂</span>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '0.2rem' }}>Personalised Outfit Design</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Custom bridal lehengas, reception gowns, and festive coordination styled to your vision.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.25rem', color: 'var(--gold)' }}>🧵</span>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '0.2rem' }}>Stitching & Custom Fitting</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Flawless stitching for suits, anarkalis, and kurtis with customized necklines, armholes, and flares.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.25rem', color: 'var(--gold)' }}>🪡</span>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '0.2rem' }}>Blouse Design & Aari Embroidery</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Intricate back neck patterns, Maggam and Aari beadwork, piping, padded cups, and tie-dori styling.</p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button type="button" className="btn btn-primary" onClick={onOpenCustomModal}>
                  <span>Request a Custom Design</span>
                  <span>✨</span>
                </button>
                <button type="button" className="btn btn-whatsapp" onClick={() => onOpenWhatsApp('general')}>
                  <span>Chat on WhatsApp</span>
                </button>
              </div>
            </div>

            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
              <img
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80"
                alt="Custom Atelier Stitching"
                style={{ width: '100%', height: '480px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. How Ordering Works */}
      <section className="section-padding bg-ivory">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <span className="section-subtitle">SIMPLE & PERSONALIZED</span>
            <h2 className="section-title">How Ordering Works</h2>
            <div className="section-ornament">
              <span className="line"></span>
              <span className="diamond">◆</span>
              <span className="line"></span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '1.75rem', fontFamily: 'var(--font-serif)', color: 'var(--gold)', marginBottom: '0.5rem' }}>01</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Explore or Design</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Browse our curated ready-to-wear pieces online or submit your custom design photos from Pinterest.
              </p>
            </div>
            <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '1.75rem', fontFamily: 'var(--font-serif)', color: 'var(--gold)', marginBottom: '0.5rem' }}>02</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Cart Checkout or WhatsApp</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Order ready-made items directly with Razorpay payments, or discuss measurements and bespoke fabric on WhatsApp.
              </p>
            </div>
            <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '1.75rem', fontFamily: 'var(--font-serif)', color: 'var(--gold)', marginBottom: '0.5rem' }}>03</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Delivery to Your Door</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Receive handcrafted attire tailored to perfection, dispatched with end-to-end tracking updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Contact Cards Section */}
      <section className="section-padding" id="contact">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <span className="section-subtitle">WE'D LOVE TO HEAR FROM YOU</span>
            <h2 className="section-title">Get In Touch</h2>
            <div className="section-ornament">
              <span className="line"></span>
              <span className="diamond">◆</span>
              <span className="line"></span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: 'var(--bg-card)', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-gold)', textAlign: 'center' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>💬</span>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>WhatsApp Chat</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Direct line for price quotes, fitting appointments, and custom tailoring questions.
              </p>
              <button type="button" className="btn btn-whatsapp btn-sm w-full" onClick={() => onOpenWhatsApp('general')}>
                <span>Start WhatsApp Chat</span>
              </button>
              <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: 'var(--burgundy)', fontWeight: 700 }}>
                Phone: +91 97238 14909
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>📸</span>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Instagram</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Follow our latest design drops, real client styling, behind the scenes, and reels.
              </p>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm w-full">
                <span>Visit Instagram</span>
              </a>
              <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Handle: @payalfashiondesign
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>📍</span>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Boutique Atelier</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Visit us for physical fabric selections, trial fittings, and personal consultations.
              </p>
              <div style={{ padding: '0.6rem', background: 'var(--bg-subtle)', borderRadius: '4px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Appointments recommended for custom bridal styling
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🕒</span>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Operating Hours</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>
                <strong>Mon – Sat:</strong> 10:30 AM – 8:00 PM IST
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                <strong>Sunday:</strong> By Prior Appointment
              </p>
              <div style={{ fontSize: '0.82rem', color: 'var(--gold-dark)', fontWeight: 600 }}>
                WhatsApp replies usually within a few hours
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
