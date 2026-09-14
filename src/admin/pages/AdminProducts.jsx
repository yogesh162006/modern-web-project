import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, EyeOff, Check, X, Filter } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

export default function AdminProducts({ 
  products = [], 
  categories = [], 
  onAddProduct, 
  onEditProduct, 
  onQuickPriceUpdate, 
  onToggleStatus, 
  onDeleteProduct 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Quick price editing state
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [tempPrice, setTempPrice] = useState('');

  // Delete modal state
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter products locally for instant response
  const filteredProducts = products.filter(p => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = p.name && p.name.toLowerCase().includes(q);
      const matchTamil = p.tamil_name && p.tamil_name.includes(q);
      const matchTamilOld = p.tamilName && p.tamilName.includes(q);
      const matchEng = p.english_name && p.english_name.toLowerCase().includes(q);
      const matchCategory = p.category && p.category.toLowerCase().includes(q);
      if (!matchName && !matchTamil && !matchTamilOld && !matchEng && !matchCategory) {
        return false;
      }
    }

    // Category filter
    if (categoryFilter !== 'all') {
      if (p.category_slug !== categoryFilter && p.categorySlug !== categoryFilter && p.category !== categoryFilter) {
        return false;
      }
    }

    // Status filter
    if (statusFilter !== 'all') {
      const isActive = p.in_stock !== false;
      if (statusFilter === 'active' && !isActive) return false;
      if (statusFilter === 'hidden' && isActive) return false;
    }

    return true;
  });

  const handleStartEditPrice = (prod, e) => {
    e.stopPropagation();
    setEditingPriceId(prod.id);
    setTempPrice(String(prod.price));
  };

  const handleSavePrice = async (prodId, e) => {
    e?.preventDefault();
    if (!tempPrice || Number(tempPrice) <= 0) return;
    if (onQuickPriceUpdate) {
      await onQuickPriceUpdate(prodId, Number(tempPrice));
    }
    setEditingPriceId(null);
  };

  const handleCancelPrice = (e) => {
    e?.stopPropagation();
    setEditingPriceId(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
      if (onDeleteProduct) {
        await onDeleteProduct(deleteCandidate.id);
      }
    } finally {
      setIsDeleting(false);
      setDeleteCandidate(null);
    }
  };

  return (
    <div>
      {/* Top Action Bar */}
      <div className="admin-toolbar">
        <div className="admin-toolbar-search">
          <Search size={16} className="admin-search-icon" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name, Tamil name, or category..."
            className="admin-search-input"
          />
        </div>

        <div className="admin-toolbar-filters">
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="admin-select"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>

          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active (Visible)</option>
            <option value="hidden">Hidden</option>
          </select>

          <button 
            type="button" 
            className="admin-btn-primary"
            onClick={onAddProduct}
          >
            <Plus size={16} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product Image & Name</th>
              <th>Category</th>
              <th>Selling Price (Click to Edit)</th>
              <th>Weight</th>
              <th>Store Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(prod => {
                const isActive = prod.in_stock !== false;
                const isEditingPrice = editingPriceId === prod.id;

                return (
                  <tr key={prod.id}>
                    {/* Image & Names */}
                    <td data-label="Product">
                      <div className="admin-prod-cell">
                        <img 
                          src={prod.image} 
                          alt={prod.name} 
                          className="admin-thumb" 
                        />
                        <div className="admin-prod-titles">
                          <span className="admin-prod-name">{prod.name}</span>
                          <span className="admin-prod-tamil">
                            {prod.tamil_name || prod.tamilName}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td data-label="Category">
                      <span className="admin-category-tag">{prod.category}</span>
                    </td>

                    {/* Quick Price Editor */}
                    <td data-label="Price">
                      {isEditingPrice ? (
                        <form 
                          onSubmit={(e) => handleSavePrice(prod.id, e)}
                          className="admin-price-edit-form"
                        >
                          <span style={{ fontSize: 13, fontWeight: 700 }}>₹</span>
                          <input 
                            type="number"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(e.target.value)}
                            min="1"
                            step="0.5"
                            className="admin-price-input"
                            autoFocus
                          />
                          <button type="submit" className="admin-price-btn" title="Save Price">
                            <Check size={12} />
                          </button>
                          <button 
                            type="button" 
                            onClick={handleCancelPrice}
                            style={{ background: '#e2ebe5', border: 'none', borderRadius: 4, padding: '4px 6px', cursor: 'pointer' }}
                            title="Cancel"
                          >
                            <X size={12} />
                          </button>
                        </form>
                      ) : (
                        <div 
                          className="admin-price-cell"
                          onClick={(e) => handleStartEditPrice(prod, e)}
                          title="Click to quickly edit price"
                        >
                          <span>₹{prod.price}</span>
                          <Edit size={12} style={{ opacity: 0.5 }} />
                        </div>
                      )}
                    </td>

                    {/* Weight */}
                    <td data-label="Weight">
                      <span style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>
                        {prod.weight}
                      </span>
                    </td>

                    {/* Status Toggle (Active / Hidden) */}
                    <td data-label="Status">
                      <button 
                        type="button"
                        className={`admin-status-pill ${isActive ? 'active' : 'hidden'}`}
                        onClick={() => onToggleStatus && onToggleStatus(prod.id, !isActive)}
                        title={isActive ? 'Click to hide from store' : 'Click to show in store'}
                      >
                        <span className="admin-status-dot" />
                        <span>{isActive ? 'Active' : 'Hidden'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td data-label="Actions" style={{ textAlign: 'right' }}>
                      <div className="admin-actions-cell" style={{ justifyContent: 'flex-end' }}>
                        <button 
                          type="button"
                          onClick={() => onEditProduct(prod)}
                          className="admin-action-icon-btn"
                          title="Edit Full Product Details"
                        >
                          <Edit size={14} />
                        </button>

                        <button 
                          type="button"
                          onClick={() => setDeleteCandidate(prod)}
                          className="admin-action-icon-btn delete"
                          title="Permanently Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--admin-text-muted)' }}>
                  No products matched your search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Custom Delete Confirmation Modal (Never browser alert/confirm) */}
      <ConfirmModal 
        isOpen={Boolean(deleteCandidate)}
        title="Delete Product?"
        message={`Are you sure you want to permanently delete "${deleteCandidate?.name}"? This action cannot be undone.`}
        confirmText="Delete Product"
        cancelText="Keep Product"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteCandidate(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
