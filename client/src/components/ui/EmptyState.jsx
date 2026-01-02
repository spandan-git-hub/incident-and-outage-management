import { motion } from 'framer-motion';
import { scaleVariants, fadeVariants } from '../../utils/animations';

const EmptyState = ({ 
  icon = '📭', 
  title = 'No data available', 
  description = 'There is nothing to display at the moment.',
  action = null,
  className = ''
}) => {
  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}
    >
      <motion.div
        variants={scaleVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="text-7xl mb-6"
      >
        {icon}
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-gray-700 mb-3"
      >
        {title}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-gray-500 text-center max-w-md mb-6"
      >
        {description}
      </motion.p>
      
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
};

// Specific empty state variants
export const EmptyIncidents = ({ onCreateClick }) => (
  <EmptyState
    icon="🎫"
    title="No Incidents Found"
    description="Get started by creating your first incident to track and manage issues effectively."
    action={
      onCreateClick && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreateClick}
          className="btn-primary"
        >
          ✨ Create First Incident
        </motion.button>
      )
    }
  />
);

export const EmptyNotifications = () => (
  <EmptyState
    icon="🔔"
    title="All Caught Up!"
    description="You have no new notifications. We'll notify you when something important happens."
  />
);

export const EmptyComments = () => (
  <EmptyState
    icon="💬"
    title="No Comments Yet"
    description="Be the first to add a comment and start the conversation."
    className="py-8"
  />
);

export const EmptySearch = () => (
  <EmptyState
    icon="🔍"
    title="No Results Found"
    description="Try adjusting your search terms or filters to find what you're looking for."
  />
);

export const EmptyAssignments = () => (
  <EmptyState
    icon="👥"
    title="No Assignments"
    description="No incidents have been assigned to operators yet."
    className="py-8"
  />
);

export default EmptyState;
