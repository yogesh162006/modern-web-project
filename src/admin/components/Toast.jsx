import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts = [], onRemove }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="admin-toast-stack" aria-live="polite">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div 
            key={toast.id} 
            className={`admin-toast-item ${toast.type || 'info'}`}
          >
            {isSuccess && <CheckCircle2 size={18} color="#25d366" />}
            {isError && <AlertCircle size={18} color="#c93b3b" />}
            {!isSuccess && !isError && <Info size={18} color="#124e2e" />}
            
            <span style={{ flex: 1 }}>{toast.message}</span>

            <button 
              type="button" 
              onClick={() => onRemove && onRemove(toast.id)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#8fa899', padding: 2 }}
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
