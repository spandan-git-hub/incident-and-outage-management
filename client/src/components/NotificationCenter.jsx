import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { EmptyNotifications } from './ui/EmptyState';
import { slideInVariants, scaleVariants } from '../utils/animations';

function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/notifications/unread/count`);
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/notifications`);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    fetchNotifications();
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/notifications/${notificationId}/read`);
      setNotifications(notifications.map(n => 
        n._id === notificationId ? { ...n, read: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.patch(`${API_BASE_URL}/api/notifications/read-all`);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      assignment: '👤',
      status_change: '🔄',
      incident_created: '🆕',
      incident_updated: '✏️',
      comment_added: '💬'
    };
    return icons[type] || '📢';
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleOpen}
        className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
        aria-label="Open notifications"
      >
        <motion.span 
          animate={{ rotate: unreadCount > 0 ? [0, -15, 15, -10, 10, 0] : 0 }}
          transition={{ duration: 0.5, repeat: unreadCount > 0 ? Infinity : 0, repeatDelay: 3 }}
          className="text-2xl block"
        >
          🔔
        </motion.span>
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              variants={scaleVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center shadow-lg"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              variants={slideInVariants.right}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed right-4 top-20 w-[min(400px,90vw)] max-h-[80vh] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-200"
            >
              {/* Header */}
              <div className="bg-gray-900 text-white p-5 sticky top-0 z-10">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🔔</span>
                    <h3 className="text-lg font-bold">Notifications</h3>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                    aria-label="Close notifications"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
                {unreadCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-white/90 hover:text-white underline font-medium"
                  >
                    ✓ Mark all as read
                  </motion.button>
                )}
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(80vh-100px)] scrollbar-thin">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 border-3 border-gray-300 border-t-primary-600 rounded-full mb-3"
                    />
                    <p className="text-sm">Loading notifications...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <EmptyNotifications />
                ) : (
                  <div className="divide-y divide-gray-100">
                    <AnimatePresence>
                      {notifications.map((notification, index) => (
                        <motion.div
                          key={notification._id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className={`p-4 cursor-pointer transition-all hover:bg-gray-50 ${
                            !notification.read ? 'bg-blue-50/50' : 'bg-white'
                          }`}
                          onClick={() => !notification.read && handleMarkAsRead(notification._id)}
                        >
                          <div className="flex gap-3">
                            <motion.span 
                              whileHover={{ scale: 1.2, rotate: 10 }}
                              className="text-2xl flex-shrink-0"
                            >
                              {getNotificationIcon(notification.type)}
                            </motion.span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${notification.read ? 'text-gray-700' : 'text-gray-900 font-semibold'}`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <span>🕒</span>
                                {new Date(notification.createdAt).toLocaleString('en-GB', { 
                                  day: '2-digit', 
                                  month: '2-digit', 
                                  year: 'numeric', 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                              {notification.incidentId && (
                                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md font-medium">
                                    {notification.incidentId.title || 'Incident'}
                                  </span>
                                  <span className={`px-2 py-1 rounded-md font-medium ${
                                    notification.incidentId.severity === 'critical' ? 'bg-red-100 text-red-700' :
                                    notification.incidentId.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                                    notification.incidentId.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-blue-100 text-blue-700'
                                  }`}>
                                    {notification.incidentId.severity}
                                  </span>
                                </div>
                              )}
                            </div>
                            {!notification.read && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-1"
                              />
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NotificationCenter;
