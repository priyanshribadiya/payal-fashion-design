import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useNotification } from '../contexts/NotificationContext';

export function ProductDetailPage({ onOpenWhatsApp }) {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { error } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      try {
        const res = await api.getProductBySlug(slug);
        if (res.success && res.product) {
          setProduct(res.product);
          setSelectedImage(res.product.images[0] || '');
          if (res.product.sizes && res.product.sizes.length) {
            setSelectedSize(res.product.sizes[0]);
          }
          if (res.product.colors && res.product.colors.length) {
            setSelectedColor(res.product.colors[0]);
          }
        }
      } catch (err) {
        error(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [slug]);

  if (loading) {
    return (
      <main className="section-padding" style={{ textAlign: 'center' }}>
        <p>Loading handcrafted masterpiece...</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="section-padding" style={{ textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <p style={{ margin: '1rem 0' }}>The requested style is currently unavailable.</p>
        <Link to="/shop" className="btn btn-primary">
          Back to Catalogue
        </Link>
      </main>
    );
  }

  const handleAddToCart = async () => {
    const success = await addToCart(product._id, selectedSize, selectedColor, quantity);
    if (success) {
      // Optional: navigate to cart or stay
    }
  };

  const handleWhatsAppEnquiry = () => {
    const details = `${product.name} (Size: ${selectedSize || 'Standard'}${selectedColor ? `, Color: ${selectedColor}` : ''})`;
    if (onOpenWhatsApp) {
      onOpenWhatsApp('product', details);
    }
  };

  return (
    <main className="section-padding">
      <div className="container">
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '2rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)' }}>Home</Link> /{' '}
          <Link to="/shop" style={{ color: 'var(--text-secondary)' }}>Shop</Link> /{' '}
          <span style={{ color: 'var(--burgundy)', fontWeight: 600 }}>{product.name}</span>
        </nav>

        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '3.5rem', alignItems: 'start' }}>
          {/* Left: Image Gallery */}
          <div>
            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)', marginBottom: '1rem' }}>
              <img
                src={selectedImage}
                alt={product.name}
                style={{ width: '100%', height: '540px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80';
                }}
              />
            </div>

            {/* Thumbnail selector */}
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '10px' }}>
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(imgUrl)}
                    style={{
                      width: '76px',
                      height: '76px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      border: selectedImage === imgUrl ? '2px solid var(--burgundy)' : '1px solid var(--border-subtle)',
                      padding: 0,
                    }}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Purchase Actions */}
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--gold-dark)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
              {product.categoryName}
            </span>
            <h1 style={{ fontSize: '2.2rem', margin: '0.4rem 0 0.8rem', lineHeight: '1.25' }} className="font-serif">
              {product.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.2rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>SKU: {product.sku}</span>
              <span>•</span>
              <span style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: product.inventoryQuantity > 0 ? '#2E7D32' : '#C62828',
                backgroundColor: product.inventoryQuantity > 0 ? '#E8F5E9' : '#FFEBEE',
                padding: '3px 8px',
                borderRadius: '4px',
              }}>
                {product.inventoryQuantity > 0 ? `In Stock (${product.inventoryQuantity} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '1.5rem', padding: '1rem', background: '#FFFFFF', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--burgundy)' }}>
                {product.formattedDiscountedPrice || product.formattedPrice}
              </span>
              {product.formattedDiscountedPrice && (
                <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  {product.formattedPrice}
                </span>
              )}
              {product.isDemonstrationData && (
                <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--gold-dark)', fontWeight: 600 }}>
                  *Illustrative sample price
                </span>
              )}
            </div>

            {/* Description */}
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
              {product.description}
            </p>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Select Size: <strong style={{ color: 'var(--burgundy)' }}>{selectedSize}</strong>
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '4px',
                        border: selectedSize === sz ? '2px solid var(--burgundy)' : '1px solid var(--border-subtle)',
                        backgroundColor: selectedSize === sz ? 'var(--burgundy-light)' : '#FFFFFF',
                        color: selectedSize === sz ? 'var(--burgundy)' : 'var(--text-main)',
                        fontWeight: selectedSize === sz ? 700 : 500,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                      }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Available Colors: <strong style={{ color: 'var(--burgundy)' }}>{selectedColor}</strong>
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {product.colors.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setSelectedColor(col)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '4px',
                        border: selectedColor === col ? '2px solid var(--burgundy)' : '1px solid var(--border-subtle)',
                        backgroundColor: selectedColor === col ? 'var(--burgundy-light)' : '#FFFFFF',
                        color: selectedColor === col ? 'var(--burgundy)' : 'var(--text-main)',
                        fontSize: '0.85rem',
                      }}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 600 }}>Quantity:</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-subtle)', borderRadius: '4px', background: '#FFFFFF' }}>
                <button
                  type="button"
                  style={{ padding: '6px 12px', fontSize: '1rem' }}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  -
                </button>
                <span style={{ padding: '6px 16px', fontWeight: 600 }}>{quantity}</span>
                <button
                  type="button"
                  style={{ padding: '6px 12px', fontSize: '1rem' }}
                  onClick={() => setQuantity((q) => Math.min(product.inventoryQuantity, q + 1))}
                  disabled={quantity >= product.inventoryQuantity}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2rem' }}>
              <button
                type="button"
                className="btn btn-primary btn-lg w-full"
                onClick={handleAddToCart}
                disabled={product.inventoryQuantity === 0}
              >
                <span>{product.inventoryQuantity > 0 ? 'Add to Shopping Cart' : 'Out of Stock'}</span>
              </button>

              <button
                type="button"
                className="btn btn-whatsapp btn-lg w-full"
                onClick={handleWhatsAppEnquiry}
              >
                <span>Enquire via WhatsApp ({product.name})</span>
              </button>
            </div>

            {/* Trust Policies */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <div>📦 <strong>Pan-India Shipping:</strong> Dispatched in 3–5 working days. Free delivery over ₹1,999.</div>
              <div>✂ <strong>Custom Alterations:</strong> Mention your bust, waist, and length measurements for custom fitting.</div>
              <div>🔒 <strong>Secure Transactions:</strong> 100% verified Razorpay test & production payment gateway.</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
