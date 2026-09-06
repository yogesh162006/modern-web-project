import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const pos = useRef({ x: -100, y: -100 });
  const mouse = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Check if device supports hover (disable on touch screens)
    if (window.matchMedia('(hover: none)').matches) return;

    setIsVisible(true);

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    // Event Delegation for hover triggers
    const handleMouseOver = (e) => {
      const target = e.target.closest('button, a, .vault-product-card, .vault-slider-container, input, select');
      if (target) {
        setIsHovered(true);
        if (target.classList.contains('vault-slider-container')) {
          setIsDragging(true);
        }
      } else {
        setIsHovered(false);
        setIsDragging(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    // 144Hz Smooth RAF loop for the ring
    let animationFrameId;
    const render = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.18;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="custom-cursor-layer" style={{ pointerEvents: 'none' }}>
      <div 
        ref={dotRef} 
        className={`cursor-dot ${isHovered ? 'is-hovered' : ''} ${isDragging ? 'is-dragging' : ''}`} 
      />
      <div 
        ref={ringRef} 
        className={`cursor-ring ${isHovered ? 'is-hovered' : ''} ${isDragging ? 'is-dragging' : ''}`} 
      />
    </div>
  );
}
