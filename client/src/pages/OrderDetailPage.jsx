import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';

export function OrderDetailPage({ onOpenWhatsApp }) {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const { success, error } = useNotification();

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await api.getOrderById(id);
        if (res.success) setOrder(res.order);
      } catch (err) {
        error(err.message || 'Could not load order details');
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      const res = await api.cancelOrder(order._id, 'Customer requested cancellation online');
      if (res.success) {
        success('Order has been cancelled.');
        setOrder(res.order);
      }
    } catch (err) {
      error(err.message || 'Could not cancel order.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <main className="section-padding" style={{ textAlign: 'center' }}>Loading order details...</main>;
  }

  if (!order) {
    return (
      <main className="section-padding" style={{ textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <Link to="/my-orders" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Orders
        </Link>
      </main>
    );
  }

  return (
    <main className="section-padding">
      <div className="container" style={{ maxWidth: '800px' }}>
        <nav style={{ marginBottom: '1.5rem', fontSize: '0.88rem' }}>
          <Link to="/my-orders" style={{ color: 'var(--text-secondary)' }}>← Back to All Orders</Link>
        </nav>

        <div style={{ background: '#FFFFFF', padding: '2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Order Placed: {new Date(order.createdAt).toLocaleString('en-IN')}</span>
              <h1 className="font-serif" style={{ fontSize: '1.8rem', color: 'var(--burgundy)', margin: '0.2rem 0' }}>
                {order.orderNumber}
              </h1>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Status</div>
              <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '4px', background: '#E3F2FD', color: '#1565C0', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.85rem' }}>
                {order.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Tracking info if shipped */}
          {order.trackingNumber && (
            <div style={{ background: '#FFF8E1', border: '1px solid #FFE082', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
              <strong>🚚 Shipment Dispatched:</strong>
              <div>Courier: <strong>{order.courierName || 'Standard Express'}</strong></div>
              <div>Tracking Number / AWB: <strong>{order.trackingNumber}</strong></div>
            </div>
          )}

          {/* Items List */}
          <h3 className="font-serif" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Ordered Products</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {order.items.map((item, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '70px 1fr auto', gap: '1rem', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <img src={item.image} alt={item.name} style={{ width: '70px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                <div>
                  <h4 style={{ fontSize: '1.05rem', margin: 0 }}>{item.name}</h4>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    SKU: {item.sku} • Size: {item.size} {item.color ? `• Color: ${item.color}` : ''}
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Qty: {item.quantity} × ₹{(item.priceInPaise / 100).toLocaleString('en-IN')}
                  </div>
                </div>
                <strong style={{ fontSize: '1.1rem' }}>
                  ₹{((item.priceInPaise * item.quantity) / 100).toLocaleString('en-IN')}
                </strong>
              </div>
            ))}
          </div>

          {/* Price breakdown */}
          <div style={{ background: 'var(--bg-cream)', padding: '1.25rem', borderRadius: '8px', marginBottom: '2rem', fontSize: '0.92rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Subtotal:</span>
              <span>₹{order.subtotalINR.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Shipping Fee:</span>
              <span>{order.shippingINR === 0 ? 'FREE' : `₹${order.shippingINR.toLocaleString('en-IN')}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700, color: 'var(--burgundy)', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-subtle)' }}>
              <span>Total Paid:</span>
              <span>₹{order.totalAmountINR.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Delivery address */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Shipping Address</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              <strong>{order.shippingAddress?.recipientName}</strong> (Phone: {order.shippingAddress?.phone})<br />
              {order.shippingAddress?.streetAddress}, {order.shippingAddress?.landmark && `${order.shippingAddress?.landmark}, `}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pinCode}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-whatsapp"
              onClick={() => onOpenWhatsApp('order', order.orderNumber)}
            >
              <span>Enquire on WhatsApp</span>
            </button>

            {['pending_payment', 'paid'].includes(order.status) && (
              <button
                type="button"
                className="btn btn-secondary"
                style={{ color: '#C62828', borderColor: '#FFCDD2' }}
                onClick={handleCancel}
                disabled={cancelling}
              >
                <span>{cancelling ? 'Cancelling...' : 'Cancel Order'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
