import React, {useCallback, useEffect, useState} from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import type {ToastMessage} from "@/contexts/ToastContext.tsx";

// Omitimos 'id' porque el componente visual no necesita saber su propio ID
interface ToastProps extends Omit<ToastMessage, 'id'> {
  onClose: () => void;
}

const toastStyles = {
  success: {
    bg: 'bg-white',
    border: 'border-green-500',
    text: 'text-gray-800',
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
  },
  error: {
    bg: 'bg-white',
    border: 'border-red-500',
    text: 'text-gray-800',
    icon: <AlertCircle className="w-5 h-5 text-red-500" />,
  },
  info: {
    bg: 'bg-white',
    border: 'border-blue-500',
    text: 'text-gray-800',
    icon: <Info className="w-5 h-5 text-blue-500" />,
  },
  warning: {
    bg: 'bg-white',
    border: 'border-yellow-500',
    text: 'text-gray-800',
    icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  }
};

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 5000 }) => {
  const [isExiting, setIsExiting] = useState(false);
  const style = toastStyles[type];
  const ANIMATION_DURATION = 300;

  // 1. Definimos la función de cerrar PRIMERO usando useCallback
  // Esto evita que la función se recree innecesariamente y permite usarla en el useEffect
  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, ANIMATION_DURATION);
  }, [onClose]); // Solo cambia si onClose cambia

  // 2. Ahora el useEffect puede usar handleClose
  useEffect(() => {
    if (duration <= 0) return;

    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, handleClose]);

  return (
      <div
          role="alert"
          className={`
        flex items-center gap-4 p-4 min-w-[300px] max-w-md
        ${style.bg} border-l-4 ${style.border} shadow-lg rounded-r-md
        transition-all duration-300 ease-in-out transform
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
        pointer-events-auto cursor-default
      `}
      >
        <div className="flex-shrink-0">{style.icon}</div>
        <div className="flex-1">
          <p className={`text-sm font-medium ${style.text}`}>{message}</p>
        </div>
        <button
            onClick={handleClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
  );
};