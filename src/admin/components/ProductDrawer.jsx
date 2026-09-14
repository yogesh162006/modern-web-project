import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Tag, Layers, IndianRupee, FileText, Sparkles } from 'lucide-react';
import ImageUploader from './ImageUploader';

export default function ProductDrawer({ 
  isOpen, 
  onClose, 
  product = null, 
  categories = [], 
  onSave, 
  isSaving = false 
}) {
  const isEditing = Boolean(product && product.id);

  const [formData, setFormData] = useState({
    name: '',
    tamil_name: '',
    english_name: '',
    category: 'Heritage Podis',
    category_slug: 'heritage-podis',
    category_id: 1,
    price: '',
    original_price: '',
    weight: '200g',
    image: './images/products/idli-podi.png',
    badge: '',
    description: '',
    tamil_description: '',
    ingredients: '',
    usage_instructions: '',
    in_stock: true,
    is_featured: false,
    benefits: []
  });

  const [newBenefitInput, setNewBenefitInput] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name || '',
        tamil_name: product.tamil_name || product.tamilName || '',
        english_name: product.english_name || product.englishName || product.name || '',
        category: product.category || 'Heritage Podis',
        category_slug: product.category_slug || product.categorySlug || 'heritage-podis',
        category_id: product.category_id || product.categoryId || 1,
        price: product.price !== undefined ? product.price : '',
        original_price: product.original_price || product.originalPrice || '',
        weight: product.weight || '200g',
        image: product.image || './images/products/idli-podi.png',
        badge: product.badge || '',
        description: product.description || '',
        tamil_description: product.tamil_description || product.tamildescription || '',
        ingredients: product.ingredients || '',
        usage_instructions: product.usage_instructions || product.usage || '',
        in_stock: product.in_stock !== undefined ? Boolean(product.in_stock) : true,
        is_featured: product.is_featured !== undefined ? Boolean(product.is_featured) : Boolean(product.isFeatured),
        benefits: Array.isArray(product.benefits) ? [...product.benefits] : []
      });
    } else {
      // Default initial state for new product
      setFormData({
        name: '',
        tamil_name: '',
        english_name: '',
        category: categories.length > 0 ? categories[0].name : 'Heritage Podis',
        category_slug: categories.length > 0 ? categories[0].slug : 'heritage-podis',
        category_id: categories.length > 0 ? categories[0].id : 1,
        price: '',
        original_price: '',
        weight: '200g',
        image: './images/products/idli-podi.png',
        badge: '',
        description: '',
        tamil_description: '',
        ingredients: '',
        usage_instructions: '',
        in_stock: true,
        is_featured: false,
        benefits: []
      });
    }
    setValidationError('');
  }, [product, categories, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategorySelect = (e) => {
    const selectedSlug = e.target.value;
    const cat = categories.find(c => c.slug === selectedSlug);
    if (cat) {
      setFormData(prev => ({
        ...prev,
        category: cat.name,
        category_slug: cat.slug,
        category_id: cat.id
      }));
    }
  };

  const handleAddBenefit = () => {
    const trimmed = newBenefitInput.trim();
    if (trimmed && !formData.benefits.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, trimmed]
      }));
      setNewBenefitInput('');
    }
  };

  const handleRemoveBenefit = (idx) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setValidationError('Product Name is required.');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setValidationError('Please enter a valid price greater than zero.');
      return;
    }

    if (onSave) {
      onSave({
        ...formData,
        price: Number(formData.price),
        original_price: formData.original_price ? Number(formData.original_price) : null,
        in_stock: Boolean(formData.in_stock),
        is_featured: Boolean(formData.is_featured)
      });
    }
  };

  return (
    <div className="admin-drawer-overlay" onClick={onClose}>
      <div className="admin-drawer-panel" onClick={e => e.stopPropagation()}>
        
        {/* Drawer Header */}
        <div className="admin-drawer-header">
          <h3 className="admin-drawer-title">
            {isEditing ? `Edit: ${formData.name || 'Product'}` : 'Add New Heritage Product'}
          </h3>
          <button 
            type="button" 
            className="admin-drawer-close"
            onClick={onClose}
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Form Body */}
        <form id="product-form" onSubmit={handleSubmit} className="admin-drawer-body">
          {validationError && (
            <div className="admin-error-box">
              <span>{validationError}</span>
            </div>
          )}

          {/* Group 1: Product Identity & Image */}
          <div className="admin-field-group">
            <div className="admin-group-label">
              <Layers size={14} />
              <span>1. Product Identity & Image</span>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label className="admin-form-label">Product Image</label>
              <ImageUploader 
                currentImage={formData.image}
                onImageUploaded={(url) => setFormData(p => ({ ...p, image: url }))}
                onError={(msg) => setValidationError(msg)}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Product Name (Display Title) *</label>
              <input 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. இட்லி பொடி • Traditional Idli Podi"
                className="admin-input"
                required
              />
            </div>

            <div className="admin-form-grid-2">
              <div className="admin-form-group">
                <label className="admin-form-label">Tamil Name (தமிழ் பெயர்)</label>
                <input 
                  type="text"
                  name="tamil_name"
                  value={formData.tamil_name}
                  onChange={handleChange}
                  placeholder="e.g. இட்லி பொடி"
                  className="admin-input"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">English Sub-Name</label>
                <input 
                  type="text"
                  name="english_name"
                  value={formData.english_name}
                  onChange={handleChange}
                  placeholder="e.g. Traditional Idli Gunpowder"
                  className="admin-input"
                />
              </div>
            </div>
          </div>

          {/* Group 2: Pricing & Packaging */}
          <div className="admin-field-group">
            <div className="admin-group-label">
              <IndianRupee size={14} />
              <span>2. Pricing & Packaging</span>
            </div>

            <div className="admin-form-grid-2">
              <div className="admin-form-group">
                <label className="admin-form-label">Selling Price (₹) *</label>
                <input 
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="130"
                  min="1"
                  step="0.5"
                  className="admin-input"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Original Price (₹ MRP Strike-through)</label>
                <input 
                  type="number"
                  name="original_price"
                  value={formData.original_price}
                  onChange={handleChange}
                  placeholder="150"
                  min="0"
                  step="0.5"
                  className="admin-input"
                />
              </div>
            </div>

            <div className="admin-form-grid-2">
              <div className="admin-form-group">
                <label className="admin-form-label">Weight / Pack Size</label>
                <input 
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="200g, 500g, 1kg"
                  className="admin-input"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Optional Badge Tag</label>
                <input 
                  type="text"
                  name="badge"
                  value={formData.badge}
                  onChange={handleChange}
                  placeholder="Bestseller, Nutrient Rich, Heritage"
                  className="admin-input"
                />
              </div>
            </div>
          </div>

          {/* Group 3: Classification & Visibility */}
          <div className="admin-field-group">
            <div className="admin-group-label">
              <Tag size={14} />
              <span>3. Classification & Visibility</span>
            </div>

            <div className="admin-form-grid-2">
              <div className="admin-form-group">
                <label className="admin-form-label">Category</label>
                <select 
                  value={formData.category_slug} 
                  onChange={handleCategorySelect}
                  className="admin-select"
                  style={{ width: '100%' }}
                >
                  {categories.map(c => (
                    <option key={c.slug} value={c.slug}>
                      {c.name} ({c.tamil_name || c.tamilName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Store Visibility</label>
                <select 
                  name="in_stock" 
                  value={formData.in_stock ? '1' : '0'} 
                  onChange={(e) => setFormData(p => ({ ...p, in_stock: e.target.value === '1' }))}
                  className="admin-select"
                  style={{ width: '100%' }}
                >
                  <option value="1">Active (Visible in Store & 3D Showcase)</option>
                  <option value="0">Hidden (Temporarily out of stock/hidden)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
              <input 
                type="checkbox"
                id="is_featured"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                style={{ width: 16, height: 16, cursor: 'pointer' }}
              />
              <label htmlFor="is_featured" style={{ fontSize: 13, fontWeight: 600, color: 'var(--admin-text-main)', cursor: 'pointer' }}>
                Featured on Homepage Spotlight
              </label>
            </div>
          </div>

          {/* Group 4: Descriptions */}
          <div className="admin-field-group">
            <div className="admin-group-label">
              <FileText size={14} />
              <span>4. Authentic Story & Descriptions</span>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">English Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Traditional preparation notes and pairing recommendations..."
                className="admin-textarea"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Tamil Description (தமிழ் குறிப்பு)</label>
              <textarea 
                name="tamil_description"
                value={formData.tamil_description}
                onChange={handleChange}
                rows={3}
                placeholder="பாரம்பரிய தயாரிப்பு முறை மற்றும் சாப்பிடும் விதம்..."
                className="admin-textarea"
              />
            </div>
          </div>

          {/* Group 5: Ingredients & Health Benefits */}
          <div className="admin-field-group">
            <div className="admin-group-label">
              <Sparkles size={14} />
              <span>5. Ingredients & Key Benefits</span>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Ingredients List</label>
              <input 
                type="text"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                placeholder="Urad dal, chana dal, red chillies, white sesame, sea salt..."
                className="admin-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Usage Instructions</label>
              <input 
                type="text"
                name="usage_instructions"
                value={formData.usage_instructions}
                onChange={handleChange}
                placeholder="Mix with cold-pressed gingelly oil or desi ghee..."
                className="admin-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Benefits (Pill Tags)</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <input 
                  type="text"
                  value={newBenefitInput}
                  onChange={(e) => setNewBenefitInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddBenefit(); } }}
                  placeholder="Add health benefit (e.g. Iron rich, Easy to digest)..."
                  className="admin-input"
                />
                <button 
                  type="button" 
                  onClick={handleAddBenefit}
                  className="admin-btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <Plus size={14} />
                  <span>Add</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {formData.benefits.map((b, idx) => (
                  <span 
                    key={idx} 
                    style={{
                      background: '#eef5f1',
                      border: '1px solid #cbe0d3',
                      color: '#185233',
                      fontSize: 12,
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: 16,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <span>{b}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveBenefit(idx)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#688d77', padding: 0 }}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </form>

        {/* Drawer Footer */}
        <div className="admin-drawer-footer">
          <button 
            type="button" 
            className="admin-btn-secondary"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="product-form"
            className="admin-btn-primary"
            disabled={isSaving}
          >
            <Save size={15} />
            <span>{isSaving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Product')}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
