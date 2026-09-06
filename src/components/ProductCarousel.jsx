import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductCarousel({ 
  products = [], 
  title, 
  subtitle, 
  pretitle, 
  onSelectProduct, 
  onAddToCart,
  darkTheme = false 
}) {
  const scrollRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const updateProgress = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollProgress((scrollLeft / maxScroll) * 100);
    } else {
      setScrollProgress(100);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', updateProgress);
      updateProgress();
    }
    return () => {
      if (el) el.removeEventListener('scroll', updateProgress);
    };
  }, [products]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e) => {
    setIsMouseDown(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.6;
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  if (!products || products.length === 0) return null;

  return (
    <div className={`vault-carousel-wrapper ${darkTheme ? 'vault-carousel-dark' : 'vault-carousel-sandal'}`}>
      {/* Header bar */}
      <div className="vault-carousel-header">
        <div className="vault-carousel-title-box">
          {pretitle && <div className="vault-editorial-pretitle">{pretitle}</div>}
          {title && <h2 className="vault-carousel-title">{title}</h2>}
          {subtitle && <p className="vault-carousel-subtitle">{subtitle}</p>}
        </div>

        {/* Carousel Navigation Arrow Controls */}
        <div className="vault-carousel-nav">
          <button 
            type="button" 
            onClick={() => scroll('left')} 
            className="vault-nav-arrow" 
            aria-label="Previous Slide"
            title="Previous products"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="vault-nav-divider" />
          <button 
            type="button" 
            onClick={() => scroll('right')} 
            className="vault-nav-arrow" 
            aria-label="Next Slide"
            title="Next products"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Sliding Product Container */}
      <div 
        className={`vault-slider-container ${isMouseDown ? 'is-dragging' : ''}`}
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {products.map((product, idx) => (
          <div key={product.id} className="vault-slider-cell">
            <ProductCard 
              product={product} 
              index={idx}
              onSelect={onSelectProduct} 
              onAddToCart={onAddToCart}
              darkTheme={darkTheme}
            />
          </div>
        ))}
      </div>

      {/* Interactive Progress Tracking */}
      <div className="vault-progress-track">
        <div 
          className="vault-progress-thumb" 
          style={{ width: `${Math.min(100, Math.max(12, scrollProgress))}%` }}
        />
        <div className="vault-progress-label">
          <span>№ 01</span>
          <span>№ 0{products.length}</span>
        </div>
      </div>
    </div>
  );
}
