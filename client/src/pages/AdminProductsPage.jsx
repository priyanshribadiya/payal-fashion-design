import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';

export function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priceINR, setPriceINR] = useState('');
  const [discountedPriceINR, setDiscountedPriceINR] = useState('');
  const [sku, setSku] = useState('');
  const [inventoryQuantity, setInventoryQuantity] = useState(20);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const { success, error } = useNotification();

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.getProducts('?limit=50'),
        api.getCategories(),
      ]);
      if (prodRes.success) setProducts(prodRes.products);
      if (catRes.success) {
        setCategories(catRes.categories);
        if (catRes.categories.length) setCategoryId(catRes.categories[0]._id);
      }
    } catch (err) {
      error(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createProduct({
        name,
        categoryId,
        priceINR: Number(priceINR),
        discountedPriceINR: discountedPriceINR ? Number(discountedPriceINR) : null,
        sku: sku.trim().toUpperCase(),
        inventoryQuantity: Number(inventoryQuantity),
        description,
        images: [imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80'],
      });

      if (res.success) {
        success('New product created successfully!');
        setShowAddModal(false);
        setName('');
        setPriceINR('');
        setSku('');
        setDescription('');
        setImageUrl('');
        loadData();
      }
    } catch (err) {
      error(err.message || 'Could not create product');
    }
  };

  const handleStockUpdate = async (productId, newQty) => {
    try {
      const res = await api.updateProduct(productId, { inventoryQuantity: Number(newQty) });
      if (res.success) {
        success('Stock updated');
        setProducts(prev => prev.map(p => p._id === productId ? { ...p, inventoryQuantity: Number(newQty) } : p));
      }
    } catch (err) {
      error(err.message || 'Stock update failed');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to archive this product?')) return;
    try {
      const res = await api.deleteProduct(productId);
      if (res.success) {
        success('Product archived');
        setProducts(prev => prev.filter(p => p._id !== productId));
      }
    } catch (err) {
      error(err.message || 'Archive failed');
    }
  };

  return (
    <main className="section-padding">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <Link to="/admin" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>← Back to Dashboard</Link>
            <h1 className="font-serif" style={{ fontSize: '2rem', marginTop: '0.4rem' }}>
              Product Catalogue & Inventory Control
            </h1>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <span>+ Add New Product</span>
          </button>
        </div>

        {/* Products Table */}
        <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflowX: 'auto', boxShadow: 'var(--shadow-sm)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-ivory)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '1rem' }}>Product</th>
                <th style={{ padding: '1rem' }}>Category</th>
                <th style={{ padding: '1rem' }}>SKU</th>
                <th style={{ padding: '1rem' }}>Price</th>
                <th style={{ padding: '1rem' }}>Stock Quantity</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={p.images && p.images[0] ? p.images[0] : ''}
                      alt={p.name}
                      style={{ width: '45px', height: '55px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <div>
                      <strong>{p.name}</strong>
                      {p.isDemonstrationData && (
                        <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--gold-dark)' }}>Sample Demo</span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>{p.categoryName}</td>
                  <td style={{ padding: '1rem' }}><code>{p.sku}</code></td>
                  <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--burgundy)' }}>
                    {p.formattedPrice}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <input
                      type="number"
                      className="form-input"
                      style={{ width: '80px', padding: '4px 8px' }}
                      defaultValue={p.inventoryQuantity}
                      onBlur={(e) => handleStockUpdate(p._id, e.target.value)}
                    />
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button
                      type="button"
                      style={{ color: '#C62828', cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={() => handleDeleteProduct(p._id)}
                    >
                      Archive
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
              <div className="modal-header">
                <h3>Add New Boutique Product</h3>
                <button type="button" onClick={() => setShowAddModal(false)}>&times;</button>
              </div>

              <form onSubmit={handleCreateProduct}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Product Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Royal Organza Mirror Work Saree"
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Category *</label>
                      <select
                        className="form-select"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                      >
                        {categories.map((c) => (
                          <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">SKU *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        placeholder="PFD-SAR-009"
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Price in INR (₹) *</label>
                      <input
                        type="number"
                        className="form-input"
                        value={priceINR}
                        onChange={(e) => setPriceINR(e.target.value)}
                        placeholder="3500"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Discounted (₹)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={discountedPriceINR}
                        onChange={(e) => setDiscountedPriceINR(e.target.value)}
                        placeholder="2999"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Stock Quantity *</label>
                      <input
                        type="number"
                        className="form-input"
                        value={inventoryQuantity}
                        onChange={(e) => setInventoryQuantity(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Primary Image URL</label>
                    <input
                      type="url"
                      className="form-input"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Product Description</label>
                    <textarea
                      className="form-textarea"
                      rows="3"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Detail fabrics, threadwork, styling notes..."
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
