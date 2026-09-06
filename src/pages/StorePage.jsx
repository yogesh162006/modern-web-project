import React, { useState, useMemo } from 'react';
import { Search, X, MessageCircle, SlidersHorizontal, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from '../data/products';
import { SITE_CONFIG } from '../config/siteConfig';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function StorePage({ 
  products = [], 
  selectedCategory = 'all', 
  onSelectCategory, 
  onSelectProduct, 
  onAddToCart,
  initialSearch = ''
}) {
  useScrollReveal();

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured');

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category Filter
    if (selectedCategory && selectedCategory !== 'all') {
      list = list.filter(p => p.categorySlug === selectedCategory || p.category === selectedCategory);
    }

    // Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        (p.tamilName && p.tamilName.includes(q)) ||
        (p.englishName && p.englishName.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Featured first
      list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const generalWhatsAppUrl = `https://wa.me/${SITE_CONFIG.whatsapp.phoneNumber}?text=${encodeURIComponent('Hi Dhanam Organics, I would like to inquire about your product catalog.')}`;

  return (
    <div className="store-gallery-canvas">
      {/* Store Header in Deep Forest Green */}
      <div className="store-gallery-hero">
        <div className="container">
          <div className="store-hero-content">
            <span className="store-hero-kicker">100% TRADITIONAL SOUTH INDIAN MILLING • அங்காடி</span>
            <h1 className="store-hero-title">The Harvest Catalog</h1>
            <p className="store-hero-desc">
              All eight authentic stone-milled podis, slow-roasted with heirloom country spices and native herbs. Order directly on WhatsApp.
            </p>
          </div>
        </div>
      </div>

      <div className="container store-body-container">
        {/* Gallery Controls Bar */}
        <div className="store-filter-bar">
          {/* Search Input */}
          <div className="store-search-field">
            <Search size={18} className="search-icon" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search podi name, ingredient, Tamil..."
              className="search-input-el"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="search-clear-btn"
                title="Clear Search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="store-sort-wrapper">
            <span className="sort-title-label">Sort:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-dropdown-el"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="store-category-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory && onSelectCategory(cat.id)}
              className={`store-cat-pill ${selectedCategory === cat.id ? 'is-active' : ''}`}
            >
              <span>{cat.name}</span>
              <span className="cat-pill-count">{cat.count}</span>
            </button>
          ))}
        </div>

        {/* Results Count Line */}
        <div className="store-count-strip">
          <span>
            Presenting <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> authentic products
          </span>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="store-reset-search-btn"
            >
              Reset Search "{searchQuery}"
            </button>
          )}
        </div>

        {/* Gallery Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="store-zero-results">
            <h3>No authentic podis found matching "{searchQuery}"</h3>
            <p>Try searching for "idli", "pirandai", "dal", or reset category filter.</p>
            <button 
              onClick={() => { setSearchQuery(''); onSelectCategory && onSelectCategory('all'); }}
              className="store-reset-all-btn"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="store-gallery-grid">
            {filteredProducts.map((product, idx) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                index={idx}
                onSelect={onSelectProduct} 
                onAddToCart={onAddToCart}
                darkTheme={false}
              />
            ))}
          </div>
        )}

        {/* Custom Combo & WhatsApp Dispatch Callout */}
        <div className="store-concierge-callout">
          <div>
            <h3>Looking for Custom Weights or Family Wellness Packs?</h3>
            <p>
              Message our store directly on WhatsApp. We prepare custom gift boxes, bulk family packs, and combo assortments fresh from the mill.
            </p>
          </div>
          <a 
            href={generalWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="store-whatsapp-callout-btn"
          >
            <MessageCircle size={18} />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
