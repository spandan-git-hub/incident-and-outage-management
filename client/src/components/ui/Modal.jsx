import { motion, AnimatePresence } from 'framer-motion';
import { modalVariants, overlayVariants } from '../../utils/animations';
import { useEffect } from 'react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  footer = null
}) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeOnOverlayClick ? onClose : undefined}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className={`relative bg-white rounded-2xl shadow-2xl ${sizeClasses[size]} w-full max-h-[90vh] flex flex-col`}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                {title && (
                  <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                )}
                {showCloseButton && (
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="ml-auto p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Close modal"
                  >
                    <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger' // 'danger' | 'warning' | 'info'
}) => {
  const typeStyles = {
    danger: 'from-red-600 to-red-700',
    warning: 'from-yellow-600 to-orange-600',
    info: 'from-blue-600 to-primary-600'
  };

  const typeIcons = {
    danger: '⚠️',
    warning: '⚡',
    info: 'ℹ️'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="text-center py-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="text-6xl mb-4"
        >
          {typeIcons[type]}
        </motion.div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-all"
          >
            {cancelText}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2 bg-gradient-to-r ${typeStyles[type]} text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all`}
          >
            {confirmText}
          </motion.button>
        </div>
      </div>
    </Modal>
  );
};

export default Modal;
