import { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toastVariants } from '../utils/animations';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now();
    const toast = { id, message, type };
    setToasts((prev) => [...prev, toast]);

    // Auto-remove after specified duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

function ToastContainer({ toasts, removeToast }) {
  const getToastConfig = (type) => {
    const configs = {
      success: {
        icon: '✓',
        gradient: 'from-green-500 to-emerald-600',
        bgColor: 'bg-green-50',
        textColor: 'text-green-900',
        borderColor: 'border-green-200',
        iconBg: 'bg-green-500'
      },
      error: {
        icon: '✕',
        gradient: 'from-red-500 to-rose-600',
        bgColor: 'bg-red-50',
        textColor: 'text-red-900',
        borderColor: 'border-red-200',
        iconBg: 'bg-red-500'
      },
      warning: {
        icon: '⚠',
        gradient: 'from-yellow-500 to-orange-500',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-900',
        borderColor: 'border-yellow-200',
        iconBg: 'bg-yellow-500'
      },
      info: {
        icon: 'ℹ',
        gradient: 'from-blue-500 to-primary-600',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-900',
        borderColor: 'border-blue-200',
        iconBg: 'bg-blue-500'
      }
    };
    return configs[type] || configs.info;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const config = getToastConfig(toast.type);
          return (
            <motion.div
              key={toast.id}
              variants={toastVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              className={`${config.bgColor} ${config.textColor} border-2 ${config.borderColor} rounded-xl shadow-soft-lg backdrop-blur-sm overflow-hidden`}
            >
              <div className="flex items-start gap-3 p-4">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className={`${config.iconBg} text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg flex-shrink-0`}
                >
                  {config.icon}
                </motion.div>

                {/* Message */}
                <p className="flex-1 font-medium text-sm leading-relaxed pt-1">
                  {toast.message}
                </p>

                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeToast(toast.id)}
                  className="ml-2 hover:bg-black/5 rounded-full w-6 h-6 flex items-center justify-center transition-colors flex-shrink-0"
                  aria-label="Close notification"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* Progress bar */}
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 5, ease: "linear" }}
                className={`h-1 bg-gradient-to-r ${config.gradient}`}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

