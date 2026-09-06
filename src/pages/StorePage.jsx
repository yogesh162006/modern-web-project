import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, MessageCircle } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from '../data/products';
import { SITE_CONFIG } from '../config/siteConfig';

export default function StorePage({ 
  products = [], 
  selectedCategory = 'all', 
  onSelectCategory, 
  onSelectProduct, 
  onAddToCart,
  initialSearch = ''
}) {
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
        p.tamilName.includes(q) ||
        p.englishName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
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
    <div className="store-page-wrapper" style={{ padding: '48px 0 84px' }}>
      <div className="container">
        {/* Store Title Bar */}
        <div style={{ marginBottom: '36px' }}>
          <span className="section-pretitle">100% Traditional South Indian Podis</span>
          <h1 className="section-title" style={{ fontSize: '38px', marginBottom: '8px' }}>
            Store Catalog
          </h1>
          <p className="section-subtitle">
            Authentic stone-milled podis, slow-roasted with country spices and shade-dried herbs. Directly order on WhatsApp.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          gap: '16px', 
          marginBottom: '28px',
          background: '#FFFFFF',
          padding: '16px 20px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-border)'
        }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '380px' }}>
            <Search size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search podi name, ingredient, Tamil..."
              style={{
                width: '100%',
                padding: '9px 36px 9px 36px',
                borderRadius: '4px',
                border: '1px solid var(--color-border)',
                fontSize: '14px'
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#718096', fontWeight: 600 }}>Sort by:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid var(--color-border)',
                fontSize: '13.5px',
                background: '#FAF7F2'
              }}
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="category-tabs-bar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`category-tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            >
              <span>{cat.name}</span>
              <span className="category-count">{cat.count}</span>
            </button>
          ))}
        </div>

        {/* Products Count Indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', fontSize: '13.5px', color: '#718096' }}>
          <span>
            Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> authentic products
          </span>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{ color: 'var(--color-crimson)', textDecoration: 'underline', fontWeight: 600 }}
            >
              Clear Search "{searchQuery}"
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{ 
            background: '#FFFFFF', 
            border: '1px dashed var(--color-border)', 
            borderRadius: 'var(--radius-sm)', 
            padding: '60px 24px', 
            textAlign: 'center' 
          }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--color-forest-dark)', marginBottom: '8px' }}>
              No products found matching "{searchQuery}"
            </h3>
            <p style={{ color: '#718096', fontSize: '14px', marginBottom: '20px' }}>
              Try searching with different terms like "idli", "pirandai", "dal", or reset category.
            </p>
            <button 
              onClick={() => { setSearchQuery(''); onSelectCategory('all'); }}
              className="btn btn-secondary btn-sm"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onSelect={onSelectProduct} 
                onAddToCart={onAddToCart} 
              />
            ))}
          </div>
        )}

        {/* Need Help Ordering Banner */}
        <div style={{ 
          marginTop: '60px', 
          background: 'linear-gradient(135deg, #1B4332 0%, #112A1F 100%)', 
          color: '#fff', 
          borderRadius: 'var(--radius-md)', 
          padding: '36px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', marginBottom: '6px' }}>
              Looking for custom weights or combo packs?
            </h3>
            <p style={{ fontSize: '14px', color: '#D8E2DC', maxWidth: '520px', lineHeight: 1.5 }}>
              Message our store directly on WhatsApp. We can prepare custom gift boxes, bulk family packs, and combo assortments.
            </p>
          </div>
          <a 
            href={generalWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
          >
            <MessageCircle size={18} />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
