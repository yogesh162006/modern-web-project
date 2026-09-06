import React, { useState } from 'react';
import { X, MessageCircle, Check, ShoppingBag, Plus, Minus } from 'lucide-react';
import { getWhatsAppOrderUrl } from '../config/siteConfig';

export default function ProductDetailModal({ product, onClose, onAddToCart, relatedProducts = [], onSelectRelated }) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const totalCalculated = product.price * quantity;

  const whatsappUrl = getWhatsAppOrderUrl(product.name, quantity, {
    weight: product.weight,
    price: product.price
  });

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="modal-close-btn" 
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="modal-product-grid">
          {/* Left Column: Large Product Image on Light Green Stage */}
          <div className="modal-image-col">
            <div className="modal-image-aura" />
            <img 
              src={product.image} 
              alt={product.name} 
              className="modal-product-img" 
            />
          </div>

          {/* Right Column: Information & Ordering */}
          <div className="modal-details-col">
            <span className="modal-category-badge">{product.category}</span>
            <h2 className="modal-title-en">{product.name}</h2>
            <div className="modal-title-ta">{product.tamilName}</div>

            {/* Price Row */}
            <div className="modal-price-row">
              <span className="modal-price">₹{product.price}</span>
              {product.originalPrice && (
                <span className="modal-original-price">₹{product.originalPrice}</span>
              )}
              <span className="modal-weight-pill">{product.weight} Pack</span>
              <span className="modal-stock-tag">
                ✓ Fresh Batch (In Stock)
              </span>
            </div>

            {/* Description */}
            <div className="product-description">
              <p className="description-english">{product.description}</p>
              {product.tamildescription && (
                <p className="description-tamil">{product.tamildescription}</p>
              )}
            </div>

            {/* Health Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <div className="modal-benefits-block">
                <h4 className="modal-section-h4">Key Health Benefits</h4>
                <ul className="modal-bullets">
                  {product.benefits.map((benefit, idx) => (
                    <li key={idx} className="modal-bullet-item">
                      <Check size={15} className="bullet-icon" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Usage Instructions */}
            {product.usage && (
              <div className="modal-usage-block">
                <h4 className="modal-section-h4">How to Enjoy</h4>
                <p className="modal-usage-text">{product.usage}</p>
              </div>
            )}

            {/* Quantity Selector & Order Bar */}
            <div className="modal-qty-row">
              <div>
                <span className="qty-label">QUANTITY</span>
                <div className="qty-selector">
                  <button type="button" onClick={handleDecrement} className="qty-btn" aria-label="Decrease">
                    <Minus size={14} />
                  </button>
                  <span className="qty-display">{quantity}</span>
                  <button type="button" onClick={handleIncrement} className="qty-btn" aria-label="Increase">
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="modal-calc-box">
                <span className="calc-label">Total Amount</span>
                <div className="calc-val">₹{totalCalculated}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="modal-actions-grid">
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="modal-whatsapp-cta"
              >
                <MessageCircle size={18} />
                <span>Order on WhatsApp (Qty: {quantity})</span>
              </a>

              <button 
                type="button" 
                onClick={() => {
                  if (onAddToCart) onAddToCart(product, quantity);
                  onClose();
                }}
                className="modal-bag-btn"
              >
                <ShoppingBag size={17} />
                <span>Add to Bag</span>
              </button>
            </div>
          </div>
        </div>

        {/* Related Products Footer */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="modal-related-strip">
            <h4 className="modal-related-title">More in {product.category}</h4>
            <div className="modal-related-grid">
              {relatedProducts.slice(0, 3).map((rel) => (
                <div 
                  key={rel.id} 
                  onClick={() => onSelectRelated && onSelectRelated(rel)}
                  className="modal-related-card"
                >
                  <img src={rel.image} alt={rel.name} className="related-img" />
                  <div>
                    <div className="related-name">{rel.tamilName}</div>
                    <div className="related-price">₹{rel.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
