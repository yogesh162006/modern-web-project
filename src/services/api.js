import { PRODUCTS, CATEGORIES } from '../data/products.js';

const API_BASE = './api';

export async function fetchProducts(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') {
      query.append('category', params.category);
    }
    if (params.search) {
      query.append('search', params.search);
    }
    if (params.featured) {
      query.append('featured', '1');
    }

    const queryString = query.toString();
    const url = queryString ? (API_BASE + '/products.php?' + queryString) : (API_BASE + '/products.php');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && Array.isArray(data.products) && data.products.length > 0) {
        return {
          products: data.products.filter(p => p.in_stock !== false),
          source: 'php-api',
          total: data.total || data.products.length
        };
      }
    }
    throw new Error('API unreachable');
  } catch (err) {
    // Check if admin has updated products locally in browser storage
    let baseProducts = [...PRODUCTS];
    try {
      const stored = localStorage.getItem('dhanam_admin_products');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          baseProducts = parsed;
        }
      }
    } catch (e) {}

    // Customer only sees products where in_stock !== false
    let filtered = baseProducts.filter(p => p.in_stock !== false);

    if (params.category && params.category !== 'all') {
      filtered = filtered.filter(p => 
        (p.categorySlug && p.categorySlug === params.category) || 
        (p.category_slug && p.category_slug === params.category) || 
        p.category === params.category
      );
    }

    if (params.search) {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.tamilName && p.tamilName.includes(q)) ||
        (p.tamil_name && p.tamil_name.includes(q)) ||
        (p.englishName && p.englishName.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    }

    if (params.featured) {
      filtered = filtered.filter(p => p.isFeatured || p.is_featured);
    }

    return {
      products: filtered,
      source: 'fallback',
      total: filtered.length
    };
  }
}

export async function fetchProductById(id) {
  try {
    const url = API_BASE + '/products.php?id=' + encodeURIComponent(id);
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data && data.product) return data.product;
    }
  } catch (e) {
    // fallback
  }
  return PRODUCTS.find(p => p.id === Number(id)) || null;
}

export async function fetchCategories() {
  return CATEGORIES;
}
