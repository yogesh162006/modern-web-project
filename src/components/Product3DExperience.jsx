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

    const mm = gsap.matchMedia(sectionRef);

    // =========================================================================
    // 1. DESKTOP EXPERIENCE (min-width: 1025px)
    // Preserved 100% — existing desktop behavior is completely undisturbed
    // =========================================================================
    mm.add("(min-width: 1025px)", () => {
      const jarItems = gsap.utils.toArray('.product-3d-jar-item');
      const cardPanes = gsap.utils.toArray('.product-3d-card-pane');

      // Initialize initial placement:
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

      // Master ScrollTrigger timeline pinned naturally
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

      const step = 1 / (items.length - 1);

      for (let i = 0; i < items.length - 1; i++) {
        const time = i * step;

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
    });

    // =========================================================================
    // 2. MOBILE & TABLET EXPERIENCE (max-width: 1024px)
    // Non-colliding, depth-sorted, centered 3D transitions with zero overlap
    // =========================================================================
    mm.add("(max-width: 1024px)", () => {
      const isTablet = window.innerWidth >= 641;
      const jarItems = gsap.utils.toArray('.product-3d-jar-item');
      const cardPanes = gsap.utils.toArray('.product-3d-card-pane');

      // Calibrated parameters: controlled rotation, depth, scale, and trajectory
      const rotY = isTablet ? 11 : 8;
      const rotX = isTablet ? 2.2 : 1.6;
      const transX = isTablet ? 24 : 14;
      const transZ = isTablet ? -60 : -35;
      const depthScale = isTablet ? 0.92 : 0.94;

      // 1. Precise Initial Placement with explicit zIndex and center transform
      jarItems.forEach((jar, i) => {
        if (i === 0) {
          gsap.set(jar, {
            autoAlpha: 1,
            scale: 1,
            rotateY: 0,
            rotateX: 0,
            x: 0,
            z: 0,
            xPercent: -50,
            yPercent: -50,
            zIndex: 10,
            pointerEvents: 'auto'
          });
        } else {
          gsap.set(jar, {
            autoAlpha: 0,
            scale: depthScale,
            rotateY: rotY,
            rotateX: -rotX,
            x: transX,
            z: transZ,
            xPercent: -50,
            yPercent: -50,
            zIndex: 1,
            pointerEvents: 'none'
          });
        }
      });

      cardPanes.forEach((card, i) => {
        if (i === 0) {
          gsap.set(card, {
            autoAlpha: 1,
            y: 0,
            zIndex: 10,
            pointerEvents: 'auto'
          });
        } else {
          gsap.set(card, {
            autoAlpha: 0,
            y: 10,
            zIndex: 1,
            pointerEvents: 'none'
          });
        }
      });

      // 2. Natural, calibrated touch scroll distance:
      // 35vh per product on mobile (approx. 1 natural thumb swipe), 45vh on tablet
      const totalTransitions = items.length - 1;
      const scrollDistanceVh = totalTransitions * (isTablet ? 45 : 35);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${scrollDistanceVh}vh`,
          pin: true,
          scrub: 0.2, // Ultra-responsive 0.2s scrub: instantaneous 1:1 finger tracking, zero lag
          anticipatePin: 0,
          invalidateOnRefresh: true,
        }
      });

      // Subtle atmospheric lighting drift on scroll
      const auraSage = sectionRef.current.querySelector('.product-3d-aura-sage');
      const auraMist = sectionRef.current.querySelector('.product-3d-aura-mist');
      if (auraSage && auraMist) {
        tl.to(auraSage, {
          x: '4%',
          y: '5%',
          duration: totalTransitions,
          ease: 'none'
        }, 0)
        .to(auraMist, {
          x: '-4%',
          y: '-3%',
          duration: totalTransitions,
          ease: 'none'
        }, 0);
      }

      // 3. Staggered non-colliding transitions:
      // Each transition occupies exactly 1.0 unit of timeline time: [i, i + 1]
      for (let i = 0; i < totalTransitions; i++) {
        const tStart = i * 1.0;
        const currentJar = jarItems[i];
        const nextJar = jarItems[i + 1];
        const currentCard = cardPanes[i];
        const nextCard = cardPanes[i + 1];

        // Phase A: Current Product gracefully rotates into negative depth [tStart + 0.08 -> tStart + 0.60]
        tl.to(currentJar, {
          autoAlpha: 0,
          scale: depthScale,
          rotateY: -rotY,
          rotateX: rotX,
          x: -transX,
          z: transZ,
          duration: 0.52,
          ease: 'power1.inOut',
          onStart: () => {
            gsap.set(currentJar, { zIndex: 4, pointerEvents: 'none' });
          }
        }, tStart + 0.08)
        .to(currentCard, {
          autoAlpha: 0,
          y: -10,
          duration: 0.38,
          ease: 'power1.in',
          onStart: () => {
            gsap.set(currentCard, { zIndex: 4, pointerEvents: 'none' });
          }
        }, tStart + 0.08);

        // Phase B: Next Product enters smoothly through depth [tStart + 0.28 -> tStart + 0.80]
        tl.fromTo(nextJar, {
          autoAlpha: 0,
          scale: depthScale,
          rotateY: rotY,
          rotateX: -rotX,
          x: transX,
          z: transZ,
          xPercent: -50,
          yPercent: -50,
          zIndex: 8,
          pointerEvents: 'none'
        }, {
          autoAlpha: 1,
          scale: 1,
          rotateY: 0,
          rotateX: 0,
          x: 0,
          z: 0,
          xPercent: -50,
          yPercent: -50,
          duration: 0.52,
          ease: 'power1.out',
          immediateRender: false,
          onComplete: () => {
            gsap.set(nextJar, { zIndex: 10, pointerEvents: 'auto' });
          }
        }, tStart + 0.28)
        .fromTo(nextCard, {
          autoAlpha: 0,
          y: 10,
          zIndex: 8,
          pointerEvents: 'none'
        }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.44,
          ease: 'power1.out',
          immediateRender: false,
          onComplete: () => {
            gsap.set(nextCard, { zIndex: 10, pointerEvents: 'auto' });
          }
        }, tStart + 0.34);

        // Phase C: Settle & Rest [tStart + 0.80 -> tStart + 1.00]
        // Next product is completely settled and interactive. Outgoing product is 100% hidden.
        // A 0.28 unit rest window ensures zero tween collision before the next transition starts.
      }
    });

    return () => mm.revert();
  }, [items.length]);

  if (!items || items.length === 0) return null;

  return (
    <section id="signature-3d-experience" ref={sectionRef} className="product-3d-showcase-section">
      <div className="product-3d-viewport-container" ref={containerRef}>
        
        {/* Living Organic Atmosphere (Behind product, Layer 1) */}
        <div className="product-3d-atmosphere" aria-hidden="true">
          <div className="product-3d-aura-sage" />
          <div className="product-3d-aura-mist" />
          <div className="product-3d-aura-pedestal" />
          <div className="product-3d-aura-vignette" />
        </div>

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
