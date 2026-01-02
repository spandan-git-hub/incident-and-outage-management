import { motion } from 'framer-motion';

const LoadingSpinner = ({ 
  size = 'md', 
  text = '', 
  fullScreen = false,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} border-4 border-gray-200 border-t-primary-600 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`${textSizeClasses[size]} text-gray-600 font-medium`}
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50"
      >
        {spinner}
      </motion.div>
    );
  }

  return spinner;
};

export const LoadingDots = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-2 h-2 bg-primary-600 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.2
          }}
        />
      ))}
    </div>
  );
};

export const LoadingPulse = ({ className = '' }) => {
  return (
    <motion.div
      className={`w-12 h-12 bg-primary-600 rounded-full ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.5, 1]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

export const LoadingBar = ({ progress = 0, className = '' }) => {
  return (
    <div className={`w-full h-2 bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <motion.div
        className="h-full bg-gradient-to-r from-primary-600 to-accent-600"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
};

export default LoadingSpinner;
