import { useState, useEffect, useRef } from 'react';
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
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Prevent background scroll when notification panel is open
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
    const iconMap = {
      assignment: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      status_change: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      incident_created: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      incident_updated: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      comment_added: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    };
    return iconMap[type] || (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    );
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={containerRef}>
      {/* Notification Bell Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={handleOpen}
        className="relative p-2.5 rounded-xl hover:bg-purple-50 transition-all border-2 border-transparent hover:border-purple-200"
        aria-label="Open notifications"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center shadow-lg"
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
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed right-4 top-20 w-[min(420px,calc(100vw-2rem))] max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border-2 border-purple-100"
            >
              {/* Header */}
              <div className="bg-white border-b-2 border-purple-100 p-6 sticky top-0 z-10">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border-2 border-gray-300 flex items-center justify-center shadow-md">
                      <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <p className="text-sm text-gray-600">{unreadCount} unread</p>
                      )}
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg w-9 h-9 flex items-center justify-center transition-all"
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
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Mark all as read
                  </motion.button>
                )}
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(100vh-14rem)] bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full mb-4"
                    />
                    <p className="text-sm text-gray-600 font-medium">Loading notifications...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <EmptyNotifications />
                ) : (
                  <div className="p-3 space-y-2">
                    <AnimatePresence>
                      {notifications.map((notification, index) => (
                        <motion.div
                          key={notification._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: index * 0.03 }}
                          whileHover={{ scale: 1.01 }}
                          className={`bg-white rounded-xl p-4 cursor-pointer transition-all shadow-sm hover:shadow-md border-2 ${
                            !notification.read 
                              ? 'border-purple-200 bg-gradient-to-br from-purple-50/50 to-white' 
                              : 'border-gray-100 hover:border-purple-100'
                          }`}
                          onClick={() => !notification.read && handleMarkAsRead(notification._id)}
                        >
                          <div className="flex gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              !notification.read 
                                ? 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-md' 
                                : 'bg-gradient-to-br from-gray-200 to-gray-300'
                            }`}>
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm leading-relaxed ${
                                notification.read ? 'text-gray-700' : 'text-gray-900 font-semibold'
                              }`}>
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-medium">
                                  {new Date(notification.createdAt).toLocaleString('en-GB', { 
                                    day: '2-digit', 
                                    month: 'short',
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </span>
                              </div>
                              {notification.incidentId && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  <span className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-semibold shadow-sm">
                                    {notification.incidentId.title || 'Incident'}
                                  </span>
                                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${
                                    notification.incidentId.severity === 'critical' 
                                      ? 'bg-gradient-to-br from-red-500 to-red-600 text-white' :
                                    notification.incidentId.severity === 'high' 
                                      ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white' :
                                    notification.incidentId.severity === 'medium' 
                                      ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white' :
                                    'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                                  }`}>
                                    {notification.incidentId.severity.toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                            {!notification.read && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2.5 h-2.5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex-shrink-0 mt-1.5 shadow-md"
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
