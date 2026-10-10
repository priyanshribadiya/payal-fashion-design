import React, { useState } from 'react';

export function WhatsAppModal({ isOpen, onClose, initialType = 'general', productName = '' }) {
  if (!isOpen) return null;

  const phone = '919723814909';
  const defaultText = productName
    ? `Hello Payal Fashion Design, I am interested in "${productName}". Please let me know available sizes, fabric details, and delivery timelines.`
    : `Hello Payal Fashion Design, I would like to inquire about your Indian ethnic collection and bespoke custom tailoring services.`;

  const [message, setMessage] = useState(defaultText);

  const handleLaunchWhatsApp = (e) => {
    e.preventDefault();
    const encoded = encodeURIComponent(message.trim());
    const url = `https://wa.me/${phone}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>💬</span>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Connect on WhatsApp</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ fontSize: '1.5rem', lineHeight: '1', color: 'var(--text-muted)' }}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleLaunchWhatsApp}>
          <div className="modal-body">
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Chat directly with the <strong>Payal Fashion Design</strong> atelier team at <strong>+91 97238 14909</strong> to ask questions, request custom measurements, or discuss fabric options.
            </p>

            <div className="form-group">
              <label className="form-label">Your Message:</label>
              <textarea
                className="form-textarea"
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-whatsapp">
              <span>Open in WhatsApp</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
