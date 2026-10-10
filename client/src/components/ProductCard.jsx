import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export function ProductCard({ product, onOpenWhatsApp }) {
  const { addToCart } = useCart();

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes && product.sizes.length ? product.sizes[0] : 'Standard';
    const defaultColor = product.colors && product.colors.length ? product.colors[0] : '';
    await addToCart(product._id, defaultSize, defaultColor, 1);
  };

  const handleWhatsAppEnquiry = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onOpenWhatsApp) {
      onOpenWhatsApp('product', product.name);
    }
  };

  return (
    <article className="product-card">
      <Link to={`/products/${product.slug}`} className="product-img-box" tabIndex="-1">
        <span className="product-category-tag">{product.categoryName}</span>
        {product.isDemonstrationData && (
          <span className="demo-badge" title="Sample demonstration style & pricing">
            Sample
          </span>
        )}
        <img
          src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80'}
          alt={product.name}
          className="product-img"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80';
          }}
        />
      </Link>

      <div className="product-details">
        <span className="product-cat-name">{product.categoryName}</span>
        <h3 className="product-title">
          <Link to={`/products/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="product-blurb">{product.description}</p>

        <div className="product-pricing">
          <span className="current-price">
            {product.formattedDiscountedPrice || product.formattedPrice}
          </span>
          {product.formattedDiscountedPrice && (
            <span className="original-price">{product.formattedPrice}</span>
          )}
        </div>

        <div className="product-card-actions">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleQuickAdd}
          >
            <span>Add to Cart</span>
          </button>
          <button
            type="button"
            className="btn btn-whatsapp btn-sm"
            onClick={handleWhatsAppEnquiry}
            title="Enquire on WhatsApp"
          >
            <span>Enquire</span>
          </button>
        </div>
      </div>
    </article>
  );
}
