import React, { useState } from 'react';
import { X, MessageCircle, Check, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react';
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
          {/* Left Column: Large Product Image */}
          <div className="modal-image-col">
            <img 
              src={product.image} 
              alt={product.name} 
              className="modal-product-img" 
            />
          </div>

          {/* Right Column: Information & Ordering */}
          <div className="modal-details-col">
            <span className="product-category-tag">{product.category}</span>
            <h2 className="modal-title-en">{product.name}</h2>
            <div className="modal-title-ta">{product.tamilName}</div>

            {/* Price Row */}
            <div className="modal-price-row">
              <span className="modal-price">₹{product.price}</span>
              {product.originalPrice && (
                <span className="product-original-price" style={{ fontSize: '16px' }}>₹{product.originalPrice}</span>
              )}
              <span className="modal-weight-badge">{product.weight} Pack</span>
              <span style={{ marginLeft: 'auto', fontSize: '13px', fontWeight: 600, color: '#03543F' }}>
                ✓ In Stock (Fresh Batch)
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
              <div style={{ marginBottom: '18px' }}>
                <h4 className="modal-section-h4">Key Health Benefits</h4>
                <ul className="modal-bullets">
                  {product.benefits.map((benefit, idx) => (
                    <li key={idx} className="modal-bullet-item">
                      <Check size={16} color="#1B4332" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            

            {/* Usage Instructions */}
            {product.usage && (
              <div style={{ marginBottom: '22px' }}>
                <h4 className="modal-section-h4">How to Enjoy</h4>
                <p style={{ fontSize: '13.5px', color: '#4A5568', lineHeight: '1.5' }}>
                  {product.usage}
                </p>
              </div>
            )}

            {/* Quantity Selector & Order Buttons */}
            <div className="qty-control-row">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#718096' }}>QUANTITY</span>
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

              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <span style={{ fontSize: '12px', color: '#718096' }}>Estimated Total</span>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-forest-dark)' }}>
                  ₹{totalCalculated}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px', marginTop: '12px' }}>
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-whatsapp"
                style={{ width: '100%' }}
              >
                <MessageCircle size={18} />
                <span>Order on WhatsApp (Qty: {quantity})</span>
              </a>

              <button 
                type="button" 
                onClick={() => {
                  onAddToCart && onAddToCart(product, quantity);
                  onClose();
                }}
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                <ShoppingBag size={17} />
                <span>Add to Bag</span>
              </button>
            </div>
          </div>
        </div>

        {/* Related Products Footer within Modal */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div style={{ padding: '24px 32px 32px', background: '#FAF7F2', borderTop: '1px solid var(--color-border)' }}>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: 700, color: 'var(--color-forest-dark)', marginBottom: '16px' }}>
              You May Also Like in this Category
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
              {relatedProducts.slice(0, 3).map((rel) => (
                <div 
                  key={rel.id} 
                  onClick={() => onSelectRelated && onSelectRelated(rel)}
                  style={{
                    background: '#fff',
                    border: '1px solid var(--color-border)',
                    borderRadius: '4px',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer'
                  }}
                >
                  <img src={rel.image} alt={rel.name} style={{ width: '40px', height: '48px', objectFit: 'contain' }} />
                  <div>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--color-charcoal)', lineHeight: 1.2 }}>{rel.tamilName}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-forest)', fontWeight: 600, marginTop: '2px' }}>₹{rel.price}</div>
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
