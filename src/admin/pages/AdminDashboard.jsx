import React from 'react';
import { Package, Eye, EyeOff, FolderTree, Plus, ArrowRight, Edit, Sparkles } from 'lucide-react';

export default function AdminDashboard({ 
  products = [], 
  categories = [], 
  onNavigateTab, 
  onAddProduct, 
  onEditProduct 
}) {
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.in_stock !== false).length;
  const hiddenProducts = totalProducts - activeProducts;
  const totalCategories = categories.length;

  const recentProducts = [...products].slice(0, 5);

  return (
    <div>
      {/* 4 Clean Metric Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrap green">
            <Package size={24} />
          </div>
          <div>
            <div className="admin-stat-number">{totalProducts}</div>
            <div className="admin-stat-label">Total Products</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrap blue">
            <Eye size={24} />
          </div>
          <div>
            <div className="admin-stat-number">{activeProducts}</div>
            <div className="admin-stat-label">Active / In Store</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrap amber">
            <EyeOff size={24} />
          </div>
          <div>
            <div className="admin-stat-number">{hiddenProducts}</div>
            <div className="admin-stat-label">Hidden Products</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrap purple">
            <FolderTree size={24} />
          </div>
          <div>
            <div className="admin-stat-number">{totalCategories}</div>
            <div className="admin-stat-label">Categories</div>
          </div>
        </div>
      </div>

      {/* Action Strip */}
      <div className="admin-section-header">
        <div>
          <h2 className="admin-section-title">Recent Inventory</h2>
          <span style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>
            Quick overview of products currently managed in the system
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            type="button" 
            className="admin-btn-primary"
            onClick={onAddProduct}
          >
            <Plus size={16} />
            <span>Add Product</span>
          </button>
          <button 
            type="button" 
            className="admin-btn-secondary"
            onClick={() => onNavigateTab('products')}
          >
            <span>View All ({totalProducts})</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Recent Products Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Weight</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentProducts.length > 0 ? (
              recentProducts.map(prod => (
                <tr key={prod.id}>
                  <td data-label="Product">
                    <div className="admin-prod-cell">
                      <img 
                        src={prod.image} 
                        alt={prod.name} 
                        className="admin-thumb" 
                      />
                      <div className="admin-prod-titles">
                        <span className="admin-prod-name">{prod.name}</span>
                        <span className="admin-prod-tamil">{prod.tamil_name || prod.tamilName}</span>
                      </div>
                    </div>
                  </td>

                  <td data-label="Category">
                    <span className="admin-category-tag">{prod.category}</span>
                  </td>

                  <td data-label="Price" style={{ fontWeight: 700 }}>
                    ₹{prod.price}
                  </td>

                  <td data-label="Weight">
                    {prod.weight}
                  </td>

                  <td data-label="Status">
                    <span className={`admin-status-pill ${prod.in_stock !== false ? 'active' : 'hidden'}`}>
                      <span className="admin-status-dot" />
                      <span>{prod.in_stock !== false ? 'Active' : 'Hidden'}</span>
                    </span>
                  </td>

                  <td data-label="Actions" style={{ textAlign: 'right' }}>
                    <button 
                      type="button" 
                      onClick={() => onEditProduct(prod)}
                      className="admin-action-icon-btn"
                      title="Edit Product"
                    >
                      <Edit size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--admin-text-muted)' }}>
                  No products in catalog yet. Click "+ Add Product" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
