import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export function OrdersPage({ onOpenWhatsApp }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await api.getMyOrders();
        if (res.success) setOrders(res.orders);
      } catch (err) {
        console.warn('Orders fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
      case 'processing':
        return { bg: '#E3F2FD', text: '#1565C0' };
      case 'shipped':
        return { bg: '#FFF8E1', text: '#F57F17' };
      case 'delivered':
        return { bg: '#E8F5E9', text: '#2E7D32' };
      case 'cancelled':
        return { bg: '#FFEBEE', text: '#C62828' };
      default:
        return { bg: '#F5F5F5', text: '#616161' };
    }
  };

  return (
    <main className="section-padding">
      <div className="container" style={{ maxWidth: '900px' }}>
        <h1 className="font-serif" style={{ fontSize: '2.2rem', marginBottom: '2rem' }}>
          My Orders & History
        </h1>

        {loading ? (
          <p>Loading your past orders...</p>
        ) : orders.length === 0 ? (
          <div style={{ background: '#FFFFFF', padding: '3rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>📦</span>
            <h3 className="font-serif">No Orders Found</h3>
            <p style={{ color: 'var(--text-secondary)', margin: '0.8rem 0 1.5rem' }}>
              You haven't placed any orders with Payal Fashion Design yet.
            </p>
            <Link to="/shop" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.map((order) => {
              const statusStyle = getStatusColor(order.status);
              return (
                <div
                  key={order._id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    padding: '1.75rem',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Order Placed: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <h3 style={{ fontSize: '1.15rem', color: 'var(--burgundy)', margin: '0.2rem 0 0' }}>
                        {order.orderNumber}
                      </h3>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span
                        style={{
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.text,
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                        }}
                      >
                        {order.status.replace('_', ' ')}
                      </span>
                      <strong style={{ fontSize: '1.2rem' }}>₹{order.totalAmountINR.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'var(--bg-cream)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.88rem' }}>
                        {item.image && (
                          <img src={item.image} alt={item.name} style={{ width: '40px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
                        )}
                        <div>
                          <div><strong>{item.name}</strong> × {item.quantity}</div>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Size: {item.size}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Shipping to: <strong>{order.shippingAddress?.recipientName}</strong>, {order.shippingAddress?.city}
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Link to={`/my-orders/${order._id}`} className="btn btn-secondary btn-sm">
                        View Order Details
                      </Link>
                      <button
                        type="button"
                        className="btn btn-whatsapp btn-sm"
                        onClick={() => onOpenWhatsApp('order', order.orderNumber)}
                      >
                        Ask on WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
