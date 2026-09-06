import React, { useState } from 'react';
import { MessageCircle, ShoppingBag, Menu, X, Search } from 'lucide-react';
import { SITE_CONFIG, getWhatsAppOrderUrl } from '../config/siteConfig';

export default function Navbar({ activePage, setActivePage, cartItems = [], onOpenCart, onOpenSearch }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const quickGeneralOrderUrl = `https://wa.me/${SITE_CONFIG.whatsapp.phoneNumber}?text=${encodeURIComponent('Hi Dhanam Organics, I would like to inquire about your organic products and place an order.')}`;

  return (
    <header className="navbar-wrapper">
      {/* Top Announcement Bar */}
      <div className="announcement-bar">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>🌿 பாரம்பரிய இயற்கை நலம் • 100% Traditional Stone-Ground Farm Podis</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            WhatsApp Order Hotline: <strong className="highlight">{SITE_CONFIG.whatsapp.displayNumber}</strong>
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar">
        <div className="container navbar-inner">
          {/* Brand Logo & Name */}
          <a 
            href="#home" 
            onClick={(e) => { e.preventDefault(); handleNavClick('home'); }} 
            className="brand-link"
            title="Dhanam Organics Homepage"
          >
            <img 
              src="./images/logo/logo.jpeg" 
              alt="Dhanam Organics Official Logo" 
              className="brand-logo-img" 
            />
            <div className="brand-text-block">
              <span className="brand-title-en">{SITE_CONFIG.brandName}</span>
              <span className="brand-title-ta">{SITE_CONFIG.brandNameTamil}</span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <ul className="nav-links">
            <li>
              <button 
                onClick={() => handleNavClick('home')} 
                className={`nav-item-link ${activePage === 'home' ? 'active' : ''}`}
              >
                Home
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavClick('store')} 
                className={`nav-item-link ${activePage === 'store' ? 'active' : ''}`}
              >
                Store / Catalog
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleSectionScroll('heritage-story')} 
                className="nav-item-link"
              >
                Our Heritage
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleSectionScroll('why-dhanam')} 
                className="nav-item-link"
              >
                Why Dhanam
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleSectionScroll('customer-trust')} 
                className="nav-item-link"
              >
                Reviews
              </button>
            </li>
          </ul>

          {/* Right Action Icons & WhatsApp Button */}
          <div className="nav-actions">
            {onOpenSearch && (
              <button 
                onClick={onOpenSearch}
                className="btn btn-icon-only" 
                title="Search Products"
                aria-label="Search Products"
              >
                <Search size={19} />
              </button>
            )}

            <button 
              onClick={onOpenCart} 
              className="btn btn-icon-only" 
              title="View Order Bag"
              aria-label="View Order Bag"
            >
              <ShoppingBag size={20} />
              {totalCartCount > 0 && (
                <span className="cart-count-badge">{totalCartCount}</span>
              )}
            </button>

            <a 
              href={quickGeneralOrderUrl}
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-whatsapp btn-sm"
              title="Order on WhatsApp"
            >
              <MessageCircle size={17} />
              <span>WhatsApp Order</span>
            </a>

            {/* Mobile Toggle Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="mobile-toggle"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="mobile-nav-panel">
            <button onClick={() => handleNavClick('home')} className="mobile-nav-link" style={{ textAlign: 'left' }}>
              Home
            </button>
            <button onClick={() => handleNavClick('store')} className="mobile-nav-link" style={{ textAlign: 'left' }}>
              Store / All Products
            </button>
            <button onClick={() => handleSectionScroll('heritage-story')} className="mobile-nav-link" style={{ textAlign: 'left' }}>
              Our Heritage Story
            </button>
            <button onClick={() => handleSectionScroll('why-dhanam')} className="mobile-nav-link" style={{ textAlign: 'left' }}>
              Why Dhanam Organics
            </button>
            <button onClick={() => handleSectionScroll('customer-trust')} className="mobile-nav-link" style={{ textAlign: 'left' }}>
              Customer Reviews
            </button>
            <div style={{ paddingTop: '10px' }}>
              <a 
                href={quickGeneralOrderUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-whatsapp" 
                style={{ width: '100%' }}
              >
                <MessageCircle size={18} />
                <span>Order on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
