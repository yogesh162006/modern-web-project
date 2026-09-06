import React from 'react';
import { MessageCircle, Phone, MapPin, Mail, ShieldCheck } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

export default function Footer({ onNavigate }) {
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp.phoneNumber}?text=${encodeURIComponent('Hi Dhanam Organics, I would like to inquire about your organic products.')}`;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <img 
                src="./images/logo/logo.jpeg" 
                alt="Dhanam Organics" 
                style={{ height: '48px', width: 'auto', background: '#fff', borderRadius: '4px', padding: '2px' }} 
              />
              <div>
                <div className="footer-brand-title">{SITE_CONFIG.brandName}</div>
                <div className="footer-brand-tamil">{SITE_CONFIG.brandNameTamil}</div>
              </div>
            </div>
            <p className="footer-tagline">
              {SITE_CONFIG.subTagline}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#9CA3AF' }}>
              <ShieldCheck size={16} color="#8FD19E" />
              <span>100% Traditional Soil-to-Kitchen Authenticity</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="footer-col-title">Explore Store</h4>
            <ul className="footer-links-list">
              <li>
                <button onClick={() => onNavigate('home')} className="footer-link">Home</button>
              </li>
              <li>
                <button onClick={() => onNavigate('store')} className="footer-link">All Products (8)</button>
              </li>
              <li>
                <a href="#heritage-story" className="footer-link">Our Heritage Story</a>
              </li>
              <li>
                <a href="#why-dhanam" className="footer-link">Why Dhanam Organics</a>
              </li>
              <li>
                <a href="#customer-trust" className="footer-link">Customer Reviews</a>
              </li>
            </ul>
          </div>

          {/* Direct WhatsApp Ordering */}
          <div>
            <h4 className="footer-col-title">Order On WhatsApp</h4>
            <p style={{ fontSize: '13.5px', color: '#A0AEC0', marginBottom: '14px', lineHeight: '1.5' }}>
              We take orders directly via WhatsApp for personalized service and fast packing.
            </p>
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-whatsapp btn-sm"
              style={{ display: 'inline-flex' }}
            >
              <MessageCircle size={15} />
              <span>{SITE_CONFIG.whatsapp.displayNumber}</span>
            </a>
            <div style={{ fontSize: '12px', color: '#718096', marginTop: '10px' }}>
              Hours: {SITE_CONFIG.whatsapp.supportHours}
            </div>
          </div>

          {/* Regional Roots & Location */}
          <div>
            <h4 className="footer-col-title">Location & Contact</h4>
            <ul className="footer-links-list">
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13.5px', color: '#A0AEC0' }}>
                <MapPin size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{SITE_CONFIG.contact.location}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#A0AEC0' }}>
                <Phone size={16} style={{ flexShrink: 0 }} />
                <span>{SITE_CONFIG.contact.phone}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#A0AEC0' }}>
                <Mail size={16} style={{ flexShrink: 0 }} />
                <span>{SITE_CONFIG.contact.email}</span>
              </li>
              <li style={{ marginTop: '12px' }}>
                <a 
                  href="./php/admin.php" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ fontSize: '12px', color: '#8FD19E', textDecoration: 'underline' }}
                >
                  Owner / Product Manager Portal ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div>
            © {new Date().getFullYear()} Dhanam Organics ({SITE_CONFIG.brandNameTamil}). All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Static GoDaddy Shared Hosting Ready</span>
            <span>•</span>
            <span>PHP/MySQL Backend Prepared</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
