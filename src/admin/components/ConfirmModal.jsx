import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ 
  isOpen, 
  title = 'Delete Item?', 
  message = 'Are you sure you want to delete this item? This action cannot be undone.', 
  confirmText = 'Delete Permanently', 
  cancelText = 'Cancel', 
  onConfirm, 
  onCancel,
  isLoading = false 
}) {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-backdrop" onClick={onCancel}>
      <div className="admin-modal-card" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-icon">
          <AlertTriangle size={24} />
        </div>
        <h3 className="admin-modal-title">{title}</h3>
        <p className="admin-modal-text">{message}</p>
        <div className="admin-modal-actions">
          <button 
            type="button" 
            className="admin-btn-secondary" 
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button 
            type="button" 
            className="admin-btn-danger" 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
