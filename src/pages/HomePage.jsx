import React from 'react';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import Hero from '../components/Hero';
import ProductCarousel from '../components/ProductCarousel';
import CategoryShowcase from '../components/CategoryShowcase';
import BrandStory from '../components/BrandStory';
import WhyDhanam from '../components/WhyDhanam';
import { SITE_CONFIG } from '../config/siteConfig';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function HomePage({ 
  products = [], 
  onNavigateToStore, 
  onSelectProduct, 
  onAddToCart,
  onSelectCategory 
}) {
  useScrollReveal();

  const featuredProducts = products.filter(p => p.isFeatured);
  const heritageProducts = products.filter(p => p.categorySlug === 'heritage-podis' || p.category === 'Heritage Podis');
  const herbalProducts = products.filter(p => p.categorySlug === 'herbal-wellness' || p.category === 'Herbal & Wellness');

  const generalWhatsAppUrl = `https://wa.me/${SITE_CONFIG.whatsapp.phoneNumber}?text=${encodeURIComponent('Hi Dhanam Organics, I would like to place an order for your authentic stone-ground podis.')}`;

  return (
    <main className="master-homepage-canvas">
      {/* 1. Atmospheric Master Editorial Hero */}
      <Hero 
        onExploreStore={() => onNavigateToStore('all')} 
        onSelectProduct={(productId) => {
          const found = products.find(p => p.id === productId);
          if (found && onSelectProduct) onSelectProduct(found);
        }}
        featuredProducts={featuredProducts}
      />

      {/* 2. Continuous Organic Marquee Ribbon */}
      <div className="vault-marquee-strip">
        <div className="vault-marquee-track">
          <span>DHANAM ORGANICS</span>
          <span className="marquee-dot">✦</span>
          <span>பாரம்பரிய இயற்கை நலம்</span>
          <span className="marquee-dot">✦</span>
          <span>SLOW STONE-GROUND AT 28 RPM</span>
          <span className="marquee-dot">✦</span>
          <span>ZERO CHEMICAL PRESERVATIVES</span>
          <span className="marquee-dot">✦</span>
          <span>DIRECT FROM ORGANIC TAMIL FARMS</span>
          <span className="marquee-dot">✦</span>
          <span>AUTHENTIC ANCESTRAL RECIPES</span>
          <span className="marquee-dot">✦</span>
          <span>DHANAM ORGANICS</span>
          <span className="marquee-dot">✦</span>
          <span>பாரம்பரிய இயற்கை நலம்</span>
          <span className="marquee-dot">✦</span>
          <span>SLOW STONE-GROUND AT 28 RPM</span>
          <span className="marquee-dot">✦</span>
          <span>ZERO CHEMICAL PRESERVATIVES</span>
          <span className="marquee-dot">✦</span>
          <span>DIRECT FROM ORGANIC TAMIL FARMS</span>
          <span className="marquee-dot">✦</span>
        </div>
      </div>

      {/* 3. Horizontal Vault Collection 01: All 8 Stone-Ground Podis */}
      <section className="section-dark-forest reveal-on-scroll">
        <div className="container">
          <ProductCarousel 
            products={products}
            pretitle="THE COMPLETE VAULT • அனைத்து பொருட்கள்"
            title="Stone-Milled Heritage Collection"
            subtitle="Drag or slide horizontally across our entire small-batch harvest. Handcrafted in earthenware and milled on slow stones."
            onSelectProduct={onSelectProduct}
            onAddToCart={onAddToCart}
            darkTheme={true}
          />

          <div className="vault-center-action">
            <button 
              onClick={() => onNavigateToStore('all')} 
              className="vault-explore-all-btn"
            >
              <span>View Filterable Store Catalog (8 Podis)</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Warm Sandal Heritage Story (Magazine Spread) */}
      <BrandStory onExploreStory={() => onNavigateToStore('all')} />

      {/* 5. Asymmetrical Category Discovery */}
      <CategoryShowcase onSelectCategory={onSelectCategory} />

      {/* 6. Horizontal Vault Collection 02: Herbal & Therapeutic Spotlight */}
      <section className="section-medium-sandal reveal-on-scroll">
        <div className="container">
          <ProductCarousel 
            products={herbalProducts.length > 0 ? herbalProducts : featuredProducts}
            pretitle="ANCIENT SIDDHA WISDOM • மூலிகை நலம்"
            title="Therapeutic Herbal Formulations"
            subtitle="Medicinal bone-strengthening Pirandai, soothing Mudavattukal soup podi, and nutrient-dense Moringa."
            onSelectProduct={onSelectProduct}
            onAddToCart={onAddToCart}
            darkTheme={false}
          />
        </div>
      </section>

      {/* 7. Four Pillars of Purity (Deep Moss Timeline) */}
      <WhyDhanam />

      {/* 8. Direct WhatsApp Concierge Dispatch Banner */}
      <section className="vault-dispatch-cta reveal-on-scroll">
        <div className="container">
          <div className="dispatch-box">
            <div className="dispatch-kicker">PERSONAL KITCHEN ORDERING</div>
            <h2 className="dispatch-title">Wholesome Living, Delivered Doorstep</h2>
            <p className="dispatch-para">
              Every jar is freshly milled and dispatched directly from Tamil Nadu to your home. Connect with us on WhatsApp to order individual jars or custom family wellness assortments.
            </p>
            <div className="dispatch-btn-row">
              <button 
                onClick={() => onNavigateToStore('all')} 
                className="dispatch-primary-btn"
              >
                <span>Browse Store Catalog</span>
                <ArrowRight size={17} />
              </button>
              <a 
                href={generalWhatsAppUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="dispatch-whatsapp-btn"
              >
                <MessageCircle size={18} />
                <span>Message on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
