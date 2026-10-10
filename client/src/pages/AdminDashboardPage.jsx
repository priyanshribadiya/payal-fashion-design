import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalRevenueINR: 0,
    totalOrders: 0,
    paidOrdersCount: 0,
    pendingFulfillments: 0,
    totalCustomers: 0,
    lowStockCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.getAdminStats();
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      } catch (err) {
        console.warn('Admin stats error:', err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <main className="section-padding">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="section-subtitle">ADMINISTRATOR PORTAL</span>
            <h1 className="font-serif" style={{ fontSize: '2.2rem', color: 'var(--burgundy)' }}>
              Boutique Operations Dashboard
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/admin/orders" className="btn btn-secondary btn-sm">
              Manage Orders
            </Link>
            <Link to="/admin/products" className="btn btn-primary btn-sm">
              Manage Products & Stock
            </Link>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div style={{ background: '#FFFFFF', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-gold)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Total Revenue
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--burgundy)', margin: '0.5rem 0' }}>
              ₹{stats.totalRevenueINR.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              From {stats.paidOrdersCount} completed orders
            </div>
          </div>

          <div style={{ background: '#FFFFFF', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Total Orders
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)', margin: '0.5rem 0' }}>
              {stats.totalOrders}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              All customer checkouts
            </div>
          </div>

          <div style={{ background: '#FFFFFF', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Pending Fulfillment
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#F57F17', margin: '0.5rem 0' }}>
              {stats.pendingFulfillments}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Paid orders awaiting dispatch
            </div>
          </div>

          <div style={{ background: '#FFFFFF', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Low Stock Alerts
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: stats.lowStockCount > 0 ? '#C62828' : '#2E7D32', margin: '0.5rem 0' }}>
              {stats.lowStockCount}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Products with ≤ 5 units left
            </div>
          </div>
        </div>

        {/* Quick Navigation Panels */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h3 className="font-serif" style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>
              📦 Order Management & Logistics
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              View and filter all customer orders, update tracking numbers, mark orders as dispatched, or handle customer refund requests.
            </p>
            <Link to="/admin/orders" className="btn btn-primary btn-sm">
              Go to Orders Console →
            </Link>
          </div>

          <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h3 className="font-serif" style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>
              👗 Inventory & Catalogue Control
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Add new sarees, lehengas, kurtis, edit product prices, update variant sizes/colors, and adjust stock quantities.
            </p>
            <Link to="/admin/products" className="btn btn-secondary btn-sm">
              Manage Products →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
