import { ScrollSmoother } from 'gsap/ScrollSmoother';

/**
 * Smoothly scrolls to a section target using GSAP ScrollSmoother (or native fallback).
 * @param {string|Element} target - CSS selector (e.g. '#vault-products') or DOM Element
 * @param {number} offsetTop - Top offset in pixels (e.g. 80 for navbar clearance)
 */
export function smoothScrollTo(target, offsetTop = 80) {
  try {
    const smoother = ScrollSmoother.get();
    if (smoother) {
      smoother.scrollTo(target, true, `top ${offsetTop}px`);
      return;
    }
  } catch (err) {
    // Fallback if ScrollSmoother is not active
  }

  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (el) {
    const yOffset = -offsetTop;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

export default smoothScrollTo;