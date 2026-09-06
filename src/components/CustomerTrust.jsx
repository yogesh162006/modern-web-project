import React from 'react';
import { Star } from 'lucide-react';

export default function CustomerTrust() {
  const reviews = [
    {
      name: 'Kavitha Ramasamy',
      city: 'Chennai',
      product: 'Pirandai Podi & Idli Podi',
      quote: 'The aroma when opening the jar brought back memories of my grandmother’s kitchen in Thanjavur. The Pirandai Podi has become a weekly ritual for our family joint wellness. Unbelievably fresh!'
    },
    {
      name: 'Dr. S. Karthikeyan',
      city: 'Coimbatore',
      product: 'Mudavattukal Soup Podi',
      quote: 'As an ayurvedic practitioner, finding authentic Mudavattukal rhizome powder that is genuine and free of adulteration is rare. Dhanam Organics has delivered authentic purity.'
    },
    {
      name: 'Meenakshi Sundaram',
      city: 'Madurai',
      product: 'Karuveppilai & Paruppu Podi',
      quote: 'Ordering on WhatsApp was instant and simple. The podis arrived cleanly packaged and tasted freshly roasted. My children love the Paruppu podi with hot steamed rice and ghee!'
    }
  ];

  return (
    <section id="customer-trust" className="section" style={{ background: '#FFFFFF' }}>
      <div className="container">
        <div className="section-header text-center">
          <span className="section-pretitle">Verified Community</span>
          <h2 className="section-title">Loved Across Tamil Nadu Homes</h2>
          <p className="section-subtitle">
            Authentic feedback from families who treasure pure heritage taste.
          </p>
        </div>

        <div className="testimonials-grid">
          {reviews.map((rev, index) => (
            <div key={index} className="testimonial-card">
              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#C88A2E" stroke="#C88A2E" />
                ))}
              </div>
              <p className="testimonial-quote">"{rev.quote}"</p>
              <div className="testimonial-author">
                <div>
                  <div className="author-name">{rev.name}</div>
                  <div className="author-city">{rev.city} • Verified Customer</div>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--color-forest)', fontWeight: 600, background: 'var(--color-badge-bg)', padding: '2px 6px', borderRadius: '2px' }}>
                  {rev.product}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
