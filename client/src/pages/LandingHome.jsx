import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LandingHome() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: 'clipboard',
      title: 'Incident Tracking',
      description: 'Centralized incident management with detailed metadata, severity classification, and complete lifecycle tracking from detection to resolution',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: 'users',
      title: 'Intelligent Assignment',
      description: 'Flexible incident routing with manual assignment or automated round-robin distribution to optimize team workload and response times',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: 'workflow',
      title: 'Status Workflow',
      description: 'Structured five-stage lifecycle progression: Open → Acknowledged → In-Progress → Resolved → Closed for systematic resolution',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: 'bell',
      title: 'Real-Time Notifications',
      description: 'Instant push notifications for incident creation, assignment updates, status changes, and team communication across all devices',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: 'chat',
      title: 'Team Collaboration',
      description: 'Threaded incident comments with automatic notifications to stakeholders, ensuring seamless communication throughout resolution',
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      icon: 'chart',
      title: 'Analytics Dashboard',
      description: 'Comprehensive visual insights with trend analysis, severity distribution metrics, and operator performance tracking for data-driven decisions',
      color: 'from-teal-500 to-teal-600'
    }
  ];

  const roles = [
    {
      name: 'Admin',
      icon: 'shield',
      color: 'bg-red-500',
      permissions: [
        'Complete system administration and configuration',
        'Full CRUD operations on all incidents',
        'User management and role assignment',
        'Access to comprehensive audit trails and logs'
      ]
    },
    {
      name: 'Operator',
      icon: 'tool',
      color: 'bg-blue-500',
      permissions: [
        'Create and manage incident records',
        'Update status on assigned incidents',
        'Add comments and collaborate with team',
        'Access to operator-specific analytics'
      ]
    },
    {
      name: 'Viewer',
      icon: 'eye',
      color: 'bg-green-500',
      permissions: [
        'Read-only access to incident database',
        'View detailed incident information and history',
        'Monitor real-time dashboard metrics',
        'No modification or administrative privileges'
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

        {/* Benefit Cards - No Heading */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Rapid Response Time</h3>
              <p className="text-gray-600 leading-relaxed">Automated incident routing and instant notifications ensure your team takes action within seconds of detection</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Deploy in Minutes</h3>
              <p className="text-gray-600 leading-relaxed">Pre-configured workflows and intuitive interface let you start managing incidents immediately without complex setup</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Full Transparency</h3>
              <p className="text-gray-600 leading-relaxed">Real-time analytics and status tracking provide complete visibility into incident lifecycle and team performance</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Everything You Need Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">
            Everything You Need
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto text-lg">
            Powerful features designed for modern incident management teams
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border-l-4 border-transparent hover:border-purple-500"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                    {feature.icon === 'clipboard' && (
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    )}
                    {feature.icon === 'users' && (
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    )}
                    {feature.icon === 'workflow' && (
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    )}
                    {feature.icon === 'bell' && (
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    )}
                    {feature.icon === 'chat' && (
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    )}
                    {feature.icon === 'chart' && (
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Role System */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">
            Built for Teams of All Sizes
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto text-lg">
            Role-based access control that scales with your organization
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((role, index) => (
              <motion.div
                key={role.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all"
              >
                <div className={`w-14 h-14 ${role.color === 'bg-red-500' ? 'bg-gradient-to-br from-red-500 to-red-600' : role.color === 'bg-blue-500' ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-green-500 to-green-600'} rounded-xl flex items-center justify-center mb-5`}>
                  {role.icon === 'shield' && (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  )}
                  {role.icon === 'tool' && (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {role.icon === 'eye' && (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{role.name}</h3>
                <ul className="space-y-2">
                  {role.permissions.map((permission, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600">
                      <span className="text-purple-500 mt-1.5">•</span>
                      <span className="leading-relaxed">{permission}</span>
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
              Ready to Transform Your Incident Response?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Start managing incidents like a pro in minutes
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
