import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import StorePage from './pages/StorePage';
import ProductDetailModal from './components/ProductDetailModal';
import QuickOrderDrawer from './components/QuickOrderDrawer';
import { fetchProducts } from './services/api';
import { PRODUCTS } from './data/products';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [products, setProducts] = useState(PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeModalProduct, setActiveModalProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Related products for modal
  const relatedProducts = activeModalProduct 
    ? products.filter(p => p.id !== activeModalProduct.id && (p.categorySlug === activeModalProduct.categorySlug || p.category === activeModalProduct.category))
    : [];

  return (
    <div className="app-root">
      {/* Navigation Bar */}
      <Navbar 
        activePage={activePage}
        setActivePage={setActivePage}
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => {
          setActivePage('store');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Pages */}
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

      {/* Footer */}
      <Footer onNavigate={(page) => {
        setActivePage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

      {/* Product Detail Modal */}
      {activeModalProduct && (
        <ProductDetailModal 
          product={activeModalProduct}
          onClose={() => setActiveModalProduct(null)}
          onAddToCart={handleAddToCart}
          relatedProducts={relatedProducts}
          onSelectRelated={(relProd) => setActiveModalProduct(relProd)}
        />
      )}

      {/* WhatsApp Quick Order Bag Drawer */}
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
