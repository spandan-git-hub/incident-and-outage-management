import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center max-w-4xl mx-auto"
    >
      <motion.h1 
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="text-5xl font-bold text-gray-800 mb-4"
      >
        Welcome to Incident & Outage Management
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-xl text-gray-600 mb-8"
      >
        Manage incidents and outages efficiently with real-time tracking and collaboration
      </motion.p>
      
      {isAuthenticated ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-8"
          >
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-2xl font-bold mb-2">Dashboard</h3>
            <p className="mb-4 text-blue-100">View analytics and insights</p>
            <Link 
              to="/dashboard"
              className="inline-block bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition"
            >
              Go to Dashboard
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-8"
          >
            <div className="text-5xl mb-4">🎫</div>
            <h3 className="text-2xl font-bold mb-2">Incidents</h3>
            <p className="mb-4 text-purple-100">Manage and track incidents</p>
            <Link 
              to="/incidents"
              className="inline-block bg-white text-purple-600 px-6 py-2 rounded-lg hover:bg-purple-50 transition"
            >
              View Incidents
            </Link>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-x-4"
        >
          <Link 
            to="/login"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
          <Link 
            to="/register"
            className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Register
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Home;
