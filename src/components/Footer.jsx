import React from 'react';
import { MessageCircle, Shield, ArrowUp, Sparkles, MapPin, Phone } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

export default function Footer({ onNavigate }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappDirectUrl = `https://wa.me/${SITE_CONFIG.whatsapp.phoneNumber}?text=${encodeURIComponent('Hi Dhanam Organics, I would like to inquire about your products and place an order.')}`;

  return (
    <footer className="master-footer">
      <div className="container">
        {/* Top Concierge Callout */}
        <div className="footer-concierge-banner">
          <div className="concierge-text-box">
            <span className="concierge-kicker">PERSONAL KITCHEN DISPATCH</span>
            <h3 className="concierge-heading">Direct WhatsApp Ordering & Consultations</h3>
            <p className="concierge-desc">
              Need custom quantities, bulk orders, or recommendations for specific wellness needs? Our kitchen concierge is available directly on WhatsApp.
            </p>
          </div>
          <a 
            href={whatsappDirectUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="footer-whatsapp-cta"
          >
            <MessageCircle size={20} />
            <span>Connect on WhatsApp</span>
          </a>
        </div>

        {/* Main Footer Grid */}
        <div className="footer-columns-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <div className="footer-logo-row">
              <img 
                src="./images/logo/logo.jpeg" 
                alt="Dhanam Organics Emblem" 
                className="footer-brand-logo" 
              />
              <div>
                <span className="footer-brand-name">{SITE_CONFIG.brandName}</span>
                <span className="footer-brand-tamil">{SITE_CONFIG.brandNameTamil}</span>
              </div>
            </div>
            <p className="footer-brand-ethos">
              Committed to preserving the culinary integrity and Siddha wellness tradition of Tamil Nadu through slow stone-milled podis, sun-dried herbs, and zero synthetic preservatives.
            </p>
            <div className="footer-direct-phone">
              <Phone size={15} />
              <span>WhatsApp: {SITE_CONFIG.whatsapp.displayNumber}</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-link-list">
              <li>
                <button onClick={() => onNavigate && onNavigate('home')}>Home</button>
              </li>
              <li>
                <button onClick={() => onNavigate && onNavigate('store')}>Full Catalog (8 Podis)</button>
              </li>
              <li>
                <a href="#heritage-story">Our Heritage Philosophy</a>
              </li>
              <li>
                <a href="#why-dhanam">Four Pillars of Purity</a>
              </li>
              <li>
                <a href="#customer-trust">Customer Reviews</a>
              </li>
            </ul>
          </div>

          {/* Catalog Categories */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Collections</h4>
            <ul className="footer-link-list">
              <li>
                <button onClick={() => onNavigate && onNavigate('store')}>Heritage Podis (இட்லி & சாதம்)</button>
              </li>
              <li>
                <button onClick={() => onNavigate && onNavigate('store')}>Herbal & Joint Care (பிரண்டை, முடவாட்டுக்கால்)</button>
              </li>
              <li>
                <button onClick={() => onNavigate && onNavigate('store')}>Daily Staples (ரசம், பருப்பு பொடி)</button>
              </li>
            </ul>
          </div>

          {/* Store Owner & Management */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Store Management</h4>
            <p className="footer-admin-note">
              Authorized portal for inventory, catalog updates, and product pricing.
            </p>
            <a 
              href="./php/admin.php" 
              className="footer-admin-link"
              title="Store Owner Admin Panel"
            >
              <Shield size={14} />
              <span>Owner Admin Portal</span>
            </a>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom-strip">
          <p>© {new Date().getFullYear()} Dhanam Organics (தனம் ஆர்கானிக்ஸ்). All rights reserved.</p>
          <div className="footer-bottom-badges">
            <span>100% Traditional South Indian Craft</span>
            <button 
              onClick={scrollToTop} 
              className="footer-back-to-top"
              title="Return to top"
              aria-label="Return to top"
            >
              <span>Top</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
