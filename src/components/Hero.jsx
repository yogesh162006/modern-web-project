import React from 'react';
import { ArrowRight, MessageCircle, ShieldCheck, Sparkles, Sprout } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

export default function Hero({ onExploreStore, onSelectProduct, featuredProducts = [] }) {
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp.phoneNumber}?text=${encodeURIComponent('Hi Dhanam Organics, I would like to explore your traditional podis and place an order.')}`;

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-grid">
          {/* Hero Left Content */}
          <div className="hero-content">
            <div className="hero-tag">
              <Sprout size={15} />
              <span>100% Traditional Soil-to-Kitchen Harvest</span>
            </div>

            <h1 className="hero-heading">
              Ancient Soil.
              <br />
              Handcrafted Purity.
              <span className="tamil-accent">
                பாரம்பரிய இயற்கை நலம்
              </span>
            </h1>

            <p className="hero-description">
              Hand-pounded heritage podis, rare medicinal herbal soups, and cold-milled kitchen essentials from Tamil Nadu. Crafted with ancestral Siddha knowledge—zero chemical preservatives, pure authentic goodness.
            </p>

            <div className="hero-ctas">
              <button 
                onClick={onExploreStore} 
                className="btn btn-primary"
              >
                <span>Explore Products</span>
                <ArrowRight size={17} />
              </button>

              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-whatsapp"
              >
                <MessageCircle size={18} />
                <span>Order on WhatsApp</span>
              </a>
            </div>

            {/* Trust Markers Bar */}
            <div className="hero-trust-bar">
              <div className="trust-item">
                <span className="trust-item-title">Stone-Milled</span>
                <span className="trust-item-desc">Slow-ground to preserve essential oils & aroma</span>
              </div>
              <div className="trust-item">
                <span className="trust-item-title">Zero Preservatives</span>
                <span className="trust-item-desc">No artificial colors, MSG, or chemical stabilizers</span>
              </div>
              <div className="trust-item">
                <span className="trust-item-title">Direct From Farms</span>
                <span className="trust-item-desc">Sourced ethically from organic growers</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Composition with Authentic Products */}
          <div className="hero-visual-wrapper">
            <div className="hero-pedestal-card">
              <div className="hero-jars-stage">
                {/* Secondary Jar Left: Karuveppilai */}
                <div 
                  className="hero-jar-secondary" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelectProduct && onSelectProduct(3)}
                  title="View Curry Leaf Podi"
                >
                  <img 
                    src="./images/products/karuveppilai-podi.png" 
                    alt="Karuveppilai Podi" 
                  />
                </div>

                {/* Primary Hero Jar Center: Pirandai */}
                <div 
                  className="hero-jar-primary" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelectProduct && onSelectProduct(5)}
                  title="View Pirandai Bone Health Podi"
                >
                  <img 
                    src="./images/products/pirandai-podi.png" 
                    alt="Pirandai Podi" 
                  />
                </div>

                {/* Secondary Jar Right: Idli Podi */}
                <div 
                  className="hero-jar-secondary" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelectProduct && onSelectProduct(1)}
                  title="View Traditional Idli Podi"
                >
                  <img 
                    src="./images/products/idli-podi.png" 
                    alt="Idli Podi" 
                  />
                </div>
              </div>

              <div className="hero-stage-badge">
                <div className="hero-stage-title">Fresh Small-Batch Harvest</div>
                <div className="hero-stage-sub">Aromatic Traditional Podis • Vacuum Sealed Glass & Food-Grade Jars</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
