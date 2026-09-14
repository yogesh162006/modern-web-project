import React, { useState } from 'react';
import { FolderTree, Plus, Edit, Trash2, Check, X, AlertCircle } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

export default function AdminCategories({ 
  categories = [], 
  products = [], 
  onCreateCategory, 
  onUpdateCategory, 
  onDeleteCategory 
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [tamilName, setTamilName] = useState('');
  const [editName, setEditName] = useState('');
  const [editTamil, setEditTamil] = useState('');

  // Delete modal state
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleStartAdd = () => {
    setIsAdding(true);
    setName('');
    setTamilName('');
    setErrorMessage('');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !tamilName.trim()) {
      setErrorMessage('Please provide both English and Tamil names for the category.');
      return;
    }

    try {
      if (onCreateCategory) {
        await onCreateCategory({ name: name.trim(), tamil_name: tamilName.trim() });
      }
      setIsAdding(false);
      setName('');
      setTamilName('');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create category.');
    }
  };

  const handleStartEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditTamil(cat.tamil_name || cat.tamilName || '');
    setErrorMessage('');
  };

  const handleSaveEdit = async (catId) => {
    if (!editName.trim() || !editTamil.trim()) return;
    try {
      if (onUpdateCategory) {
        await onUpdateCategory(catId, { name: editName.trim(), tamil_name: editTamil.trim() });
      }
      setEditingId(null);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update category.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
      if (onDeleteCategory) {
        await onDeleteCategory(deleteCandidate.id);
      }
      setDeleteCandidate(null);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to delete category.');
      setDeleteCandidate(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {/* Top Toolbar */}
      <div className="admin-toolbar">
        <div>
          <h2 className="admin-section-title">Product Categories</h2>
          <span style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>
            Organize products into heritage collections and wellness departments
          </span>
        </div>

        <button 
          type="button" 
          className="admin-btn-primary"
          onClick={handleStartAdd}
        >
          <Plus size={16} />
          <span>Add Category</span>
        </button>
      </div>

      {errorMessage && (
        <div className="admin-error-box" style={{ marginBottom: 16 }}>
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Add Category Drawer / Inline Card */}
      {isAdding && (
        <div style={{ background: '#ffffff', border: '1px solid var(--admin-border)', borderRadius: 'var(--admin-radius-md)', padding: 20, marginBottom: 20, boxShadow: 'var(--admin-shadow-sm)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Create New Category</h3>
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            <div>
              <label className="admin-form-label">Category Name (English) *</label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Traditional Masalas"
                className="admin-input"
                required
              />
            </div>
            <div>
              <label className="admin-form-label">Tamil Name (தமிழ் பெயர்) *</label>
              <input 
                type="text"
                value={tamilName}
                onChange={(e) => setTamilName(e.target.value)}
                placeholder="e.g. பாரம்பரிய மசாலாக்கள்"
                className="admin-input"
                required
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
              <button type="submit" className="admin-btn-primary">
                <span>Save Category</span>
              </button>
              <button 
                type="button" 
                className="admin-btn-secondary"
                onClick={() => setIsAdding(false)}
              >
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Category Name (English)</th>
              <th>Tamil Name (தமிழ்)</th>
              <th>Slug ID</th>
              <th>Assigned Products</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => {
              const count = cat.product_count !== undefined 
                ? cat.product_count 
                : products.filter(p => p.categorySlug === cat.slug || p.category === cat.name).length;

              const isEditing = editingId === cat.id;

              return (
                <tr key={cat.id || cat.slug}>
                  {/* Name */}
                  <td data-label="Name">
                    {isEditing ? (
                      <input 
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="admin-input"
                        style={{ padding: '6px 10px' }}
                      />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <FolderTree size={16} color="var(--admin-primary)" />
                        <span style={{ fontWeight: 700 }}>{cat.name}</span>
                      </div>
                    )}
                  </td>

                  {/* Tamil Name */}
                  <td data-label="Tamil Name">
                    {isEditing ? (
                      <input 
                        type="text"
                        value={editTamil}
                        onChange={(e) => setEditTamil(e.target.value)}
                        className="admin-input"
                        style={{ padding: '6px 10px' }}
                      />
                    ) : (
                      <span>{cat.tamil_name || cat.tamilName}</span>
                    )}
                  </td>

                  {/* Slug */}
                  <td data-label="Slug">
                    <code style={{ fontSize: 12, background: '#f1f5f2', padding: '2px 6px', borderRadius: 4 }}>
                      {cat.slug}
                    </code>
                  </td>

                  {/* Product Count */}
                  <td data-label="Products">
                    <span style={{ 
                      fontSize: 12, 
                      fontWeight: 600, 
                      background: count > 0 ? '#edf6ef' : '#f5f5f5', 
                      color: count > 0 ? '#188647' : '#777', 
                      padding: '3px 9px', 
                      borderRadius: 12 
                    }}>
                      {count} {count === 1 ? 'Product' : 'Products'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td data-label="Actions" style={{ textAlign: 'right' }}>
                    <div className="admin-actions-cell" style={{ justifyContent: 'flex-end' }}>
                      {isEditing ? (
                        <>
                          <button 
                            type="button" 
                            onClick={() => handleSaveEdit(cat.id)}
                            className="admin-action-icon-btn"
                            style={{ color: '#188647' }}
                            title="Save"
                          >
                            <Check size={14} />
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setEditingId(null)}
                            className="admin-action-icon-btn"
                            title="Cancel"
                          >
                            <X size={14} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            type="button" 
                            onClick={() => handleStartEdit(cat)}
                            className="admin-action-icon-btn"
                            title="Rename Category"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setDeleteCandidate(cat)}
                            className="admin-action-icon-btn delete"
                            title="Delete Category"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal 
        isOpen={Boolean(deleteCandidate)}
        title="Delete Category?"
        message={`Are you sure you want to delete the "${deleteCandidate?.name}" category? Categories with active products cannot be deleted.`}
        confirmText="Delete Category"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteCandidate(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
