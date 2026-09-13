import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle, Eye, ShieldCheck } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

export default function Product3DExperience({ 
  products = [], 
  onSelectProduct, 
  onAddToCart 
}) {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  // 4 Signature spotlight products from existing catalog
  const targetImages = ['idli-podi.png', 'karuveppilai-podi.png', 'pirandai-podi.png', 'kollu-podi.png'];
  const spotlightProducts = targetImages.map(imgName => 
    products.find(p => p.image && p.image.includes(imgName))
  ).filter(Boolean);

  // Fallback to first 4 products if specific ones aren't matched
  const items = spotlightProducts.length >= 4 
    ? spotlightProducts.slice(0, 4) 
    : products.slice(0, 4);

  useEffect(() => {
    if (!sectionRef.current || items.length === 0) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const jarItems = gsap.utils.toArray('.product-3d-jar-item');
      const cardPanes = gsap.utils.toArray('.product-3d-card-pane');

      // Initialize initial placement:
      // Item 0 is active and fully visible, subsequent items placed in depth with autoAlpha: 0
      jarItems.forEach((jar, i) => {
        if (i === 0) {
          gsap.set(jar, { 
            autoAlpha: 1, 
            scale: 1, 
            rotateY: 0, 
            rotateX: 0, 
            x: 0, 
            z: 0, 
            pointerEvents: 'auto' 
          });
        } else {
          gsap.set(jar, { 
            autoAlpha: 0, 
            scale: 0.88, 
            rotateY: 18, 
            rotateX: -3, 
            x: 50, 
            z: -120, 
            pointerEvents: 'none' 
          });
        }
      });

      cardPanes.forEach((card, i) => {
        if (i === 0) {
          gsap.set(card, { autoAlpha: 1, y: 0, pointerEvents: 'auto' });
        } else {
          gsap.set(card, { autoAlpha: 0, y: 20, pointerEvents: 'none' });
        }
      });

      // Master ScrollTrigger timeline pinned naturally — no React re-renders on scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${(items.length - 1) * 90}%`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });

      // Step-by-step physical 3D rotation and depth transitions
      const step = 1 / (items.length - 1);

      for (let i = 0; i < items.length - 1; i++) {
        const time = i * step;

        // Current product rotates slightly and moves back into depth
        tl.to(jarItems[i], {
          autoAlpha: 0,
          scale: 0.88,
          rotateY: -18,
          rotateX: 4,
          x: -50,
          z: -120,
          pointerEvents: 'none',
          duration: step * 0.9,
          ease: 'power2.inOut'
        }, time)
        .to(cardPanes[i], {
          autoAlpha: 0,
          y: -18,
          pointerEvents: 'none',
          duration: step * 0.75,
          ease: 'power2.in'
        }, time);

        // Next product enters smoothly from depth and settles into place
        tl.fromTo(jarItems[i + 1], {
          autoAlpha: 0,
          scale: 0.88,
          rotateY: 18,
          rotateX: -3,
          x: 50,
          z: -120,
          pointerEvents: 'none'
        }, {
          autoAlpha: 1,
          scale: 1,
          rotateY: 0,
          rotateX: 0,
          x: 0,
          z: 0,
          pointerEvents: 'auto',
          duration: step * 0.9,
          ease: 'power2.inOut'
        }, time + step * 0.15)
        .fromTo(cardPanes[i + 1], {
          autoAlpha: 0,
          y: 20,
          pointerEvents: 'none'
        }, {
          autoAlpha: 1,
          y: 0,
          pointerEvents: 'auto',
          duration: step * 0.75,
          ease: 'power2.out'
        }, time + step * 0.25);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [items.length]);

  if (!items || items.length === 0) return null;

  return (
    <section id="signature-3d-experience" ref={sectionRef} className="product-3d-showcase-section">
      <div className="product-3d-viewport-container" ref={containerRef}>
        
        {/* Subtle dark ambient depth (No artificial shapes or green circles) */}
        <div className="product-3d-deep-ambience" aria-hidden="true" />

        <div className="container product-3d-stage-grid">
          
          {/* Left: Physical Product Presentation Stage */}
          <div className="product-3d-display-stage">
            <div className="product-3d-perspective-box">
              {items.map((product) => (
                <div 
                  key={product.id} 
                  className="product-3d-jar-item"
                  onClick={() => onSelectProduct && onSelectProduct(product)}
                  title={`View ${product.name}`}
                >
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="product-3d-jar-image" 
                  />
                  {/* Natural physical floor shadow beneath the jar */}
                  <div className="product-3d-ground-shadow" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Clean, Unobstructed Product Information Area */}
          <div className="product-3d-details-stage">
            <div className="product-3d-cards-carrier">
              {items.map((product) => {
                const productWhatsAppUrl = `https://wa.me/${SITE_CONFIG.whatsapp.phoneNumber}?text=${encodeURIComponent(
                  `Hi Dhanam Organics, I would like to order ${product.name} (${product.weight}) for ₹${product.price}.`
                )}`;

                return (
                  <div 
                    key={product.id} 
                    className="product-3d-card-pane"
                  >
                    <div className="product-3d-category-pill">
                      <span>{product.category}</span>
                      {product.badge && (
                        <span className="product-3d-badge-subtle">{product.badge}</span>
                      )}
                    </div>

                    <h3 className="product-3d-name-tamil">{product.tamilName}</h3>
                    <h4 className="product-3d-name-english">{product.englishName || product.name}</h4>

                    <div className="product-3d-price-lockup">
                      <span className="product-3d-current-price">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="product-3d-orig-price">₹{product.originalPrice}</span>
                      )}
                      <span className="product-3d-weight-tag">{product.weight}</span>
                    </div>

                    <p className="product-3d-description-text">
                      {product.tamildescription || product.description}
                    </p>

                    {/* Benefits List */}
                    {product.benefits && product.benefits.length > 0 && (
                      <div className="product-3d-benefits-strip">
                        {product.benefits.slice(0, 3).map((benefit, bIdx) => (
                          <div key={bIdx} className="product-3d-benefit-pill">
                            <ShieldCheck size={13} className="benefit-icon" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons: Pure, Unobstructed, High Z-Index */}
                    <div className="product-3d-actions-cluster">
                      <a 
                        href={productWhatsAppUrl}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="product-3d-order-whatsapp-btn"
                        title="Order on WhatsApp"
                      >
                        <MessageCircle size={16} />
                        <span>Order on WhatsApp</span>
                      </a>

                      <button 
                        type="button"
                        onClick={() => onSelectProduct && onSelectProduct(product)}
                        className="product-3d-quick-view-btn"
                        title="View Product Specifications"
                      >
                        <Eye size={15} />
                        <span>Quick View</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
