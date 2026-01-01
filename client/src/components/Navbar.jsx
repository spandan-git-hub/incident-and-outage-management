import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConnectionStatus from './ConnectionStatus';
import NotificationCenter from './NotificationCenter';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold flex items-center space-x-2"
          >
            <span className="text-2xl">🎯</span>
            <span>Incident Management</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center space-x-6"
          >
            <ConnectionStatus />
            
            <Link to="/" className="hover:text-blue-200 transition-colors">
              🏠 Home
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="hover:text-blue-200 transition-colors">
                  📊 Dashboard
                </Link>
                <Link to="/incidents" className="hover:text-blue-200 transition-colors">
                  🎫 Incidents
                </Link>
              </>
            )}
            
            {isAuthenticated ? (
              <>
                <NotificationCenter />
                <span className="text-sm bg-white/20 px-3 py-1 rounded">
                  {user?.name} ({user?.role})
                </span>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition-colors">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
