import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export function CollectionsPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getCategories();
        if (res.success) setCategories(res.categories);
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main className="section-padding">
      <div className="container">
        <div className="text-center" style={{ marginBottom: '3rem' }}>
          <span className="section-subtitle">CURATED ETHNIC ATELIER</span>
          <h1 className="section-title">Our Signature Collections</h1>
          <div className="section-ornament">
            <span className="line"></span>
            <span className="diamond">◆</span>
            <span className="line"></span>
          </div>
          <p className="section-description">
            Explore hand-finished ethnic silhouettes, heritage silks, grand bridal flares, and everyday chic kurtis.
          </p>
        </div>

        <div className="products-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {categories.map((c) => (
            <article key={c._id} className="product-card">
              <div className="product-img-box" style={{ height: '320px' }}>
                {c.tag && <span className="product-category-tag">{c.tag}</span>}
                <img src={c.image} alt={c.name} className="product-img" loading="lazy" />
              </div>
              <div className="product-details">
                <h3 className="product-title font-serif">{c.name}</h3>
                <p className="product-blurb">{c.description}</p>
                <Link
                  to={`/shop?category=${c.slug}`}
                  className="btn btn-primary btn-sm"
                  style={{ alignSelf: 'flex-start', marginTop: 'auto' }}
                >
                  <span>View All {c.name}</span>
                  <span>→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
