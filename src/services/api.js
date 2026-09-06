import { PRODUCTS, CATEGORIES } from '../data/products.js';

const API_BASE = './php';

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

    if (!response.ok) {
      throw new Error('API status: ' + response.status);
    }

    const data = await response.json();
    if (data && Array.isArray(data.products) && data.products.length > 0) {
      return {
        products: data.products,
        source: 'php-api',
        total: data.total || data.products.length
      };
    }
    throw new Error('No products in response');
  } catch (err) {
    let filtered = [...PRODUCTS];

    if (params.category && params.category !== 'all') {
      filtered = filtered.filter(p => p.categorySlug === params.category || p.category === params.category);
    }

    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.tamilName.includes(q) ||
        p.englishName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (params.featured) {
      filtered = filtered.filter(p => p.isFeatured);
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
