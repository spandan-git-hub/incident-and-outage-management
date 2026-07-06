import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import NotificationCenter from './NotificationCenter';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavLink = ({ to, children, iconPath }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className="relative group"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`px-4 py-2.5 text-sm font-semibold transition-colors duration-200 flex items-center gap-2.5 ${
            isActive
              ? 'text-purple-700'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {iconPath && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
            </svg>
          )}
          <span>{children}</span>
        </motion.div>
        {isActive && (
          <motion.div
            layoutId="navbar-indicator"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </Link>
    );
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="group ml-8">
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3.5 px-4 py-2.5 bg-white border-2 border-purple-200 rounded-lg group-hover:border-purple-300 group-hover:shadow-md transition-all"
            >
              <span className="text-2xl">🚨</span>
              <span className="hidden sm:block text-lg font-bold text-gray-900 tracking-tight">
                AEGIS : Incident Manager
              </span>
            </motion.div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" iconPath="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">Dashboard</NavLink>
                <NavLink to="/incidents" iconPath="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01">Incidents</NavLink>
                
                <div className="ml-1">
                  <NotificationCenter />
                </div>
                
                {/* User Menu */}
                <div className="ml-2 flex items-center gap-3 pl-4 border-l border-gray-200">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2.5 px-3 py-2 bg-white rounded-lg border border-purple-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900 leading-tight">
                        {user?.name}
                      </span>
                      <span className="text-xs text-gray-500 capitalize leading-tight">
                        {user?.role}
                      </span>
                    </div>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={logout}
                    className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </motion.button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(168, 85, 247, 0.25)" }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-md transition-all duration-200"
                  >
                    Get Started
                  </motion.button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.path
                    key="close"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    exit={{ pathLength: 0 }}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <motion.path
                    key="menu"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    exit={{ pathLength: 0 }}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </AnimatePresence>
            </svg>
          </motion.button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Link 
                      to="/dashboard" 
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span>Dashboard</span>
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    <Link 
                      to="/incidents" 
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      <span>Incidents</span>
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="border-t border-gray-200 pt-3 mt-3"
                  >
                    <div className="flex items-center gap-3 px-4 py-3 mb-3 bg-white rounded-lg border border-purple-200">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">{user?.name}</span>
                        <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => { logout(); setMobileMenuOpen(false); }} 
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Link 
                      to="/login" 
                      className="block px-4 py-3 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-center" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    <Link 
                      to="/register" 
                      className="block px-4 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-md transition-all text-center" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
