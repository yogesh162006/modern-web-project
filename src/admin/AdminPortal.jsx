import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X,
  Plus
} from 'lucide-react';
import './admin.css';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminCategories from './pages/AdminCategories';
import AdminSettings from './pages/AdminSettings';
import ProductDrawer from './components/ProductDrawer';
import Toast from './components/Toast';
import { 
  checkSession, 
  logout, 
  getAdminProducts, 
  createProduct, 
  updateProduct, 
  quickUpdatePrice, 
  toggleProductStatus, 
  deleteProduct,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from './services/adminApi';

export default function AdminPortal({ onBackToSite }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Active navigation tab: 'dashboard' | 'products' | 'categories' | 'settings'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Core data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Product Drawer state (for Add / Edit)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // Toast stack
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Verify session on mount
  useEffect(() => {
    async function verify() {
      setIsLoadingAuth(true);
      try {
        const session = await checkSession();
        if (session.authenticated && session.user) {
          setIsAuthenticated(true);
          setCurrentUser(session.user);
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setIsLoadingAuth(false);
      }
    }
    verify();
  }, []);

  // Fetch products and categories when authenticated
  const loadData = async () => {
    if (!isAuthenticated) return;
    setIsLoadingData(true);
    try {
      const [prodsRes, catsRes] = await Promise.all([
        getAdminProducts(),
        getCategories()
      ]);
      if (prodsRes && prodsRes.products) setProducts(prodsRes.products);
      if (catsRes) setCategories(catsRes);
    } catch (err) {
      addToast('Failed to load inventory data.', 'error');
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Auth Handlers
  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    addToast(`Welcome back, ${user.username || 'Admin'}!`, 'success');
  };

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    addToast('Signed out successfully.', 'info');
  };

  // Product Drawer Handlers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setIsDrawerOpen(true);
  };

  const handleSaveProduct = async (formData) => {
    setIsSavingProduct(true);
    try {
      if (editingProduct && editingProduct.id) {
        await updateProduct(editingProduct.id, formData);
        addToast(`Updated "${formData.name}".`, 'success');
      } else {
        await createProduct(formData);
        addToast(`Added "${formData.name}" to inventory.`, 'success');
      }
      setIsDrawerOpen(false);
      setEditingProduct(null);
      await loadData();
    } catch (err) {
      addToast(err.message || 'Failed to save product.', 'error');
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Quick Inline Actions
  const handleQuickPriceUpdate = async (prodId, newPrice) => {
    try {
      await quickUpdatePrice(prodId, newPrice);
      addToast('Price updated successfully.', 'success');
      setProducts(prev => prev.map(p => p.id === prodId ? { ...p, price: newPrice } : p));
    } catch (err) {
      addToast(err.message || 'Failed to update price.', 'error');
    }
  };

  const handleToggleStatus = async (prodId, newInStock) => {
    try {
      await toggleProductStatus(prodId, newInStock);
      addToast(newInStock ? 'Product is now visible in store.' : 'Product is now hidden from store.', 'info');
      setProducts(prev => prev.map(p => p.id === prodId ? { ...p, in_stock: newInStock } : p));
    } catch (err) {
      addToast(err.message || 'Failed to update visibility.', 'error');
    }
  };

  const handleDeleteProduct = async (prodId) => {
    try {
      await deleteProduct(prodId);
      addToast('Product deleted successfully.', 'success');
      setProducts(prev => prev.filter(p => p.id !== prodId));
    } catch (err) {
      addToast(err.message || 'Failed to delete product.', 'error');
    }
  };

  // Category Actions
  const handleCreateCategory = async (catData) => {
    await createCategory(catData);
    addToast(`Category "${catData.name}" created.`, 'success');
    await loadData();
  };

  const handleUpdateCategory = async (catId, catData) => {
    await updateCategory(catId, catData);
    addToast(`Category updated successfully.`, 'success');
    await loadData();
  };

  const handleDeleteCategory = async (catId) => {
    await deleteCategory(catId);
    addToast('Category deleted successfully.', 'success');
    await loadData();
  };

  // Loading Screen while verifying session
  if (isLoadingAuth) {
    return (
      <div className="admin-scope" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--admin-primary)' }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>Connecting to Dhanam Organics Admin...</div>
        </div>
      </div>
    );
  }

  // If unauthenticated, display minimal SaaS login card
  if (!isAuthenticated) {
    return (
      <div className="admin-scope">
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
        <Toast toasts={toasts} onRemove={removeToast} />
      </div>
    );
  }

  // Titles for Top Bar
  const tabTitles = {
    dashboard: 'Dashboard Overview',
    products: 'Products Inventory',
    categories: 'Category Management',
    settings: 'Settings & Security'
  };

  return (
    <div className="admin-scope">
      <div className="admin-layout">
        
        {/* Mobile Backdrop */}
        {isMobileSidebarOpen && (
          <div 
            className="admin-sidebar-backdrop" 
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Left Compact Sidebar */}
        <aside className={`admin-sidebar ${isMobileSidebarOpen ? 'is-open' : ''}`}>
          <div className="admin-sidebar-brand">
            <img 
              src="./images/logo/logo.jpeg" 
              alt="Dhanam Organics" 
              className="admin-sidebar-logo"
            />
            <div>
              <div className="admin-sidebar-brand-name">Dhanam Organics</div>
              <div className="admin-sidebar-brand-sub">Admin Portal</div>
            </div>
          </div>

          <ul className="admin-nav-list">
            <li className="admin-nav-item">
              <button 
                type="button" 
                className={`admin-nav-btn ${activeTab === 'dashboard' ? 'is-active' : ''}`}
                onClick={() => { setActiveTab('dashboard'); setIsMobileSidebarOpen(false); }}
              >
                <LayoutDashboard size={17} />
                <span>Dashboard</span>
              </button>
            </li>

            <li className="admin-nav-item">
              <button 
                type="button" 
                className={`admin-nav-btn ${activeTab === 'products' ? 'is-active' : ''}`}
                onClick={() => { setActiveTab('products'); setIsMobileSidebarOpen(false); }}
              >
                <Package size={17} />
                <span>Products</span>
                <span className="admin-nav-badge">{products.length}</span>
              </button>
            </li>

            <li className="admin-nav-item">
              <button 
                type="button" 
                className={`admin-nav-btn ${activeTab === 'categories' ? 'is-active' : ''}`}
                onClick={() => { setActiveTab('categories'); setIsMobileSidebarOpen(false); }}
              >
                <FolderTree size={17} />
                <span>Categories</span>
                <span className="admin-nav-badge">{categories.length}</span>
              </button>
            </li>

            <li className="admin-nav-item">
              <button 
                type="button" 
                className={`admin-nav-btn ${activeTab === 'settings' ? 'is-active' : ''}`}
                onClick={() => { setActiveTab('settings'); setIsMobileSidebarOpen(false); }}
              >
                <Settings size={17} />
                <span>Settings</span>
              </button>
            </li>
          </ul>

          <div className="admin-sidebar-footer">
            <button 
              type="button" 
              className="admin-view-site-btn"
              onClick={onBackToSite}
            >
              <span>View Customer Website</span>
              <ExternalLink size={13} />
            </button>

            <button 
              type="button" 
              className="admin-logout-btn"
              onClick={handleLogout}
            >
              <LogOut size={15} />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Right Main Content Area */}
        <div className="admin-main-wrap">
          
          {/* Top Sticky Bar */}
          <header className="admin-topbar">
            <div className="admin-topbar-left">
              <button 
                type="button" 
                className="admin-mobile-toggle"
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                aria-label="Toggle Navigation"
              >
                {isMobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <h1 className="admin-page-title">{tabTitles[activeTab]}</h1>
            </div>

            <div className="admin-topbar-right">
              <div className="admin-user-pill">
                <div className="admin-user-avatar">
                  {(currentUser?.username || 'A').charAt(0).toUpperCase()}
                </div>
                <span>{currentUser?.username || 'Admin'}</span>
              </div>
            </div>
          </header>

          {/* Body Content */}
          <main className="admin-content-body">
            {activeTab === 'dashboard' && (
              <AdminDashboard 
                products={products}
                categories={categories}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onAddProduct={handleOpenAddProduct}
                onEditProduct={handleOpenEditProduct}
              />
            )}

            {activeTab === 'products' && (
              <AdminProducts 
                products={products}
                categories={categories}
                onAddProduct={handleOpenAddProduct}
                onEditProduct={handleOpenEditProduct}
                onQuickPriceUpdate={handleQuickPriceUpdate}
                onToggleStatus={handleToggleStatus}
                onDeleteProduct={handleDeleteProduct}
              />
            )}

            {activeTab === 'categories' && (
              <AdminCategories 
                categories={categories}
                products={products}
                onCreateCategory={handleCreateCategory}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
              />
            )}

            {activeTab === 'settings' && (
              <AdminSettings 
                user={currentUser}
                onShowToast={addToast}
              />
            )}
          </main>
        </div>

      </div>

      {/* Slide-Over Product Add/Edit Drawer */}
      <ProductDrawer 
        isOpen={isDrawerOpen}
        onClose={() => { setIsDrawerOpen(false); setEditingProduct(null); }}
        product={editingProduct}
        categories={categories}
        onSave={handleSaveProduct}
        isSaving={isSavingProduct}
      />

      {/* Global Floating Toast Notifications */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
