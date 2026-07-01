// src/components/Toast.jsx
import { useEffect, useState } from 'react';
import './Toast.css';

export default function Toast({ toast }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Reset visibility when toast changes
    setIsVisible(true);
    
    // Auto-hide after 4.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4500);

    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast || !isVisible) return null;

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  const icon = icons[toast.type] || 'ℹ️';

  return (
    <div className={`toast toast--${toast.type}`}>
      <span className="toast-icon">{icon}</span>
      <p className="toast-message">{toast.message}</p>
      <button 
        className="toast-close" 
        onClick={() => setIsVisible(false)}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}