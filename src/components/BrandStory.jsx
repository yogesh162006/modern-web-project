import React from 'react';
import { Heart, Sparkles, Sprout, ShieldCheck } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

export default function BrandStory() {
  return (
    <section id="heritage-story" className="section story-section">
      <div className="container">
        <div className="story-grid">
          {/* Text Story */}
          <div className="story-text-block">
            <span className="section-pretitle">Ancestral Wisdom</span>
            <h2>Rooted in Soil, Ground with Care</h2>
            <p>
              In our grandmothers’ kitchens across Tamil Nadu, food was never simply fuel—it was medicine, balance, and pure daily joy. Freshly harvested leaves of <em>Curry Leaves</em> were carefully cleaned, sun-dried, and traditionally ground to preserve their natural aroma and goodness, creating a wholesome podi that brings together authentic flavour, cherished wisdom, and the timeless taste of home.
            </p>
            <p>
              At <strong>Dhanam Organics</strong>, we revive that sacred reverence for pure food. Modern high-speed commercial pulverizers generate scorching heat that destroys delicate natural nutrients and vital aromatics. That is why we adhere to slow, gentle stone-grinding and small-batch roasting—retaining the original aroma, taste, and wholesome healing nature of the harvest.
            </p>

            <div className="story-values-list">
              <div className="story-value-box">
                <h4>Slow Stone-Grinding</h4>
                <p>Gentle low-temperature milling ensures essential oils and active bio-compounds remain 100% intact.</p>
              </div>
              <div className="story-value-box">
                <h4>Direct Organic Sourcing</h4>
                <p>Handpicked ingredients harvested sustainably from certified and ethical organic farmers.</p>
              </div>
              <div className="story-value-box">
                <h4>Zero Chemical Preservatives</h4>
                <p>No synthetic chemicals, artificial anti-caking powders, MSG, or artificial food colorings.</p>
              </div>
              <div className="story-value-box">
                <h4>Small Batch Freshness</h4>
                <p>Crafted weekly in small batches so your family experiences the true aroma of a home-cooked harvest.</p>
              </div>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="story-visual-card">
            <img 
              src="./images/products/karuveppilai-podi.png" 
              alt="Dhanam Organics Karuveppilai Podi" 
              style={{ maxHeight: '280px', objectFit: 'contain', margin: '0 auto 16px' }}
            />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--color-forest-dark)', marginBottom: '6px' }}>
              கருவேப்பிலை பொடி
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--color-charcoal-muted)', lineHeight: '1.5' }}>
              Whole organic curry leaves slow-roasted with native lentils and hand-pounded black pepper. Real food as intended by nature.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
