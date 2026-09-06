import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { CATEGORIES } from '../data/products';

export default function CategoryShowcase({ onSelectCategory }) {
  const categoryHighlights = [
    {
      id: 'heritage-podis',
      name: 'Heritage Podis',
      tamilName: 'பாரம்பரிய இட்லி & சாதப் பொடிகள்',
      desc: 'Stone-roasted dal, hand-pounded idli gunpowder, aromatic curry leaf, and roasted sesame blends made strictly according to ancient South Indian household tradition.',
      featuredProducts: ['Traditional Idli Podi', 'Paruppu Podi', 'Karuveppilai Podi', 'Ellu Podi', 'Instant Rasam'],
      count: '5 Varieties',
      badge: 'Daily Staple'
    },
    {
      id: 'herbal-wellness',
      name: 'Herbal & Medicinal Wellness',
      tamilName: 'மூலிகை நலம் & பாரம்பரிய சூப் பொடிகள்',
      desc: 'Rare herbal remedies rooted in Tamil Siddha medicine, including bone-nourishing Pirandai, joint-strengthening Mudavattukal soup rhizome, and nutrient-dense Moringa.',
      featuredProducts: ['Pirandai Podi', 'Mudavattukal Soup Podi', 'Murungai Podi'],
      count: '3 Varieties',
      badge: 'Therapeutic'
    }
  ];

  return (
    <section className="section" style={{ background: '#FAF7F2' }}>
      <div className="container">
        <div className="section-header text-center">
          <span className="section-pretitle">Crafted with Purpose</span>
          <h2 className="section-title">Explore by Category</h2>
          <p className="section-subtitle">
            Every blend is slow-roasted over gentle heat to retain authentic essential oils, natural color, and medicinal potency.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
          {categoryHighlights.map((cat) => (
            <div 
              key={cat.id}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'var(--transition-smooth)'
              }}
              className="category-showcase-card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-crimson)', background: '#FFF1E6', padding: '3px 8px', borderRadius: '2px' }}>
                  {cat.badge}
                </span>
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#718096' }}>
                  {cat.count}
                </span>
              </div>

              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 700, color: 'var(--color-forest-dark)', marginBottom: '4px' }}>
                {cat.name}
              </h3>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-forest)', marginBottom: '14px' }}>
                {cat.tamilName}
              </div>

              <p style={{ fontSize: '14.5px', color: 'var(--color-charcoal-muted)', lineHeight: '1.6', marginBottom: '22px', flex: 1 }}>
                {cat.desc}
              </p>

              <div style={{ borderTop: '1px dashed var(--color-border)', paddingTop: '16px', marginTop: 'auto' }}>
                <button 
                  onClick={() => onSelectCategory(cat.id)}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'space-between' }}
                >
                  <span>Explore {cat.name}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
