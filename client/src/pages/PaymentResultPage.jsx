import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';

export function PaymentResultPage({ onOpenWhatsApp }) {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const status = searchParams.get('status') || 'success';
  const reason = searchParams.get('reason') || '';

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.getOrderById(orderId);
        if (res.success && res.order) {
          setOrder(res.order);
        }
      } catch (err) {
        console.warn('Could not load order details:', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  const isSuccess = status === 'success';

  return (
    <main className="section-padding">
      <div className="container" style={{ maxWidth: '640px' }}>
        <div style={{ background: '#FFFFFF', padding: '3rem 2rem', borderRadius: 'var(--radius-md)', border: isSuccess ? '2px solid #2E7D32' : '2px solid #C62828', textAlign: 'center', boxShadow: 'var(--shadow-md)' }}>
          <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>
            {isSuccess ? '🎉' : '⚠️'}
          </span>

          <h1 className="font-serif" style={{ fontSize: '2rem', color: isSuccess ? '#1B5E20' : '#B71C1C', marginBottom: '0.6rem' }}>
            {isSuccess ? 'Payment Successful!' : 'Payment Incomplete'}
          </h1>

          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
            {isSuccess
              ? 'Thank you for choosing Payal Fashion Design. Your order is confirmed and our atelier has received your details.'
              : reason || 'Your payment could not be processed by the gateway or was cancelled.'}
          </p>

          {order && (
            <div style={{ background: 'var(--bg-cream)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', textAlign: 'left', marginBottom: '2rem', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Order Reference:</span>
                <strong style={{ color: 'var(--burgundy)' }}>{order.orderNumber}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                <span style={{ fontWeight: 600, textTransform: 'capitalize', color: isSuccess ? '#2E7D32' : '#C62828' }}>
                  {order.status.replace('_', ' ')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Amount:</span>
                <strong>₹{order.totalAmountINR.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Recipient:</span>
                <span>{order.shippingAddress?.recipientName} ({order.shippingAddress?.city})</span>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {isSuccess ? (
              <>
                <Link to="/my-orders" className="btn btn-primary">
                  <span>View My Orders</span>
                  <span>📦</span>
                </Link>
                <Link to="/shop" className="btn btn-secondary">
                  <span>Continue Shopping</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/cart" className="btn btn-primary">
                  <span>Return to Cart & Retry</span>
                </Link>
                <button
                  type="button"
                  className="btn btn-whatsapp"
                  onClick={() => onOpenWhatsApp('general')}
                >
                  <span>Need Help? Chat on WhatsApp</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
