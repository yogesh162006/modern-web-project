import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function BrandStory({ onExploreStory }) {
  return (
    <section id="heritage-story" className="heritage-editorial-section">
      <div className="heritage-watermark-bg">பாரம்பரியம்</div>

      <div className="container">
        {/* Section Header */}
        <div className="heritage-section-header">
          <div className="heritage-kicker">OUR LIVING PHILOSOPHY • மரபு வழி மருத்துவம்</div>
          <h2 className="heritage-headline">
            Why We Refuse to Mill Above 28 RPM.
          </h2>
          <p className="heritage-sublead">
            In ancestral Tamil households, food was crafted with mindful patience. We preserve that holy reverence in every batch we produce.
          </p>
        </div>

        {/* Magazine Grid Layout */}
        <div className="heritage-magazine-grid">
          {/* Left Column: Authentic Story Narrative */}
          <div className="heritage-narrative-block">
            <p className="heritage-dropcap-para">
              <span className="heritage-dropcap">I</span>n our grandmothers’ kitchens across Tamil Nadu, food was never simply fuel—it was medicine, balance, and pure daily joy. Freshly harvested leaves of <em>Curry Leaves</em> were carefully cleaned, sun-dried, and traditionally ground to preserve their natural aroma and goodness, creating a wholesome podi that brings together authentic flavour, cherished wisdom, and the timeless taste of home.
            </p>

            <p className="heritage-standard-para">
              Modern industrial high-speed pulverizers operate at thousands of revolutions per minute, creating scorching frictional heat that destroys delicate natural nutrients, alters volatile spice oils, and scorches the harvest. That is why <strong>Dhanam Organics</strong> strictly adheres to low-temperature slow stone-milling and earthen pot roasting—locking in genuine aroma, vibrant color, and ancestral therapeutic potency.
            </p>

            {/* 4 Tenets with Roman Numerals */}
            <div className="heritage-tenets-grid">
              <div className="heritage-tenet-item">
                <span className="tenet-num">I</span>
                <div>
                  <h4>Stone-Ground Milling</h4>
                  <p>Preserves delicate essential oils and rich roasted bouquet.</p>
                </div>
              </div>

              <div className="heritage-tenet-item">
                <span className="tenet-num">II</span>
                <div>
                  <h4>Zero Synthetic Additives</h4>
                  <p>Never any MSG, artificial colorings, or chemical flow agents.</p>
                </div>
              </div>

              <div className="heritage-tenet-item">
                <span className="tenet-num">III</span>
                <div>
                  <h4>Direct Ethical Harvest</h4>
                  <p>Sourced from native organic growers committed to soil fertility.</p>
                </div>
              </div>

              <div className="heritage-tenet-item">
                <span className="tenet-num">IV</span>
                <div>
                  <h4>Fresh Small-Batches</h4>
                  <p>Milled weekly to ensure your family enjoys peak freshness.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Product Jar Spotlight */}
          <div className="heritage-spotlight-card">
            <div className="heritage-jar-pedestal">
              <img 
                src="./images/products/karuveppilai-podi.png" 
                alt="Karuveppilai Podi Heritage Spotlight" 
                className="heritage-spotlight-img"
              />
            </div>
            <div className="heritage-spotlight-meta">
              <span className="heritage-spotlight-tag">NATIVE HARVEST</span>
              <h3 className="heritage-spotlight-title">கருவேப்பிலை பொடி</h3>
              <p className="heritage-spotlight-desc">
                Handpicked organic curry leaves, sun-dried and stone-roasted with heirloom lentils. Naturally rich in dietary iron and essential antioxidants.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
