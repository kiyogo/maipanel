import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback(({ title, message, type = 'success', duration = 3500 }) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    const newToast = { id, title, message, type };

    setToasts(prev => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((title, message) => showToast({ title, message, type: 'success' }), [showToast]);
  const error = useCallback((title, message) => showToast({ title, message, type: 'error' }), [showToast]);
  const warning = useCallback((title, message) => showToast({ title, message, type: 'warning' }), [showToast]);
  const info = useCallback((title, message) => showToast({ title, message, type: 'info' }), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info, removeToast }}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map(toast => {
          let IconComponent = CheckCircle2;
          let iconColor = 'var(--success)';
          let badgeClass = 'badge-success';

          if (toast.type === 'error') {
            IconComponent = AlertCircle;
            iconColor = 'var(--danger)';
            badgeClass = 'badge-danger';
          } else if (toast.type === 'warning') {
            IconComponent = AlertTriangle;
            iconColor = 'var(--warning)';
            badgeClass = 'badge-warning';
          } else if (toast.type === 'info') {
            IconComponent = Info;
            iconColor = 'var(--info)';
            badgeClass = 'badge-info';
          }

          return (
            <div key={toast.id} className="toast" role="alert">
              <div className="toast-icon">
                <IconComponent size={20} color={iconColor} />
              </div>
              <div className="toast-content">
                {toast.title && <div className="toast-title">{toast.title}</div>}
                {toast.message && <div className="toast-message">{toast.message}</div>}
              </div>
              <button 
                className="toast-close"
                onClick={() => removeToast(toast.id)}
                aria-label="Đóng thông báo"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
