import React from 'react';
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag } from 'lucide-react';
import { getWhatsAppMultiOrderUrl } from '../config/siteConfig';

export default function QuickOrderDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onClearCart }) {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const totalItemsCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const whatsappOrderUrl = getWhatsAppMultiOrderUrl(cartItems);

  return (
    <div className="drawer-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="var(--color-forest)" />
            <h3 className="drawer-title">Your WhatsApp Order Bag ({totalItemsCount})</h3>
          </div>
          <button onClick={onClose} className="btn-icon-only" style={{ width: '32px', height: '32px' }} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="drawer-body">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#718096' }}>
              <ShoppingBag size={48} style={{ margin: '0 auto 16px', strokeWidth: 1.2, color: '#A0AEC0' }} />
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--color-charcoal)', marginBottom: '8px' }}>
                Your bag is empty
              </h4>
              <p style={{ fontSize: '14px', lineHeight: 1.5 }}>
                Browse our traditional podis and click <strong>Add to Bag</strong> or order directly on WhatsApp.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="drawer-item">
                <img src={item.image} alt={item.name} className="drawer-item-img" />
                <div>
                  <div className="drawer-item-name">{item.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-crimson)', fontWeight: 600 }}>{item.tamilName}</div>
                  <div className="drawer-item-price">
                    ₹{item.price} <span style={{ fontSize: '11px', color: '#718096', fontWeight: 400 }}>× {item.quantity} = ₹{item.price * item.quantity}</span>
                  </div>

                  {/* Quantity Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                    <div className="qty-selector" style={{ transform: 'scale(0.85)', transformOrigin: 'left center' }}>
                      <button 
                        type="button" 
                        onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                        className="qty-btn"
                        aria-label="Decrease"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="qty-display">{item.quantity}</span>
                      <button 
                        type="button" 
                        onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                        className="qty-btn"
                        aria-label="Increase"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <button 
                      onClick={() => onRemoveItem(item.id)}
                      style={{ color: '#E53E3E', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      title="Remove item"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '14px', color: 'var(--color-forest-dark)' }}>
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="drawer-footer">
            <div className="drawer-subtotal-row">
              <span className="drawer-subtotal-label">Subtotal ({totalItemsCount} items)</span>
              <span className="drawer-subtotal-val">₹{totalAmount}</span>
            </div>

            <p style={{ fontSize: '12px', color: '#718096', marginBottom: '14px', lineHeight: 1.4 }}>
              Clicking below will format your order and open WhatsApp to message the owner directly.
            </p>

            <a 
              href={whatsappOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
              style={{ width: '100%', padding: '13px' }}
            >
              <MessageCircle size={18} />
              <span>Send Order on WhatsApp</span>
            </a>

            <button 
              onClick={onClearCart}
              style={{ width: '100%', marginTop: '10px', fontSize: '12px', color: '#718096', textAlign: 'center' }}
            >
              Clear Order Bag
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
