import React, { useState } from 'react';
import { ArrowDownRight, ArrowRight, Sparkles } from 'lucide-react';
import Aurora from './Aurora';
import { smoothScrollTo } from '../utils/scroll';

export default function AuroraExperience({ onExploreProducts, onDiscoverStory }) {
  const [activeTenet, setActiveTenet] = useState(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const tenets = [
    { label: 'NATURAL', desc: 'Sourced directly from native Tamil soil' },
    { label: 'FRESH', desc: 'Stone-milled weekly in small batches' },
    { label: 'PURE', desc: 'Zero artificial preservatives or MSG' },
    { label: 'LIVING', desc: 'Low-heat 28 RPM milling protects nutrients' },
    { label: 'ORGANIC', desc: 'Sun-dried native herbs and heirloom grains' }
  ];

  const handleExploreClick = () => {
    if (onExploreProducts) {
      onExploreProducts();
    } else {
      smoothScrollTo('#vault-products', 75);
    }
  };

  const handleStoryClick = () => {
    if (onDiscoverStory) {
      onDiscoverStory();
    } else {
      smoothScrollTo('#heritage-story', 75);
    }
  };

  return (
    <section id="living-aurora" className="aurora-fullscreen-section reveal-on-scroll">
      {/* 1. Full-Screen Edge-to-Edge WebGL Canvas (100vw x 100vh) */}
      <div className="aurora-fullscreen-canvas">
        <Aurora
          colorStops={["#27ff4b", "#ffffff", "#17d723"]}
          amplitude={0.6}
          blend={0.8}
          speed={0.95}
          hoverBoost={isButtonHovered}
        />
      </div>

      {/* 2. Seamless Atmospheric Transition Blends (Top & Bottom Smooth Gradients) */}
      <div className="aurora-transition-top" aria-hidden="true" />
      <div className="aurora-transition-bottom" aria-hidden="true" />
      <div className="aurora-radial-vignette" aria-hidden="true" />

      {/* 3. Floating Content Layer (No Card, No Box, Floating Over the Aurora Atmosphere) */}
      <div className="aurora-floating-content">
        <div className="container aurora-content-container">
          <div className="aurora-editorial-flow">
            {/* Small Editorial Label */}
            <div className="aurora-kicker-badge">
              <span className="aurora-kicker-dot" />
              <span>THE LIVING ESSENCE • உயிர் தத்துவம்</span>
            </div>

            {/* Grand Editorial Headline */}
            <h2 className="aurora-grand-headline">
              Where Pure Soil
              <span className="aurora-headline-accent">Meets Living Energy.</span>
              <span className="aurora-tamil-subline">மரபு வழி இயற்கை நலம் • 28 RPM கல் அரைப்பு</span>
            </h2>

            {/* Existing Authentic Message */}
            <p className="aurora-editorial-desc">
              In ancestral tradition, food is living life-force. By slow stone-milling at 28 RPM and earthenware roasting, we lock in delicate aroma, deep natural color, and therapeutic potency from Tamil soil directly to your kitchen.
            </p>

            {/* Existing Real Action Buttons Floating Naturally */}
            <div className="aurora-actions-group">
              <button
                type="button"
                onClick={handleExploreClick}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
                className="aurora-action-primary"
                title="Explore Stone-Milled Heritage Collection"
              >
                <span>Explore Our Products</span>
                <ArrowDownRight size={18} className="aurora-btn-icon" />
              </button>

              <button
                type="button"
                onClick={handleStoryClick}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
                className="aurora-action-secondary"
                title="Discover Our Stone Milling Philosophy"
              >
                <span>Discover Our Story</span>
                <ArrowRight size={17} className="aurora-btn-icon" />
              </button>
            </div>

            {/* Bottom Floating Meta: Living Tenets Strip & Emblem */}
            <div className="aurora-bottom-meta">
              <div className="aurora-floating-seal">
                <div className="aurora-emblem-halo" />
                <img 
                  src="./images/logo/logo-do.png" 
                  alt="Dhanam Organics Living Emblem" 
                  className="aurora-emblem-asset" 
                />
                <span className="aurora-seal-caption">HANDMADE IN TAMIL NADU</span>
              </div>

              {/* Five Living Tenets Strip */}
              <div className="aurora-tenets-bar">
                {tenets.map((t, idx) => (
                  <React.Fragment key={t.label}>
                    <button
                      type="button"
                      className={`aurora-tenet-pill ${activeTenet === t.label ? 'is-active' : ''}`}
                      onMouseEnter={() => setActiveTenet(t.label)}
                      onMouseLeave={() => setActiveTenet(null)}
                      onClick={() => setActiveTenet(activeTenet === t.label ? null : t.label)}
                      aria-label={t.label}
                    >
                      <span className="tenet-text">{t.label}</span>
                      {activeTenet === t.label && (
                        <span className="tenet-popup-tip">{t.desc}</span>
                      )}
                    </button>
                    {idx < tenets.length - 1 && (
                      <span className="aurora-tenet-separator" aria-hidden="true">✦</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Interactive Guidance Indicator */}
              <div className="aurora-guidance-pill">
                <Sparkles size={12} className="aurora-guidance-icon" />
                <span>Move cursor or touch to guide the living aurora</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}