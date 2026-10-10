import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';

export function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierName, setCourierName] = useState('BlueDart Express');

  const { success, error } = useNotification();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);
      if (search.trim()) params.append('search', search.trim());

      const res = await api.getAdminOrders(`?${params.toString()}`);
      if (res.success) setOrders(res.orders);
    } catch (err) {
      error(err.message || 'Failed to fetch admin orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, search]);

  const handleUpdateStatus = async (orderId) => {
    if (!selectedStatus) return;
    try {
      const res = await api.updateOrderStatus(orderId, {
        status: selectedStatus,
        trackingNumber: trackingNumber.trim(),
        courierName: courierName.trim(),
      });
      if (res.success) {
        success(`Order status updated to ${selectedStatus}!`);
        setUpdatingId(null);
        setSelectedStatus('');
        setTrackingNumber('');
        loadOrders();
      }
    } catch (err) {
      error(err.message || 'Could not update status');
    }
  };

  return (
    <main className="section-padding">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <Link to="/admin" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>← Back to Dashboard</Link>
            <h1 className="font-serif" style={{ fontSize: '2rem', marginTop: '0.4rem' }}>
              Order Management Console
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="form-input"
              style={{ width: '240px' }}
              placeholder="Search order number or client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending_payment">Pending Payment</option>
              <option value="paid">Paid</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '3rem 0', background: '#FFFFFF', borderRadius: '8px' }}>
            No orders match the current filter.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {orders.map((o) => (
              <div
                key={o._id}
                style={{
                  background: '#FFFFFF',
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <strong style={{ fontSize: '1.15rem', color: 'var(--burgundy)' }}>{o.orderNumber}</strong>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginLeft: '12px' }}>
                      {new Date(o.createdAt).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '4px', background: 'var(--bg-subtle)', fontWeight: 600, fontSize: '0.82rem', textTransform: 'uppercase' }}>
                      {o.status.replace('_', ' ')}
                    </span>
                    <strong style={{ fontSize: '1.15rem' }}>₹{o.totalAmountINR.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  <div><strong>Customer:</strong> {o.shippingAddress?.recipientName} ({o.shippingAddress?.phone})</div>
                  <div><strong>Address:</strong> {o.shippingAddress?.streetAddress}, {o.shippingAddress?.city}, {o.shippingAddress?.state} - {o.shippingAddress?.pinCode}</div>
                  {o.trackingNumber && (
                    <div style={{ color: '#1565C0', marginTop: '4px' }}>
                      <strong>Tracking:</strong> {o.courierName} — {o.trackingNumber}
                    </div>
                  )}
                </div>

                {/* Items */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                  {o.items.map((it, idx) => (
                    <span key={idx} style={{ background: 'var(--bg-cream)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.82rem', border: '1px solid var(--border-subtle)' }}>
                      {it.name} (Qty: {it.quantity}, Size: {it.size})
                    </span>
                  ))}
                </div>

                {/* Status Update Trigger */}
                {updatingId === o._id ? (
                  <div style={{ background: 'var(--bg-cream)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-gold)', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                    <select
                      className="form-select"
                      style={{ width: '180px' }}
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="">Select Status...</option>
                      <option value="paid">Paid</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    {selectedStatus === 'shipped' && (
                      <>
                        <input
                          type="text"
                          className="form-input"
                          style={{ width: '180px' }}
                          placeholder="Tracking # / AWB"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                        />
                        <input
                          type="text"
                          className="form-input"
                          style={{ width: '150px' }}
                          placeholder="Courier Partner"
                          value={courierName}
                          onChange={(e) => setCourierName(e.target.value)}
                        />
                      </>
                    )}

                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => handleUpdateStatus(o._id)}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setUpdatingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setUpdatingId(o._id);
                      setSelectedStatus(o.status);
                    }}
                  >
                    Update Fulfillment Status
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
