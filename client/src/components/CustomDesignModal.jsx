import React, { useState } from 'react';

export function CustomDesignModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [outfitType, setOutfitType] = useState('Bridal Lehenga');
  const [fabricPreference, setFabricPreference] = useState('Raw Silk / Banarasi');
  const [budget, setBudget] = useState('₹7,000 - ₹15,000');
  const [timeline, setTimeline] = useState('In 3-4 weeks');
  const [notes, setNotes] = useState('');

  const phone = '919723814909';

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedMessage = [
      `*CUSTOM STITCHING & DESIGN ENQUIRY*`,
      `• *Store:* Payal Fashion Design`,
      `• *Outfit Type:* ${outfitType}`,
      `• *Fabric Preference:* ${fabricPreference}`,
      `• *Target Budget:* ${budget}`,
      `• *Required Timeline:* ${timeline}`,
      notes ? `• *Design Notes / Ideas:* ${notes}` : '',
      `\nHello Payal Fashion Design, I would like to consult on the above custom stitching requirements. Please let me know the process for measurement trial and consultation.`,
    ]
      .filter(Boolean)
      .join('\n');

    const encoded = encodeURIComponent(formattedMessage);
    const url = `https://wa.me/${phone}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>✂️</span>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Custom Design & Stitching Request</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ fontSize: '1.5rem', lineHeight: '1', color: 'var(--text-muted)' }}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Have an outfit idea from Pinterest or Instagram? Share your preferences below and connect directly with our atelier on WhatsApp to confirm fabric and fitting consultations.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Outfit Category</label>
                <select
                  className="form-select"
                  value={outfitType}
                  onChange={(e) => setOutfitType(e.target.value)}
                >
                  <option value="Bridal Lehenga">Bridal Lehenga</option>
                  <option value="Designer Saree Blouse">Designer Saree Blouse (Aari/Maggam)</option>
                  <option value="Anarkali / Salwar Suit">Anarkali / Salwar Suit</option>
                  <option value="Festive Kurti Set">Festive Kurti Set</option>
                  <option value="Sharara / Gharara Ensemble">Sharara / Gharara Ensemble</option>
                  <option value="Indo-Western Reception Gown">Indo-Western Reception Gown</option>
                  <option value="Custom Stitching (Own Fabric)">Custom Stitching (My Fabric)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Fabric Preference</label>
                <select
                  className="form-select"
                  value={fabricPreference}
                  onChange={(e) => setFabricPreference(e.target.value)}
                >
                  <option value="Raw Silk / Banarasi">Raw Silk / Banarasi</option>
                  <option value="Pure Georgette / Chiffon">Pure Georgette / Chiffon</option>
                  <option value="Organza / Tissue">Organza / Tissue</option>
                  <option value="Velvet / Brocade">Velvet / Brocade</option>
                  <option value="Cotton / Chanderi">Cotton / Chanderi</option>
                  <option value="Need Consultation">Need Boutique Guidance</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Estimated Budget</label>
                <select
                  className="form-select"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                >
                  <option value="₹2,000 - ₹5,000">₹2,000 - ₹5,000</option>
                  <option value="₹5,000 - ₹10,000">₹5,000 - ₹10,000</option>
                  <option value="₹10,000 - ₹25,000">₹10,000 - ₹25,000</option>
                  <option value="₹25,000+ (Bridal)">₹25,000+ (Bridal / Heavy)</option>
                  <option value="Flexible">Flexible / Discuss on Call</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Needed By</label>
                <input
                  type="text"
                  className="form-input"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  placeholder="e.g. Next month for wedding"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Design Notes / Reference Link / Measurements</label>
              <textarea
                className="form-textarea"
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention specific cuts, necklines, embroidery type, or sizing questions..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-whatsapp">
              <span>Send Enquiry via WhatsApp</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
