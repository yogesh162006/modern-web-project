import React, { useState, useEffect, Suspense, lazy } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import StorePage from './pages/StorePage';
import ProductDetailModal from './components/ProductDetailModal';
import QuickOrderDrawer from './components/QuickOrderDrawer';
import CustomCursor from './components/CustomCursor';
import { fetchProducts } from './services/api';
import { PRODUCTS } from './data/products';

const AdminPortal = lazy(() => import('./admin/AdminPortal'));

function isPathOrHashAdmin() {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return (
    path === '/admin' || 
    path.startsWith('/admin/') || 
    hash === '#admin' || 
    hash === '#/admin' || 
    hash.startsWith('#/admin')
  );
}

export default function App() {
  const [activePage, setActivePage] = useState(() => isPathOrHashAdmin() ? 'admin' : 'home');
  const [products, setProducts] = useState(PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeModalProduct, setActiveModalProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync browser back/forward and hash navigation
  useEffect(() => {
    const handleUrlChange = () => {
      if (isPathOrHashAdmin()) {
        setActivePage('admin');
      } else {
        setActivePage(prev => prev === 'admin' ? 'home' : prev);
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Initialize GSAP ScrollSmoother across the customer storefront application
  useEffect(() => {
    // If in admin mode, do NOT initialize ScrollSmoother; kill any lingering instances
    if (activePage === 'admin') {
      if (ScrollSmoother.get()) {
        ScrollSmoother.get().kill();
      }
      return;
    }

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Clean up any stale smoother instance from StrictMode
    if (ScrollSmoother.get()) {
      ScrollSmoother.get().kill();
    }

    const ctx = gsap.context(() => {
      ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 0.4, // Snappy, instant 0-latency response with micro-smoothing
        effects: false, // Avoid redundant matrix calculations
        smoothTouch: false, // 100% native 1:1 instant touch responsiveness on mobile
        ignoreMobileResize: true,
      });
    });

    const handleLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', handleLoad);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', handleLoad);
      ctx.revert();
    };
  }, [activePage === 'admin']);

  // When changing pages, reset scroll smoothly to top and refresh ScrollTrigger
  useEffect(() => {
    const smoother = ScrollSmoother.get();
    if (smoother) {
      smoother.scrollTo(0, false);
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [activePage]);

  // Refresh ScrollTrigger whenever product data loads or changes
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
    return () => clearTimeout(timer);
  }, [products]);

  // Load products from PHP API on mount (or static fallback)
  useEffect(() => {
    async function load() {
      try {
        const res = await fetchProducts();
        if (res && res.products && res.products.length > 0) {
          setProducts(res.products);
        }
      } catch (err) {
        console.warn('Using static products:', err);
      }
    }
    load();
  }, []);

  // Cart / Order Bag Management
  const handleAddToCart = (product, qty = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: (item.quantity || 1) + qty } 
            : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems(prev => 
      prev.map(item => item.id === productId ? { ...item, quantity: newQty } : item)
    );
  };

  const handleRemoveCartItem = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Category selection handler
  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    setActivePage('store');
    const smoother = ScrollSmoother.get();
    if (smoother) {
      smoother.scrollTo(0, false);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle page navigation including admin URL state
  const handleNavigate = (page) => {
    if (page === 'admin') {
      if (!window.location.pathname.startsWith('/admin')) {
        window.history.pushState(null, '', '#/admin');
      }
      setActivePage('admin');
    } else {
      if (activePage === 'admin') {
        if (window.location.pathname.startsWith('/admin')) {
          window.history.pushState(null, '', '/');
        } else if (window.location.hash.includes('admin')) {
          window.history.pushState(null, '', window.location.pathname || '/');
        }
      }
      setActivePage(page);
    }
  };

  // Callback when returning from admin portal back to customer storefront
  const handleBackToSite = async () => {
    // Re-fetch products so any admin additions/updates/price changes reflect live immediately
    try {
      const res = await fetchProducts();
      if (res && res.products && res.products.length > 0) {
        setProducts(res.products);
      }
    } catch (err) {
      console.warn('Re-fetching products on return to storefront:', err);
    }

    if (window.location.pathname.startsWith('/admin')) {
      window.history.pushState(null, '', '/');
    } else if (window.location.hash.includes('admin')) {
      window.history.pushState(null, '', window.location.pathname || '/');
    }
    setActivePage('home');
  };

  // Related products for modal
  const relatedProducts = activeModalProduct 
    ? products.filter(p => p.id !== activeModalProduct.id && (p.categorySlug === activeModalProduct.categorySlug || p.category === activeModalProduct.category))
    : [];

  // If active page is admin, render the full isolated Admin Portal
  if (activePage === 'admin') {
    return (
      <Suspense fallback={
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a100d',
          color: '#e7e5e4',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(45, 106, 79, 0.3)',
            borderTopColor: '#2d6a4f',
            borderRadius: '50%',
            animation: 'adminSpin 0.8s linear infinite',
            marginBottom: '1rem'
          }} />
          <p style={{ fontSize: '0.9rem', color: '#a8a29e', fontWeight: 500, letterSpacing: '0.04em' }}>
            Loading Dhanam Admin Portal...
          </p>
          <style>{`@keyframes adminSpin { to { transform: rotate(360deg); } }`}</style>
        </div>
      }>
        <AdminPortal onBackToSite={handleBackToSite} />
      </Suspense>
    );
  }

  return (
    <div className="app-root">
      {/* 144Hz Hardware-Accelerated Custom Cursor */}
      <CustomCursor />

      {/* Fixed Sticky Navigation Bar (Kept outside #smooth-wrapper to maintain fixed positioning) */}
      <Navbar 
        activePage={activePage}
        setActivePage={handleNavigate}
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => {
          handleNavigate('store');
          const smoother = ScrollSmoother.get();
          if (smoother) smoother.scrollTo(0, false);
          else window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* GSAP ScrollSmoother Structure */}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          {/* Active Page View */}
          {activePage === 'home' ? (
            <HomePage 
              products={products}
              onNavigateToStore={(cat = 'all') => handleSelectCategory(cat)}
              onSelectProduct={(prod) => setActiveModalProduct(prod)}
              onAddToCart={handleAddToCart}
              onSelectCategory={handleSelectCategory}
            />
          ) : (
            <StorePage 
              products={products}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onSelectProduct={(prod) => setActiveModalProduct(prod)}
              onAddToCart={handleAddToCart}
            />
          )}

          {/* Master Footer (Scrolls with page content) */}
          <Footer onNavigate={handleNavigate} />
        </div>
      </div>

      {/* Product Detail Modal (Outside smooth-wrapper to stay fixed on screen) */}
      {activeModalProduct && (
        <ProductDetailModal 
          product={activeModalProduct}
          onClose={() => setActiveModalProduct(null)}
          onAddToCart={handleAddToCart}
          relatedProducts={relatedProducts}
          onSelectRelated={(relProd) => setActiveModalProduct(relProd)}
        />
      )}

      {/* WhatsApp Quick Order Bag Drawer (Outside smooth-wrapper to stay fixed on screen) */}
      <QuickOrderDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
