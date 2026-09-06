import React from 'react';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import Hero from '../components/Hero';
import CategoryShowcase from '../components/CategoryShowcase';
import ProductCard from '../components/ProductCard';
import BrandStory from '../components/BrandStory';
import WhyDhanam from '../components/WhyDhanam';
import CustomerTrust from '../components/CustomerTrust';
import { SITE_CONFIG } from '../config/siteConfig';

export default function HomePage({ 
  products = [], 
  onNavigateToStore, 
  onSelectProduct, 
  onAddToCart,
  onSelectCategory 
}) {
  const featuredProducts = products.filter(p => p.isFeatured);
  const generalWhatsAppUrl = `https://wa.me/${SITE_CONFIG.whatsapp.phoneNumber}?text=${encodeURIComponent('Hi Dhanam Organics, I would like to place an order for your organic traditional podis.')}`;

  return (
    <main>
      {/* 1. Cinematic Hero Section */}
      <Hero 
        onExploreStore={() => onNavigateToStore('all')} 
        onSelectProduct={(productId) => {
          const found = products.find(p => p.id === productId);
          if (found) onSelectProduct(found);
        }}
        featuredProducts={featuredProducts}
      />

      {/* 2. Featured Products Section */}
      <section className="section" style={{ background: '#FFFFFF' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="section-pretitle">Hand-Roasted Favorites</span>
              <h2 className="section-title" style={{ marginBottom: '4px' }}>Featured Harvest</h2>
              <p className="section-subtitle">
                Our most celebrated stone-ground podis, crafted fresh every week.
              </p>
            </div>

            <button 
              onClick={() => onNavigateToStore('all')} 
              className="btn btn-secondary"
            >
              <span>View All 8 Products</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="products-grid">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onSelect={onSelectProduct} 
                onAddToCart={onAddToCart} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Category Showcase */}
      <CategoryShowcase onSelectCategory={onSelectCategory} />

      {/* 4. Brand Heritage & Ancestral Story */}
      <BrandStory />

      {/* 5. Why Dhanam Organics */}
      <WhyDhanam />

      {/* 6. Customer Trust & Reviews */}
      <CustomerTrust />

      {/* 7. Final Shopping CTA */}
      <section className="shopping-cta-section">
        <div className="container">
          <div className="cta-content-box">
            <h2>Pure Food for Wholesome Living</h2>
            <p>
              Experience the authentic taste of Tamil Nadu's traditional kitchens. Order your favorite stone-milled podis directly via WhatsApp with doorstep dispatch.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => onNavigateToStore('all')} 
                className="btn btn-primary"
                style={{ backgroundColor: 'var(--color-gold)', borderColor: 'var(--color-gold)', color: '#1C1E1B' }}
              >
                <span>Browse All Products</span>
                <ArrowRight size={17} />
              </button>
              <a 
                href={generalWhatsAppUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-whatsapp"
              >
                <MessageCircle size={18} />
                <span>Order on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
