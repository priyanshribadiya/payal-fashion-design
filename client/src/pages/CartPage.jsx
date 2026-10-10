import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export function CartPage() {
  const { cart, items, updateQuantity, removeItem, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    }
  };

  if (loading && items.length === 0) {
    return (
      <main className="section-padding" style={{ textAlign: 'center' }}>
        <p>Loading your shopping cart...</p>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="section-padding" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🛍️</span>
          <h2 className="font-serif">Your Shopping Cart is Empty</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 2rem' }}>
            Explore our curated Indian ethnic collections and add your favorite kurtis, sarees, or lehengas.
          </p>
          <Link to="/shop" className="btn btn-primary btn-lg">
            <span>Explore Collections</span>
            <span>→</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="section-padding">
      <div className="container">
        <h1 className="font-serif" style={{ fontSize: '2.2rem', marginBottom: '2rem' }}>
          Shopping Cart ({cart.itemCount} items)
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem', alignItems: 'start' }}>
          {/* Left: Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {items.map((item) => (
              <div
                key={item._id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '100px 1fr auto',
                  gap: '1.5rem',
                  padding: '1.25rem',
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  alignItems: 'center',
                }}
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  style={{ width: '100px', height: '120px', objectFit: 'cover', borderRadius: '6px' }}
                />

                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>
                    <Link to={`/products/${item.product.slug}`}>{item.product.name}</Link>
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    <span>Size: <strong>{item.size}</strong></span>
                    {item.color && <span> • Color: <strong>{item.color}</strong></span>}
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--burgundy)' }}>
                    ₹{item.unitPriceINR.toLocaleString('en-IN')} each
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}>
                    <button
                      type="button"
                      style={{ padding: '4px 10px' }}
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span style={{ padding: '4px 12px', fontWeight: 600 }}>{item.quantity}</span>
                    <button
                      type="button"
                      style={{ padding: '4px 10px' }}
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.availableStock}
                    >
                      +
                    </button>
                  </div>

                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                    ₹{item.itemTotalINR.toLocaleString('en-IN')}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeItem(item._id)}
                    style={{ fontSize: '0.8rem', color: '#C62828', textDecoration: 'underline' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Order Summary */}
          <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 className="font-serif" style={{ fontSize: '1.35rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              Order Summary
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.95rem' }}>
              <span>Items Subtotal:</span>
              <span>₹{cart.subtotalINR.toLocaleString('en-IN')}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.95rem' }}>
              <span>Estimated Shipping:</span>
              <span style={{ color: cart.shippingINR === 0 ? '#2E7D32' : 'inherit', fontWeight: cart.shippingINR === 0 ? 600 : 400 }}>
                {cart.shippingINR === 0 ? 'FREE' : `₹${cart.shippingINR.toLocaleString('en-IN')}`}
              </span>
            </div>

            {cart.shippingINR > 0 && (
              <p style={{ fontSize: '0.8rem', color: 'var(--gold-dark)', marginBottom: '1rem', background: 'var(--gold-light)', padding: '6px 10px', borderRadius: '4px' }}>
                Add ₹{(1999 - cart.subtotalINR).toLocaleString('en-IN')} more to qualify for <strong>FREE Delivery</strong> across India!
              </p>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1.5rem 0', paddingTop: '1rem', borderTop: '2px dashed var(--border-subtle)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--burgundy)' }}>
              <span>Total Payable:</span>
              <span>₹{cart.totalINR.toLocaleString('en-IN')}</span>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-lg w-full"
              onClick={handleCheckoutClick}
            >
              <span>{isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}</span>
              <span>→</span>
            </button>

            <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
              <Link to="/shop" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', textDecoration: 'underline' }}>
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
