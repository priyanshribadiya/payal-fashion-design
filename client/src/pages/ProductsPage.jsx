import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';

export function ProductsPage({ onOpenWhatsApp }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.getCategories();
        if (res.success) setCategories(res.categories);
      } catch (err) {
        console.warn('Categories load error:', err.message);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category && category !== 'all') params.append('category', category);
        if (search.trim()) params.append('search', search.trim());
        if (sort) params.append('sort', sort);
        params.append('page', page);
        params.append('limit', 12);

        const res = await api.getProducts(`?${params.toString()}`);
        if (res.success) {
          setProducts(res.products);
          setPagination(res.pagination);
        }
      } catch (err) {
        console.warn('Product fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [category, sort, page, search]);

  const handleCategorySelect = (slug) => {
    setCategory(slug);
    setPage(1);
    setSearchParams(slug === 'all' ? {} : { category: slug });
  };

  return (
    <main className="section-padding">
      <div className="container">
        <div className="text-center" style={{ marginBottom: '2.5rem' }}>
          <span className="section-subtitle">BOUTIQUE COLLECTION</span>
          <h1 className="section-title">Ready-to-Wear Catalogue</h1>
          <div className="section-ornament">
            <span className="line"></span>
            <span className="diamond">◆</span>
            <span className="line"></span>
          </div>
          <p className="section-description">
            Discover exquisite handcrafted Indian attire. Order directly online with secure Razorpay checkout or enquire on WhatsApp.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ flex: '1', minWidth: '260px', maxWidth: '400px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search kurtis, sarees, lehengas..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Sort By:</label>
            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
            >
              <option value="featured">Featured Styles</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Alphabetical (A - Z)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="filter-bar">
          <button
            type="button"
            className={`filter-btn ${category === 'all' ? 'active' : ''}`}
            onClick={() => handleCategorySelect('all')}
          >
            All Items
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              type="button"
              className={`filter-btn ${category === c.slug ? 'active' : ''}`}
              onClick={() => handleCategorySelect(c.slug)}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ color: 'var(--text-muted)' }}>Loading handcrafted pieces...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', background: '#FFFFFF', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <h3>No products found</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Try searching with another keyword or resetting the category filter.
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ marginTop: '1rem' }}
              onClick={() => {
                setCategory('all');
                setSearch('');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} onOpenWhatsApp={onOpenWhatsApp} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '3rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <span style={{ display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Page {page} of {pagination.totalPages}
            </span>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
