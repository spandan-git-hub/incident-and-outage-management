import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function LandingHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-white"
        >
          {/* Logo/Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block mb-8"
          >
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-6xl shadow-2xl">
              🎯
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-6xl md:text-7xl font-bold mb-6 drop-shadow-lg"
          >
            Incident & Outage
            <br />
            <span className="text-yellow-300">Management Platform</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto"
          >
            Streamline incident tracking, collaborate in real-time, and resolve issues faster with intelligent automation and powerful analytics.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-purple-600 font-bold text-lg rounded-full shadow-2xl hover:bg-blue-50 transition-colors w-64"
              >
                🚀 Go to Dashboard
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-full hover:bg-white hover:text-purple-600 transition-all w-64"
              >
                🔐 Login
              </motion.button>
            </Link>
          </motion.div>

          {/* Register Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6"
          >
            <p className="text-white/90">
              Don't have an account?{' '}
              <Link to="/register" className="underline font-bold hover:text-yellow-300 transition-colors">
                Register here
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24"
        >
          {[
            {
              icon: '⚡',
              title: 'Real-Time Tracking',
              description: 'Monitor incidents as they happen with live updates and notifications'
            },
            {
              icon: '👥',
              title: 'Team Collaboration',
              description: 'Assign, comment, and resolve incidents together with your team'
            },
            {
              icon: '📊',
              title: 'Advanced Analytics',
              description: 'Gain insights with comprehensive dashboards and reporting'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + index * 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20 shadow-xl"
            >
              <div className="text-6xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-blue-100">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {[
            { label: 'Incidents Managed', value: '10K+' },
            { label: 'Active Users', value: '500+' },
            { label: 'Response Time', value: '<5min' },
            { label: 'Uptime', value: '99.9%' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.2 + index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center border border-white/20"
            >
              <div className="text-4xl font-bold text-yellow-300 mb-2">{stat.value}</div>
              <div className="text-white/80">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="mt-24 text-center text-white/60 pb-8"
        >
          <p>© 2026 Incident & Outage Management Platform. All rights reserved.</p>
        </motion.div>
      </div>
    </div>
  );
}

export default LandingHome;
