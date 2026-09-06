import React, { useState, useEffect } from 'react';
import { MessageCircle, ShoppingBag, Menu, X, Search } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

export default function Navbar({ activePage, setActivePage, cartItems = [], onOpenCart, onOpenSearch }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSectionScroll = (sectionId) => {
    setMobileMenuOpen(false);
    if (activePage !== 'home') {
      setActivePage('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const quickGeneralOrderUrl = `https://wa.me/${SITE_CONFIG.whatsapp.phoneNumber}?text=${encodeURIComponent('Hi Dhanam Organics, I would like to inquire about your organic products and place an order.')}`;

  return (
    <header className={`vault-header-wrapper ${isScrolled ? 'is-scrolled' : ''}`}>
      {/* Top Atmospheric Strip */}
      <div className="vault-top-strip">
        <div className="container vault-top-strip-inner">
          <div className="strip-left">
            <span className="strip-accent">🌿 தனம் ஆர்கானிக்ஸ்</span>
            <span className="strip-divider">•</span>
            <span>100% Traditional Stone-Milled Farm Podis</span>
          </div>
          <div className="strip-right">
            <span>WhatsApp Ordering:</span>
            <strong className="strip-phone">{SITE_CONFIG.whatsapp.displayNumber}</strong>
          </div>
        </div>
      </div>

      {/* Main Glassmorphic Navigation Bar */}
      <nav className="vault-navbar">
        <div className="container vault-navbar-inner">
          {/* Brand Logo & Name */}
          <a 
            href="#home" 
            onClick={(e) => { e.preventDefault(); handleNavClick('home'); }} 
            className="vault-brand-anchor"
            title="Dhanam Organics Home"
          >
            <img 
              src="./images/logo/logo.jpeg" 
              alt="Dhanam Organics Logo" 
              className="vault-brand-logo-img" 
            />
            <div className="vault-brand-text">
              <span className="vault-brand-en">{SITE_CONFIG.brandName}</span>
              <span className="vault-brand-ta">{SITE_CONFIG.brandNameTamil}</span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <ul className="vault-nav-links">
            <li>
              <button 
                onClick={() => handleNavClick('home')} 
                className={`vault-nav-btn ${activePage === 'home' ? 'is-active' : ''}`}
              >
                Home
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavClick('store')} 
                className={`vault-nav-btn ${activePage === 'store' ? 'is-active' : ''}`}
              >
                Store / Catalog
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleSectionScroll('heritage-story')} 
                className="vault-nav-btn"
              >
                Our Heritage
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleSectionScroll('why-dhanam')} 
                className="vault-nav-btn"
              >
                Why Dhanam
              </button>
            </li>
          </ul>

          {/* Nav Actions */}
          <div className="vault-nav-actions">
            {onOpenSearch && (
              <button 
                onClick={onOpenSearch}
                className="vault-icon-btn" 
                title="Search Podis"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            )}

            <button 
              onClick={onOpenCart} 
              className="vault-icon-btn" 
              title="View WhatsApp Order Bag"
              aria-label="View Order Bag"
            >
              <ShoppingBag size={18} />
              {totalCartCount > 0 && (
                <span className="vault-cart-badge">{totalCartCount}</span>
              )}
            </button>

            <a 
              href={quickGeneralOrderUrl}
              target="_blank" 
              rel="noopener noreferrer" 
              className="vault-whatsapp-btn"
              title="Order on WhatsApp"
            >
              <MessageCircle size={16} />
              <span>WhatsApp Order</span>
            </a>

            {/* Mobile Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="vault-mobile-hamburger"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="vault-mobile-drawer">
            <button onClick={() => handleNavClick('home')} className="vault-mobile-item">
              Home
            </button>
            <button onClick={() => handleNavClick('store')} className="vault-mobile-item">
              Store / All 8 Products
            </button>
            <button onClick={() => handleSectionScroll('heritage-story')} className="vault-mobile-item">
              Our Heritage Philosophy
            </button>
            <button onClick={() => handleSectionScroll('why-dhanam')} className="vault-mobile-item">
              Why Dhanam Organics
            </button>
            <div className="vault-mobile-footer-btn">
              <a 
                href={quickGeneralOrderUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="vault-whatsapp-btn" 
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <MessageCircle size={17} />
                <span>Order on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
