import React from 'react';
import { ArrowRight, Leaf, Sparkles } from 'lucide-react';

export default function CategoryShowcase({ onSelectCategory }) {
  const categories = [
    {
      id: 'heritage-podis',
      title: 'Heritage Podis & Daily Staples',
      tamil: 'பாரம்பரிய இட்லி & சாதப் பொடிகள்',
      count: '05 Authentic Varieties',
      desc: 'Slow-roasted lentils, sun-dried chillies, and stone-pounded sesame prepared for morning hot idlis and steaming lunch rice with pure ghee.',
      items: ['Traditional Idli Podi', 'Paruppu Podi', 'Karuveppilai Podi', 'Ellu Idli Podi', 'Instant Rasam Podi'],
      themeClass: 'cat-card-heritage'
    },
    {
      id: 'herbal-wellness',
      title: 'Herbal & Medicinal Formulations',
      tamil: 'மூலிகை நலம் & பாரம்பரிய சூப் பொடிகள்',
      count: '03 Therapeutic Formulations',
      desc: 'Time-tested Siddha formulations using rare medicinal flora like Pirandai for bone strength, Mudavattukal fern rhizome for joint ease, and nutrient-dense Moringa.',
      items: ['Pirandai Podi', 'Mudavattukal Soup Podi', 'Murungai Idli Podi'],
      themeClass: 'cat-card-herbal'
    }
  ];

  return (
    <section className="category-split-section">
      <div className="container">
        {/* Header */}
        <div className="category-section-header">
          <span className="category-kicker">CURATED CATEGORIES • வகைப்பாடு</span>
          <h2 className="category-headline">Two Paths of Authentic Nutrition</h2>
          <p className="category-subtitle">
            Whether preparing daily comforting family meals or seeking ancient herbal wellness, our stone-ground offerings are pure and uncompromised.
          </p>
        </div>

        {/* Asymmetric Category Split Grid */}
        <div className="category-split-grid">
          {categories.map((cat) => (
            <div key={cat.id} className={`category-split-card ${cat.themeClass}`}>
              <div className="category-card-top">
                <span className="category-variety-count">{cat.count}</span>
                <span className="category-tamil-badge">{cat.tamil}</span>
              </div>

              <h3 className="category-card-heading">{cat.title}</h3>
              <p className="category-card-narrative">{cat.desc}</p>

              {/* Product Pills in Category */}
              <div className="category-item-pills">
                {cat.items.map((item, idx) => (
                  <span key={idx} className="category-pill">{item}</span>
                ))}
              </div>

              <div className="category-card-bottom">
                <button 
                  onClick={() => onSelectCategory && onSelectCategory(cat.id)}
                  className="category-explore-btn"
                >
                  <span>Explore Collection</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
