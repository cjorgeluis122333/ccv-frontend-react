import type { ToastType } from '@/contexts/ToastContext';
import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const toastStyles = {
  success: {
    bg: 'bg-white',
    border: 'border-green-500',
    text: 'text-gray-800',
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    accent: 'bg-green-500'
  },
  error: {
    bg: 'bg-white',
    border: 'border-red-500',
    text: 'text-gray-800',
    icon: <AlertCircle className="w-5 h-5 text-red-500" />,
    accent: 'bg-red-500'
  },
  info: {
    bg: 'bg-white',
    border: 'border-blue-500',
    text: 'text-gray-800',
    icon: <Info className="w-5 h-5 text-blue-500" />,
    accent: 'bg-blue-500'
  },
  warning: {
    bg: 'bg-white',
    border: 'border-yellow-500',
    text: 'text-gray-800',
    icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    accent: 'bg-yellow-500'
  }
};

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 5000 }) => {
  const [isExiting, setIsExiting] = useState(false);
  const style = toastStyles[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(onClose, 300);
      }, duration - 300);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div 
      className={`
        flex items-center gap-4 p-4 min-w-[300px] max-w-md
        ${style.bg} border-l-4 ${style.border} shadow-lg rounded-r-md
        transition-all duration-300 ease-in-out
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
        pointer-events-auto
      `}
      role="alert"
    >
      <div className="flex-shrink-0">
        {style.icon}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-medium ${style.text}`}>
          {message}
        </p>
      </div>
      <button 
        onClick={() => {
          setIsExiting(true);
          setTimeout(onClose, 300);
        }}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC<{ toasts: any[], hideToast: (id: string) => void }> = ({ toasts, hideToast }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <Toast 
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </div>
  );
};
