import React, { useState, useEffect } from 'react';
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

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [products, setProducts] = useState(PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeModalProduct, setActiveModalProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Initialize GSAP ScrollSmoother across the application
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 0.5, // Snappy, instant 0-latency response with micro-smoothing
      effects: false, // Avoid redundant matrix calculations for maximum FPS
      smoothTouch: false, // 100% native 1:1 instant touch responsiveness on mobile
      ignoreMobileResize: true,
    });

    return () => {
      smoother.kill();
    };
  }, []);

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

  // Related products for modal
  const relatedProducts = activeModalProduct 
    ? products.filter(p => p.id !== activeModalProduct.id && (p.categorySlug === activeModalProduct.categorySlug || p.category === activeModalProduct.category))
    : [];

  return (
    <div className="app-root">
      {/* 144Hz Hardware-Accelerated Custom Cursor */}
      <CustomCursor />

      {/* Fixed Sticky Navigation Bar (Kept outside #smooth-wrapper to maintain fixed positioning) */}
      <Navbar 
        activePage={activePage}
        setActivePage={setActivePage}
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => {
          setActivePage('store');
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
          <Footer onNavigate={(page) => {
            setActivePage(page);
          }} />
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
