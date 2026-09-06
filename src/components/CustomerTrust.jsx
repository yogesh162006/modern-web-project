import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';

export default function CustomerTrust() {
  const testimonials = [
    {
      name: 'Kavitha Ramachandran',
      city: 'Chennai, Tamil Nadu',
      product: 'Traditional Idli Podi & Karuveppilai Podi',
      quote: 'The Karuveppilai podi tastes exactly like what my grandmother used to make in Chettinad. Pure sesame oil aroma, zero artificial flavor or excess salt. Simply wonderful!'
    },
    {
      name: 'Dr. S. Sundaram',
      city: 'Coimbatore, Tamil Nadu',
      product: 'Pirandai Podi & Mudavattukal Soup',
      quote: 'As a practitioner of native wellness, finding genuine Mudavattukal soup podi prepared properly was difficult until I ordered from Dhanam. It gives immense comfort for joint stiffness.'
    },
    {
      name: 'Meenakshi Sundaram',
      city: 'Madurai, Tamil Nadu',
      product: 'Paruppu Podi & Instant Rasam Podi',
      quote: 'Instant Rasam podi saved our busy weekdays! 5 minutes in boiling tomato water and we have authentic home-style rasam. Ordering via WhatsApp was smooth and fast.'
    }
  ];

  return (
    <section id="customer-trust" className="testimonials-sandal-section">
      <div className="container">
        {/* Section Header */}
        <div className="testimonials-header">
          <span className="testimonials-kicker">VERIFIED EXPERIENCES • வாடிக்கையாளர் மதிப்புரை</span>
          <h2 className="testimonials-headline">Trusted by Households Across Tamil Nadu</h2>
          <p className="testimonials-sublead">
            Real stories from patrons who trust our kitchen for their daily breakfast, lunch, and wellness routines.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="testimonials-grid">
          {testimonials.map((t, idx) => (
            <div key={idx} className="testimonial-parchment-card">
              <div className="testimonial-top">
                <Quote size={24} className="testimonial-quote-glyph" />
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#C29B38" color="#C29B38" />
                  ))}
                </div>
              </div>

              <p className="testimonial-content">"{t.quote}"</p>

              <div className="testimonial-tag-row">
                <span className="testimonial-prod-tag">{t.product}</span>
              </div>

              <div className="testimonial-author-meta">
                <div>
                  <h4 className="testimonial-author-name">{t.name}</h4>
                  <span className="testimonial-author-city">{t.city}</span>
                </div>
                <div className="testimonial-verified-badge">
                  <CheckCircle size={14} />
                  <span>Verified Patron</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
