import React, { useState } from 'react';
import { ArrowRight, MessageCircle, Sparkles, Compass } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

export default function Hero({ onExploreStore, onSelectProduct }) {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 20;
    const y = (e.clientY / innerHeight - 0.5) * 20;
    setMouseOffset({ x, y });
  };

  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp.phoneNumber}?text=${encodeURIComponent('Hi Dhanam Organics, I would like to explore your traditional stone-ground podis and place an order.')}`;

  return (
    <section className="master-hero-stage" onMouseMove={handleMouseMove}>
      {/* Background Depth Layer: Atmospheric Ambient Glows */}
      <div className="hero-ambient-orb hero-ambient-one" />
      <div className="hero-ambient-orb hero-ambient-two" />
      
      {/* Background Watermark Typography */}
      <div 
        className="hero-ghost-typography"
        style={{
          transform: `translate(${mouseOffset.x * -0.5}px, ${mouseOffset.y * -0.5}px)`
        }}
      >
        DHANAM
      </div>

      <div className="container hero-content-relative">
        {/* Top Editorial Spec Line */}
        <div className="hero-spec-strip">
          <div className="hero-pill-tag">
            <span className="hero-pulse-dot" />
            <span>ESTD. TRADITIONAL MILLING • TAMIL NADU</span>
          </div>
          <div className="hero-spec-item">BATCH № 04 FRESH DISPATCH</div>
          <div className="hero-spec-item">SLOW STONE GROUND (28 RPM)</div>
        </div>

        {/* Asymmetrical Hero Grid */}
        <div className="hero-editorial-grid">
          {/* Left Column: Editorial Typography & Intent */}
          <div className="hero-text-column">
            <h1 className="hero-main-title">
              Ancestral Soil.
              <br />
              <span className="hero-title-highlight">Living Purity.</span>
              <span className="hero-tamil-script">
                பாரம்பரிய இயற்கை நலம்
              </span>
            </h1>

            <p className="hero-narrative">
              Hand-roasted pulses, native herbs, and stone-ground podis crafted according to ancestral Tamil Nadu kitchen formulations. Zero preservatives, zero chemical stabilizers—pure authentic nutrition delivered straight to your home.
            </p>

            <div className="hero-actions-row">
              <button 
                onClick={onExploreStore} 
                className="hero-btn-primary"
              >
                <span>Explore Full Vault</span>
                <ArrowRight size={17} />
              </button>

              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hero-btn-whatsapp"
              >
                <MessageCircle size={18} />
                <span>WhatsApp Order</span>
              </a>
            </div>

            {/* Micro Pillars in Hero */}
            <div className="hero-micro-pillars">
              <div className="hero-micro-box">
                <span className="hero-micro-number">01</span>
                <div>
                  <strong>Slow Stone-Ground</strong>
                  <p>Gentle low-heat milling protects volatile herbal oils.</p>
                </div>
              </div>
              <div className="hero-micro-box">
                <span className="hero-micro-number">02</span>
                <div>
                  <strong>Zero Preservatives</strong>
                  <p>No synthetic colors, anti-caking powders, or MSG.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3-Layer Visual Pedestal with Authentic Transparent Jars */}
          <div 
            className="hero-visual-pedestal-stage"
            style={{
              transform: `translate(${mouseOffset.x * 0.4}px, ${mouseOffset.y * 0.4}px)`
            }}
          >
            <div className="hero-pedestal-ground" />
            
            {/* Flanking Left Jar: Karuveppilai */}
            <div 
              className="hero-floating-jar hero-jar-flank-left"
              onClick={() => onSelectProduct && onSelectProduct(3)}
              title="Inspect Karuveppilai Podi"
            >
              <img 
                src="./images/products/karuveppilai-podi.png" 
                alt="Curry Leaf Podi" 
              />
              <span className="hero-jar-tooltip">கருவேப்பிலை பொடி • ₹140</span>
            </div>

            {/* Centerpiece Hero Jar: Pirandai */}
            <div 
              className="hero-floating-jar hero-jar-centerpiece"
              onClick={() => onSelectProduct && onSelectProduct(5)}
              title="Inspect Pirandai Bone Health Podi"
            >
              <div className="hero-center-aura" />
              <img 
                src="./images/products/pirandai-podi.png" 
                alt="Pirandai Podi" 
              />
              <div className="hero-spotlight-badge">
                <Sparkles size={13} />
                <span>Herbal Specialist • பிரண்டை</span>
              </div>
            </div>

            {/* Flanking Right Jar: Idli Podi */}
            <div 
              className="hero-floating-jar hero-jar-flank-right"
              onClick={() => onSelectProduct && onSelectProduct(1)}
              title="Inspect Traditional Idli Podi"
            >
              <img 
                src="./images/products/idli-podi.png" 
                alt="Idli Podi" 
              />
              <span className="hero-jar-tooltip">இட்லி பொடி • ₹130</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
