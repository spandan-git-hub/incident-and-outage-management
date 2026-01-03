import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LandingHome() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: '🎫',
      title: 'Incident Tracking',
      description: 'Create, track, and manage incidents with comprehensive details including severity levels and status workflows',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: '👥',
      title: 'Smart Assignment',
      description: 'Manual selection or automated round-robin distribution to balance workload across operators',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: '🔄',
      title: 'Status Workflow',
      description: 'Five-stage lifecycle: Open → Acknowledged → In-Progress → Resolved → Closed',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: '🔔',
      title: 'Real-Time Notifications',
      description: 'Instant alerts for incident creation, assignments, status updates, and new comments',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: '💬',
      title: 'Team Collaboration',
      description: 'Comment on incidents with automatic notifications to reporters, operators, and admins',
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Visual insights with charts tracking trends, severity distribution, and operator performance',
      color: 'from-teal-500 to-teal-600'
    }
  ];

  const roles = [
    {
      name: 'Admin',
      icon: '👑',
      color: 'bg-red-500',
      permissions: [
        'Full system access and control',
        'Create, update, delete incidents',
        'Assign incidents to operators',
        'View complete audit history'
      ]
    },
    {
      name: 'Operator',
      icon: '⚙️',
      color: 'bg-blue-500',
      permissions: [
        'Create and manage incidents',
        'Update assigned incidents',
        'Change status and add comments',
        'View operator dashboard'
      ]
    },
    {
      name: 'Viewer',
      icon: '👁️',
      color: 'bg-green-500',
      permissions: [
        'Read-only access to incidents',
        'View incident details and history',
        'Monitor dashboard analytics',
        'No modification rights'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block mb-6"
          >
            <div className="text-7xl">🚨</div>
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Incident & Outage
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent pb-2">
              Management Platform
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Track, assign, and resolve incidents efficiently with role-based access control,
            automated workflows, and real-time notifications
          </p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            {isAuthenticated ? (
              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-purple-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Go to Dashboard →
                </motion.button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-purple-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Sign In
                  </motion.button>
                </Link>
                <Link to="/register" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-purple-600 px-10 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl border-2 border-purple-600"
                  >
                    Get Started
                  </motion.button>
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-3xl mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Role System */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Three-Tier Role System
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Hierarchical access control designed for efficient incident management
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <motion.div
                key={role.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 + index * 0.15 }}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${role.color} rounded-xl flex items-center justify-center text-2xl`}>
                      {role.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{role.name}</h3>
                  </div>
                </div>
                <ul className="space-y-3">
                  {role.permissions.map((permission, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>{permission}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white shadow-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Streamline Your Incident Management?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join teams using our platform for efficient, collaborative incident resolution
            </p>
            <Link to="/register" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-600 px-10 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg"
              >
                Create Your Account
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default LandingHome;
