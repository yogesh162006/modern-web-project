import React from 'react';
import { MessageCircle, Plus, Eye, ShoppingBag } from 'lucide-react';
import { getWhatsAppOrderUrl } from '../config/siteConfig';

export default function ProductCard({ product, onSelect, onAddToCart }) {
  if (!product) return null;

  const whatsappUrl = getWhatsAppOrderUrl(product.name, 1, {
    weight: product.weight,
    price: product.price
  });

  return (
    <article className="product-card">
      {/* Badge if present */}
      {product.badge && (
        <span className={`product-card-badge ${product.badge === 'Bestseller' ? 'badge-bestseller' : ''}`}>
          {product.badge}
        </span>
      )}

      {/* Product Image Area */}
      <div 
        className="product-image-box"
        onClick={() => onSelect(product)}
        title={`View details of ${product.name}`}
      >
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-thumb-img"
          loading="lazy"
        />
      </div>

      {/* Product Information */}
      <div className="product-card-body">
        <span className="product-category-tag">{product.category}</span>
        
        <h3 
          className="product-card-title" 
          onClick={() => onSelect(product)}
        >
          {product.name}
        </h3>

        <div className="product-card-tamil">
          {product.tamilName}
        </div>

        {/* Price & Weight Row */}
        <div className="product-meta-row">
          <div className="product-price-block">
            <span className="product-price">₹{product.price}</span>
            {product.originalPrice && (
              <span className="product-original-price">₹{product.originalPrice}</span>
            )}
          </div>
          <span className="product-weight">{product.weight}</span>
        </div>

        {/* Actions Row */}
        <div className="product-card-actions">
          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-whatsapp btn-sm"
            title="Order directly on WhatsApp"
          >
            <MessageCircle size={15} />
            <span>Order</span>
          </a>

          <button 
            type="button" 
            onClick={() => onAddToCart && onAddToCart(product)} 
            className="btn btn-outline btn-sm"
            title="Add to order list"
            aria-label="Add to bag"
          >
            <Plus size={15} />
            <ShoppingBag size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
