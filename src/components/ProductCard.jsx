import React, { useState } from 'react';
import { MessageCircle, Plus, Eye, ShoppingBag, Sparkles } from 'lucide-react';
import { getWhatsAppOrderUrl } from '../config/siteConfig';

export default function ProductCard({ product, index, onSelect, onAddToCart, darkTheme = false }) {
  if (!product) return null;

  const [mousePos, setMousePos] = useState({ x: 0, y: 0, active: false });

  const whatsappUrl = getWhatsAppOrderUrl(product.name, 1, {
    weight: product.weight,
    price: product.price
  });

  // Calculate formatted index like № 01, № 02
  const formattedIndex = index !== undefined 
    ? `№ 0${index + 1}` 
    : (product.id ? `№ 0${product.id}` : '№ 01');

  // Subtle 3D tilt calculation on mouse move
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    setMousePos({ x, y, active: true });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0, active: false });
  };

  return (
    <article 
      className={`vault-product-card ${darkTheme ? 'vault-card-dark' : 'vault-card-sandal'}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: mousePos.active 
          ? `perspective(1000px) rotateX(${mousePos.y}deg) rotateY(${mousePos.x}deg) translateY(-6px)` 
          : 'none'
      }}
    >
      {/* Top Meta Bar */}
      <div className="vault-card-header">
        <span className="vault-index">{formattedIndex}</span>
        {product.badge && (
          <span className="vault-badge">{product.badge}</span>
        )}
      </div>

      {/* Product Image Stage with Ambient Pedestal */}
      <div 
        className="vault-image-stage"
        onClick={() => onSelect && onSelect(product)}
        title={`Inspect ${product.name}`}
      >
        <div className="vault-ambient-pedestal" />
        <img 
          src={product.image} 
          alt={product.name} 
          className="vault-product-img"
          loading="lazy"
        />
        
        {/* Quick View Floating Pill */}
        <button 
          type="button" 
          className="vault-quickview-btn"
          onClick={(e) => {
            e.stopPropagation();
            if (onSelect) onSelect(product);
          }}
          aria-label="Quick View"
        >
          <Eye size={13} />
          <span>Quick View</span>
        </button>
      </div>

      {/* Content Body */}
      <div className="vault-card-content">
        <div className="vault-category-tag">{product.category}</div>

        <h3 
          className="vault-card-title"
          onClick={() => onSelect && onSelect(product)}
        >
          {product.name}
        </h3>

        <div className="vault-tamil-title">
          {product.tamilName}
        </div>

        {/* Price & Weight Line */}
        <div className="vault-meta-row">
          <div className="vault-price-box">
            <span className="vault-currency">₹</span>
            <span className="vault-amount">{product.price}</span>
            {product.originalPrice && (
              <span className="vault-original-price">₹{product.originalPrice}</span>
            )}
          </div>
          <span className="vault-weight-pill">{product.weight}</span>
        </div>

        {/* Order CTAs */}
        <div className="vault-card-actions">
          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="vault-btn-whatsapp"
            title="Order directly via WhatsApp"
          >
            <MessageCircle size={15} />
            <span>Order</span>
          </a>

          <button 
            type="button"
            onClick={() => onAddToCart && onAddToCart(product)}
            className="vault-btn-bag"
            title="Add to WhatsApp Order Bag"
            aria-label="Add to Bag"
          >
            <Plus size={15} />
            <ShoppingBag size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
