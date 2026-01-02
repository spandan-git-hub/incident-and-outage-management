// Framer Motion Animation Variants

// Page Transitions
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { 
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

// Modal/Dialog Transitions
export const modalVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9,
    transition: { duration: 0.2 }
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: { duration: 0.2 }
  }
};

// Overlay Transitions
export const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

// Card/Item Stagger
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

// Slide from side
export const slideInVariants = {
  left: {
    hidden: { x: -100, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  },
  right: {
    hidden: { x: 100, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  },
  top: {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  },
  bottom: {
    hidden: { y: 100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  }
};

// Fade transitions
export const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

// Scale transitions (for buttons, icons)
export const scaleVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  }
};

// Hover animations
export const hoverScale = {
  scale: 1.05,
  transition: { duration: 0.2 }
};

export const hoverLift = {
  y: -5,
  transition: { duration: 0.2 }
};

export const hoverGlow = {
  boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)",
  transition: { duration: 0.2 }
};

// Tap animations
export const tapScale = {
  scale: 0.95,
  transition: { duration: 0.1 }
};

// Toast/Notification animations
export const toastVariants = {
  hidden: { 
    opacity: 0, 
    y: 50, 
    scale: 0.8,
    transition: { duration: 0.2 }
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: { 
    opacity: 0, 
    x: 100, 
    scale: 0.8,
    transition: { duration: 0.3 }
  }
};

// List item animations
export const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (index) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.05,
      duration: 0.3
    }
  })
};

// Skeleton loading shimmer
export const shimmerVariants = {
  initial: { backgroundPosition: "-200% 0" },
  animate: {
    backgroundPosition: "200% 0",
    transition: {
      duration: 2,
      ease: "linear",
      repeat: Infinity
    }
  }
};
